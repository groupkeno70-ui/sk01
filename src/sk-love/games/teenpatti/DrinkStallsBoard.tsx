// @ts-nocheck
import React, { useState, useEffect } from "react";
import FlipCard, { PlayingCard } from "./FlipCard";
import CasinoChip from "./CasinoChip";

export type HandKey = "A" | "B" | "C";

interface StallData {
  stallKey: HandKey;
  drinkType: "orange" | "cocktail" | "beer";
  cards?: PlayingCard[];
  pot: number;
  myBet: number;
  isWinner: boolean;
  handRank?: string | null;
  disabled: boolean;
  onClick: () => void;
}

interface Props {
  stalls: StallData[];
  revealed: boolean;
  soundEnabled?: boolean;
}

const formatPotKMB = (num: number): string => {
  if (!num || num <= 0) return "0";
  if (num >= 1000000) return `${(num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}K`;
  return `${num}`;
};

// 3D Faceted Gold Star matching the reference screenshot exactly
function GoldStar3D({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] shrink-0"
    >
      <defs>
        <linearGradient id="starFacetedLight3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#fff275" />
          <stop offset="100%" stopColor="#ffd700" />
        </linearGradient>
        <linearGradient id="starFacetedDark3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffc400" />
          <stop offset="60%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      {/* Top Point */}
      <polygon points="30,2 30,30 39,21" fill="url(#starFacetedLight3)" />
      <polygon points="30,2 30,30 21,21" fill="url(#starFacetedDark3)" />
      {/* Right Point */}
      <polygon points="58,21 30,30 43,38" fill="url(#starFacetedLight3)" />
      <polygon points="58,21 30,30 39,21" fill="url(#starFacetedDark3)" />
      {/* Bottom Right Point */}
      <polygon points="48,56 30,30 30,44" fill="url(#starFacetedLight3)" />
      <polygon points="48,56 30,30 43,38" fill="url(#starFacetedDark3)" />
      {/* Bottom Left Point */}
      <polygon points="12,56 30,30 17,38" fill="url(#starFacetedLight3)" />
      <polygon points="12,56 30,30 30,44" fill="url(#starFacetedDark3)" />
      {/* Left Point */}
      <polygon points="2,21 30,30 21,21" fill="url(#starFacetedLight3)" />
      <polygon points="2,21 30,30 17,38" fill="url(#starFacetedDark3)" />
    </svg>
  );
}

