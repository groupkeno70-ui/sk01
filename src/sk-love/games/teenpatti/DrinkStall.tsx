// @ts-nocheck
import React from "react";
import FlipCard, { PlayingCard } from "./FlipCard";
import CasinoChip from "./CasinoChip";
import { OrangeCocktailDrink, RedCocktailFlanDrink, BeerMugDrink } from "./DrinkIllustrations";

export type StallDrinkType = "orange" | "cocktail" | "beer";

interface Props {
  stallKey: "A" | "B" | "C";
  drinkType: StallDrinkType;
  cards?: PlayingCard[];
  revealed: boolean;
  pot: number;
  myBet: number;
  isWinner: boolean;
  handRank?: string | null;
  disabled: boolean;
  onClick: () => void;
  soundEnabled?: boolean;
}

const formatPotKMB = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(num % 1000 === 0 ? 0 : 1)}K`;
  return `${num}`;
};

// 3D Faceted Gold Star for the Winner Ribbon
function GoldStar3D({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] shrink-0"
    >
      <defs>
        <linearGradient id="starFacetLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#fff275" />
          <stop offset="100%" stopColor="#ffd700" />
        </linearGradient>
        <linearGradient id="starFacetDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffc400" />
          <stop offset="60%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      {/* Top Point */}
      <polygon points="30,2 30,30 39,21" fill="url(#starFacetLight)" />
      <polygon points="30,2 30,30 21,21" fill="url(#starFacetDark)" />
      {/* Right Point */}
      <polygon points="58,21 30,30 43,38" fill="url(#starFacetLight)" />
      <polygon points="58,21 30,30 39,21" fill="url(#starFacetDark)" />
      {/* Bottom Right Point */}
      <polygon points="48,56 30,30 30,44" fill="url(#starFacetLight)" />
      <polygon points="48,56 30,30 43,38" fill="url(#starFacetDark)" />
      {/* Bottom Left Point */}
      <polygon points="12,56 30,30 17,38" fill="url(#starFacetLight)" />
      <polygon points="12,56 30,30 30,44" fill="url(#starFacetDark)" />
      {/* Left Point */}
      <polygon points="2,21 30,30 21,21" fill="url(#starFacetLight)" />
      <polygon points="2,21 30,30 17,38" fill="url(#starFacetDark)" />
    </svg>
  );
}

export default function DrinkStall({
  stallKey,
  drinkType,
  cards,
  revealed = false,
  pot = 0,
  myBet = 0,
  isWinner = false,
  handRank = null,
  disabled = false,
  onClick,
  soundEnabled = true,
}: Props) {
  const DrinkComponent =
    drinkType === "orange"
      ? OrangeCocktailDrink
      : drinkType === "cocktail"
      ? RedCocktailFlanDrink
      : BeerMugDrink;

  const dealOriginX = stallKey === "A" ? 120 : stallKey === "C" ? -120 : 0;
  const dealStart = stallKey === "A" ? 0 : stallKey === "B" ? 250 : 500;

  const borderColor = isWinner ? "#e6ff54" : "#5ca2b7";
  const glowFilter = isWinner
    ? "drop-shadow(0 0 7px #e6ff54) drop-shadow(0 0 16px rgba(230, 255, 84, 0.75))"
    : "drop-shadow(0 2px 5px rgba(0, 0, 0, 0.35))";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative flex flex-col items-center w-full max-w-[114px] select-none transition-transform duration-150 ${
        disabled ? "cursor-default" : "cursor-pointer active:scale-[0.98]"
      } ${isWinner ? "z-30" : "z-10"}`}
    >
      {/* 🌟 9 GLOWING PEARL MARQUEE DOTS (WINNER ARCH) 🌟 */}
      {isWinner && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-[96px] h-[46px] pointer-events-none z-40">
          <svg viewBox="0 0 100 50" className="w-full h-full">
            {[
              { cx: 8, cy: 45, r: 2.8, op: 0.7 },
              { cx: 14, cy: 31, r: 3.2, op: 0.85 },
              { cx: 24, cy: 19, r: 3.6, op: 0.95 },
              { cx: 37, cy: 10, r: 4.0, op: 1 },
              { cx: 50, cy: 7, r: 4.6, op: 1 },
              { cx: 63, cy: 10, r: 4.0, op: 1 },
              { cx: 76, cy: 19, r: 3.6, op: 0.95 },
              { cx: 86, cy: 31, r: 3.2, op: 0.85 },
              { cx: 92, cy: 45, r: 2.8, op: 0.7 },
            ].map((pt, i) => (
              <g key={i}>
                <circle
                  cx={pt.cx}
                  cy={pt.cy}
                  r={pt.r + 2.5}
                  fill="#ffffff"
                  opacity={pt.op * 0.4}
                  className="animate-pulse"
                />
                <circle
                  cx={pt.cx}
                  cy={pt.cy}
                  r={pt.r}
                  fill="#ffffff"
                  stroke="#e0f2fe"
                  strokeWidth="0.5"
                  opacity={pt.op}
                  className="filter drop-shadow-[0_0_4px_rgba(255,255,255,1)]"
                />
              </g>
            ))}
          </svg>
        </div>
      )}

      {/* CONTAINER WITH EXACT SVG SEAMLESS FRAME */}
      <div className="relative w-full flex flex-col items-center">
        {/* SVG Unified Vector Frame: Exact Top Dome Arch + Horizontal Shoulders + Rounded Box */}
        <svg
          viewBox="0 0 100 180"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          style={{ filter: glowFilter }}
        >
          <defs>
            <linearGradient id={`stallBgGradExact-${stallKey}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#255a6d" stopOpacity="0.88" />
              <stop offset="30%" stopColor="#1e4e60" stopOpacity="0.90" />
              <stop offset="85%" stopColor="#153e4e" stopOpacity="0.94" />
              <stop offset="85%" stopColor="#0f2b37" stopOpacity="0.97" />
              <stop offset="100%" stopColor="#0a202a" stopOpacity="0.99" />
            </linearGradient>
          </defs>

          {/* Unified Silhouette Path */}
          <path
            d="
              M 14, 45
              C 14, 3, 86, 3, 86, 45
              L 92, 45
              Q 98, 45, 98, 51
              L 98, 172
              Q 98, 178, 92, 178
              L 8, 178
              Q 2, 178, 2, 172
              L 2, 51
              Q 2, 45, 8, 45
              Z
            "
            fill={`url(#stallBgGradExact-${stallKey})`}
            stroke={borderColor}
            strokeWidth={isWinner ? "2.6" : "1.6"}
          />

          {/* Mine Divider Line */}
          <line
            x1="3"
            y1="154"
            x2="97"
            y2="154"
            stroke={borderColor}
            strokeWidth="0.8"
            opacity={isWinner ? "0.85" : "0.35"}
          />
        </svg>

        {/* TOP DRINK GRAPHIC (SITTING INSIDE THE ARCH) */}
        <div className="relative z-10 pt-2 pb-1 flex justify-center filter drop-shadow-[0_3px_6px_rgba(0,0,0,0.55)]">
          <DrinkComponent className="w-13 h-13 sm:w-14 sm:h-14" />
        </div>

        {/* CARDS CONTAINER */}
        <div className="relative z-10 px-1 w-full flex flex-col items-center">
          <div className="relative flex justify-center items-center w-full">
            {/* 3 Overlapping Cards */}
            <div className="flex -space-x-3 items-center justify-center p-0.5">
              <div className="z-10 shadow-[0_2px_4px_rgba(0,0,0,0.4)] rounded-[4px]">
                <FlipCard
                  card={cards?.[0]}
                  faceUp={true}
                  dealDelay={dealStart}
                  dealOriginX={dealOriginX}
                  size="sm"
                  soundEnabled={soundEnabled}
                />
              </div>
              <div className="z-20 shadow-[0_2px_4px_rgba(0,0,0,0.4)] rounded-[4px]">
                <FlipCard
                  card={cards?.[1]}
                  faceUp={revealed}
                  delay={200}
                  dealDelay={dealStart + 150}
                  dealOriginX={dealOriginX}
                  size="sm"
                  soundEnabled={soundEnabled}
                />
              </div>
              <div className="z-30 shadow-[0_2px_4px_rgba(0,0,0,0.4)] rounded-[4px]">
                <FlipCard
                  card={cards?.[2]}
                  faceUp={revealed}
                  delay={400}
                  dealDelay={dealStart + 300}
                  dealOriginX={dealOriginX}
                  size="sm"
                  soundEnabled={soundEnabled}
                />
              </div>
            </div>

            {/* 🎗️ HAND RANK RIBBON WITH 4 3D STARS (WHEN REVEALED) 🎗️ */}
            {revealed && (
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-40 w-[118%] flex items-center justify-center pointer-events-none">
                {isWinner ? (
                  /* 🏆 WINNER RED-ORANGE RIBBON WITH 4 3D STARS 🏆 */
                  <div className="relative flex items-center justify-center w-full">
                    {/* Left 2 Stars: Outer larger star + Inner smaller star */}
                    <div className="absolute -left-3.5 flex items-center -space-x-2 z-50">
                      <GoldStar3D size={21} />
                      <div className="-mt-2.5">
                        <GoldStar3D size={16} />
                      </div>
                    </div>

                    {/* Central Red-Orange Ribbon Banner */}
                    <div className="relative w-full mx-1">
                      {/* Left Fold Tail */}
                      <div className="absolute -left-2 top-[3px] w-3 h-3.5 bg-[#991b1b] -skew-y-12 -z-10 shadow-sm" />
                      {/* Right Fold Tail */}
                      <div className="absolute -right-2 top-[3px] w-3 h-3.5 bg-[#991b1b] skew-y-12 -z-10 shadow-sm" />

                      <div className="w-full py-0.5 bg-gradient-to-r from-[#f97316] via-[#ef4444] to-[#f97316] border-y border-[#fed7aa] text-center shadow-[0_2px_5px_rgba(0,0,0,0.6)]">
                        <span className="text-[10px] font-black text-white tracking-wide uppercase drop-shadow-sm">
                          Single
                        </span>
                      </div>
                    </div>

                    {/* Right 2 Stars: Inner smaller star + Outer larger star */}
                    <div className="absolute -right-3.5 flex items-center -space-x-2 z-50">
                      <div className="-mt-2.5">
                        <GoldStar3D size={16} />
                      </div>
                      <GoldStar3D size={21} />
                    </div>
                  </div>
                ) : (
                  /* 🎗️ NORMAL YELLOW RIBBON 🎗️ */
                  <div className="relative flex items-center justify-center w-full">
                    <div className="relative w-full mx-1">
                      <div className="absolute -left-2 top-[3px] w-3 h-3 bg-[#b45309] -skew-y-12 -z-10" />
                      <div className="absolute -right-2 top-[3px] w-3 h-3 bg-[#b45309] skew-y-12 -z-10" />
                      <div className="w-full py-0.5 bg-gradient-to-r from-[#f59e0b] via-[#fde047] to-[#f59e0b] border-y border-[#fef08a] text-center shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                        <span className="text-[9.5px] font-black text-[#78350f] tracking-wide uppercase drop-shadow-sm">
                          Single
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* POT LABEL */}
          <div className="mt-2 text-center text-[11.5px] font-bold text-white tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
            Pot:{formatPotKMB(pot)}
          </div>

          {/* MULTIPLIER (2.9x) & CHIPS */}
          <div className="relative h-8 flex items-center justify-center my-0.5 w-full">
            <span className="font-sans font-black text-[22px] tracking-tight text-[#112935] select-none">
              2.9x
            </span>

            {/* Scattered mini chips for normal state */}
            {!revealed && stallKey === "A" && (
              <>
                <div
                  className="absolute pointer-events-none filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  style={{ top: "68%", left: "30%", transform: "translate(-50%, -50%)" }}
                >
                  <CasinoChip value={1000} size="xs" />
                </div>
                <div
                  className="absolute pointer-events-none filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  style={{ top: "32%", left: "78%", transform: "translate(-50%, -50%)" }}
                >
                  <CasinoChip value={1000} size="xs" />
                </div>
              </>
            )}
            {!revealed && stallKey === "B" && (
              <>
                <div
                  className="absolute pointer-events-none filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
                >
                  <CasinoChip value={100} size="xs" />
                </div>
                <div
                  className="absolute pointer-events-none filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  style={{ top: "35%", left: "80%", transform: "translate(-50%, -50%)" }}
                >
                  <CasinoChip value={1000} size="xs" />
                </div>
              </>
            )}
            {!revealed && stallKey === "C" && (
              <>
                <div
                  className="absolute pointer-events-none filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  style={{ top: "45%", left: "14%", transform: "translate(-50%, -50%)" }}
                >
                  <CasinoChip value={1000} size="xs" />
                </div>
                <div
                  className="absolute pointer-events-none filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  style={{ top: "68%", left: "70%", transform: "translate(-50%, -50%)" }}
                >
                  <CasinoChip value={100} size="xs" />
                </div>
              </>
            )}
          </div>

          {/* MINE FOOTER */}
          <div className="py-1 text-center font-bold text-[11px] pb-1.5 w-full">
            <span className="text-[#fde047] drop-shadow-sm">Mine:{myBet}</span>
          </div>
        </div>
      </div>
    </button>
  );
}