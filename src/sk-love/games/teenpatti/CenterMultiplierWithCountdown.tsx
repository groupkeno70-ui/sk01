// @ts-nocheck
import React, { useEffect, useRef } from "react";
import CountdownClock from "./CountdownClock";
import { teenPattiAudio } from "./TeenPattiSoundEngine";

interface Props {
  seconds: number;
  showCountdown: boolean;
  totalPot: number;
  userBet: number;
  heldChip?: number | null;
}

export default function CenterMultiplierWithCountdown({
  seconds,
  showCountdown = true,
  totalPot = 6400,
  userBet = 0,
}: Props) {
  const isUrgentCountdown = showCountdown && seconds <= 3 && seconds > 0;
  const prevPlayedSecRef = useRef<number | null>(null);

  // Play countdown audio: 15 to 4 (tick sound), 3 to 1 (urgent countdown beep)
  useEffect(() => {
    if (!showCountdown || seconds <= 0) {
      prevPlayedSecRef.current = null;
      return;
    }

    if (prevPlayedSecRef.current !== seconds) {
      prevPlayedSecRef.current = seconds;

      if (seconds >= 4 && seconds <= 15) {
        teenPattiAudio.playTick();
      } else if (seconds <= 3 && seconds > 0) {
        teenPattiAudio.playWarningBeep(seconds);
      }
    }
  }, [seconds, showCountdown]);

  return (
    <div className="relative flex flex-col items-center justify-center select-none w-full max-w-[210px] mx-auto">
      {/* 👑 Golden Royal Crown (Normal State) */}
      {!isUrgentCountdown && (
        <div className="relative z-20 filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] -mb-[18px]">
          <svg viewBox="0 0 80 50" className="w-10 h-7 sm:w-11 sm:h-7.5" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="crownGoldCenter" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="25%" stopColor="#fde047" />
                <stop offset="65%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
              <radialGradient id="crownCapCenter" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="60%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </radialGradient>
            </defs>

            {/* Red Velvet Inner Cap */}
            <path d="M 22,35 Q 26,16 40,14 Q 54,16 58,35 Z" fill="url(#crownCapCenter)" />

            {/* Crown Base & Spikes */}
            <path
              d="M 12,38 
                 L 16,18 L 28,28 L 40,8 L 52,28 L 64,18 L 68,38 
                 Q 40,44 12,38 Z"
              fill="url(#crownGoldCenter)"
              stroke="#78350f"
              strokeWidth="1"
            />

            {/* Jewels on Spike Tips */}
            <circle cx="16" cy="18" r="2.5" fill="#ffffff" stroke="#eab308" strokeWidth="0.8" />
            <circle cx="40" cy="8" r="3.2" fill="#60a5fa" stroke="#ffffff" strokeWidth="0.8" />
            <circle cx="64" cy="18" r="2.5" fill="#ffffff" stroke="#eab308" strokeWidth="0.8" />

            {/* Crown Base Rim with Rubies */}
            <rect x="14" y="36" width="52" height="5" rx="2" fill="url(#crownGoldCenter)" stroke="#78350f" strokeWidth="0.8" />
            <circle cx="24" cy="38.5" r="1.5" fill="#ef4444" />
            <circle cx="40" cy="38.5" r="1.8" fill="#3b82f6" />
            <circle cx="56" cy="38.5" r="1.5" fill="#ef4444" />
          </svg>
        </div>
      )}

      {/* Top Arch Dome */}
      <div className="relative z-10 w-[58%] h-6 rounded-t-full border-2 border-b-0 border-[#77bdd0]/60 bg-[#2d6f85]/40" />

      {/* 🪟 Translucent Glass Multiplier Card */}
      <div className="relative z-10 -mt-1 w-full bg-[#27667c]/45 backdrop-blur-sm border-2 border-[#77bdd0]/60 rounded-xl overflow-hidden shadow-[0_3px_10px_rgba(0,0,0,0.25)]">
        {/* Multipliers List */}
        <div className="pt-1.5 pb-1 px-3 text-[9px] font-bold tracking-tight text-white leading-tight">
          <div className="flex items-center justify-between">
            <span>Straight <span className="text-[#a3e635] font-bold font-mono">x2</span></span>
            <span>Flush <span className="text-[#a3e635] font-bold font-mono">x4</span></span>
          </div>
          <div className="text-center mt-0.5">
            <span>Straight Flush <span className="text-[#facc15] font-bold font-mono">x10</span></span>
          </div>
          <div className="text-center mt-0.5">
            <span>Leopard <span className="text-[#a3e635] font-bold font-mono">x25</span></span>
          </div>
        </div>

        {/* Bottom Split Bar: Pot / Mine */}
        <div className="py-0.5 bg-[#174659]/60 border-t border-[#77bdd0]/30 flex items-center justify-center font-mono font-bold text-[8.5px]">
          <span className="text-white drop-shadow-sm">{totalPot.toLocaleString()}</span>
          <span className="text-[#4ade80] drop-shadow-sm">/{userBet.toLocaleString()}</span>
        </div>
      </div>

      {/* ⏰ Centered Vintage Alarm Clock (When seconds > 3 or when not urgent) */}
      {!isUrgentCountdown && (
        <div className="relative z-20 mt-1">
          <CountdownClock seconds={showCountdown ? seconds : 0} />
        </div>
      )}

      {/* 🌟 GIANT 3, 2, 1 COUNTDOWN POP ANIMATION 🌟 */}
      {isUrgentCountdown && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none -mt-4">
          {/* Giant Translucent Number in Background */}
          <div
            key={`bg-${seconds}`}
            className="absolute text-[140px] font-black leading-none opacity-40 filter drop-shadow-[0_0_15px_#eab308] animate-in zoom-in-50 duration-300 select-none"
            style={{
              background: "linear-gradient(180deg, #ec4899 0%, #f97316 50%, #eab308 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              WebkitTextStroke: "2.5px #a3e635",
            }}
          >
            {seconds}
          </div>

          {/* Rotating Sunburst Light Rays behind Center Number */}
          <div className="absolute w-40 h-40 opacity-70 pointer-events-none">
            <svg viewBox="0 0 200 200" className="w-full h-full animate-spin" style={{ animationDuration: "12s" }}>
              <defs>
                <radialGradient id="urgentSunbeam" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
                  <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
                </radialGradient>
              </defs>
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <polygon
                  key={deg}
                  points="100,100 86,0 114,0"
                  transform={`rotate(${deg} 100 100)`}
                  fill="url(#urgentSunbeam)"
                />
              ))}
            </svg>
          </div>

          {/* Foreground Number Container with Crown */}
          <div
            key={`fg-${seconds}`}
            className="relative z-50 flex flex-col items-center justify-center animate-in zoom-in-75 bounce-in duration-300"
          >
            {/* Crown on top of number */}
            <div className="relative -mb-3 z-50 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] scale-110">
              <svg viewBox="0 0 80 50" className="w-12 h-8" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="crownGoldUrgent" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fffbeb" />
                    <stop offset="25%" stopColor="#fde047" />
                    <stop offset="65%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#78350f" />
                  </linearGradient>
                </defs>
                <path d="M 22,35 Q 26,16 40,14 Q 54,16 58,35 Z" fill="#dc2626" />
                <path
                  d="M 12,38 L 16,18 L 28,28 L 40,8 L 52,28 L 64,18 L 68,38 Q 40,44 12,38 Z"
                  fill="url(#crownGoldUrgent)"
                  stroke="#78350f"
                  strokeWidth="1"
                />
                <circle cx="16" cy="18" r="2.5" fill="#ffffff" stroke="#eab308" strokeWidth="0.8" />
                <circle cx="40" cy="8" r="3.2" fill="#60a5fa" stroke="#ffffff" strokeWidth="0.8" />
                <circle cx="64" cy="18" r="2.5" fill="#ffffff" stroke="#eab308" strokeWidth="0.8" />
              </svg>
            </div>

            {/* Glowing 3D Countdown Number */}
            <span
              className="text-[68px] sm:text-[76px] font-black leading-none filter drop-shadow-[0_0_20px_#eab308] drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] select-none"
              style={{
                background: "linear-gradient(180deg, #f43f5e 0%, #ec4899 40%, #f97316 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                WebkitTextStroke: "2px #bef264",
              }}
            >
              {seconds}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}