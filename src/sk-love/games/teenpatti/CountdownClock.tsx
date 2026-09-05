// @ts-nocheck
import React from "react";

interface Props {
  seconds: number;
  className?: string;
}

export default function CountdownClock({ seconds, className = "" }: Props) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-9 h-9 sm:w-10 sm:h-10 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Metallic Bell Gradient */}
          <linearGradient id="alarmBellGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>
          {/* Cyan/Blue Clock Ring Gradient */}
          <linearGradient id="alarmRingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="50%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
          {/* Center Dial Gradient */}
          <radialGradient id="alarmDialGrad" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="85%" stopColor="#e0f2fe" />
            <stop offset="100%" stopColor="#bae6fd" />
          </radialGradient>
        </defs>

        {/* Left Twin Bell */}
        <ellipse
          cx="22"
          cy="22"
          rx="11"
          ry="6.5"
          transform="rotate(-38 22 22)"
          fill="url(#alarmBellGrad)"
          stroke="#78350f"
          strokeWidth="1.2"
        />
        {/* Left Bell Leg */}
        <line x1="26" y1="26" x2="34" y2="34" stroke="#a16207" strokeWidth="2.5" strokeLinecap="round" />

        {/* Right Twin Bell */}
        <ellipse
          cx="78"
          cy="22"
          rx="11"
          ry="6.5"
          transform="rotate(38 78 22)"
          fill="url(#alarmBellGrad)"
          stroke="#78350f"
          strokeWidth="1.2"
        />
        {/* Right Bell Leg */}
        <line x1="74" y1="26" x2="66" y2="34" stroke="#a16207" strokeWidth="2.5" strokeLinecap="round" />

        {/* Top Center Hammer Handle */}
        <rect x="47" y="15" width="6" height="7" rx="1.5" fill="#ca8a04" stroke="#78350f" strokeWidth="0.8" />

        {/* Bottom Feet */}
        <path d="M 28,78 L 20,90" stroke="#0369a1" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 72,78 L 80,90" stroke="#0369a1" strokeWidth="3.5" strokeLinecap="round" />

        {/* Clock Outer Blue/Cyan Body */}
        <circle
          cx="50"
          cy="54"
          r="34"
          fill="url(#alarmRingGrad)"
          stroke="#e0f2fe"
          strokeWidth="1.5"
        />

        {/* Clock Center Dial Face */}
        <circle
          cx="50"
          cy="54"
          r="26"
          fill="url(#alarmDialGrad)"
          stroke="#0284c7"
          strokeWidth="1.2"
        />

        {/* Numeric Text */}
        <text
          x="50"
          y="62.5"
          textAnchor="middle"
          fill="#0284c7"
          fontSize="24"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          className="filter drop-shadow-sm"
        >
          {Math.max(0, seconds)}
        </text>
      </svg>
    </div>
  );
}