export default function DrinkStallsBoard({ stalls, revealed = false, soundEnabled = true }: Props) {
  // Track bounce animation trigger on bet
  const [bouncingStall, setBouncingStall] = useState<string | null>(null);

  const handleStallClick = (stall: StallData) => {
    if (stall.disabled) return;
    setBouncingStall(stall.stallKey);
    stall.onClick();
    setTimeout(() => {
      setBouncingStall(null);
    }, 400);
  };

  return (
    <div className="relative w-full max-w-[390px] sm:max-w-[440px] aspect-[1/0.66] mx-auto select-none overflow-visible px-0.5">
      {/* ── 1. MAIN HIGH-RES CLEAN 3-STALL BACKGROUND TEMPLATE ── */}
      <img
        src="/teenpatti-stalls-bg.jpg"
        alt="Drink Stalls"
        className="w-full h-full object-contain pointer-events-none drop-shadow-xl"
      />

      {/* ── 2. 3 INTERACTIVE STALL OVERLAYS ── */}
      <div className="absolute inset-0 grid grid-cols-3 gap-1 px-1">
        {stalls.map((stall) => {
          const dealOriginX = stall.stallKey === "A" ? 100 : stall.stallKey === "C" ? -100 : 0;
          const dealStart = stall.stallKey === "A" ? 0 : stall.stallKey === "B" ? 200 : 400;
          const isBouncing = bouncingStall === stall.stallKey;

          return (
            <button
              key={stall.stallKey}
              type="button"
              disabled={stall.disabled}
              onClick={() => handleStallClick(stall)}
              className={`relative w-full h-full flex flex-col items-center justify-between text-center select-none transition-all duration-150 ${
                stall.disabled ? "cursor-default" : "cursor-pointer active:scale-[0.98]"
              }`}
            >
              {/* 🌟 9 GLOWING PEARL MARQUEE LIGHTS OVER TOP ARCH (WINNER ONLY) 🌟 */}
              {stall.isWinner && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-[94%] h-[34%] pointer-events-none z-40">
                  <svg viewBox="0 0 100 50" className="w-full h-full">
                    {[
                      { cx: 7,  cy: 46, r: 3.2, op: 0.75 },
                      { cx: 14, cy: 30, r: 3.6, op: 0.85 },
                      { cx: 24, cy: 18, r: 4.0, op: 0.95 },
                      { cx: 36, cy: 9,  r: 4.4, op: 1 },
                      { cx: 50, cy: 6,  r: 5.0, op: 1 },
                      { cx: 64, cy: 9,  r: 4.4, op: 1 },
                      { cx: 76, cy: 18, r: 4.0, op: 0.95 },
                      { cx: 86, cy: 30, r: 3.6, op: 0.85 },
                      { cx: 93, cy: 46, r: 3.2, op: 0.75 },
                    ].map((pt, i) => (
                      <g key={i}>
                        <circle
                          cx={pt.cx}
                          cy={pt.cy}
                          r={pt.r + 2.5}
                          fill="#ffffff"
                          opacity={pt.op * 0.45}
                          className="animate-pulse"
                        />
                        <circle
                          cx={pt.cx}
                          cy={pt.cy}
                          r={pt.r}
                          fill="#ffffff"
                          stroke="#e0f2fe"
                          strokeWidth="0.6"
                          opacity={pt.op}
                          className="filter drop-shadow-[0_0_6px_rgba(255,255,255,1)]"
                        />
                      </g>
                    ))}
                  </svg>
                </div>
              )}

              {/* 🌟 WINNER NEON LIME GLOWING OUTLINE (EXACT SILHOUETTE CONTOUR) 🌟 */}
              {stall.isWinner && (
                <svg
                  viewBox="0 0 100 180"
                  preserveAspectRatio="none"
                  className="absolute inset-0 w-full h-full pointer-events-none z-30"
                  style={{
                    filter:
                      "drop-shadow(0 0 6px #e4ff54) drop-shadow(0 0 16px rgba(228, 255, 84, 0.9))",
                  }}
                >
                  <path
                    d="
                      M 14, 45
                      C 14, 3, 86, 3, 86, 45
                      L 93, 45
                      Q 98, 45, 98, 51
                      L 98, 172
                      Q 98, 178, 92, 178
                      L 8, 178
                      Q 2, 178, 2, 172
                      L 2, 51
                      Q 2, 45, 7, 45
                      Z
                    "
                    fill="none"
                    stroke="#e4ff54"
                    strokeWidth="3.2"
                  />
                </svg>
              )}

              {/* ── CARD AREA OVERLAY (TOP: ~30%, HEIGHT: ~38%) ── */}
              <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[92%] flex flex-col items-center justify-center z-20">
                {/* 3 Overlapping Playing Cards */}
                <div className="relative flex justify-center items-center w-full">
                  <div className="flex -space-x-3 items-center justify-center">
                    <div className="z-10 shadow-[0_2px_4px_rgba(0,0,0,0.5)] rounded-[4px]">
                      <FlipCard
                        card={stall.cards?.[0]}
                        faceUp={true}
                        dealDelay={dealStart}
                        dealOriginX={dealOriginX}
                        size="md"
                        soundEnabled={soundEnabled}
                      />
                    </div>
                    <div className="z-20 shadow-[0_2px_4px_rgba(0,0,0,0.5)] rounded-[4px]">
                      <FlipCard
                        card={stall.cards?.[1]}
                        faceUp={revealed}
                        delay={150}
                        dealDelay={dealStart + 120}
                        dealOriginX={dealOriginX}
                        size="md"
                        soundEnabled={soundEnabled}
                      />
                    </div>
                    <div className="z-30 shadow-[0_2px_4px_rgba(0,0,0,0.5)] rounded-[4px]">
                      <FlipCard
                        card={stall.cards?.[2]}
                        faceUp={revealed}
                        delay={300}
                        dealDelay={dealStart + 240}
                        dealOriginX={dealOriginX}
                        size="md"
                        soundEnabled={soundEnabled}
                      />
                    </div>
                  </div>

                  {/* 🎗️ HAND RANK RIBBONS (REVEALED STATE) 🎗️ */}
                  {revealed && (
                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-40 w-[118%] flex items-center justify-center pointer-events-none">
                      {stall.isWinner ? (
                        /* 🏆 WINNER RED-ORANGE RIBBON WITH 4 3D GOLD STARS 🏆 */
                        <div className="relative flex items-center justify-center w-full">
                          {/* Left 2 Stars */}
                          <div className="absolute -left-3.5 flex items-center -space-x-1.5 z-50">
                            <GoldStar3D size={21} />
                            <div className="-mt-3">
                              <GoldStar3D size={16} />
                            </div>
                          </div>

                          {/* Central Red-Orange Ribbon Banner */}
                          <div className="relative w-full mx-1">
                            <div className="absolute -left-2 top-[3px] w-3 h-4 bg-[#991b1b] -skew-y-12 -z-10" />
                            <div className="absolute -right-2 top-[3px] w-3 h-4 bg-[#991b1b] skew-y-12 -z-10" />

                            <div className="w-full py-0.5 bg-gradient-to-r from-[#f97316] via-[#ef4444] to-[#f97316] border-y border-[#fed7aa] text-center shadow-[0_2px_6px_rgba(0,0,0,0.65)]">
                              <span className="text-[10px] font-black text-white tracking-wide uppercase drop-shadow-sm">
                                {stall.handRank || "Single"}
                              </span>
                            </div>
                          </div>

                          {/* Right 2 Stars */}
                          <div className="absolute -right-3.5 flex items-center -space-x-1.5 z-50">
                            <div className="-mt-3">
                              <GoldStar3D size={16} />
                            </div>
                            <GoldStar3D size={21} />
                          </div>
                        </div>
                      ) : (
                        /* 🎗️ NORMAL GOLDEN YELLOW RIBBON 🎗️ */
                        <div className="relative flex items-center justify-center w-full">
                          {/* Left Ribbon Tail */}
                          <div className="absolute -left-1.5 top-[3px] w-2.5 h-3.5 bg-[#b45309] -skew-y-12 -z-10" />
                          {/* Right Ribbon Tail */}
                          <div className="absolute -right-1.5 top-[3px] w-2.5 h-3.5 bg-[#b45309] skew-y-12 -z-10" />

                          <div className="w-full mx-1 py-0.5 bg-gradient-to-r from-[#fde047] via-[#facc15] to-[#f59e0b] border-y border-[#fef08a] text-center shadow-sm">
                            <span className="text-[9.5px] font-black text-[#c2410c] tracking-wide uppercase drop-shadow-sm">
                              {stall.handRank || "Single"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* ── DYNAMIC POT TEXT (TOP: ~68%) ── */}
              <div className="absolute top-[68%] left-1/2 -translate-x-1/2 z-20 text-[11px] sm:text-[12px] font-black text-white tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Pot:{formatPotKMB(stall.pot)}
              </div>

              {/* ── MULTIPLIER 2.9x & ANIMATED PLACED USER BET CHIPS ── */}
              <div className="absolute top-[75%] left-1/2 -translate-x-1/2 w-full h-[12%] flex items-center justify-center z-20 pointer-events-none">
                <span className="font-sans font-black text-[20px] sm:text-[22px] tracking-tight text-[#142b36] select-none">
                  2.9x
                </span>

                {/* 🪙 ANIMATED COIN DISPLAY (ONLY PLACED WHEN USER BETS - NO DEFAULT COINS) 🪙 */}
                {stall.myBet > 0 && (
                  <div
                    className={`absolute z-30 transition-transform ${
                      isBouncing ? "scale-125 -translate-y-1" : "scale-100"
                    }`}
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div className="filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.8)] animate-in zoom-in duration-200">
                      <CasinoChip
                        value={
                          stall.myBet >= 100000
                            ? 100000
                            : stall.myBet >= 10000
                            ? 10000
                            : stall.myBet >= 1000
                            ? 1000
                            : 100
                        }
                        size="sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ── MINE VALUE (BOTTOM: ~2%) ── */}
              <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 z-20 text-[10.5px] sm:text-[11.5px] font-black text-[#fde047] drop-shadow-sm">
                Mine:{stall.myBet || 0}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
