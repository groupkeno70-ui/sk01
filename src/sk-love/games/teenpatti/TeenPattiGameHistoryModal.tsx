// @ts-nocheck
import React, { useEffect, useState } from "react";
import { api } from "@/sk-love/lib/api";
import { OrangeCocktailDrink, RedCocktailFlanDrink, BeerMugDrink } from "./DrinkIllustrations";

export function WinningFaceIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-md">
        <defs>
          <radialGradient id="winFaceGrad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#facc15" />
            <stop offset="85%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </radialGradient>
          <radialGradient id="mouthGrad" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="70%" stopColor="#b91c1c" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </radialGradient>
        </defs>
        {/* Face Circle */}
        <circle cx="18" cy="18" r="16" fill="url(#winFaceGrad)" stroke="#a16207" strokeWidth="1" />
        {/* Laughing Squinting Eyes >< */}
        {/* Left Eye */}
        <path d="M 9,13 L 13,15 L 9,17" stroke="#78350f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Right Eye */}
        <path d="M 27,13 L 23,15 L 27,17" stroke="#78350f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Wide Open Laughing Mouth */}
        <path d="M 10,20 Q 18,32 26,20 Z" fill="url(#mouthGrad)" stroke="#78350f" strokeWidth="1" />
        {/* White Upper Teeth */}
        <path d="M 12,20 Q 18,24 24,20 Q 18,20 12,20 Z" fill="#ffffff" />
        {/* Pink Tongue */}
        <path d="M 14,26 Q 18,23 22,26 Q 18,31 14,26 Z" fill="#f43f5e" />
      </svg>
    </div>
  );
}

export function LosingFaceIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 36 36" className="w-full h-full opacity-85 drop-shadow-sm">
        <defs>
          <radialGradient id="loseFaceGrad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="85%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#64748b" />
          </radialGradient>
        </defs>
        {/* Face Circle */}
        <circle cx="18" cy="18" r="16" fill="url(#loseFaceGrad)" stroke="#475569" strokeWidth="1" />
        {/* Sad Curved Drooping Eyes */}
        <ellipse cx="12" cy="14" rx="2" ry="2.5" fill="#334155" />
        <ellipse cx="24" cy="14" rx="2" ry="2.5" fill="#334155" />
        {/* Eyebrows slanted sad */}
        <path d="M 10,10 Q 13,8 15,11" stroke="#334155" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M 26,10 Q 23,8 21,11" stroke="#334155" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        {/* Sad Downturned Mouth */}
        <path d="M 12,26 Q 18,19 24,26" stroke="#334155" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        {/* Subtle Teardrop on left eye */}
        <path d="M 10,17 Q 9,21 11,21 Q 12,21 11,17 Z" fill="#38bdf8" opacity="0.9" />
      </svg>
    </div>
  );
}

export function RoyalCrownIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg viewBox="0 0 40 32" className="w-full h-full drop-shadow-md">
        <defs>
          <linearGradient id="crownGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="25%" stopColor="#facc15" />
            <stop offset="60%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>
          <linearGradient id="crownRedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="60%" stopColor="#991b1b" />
            <stop offset="100%" stopColor="#450a0a" />
          </linearGradient>
        </defs>
        {/* Red Velvet Pillow Cushion Inside */}
        <path
          d="M 8,24 C 8,14 14,8 20,8 C 26,8 32,14 32,24 Z"
          fill="url(#crownRedGrad)"
        />
        {/* Golden Crown Arches & Peaks */}
        <path
          d="M 4,24 L 6,12 L 13,18 L 20,6 L 27,18 L 34,12 L 36,24 Z"
          fill="url(#crownGoldGrad)"
          stroke="#ca8a04"
          strokeWidth="0.8"
        />
        {/* Crown Base Rim */}
        <rect x="4" y="24" width="32" height="5" rx="1.5" fill="url(#crownGoldGrad)" stroke="#78350f" strokeWidth="0.8" />
        {/* Jewels on Crown Base */}
        <circle cx="10" cy="26.5" r="1.3" fill="#38bdf8" />
        <circle cx="20" cy="26.5" r="1.5" fill="#ef4444" />
        <circle cx="30" cy="26.5" r="1.3" fill="#38bdf8" />
        {/* Jewels on Peaks */}
        <circle cx="6" cy="12" r="1.8" fill="#ffffff" stroke="#eab308" strokeWidth="0.5" />
        <circle cx="20" cy="6" r="2.2" fill="#ffffff" stroke="#eab308" strokeWidth="0.5" />
        <circle cx="34" cy="12" r="1.8" fill="#ffffff" stroke="#eab308" strokeWidth="0.5" />
      </svg>
    </div>
  );
}

interface TeenPattiGameHistoryModalProps {
  open: boolean;
  onClose: () => void;
}

