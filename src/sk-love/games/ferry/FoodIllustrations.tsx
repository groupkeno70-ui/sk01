// @ts-nocheck
import React from "react";

/**
 * High quality SVG illustrations matching the Ferry Wheel screenshot assets
 */

// 1. Roast Chicken / Turkey on Wooden Dish (x45)
export function RoastChickenIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="roastGrad" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="35%" stopColor="#f59e0b" />
          <stop offset="70%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#854d0e" />
        </radialGradient>
        <linearGradient id="dishGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#854d0e" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>
      </defs>
      {/* Wooden Dish Plate */}
      <ellipse cx="32" cy="50" rx="26" ry="8" fill="url(#dishGrad)" stroke="#3f1c04" strokeWidth="1.5" />
      <ellipse cx="32" cy="48" rx="22" ry="6" fill="#713f12" />
      {/* Chicken Body */}
      <path
        d="M 16,36 C 14,22 28,14 44,18 C 52,20 54,28 52,38 C 50,46 40,48 28,48 C 18,48 16,44 16,36 Z"
        fill="url(#roastGrad)"
        stroke="#5a2206"
        strokeWidth="1.8"
      />
      {/* Golden Highlight */}
      <ellipse cx="34" cy="24" rx="10" ry="4" fill="#fef08a" opacity="0.6" />
      {/* Drumstick Thigh */}
      <ellipse cx="22" cy="38" rx="9" ry="7" fill="#b45309" stroke="#5a2206" strokeWidth="1.5" />
      {/* Bone */}
      <path d="M 46,24 L 56,16" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="56" cy="14" r="2.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
      <circle cx="58" cy="18" r="2.5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="0.8" />
    </svg>
  );
}

// 2. Red Octopus / Squid (x25)
export function OctopusIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="octoGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="45%" stopColor="#ef4444" />
          <stop offset="85%" stopColor="#b91c1c" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </radialGradient>
      </defs>
      {/* Head */}
      <ellipse cx="32" cy="24" rx="18" ry="16" fill="url(#octoGrad)" stroke="#450a0a" strokeWidth="1.8" />
      {/* Highlight on head */}
      <ellipse cx="26" cy="18" rx="6" ry="3" fill="#ffffff" opacity="0.45" />
      {/* Tentacles */}
      <path d="M 18,36 Q 10,46 14,54 Q 18,58 22,50 Q 24,44 26,38" fill="url(#octoGrad)" stroke="#450a0a" strokeWidth="1.5" />
      <path d="M 26,38 Q 24,52 30,58 Q 34,58 32,48 Q 32,40 32,38" fill="url(#octoGrad)" stroke="#450a0a" strokeWidth="1.5" />
      <path d="M 32,38 Q 36,50 40,58 Q 44,56 42,46 Q 38,40 38,38" fill="url(#octoGrad)" stroke="#450a0a" strokeWidth="1.5" />
      <path d="M 38,38 Q 48,44 52,52 Q 54,58 48,56 Q 44,48 40,36" fill="url(#octoGrad)" stroke="#450a0a" strokeWidth="1.5" />
      {/* Cute Big Eyes */}
      <ellipse cx="26" cy="25" rx="3.5" ry="4.5" fill="#ffffff" stroke="#450a0a" strokeWidth="1" />
      <circle cx="26.5" cy="25" r="2" fill="#1e1b4b" />
      <circle cx="25.5" cy="23.5" r="0.9" fill="#ffffff" />
      <ellipse cx="38" cy="25" rx="3.5" ry="4.5" fill="#ffffff" stroke="#450a0a" strokeWidth="1" />
      <circle cx="37.5" cy="25" r="2" fill="#1e1b4b" />
      <circle cx="36.5" cy="23.5" r="0.9" fill="#ffffff" />
      {/* Cheeks */}
      <ellipse cx="21" cy="30" rx="2.5" ry="1.5" fill="#fca5a5" opacity="0.8" />
      <ellipse cx="43" cy="30" rx="2.5" ry="1.5" fill="#fca5a5" opacity="0.8" />
    </svg>
  );
}

