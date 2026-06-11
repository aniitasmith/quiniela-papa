"use client";
import { useState, useEffect } from "react";
import { flag } from "@/lib/flags";

export default function ResultModal({ match, current, onSave, onClose }) {
  const [r1, setR1] = useState(current?.r1 ?? "");
  const [r2, setR2] = useState(current?.r2 ?? "");

  useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-black text-green-900 text-center mb-1">⚽ Resultado del partido</h2>
        <p className="text-center text-gray-500 text-sm mb-5">
          {match.t1} vs {match.t2}<br/>
          <span className="text-xs">{match.d} · {match.h} ET</span>
        </p>
        <div className="flex items-center gap-4 justify-center mb-6">
          <div className="text-center">
            <div className="text-3xl mb-1">{flag(match.t1)}</div>
            <div className="font-bold text-sm text-green-900 mb-2">{match.t1}</div>
            <input
              type="number" min="0" max="20"
              value={r1}
              onChange={e => setR1(e.target.value)}
              className="w-16 h-16 text-3xl font-black text-center border-3 border-green-400 rounded-2xl focus:outline-none focus:border-green-600 text-green-900"
            />
          </div>
          <div className="text-3xl font-black text-gray-400 mt-8">–</div>
          <div className="text-center">
            <div className="text-3xl mb-1">{flag(match.t2)}</div>
            <div className="font-bold text-sm text-green-900 mb-2">{match.t2}</div>
            <input
              type="number" min="0" max="20"
              value={r2}
              onChange={e => setR2(e.target.value)}
              className="w-16 h-16 text-3xl font-black text-center border-3 border-green-400 rounded-2xl focus:outline-none focus:border-green-600 text-green-900"
            />
          </div>
        </div>
        <div className="flex gap-3">
          {current && (
            <button
              onClick={() => onSave(null)}
              className="flex-1 py-3 rounded-2xl bg-red-50 text-red-600 font-bold text-base border-2 border-red-100"
            >
              🗑️ Borrar
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-600 font-bold text-base"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              const n1 = parseInt(r1), n2 = parseInt(r2);
              if (!isNaN(n1) && !isNaN(n2) && n1 >= 0 && n2 >= 0) onSave({ r1: n1, r2: n2 });
            }}
            className="flex-1 py-3 rounded-2xl bg-green-600 text-white font-black text-base shadow"
          >
            ✅ Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
