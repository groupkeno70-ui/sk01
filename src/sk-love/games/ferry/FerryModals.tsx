// @ts-nocheck
import React from "react";
import { FOOD_ICONS } from "./FoodIllustrations";

// Format helper for numbers in K / M / B
const formatCoinsK = (num: number): string => {
  if (!num || num <= 0) return "0";
  if (num >= 1000000) return `${(num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}K`;
  return `${num}`;
};

// ── 1. My History Modal (Exact Match to Screenshot 2) ─────────────────────────
export function FerryHistoryModal({
  open,
  onClose,
  history = [],
}: {
  open: boolean;
  onClose: () => void;
  history: any[];
}) {
  if (!open) return null;

  // Fallback demo data if history is empty, matching screenshot 2
  const displayHistory =
    history && history.length > 0
      ? history
      : [
          {
            date: "01/07/2026",
            round_number: 144,
            bets: [
              { slot: "strawberry", amount: 2000 },
              { slot: "corn", amount: 2000 },
              { slot: "meat", amount: 2000 },
              { slot: "fish", amount: 1000 },
              { slot: "chicken", amount: 1000 },
            ],
            result_slot: "octopus",
            payout: 0,
          },
          {
            date: "01/07/2026",
            round_number: 143,
            bets: [
              { slot: "strawberry", amount: 8000 },
              { slot: "cabbage", amount: 10000 },
              { slot: "meat", amount: 7000 },
              { slot: "fish", amount: 3000 },
              { slot: "octopus", amount: 5000 },
              { slot: "chicken", amount: 3000 },
            ],
            result_slot: "fish",
            payout: 45000,
          },
        ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-3 animate-in fade-in"
      onClick={onClose}
    >
      {/* Dialog Card (Cream / Ivory background with red top header badge) */}
      <div
        className="relative w-full max-w-[340px] sm:max-w-sm rounded-[24px] border-2 border-[#ea580c] bg-[#fff6e5] p-3 text-slate-800 shadow-2xl flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Red Pill Badge */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1 rounded-full bg-gradient-to-r from-[#ef4444] via-[#dc2626] to-[#ef4444] border-2 border-white shadow-md flex items-center justify-center">
          <span className="text-white text-xs font-black tracking-wider uppercase drop-shadow-sm">
            My History
          </span>
        </div>

        {/* Close Button (White circle with Red ✕) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-3 -right-2 w-7 h-7 rounded-full bg-white border-2 border-red-500 text-red-500 font-black text-sm flex items-center justify-center shadow-md cursor-pointer active:scale-90"
        >
          ✕
        </button>

        {/* Table Column Headers */}
        <div className="mt-3 grid grid-cols-3 text-center text-[11px] font-black text-[#78350f] pb-1.5 border-b border-[#fed7aa]">
          <span>Play Time</span>
          <span>Play Details</span>
          <span>Result</span>
        </div>

        {/* History Rows */}
        <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-0.5 divide-y divide-[#fed7aa]/50 max-h-[340px]">
          {displayHistory.map((row, idx) => {
            const ResultIcon =
              FOOD_ICONS[row.result_slot || row.winning_slot || "fish"] || FOOD_ICONS.fish;
            const betList = row.bets || [
              { slot: row.target_slot || "strawberry", amount: row.amount || 1000 },
            ];

            return (
              <div key={idx} className="pt-2 grid grid-cols-3 items-center text-center text-xs font-sans">
                {/* Left: Play Time & Round Number */}
                <div className="flex flex-col items-center justify-center text-[10px] font-bold text-[#78350f] leading-tight">
                  <span>{row.date || "01/07/2026"}</span>
                  <span className="text-[9.5px] text-[#b45309] font-mono">
                    Round: {row.round_number || 144}
                  </span>
                </div>

                {/* Middle: Play Details (Food Icon + Coins) */}
                <div className="flex flex-col items-start pl-3 space-y-1">
                  {betList.map((b, bi) => {
                    const FoodIcon = FOOD_ICONS[b.slot] || FOOD_ICONS.strawberry;
                    return (
                      <div key={bi} className="flex items-center gap-1 text-[10px] font-bold text-[#78350f]">
                        <FoodIcon className="w-3.5 h-3.5" />
                        <span className="text-[10px]">🪙</span>
                        <span className="font-mono text-[9.5px]">{formatCoinsK(b.amount)}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Right: Result (Food Icon + Won Coins) */}
                <div className="flex items-center justify-center gap-1 text-[11px] font-black">
                  <ResultIcon className="w-4 h-4" />
                  <span className="text-[11px]">🪙</span>
                  <span
                    className={`font-mono text-[10.5px] ${
                      (row.payout || 0) > 0 ? "text-[#15803d]" : "text-[#78350f]"
                    }`}
                  >
                    {formatCoinsK(row.payout || 0)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── 2. Ferry Rules Modal ──────────────────────────────────────────────────────
export function FerryRulesModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-[24px] border-2 border-[#ea580c] bg-[#fff6e5] p-4 text-[#78350f] shadow-2xl flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-2 w-7 h-7 rounded-full bg-white border-2 border-red-500 text-red-500 font-black text-sm flex items-center justify-center shadow-md cursor-pointer"
        >
          ✕
        </button>
        <div className="text-center font-black text-base border-b border-[#fed7aa] pb-2 text-[#9a3412]">
          🎡 Ferry Wheel Rules
        </div>
        <div className="space-y-2 py-3 text-xs leading-relaxed overflow-y-auto">
          <p>• Place your bets on any of the 8 food stalls before the timer expires.</p>
          <p>• 🍗 Chicken: <strong>x45 Multiplier</strong></p>
          <p>• 🐙 Octopus: <strong>x25 Multiplier</strong></p>
          <p>• 🐟 Fish: <strong>x15 Multiplier</strong></p>
          <p>• 🥩 Meat: <strong>x10 Multiplier</strong></p>
          <p>• 🍇 Grapes / 🥬 Cabbage / 🌽 Corn / 🍓 Strawberry: <strong>x5 Multiplier</strong></p>
          <p>• 🥗 Salad & 🍕 Pizza side bets offer equal chance payouts.</p>
        </div>
      </div>
    </div>
  );
}

// ── 3. Ferry Leaderboard Modal ─────────────────────────────────────────────────
export function FerryLeaderboardModal({
  open,
  onClose,
  leaderboard = [],
}: {
  open: boolean;
  onClose: () => void;
  leaderboard: any[];
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-[24px] border-2 border-[#ea580c] bg-[#fff6e5] p-4 text-[#78350f] shadow-2xl flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-2 w-7 h-7 rounded-full bg-white border-2 border-red-500 text-red-500 font-black text-sm flex items-center justify-center shadow-md cursor-pointer"
        >
          ✕
        </button>
        <div className="text-center font-black text-base border-b border-[#fed7aa] pb-2 text-[#9a3412]">
          🏆 Top Ranking Winners
        </div>
        <div className="flex-1 overflow-y-auto space-y-1.5 py-3">
          {leaderboard.map((u, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 rounded-xl bg-white/80 border border-[#fed7aa]"
            >
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-[#ea580c]">#{i + 1}</span>
                <span className="font-bold text-xs">{u.name || u.username || "Player"}</span>
              </div>
              <span className="font-mono font-black text-xs text-[#15803d]">
                🪙 {Number(u?.winnings ?? u?.coins ?? 50000).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
