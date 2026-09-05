// @ts-nocheck
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { io } from "socket.io-client";
import { api } from "../lib/api";
import { WinCelebration } from "./shared";
import { emitGameWin } from "../components/TopGameWinnerBanner";
import FerrisWheel from "./ferry/FerrisWheel";
import FerryChip from "./ferry/FerryChip";
import {
  FerryHistoryModal,
  FerryLeaderboardModal,
  FerryRulesModal,
} from "./ferry/FerryModals";
import FerryResultModal from "./ferry/FerryResultModal";
import {
  FOOD_ICONS,
  RedBirdIcon,
} from "./ferry/FoodIllustrations";
import { ferryAudio } from "./ferry/FerrySoundEngine";

const DEFAULT_CHIPS = [500, 1000, 5000, 10000, 50000, 1000000];

const SLOT_TARGET_ALIASES: Record<string, string[]> = {
  chicken: ["chicken", "roast_chicken", "poultry", "0", "slot_0", "1"],
  octopus: ["octopus", "squid", "seafood", "1", "slot_1", "2"],
  fish: ["fish", "salmon", "2", "slot_2", "seafood_fish", "3"],
  meat: ["meat", "steak", "beef", "pork", "3", "slot_3", "4"],
  grapes: ["grapes", "grape", "4", "slot_4", "5"],
  cabbage: ["cabbage", "lettuce", "vegetable", "5", "slot_5", "6"],
  corn: ["corn", "maize", "6", "slot_6", "7"],
  strawberry: ["strawberry", "berry", "strawberries", "7", "slot_7", "8"],
  salad: ["salad", "salad_bowl", "8", "slot_8", "9"],
  pizza: ["pizza", "pizza_pie", "9", "slot_9", "10"],
};

const resolveServerTarget = (clientKey: string, serverPots: Record<string, any>): string => {
  const potKeys = Object.keys(serverPots || {});
  if (potKeys.length > 0) {
    if (potKeys.includes(clientKey)) return clientKey;
    const aliases = SLOT_TARGET_ALIASES[clientKey] || [clientKey];
    for (const alias of aliases) {
      if (potKeys.includes(alias)) return alias;
    }
  }
  return clientKey;
};

type Props = {
  chips?: number[];
  balance?: number;
  onBalance?: (balance: number) => void;
  onBalanceChange?: (balance: number) => void;
  onClose?: () => void;
};

// Format numbers with commas (e.g. 4,265,000)
const formatNumberCommas = (num: any): string => {
  if (num === null || num === undefined) return "0";
  const val = Number(num);
  if (isNaN(val)) return "0";
  return val.toLocaleString();
};

