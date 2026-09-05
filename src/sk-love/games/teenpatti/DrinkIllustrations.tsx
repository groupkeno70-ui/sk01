// @ts-nocheck
import React from "react";

export function OrangeCocktailDrink({ className = "w-12 h-12" }: { className?: string }) {
  const idPrefix = React.useId().replace(/:/g, "");
  const glassGradId = `${idPrefix}-glass-grad`;
  const orangeJuiceId = `${idPrefix}-orange-juice`;
  const creamGradId = `${idPrefix}-cream-grad`;
  const orangeSliceId = `${idPrefix}-orange-slice`;
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 100 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={glassGradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
            <stop offset="25%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="75%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.6)" />
          </linearGradient>
          <linearGradient id={orangeJuiceId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="20%" stopColor="#fde047" />
            <stop offset="55%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>
          <linearGradient id={creamGradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#fffbeb" />
            <stop offset="100%" stopColor="#fef3c7" />
          </linearGradient>
          <linearGradient id={orangeSliceId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
        </defs>

        {/* Straw */}
        <path d="M 40,8 L 44,28 L 50,75" stroke="#38bdf8" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <path d="M 40,8 L 30,6" stroke="#38bdf8" strokeWidth="4.5" strokeLinecap="round" fill="none" />

        {/* Orange Slice on Rim */}
        <circle cx="72" cy="30" r="14" fill={`url(#${orangeSliceId})`} stroke="#fed7aa" strokeWidth="1.5" />
        <circle cx="72" cy="30" r="10" fill="#ffedd5" />
        <path d="M 72,20 L 72,40 M 62,30 L 82,30 M 65,23 L 79,37 M 65,37 L 79,23" stroke="#ea580c" strokeWidth="1.2" />

        {/* Tall Hurricane Glass Liquid */}
        <path
          d="M 32,38 Q 26,58 36,78 Q 42,90 48,94 L 52,94 Q 58,90 64,78 Q 74,58 68,38 Z"
          fill={`url(#${orangeJuiceId})`}
        />

        {/* Ice / Whipped Float on Top */}
        <path
          d="M 30,38 Q 40,26 50,30 Q 60,24 70,38 Z"
          fill={`url(#${creamGradId})`}
        />
        <circle cx="48" cy="28" r="3.5" fill="#ffffff" />
        <circle cx="58" cy="31" r="3" fill="#ffffff" />
        <circle cx="38" cy="33" r="2.5" fill="#ffffff" />

        {/* Glass Outer Shell & Stem */}
        <path
          d="M 30,34 Q 24,58 34,78 Q 42,92 48,96 L 48,106 L 36,112 L 64,112 L 52,106 L 52,96 Q 58,92 66,78 Q 76,58 70,34 Z"
          fill={`url(#${glassGradId})`}
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="1.8"
        />

        {/* Glass Highlight */}
        <path d="M 32,40 Q 28,58 35,76" stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}

export function RedCocktailFlanDrink({ className = "w-14 h-12" }: { className?: string }) {
  const idPrefix = React.useId().replace(/:/g, "");
  const redJuiceId = `${idPrefix}-red-juice`;
  const flanBodyId = `${idPrefix}-flan-body`;
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 120 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={redJuiceId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="40%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#881337" />
          </linearGradient>
          <linearGradient id={flanBodyId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="70%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
        </defs>

        {/* Garnish & Straw */}
        <path d="M 28,26 L 16,14 L 30,18 Z" fill="#22c55e" stroke="#15803d" strokeWidth="1" />
        <polygon points="34,30 22,20 38,14 44,28" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
        <circle cx="48" cy="24" r="5" fill="#dc2626" />
        <circle cx="46" cy="22" r="1.5" fill="#ffffff" />
        <path d="M 52,24 L 62,6 L 68,8" stroke="#fde047" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Martini Glass Liquid */}
        <polygon points="26,34 50,68 74,34" fill={`url(#${redJuiceId})`} />

        {/* Martini Glass Body */}
        <polygon points="22,32 50,70 78,32" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" />
        <line x1="50" y1="70" x2="50" y2="98" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" />
        <ellipse cx="50" cy="100" rx="16" ry="4" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" />

        {/* Plate with Flan / Pudding */}
        <ellipse cx="88" cy="92" rx="26" ry="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
        <ellipse cx="88" cy="90" rx="22" ry="6" fill="#f1f5f9" />
        <ellipse cx="88" cy="89" rx="18" ry="4.5" fill="#92400e" opacity="0.8" />
        <path
          d="M 74,86 L 78,68 Q 88,64 98,68 L 102,86 Q 88,90 74,86 Z"
          fill={`url(#${flanBodyId})`}
          stroke="#ca8a04"
          strokeWidth="1"
        />
        <ellipse cx="88" cy="68" rx="10" ry="3.5" fill="#78350f" />
        <circle cx="88" cy="64" r="3.5" fill="#ffffff" />
        <circle cx="88" cy="61" r="2.5" fill="#ef4444" />
      </svg>
    </div>
  );
}

export function BeerMugDrink({ className = "w-12 h-12" }: { className?: string }) {
  const idPrefix = React.useId().replace(/:/g, "");
  const beerGradId = `${idPrefix}-beer-grad`;
  const woodCoasterId = `${idPrefix}-wood-coaster`;
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 100 120" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={beerGradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="35%" stopColor="#fbbf24" />
            <stop offset="65%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id={woodCoasterId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a16207" />
            <stop offset="50%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
        </defs>

        {/* Wooden Saucer Coaster */}
        <ellipse cx="50" cy="102" rx="38" ry="10" fill={`url(#${woodCoasterId})`} stroke="#ca8a04" strokeWidth="2" />
        <ellipse cx="50" cy="100" rx="34" ry="8" fill="#78350f" />

        {/* Hops & Lemon on Coaster */}
        <ellipse cx="26" cy="98" rx="8" ry="5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
        <ellipse cx="36" cy="101" rx="6" ry="4" fill="#4ade80" stroke="#15803d" strokeWidth="1" />

        {/* Beer Mug Handle */}
        <path
          d="M 68,48 Q 88,48 88,68 Q 88,86 68,86"
          fill="none"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Beer Golden Liquid */}
        <rect x="30" y="44" width="40" height="48" rx="4" fill={`url(#${beerGradId})`} />
        <circle cx="38" cy="70" r="1.5" fill="#ffffff" opacity="0.7" />
        <circle cx="48" cy="80" r="2" fill="#ffffff" opacity="0.6" />
        <circle cx="56" cy="62" r="1.5" fill="#ffffff" opacity="0.8" />

        {/* Beer Mug Glass Outer Shell */}
        <rect
          x="28"
          y="42"
          width="44"
          height="52"
          rx="6"
          fill="rgba(255,255,255,0.12)"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="2"
        />

        {/* Rich Beer Foam on Top */}
        <path
          d="M 26,44 
             C 24,36 32,30 38,34 
             C 42,26 52,24 58,30 
             C 64,26 74,32 72,44 
             C 74,48 68,52 64,48 
             C 58,54 48,52 44,48 
             C 38,54 28,50 26,44 Z"
          fill="#ffffff"
          stroke="#f1f5f9"
          strokeWidth="1.5"
        />
        <path d="M 34,44 Q 35,54 38,54 Q 40,54 40,44" fill="#ffffff" />
        <path d="M 60,44 Q 61,56 64,56 Q 66,56 66,44" fill="#ffffff" />
      </svg>
    </div>
  );
}