// 3. Blue Jumping Fish (x15)
export function FishIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fishGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="35%" stopColor="#60a5fa" />
          <stop offset="70%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
        <linearGradient id="fishBelly" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#dbeafe" />
        </linearGradient>
      </defs>
      {/* Tail Fin */}
      <path d="M 44,38 L 58,26 Q 56,38 60,50 L 44,40 Z" fill="#3b82f6" stroke="#172554" strokeWidth="1.5" />
      {/* Dorsal Fin */}
      <path d="M 28,14 Q 38,10 46,24 Z" fill="#60a5fa" stroke="#172554" strokeWidth="1.2" />
      {/* Fish Body (Jumping curve) */}
      <path
        d="M 10,32 C 14,18 36,18 46,32 C 48,38 46,44 42,46 C 30,50 16,46 10,32 Z"
        fill="url(#fishGrad)"
        stroke="#172554"
        strokeWidth="1.8"
      />
      {/* Belly */}
      <path d="M 12,34 C 20,44 34,44 42,42 C 40,46 30,48 18,44 Z" fill="url(#fishBelly)" />
      {/* Pectoral Fin */}
      <path d="M 26,34 Q 32,32 32,40 Q 28,40 26,34 Z" fill="#facc15" stroke="#854d0e" strokeWidth="1" />
      {/* Eye */}
      <circle cx="18" cy="27" r="3.5" fill="#ffffff" stroke="#172554" strokeWidth="1" />
      <circle cx="17.5" cy="27" r="2" fill="#000000" />
      <circle cx="16.5" cy="26" r="0.8" fill="#ffffff" />
    </svg>
  );
}

// 4. Sliced Meat / Ham Steak (x10)
export function MeatSteakIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="steakGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="45%" stopColor="#ef4444" />
          <stop offset="85%" stopColor="#b91c1c" />
          <stop offset="100%" stopColor="#881337" />
        </radialGradient>
      </defs>
      {/* Outer Fat Rim */}
      <path
        d="M 14,32 C 10,18 28,10 44,16 C 54,20 58,32 54,44 C 48,54 26,56 16,46 C 12,42 14,36 14,32 Z"
        fill="#fef2f2"
        stroke="#fda4af"
        strokeWidth="2"
      />
      {/* Inner Red Meat */}
      <path
        d="M 18,32 C 14,22 28,14 42,18 C 50,22 54,32 50,42 C 44,50 26,52 18,42 Z"
        fill="url(#steakGrad)"
        stroke="#4c0519"
        strokeWidth="1.5"
      />
      {/* White Marbling Lines */}
      <path d="M 24,24 Q 32,28 34,22" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" fill="none" />
      <path d="M 32,32 Q 40,36 44,28" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" fill="none" />
      <path d="M 22,38 Q 30,42 38,40" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" fill="none" />
      {/* Bone Circle */}
      <circle cx="28" cy="30" r="3.5" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
    </svg>
  );
}

// 5. Purple Grapes Cluster (x5)
export function GrapesIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="grapeGrad" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="45%" stopColor="#9333ea" />
          <stop offset="85%" stopColor="#6b21a8" />
          <stop offset="100%" stopColor="#3b0764" />
        </radialGradient>
      </defs>
      {/* Stem & Leaves */}
      <path d="M 32,16 Q 34,6 40,6" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M 32,16 Q 22,12 26,6 Q 34,8 32,16 Z" fill="#22c55e" stroke="#166534" strokeWidth="1" />
      <path d="M 34,16 Q 44,14 42,8 Q 36,10 34,16 Z" fill="#22c55e" stroke="#166534" strokeWidth="1" />
      {/* Grapes Cluster */}
      {/* Row 1 (Top) */}
      <circle cx="24" cy="22" r="6" fill="url(#grapeGrad)" stroke="#3b0764" strokeWidth="1" />
      <circle cx="34" cy="22" r="6" fill="url(#grapeGrad)" stroke="#3b0764" strokeWidth="1" />
      <circle cx="44" cy="22" r="6" fill="url(#grapeGrad)" stroke="#3b0764" strokeWidth="1" />
      {/* Row 2 */}
      <circle cx="20" cy="30" r="6" fill="url(#grapeGrad)" stroke="#3b0764" strokeWidth="1" />
      <circle cx="30" cy="30" r="6" fill="url(#grapeGrad)" stroke="#3b0764" strokeWidth="1" />
      <circle cx="40" cy="30" r="6" fill="url(#grapeGrad)" stroke="#3b0764" strokeWidth="1" />
      {/* Row 3 */}
      <circle cx="26" cy="38" r="6" fill="url(#grapeGrad)" stroke="#3b0764" strokeWidth="1" />
      <circle cx="36" cy="38" r="6" fill="url(#grapeGrad)" stroke="#3b0764" strokeWidth="1" />
      {/* Row 4 (Bottom) */}
      <circle cx="32" cy="46" r="6" fill="url(#grapeGrad)" stroke="#3b0764" strokeWidth="1" />
    </svg>
  );
}

