// @ts-nocheck
import React, { useEffect, useState } from "react";
import { FOOD_ICONS, ArabianLionCub } from "./FoodIllustrations";

interface Props {
  show: boolean;
  winningSlot: string;
  myBet?: number;
  reward?: number;
  roundNumber?: number;
  topWinners?: any[];
  onClose: () => void;
}

const safeFormatNumber = (num: any): string => {
  if (num === null || num === undefined) return "0";
  const n = Number(num);
  if (isNaN(n)) return "0";
  return n.toLocaleString();
};

export default function FerryResultModal({
  show,
  winningSlot = "meat",
  myBet = 23000,
  reward = 40000,
  roundNumber = 136,
  topWinners = [],
  onClose,
}: Props) {
  const [timeLeft, setTimeLeft] = useState(1);

  // Auto-close in exactly 1 second (1000ms)
  useEffect(() => {
    if (!show) return;
    setTimeLeft(1);

    const timer = setTimeout(() => {
      onClose?.();
    }, 1000);

    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  const WinIcon = FOOD_ICONS[winningSlot] || FOOD_ICONS.meat;

  const rawWinners = Array.isArray(topWinners) && topWinners.length > 0 ? topWinners : [];

  const defaultWinners = [
    { name: "Ks AGENCY", coins: 30000, rank: 2 },
    { name: "ALex", coins: 40000, rank: 1 },
    { name: "NAVEEM", coins: 20000, rank: 3 },
  ];

  const firstPlace = rawWinners.find((w) => w?.rank === 1) || rawWinners[0] || defaultWinners[1];
  const secondPlace = rawWinners.find((w) => w?.rank === 2) || rawWinners[1] || defaultWinners[0];
  const thirdPlace = rawWinners.find((w) => w?.rank === 3) || rawWinners[2] || defaultWinners[2];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-2 animate-in fade-in"
      onClick={onClose}
    >
      {/* Full Stage Popup Container */}
      <div
        className="relative w-full max-w-[360px] sm:max-w-md rounded-3xl overflow-hidden shadow-2xl border-2 border-yellow-500/40 bg-gradient-to-b from-[#7f1d1d] via-[#991b1b] to-[#450a0a] text-white flex flex-col items-center select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Right Timer (1s) */}
        <div className="absolute top-2 right-3 z-30 text-xs font-bold text-yellow-300 font-mono">
          ({timeLeft}s)
        </div>

        {/* ── 1. Sunburst Radiant Rays & Winning Food ── */}
        <div className="relative w-full pt-4 pb-2 flex flex-col items-center justify-center overflow-hidden">
          {/* Rotating Sunburst Rays */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 opacity-40 pointer-events-none">
            <svg viewBox="0 0 200 200" className="w-full h-full animate-spin" style={{ animationDuration: "20s" }}>
              <defs>
                <radialGradient id="sunbeam2" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
                </radialGradient>
              </defs>
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <polygon
                  key={deg}
                  points="100,100 88,0 112,0"
                  transform={`rotate(${deg} 100 100)`}
                  fill="url(#sunbeam2)"
                />
              ))}
            </svg>
          </div>

          {/* Winning Food Floating in Center */}
          <div className="relative z-20 w-24 h-24 flex items-center justify-center filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] animate-bounce">
            <WinIcon className="w-20 h-20" />
          </div>

          {/* Results Summary Texts */}
          <div className="relative z-20 text-center space-y-1 mt-1">
            <div className="text-xs font-black text-yellow-100 tracking-wide">
              Round {roundNumber || 136}'s Result:
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-white">
              <span>This Round Earnings:</span>
              <span className="font-mono font-black text-yellow-300 flex items-center gap-0.5">
                <span>🪙</span> {safeFormatNumber(reward)}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-white">
              <span>This Round Bets:</span>
              <span className="font-mono font-black text-yellow-300 flex items-center gap-0.5">
                <span>🪙</span> {safeFormatNumber(myBet)}
              </span>
            </div>
          </div>
        </div>

        {/* ── 2. Circus Stage Platform with Yellow Light Bulbs ── */}
        <div className="relative w-full z-20">
          <div className="relative w-full h-8 bg-gradient-to-r from-[#b45309] via-[#f59e0b] to-[#b45309] border-y-2 border-yellow-200 flex items-center justify-around px-2 shadow-md">
            {[...Array(14)].map((_, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-yellow-100 border border-amber-600 shadow-[0_0_6px_rgba(254,240,138,0.9)] animate-pulse"
              />
            ))}
          </div>

          {/* Lion Cub Sitting on the Left Side of Stage */}
          <div className="absolute -top-16 left-2 z-30 filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)]">
            <ArabianLionCub className="w-18 h-18" />
          </div>
        </div>

        {/* ── 3. Podium Ranking ── */}
        <div className="relative w-full bg-gradient-to-b from-[#6b1414] to-[#450a0a] pt-3 pb-4 px-4 flex flex-col items-center">
          <div className="text-[11px] font-black text-yellow-300 tracking-wider uppercase mb-2 drop-shadow">
            This Round Ranking:
          </div>

          {/* 3 Podium Winners */}
          <div className="grid grid-cols-3 gap-2 w-full max-w-xs items-end justify-center">
            {/* 2nd Place (Left) */}
            <div className="flex flex-col items-center text-center">
              <div className="relative -mb-2 z-20 text-base">👑</div>
              <div className="w-11 h-11 rounded-full border-2 border-slate-300 bg-[#0f172a] shadow-md flex items-center justify-center overflow-hidden">
                <span className="text-[10px] font-black text-slate-200">2nd</span>
              </div>
              <div className="mt-1 px-2 py-0.2 rounded bg-gradient-to-r from-sky-400 to-blue-500 text-[8px] font-black text-white shadow-sm truncate max-w-[80px]">
                {secondPlace?.name || secondPlace?.username || "Ks AGENCY"}
              </div>
              <span className="font-mono font-black text-[9.5px] text-yellow-300 mt-0.5">
                🪙 {safeFormatNumber(secondPlace?.coins ?? secondPlace?.amount ?? secondPlace?.winnings ?? 30000)}
              </span>
            </div>

            {/* 1st Place (Center) */}
            <div className="flex flex-col items-center text-center -translate-y-2">
              <div className="relative -mb-2 z-20 text-lg">👑</div>
              <div className="w-13 h-13 rounded-full border-2 border-yellow-300 bg-[#0f172a] shadow-[0_0_12px_rgba(250,204,21,0.8)] flex items-center justify-center overflow-hidden">
                <span className="text-xs font-black text-yellow-300">1st</span>
              </div>
              <div className="mt-1 px-2.5 py-0.5 rounded bg-gradient-to-r from-yellow-300 to-amber-500 text-[9px] font-black text-[#5a2206] shadow-sm truncate max-w-[90px]">
                {firstPlace?.name || firstPlace?.username || "ALex"}
              </div>
              <span className="font-mono font-black text-[10.5px] text-yellow-300 mt-0.5">
                🪙 {safeFormatNumber(firstPlace?.coins ?? firstPlace?.amount ?? firstPlace?.winnings ?? 40000)}
              </span>
            </div>

            {/* 3rd Place (Right) */}
            <div className="flex flex-col items-center text-center">
              <div className="relative -mb-2 z-20 text-base">👑</div>
              <div className="w-11 h-11 rounded-full border-2 border-amber-600 bg-[#0f172a] shadow-md flex items-center justify-center overflow-hidden">
                <span className="text-[10px] font-black text-amber-300">3rd</span>
              </div>
              <div className="mt-1 px-2 py-0.2 rounded bg-gradient-to-r from-amber-700 to-yellow-800 text-[8px] font-black text-amber-100 shadow-sm truncate max-w-[80px]">
                {thirdPlace?.name || thirdPlace?.username || "NAVEEM"}
              </div>
              <span className="font-mono font-black text-[9.5px] text-yellow-300 mt-0.5">
                🪙 {safeFormatNumber(thirdPlace?.coins ?? thirdPlace?.amount ?? thirdPlace?.winnings ?? 20000)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
