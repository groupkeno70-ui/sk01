// @ts-nocheck
import { useEffect, useRef, useState } from "react";

interface SlotCfg {
  id: number;
  label: string;
  multiplier: number;
  color: string; // tailwind bg-* OR hex
  icon?: string;
}

interface Props {
  slots: SlotCfg[];
  spinning: boolean;
  targetIndex: number | null; // final slot index (0-based, matches slots order)
  onSpinEnd?: () => void;
  bets?: Record<string, number>;
  onSlotClick?: (index: number) => void;
  selectedChip?: number;
  size?: number;
}

const POSITIONS = [
  "top: 3px; left: 145px",
  "top: 52px; right: 8px",
  "top: 145px; right: 0",
  "bottom: 52px; right: 8px",
  "bottom: 3px; left: 145px",
  "bottom: 52px; left: 8px",
  "top: 145px; left: 0",
  "top: 52px; left: 8px",
];

const COLORS = ["#ffef45", "#fff", "#fff", "#fff", "#fff", "#fff", "#fff", "#fff"];

export default function FortuneWheel({
  slots,
  spinning,
  targetIndex,
  onSpinEnd,
  bets = {},
  onSlotClick,
  selectedChip,
  size = 320,
}: Props) {
  const [rotation, setRotation] = useState(0);
  const spinsDone = useRef(0);

  useEffect(() => {
    if (!spinning || targetIndex == null) return;
    spinsDone.current += 1;
    const spins = 6;
    const target = spins * 360 - targetIndex * (360 / Math.max(slots.length, 1));
    setRotation((prev) => {
      const base = Math.floor(prev / 360) * 360;
      return base + target;
    });
  }, [spinning, targetIndex, slots.length]);

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <div className="absolute inset-[20px] rounded-full border-[9px] border-[#f7b51b] bg-[#ffd331] shadow-[0_0_0_3px_#8c5427,0_4px_10px_rgba(0,0,0,.4)]">
        <div className="absolute inset-[11px] rounded-full border-[4px] border-[#784722] bg-[#f4a914] shadow-inner" />
        <div className="absolute inset-[23px] overflow-hidden rounded-full border-2 border-[#a86627] bg-[#ffca2e]" style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? "transform 4.2s cubic-bezier(.17,.67,.24,1)" : "none" }} onTransitionEnd={() => spinning && onSpinEnd?.()}>
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className={`absolute inset-0 origin-center ${i % 2 ? "bg-[#f4a522]" : "bg-[#ffd34a]"}`} style={{ clipPath: `polygon(50% 50%, ${50 + Math.cos((i * 45 - 22.5) * Math.PI / 180) * 100}% ${50 + Math.sin((i * 45 - 22.5) * Math.PI / 180) * 100}%, ${50 + Math.cos((i * 45 + 22.5) * Math.PI / 180) * 100}% ${50 + Math.sin((i * 45 + 22.5) * Math.PI / 180) * 100}%)` }} />)}
          {Array.from({ length: 8 }).map((_, i) => <div key={`spoke-${i}`} className="absolute left-1/2 top-1/2 h-1/2 w-[3px] origin-bottom bg-[#925321]" style={{ transform: `translate(-50%, -100%) rotate(${i * 45}deg)` }} />)}
          {Array.from({ length: 12 }).map((_, i) => <span key={`dot-${i}`} className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full border border-white/80 bg-[#fff6a5] shadow-[0_0_3px_rgba(255,255,255,.9)]" style={{ transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-43px)` }} />)}
          <div className="absolute inset-[28%] flex items-center justify-center rounded-full border-4 border-[#864526] bg-[#f28aa8] text-2xl font-black text-white shadow-[inset_0_2px_5px_rgba(111,36,42,.35),0_2px_3px_rgba(0,0,0,.35)]"><span className="absolute -top-1 text-[28px] drop-shadow">🐰</span><span className="relative mt-5 text-[22px]">12</span></div>
        </div>
      </div>
      {slots.slice(0, 8).map((slot, index) => (
        <button key={index} type="button" disabled={spinning} onClick={() => onSlotClick?.(index)} className="absolute z-10 h-[60px] w-[84px] -translate-y-0 overflow-hidden rounded-[17px] border-2 border-[#8b5422] bg-white text-[#292929] shadow-[0_2px_3px_rgba(0,0,0,.35)] transition-transform active:scale-95 disabled:cursor-not-allowed" style={{ ...Object.fromEntries(POSITIONS[index].split("; ").map((part) => part.split(": "))), background: COLORS[index] }}>
          <span className="block border-b-2 border-[#ecbf2a] bg-[#ffe347] text-[8px] font-black leading-[17px]">POT:{bets[`slot_${index}`] || 0}</span>
          <span className="block text-[23px] leading-[29px]">{slot.icon || slot.label}</span>
          <span className="absolute right-1 top-[25px] rounded bg-white/70 px-0.5 text-sm font-black">x{slot.multiplier}</span>
          {bets[`slot_${index}`] ? <span className="absolute -right-2 -top-2 rounded-full border border-white bg-[#ff407c] px-1.5 text-[10px] font-bold text-white shadow">{selectedChip}</span> : null}
        </button>
      ))}
      <div className="absolute left-1/2 top-[-7px] z-20 -translate-x-1/2 text-2xl drop-shadow">🎈</div>
      <span className="absolute bottom-[3px] left-[-4px] z-20 rounded-full border border-[#8b5422] bg-[#ffe347] px-1 text-[9px] font-bold shadow">salad</span>
      <span className="absolute bottom-[3px] right-[-3px] z-20 rounded-full border border-[#8b5422] bg-[#ffe347] px-1 text-[9px] font-bold shadow">pizza</span>
    </div>
  );
}
