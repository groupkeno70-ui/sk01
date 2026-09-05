// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import { teenPattiAudio } from "./TeenPattiSoundEngine";

export interface PlayingCard {
  rank: string;
  suit: "♠" | "♥" | "♦" | "♣";
}

interface Props {
  card?: PlayingCard;
  faceUp: boolean;
  delay?: number;
  dealDelay?: number;
  dealOriginX?: number;
  dealOriginY?: number;
  highlight?: boolean;
  size?: "sm" | "md";
  soundEnabled?: boolean;
}

export default function FlipCard({
  card,
  faceUp,
  delay = 0,
  dealDelay = 0,
  dealOriginX = 0,
  dealOriginY = -145,
  highlight = false,
  size = "sm",
  soundEnabled = true,
}: Props) {
  const [dealt, setDealt] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  useEffect(() => {
    const t = setTimeout(() => {
      setDealt(true);
      if (soundEnabledRef.current) teenPattiAudio.playDealCard();
    }, dealDelay);
    return () => clearTimeout(t);
  }, [dealDelay]);

  useEffect(() => {
    if (!faceUp) {
      setFlipped(false);
      return;
    }
    const t = setTimeout(() => {
      setFlipped(true);
      if (soundEnabledRef.current) teenPattiAudio.playDealCard();
    }, delay);
    return () => clearTimeout(t);
  }, [faceUp, delay]);

  const dims = size === "sm" ? "w-[31px] h-[45px] sm:w-[34px] sm:h-[48px]" : "w-[36px] h-[52px]";
  const isRed = card && (card.suit === "♥" || card.suit === "♦");

  return (
    <div
      className={`relative ${dims} select-none shrink-0`}
      style={{
        perspective: "800px",
        transform: dealt
          ? "translate3d(0, 0, 0) rotate(0deg)"
          : `translate3d(${dealOriginX}px, ${dealOriginY}px, 0) rotate(${dealOriginX / 8}deg) scale(.78)`,
        opacity: dealt ? 1 : 0,
        transition: "transform 550ms cubic-bezier(.12,.8,.2,1.14), opacity 150ms ease-out",
      }}
    >
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 450ms cubic-bezier(.4,.05,.2,1)",
        }}
      >
        {/* BACK - Blue/Cyan Diamond Lattice Card matching reference */}
        <div
          className="absolute inset-0 rounded-[4px] border border-[#a0d2eb] shadow-[0_1px_3px_rgba(0,0,0,0.35)] flex items-center justify-center bg-[#468faf] overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Cyan/Blue Diamond Lattice Pattern */}
          <div className="absolute inset-[1.5px] rounded-[2.5px] border border-white/80 bg-[#5496b8] overflow-hidden flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 30 45" preserveAspectRatio="none">
              <defs>
                <pattern id="blueDiamondGridExactZoom" width="5.5" height="5.5" patternUnits="userSpaceOnUse">
                  <path d="M 2.75,0 L 5.5,2.75 L 2.75,5.5 L 0,2.75 Z" fill="#8ec7e3" stroke="#ffffff" strokeWidth="0.4" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#blueDiamondGridExactZoom)" />
            </svg>
          </div>
        </div>

        {/* FRONT - White Card with Rank and Suit */}
        <div
          className={`absolute inset-0 rounded-[4px] bg-white border border-[#94a3b8] shadow-[0_1px_3px_rgba(0,0,0,0.35)] flex flex-col justify-between p-0.5 overflow-hidden ${
            isRed ? "text-[#dc2626]" : "text-[#0f172a]"
          }`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {card ? (
            <>
              {/* Top-left Rank & Suit */}
              <div className="flex flex-col items-center w-fit leading-none pl-0.5 pt-0.2">
                <span className="text-[11px] sm:text-[12px] font-black tracking-tighter">
                  {card.rank}
                </span>
                <span className="text-[9px] sm:text-[10px] leading-none -mt-0.5">
                  {card.suit}
                </span>
              </div>

              {/* Center Big Suit */}
              <div className="text-[16px] sm:text-[18px] leading-none mx-auto -my-1">
                {card.suit}
              </div>

              {/* Bottom-right Rank & Suit (Upside down) */}
              <div className="flex flex-col items-center w-fit leading-none pr-0.5 pb-0.2 self-end rotate-180 opacity-75">
                <span className="text-[8px] sm:text-[9px] font-bold">
                  {card.rank}
                </span>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}