// 6. Green Cabbage / Lettuce (x5)
export function CabbageIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="lettuceGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="45%" stopColor="#4ade80" />
          <stop offset="85%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </radialGradient>
      </defs>
      {/* Outer Leaves */}
      <path
        d="M 12,36 C 8,24 24,12 38,16 C 52,20 56,34 50,46 C 42,54 22,54 14,46 C 10,42 12,38 12,36 Z"
        fill="url(#lettuceGrad)"
        stroke="#14532d"
        strokeWidth="1.8"
      />
      {/* Inner Leaf layers & veins */}
      <path d="M 22,22 Q 32,32 38,48" stroke="#bbf7d0" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M 30,28 Q 24,36 18,38" stroke="#bbf7d0" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M 34,34 Q 42,36 46,34" stroke="#bbf7d0" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Top frills */}
      <path d="M 18,20 Q 24,14 32,18 Q 40,12 46,20" stroke="#166534" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

// 7. Yellow Corn Cob (x5)
export function CornIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="cornGrad" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="45%" stopColor="#facc15" />
          <stop offset="85%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#a16207" />
        </radialGradient>
      </defs>
      {/* Green Husks */}
      <path d="M 16,48 Q 12,28 24,20 Q 22,38 32,52 Z" fill="#22c55e" stroke="#15803d" strokeWidth="1.5" />
      <path d="M 24,52 Q 38,58 50,44 Q 40,40 32,52 Z" fill="#16a34a" stroke="#15803d" strokeWidth="1.5" />
      {/* Yellow Corn Cob */}
      <ellipse
        cx="36"
        cy="30"
        rx="14"
        ry="22"
        transform="rotate(35 36 30)"
        fill="url(#cornGrad)"
        stroke="#78350f"
        strokeWidth="1.8"
      />
      {/* Kernel Grid Pattern */}
      <path d="M 28,18 Q 38,28 44,40 M 34,14 Q 42,24 48,34" stroke="#ca8a04" strokeWidth="1.2" strokeDasharray="3 2" />
      <path d="M 22,28 Q 34,26 46,20 M 26,36 Q 38,34 50,28" stroke="#ca8a04" strokeWidth="1.2" strokeDasharray="3 2" />
    </svg>
  );
}

// 8. Red Strawberry (x5)
export function StrawberryIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="berryGrad" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="40%" stopColor="#f43f5e" />
          <stop offset="80%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#9f1239" />
        </radialGradient>
      </defs>
      {/* Green Calyx / Leaves */}
      <path d="M 32,12 L 32,6" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 32,14 L 20,8 Q 24,16 32,16 Z" fill="#22c55e" stroke="#166534" strokeWidth="1" />
      <path d="M 32,14 L 44,8 Q 40,16 32,16 Z" fill="#22c55e" stroke="#166534" strokeWidth="1" />
      <path d="M 32,14 L 32,18 Z" fill="#22c55e" />
      {/* Strawberry Heart Body */}
      <path
        d="M 18,22 C 14,14 30,12 32,18 C 34,12 50,14 46,22 C 44,36 36,48 32,54 C 28,48 20,36 18,22 Z"
        fill="url(#berryGrad)"
        stroke="#4c0519"
        strokeWidth="1.8"
      />
      {/* Yellow Seeds */}
      {[
        { cx: 26, cy: 26 },
        { cx: 38, cy: 26 },
        { cx: 32, cy: 32 },
        { cx: 24, cy: 38 },
        { cx: 40, cy: 38 },
        { cx: 32, cy: 44 },
      ].map((pt, i) => (
        <circle key={i} cx={pt.cx} cy={pt.cy} r="1.2" fill="#fde047" stroke="#713f12" strokeWidth="0.4" />
      ))}
    </svg>
  );
}

// 9. Salad Bowl (Left side-bet)
export function SaladBowlIcon({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bowl */}
      <ellipse cx="32" cy="46" rx="22" ry="10" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
      {/* Green Salad Leaves */}
      <ellipse cx="32" cy="38" rx="20" ry="10" fill="#22c55e" />
      <circle cx="24" cy="34" r="7" fill="#4ade80" />
      <circle cx="38" cy="32" r="8" fill="#16a34a" />
      <circle cx="32" cy="34" r="6" fill="#86efac" />
      {/* Tomato Slices */}
      <circle cx="28" cy="38" r="4" fill="#ef4444" stroke="#991b1b" strokeWidth="0.8" />
      <circle cx="40" cy="38" r="4" fill="#ef4444" stroke="#991b1b" strokeWidth="0.8" />
      {/* Egg Slices / Croutons */}
      <ellipse cx="22" cy="40" rx="4" ry="3" fill="#ffffff" />
      <circle cx="22" cy="40" r="2" fill="#facc15" />
    </svg>
  );
}

