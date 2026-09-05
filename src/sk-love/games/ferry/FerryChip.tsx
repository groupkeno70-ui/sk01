// @ts-nocheck
import React from "react";

export const formatChipLabel = (num: number): string => {
  if (!num) return "500";
  if (num >= 1000000) {
    const val = num / 1000000;
    return val % 1 === 0 ? `${val}M` : `${val.toFixed(1)}M`;
  }
  if (num >= 1000) {
    const val = num / 1000;
    return val % 1 === 0 ? `${val}K` : `${val.toFixed(1)}K`;
  }
  return String(num);
};

interface Props {
  value: number;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const CHIP_COLOR_PALETTES: Record<
  number,
  {
    light: string;
    mid: string;
    dark: string;
    deep: string;
    border: string;
  }
> = {
  500: {
    // Green
    light: "#86efac",
    mid: "#22c55e",
    dark: "#16a34a",
    deep: "#14532d",
    border: "#bbf7d0",
  },
  1000: {
    // Blue
    light: "#93c5fd",
    mid: "#3b82f6",
    dark: "#1d4ed8",
    deep: "#1e3a8a",
    border: "#bfdbfe",
  },
  5000: {
    // Orange
    light: "#fdba74",
    mid: "#f97316",
    dark: "#ea580c",
    deep: "#7c2d12",
    border: "#fed7aa",
  },
  10000: {
    // Purple
    light: "#d8b4fe",
    mid: "#a855f7",
    dark: "#7e22ce",
    deep: "#581c87",
    border: "#e9d5ff",
  },
  50000: {
    // Pink
    light: "#f472b6",
    mid: "#ec4899",
    dark: "#db2777",
    deep: "#831843",
    border: "#fbcfe8",
  },
  1000000: {
    // Gold
    light: "#fef08a",
    mid: "#facc15",
    dark: "#ca8a04",
    deep: "#713f12",
    border: "#fef9c3",
  },
  // Fallbacks
  100: {
    light: "#86efac",
    mid: "#22c55e",
    dark: "#16a34a",
    deep: "#14532d",
    border: "#bbf7d0",
  },
  100000: {
    light: "#f472b6",
    mid: "#ec4899",
    dark: "#db2777",
    deep: "#831843",
    border: "#fbcfe8",
  },
};

export default function FerryChip({
  value,
  selected = false,
  onClick,
  disabled = false,
  className = "",
}: Props) {
  const label = formatChipLabel(value);
  const palette = CHIP_COLOR_PALETTES[value] || CHIP_COLOR_PALETTES[500];
  const uniqueId = `chip-grad-${value}-${selected ? "sel" : "norm"}`;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`relative w-[48px] xs:w-[54px] sm:w-[62px] h-[40px] xs:h-[44px] sm:h-[48px] flex flex-col items-center justify-between select-none transition-transform duration-150 shrink-0 ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-95 hover:scale-105"
      } ${selected ? "scale-105 filter drop-shadow-[0_0_8px_rgba(250,204,21,0.9)]" : ""} ${className}`}
    >
      {/* Arched Tombstone / Pedestal Chip SVG */}
      <svg viewBox="0 0 70 55" className="w-full h-full filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
        <defs>
          {/* Dynamic Stone Gradient based on Chip Color */}
          <linearGradient id={uniqueId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={palette.light} />
            <stop offset="35%" stopColor={palette.mid} />
            <stop offset="85%" stopColor={palette.dark} />
            <stop offset="100%" stopColor={palette.deep} />
          </linearGradient>

          {/* Gold Coin Gradient */}
          <radialGradient id={`coinFaceGrad-${value}`} cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#fff9c4" />
            <stop offset="40%" stopColor="#fdd835" />
            <stop offset="85%" stopColor="#f57f17" />
            <stop offset="100%" stopColor="#e65100" />
          </radialGradient>
        </defs>

        {/* Selected Glowing Outline */}
        {selected && (
          <path
            d="
              M 11,43
              L 11,20
              C 11,2 59,2 59,20
              L 59,43
              Z
            "
            fill="none"
            stroke="#facc15"
            strokeWidth="3.5"
            opacity="0.95"
          />
        )}

        {/* Tiered Base Steps */}
        <path
          d="M 5,52 L 65,52 Q 68,52 68,48 L 2,48 Q 2,52 5,52 Z"
          fill={palette.deep}
        />
        <rect
          x="4"
          y="42"
          width="62"
          height="8"
          rx="2"
          fill={`url(#${uniqueId})`}
          stroke={selected ? "#facc15" : palette.border}
          strokeWidth={selected ? "1.8" : "1.2"}
        />

        {/* Main Arched Upper Stone */}
        <path
          d="
            M 12,42
            L 12,20
            C 12,4 58,4 58,20
            L 58,42
            Z
          "
          fill={`url(#${uniqueId})`}
          stroke={selected ? "#facc15" : palette.border}
          strokeWidth={selected ? "2" : "1.5"}
        />

        {/* Recessed Coin Frame */}
        <circle
          cx="35"
          cy="20"
          r="12"
          fill={palette.deep}
          opacity="0.4"
        />

        {/* Golden Coin Icon */}
        <circle
          cx="35"
          cy="19"
          r="10"
          fill={`url(#coinFaceGrad-${value})`}
          stroke="#fff59d"
          strokeWidth="1"
        />
        {/* Star on Coin */}
        <polygon
          points="35,12 37.5,17 43,17.5 39,21 40,26 35,23.5 30,26 31,21 27,17.5 32.5,17"
          fill="#fffde7"
        />

        {/* Value Text */}
        <text
          x="35"
          y="42"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="11"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          className="filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
        >
          {label}
        </text>
      </svg>
    </button>
  );
}
