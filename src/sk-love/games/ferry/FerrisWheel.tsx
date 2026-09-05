// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { ferryAudio } from "./FerrySoundEngine";

export interface WheelSlotData {
  index: number;
  key: string;
  label: string;
  multiplier: number;
  x: number; // Percentage from left
  y: number; // Percentage from top
  width: number;
  height: number;
}

export const FERRY_WHEEL_SLOTS: WheelSlotData[] = [
  { index: 0, key: "chicken",    label: "Chicken",    multiplier: 45, x: 50, y: 19.5, width: 23, height: 19 },
  { index: 1, key: "octopus",    label: "Octopus",    multiplier: 25, x: 74.5, y: 26.5, width: 22, height: 18 },
  { index: 2, key: "fish",       label: "Fish",       multiplier: 15, x: 83.5, y: 50.0, width: 22, height: 18 },
  { index: 3, key: "meat",       label: "Meat",       multiplier: 10, x: 74.5, y: 73.5, width: 22, height: 18 },
  { index: 4, key: "grapes",     label: "Grapes",     multiplier: 5,  x: 50, y: 84.5, width: 22, height: 18 },
  { index: 5, key: "cabbage",    label: "Cabbage",    multiplier: 5,  x: 25.5, y: 73.5, width: 22, height: 18 },
  { index: 6, key: "corn",       label: "Corn",       multiplier: 5,  x: 16.5, y: 50.0, width: 22, height: 18 },
  { index: 7, key: "strawberry", label: "Strawberry", multiplier: 5,  x: 25.5, y: 26.5, width: 22, height: 18 },
];

interface Props {
  spinning: boolean;
  targetIndex: number | null;
  countdown: number;
  pots: Record<string, number>;
  userBets: Record<string, number>;
  selectedChip: number;
  onSlotClick: (key: string) => void;
  disabled?: boolean;
}

const formatPot = (amount: number) => {
  if (!amount || amount <= 0) return "";
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(amount % 1000000 === 0 ? 0 : 1)}M`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`;
  return `${amount}`;
};

