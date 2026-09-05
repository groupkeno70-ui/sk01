// @ts-nocheck
import React from "react";

export type ChipValue = 500 | 1000 | 5000 | 10000 | 50000 | 1000000;

interface Props {
  value: number;
  selected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg" | "xs";
  className?: string;
  as?: "button" | "div";
}

export const CHIP_CONFIGS: Record<
  number,
  {
    label: string;
    bg: string;
    border: string;
    textColor: string;
    ringColor: string;
    dashColor: string;
  }
> = {
  500: {
    label: "500",
    bg: "radial-gradient(circle at 50% 50%, #22c55e 0%, #16a34a 70%, #14532d 100%)",
    border: "#86efac",
    textColor: "#ffffff",
    ringColor: "#4ade80",
    dashColor: "#ffffff",
  },
  1000: {
    label: "1K",
    bg: "radial-gradient(circle at 50% 50%, #3b82f6 0%, #1d4ed8 70%, #1e3a8a 100%)",
    border: "#93c5fd",
    textColor: "#ffffff",
    ringColor: "#60a5fa",
    dashColor: "#ffffff",
  },
  5000: {
    label: "5K",
    bg: "radial-gradient(circle at 50% 50%, #f97316 0%, #ea580c 70%, #7c2d12 100%)",
    border: "#fdba74",
    textColor: "#ffffff",
    ringColor: "#fb923c",
    dashColor: "#ffffff",
  },
  10000: {
    label: "10K",
    bg: "radial-gradient(circle at 50% 50%, #a855f7 0%, #7e22ce 70%, #581c87 100%)",
    border: "#d8b4fe",
    textColor: "#ffffff",
    ringColor: "#c084fc",
    dashColor: "#ffffff",
  },
  50000: {
    label: "50K",
    bg: "radial-gradient(circle at 50% 50%, #ec4899 0%, #db2777 70%, #831843 100%)",
    border: "#f472b6",
    textColor: "#ffffff",
    ringColor: "#f472b6",
    dashColor: "#ffffff",
  },
  1000000: {
    label: "1M",
    bg: "radial-gradient(circle at 50% 50%, #facc15 0%, #eab308 70%, #713f12 100%)",
    border: "#fef08a",
    textColor: "#ffffff",
    ringColor: "#fde047",
    dashColor: "#ffffff",
  },
  // Fallbacks for compatibility
  100: {
    label: "500",
    bg: "radial-gradient(circle at 50% 50%, #22c55e 0%, #16a34a 70%, #14532d 100%)",
    border: "#86efac",
    textColor: "#ffffff",
    ringColor: "#4ade80",
    dashColor: "#ffffff",
  },
  100000: {
    label: "50K",
    bg: "radial-gradient(circle at 50% 50%, #ec4899 0%, #db2777 70%, #831843 100%)",
    border: "#f472b6",
    textColor: "#ffffff",
    ringColor: "#f472b6",
    dashColor: "#ffffff",
  },
};

export default function CasinoChip({
  value,
  selected = false,
  onClick,
  size = "md",
  className = "",
  as,
}: Props) {
  const cfg = CHIP_CONFIGS[value] || CHIP_CONFIGS[500];

  const sizeClasses = {
    xs: "w-5 h-5 text-[8px]",
    sm: "w-7 h-7 text-[9px]",
    md: "w-10 h-10 text-[11px]",
    lg: "w-12 h-12 text-[13px]",
  }[size];

  const isButton = as === "button" || (as === undefined && typeof onClick === "function");
  const Component = isButton ? "button" : "div";

  return (
    <Component
      type={isButton ? "button" : undefined}
      onClick={onClick}
      aria-pressed={isButton ? selected : undefined}
      title={selected ? `Holding ${cfg.label}` : `Hold ${cfg.label} to bet`}
      className={`relative group rounded-full ${sizeClasses} transition-transform duration-150 flex items-center justify-center select-none shrink-0 ${
        isButton ? "cursor-pointer active:scale-95" : "pointer-events-none"
      } ${
        selected
          ? "scale-110 shadow-[0_0_12px_rgba(250,204,21,0.9)] ring-2 ring-yellow-400 ring-offset-2 ring-offset-[#25596e]"
          : "hover:scale-105 shadow-[0_2px_5px_rgba(0,0,0,0.5)]"
      } ${className}`}
      style={{
        background: cfg.bg,
        boxShadow: selected
          ? "0 0 10px rgba(250,204,21,0.85), inset 0 1px 2px rgba(255,255,255,0.4)"
          : "0 2px 4px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.3)",
      }}
    >
      {/* Outer segmented casino pattern SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 40 40">
        {/* Outer border ring */}
        <circle cx="20" cy="20" r="18.5" fill="none" stroke={cfg.border} strokeWidth="1" opacity="0.85" />
        {/* 8 Dashed edge stripes */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line
            key={deg}
            x1="20"
            y1="2"
            x2="20"
            y2="6.5"
            stroke={cfg.dashColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            transform={`rotate(${deg} 20 20)`}
          />
        ))}
        {/* Inner dotted/dashed circle */}
        <circle
          cx="20"
          cy="20"
          r="12.5"
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.8"
          strokeDasharray="2 1.5"
          opacity="0.7"
        />
      </svg>

      {/* Center value text */}
      <span
        className="relative z-10 font-black tracking-tight font-sans drop-shadow leading-none"
        style={{
          color: cfg.textColor,
          textShadow: "0 1px 2px rgba(0,0,0,0.8)",
        }}
      >
        {cfg.label}
      </span>
    </Component>
  );
}