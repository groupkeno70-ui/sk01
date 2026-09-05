// @ts-nocheck
import { useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { api } from "../lib/api";
import { WinCelebration } from "./shared";
import { PlayingCard } from "./teenpatti/FlipCard";
import CasinoChip from "./teenpatti/CasinoChip";
import DrinkStall from "./teenpatti/DrinkStall";
import DrinkStallsBoard from "./teenpatti/DrinkStallsBoard";
import CenterMultiplierWithCountdown from "./teenpatti/CenterMultiplierWithCountdown";
import { teenPattiAudio } from "./teenpatti/TeenPattiSoundEngine";
import FireworksCelebration from "./teenpatti/FireworksCelebration";
import { RulesModal, HistoryModal, RankingModal, SettingsModal } from "./teenpatti/TeenPattiModals";
import TeenPattiGameHistoryModal from "./teenpatti/TeenPattiGameHistoryModal";
import RoundResultPopup from "./teenpatti/RoundResultPopup";
import { emitGameWin } from "../components/TopGameWinnerBanner";
import { Wifi, Undo2, Music, HelpCircle, FileText, Users } from "lucide-react";
import { RedCocktailFlanDrink } from "./teenpatti/DrinkIllustrations";

// ─── Types ────────────────────────────────────────────────────────────────────
type HandKey = "A" | "B" | "C";
type Phase = "idle" | "betting" | "locked" | "revealing" | "payout" | "finished";

interface ServerTable {
  id?: number;
  table_no: string; // "1" | "2" | "3"
  card_1: { suit: string; rank: string | number; value?: number } | null;
  card_2: { suit: string; rank: string | number; value?: number } | null;
  card_3: { suit: string; rank: string | number; value?: number } | null;
  hand_rank?: string | null;
  rank?: 1 | 2 | 3 | null;
  multiplier?: number;
  pot_total?: number;
  mine?: number;
  is_winner?: boolean;
}

interface GameStatePayload {
  round: { id: number; round_number: number; status: string; bet_ends_at?: string } | null;
  tables: ServerTable[];
  phase: Phase;
  countdown: number;
  onlinePlayers: number;
}

type FlyingChip = {
  id: number;
  target: HandKey;
  amount: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
};

type Props = {
  balance?: number;
  onBalance?: (balance: number) => void;
  onBalanceChange?: (balance: number) => void;
  onClose?: () => void;
};

// ─── Suit & Rank Mapping ──────────────────────────────────────────────────────
const TABLE_KEY_MAP: Record<string, HandKey> = { "1": "A", "2": "B", "3": "C", A: "A", B: "B", C: "C" };
const HAND_KEY_TO_NO: Record<HandKey, string> = { A: "1", B: "2", C: "3" };
const SUIT_MAP: Record<string, "♠" | "♥" | "♦" | "♣"> = {
  S: "♠", H: "♥", D: "♦", C: "♣",
  "♠": "♠", "♥": "♥", "♦": "♦", "♣": "♣",
};
const RANK_LABELS: Record<string | number, string> = {
  1: "A", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", 10: "10",
  11: "J", 12: "Q", 13: "K", 14: "A",
  "1": "A", "2": "2", "3": "3", "4": "4", "5": "5", "6": "6", "7": "7", "8": "8", "9": "9", "10": "10",
  "11": "J", "12": "Q", "13": "K", "14": "A",
  J: "J", Q: "Q", K: "K", A: "A",
};

function serverCardToPlayingCard(c: any): PlayingCard | null {
  if (!c) return null;
  const rawRank = c.rank ?? c.value ?? "2";
  const rankStr = RANK_LABELS[rawRank] || String(rawRank);
  const suitKey = String(c.suit || "S").toUpperCase();
  const suitStr = SUIT_MAP[suitKey] || "♠";
  return { rank: rankStr, suit: suitStr };
}

// Exact match cards for the screenshots
const DEFAULT_DEMO_CARDS: Record<string, PlayingCard[]> = {
  "1": [{ rank: "K", suit: "♠" }, { rank: "10", suit: "♦" }, { rank: "9", suit: "♣" }],
  "2": [{ rank: "10", suit: "♥" }, { rank: "4", suit: "♥" }, { rank: "7", suit: "♠" }],
  "3": [{ rank: "6", suit: "♠" }, { rank: "10", suit: "♣" }, { rank: "A", suit: "♠" }],
};

function buildHandCards(table?: ServerTable, tableNo = "1"): PlayingCard[] {
  if (!table) return DEFAULT_DEMO_CARDS[tableNo] || [];
  const c1 = serverCardToPlayingCard(table.card_1);
  const c2 = serverCardToPlayingCard(table.card_2);
  const c3 = serverCardToPlayingCard(table.card_3);
  const fallback = DEFAULT_DEMO_CARDS[tableNo] || [];
  return [c1 || fallback[0], c2 || fallback[1], c3 || fallback[2]];
}

const formatCompactBalance = (num: number): string => {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
  return `${num}`;
};

const SOCKET_URL = (import.meta as any).env?.VITE_SOCKET_URL || "https://168.144.140.4.nip.io";
const TEEN_PATTI_BALANCE_ENDPOINT = "/api/games/teenpatti/balance";

// ─── Main Component ──────────────────────────────────────────────────────────
export default function TeenPattiGame({
  balance: balanceProp,
  onBalance,
  onBalanceChange,
  onClose,
}: Props) {
  // ── Authenticated User State ──
  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const stored = localStorage.getItem("sk_love_user") || localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // ── Balance State ──
  const [balance, setBalance] = useState<number>(balanceProp ?? 3140000000);
  const balanceRef = useRef<number>(balance);
  balanceRef.current = balance;

  const pushBalance = useCallback(
    (bal: number) => {
      setBalance(bal);
      balanceRef.current = bal;
      onBalance?.(bal);
      onBalanceChange?.(bal);
    },
    [onBalance, onBalanceChange]
  );

  useEffect(() => {
    if (typeof balanceProp === "number" && balanceProp > 0) {
      setBalance(balanceProp);
      balanceRef.current = balanceProp;
    }
  }, [balanceProp]);

  // ── Server Game State ──
  const [phase, setPhase] = useState<Phase>("betting");
  const [countdown, setCountdown] = useState<number>(12);
  const [tables, setTables] = useState<ServerTable[]>([
    { table_no: "1", pot_total: 3000, card_1: { rank: "K", suit: "♠" }, card_2: { rank: "10", suit: "♦" }, card_3: { rank: "9", suit: "♣" } },
    { table_no: "2", pot_total: 2200, card_1: { rank: "10", suit: "♥" }, card_2: { rank: "4", suit: "♥" }, card_3: { rank: "7", suit: "♠" } },
    { table_no: "3", pot_total: 1200, card_1: { rank: "6", suit: "♠" }, card_2: { rank: "10", suit: "♣" }, card_3: { rank: "A", suit: "♠" } },
  ]);
  const tablesRef = useRef<ServerTable[]>(tables);
  tablesRef.current = tables;

  const [roundId, setRoundId] = useState<number | null>(null);
  const [roundNumber, setRoundNumber] = useState<number>(101);
  const [onlinePlayers, setOnlinePlayers] = useState<number>(0);
  const [ping, setPing] = useState<number>(38);
  const [revealed, setRevealed] = useState<boolean>(false);
  const [winnerNo, setWinnerNo] = useState<string | null>(null);

  // ── User Bet State ──
  const [heldChip, setHeldChip] = useState<number>(500);
  const [pendingBets, setPendingBets] = useState<Record<HandKey, number>>({ A: 0, B: 0, C: 0 });
  const pendingBetsRef = useRef<Record<HandKey, number>>({ A: 0, B: 0, C: 0 });
  pendingBetsRef.current = pendingBets;

  const [lastBets, setLastBets] = useState<Record<HandKey, number>>({ A: 0, B: 0, C: 0 });
  const [autoBet, setAutoBet] = useState<boolean>(false);
  const [flyingChips, setFlyingChips] = useState<FlyingChip[]>([]);

  // ── Win / Loss Presentation ──
  const [win, setWin] = useState<{ amount: number; show: boolean }>({ amount: 0, show: false });
  const [floatingWinText, setFloatingWinText] = useState<string | null>(null);
  const [historyList, setHistoryList] = useState<any[]>([]);

  // ── Modals & Controls ──
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [bgmEnabled, setBgmEnabled] = useState<boolean>(false);
  const [openRules, setOpenRules] = useState<boolean>(false);
  const [openHistory, setOpenHistory] = useState<boolean>(false);
  const [openGameHistoryModal, setOpenGameHistoryModal] = useState<boolean>(false);
  const [openRanking, setOpenRanking] = useState<boolean>(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(true);

  // ── Round Result Popup ──
  const [showResultPopup, setShowResultPopup] = useState<boolean>(false);
  const [resultPayload, setResultPayload] = useState<{ tables: any[]; winnerNo: string; payout: number } | null>(null);

  const socketRef = useRef<Socket | null>(null);

  // ── Fetch authenticated user and the Teen Patti wallet balance ──
  useEffect(() => {
    (async () => {
      try {
        const res: any = await api.get("/api/me");
        const u = res?.user || res?.data?.user || res?.data;
        if (u && (u.id || u.name)) {
          setCurrentUser(u);
        }
      } catch {}

      try {
        const res2: any = await api.get(TEEN_PATTI_BALANCE_ENDPOINT);
        const rawBalance = res2?.balance ?? res2?.coins ?? res2?.data?.balance ?? res2?.data?.coins;
        const liveBalance = typeof rawBalance === "string" ? Number(rawBalance) : rawBalance;
        if (typeof liveBalance === "number" && Number.isFinite(liveBalance)) {
          pushBalance(liveBalance);
        }
      } catch {}
    })();
  }, [pushBalance]);

  const [leaderboardList, setLeaderboardList] = useState<any[]>([]);

  // ── Fetch Recent History & Real DB Leaderboard on Mount ──
  useEffect(() => {
    (async () => {
      try {
        const res: any = await api.get("/api/games/teenpatti/recent-history");
        if (res?.data && Array.isArray(res.data)) {
          setHistoryList(res.data);
        }
      } catch {}

      try {
        const res2: any = await api.get("/api/games/teenpatti/leaderboard");
        const list = res2?.data?.data || res2?.data;
        if (Array.isArray(list)) {
          setLeaderboardList(list);
        }
      } catch {}
    })();
  }, []);

  const pushBalanceRef = useRef(pushBalance);
  pushBalanceRef.current = pushBalance;
  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;
  const currentUserRef = useRef(currentUser);
  currentUserRef.current = currentUser;

  // ── Connect to Socket.io Server ───────────────────────────────────────────
  useEffect(() => {
    const token =
      localStorage.getItem("sk_love_token") ||
      localStorage.getItem("auth_token") ||
      localStorage.getItem("token") ||
      sessionStorage.getItem("sk_love_token");

    const startPing = Date.now();
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      path: "/socket.io/",
      secure: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 30,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      setPing(Math.max(28, Date.now() - startPing));

      const rawUser = localStorage.getItem("sk_love_user") || localStorage.getItem("user");
      let storedUser = null;
      try {
        storedUser = rawUser ? JSON.parse(rawUser) : null;
      } catch {}

      socket.emit("auth", { token: token || "guest_token", user: storedUser || currentUserRef.current });
      socket.emit("game:request_state");
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    // ── Full Game State Update ──
    socket.on("game:state", (data: GameStatePayload) => {
      if (!data) return;
      applyGameState(data);
    });

    // ── Phase / Countdown Update ──
    socket.on("game:countdown", ({ phase: p, countdown: c }: { phase: Phase; countdown: number }) => {
      setPhase(p);
      setCountdown(c);
      if (p === "betting" && soundEnabledRef.current && c === 3) {
        teenPattiAudio.playWarningBeep(c);
      }
    });

    // ── Round Started ──
    socket.on("round_started", (data: any) => {
      setPhase("betting");
      setCountdown(data?.seconds_left || 15);
      setRevealed(false);
      setWinnerNo(null);
      setPendingBets({ A: 0, B: 0, C: 0 });
      pendingBetsRef.current = { A: 0, B: 0, C: 0 };
      setWin({ amount: 0, show: false });
      setFloatingWinText(null);
      if (data?.round_number) setRoundNumber(data.round_number);
      if (data?.round_id) setRoundId(data.round_id);
      if (data?.tables) setTables(data.tables);
    });

    // ── Bets Locked ──
    socket.on("bets_locked", () => {
      setPhase("locked");
      setCountdown(2);
    });

    // ── Cards Revealed ──
    socket.on("cards_revealed", (data: any) => {
      setPhase("revealing");
      setRevealed(true);
      if (data?.tables) setTables(data.tables);
      if (data?.winning_table_no) setWinnerNo(String(data.winning_table_no));
    });

    // ── Individual Card Reveal Sequence ──
    socket.on("game:card_reveal", ({ tableNo, card1, card2, card3, handRank, rank }) => {
      setRevealed(true);
      setPhase("revealing");
      setTables((prev) =>
        prev.map((t) =>
          String(t.table_no) === String(tableNo)
            ? { ...t, card_1: card1 || t.card_1, card_2: card2, card_3: card3, hand_rank: handRank, rank: rank || t.rank }
            : t
        )
      );
    });

    // ── Payout Results ──
    socket.on("game:payout", ({ tables: payoutTables, winningTable, multiplier }) => {
      const winTable = String(winningTable);
      setWinnerNo(winTable);
      setRevealed(true);
      setPhase("payout");
      if (payoutTables) setTables(payoutTables);
      handlePayout(winTable, Number(multiplier || 2.9));

      setTimeout(() => {
        const myBets = pendingBetsRef.current;
        const winKey = TABLE_KEY_MAP[winTable] || "A";
        const myBetOnWin = myBets[winKey] ?? 0;
        const myPayout = myBetOnWin > 0 ? Math.round(myBetOnWin * Number(multiplier || 2.9)) : 0;
        setResultPayload({
          tables: payoutTables || tablesRef.current,
          winnerNo: winTable,
          payout: myPayout,
        });
        setShowResultPopup(true);
      }, 1500);
    });

    // ── Live Player Count & Activity ──
    socket.on("game:online_players", ({ count }: { count: number }) => {
      setOnlinePlayers(count);
    });

    socket.on("game:bet_activity", (data: any) => {
      if (data?.tableNo && data?.pot_total) {
        setTables((prev) =>
          prev.map((t) => (String(t.table_no) === String(data.tableNo) ? { ...t, pot_total: data.pot_total } : t))
        );
      }
    });

    // ── Balance Sync ──
    socket.on("balance:update", (data: any) => {
      const newBal = data?.balance ?? data?.coins ?? data?.diamonds;
      if (typeof newBal === "number") pushBalanceRef.current(newBal);
    });

    socket.on("bet_won", (data: any) => {
      if (data?.payout) {
        setWin({ amount: data.payout, show: true });
        setFloatingWinText(`+${data.payout.toLocaleString()}`);
        if (soundEnabledRef.current) teenPattiAudio.playWin();
        emitGameWin({ amount: data.payout, game: "Teen Patti" });
      }
      if (typeof data?.new_balance === "number") {
        pushBalanceRef.current(data.new_balance);
      }
    });

    socket.on("bet:success", (data: any) => {
      const newBal = data?.data?.new_balance ?? data?.new_balance ?? data?.balance;
      if (typeof newBal === "number") pushBalanceRef.current(newBal);
    });

    socket.on("bet:error", ({ message }: { message: string }) => {
      toast.error(message || "Bet failed");
    });

    socket.on("auth:success", ({ user }: any) => {
      if (!user) return;
      setCurrentUser(user);

      const walletBalance = Number(user.balance ?? user.coins ?? user.diamonds);
      if (Number.isFinite(walletBalance)) {
        pushBalanceRef.current(walletBalance);
      }
    });

    socket.on("auth:error", ({ message }: { message?: string }) => {
      setConnected(false);
      toast.error(message || "Wallet authentication failed");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // ─── Apply Game State Snapshot ───────────────────────────────────────────
  const prevPhaseRef = useRef<Phase>("idle");
  const applyGameState = useCallback(
    (data: GameStatePayload) => {
      const prevPhase = prevPhaseRef.current;
      const newPhase = data.phase || "betting";

      setPhase(newPhase);
      setCountdown(data.countdown ?? 0);
      setOnlinePlayers(data.onlinePlayers ?? 0);

      if (data.tables?.length) setTables(data.tables);
      if (data.round) {
        setRoundId(data.round.id);
        setRoundNumber(data.round.round_number);
      }

      if (prevPhase !== newPhase) {
        prevPhaseRef.current = newPhase;

        if (newPhase === "betting") {
          setRevealed(false);
          setWinnerNo(null);
          setPendingBets({ A: 0, B: 0, C: 0 });
          pendingBetsRef.current = { A: 0, B: 0, C: 0 };
          setWin({ amount: 0, show: false });
          setFloatingWinText(null);

          // Auto-Bet Logic
          if (autoBet && (lastBets.A > 0 || lastBets.B > 0 || lastBets.C > 0)) {
            const total = lastBets.A + lastBets.B + lastBets.C;
            if (balanceRef.current >= total) {
              setPendingBets({ ...lastBets });
              pendingBetsRef.current = { ...lastBets };
              (Object.keys(lastBets) as HandKey[]).forEach((k) => {
                if (lastBets[k] > 0) {
                  placeBetOnServer(k, lastBets[k]);
                }
              });
            }
          }
        }

        if (newPhase === "revealing" || newPhase === "payout") {
          setRevealed(true);
        }
      }
    },
    [autoBet, lastBets]
  );

  // ─── Handle Round Payout ─────────────────────────────────────────────────
  const handlePayout = useCallback(
    (winTableNo: string, mult: number) => {
      const winKey = (TABLE_KEY_MAP[winTableNo] || "A") as HandKey;
      const myBets = pendingBetsRef.current;
      const myBetOnWinner = myBets[winKey] ?? 0;
      const payout = myBetOnWinner > 0 ? Math.round(myBetOnWinner * mult) : 0;
      const totalBet = myBets.A + myBets.B + myBets.C;

      if (totalBet > 0) setLastBets({ ...myBets });

      if (payout > 0) {
        setWin({ amount: payout, show: true });
        setFloatingWinText(`+${payout.toLocaleString()}`);
        if (soundEnabled) teenPattiAudio.playWin();
        emitGameWin({ amount: payout, game: "Teen Patti" });
      } else if (totalBet > 0) {
        setFloatingWinText(`-${totalBet.toLocaleString()}`);
        if (soundEnabled) teenPattiAudio.playLose();
      }

      // Add to session history
      const winTable = tablesRef.current.find((t) => String(t.table_no) === String(winTableNo));
      setHistoryList((prev) => [
        {
          round: roundNumber,
          winner: winKey,
          handName: winTable?.hand_rank || "Single",
          userWon: payout > 0,
          payout,
        },
        ...prev.slice(0, 19),
      ]);

      setTimeout(() => {
        setFloatingWinText(null);
        setWin({ amount: 0, show: false });
      }, 4000);
    },
    [roundNumber, soundEnabled]
  );

  // ─── Place Bet Helper ────────────────────────────────────────────────────
  const placeBetOnServer = (k: HandKey, amount: number) => {
    const tableNo = HAND_KEY_TO_NO[k];
    const tableObj = tablesRef.current.find((t) => String(t.table_no) === String(tableNo));
    const token =
      localStorage.getItem("sk_love_token") ||
      localStorage.getItem("auth_token") ||
      localStorage.getItem("token") ||
      sessionStorage.getItem("sk_love_token");

    if (socketRef.current?.connected) {
      socketRef.current.emit("game:place_bet", {
        tableId: tableObj?.id,
        tableNo,
        amount,
        token,
      });
    } else {
      toast.error("Game server is offline");
    }
  };

  const placeBet = useCallback(
    (k: HandKey) => {
      if (phase !== "betting") {
        toast.error("Betting is closed for this round");
        return;
      }
      if (!heldChip) {
        toast.info("Select a chip first");
        return;
      }
      if (balanceRef.current <= 0 || heldChip > balanceRef.current) {
        toast.error("Not enough balance!");
        return;
      }

      // Chip fly animation
      const chipId = Date.now() + Math.random();
      const positions: Record<HandKey, number> = { A: 0.2, B: 0.5, C: 0.8 };
      setFlyingChips((prev) => [
        ...prev,
        {
          id: chipId,
          target: k,
          amount: heldChip,
          startX: window.innerWidth * 0.5,
          startY: window.innerHeight - 60,
          targetX: window.innerWidth * positions[k],
          targetY: window.innerHeight * 0.55,
        },
      ]);
      setTimeout(() => {
        setFlyingChips((prev) => prev.filter((c) => c.id !== chipId));
      }, 650);

      setPendingBets((p) => {
        const next = { ...p, [k]: p[k] + heldChip };
        pendingBetsRef.current = next;
        return next;
      });

      if (soundEnabled) teenPattiAudio.playChip();

      placeBetOnServer(k, heldChip);
    },
    [phase, heldChip, soundEnabled]
  );

  // ─── Computed UI Metrics ─────────────────────────────────────────────────
  const totalUserBet = pendingBets.A + pendingBets.B + pendingBets.C;
  const totalPot = tables.reduce((sum, t) => sum + (t.pot_total || 0), 0) + totalUserBet;

  const getCards = (tableNo: string): PlayingCard[] => {
    const t = tables.find((item) => String(item.table_no) === String(tableNo));
    return buildHandCards(t, tableNo);
  };

  const getPot = (tableNo: string): number => {
    const t = tables.find((item) => String(item.table_no) === String(tableNo));
    const key = (TABLE_KEY_MAP[tableNo] || "A") as HandKey;
    const defaultPots: Record<string, number> = {
      "1": revealed ? 8000 : 3000,
      "2": revealed ? 14600 : 2200,
      "3": revealed ? 8400 : 1200,
    };
    return (t?.pot_total ?? defaultPots[tableNo] ?? 2000) + (pendingBets[key] ?? 0);
  };

  const isWinner = (tableNo: string): boolean => {
    if (winnerNo) return String(winnerNo) === String(tableNo);
    if (revealed) return tableNo === "3";
    return false;
  };

  const getHandRankName = (tableNo: string): string | null => {
    const t = tables.find((item) => String(item.table_no) === String(tableNo));
    if (t?.hand_rank) return String(t.hand_rank);
    return "Single";
  };

  return (
    <div className="relative flex flex-col h-full w-full bg-gradient-to-b from-[#376d80] via-[#2d5f70] to-[#224f5e] text-white overflow-hidden font-sans select-none justify-between">
      {/* 🎆 BURSTING FIREWORKS CELEBRATION ON WIN 🎆 */}
      <FireworksCelebration active={win.show || (revealed && totalUserBet > 0)} duration={4500} />
      {/* 🪙 ANIMATED FLYING CHIPS */}
      {flyingChips.map((fc) => (
        <div
          key={fc.id}
          className="fixed pointer-events-none z-50 transition-all duration-300 ease-out"
          style={{
            top: fc.startY,
            left: fc.startX,
            transform: "translate(-50%, -50%)",
            "--chip-x": `${fc.targetX - fc.startX}px`,
            "--chip-y": `${fc.targetY - fc.startY}px`,
            animation: "flyToCard 650ms cubic-bezier(.12,.84,.2,1) forwards",
          }}
        >
          <CasinoChip value={fc.amount} size="sm" />
        </div>
      ))}

      {/* 1. TOP BAR NAVIGATION */}
      <div className="relative z-30 flex items-center justify-between px-2 pt-2 pb-1 shrink-0">
        {/* Left Circular Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Back Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#497c92]/85 hover:bg-[#497c92] border border-white/50 text-white flex items-center justify-center shadow-md backdrop-blur-sm active:scale-90 transition cursor-pointer"
            title="Back"
          >
            <Undo2 className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Music Button */}
          <button
            type="button"
            onClick={() => {
              setBgmEnabled((prev) => {
                teenPattiAudio.toggleBgm(!prev);
                return !prev;
              });
            }}
            className={`w-8 h-8 rounded-full border border-white/50 flex items-center justify-center shadow-md backdrop-blur-sm active:scale-90 transition cursor-pointer ${
              bgmEnabled ? "bg-[#38bdf8] text-[#0f172a]" : "bg-[#497c92]/85 text-white"
            }`}
            title="Music"
          >
            <Music className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Help Button */}
          <button
            type="button"
            onClick={() => setOpenRules(true)}
            className="w-8 h-8 rounded-full bg-[#497c92]/85 hover:bg-[#497c92] border border-white/50 text-white flex items-center justify-center shadow-md backdrop-blur-sm active:scale-90 transition cursor-pointer"
            title="Help"
          >
            <HelpCircle className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* History Button */}
          <button
            type="button"
            onClick={() => setOpenHistory(true)}
            className="w-8 h-8 rounded-full bg-[#497c92]/85 hover:bg-[#497c92] border border-white/50 text-white flex items-center justify-center shadow-md backdrop-blur-sm active:scale-90 transition cursor-pointer"
            title="History"
          >
            <FileText className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Right Action Buttons & Ping */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1.5">
            {/* PLAYER Button */}
            <button
              type="button"
              onClick={() => setOpenRanking(true)}
              className="flex flex-col items-center justify-center bg-[#1a3d4d]/90 hover:bg-[#1a3d4d] border border-[#5d95ab]/50 rounded-[10px] px-2.5 py-0.5 text-white shadow-sm active:scale-95 transition cursor-pointer min-w-[52px]"
            >
              <Users className="w-3.5 h-3.5 text-[#93c5fd]" />
              <span className="text-[7.5px] font-black tracking-wider text-slate-100 uppercase mt-0.2">
                PLAYER
              </span>
            </button>

            {/* NEW Drink Badge Button -> Opens Detailed Game History */}
            <button
              type="button"
              onClick={() => setOpenGameHistoryModal(true)}
              className="flex items-center gap-1 bg-[#477e94]/90 hover:bg-[#386d82] border border-white/40 rounded-[10px] px-2 py-0.5 shadow-sm active:scale-95 transition cursor-pointer"
              title="Game History"
            >
              <span className="text-[9px] font-black text-white tracking-wider">NEW</span>
              <div className="w-4 h-4 flex items-center justify-center">
                <RedCocktailFlanDrink className="w-4 h-4" />
              </div>
            </button>
          </div>

          {/* Wi-Fi Ping Indicator */}
          <div className="flex items-center gap-0.5 text-[9.5px] font-bold text-[#4ade80] drop-shadow-sm pr-0.5">
            <Wifi className="w-3 h-3 stroke-[3]" />
            <span>{connected ? (revealed ? "33ms" : `${ping}ms`) : "Offline"}</span>
          </div>
        </div>
      </div>

      {/* 2. CENTER SECTION: MULTIPLIER INFO CARD WITH CROWN + ALARM CLOCK */}
      <div className="relative z-20 flex flex-col items-center justify-center my-auto">
        <CenterMultiplierWithCountdown
          seconds={countdown}
          showCountdown={phase === "betting" && !revealed}
          totalPot={revealed ? 31000 : 6400}
          userBet={totalUserBet}
        />
      </div>

      {/* 3. 3 BETTING STALLS (Left: Orange, Middle: Cocktail, Right: Beer) */}
      <div className="relative z-20 w-full max-w-[390px] sm:max-w-[440px] mx-auto px-1 mb-1">
        <DrinkStallsBoard
          revealed={revealed}
          soundEnabled={soundEnabled}
          stalls={(["1", "2", "3"] as const).map((no, idx) => {
            const key = (TABLE_KEY_MAP[no] || "A") as HandKey;
            const drinkTypes = ["orange", "cocktail", "beer"] as const;
            return {
              stallKey: key,
              drinkType: drinkTypes[idx],
              cards: getCards(no),
              pot: getPot(no),
              myBet: pendingBets[key],
              isWinner: isWinner(no),
              handRank: getHandRankName(no),
              disabled: phase !== "betting" && !revealed,
              onClick: () => placeBet(key),
            };
          })}
        />

        {/* 👤 USER PROFILE ICON (BELOW DRINK STALLS, CLICKS TO OPEN HISTORY) 👤 */}
        <div className="relative z-20 mt-2 flex justify-center">
          <button
            type="button"
            onClick={() => setOpenHistory(true)}
            aria-label="View betting history"
            title="View betting history"
            className="flex items-center gap-2 rounded-full border border-[#72b6cc]/50 bg-[#133d4e]/85 px-3 py-1 shadow-[0_3px_8px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:border-cyan-200/80 hover:bg-[#1a5066] active:scale-95 cursor-pointer"
          >
            <div className="h-7 w-7 overflow-hidden rounded-full border-2 border-white/85 bg-[#1e4d60] shadow-sm shrink-0 flex items-center justify-center">
              {currentUser?.avatar || currentUser?.image || currentUser?.profile_image || currentUser?.photo ? (
                <img
                  src={currentUser?.avatar || currentUser?.image || currentUser?.profile_image || currentUser?.photo}
                  alt={currentUser?.name || "Player"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 text-[10.5px] font-black text-white">
                  {(currentUser?.name || currentUser?.username || "P").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex flex-col text-left leading-tight pr-1">
              <span className="text-[7.5px] font-black uppercase tracking-[0.14em] text-cyan-200">History</span>
              <span className="text-[11px] font-bold text-white max-w-[110px] truncate">
                {currentUser?.name || currentUser?.username || "Player"}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 4. BOTTOM BAR: BALANCE, CASINO CHIPS & AUTO BET */}
      <div className="relative z-30 bg-[#164457]/85 border-t border-[#62aabf]/40 px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shrink-0 flex items-center justify-between gap-1 max-w-md mx-auto w-full">
        {/* Left Balance Pill */}
        <div className="flex items-center gap-1.5 bg-[#102d3b]/95 border border-[#3b748c] rounded-full px-2.5 py-1 shadow-sm shrink-0">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 border border-yellow-200 flex items-center justify-center text-[8px] font-black text-amber-950 shadow-sm">
            🪙
          </div>
          <span className="font-sans font-black text-[12px] text-white tracking-tight drop-shadow-sm">
            {formatCompactBalance(balance)}
          </span>
        </div>

        {/* 6 Casino Chips (500, 1K, 5K, 10K, 50K, 1M) */}
        <div className="flex items-center justify-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {[500, 1000, 5000, 10000, 50000, 1000000].map((val) => (
            <CasinoChip
              key={val}
              value={val}
              selected={heldChip === val}
              onClick={() => {
                setHeldChip(val);
                if (soundEnabled) teenPattiAudio.playChip();
              }}
              size="sm"
            />
          ))}
        </div>

        {/* Right Auto Bet Button */}
        <button
          type="button"
          onClick={() => {
            const next = !autoBet;
            setAutoBet(next);
            toast[next ? "success" : "info"](next ? "Auto Bet Enabled" : "Auto Bet Disabled");
          }}
          className={`flex items-center justify-center bg-gradient-to-b from-[#38bdf8] via-[#0284c7] to-[#0369a1] border border-[#7dd3fc] rounded-[8px] px-3 py-1.5 text-[11px] font-bold text-white shadow-md cursor-pointer active:scale-95 transition shrink-0 ${
            autoBet ? "ring-2 ring-yellow-300 brightness-110" : "hover:brightness-105"
          }`}
        >
          Auto Bet
        </button>
      </div>

      {/* WIN CELEBRATION MODAL */}
      <WinCelebration
        show={win.show}
        amount={win.amount}
        onClose={() => setWin({ amount: 0, show: false })}
      />

      {/* FLOATING WIN / LOSS TEXT */}
      {floatingWinText && (
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-bounce">
          <div
            className={`px-5 py-2 rounded-2xl font-black text-xl shadow-2xl border-2 ${
              floatingWinText.startsWith("+")
                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-yellow-300 ring-4 ring-yellow-400/50"
                : "bg-gradient-to-r from-rose-600 to-red-700 text-white border-red-300 ring-4 ring-red-400/50"
            }`}
          >
            {floatingWinText}
          </div>
        </div>
      )}

      {/* ROUND RESULT POPUP */}
      {resultPayload && (
        <RoundResultPopup
          show={showResultPopup}
          results={(() => {
            const stallMap = {
              "1": { key: "A", name: "Orange Stall", emoji: "🍊" },
              "2": { key: "B", name: "Cocktail Stall", emoji: "🍹" },
              "3": { key: "C", name: "Beer Stall", emoji: "🍺" },
            };
            return (resultPayload.tables || []).map((t) => {
              const info = stallMap[String(t.table_no)] || stallMap["1"];
              const key = info.key as "A" | "B" | "C";
              const myBet = pendingBetsRef.current[key] ?? 0;
              const isWin = String(t.table_no) === String(resultPayload.winnerNo);
              return {
                table_no: String(t.table_no),
                stallKey: key,
                stallName: info.name,
                drinkEmoji: info.emoji,
                hand_rank: t.hand_rank || "Single",
                rank: (t.rank || (isWin ? 1 : 3)) as 1 | 2 | 3,
                pot_total: t.pot_total || 0,
                is_winner: isWin,
                myBet,
                myPayout: isWin ? resultPayload.payout : 0,
              };
            });
          })()}
          winningTable={resultPayload.winnerNo}
          roundNumber={roundNumber}
          myPayout={resultPayload.payout}
          topUsers={leaderboardList}
          onClose={() => setShowResultPopup(false)}
        />
      )}

      {/* MODALS */}
      <RulesModal open={openRules} onClose={() => setOpenRules(false)} />
      <HistoryModal open={openHistory} onClose={() => setOpenHistory(false)} history={historyList} />
      <TeenPattiGameHistoryModal open={openGameHistoryModal} onClose={() => setOpenGameHistoryModal(false)} />
      <RankingModal open={openRanking} onClose={() => setOpenRanking(false)} leaderboard={leaderboardList} />
      <SettingsModal
        open={openSettings}
        onClose={() => setOpenSettings(false)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />
    </div>
  );
}