export default function FerryWheelGame({
  chips = DEFAULT_CHIPS,
  balance: balanceProp,
  onBalance,
  onBalanceChange,
  onClose,
}: Props) {
  const chipList = Array.from(new Set(chips && chips.length ? chips : DEFAULT_CHIPS));
  const [balance, setBalance] = useState<number>(balanceProp ?? 77);
  const [selectedChip, setSelectedChip] = useState<number>(chipList.includes(500) ? 500 : chipList[0]);
  const [bets, setBets] = useState<Record<string, number>>({});
  const [roundNumber, setRoundNumber] = useState<number>(263);
  const [roundId, setRoundId] = useState<number>(1);
  const [phase, setPhase] = useState<"betting" | "spinning" | "payout">("betting");
  const [countdown, setCountdown] = useState<number>(7);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [winningSlot, setWinningSlot] = useState<string | null>(null);
  const [winToday, setWinToday] = useState<number>(675000);
  const [userAgencyCoins, setUserAgencyCoins] = useState<number>(4265000);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);

  // Current User Profile
  const [currentUser, setCurrentUser] = useState<{
    id?: number;
    name?: string;
    username?: string;
    avatar?: string;
  }>({
    name: "ALex",
    avatar: null,
  });

  const [winCelebration, setWinCelebration] = useState<{ amount: number; show: boolean }>({
    amount: 0,
    show: false,
  });

  // Modals
  const [historyOpen, setHistoryOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);

  useEffect(() => {
    if (!resultModalOpen) return;
    const timer = window.setTimeout(() => {
      setResultModalOpen(false);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [resultModalOpen]);
  const [roundResultData, setRoundResultData] = useState<{
    winningSlot: string;
    myBet: number;
    reward: number;
    roundNumber: number;
    topWinners: any[];
  }>({
    winningSlot: "meat",
    myBet: 23000,
    reward: 40000,
    roundNumber: 136,
    topWinners: [
      { name: "Ks AGENCY", coins: 30000, rank: 2 },
      { name: "ALex", coins: 40000, rank: 1 },
      { name: "NAVEEM", coins: 20000, rank: 3 },
    ],
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [userHistory, setUserHistory] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  // Real-time pots per slot
  const [pots, setPots] = useState<Record<string, number>>({
    chicken: 0,
    octopus: 0,
    fish: 0,
    meat: 0,
    grapes: 0,
    cabbage: 1000,
    corn: 0,
    strawberry: 0,
    salad: 4500,
    pizza: 6800,
  });

  // Recent winning history for bottom Result ticker
  const [recentResults, setRecentResults] = useState<any[]>([
    { winning_slot: "meat", winning_index: 3 },
    { winning_slot: "cabbage", winning_index: 5 },
    { winning_slot: "meat", winning_index: 3 },
    { winning_slot: "cabbage", winning_index: 5 },
    { winning_slot: "strawberry", winning_index: 7 },
    { winning_slot: "corn", winning_index: 6 },
    { winning_slot: "strawberry", winning_index: 7 },
    { winning_slot: "strawberry", winning_index: 7 },
  ]);

  const socketRef = useRef<any>(null);
  const betsRef = useRef(bets);
  betsRef.current = bets;

  const pushBalance = useCallback(
    (bal: number) => {
      setBalance(bal);
      onBalance?.(bal);
      onBalanceChange?.(bal);
    },
    [onBalance, onBalanceChange]
  );

  useEffect(() => {
    if (typeof balanceProp === "number") setBalance(balanceProp);
  }, [balanceProp]);

  // Fetch initial data
  const fetchInitialData = useCallback(async () => {
    try {
      let storedUser = null;
      try {
        storedUser = JSON.parse(
          localStorage.getItem("user") || localStorage.getItem("sk_love_user") || "null"
        );
      } catch {}

      if (storedUser) {
        setCurrentUser({
          id: storedUser.id,
          name: storedUser.name || storedUser.username || "ALex",
          avatar: storedUser.avatar || storedUser.profile_image || null,
        });
      }

      const resBal: any = await api.get("/api/games/balance");
      const bal = Number(resBal?.coins ?? resBal?.diamonds ?? resBal?.balance ?? balanceProp ?? 0);
      if (bal > 0) pushBalance(bal);

      const resRound: any = await api.get("/api/games/ferry/current-round");
      if (resRound?.data) {
        setRoundId(resRound.data.round_id || 1);
        setRoundNumber(resRound.data.round_number || 263);
        if (resRound.data.pots) setPots(resRound.data.pots);
      }

      const resHist: any = await api.get("/api/games/ferry/recent-history");
      if (resHist?.data && Array.isArray(resHist.data) && resHist.data.length > 0) {
        setRecentResults(resHist.data);
      }
    } catch {}
  }, [balanceProp, pushBalance]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Socket.io Real-Time Integration
  useEffect(() => {
    const socketUrl =
      (import.meta as any).env?.VITE_SOCKET_URL || "https://168.144.140.4.nip.io";

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("sk_love_token") ||
      localStorage.getItem("auth_token");
    let storedUser = null;
    try {
      storedUser = JSON.parse(
        localStorage.getItem("user") || localStorage.getItem("sk_love_user") || "null"
      );
    } catch {}

    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      path: "/socket.io/",
      secure: true,
      reconnection: true,
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("auth", { token: token || "guest_token", user: storedUser });
      socket.emit("ferry:get_state");
    });

    socket.on("auth:success", (data: any) => {
      if (data?.user?.balance != null) {
        pushBalance(Number(data.user.balance));
      }
    });

    socket.on("balance:update", (data: any) => {
      const bal = Number(data?.balance ?? data?.coins ?? data?.diamonds ?? data?.new_balance);
      if (!isNaN(bal)) {
        pushBalance(bal);
      }
    });

    socket.on("ferry:state", (data: any) => {
      if (data) {
        if (data.round?.id) setRoundId(data.round.id);
        if (data.round?.round_number) setRoundNumber(data.round.round_number);
        if (data.phase) setPhase(data.phase);
        if (typeof data.countdown === "number") setCountdown(data.countdown);
        if (data.pots) setPots(data.pots);
        if (data.recentHistory?.length) setRecentResults(data.recentHistory);
      }
    });

    socket.on("ferry:round_start", (data: any) => {
      setRoundId(data.round_id);
      setRoundNumber(data.round_number || 263);
      setPhase("betting");
      setCountdown(data.seconds_left || 7);
      setSpinning(false);
      setTargetIndex(null);
      setWinningSlot(null);
      setBets({});
      if (data.pots) setPots(data.pots);
    });

    socket.on("ferry:countdown", (data: any) => {
      if (data.phase) setPhase(data.phase);
      if (typeof data.countdown === "number") setCountdown(data.countdown);
      if (data.pots) setPots(data.pots);
    });

    socket.on("ferry:pots_update", (data: any) => {
      if (data.pots) setPots(data.pots);
    });

    socket.on("ferry:spin_start", (data: any) => {
      setPhase("spinning");
      setSpinning(true);
      setTargetIndex(data.winning_index ?? 0);
      setWinningSlot(data.winning_slot);
    });

    socket.on("ferry:round_end", (data: any) => {
      setPhase("payout");
      setSpinning(false);
      setTargetIndex(data.winning_index ?? 0);
      setWinningSlot(data.winning_slot);
      if (data.recent_history) setRecentResults(data.recent_history);

      const totalMyBet = Object.values(betsRef.current || {}).reduce(
        (a: number, b: any) => a + Number(b || 0),
        0
      );
      setRoundResultData({
        winningSlot: data.winning_slot || "meat",
        myBet: totalMyBet || 23000,
        reward: 0,
        roundNumber: data.round_number || roundNumber,
        topWinners: data.top_3 || [],
      });

      setTimeout(() => {
        setResultModalOpen(true);
      }, 400);
    });

    socket.on("ferry:payout_done", (data: any) => {
      if (data.payout && data.payout > 0) {
        if (data.new_balance != null) pushBalance(data.new_balance);
        setWinToday((prev) => prev + data.payout);
        setWinCelebration({ amount: data.payout, show: true });
        ferryAudio.playWin();
        emitGameWin({ amount: data.payout, game: "Ferry Wheel" });
        setTimeout(() => setWinCelebration({ amount: 0, show: false }), 4000);

        setRoundResultData((prev) => ({
          ...prev,
          reward: data.payout,
        }));
      }
    });

    socket.on("ferry:bet_accepted", (data: any) => {
      if (data.new_balance != null) pushBalance(data.new_balance);
      if (data.pots) setPots(data.pots);
    });

    socket.on("ferry:bet_error", (data: any) => {
      toast.error(data.message || "Bet failed");
    });

    return () => {
      socket.disconnect();
    };
  }, [pushBalance, roundNumber]);

  // Place Bet Handler
  const handlePlaceBet = async (targetKey: string) => {
    if (phase !== "betting" && phase !== undefined) {
      toast.error("Betting is currently closed");
      return;
    }

    if (balance < selectedChip) {
      toast.error("Insufficient coins");
      return;
    }

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("sk_love_token") ||
      localStorage.getItem("auth_token");
    let storedUser = null;
    try {
      storedUser = JSON.parse(
        localStorage.getItem("user") || localStorage.getItem("sk_love_user") || "null"
      );
    } catch {}

    setBets((prev) => ({
      ...prev,
      [targetKey]: (prev[targetKey] || 0) + selectedChip,
    }));
    setPots((prev) => ({
      ...prev,
      [targetKey]: (prev[targetKey] || 0) + selectedChip,
    }));
    pushBalance(balance - selectedChip);
    ferryAudio.playBet();

    const serverTarget = resolveServerTarget(targetKey, pots);

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("ferry:place_bet", {
        target: serverTarget,
        target_key: targetKey,
        amount: selectedChip,
        round_id: roundId,
        token: token || null,
        user_id: storedUser?.id || null,
      });
    } else {
      try {
        const res: any = await api.post("/api/games/ferry/bet", {
          target: serverTarget,
          target_key: targetKey,
          amount: selectedChip,
          round_id: roundId,
          user_id: storedUser?.id || null,
        });
        if (res?.data?.new_balance != null) {
          pushBalance(res.data.new_balance);
        }
      } catch (err: any) {
        toast.error(err?.message || "Bet failed");
      }
    }
  };

  const openHistory = async () => {
    setHistoryOpen(true);
    try {
      const res: any = await api.get("/api/games/ferry/user-history");
      if (res?.data?.bets) {
        setUserHistory(res.data.bets);
        if (res.data.win_today != null) setWinToday(res.data.win_today);
      }
    } catch {}
  };

  const openLeaderboard = async () => {
    setLeaderboardOpen(true);
    try {
      const res: any = await api.get("/api/games/ferry/leaderboard");
      if (res?.data && Array.isArray(res.data)) {
        setLeaderboard(res.data);
      }
    } catch {}
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    ferryAudio.enabled = next;
    toast.success(next ? "Sound Enabled 🔊" : "Sound Muted 🔇");
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-[#18a2d8] via-[#2cb6e9] to-[#18a2d8] font-sans select-none flex flex-col justify-between">
      {/* ── Background Clouds ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-12 left-6 text-white/50 text-4xl">☁</div>
        <div className="absolute top-20 right-8 text-white/40 text-3xl">☁</div>
      </div>

      {/* ── 1. Top Navigation Bar ── */}
      <div className="relative z-20 pt-1.5 px-3 pb-0.5 flex items-center justify-between shrink-0">
        {/* Left: Back Button + Round Number */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#157291]/80 hover:bg-[#157291] text-white flex items-center justify-center shadow cursor-pointer active:scale-90"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
              <path d="M 20 11 L 7.83 11 L 13.42 5.41 L 12 4 L 4 12 L 12 20 L 13.41 18.59 L 7.83 13 L 20 13 Z" />
            </svg>
          </button>
          <span className="text-xs font-bold text-[#0c4a5c] tracking-tight">
            round:{roundNumber}
          </span>
        </div>

        {/* Top Center: Red Bird Flying */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 pointer-events-none filter drop-shadow">
          <RedBirdIcon className="w-5 h-5" />
        </div>

        {/* Right: Music, Help, Close Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleSound}
            className="w-7 h-7 rounded-full bg-[#157291]/80 hover:bg-[#157291] text-white flex items-center justify-center text-xs shadow cursor-pointer active:scale-90"
            title="Music"
          >
            {soundEnabled ? "🎵" : "🔇"}
          </button>
          <button
            type="button"
            onClick={() => setRulesOpen(true)}
            className="w-7 h-7 rounded-full bg-[#157291]/80 hover:bg-[#157291] text-white font-black text-xs flex items-center justify-center shadow cursor-pointer active:scale-90"
            title="Help"
          >
            ?
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#1e293b]/90 hover:bg-black text-white font-black text-xs flex items-center justify-center shadow cursor-pointer active:scale-90"
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── 2. Center Ferris Wheel Area (Scales automatically) ── */}
      <div className="relative z-10 flex-1 flex items-center justify-center my-auto py-0 min-h-0 overflow-hidden">
        <FerrisWheel
          spinning={spinning}
          targetIndex={targetIndex}
          countdown={countdown}
          pots={pots}
          userBets={bets}
          selectedChip={selectedChip}
          onSlotClick={handlePlaceBet}
          disabled={phase !== "betting"}
        />
      </div>

      {/* ── 3. Middle Section: Agency Card + MyHistory Card (Trapezoid Stand) ── */}
      <div className="relative z-20 w-full px-2 shrink-0">
        <div className="relative w-full max-w-[420px] mx-auto rounded-t-2xl bg-[#bf4233] border-t-2 border-[#caa16d] pt-1.5 px-2 pb-1 shadow-md">
          <div className="grid grid-cols-2 gap-2">
            {/* Left Card: Agency */}
            <button
              type="button"
              onClick={openLeaderboard}
              className="rounded-xl border border-[#d97706]/40 bg-[#faecd8] p-1.5 flex items-center justify-between shadow active:scale-98 transition text-left"
            >
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-full bg-black border border-[#d97706] flex items-center justify-center overflow-hidden shrink-0">
                  <span className="text-[10px]">👤</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-[#5a2206] tracking-tight leading-none">
                    ༺ Ks AGENCY ༻
                  </span>
                  <div className="flex items-center gap-0.5 mt-0.5">
                    <span className="text-[9.5px]">🪙</span>
                    <span className="text-[10.5px] font-black font-mono text-[#5a2206] leading-none">
                      {formatNumberCommas(userAgencyCoins)}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] text-[#5a2206] font-black">▶</span>
            </button>

            {/* Right Card: MyHistory */}
            <button
              type="button"
              onClick={openHistory}
              className="rounded-xl border border-[#d97706]/40 bg-[#faecd8] p-1.5 flex items-center justify-between shadow active:scale-98 transition text-left"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-lg">📝</span>
                <span className="text-xs font-black text-[#5a2206] tracking-tight">
                  MyHistory
                </span>
              </div>
              <span className="text-[10px] text-[#5a2206] font-black">▶</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 4. Lower Red Control Board (Scalloped Ticker + Arched Chips + Profile Bar) ── */}
      <div className="relative z-20 w-full shrink-0">
        <div className="relative w-full bg-[#d64736] pt-0.5 px-2.5 pb-2 flex flex-col items-center">
          {/* Scalloped / Wavy Result Ticker */}
          <div className="relative w-full max-w-[420px] my-0.5">
            <div className="w-full rounded-2xl bg-[#8c2217] border border-[#a83224] p-1 flex items-center shadow-inner">
              <span className="text-[10.5px] font-bold text-[#fef08a] mr-1.5 shrink-0">
                result
              </span>
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
                {recentResults.slice(0, 8).map((res, idx) => {
                  const foodKey = res.winning_slot || res.target || "meat";
                  const Icon = FOOD_ICONS[foodKey] || FOOD_ICONS.meat;
                  const isNewest = idx === 0;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setRoundResultData((prev) => ({
                          ...prev,
                          winningSlot: foodKey,
                        }));
                        setResultModalOpen(true);
                      }}
                      className="relative w-5.5 h-5.5 rounded-full bg-[#faecd8] border border-[#d97706] flex items-center justify-center shrink-0 shadow-sm cursor-pointer active:scale-90"
                    >
                      {isNewest && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-1 py-0.1 bg-[#fef08a] border border-[#b45309] text-[6px] font-black text-[#78350f] rounded-full uppercase leading-none shadow">
                          NEW
                        </span>
                      )}
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 6 Arched Pedestal Betting Chips (500, 1K, 5K, 10K, 50K, 1M) */}
          <div className="flex items-center justify-center gap-1 sm:gap-1.5 my-1 w-full max-w-[420px] overflow-x-auto scrollbar-none py-0.5">
            {chipList.map((val) => (
              <FerryChip
                key={val}
                value={val}
                selected={selectedChip === val}
                onClick={() => {
                  setSelectedChip(val);
                  ferryAudio.playClick();
                }}
                disabled={spinning}
              />
            ))}
          </div>

          {/* Bottom Bar: Profile + Today's Revenue + Auto Play Button */}
          <div className="w-full max-w-[420px] flex items-center justify-between gap-1 pt-0.5">
            {/* User Profile */}
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-lg bg-slate-900 border border-white/60 overflow-hidden shadow flex items-center justify-center shrink-0">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs">🧔</span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white leading-none">
                  {currentUser.name}
                </span>
                <div className="flex items-center gap-0.5 mt-0.5 bg-[#faecd8] rounded-full px-1.5 py-0.2 border border-[#d97706]">
                  <span className="text-[9px]">🪙</span>
                  <span className="text-[9.5px] font-black font-mono text-[#5a2206] leading-none">
                    {formatNumberCommas(balance)}
                  </span>
                  <span className="text-[9.5px] text-[#16a34a] font-black ml-0.5">+</span>
                </div>
              </div>
            </div>

            {/* Today's Revenue */}
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-bold text-white leading-none">
                Today's Revenue:
              </span>
              <div className="flex items-center gap-0.5 mt-0.5 bg-[#faecd8] rounded-full px-2 py-0.2 border border-[#d97706]">
                <span className="text-[9px]">🪙</span>
                <span className="text-[9.5px] font-black font-mono text-[#5a2206] leading-none">
                  {formatNumberCommas(winToday)}
                </span>
              </div>
            </div>

            {/* Bright Glossy Green Auto Play Button */}
            <button
              type="button"
              onClick={() => {
                const next = !autoPlay;
                setAutoPlay(next);
                toast.success(next ? "Auto Play Enabled 🟢" : "Auto Play Disabled 🔴");
              }}
              className={`px-3 py-1.5 rounded-2xl border-2 border-white/80 font-black text-xs text-white shadow-lg active:scale-95 transition-transform ${
                autoPlay
                  ? "bg-gradient-to-r from-emerald-500 to-green-600 ring-2 ring-yellow-300"
                  : "bg-gradient-to-r from-[#84cc16] via-[#22c55e] to-[#16a34a]"
              }`}
            >
              Auto Play
            </button>
          </div>
        </div>

        {/* Bottom Cyan Safe Area Strip */}
        <div className="w-full h-2 bg-[#0ea5e9]" />
      </div>

      {/* ── Modals & Celebrations ── */}
      <FerryResultModal
        show={resultModalOpen}
        onClose={() => setResultModalOpen(false)}
        winningSlot={roundResultData.winningSlot}
        myBet={roundResultData.myBet}
        reward={roundResultData.reward}
        roundNumber={roundResultData.roundNumber}
        topWinners={roundResultData.topWinners}
      />

      <FerryHistoryModal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={userHistory}
      />

      <FerryLeaderboardModal
        open={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
        leaderboard={leaderboard}
      />

      <FerryRulesModal
        open={rulesOpen}
        onClose={() => setRulesOpen(false)}
      />

      {winCelebration.show && <WinCelebration amount={winCelebration.amount} />}
    </div>
  );
}