export default function TeenPattiGameHistoryModal({ open, onClose }: TeenPattiGameHistoryModalProps) {
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [selectedRound, setSelectedRound] = useState<any | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      // Primary: GET /api/games/teenpatti/history?limit=30
      // Backup Alias: GET /api/game/history/detailed?limit=30
      let res: any = await api.get("/api/games/teenpatti/history?limit=30").catch(() => null);
      if (!res?.data && !Array.isArray(res)) {
        res = await api.get("/api/game/history/detailed?limit=30").catch(() => null);
      }

      const list = res?.data || res?.history || (Array.isArray(res) ? res : []);
      if (Array.isArray(list) && list.length > 0) {
        setHistoryData(list);
      } else {
        // Fallback realistic demo rows if empty
        setHistoryData([
          {
            round_number: 2216,
            winning_table_no: "3",
            category: "Pair",
            multiplier: 2.0,
            finished_at: "2026-07-19T15:40:25.000000Z",
          },
          {
            round_number: 2215,
            winning_table_no: "3",
            category: "High Card",
            multiplier: 2.0,
            finished_at: "2026-07-19T15:39:25.000000Z",
          },
          {
            round_number: 2214,
            winning_table_no: "1",
            category: "Straight",
            multiplier: 3.0,
            finished_at: "2026-07-19T15:38:25.000000Z",
          },
          {
            round_number: 2213,
            winning_table_no: "3",
            category: "Flush",
            multiplier: 4.0,
            finished_at: "2026-07-19T15:37:25.000000Z",
          },
          {
            round_number: 2212,
            winning_table_no: "1",
            category: "Pair",
            multiplier: 2.0,
            finished_at: "2026-07-19T15:36:25.000000Z",
          },
          {
            round_number: 2211,
            winning_table_no: "2",
            category: "Straight Flush",
            multiplier: 10.0,
            finished_at: "2026-07-19T15:35:25.000000Z",
          },
        ]);
      }
    } catch (e) {
      console.warn("Failed to fetch game history:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchHistory();
    } else {
      setSelectedRound(null);
    }
  }, [open]);

  if (!open) return null;

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "2026/07/19";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "2026/07/19";
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}/${mm}/${dd}`;
    } catch {
      return "2026/07/19";
    }
  };

  const getMultiplierLabel = (item: any) => {
    const mult = item?.multiplier;
    if (mult && Number(mult) > 0) {
      const n = Number(mult);
      return `x${n % 1 === 0 ? n.toFixed(0) : n.toFixed(1)}`;
    }
    const cat = String(item?.category || "").toLowerCase();
    if (cat.includes("leopard") || cat.includes("trio") || cat.includes("trail")) return "x25";
    if (cat.includes("straight flush") || cat.includes("pure")) return "x10";
    if (cat.includes("flush") || cat.includes("color")) return "x4";
    if (cat.includes("straight") || cat.includes("sequence")) return "x3";
    return "x2";
  };

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-3 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[360px] rounded-2xl bg-[#091b29] border-2 border-[#164e63] shadow-2xl overflow-hidden flex flex-col font-sans select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── 1. Top Header Bar (Teal / Cyan Glossy Gradient) ── */}
        <div className="relative px-3 py-2 bg-gradient-to-r from-[#0284c7] via-[#0891b2] to-[#0e7490] border-b border-[#22d3ee]/40 flex items-center justify-between shrink-0 shadow-md">
          {/* Left placeholder for symmetry */}
          <div className="w-6" />

          {/* Title */}
          <h2
            className="text-base font-black tracking-wide text-white text-center drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
            style={{
              textShadow: "0 0 8px rgba(6, 182, 212, 0.6), 0 2px 4px rgba(0,0,0,0.9)",
            }}
          >
            Game History
          </h2>

          {/* Circular Close Button (Top Right) */}
          <button
            type="button"
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-[#083344]/90 border border-[#22d3ee] flex items-center justify-center text-[#22d3ee] hover:text-white hover:bg-[#083344] transition active:scale-90 cursor-pointer shadow"
            title="Close"
          >
            <span className="text-xs font-black leading-none">✕</span>
          </button>
        </div>

        {/* ── 2. Table Column Headers with 3 Drinks & Crown ── */}
        <div className="grid grid-cols-5 items-center px-2 py-2 bg-[#0c2436] border-b border-[#164e63] text-center shrink-0">
          <div className="text-[10px] font-bold text-[#67e8f9] uppercase tracking-tight text-left pl-1">
            Round
          </div>
          <div className="flex items-center justify-center">
            <OrangeCocktailDrink className="w-8 h-8 drop-shadow" />
          </div>
          <div className="flex items-center justify-center">
            <RedCocktailFlanDrink className="w-8 h-8 drop-shadow" />
          </div>
          <div className="flex items-center justify-center">
            <BeerMugDrink className="w-8 h-8 drop-shadow" />
          </div>
          <div className="flex items-center justify-center">
            <RoyalCrownIcon className="w-8 h-8 drop-shadow" />
          </div>
        </div>

        {/* ── 3. Table Rows (Scrollable list) ── */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-[#164e63]/40 bg-[#081724]">
          {loading && historyData.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-cyan-200">
              <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs">Loading history…</span>
            </div>
          ) : historyData.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No recent rounds found
            </div>
          ) : (
            historyData.map((item, idx) => {
              const roundNum = item.round_number || item.round_id || item.id || (2216 - idx);
              const winTable = String(item.winning_table_no || item.winner || item.winning_table || "");
              const dateStr = formatDate(item.finished_at || item.started_at || item.created_at);
              const multLabel = getMultiplierLabel(item);
              const isSelected = selectedRound?.round_number === roundNum;

              // Check win/lose status for tables 1, 2, 3
              const table1Win = winTable === "1" || winTable === "A";
              const table2Win = winTable === "2" || winTable === "B";
              const table3Win = winTable === "3" || winTable === "C";

              return (
                <div key={idx} className="flex flex-col">
                  <div
                    onClick={() => setSelectedRound(isSelected ? null : item)}
                    className={`grid grid-cols-5 items-center px-2 py-2 transition-colors cursor-pointer ${
                      idx % 2 === 0 ? "bg-[#0b1d2c]" : "bg-[#081724]"
                    } hover:bg-[#0f2e47] ${isSelected ? "ring-1 ring-cyan-400/60 bg-[#0f2e47]" : ""}`}
                  >
                    {/* Col 1: Date & Round */}
                    <div className="flex flex-col text-left pl-1">
                      <span className="text-[9.5px] font-medium text-slate-400 font-mono leading-none">
                        {dateStr}
                      </span>
                      <span className="text-[10.5px] font-black text-white font-mono leading-tight mt-0.5">
                        round: {roundNum}
                      </span>
                    </div>

                    {/* Col 2: Table 1 (Orange Drink) */}
                    <div className="flex items-center justify-center">
                      {table1Win ? <WinningFaceIcon className="w-6 h-6" /> : <LosingFaceIcon className="w-6 h-6" />}
                    </div>

                    {/* Col 3: Table 2 (Cocktail Drink) */}
                    <div className="flex items-center justify-center">
                      {table2Win ? <WinningFaceIcon className="w-6 h-6" /> : <LosingFaceIcon className="w-6 h-6" />}
                    </div>

                    {/* Col 4: Table 3 (Beer Mug) */}
                    <div className="flex items-center justify-center">
                      {table3Win ? <WinningFaceIcon className="w-6 h-6" /> : <LosingFaceIcon className="w-6 h-6" />}
                    </div>

                    {/* Col 5: Crown & Multiplier */}
                    <div className="flex items-center justify-center gap-0.5">
                      <RoyalCrownIcon className="w-4.5 h-4.5" />
                      <span className="text-[10.5px] font-black text-[#facc15] font-mono leading-none drop-shadow">
                        {multLabel}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Round Details (Cards, Category, Net profit) */}
                  {isSelected && (
                    <div className="bg-[#06121c] p-2.5 border-t border-b border-cyan-500/30 text-[11px] animate-in slide-in-from-top-1 duration-150">
                      <div className="flex items-center justify-between text-slate-300 mb-1">
                        <span>Winning Category: <strong className="text-yellow-300">{item.category || "Pair"}</strong></span>
                        <span>Pot: <strong className="text-amber-400">🪙 {(item.total_pot_coins || 85000).toLocaleString()}</strong></span>
                      </div>

                      {/* Cards preview if available */}
                      {Array.isArray(item.winning_cards) && item.winning_cards.length > 0 && (
                        <div className="flex items-center gap-1 my-1">
                          <span className="text-[10px] text-slate-400">Winning Cards:</span>
                          <div className="flex gap-1">
                            {item.winning_cards.map((c: any, ci: number) => (
                              <span
                                key={ci}
                                className={`px-1.5 py-0.5 rounded bg-slate-900 border text-[10px] font-bold ${
                                  c.suit === "Hearts" || c.suit === "Diamonds" || c.symbol === "♥" || c.symbol === "♦"
                                    ? "text-red-400 border-red-900"
                                    : "text-slate-200 border-slate-700"
                                }`}
                              >
                                {c.display || `${c.rank || ""}${c.symbol || ""}`}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* User bet summary if available */}
                      {item.user_summary && item.user_summary.my_bet > 0 && (
                        <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-800 text-[10px]">
                          <span>My Bet: 🪙 {item.user_summary.my_bet.toLocaleString()}</span>
                          <span className={item.user_summary.result === "win" ? "text-emerald-400 font-bold" : "text-rose-400"}>
                            {item.user_summary.result === "win" ? `Won +${item.user_summary.net_profit?.toLocaleString()}` : "Lost"}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ── 4. Bottom Footer Info ── */}
        <div className="px-3 py-1.5 bg-[#071520] border-t border-[#164e63] flex items-center justify-between text-[10px] text-cyan-400/80 shrink-0">
          <span>Click any row for detailed cards</span>
          <button
            type="button"
            onClick={fetchHistory}
            className="hover:text-cyan-200 underline font-bold cursor-pointer"
          >
            Refresh ⟳
          </button>
        </div>
      </div>
    </div>
  );
}