export default function FerrisWheel({
  spinning = false,
  targetIndex = null,
  countdown = 7,
  pots = {},
  userBets = {},
  selectedChip = 1000,
  onSlotClick,
  disabled = false,
}: Props) {
  // Highlight index that cycles around the wheel during spin
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const spinTimeoutRef = useRef<any>(null);

  // Play urgent countdown beep sound on 3, 2, 1
  useEffect(() => {
    if (countdown <= 3 && countdown > 0 && !spinning) {
      ferryAudio.playCountdownBeep(countdown);
    }
  }, [countdown, spinning]);

  // Wheel Spin Animation & Traveling Shadow Highlight Effect
  useEffect(() => {
    if (spinning) {
      let currentIdx = highlightIndex !== null ? highlightIndex : 0;
      let speed = 70; // Starting fast step duration (ms)
      let elapsed = 0;
      const totalDuration = 4800; // Total 4.8s spin

      const step = () => {
        currentIdx = (currentIdx + 1) % 8;
        setHighlightIndex(currentIdx);
        ferryAudio.playWheelTick();

        elapsed += speed;
        // Decelerate toward the winning slot after 3s
        if (elapsed > 3000 && targetIndex !== null) {
          speed = Math.min(speed * 1.15, 380);
        }

        if (elapsed < totalDuration || (targetIndex !== null && currentIdx !== targetIndex)) {
          spinTimeoutRef.current = setTimeout(step, speed);
        } else {
          // Landed on target index
          if (targetIndex !== null) {
            setHighlightIndex(targetIndex);
          }
        }
      };

      spinTimeoutRef.current = setTimeout(step, speed);

      return () => {
        if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current);
      };
    } else {
      if (targetIndex !== null) {
        setHighlightIndex(targetIndex);
      }
    }
  }, [spinning, targetIndex]);

  const isUrgent = countdown <= 3 && countdown > 0 && !spinning;

  return (
    <div className="relative w-full max-w-[480px] aspect-square mx-auto select-none overflow-visible px-0 sm:px-1">
      {/* ── 1. MAIN FERRIS WHEEL BACKGROUND IMAGE (CLEAN HIGH-RES) ── */}
      <img
        src="/ferry-wheel-bg.jpg"
        alt="Ferris Wheel Game"
        className="w-full h-full object-contain pointer-events-none drop-shadow-xl"
      />

      {/* ── 2. SPINNING ROUND SHADOW & LIGHT SWEEP AURA ── */}
      {spinning && (
        <div
          className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[78%] aspect-square rounded-full pointer-events-none z-10 animate-spin"
          style={{
            animationDuration: "1.1s",
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(254, 240, 138, 0.2) 50deg, rgba(250, 204, 21, 0.6) 110deg, rgba(255, 255, 255, 0.95) 150deg, transparent 180deg)",
            filter: "blur(5px)",
            mixBlendMode: "screen",
          }}
        />
      )}

      {/* ── 3. ROTATING SHADOW GLOW AROUND WHEEL RIM ── */}
      <div
        className={`absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-square rounded-full pointer-events-none z-10 transition-opacity duration-300 ${
          spinning ? "opacity-100" : "opacity-0"
        }`}
        style={{
          boxShadow:
            "0 0 30px rgba(250, 204, 21, 0.8), inset 0 0 30px rgba(234, 179, 8, 0.6), 0 0 60px rgba(239, 68, 68, 0.5)",
        }}
      />

      {/* ── 4. 8 INTERACTIVE WHEEL SLOTS (HOTSPOTS & SHADOW HIGHLIGHTS) ── */}
      {FERRY_WHEEL_SLOTS.map((slot) => {
        const isHighlighted = highlightIndex === slot.index;
        const isWinning = targetIndex === slot.index && !spinning;
        const hasBet = (userBets[slot.key] || 0) > 0;
        const potAmount = pots[slot.key];

        return (
          <button
            key={slot.key}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onSlotClick(slot.key)}
            className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-2xl flex items-center justify-center transition-all duration-150 ${
              disabled ? "cursor-default" : "cursor-pointer active:scale-95 hover:scale-105"
            }`}
            style={{
              left: `${slot.x}%`,
              top: `${slot.y}%`,
              width: `${slot.width}%`,
              height: `${slot.height}%`,
            }}
          >
            {/* 🌟 Spinning Traveling Shadow / Golden Highlight Effect 🌟 */}
            {isHighlighted && (
              <div
                className="absolute -inset-1 rounded-2xl pointer-events-none animate-pulse z-30"
                style={{
                  background:
                    "radial-gradient(circle, rgba(254, 240, 138, 0.5) 0%, rgba(234, 179, 8, 0.3) 60%, transparent 100%)",
                  boxShadow:
                    "0 0 16px #facc15, 0 0 32px rgba(250, 204, 21, 0.85), inset 0 0 12px rgba(255, 255, 255, 0.9)",
                  border: "2.5px solid #fef08a",
                }}
              />
            )}

            {/* 🏆 Winning Celebration Shadow Halo 🏆 */}
            {isWinning && (
              <div
                className="absolute -inset-2 rounded-2xl pointer-events-none z-30 animate-bounce"
                style={{
                  boxShadow:
                    "0 0 22px #eab308, 0 0 45px rgba(234, 179, 8, 0.95), inset 0 0 18px #fef08a",
                  border: "3px solid #ffffff",
                }}
              />
            )}

            {/* User Bet Indicator Chip over Slot */}
            {hasBet && (
              <div className="absolute -top-1.5 -right-1.5 z-40 bg-[#991b1b] border-2 border-yellow-300 rounded-full px-1.5 py-0.2 shadow-md flex items-center gap-0.5">
                <span className="text-[8px] text-yellow-200">🪙</span>
                <span className="text-[8.5px] font-black text-white font-mono leading-none">
                  {formatPot(userBets[slot.key])}
                </span>
              </div>
            )}

            {/* Real-time Pot Counter */}
            {potAmount > 0 && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-30 bg-[#3e2723]/90 border border-[#d79c5c] rounded-full px-1.5 py-0.1 text-[7.5px] font-bold text-[#fde047] shadow-sm leading-tight">
                {formatPot(potAmount)}
              </div>
            )}
          </button>
        );
      })}

      {/* ── 5. COUNTDOWN NUMBER & URGENT 3, 2, 1 COUNTDOWN ANIMATION ── */}
      <div
        className="absolute top-[60.8%] left-[49.6%] -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none flex items-center justify-center"
        style={{ width: "12%", height: "12%" }}
      >
        {/* Urgent Glowing Sunburst Aura behind Clock during 3, 2, 1 */}
        {isUrgent && (
          <div className="absolute -inset-4 rounded-full pointer-events-none animate-spin opacity-85" style={{ animationDuration: "6s" }}>
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <radialGradient id="ferryUrgentSun" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
                </radialGradient>
              </defs>
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <polygon
                  key={deg}
                  points="50,50 44,0 56,0"
                  transform={`rotate(${deg} 50 50)`}
                  fill="url(#ferryUrgentSun)"
                />
              ))}
            </svg>
          </div>
        )}

        {/* Pulsing Alarm Clock Glowing Frame during 3, 2, 1 */}
        {isUrgent && (
          <div
            className="absolute -inset-1.5 rounded-full pointer-events-none animate-ping opacity-75"
            style={{
              border: "2.5px solid #ef4444",
              boxShadow: "0 0 16px #f59e0b, inset 0 0 8px #fde047",
            }}
          />
        )}

        {/* Countdown Digit */}
        <span
          key={`cd-${countdown}`}
          className={`font-mono font-black select-none leading-none transition-all ${
            isUrgent
              ? "text-[24px] sm:text-[28px] animate-in zoom-in-75 duration-200 filter drop-shadow-[0_0_10px_#facc15]"
              : "text-[17px] sm:text-[19px] filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
          }`}
          style={{
            background: isUrgent
              ? "linear-gradient(180deg, #f43f5e 0%, #ea580c 60%, #b45309 100%)"
              : "linear-gradient(180deg, #b45309 0%, #78350f 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            WebkitTextStroke: isUrgent ? "0.8px #fef08a" : "none",
          }}
        >
          {countdown}
        </span>
      </div>

      {/* ── 6. SIDE PEDESTALS: SALAD (LEFT) & PIZZA (RIGHT) ── */}
      {/* Salad (Left Side) */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && onSlotClick("salad")}
        className="absolute bottom-[0%] left-[2%] z-20 w-[26%] h-[15%] rounded-xl flex items-center justify-center cursor-pointer active:scale-95 transition"
      >
        {(userBets["salad"] || 0) > 0 && (
          <div className="absolute top-0 right-0 z-40 bg-[#991b1b] border-2 border-yellow-300 rounded-full px-1.5 py-0.2 shadow-md text-[8px] font-black text-white font-mono">
            🪙 {formatPot(userBets["salad"])}
          </div>
        )}
      </button>

      {/* Pizza (Right Side) */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && onSlotClick("pizza")}
        className="absolute bottom-[0%] right-[2%] z-20 w-[26%] h-[15%] rounded-xl flex items-center justify-center cursor-pointer active:scale-95 transition"
      >
        {(userBets["pizza"] || 0) > 0 && (
          <div className="absolute top-0 right-0 z-40 bg-[#991b1b] border-2 border-yellow-300 rounded-full px-1.5 py-0.2 shadow-md text-[8px] font-black text-white font-mono">
            🪙 {formatPot(userBets["pizza"])}
          </div>
        )}
      </button>
    </div>
  );
}