// 10. Pizza (Right side-bet)
export function PizzaIcon({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Pizza Crust */}
      <circle cx="32" cy="32" r="26" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
      {/* Melted Cheese */}
      <circle cx="32" cy="32" r="22" fill="#fde047" stroke="#d97706" strokeWidth="1" />
      {/* Pepperoni Slices */}
      <circle cx="24" cy="24" r="4.5" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1" />
      <circle cx="40" cy="24" r="4.5" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1" />
      <circle cx="32" cy="34" r="5" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1" />
      <circle cx="22" cy="40" r="4.5" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1" />
      <circle cx="42" cy="40" r="4.5" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1" />
      {/* Basil Leaves */}
      <circle cx="28" cy="28" r="2" fill="#16a34a" />
      <circle cx="36" cy="26" r="2" fill="#16a34a" />
      <circle cx="34" cy="42" r="2" fill="#16a34a" />
    </svg>
  );
}

// 11. Cute Arabian Lion Cub with Keffiyeh (Center Hub Character)
export function ArabianLionCub({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="lionFur" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="40%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </radialGradient>
      </defs>
      {/* Mane / Ears */}
      <circle cx="30" cy="32" r="14" fill="#b45309" />
      <circle cx="30" cy="32" r="10" fill="#fcd34d" />
      <circle cx="70" cy="32" r="14" fill="#b45309" />
      <circle cx="70" cy="32" r="10" fill="#fcd34d" />

      {/* Lion Body */}
      <ellipse cx="50" cy="74" rx="24" ry="20" fill="url(#lionFur)" stroke="#78350f" strokeWidth="2" />
      <ellipse cx="50" cy="76" rx="15" ry="12" fill="#fef08a" />

      {/* Lion Head */}
      <circle cx="50" cy="48" r="26" fill="url(#lionFur)" stroke="#78350f" strokeWidth="2" />

      {/* Arabian White Keffiyeh Headcloth */}
      <path
        d="M 22,46 C 22,24 78,24 78,46 C 78,64 74,78 70,82 L 64,74 C 64,48 36,48 36,74 L 30,82 C 26,78 22,64 22,46 Z"
        fill="#ffffff"
        stroke="#e2e8f0"
        strokeWidth="1.5"
      />
      {/* Black Egal Headband */}
      <ellipse cx="50" cy="30" rx="25" ry="7" fill="none" stroke="#0f172a" strokeWidth="5" />
      <ellipse cx="50" cy="32" rx="24" ry="6" fill="none" stroke="#334155" strokeWidth="3" />

      {/* Lion Face Snout */}
      <ellipse cx="50" cy="54" rx="12" ry="9" fill="#fef08a" />
      {/* Black Nose */}
      <polygon points="46,50 54,50 50,54" fill="#451a03" />
      {/* Mouth */}
      <path d="M 46,55 Q 50,58 54,55" stroke="#451a03" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Big Sparkling Anime Eyes */}
      <ellipse cx="38" cy="44" rx="5" ry="6.5" fill="#1e1b4b" />
      <circle cx="36" cy="42" r="2.2" fill="#ffffff" />
      <circle cx="39" cy="46" r="1.2" fill="#ffffff" />

      <ellipse cx="62" cy="44" rx="5" ry="6.5" fill="#1e1b4b" />
      <circle cx="60" cy="42" r="2.2" fill="#ffffff" />
      <circle cx="63" cy="46" r="1.2" fill="#ffffff" />

      {/* Cheeks */}
      <ellipse cx="32" cy="52" rx="3.5" ry="2" fill="#fb7185" opacity="0.6" />
      <ellipse cx="68" cy="52" rx="3.5" ry="2" fill="#fb7185" opacity="0.6" />

      {/* Front Paws */}
      <ellipse cx="40" cy="78" rx="7" ry="5" fill="#fef08a" stroke="#78350f" strokeWidth="1.5" />
      <ellipse cx="60" cy="78" rx="7" ry="5" fill="#fef08a" stroke="#78350f" strokeWidth="1.5" />
    </svg>
  );
}

// 12. Red Bird perched on top
export function RedBirdIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="16" cy="18" rx="10" ry="7" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
      <circle cx="10" cy="14" r="5" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
      <polygon points="4,14 8,12 8,16" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
      <circle cx="9" cy="13" r="1" fill="#000000" />
      <path d="M 22,18 L 28,14 L 26,20 Z" fill="#b91c1c" />
    </svg>
  );
}

// Export Map
export const FOOD_ICONS: Record<string, React.FC<{ className?: string }>> = {
  chicken: RoastChickenIcon,
  octopus: OctopusIcon,
  lobster: OctopusIcon,
  fish: FishIcon,
  meat: MeatSteakIcon,
  ham: MeatSteakIcon,
  grapes: GrapesIcon,
  grape: GrapesIcon,
  watermelon: GrapesIcon,
  cabbage: CabbageIcon,
  lettuce: CabbageIcon,
  corn: CornIcon,
  carrot: CornIcon,
  strawberry: StrawberryIcon,
  mushroom: StrawberryIcon,
  salad: SaladBowlIcon,
  pizza: PizzaIcon,
};
