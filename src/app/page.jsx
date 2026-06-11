"use client";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

// ── Data ─────────────────────────────────────────────────────────────────────

const PREDICTIONS = [
  { d:"11-Jun", h:"3:00 PM",  g:"A", t1:"México",               t2:"Sudáfrica",           p1:2, p2:0 },
  { d:"11-Jun", h:"10:00 PM", g:"A", t1:"Corea del Sur",         t2:"Chequia",             p1:1, p2:1 },
  { d:"12-Jun", h:"3:00 PM",  g:"B", t1:"Canadá",                t2:"Bosnia y Herzegovina",p1:2, p2:1 },
  { d:"12-Jun", h:"9:00 PM",  g:"D", t1:"Estados Unidos",        t2:"Paraguay",            p1:1, p2:0 },
  { d:"13-Jun", h:"3:00 PM",  g:"B", t1:"Qatar",                 t2:"Suiza",               p1:0, p2:2 },
  { d:"13-Jun", h:"6:00 PM",  g:"C", t1:"Brasil",                t2:"Marruecos",           p1:3, p2:1 },
  { d:"13-Jun", h:"9:00 PM",  g:"C", t1:"Haití",                 t2:"Escocia",             p1:0, p2:2 },
  { d:"14-Jun", h:"12:00 AM", g:"D", t1:"Australia",             t2:"Turquía",             p1:1, p2:2 },
  { d:"14-Jun", h:"1:00 PM",  g:"E", t1:"Alemania",              t2:"Curazao",             p1:4, p2:0 },
  { d:"14-Jun", h:"4:00 PM",  g:"F", t1:"Países Bajos",          t2:"Japón",               p1:1, p2:1 },
  { d:"14-Jun", h:"7:00 PM",  g:"E", t1:"Costa de Marfil",       t2:"Ecuador",             p1:1, p2:2 },
  { d:"14-Jun", h:"10:00 PM", g:"F", t1:"Suecia",                t2:"Túnez",               p1:2, p2:0 },
  { d:"15-Jun", h:"12:00 PM", g:"H", t1:"España",                t2:"Cabo Verde",          p1:3, p2:0 },
  { d:"15-Jun", h:"3:00 PM",  g:"G", t1:"Bélgica",               t2:"Egipto",              p1:2, p2:1 },
  { d:"15-Jun", h:"6:00 PM",  g:"H", t1:"Arabia Saudita",        t2:"Uruguay",             p1:0, p2:1 },
  { d:"15-Jun", h:"9:00 PM",  g:"G", t1:"Irán",                  t2:"Nueva Zelanda",       p1:0, p2:0 },
  { d:"16-Jun", h:"3:00 PM",  g:"I", t1:"Francia",               t2:"Senegal",             p1:2, p2:1 },
  { d:"16-Jun", h:"6:00 PM",  g:"I", t1:"Irak",                  t2:"Noruega",             p1:0, p2:2 },
  { d:"16-Jun", h:"9:00 PM",  g:"J", t1:"Argentina",             t2:"Argelia",             p1:2, p2:0 },
  { d:"17-Jun", h:"12:00 AM", g:"J", t1:"Austria",               t2:"Jordania",            p1:2, p2:0 },
  { d:"17-Jun", h:"1:00 PM",  g:"K", t1:"Portugal",              t2:"RD Congo",            p1:2, p2:0 },
  { d:"17-Jun", h:"4:00 PM",  g:"L", t1:"Inglaterra",            t2:"Croacia",             p1:2, p2:1 },
  { d:"17-Jun", h:"7:00 PM",  g:"L", t1:"Ghana",                 t2:"Panamá",              p1:1, p2:0 },
  { d:"17-Jun", h:"10:00 PM", g:"K", t1:"Uzbekistán",            t2:"Colombia",            p1:1, p2:2 },
  { d:"18-Jun", h:"12:00 PM", g:"A", t1:"Chequia",               t2:"Sudáfrica",           p1:1, p2:0 },
  { d:"18-Jun", h:"3:00 PM",  g:"B", t1:"Suiza",                 t2:"Bosnia y Herzegovina",p1:1, p2:0 },
  { d:"18-Jun", h:"6:00 PM",  g:"B", t1:"Canadá",                t2:"Qatar",               p1:2, p2:0 },
  { d:"18-Jun", h:"9:00 PM",  g:"A", t1:"México",                t2:"Corea del Sur",       p1:1, p2:1 },
  { d:"19-Jun", h:"3:00 PM",  g:"D", t1:"Estados Unidos",        t2:"Australia",           p1:2, p2:1 },
  { d:"19-Jun", h:"6:00 PM",  g:"C", t1:"Escocia",               t2:"Marruecos",           p1:1, p2:2 },
  { d:"19-Jun", h:"8:30 PM",  g:"C", t1:"Brasil",                t2:"Haití",               p1:4, p2:0 },
  { d:"19-Jun", h:"11:00 PM", g:"D", t1:"Turquía",               t2:"Paraguay",            p1:1, p2:1 },
  { d:"20-Jun", h:"1:00 PM",  g:"F", t1:"Países Bajos",          t2:"Suecia",              p1:2, p2:1 },
  { d:"20-Jun", h:"4:00 PM",  g:"E", t1:"Alemania",              t2:"Costa de Marfil",     p1:2, p2:0 },
  { d:"20-Jun", h:"8:00 PM",  g:"E", t1:"Ecuador",               t2:"Curazao",             p1:2, p2:0 },
  { d:"21-Jun", h:"12:00 AM", g:"F", t1:"Túnez",                 t2:"Japón",               p1:0, p2:1 },
  { d:"21-Jun", h:"12:00 PM", g:"H", t1:"España",                t2:"Arabia Saudita",      p1:2, p2:0 },
  { d:"21-Jun", h:"3:00 PM",  g:"G", t1:"Bélgica",               t2:"Irán",                p1:2, p2:0 },
  { d:"21-Jun", h:"6:00 PM",  g:"H", t1:"Uruguay",               t2:"Cabo Verde",          p1:3, p2:1 },
  { d:"21-Jun", h:"9:00 PM",  g:"G", t1:"Nueva Zelanda",         t2:"Egipto",              p1:1, p2:1 },
  { d:"22-Jun", h:"1:00 PM",  g:"J", t1:"Argentina",             t2:"Austria",             p1:2, p2:0 },
  { d:"22-Jun", h:"5:00 PM",  g:"I", t1:"Francia",               t2:"Irak",                p1:3, p2:0 },
  { d:"22-Jun", h:"8:00 PM",  g:"I", t1:"Noruega",               t2:"Senegal",             p1:1, p2:1 },
  { d:"22-Jun", h:"11:00 PM", g:"J", t1:"Jordania",              t2:"Argelia",             p1:0, p2:2 },
  { d:"23-Jun", h:"1:00 PM",  g:"K", t1:"Portugal",              t2:"Uzbekistán",          p1:1, p2:0 },
  { d:"23-Jun", h:"4:00 PM",  g:"L", t1:"Inglaterra",            t2:"Ghana",               p1:2, p2:0 },
  { d:"23-Jun", h:"7:00 PM",  g:"L", t1:"Panamá",                t2:"Croacia",             p1:0, p2:1 },
  { d:"23-Jun", h:"10:00 PM", g:"K", t1:"Colombia",              t2:"RD Congo",            p1:1, p2:0 },
  { d:"24-Jun", h:"3:00 PM",  g:"B", t1:"Suiza",                 t2:"Canadá",              p1:1, p2:1 },
  { d:"24-Jun", h:"3:00 PM",  g:"B", t1:"Bosnia y Herzegovina",  t2:"Qatar",               p1:2, p2:0 },
  { d:"24-Jun", h:"6:00 PM",  g:"C", t1:"Escocia",               t2:"Brasil",              p1:0, p2:2 },
  { d:"24-Jun", h:"6:00 PM",  g:"C", t1:"Marruecos",             t2:"Haití",               p1:3, p2:0 },
  { d:"24-Jun", h:"9:00 PM",  g:"A", t1:"Chequia",               t2:"México",              p1:1, p2:2 },
  { d:"24-Jun", h:"9:00 PM",  g:"A", t1:"Sudáfrica",             t2:"Corea del Sur",       p1:2, p2:2 },
  { d:"25-Jun", h:"4:00 PM",  g:"E", t1:"Ecuador",               t2:"Alemania",            p1:1, p2:2 },
  { d:"25-Jun", h:"4:00 PM",  g:"E", t1:"Curazao",               t2:"Costa de Marfil",     p1:0, p2:3 },
  { d:"25-Jun", h:"7:00 PM",  g:"F", t1:"Japón",                 t2:"Suecia",              p1:1, p2:1 },
  { d:"25-Jun", h:"7:00 PM",  g:"F", t1:"Túnez",                 t2:"Países Bajos",        p1:0, p2:2 },
  { d:"25-Jun", h:"10:00 PM", g:"D", t1:"Turquía",               t2:"Estados Unidos",      p1:1, p2:2 },
  { d:"25-Jun", h:"10:00 PM", g:"D", t1:"Paraguay",              t2:"Australia",           p1:1, p2:1 },
  { d:"26-Jun", h:"3:00 PM",  g:"I", t1:"Noruega",               t2:"Francia",             p1:1, p2:2 },
  { d:"26-Jun", h:"3:00 PM",  g:"I", t1:"Senegal",               t2:"Irak",                p1:2, p2:0 },
  { d:"26-Jun", h:"8:00 PM",  g:"H", t1:"Cabo Verde",            t2:"Arabia Saudita",      p1:1, p2:1 },
  { d:"26-Jun", h:"8:00 PM",  g:"H", t1:"Uruguay",               t2:"España",              p1:1, p2:2 },
  { d:"26-Jun", h:"11:00 PM", g:"G", t1:"Egipto",                t2:"Irán",                p1:1, p2:0 },
  { d:"26-Jun", h:"11:00 PM", g:"G", t1:"Nueva Zelanda",         t2:"Bélgica",             p1:0, p2:3 },
  { d:"27-Jun", h:"5:00 PM",  g:"L", t1:"Panamá",                t2:"Inglaterra",          p1:0, p2:3 },
  { d:"27-Jun", h:"5:00 PM",  g:"L", t1:"Croacia",               t2:"Ghana",               p1:2, p2:1 },
  { d:"27-Jun", h:"7:30 PM",  g:"K", t1:"Colombia",              t2:"Portugal",            p1:1, p2:1 },
  { d:"27-Jun", h:"7:30 PM",  g:"K", t1:"RD Congo",              t2:"Uzbekistán",          p1:1, p2:0 },
  { d:"27-Jun", h:"10:00 PM", g:"J", t1:"Argelia",               t2:"Austria",             p1:1, p2:1 },
  { d:"27-Jun", h:"10:00 PM", g:"J", t1:"Jordania",              t2:"Argentina",           p1:0, p2:3 },
];

const GROUPS_TEAMS = {
  A:["México","Corea del Sur","Chequia","Sudáfrica"],
  B:["Canadá","Suiza","Bosnia y Herzegovina","Qatar"],
  C:["Brasil","Marruecos","Escocia","Haití"],
  D:["Estados Unidos","Turquía","Paraguay","Australia"],
  E:["Alemania","Costa de Marfil","Ecuador","Curazao"],
  F:["Países Bajos","Japón","Suecia","Túnez"],
  G:["Bélgica","Irán","Egipto","Nueva Zelanda"],
  H:["España","Uruguay","Arabia Saudita","Cabo Verde"],
  I:["Francia","Noruega","Senegal","Irak"],
  J:["Argentina","Austria","Argelia","Jordania"],
  K:["Portugal","Colombia","RD Congo","Uzbekistán"],
  L:["Inglaterra","Croacia","Ghana","Panamá"],
};

const GROUP_FLAGS = {
  "México":"🇲🇽","Corea del Sur":"🇰🇷","Chequia":"🇨🇿","Sudáfrica":"🇿🇦",
  "Canadá":"🇨🇦","Suiza":"🇨🇭","Bosnia y Herzegovina":"🇧🇦","Qatar":"🇶🇦",
  "Brasil":"🇧🇷","Marruecos":"🇲🇦","Escocia":"🏴󠁧󠁢󠁳󠁣󠁴󠁿","Haití":"🇭🇹",
  "Estados Unidos":"🇺🇸","Turquía":"🇹🇷","Paraguay":"🇵🇾","Australia":"🇦🇺",
  "Alemania":"🇩🇪","Costa de Marfil":"🇨🇮","Ecuador":"🇪🇨","Curazao":"🇨🇼",
  "Países Bajos":"🇳🇱","Japón":"🇯🇵","Suecia":"🇸🇪","Túnez":"🇹🇳",
  "Bélgica":"🇧🇪","Irán":"🇮🇷","Egipto":"🇪🇬","Nueva Zelanda":"🇳🇿",
  "España":"🇪🇸","Uruguay":"🇺🇾","Arabia Saudita":"🇸🇦","Cabo Verde":"🇨🇻",
  "Francia":"🇫🇷","Noruega":"🇳🇴","Senegal":"🇸🇳","Irak":"🇮🇶",
  "Argentina":"🇦🇷","Austria":"🇦🇹","Argelia":"🇩🇿","Jordania":"🇯🇴",
  "Portugal":"🇵🇹","Colombia":"🇨🇴","RD Congo":"🇨🇩","Uzbekistán":"🇺🇿",
  "Inglaterra":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","Croacia":"🇭🇷","Ghana":"🇬🇭","Panamá":"🇵🇦",
};

// ── Utilities ────────────────────────────────────────────────────────────────

// Strip accents + lowercase — used for flag lookup and sheet→PREDICTIONS matching.
// Handles "Mexico" → "México", "Belgica" → "Bélgica", etc.
const _norm = s => s?.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").trim() ?? "";

const _flagByNorm = Object.fromEntries(
  Object.entries(GROUP_FLAGS).map(([k,v]) => [_norm(k), v])
);
function flag(t) {
  return GROUP_FLAGS[t] ?? _flagByNorm[_norm(t)] ?? "🏳️";
}

function matchKey(m) { return `${m.d}|${m.t1}|${m.t2}`; }

// ── Scoring (Reglas Oficiales de la Quiniela) ────────────────────────────────
// 3 pts: acertar ganador · 2 pts: acertar empate
// 2 pts: acertar goles del equipo local (independiente del resultado)
// 2 pts: acertar goles del equipo visitante (independiente del resultado)
function scoreMatch(pred, real) {
  const { p1, p2 } = pred;
  const { r1, r2 } = real;
  let pts = 0;
  let breakdown = { winner: 0, draw: 0, goalsHome: 0, goalsAway: 0 };
  const predDraw = p1 === p2, realDraw = r1 === r2;
  if (realDraw && predDraw) { pts += 2; breakdown.draw = 2; }
  else if (!realDraw && !predDraw && (p1 > p2) === (r1 > r2)) { pts += 3; breakdown.winner = 3; }
  if (p1 === r1) { pts += 2; breakdown.goalsHome = 2; }
  if (p2 === r2) { pts += 2; breakdown.goalsAway = 2; }
  return { pts, breakdown };
}

function totalScore(predictions, realResults) {
  let total = 0, played = 0;
  predictions.forEach(m => {
    const real = realResults[matchKey(m)];
    if (!real) return;
    total += scoreMatch(m, real).pts;
    played++;
  });
  return { total, played };
}

// ── Standings ────────────────────────────────────────────────────────────────

function computeStandings(predictions, realResults) {
  const st = {};
  Object.keys(GROUPS_TEAMS).forEach(g =>
    GROUPS_TEAMS[g].forEach(t => { st[t] = { pts:0, gf:0, ga:0, gd:0, played:0, group:g }; })
  );
  predictions.forEach(m => {
    const real = realResults[matchKey(m)];
    const g1 = real ? real.r1 : m.p1;
    const g2 = real ? real.r2 : m.p2;
    const s1 = st[m.t1], s2 = st[m.t2];
    if (!s1 || !s2) return;
    s1.played++; s2.played++;
    s1.gf += g1; s1.ga += g2; s1.gd = s1.gf - s1.ga;
    s2.gf += g2; s2.ga += g1; s2.gd = s2.gf - s2.ga;
    if (g1 > g2) { s1.pts += 3; }
    else if (g1 < g2) { s2.pts += 3; }
    else { s1.pts += 1; s2.pts += 1; }
  });
  return st;
}

function getAdvancing(st) {
  const adv = {};
  Object.keys(GROUPS_TEAMS).forEach(g => {
    const ranked = GROUPS_TEAMS[g]
      .map(t => ({ name:t, ...st[t] }))
      .sort((a,b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
    adv[g] = [ranked[0]?.name, ranked[1]?.name];
  });
  return adv;
}

function groupByDate(matches) {
  const map = {};
  matches.forEach(m => {
    if (!map[m.d]) map[m.d] = [];
    map[m.d].push(m);
  });
  return map;
}

// ── Sync helpers ─────────────────────────────────────────────────────────────

// Build lookup: norm(t1)|norm(t2) → canonical matchKey from PREDICTIONS
const _predIndex = {};
PREDICTIONS.forEach(m => {
  _predIndex[`${_norm(m.t1)}|${_norm(m.t2)}`] = matchKey(m);
});

// Only matches found in PREDICTIONS are kept — team names/dates never change
function buildOverrides(syncedRows) {
  const overrides = {};
  syncedRows.forEach(row => {
    const canonKey = _predIndex[`${_norm(row.t1)}|${_norm(row.t2)}`];
    if (canonKey && !isNaN(row.p1) && !isNaN(row.p2)) {
      overrides[canonKey] = { p1: row.p1, p2: row.p2 };
    }
  });
  return overrides;
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function ResultModal({ match, current, onSave, onClose }) {
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
        <h2 className="text-xl font-black text-green-900 text-center mb-1">⚽ Resultado Real</h2>
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

// ── Main component ────────────────────────────────────────────────────────────

export default function Home() {
  const [tab, setTab]                     = useState("grupos");
  // predOverrides: { [matchKey]: { p1, p2 } } — only scores, matched to PREDICTIONS keys
  // PREDICTIONS structure (team names, dates, groups) never changes
  const [predOverrides, setPredOverrides] = useState({});
  const [realResults, setRealResults]     = useState({});
  const [syncStatus, setSyncStatus]       = useState(null);
  const [syncMsg, setSyncMsg]             = useState("");
  const [syncDebug, setSyncDebug]         = useState("");
  const [syncedAt, setSyncedAt]           = useState("");
  const [editingMatch, setEditingMatch]   = useState(null);

  // Effective predictions: PREDICTIONS structure + synced scores applied on top
  const predictions = PREDICTIONS.map(m => {
    const ov = predOverrides[matchKey(m)];
    return ov ? { ...m, p1: ov.p1, p2: ov.p2 } : m;
  });

  const syncFromSheet = useCallback(async ({ silent = false } = {}) => {
    if (!silent) { setSyncStatus("loading"); setSyncMsg(""); setSyncDebug(""); }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const res = await fetch(`/api/sync?t=${Date.now()}`, {
        signal: controller.signal,
        cache: "no-store",
      });
      clearTimeout(timeout);
      const data = await res.json();

      if (data.error) {
        if (!silent) {
          setSyncStatus("error");
          setSyncMsg(data.error);
          setSyncDebug(data.debug ?? "");
          setTimeout(() => setSyncStatus(null), 8000);
        }
        return;
      }

      const rows = data.rows ?? [];
      const overrides = buildOverrides(rows);
      const matchedCount = Object.keys(overrides).length;

      if (matchedCount === 0) {
        if (!silent) {
          const sheetTeams = rows.slice(0, 4).map(r => `"${r.t1}" vs "${r.t2}"`).join(", ");
          setSyncStatus("error");
          setSyncMsg("No se pudo hacer coincidir ningún partido del spreadsheet con la quiniela.");
          setSyncDebug(`Equipos en el sheet: ${sheetTeams || "(ninguno)"} | Cabeceras: ${data.headers}`);
          setTimeout(() => setSyncStatus(null), 15000);
        }
        return;
      }

      setPredOverrides(overrides);
      try { localStorage.setItem("quiniela_pred_overrides", JSON.stringify(overrides)); } catch {}

      const at = new Date(data.syncedAt).toLocaleString("es-MX", { dateStyle:"short", timeStyle:"short" });
      setSyncedAt(at);
      try { localStorage.setItem("quiniela_synced_at", at); } catch {}

      if (!silent) {
        setSyncStatus("ok");
        setSyncMsg(`¡Listo! ${matchedCount} de ${PREDICTIONS.length} partidos actualizados desde el spreadsheet.`);
        setTimeout(() => setSyncStatus(null), 8000);
      }
    } catch (e) {
      clearTimeout(timeout);
      if (!silent) {
        setSyncStatus("error");
        setSyncMsg(e.name === "AbortError"
          ? "La conexión tardó demasiado. Intenta de nuevo."
          : "No se pudo conectar. Verifica tu internet.");
        setTimeout(() => setSyncStatus(null), 8000);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.removeItem("quiniela_predictions"); // legacy key cleanup

    try {
      const saved = localStorage.getItem("quiniela_real_results");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
          setRealResults(parsed);
        }
      }
    } catch { localStorage.removeItem("quiniela_real_results"); }

    try {
      const savedAt = localStorage.getItem("quiniela_synced_at");
      if (savedAt) setSyncedAt(savedAt);
    } catch {}

    try {
      const savedOv = localStorage.getItem("quiniela_pred_overrides");
      if (savedOv) {
        const parsed = JSON.parse(savedOv);
        if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
          setPredOverrides(parsed);
        }
      }
    } catch { localStorage.removeItem("quiniela_pred_overrides"); }

    syncFromSheet({ silent: true });
  }, [syncFromSheet]);

  function saveRealResult(match, result) {
    const key = matchKey(match);
    setRealResults(prev => {
      const next = { ...prev };
      if (result === null) delete next[key];
      else next[key] = result;
      try { localStorage.setItem("quiniela_real_results", JSON.stringify(next)); } catch {}
      return next;
    });
    setEditingMatch(null);
  }

  function resetOverrides() {
    setPredOverrides({});
    setSyncedAt("");
    try {
      localStorage.removeItem("quiniela_pred_overrides");
      localStorage.removeItem("quiniela_synced_at");
    } catch {}
  }

  const standings     = computeStandings(predictions, realResults);
  const adv           = getAdvancing(standings);
  const score         = totalScore(predictions, realResults);
  const realCount     = Object.keys(realResults).length;
  const overrideCount = Object.keys(predOverrides).length;
  const sheetUrl      = "https://docs.google.com/spreadsheets/d/1NDqZzWfJMsM9oHv_dKOnNFi5BykFaEx4/edit";

  const tabs = [
    { id:"grupos",   icon:"🏟️",  label:"Grupos"     },
    { id:"bracket",  icon:"🏆",  label:"Bracket"    },
    { id:"partidos", icon:"⚽",  label:"Partidos"   },
    { id:"puntos",   icon:"🎯",  label:"Mis Puntos" },
  ];

  return (
    <main className="min-h-screen bg-green-50 font-sans pb-24">

      {editingMatch && (
        <ResultModal
          match={editingMatch}
          current={realResults[matchKey(editingMatch)]}
          onSave={result => saveRealResult(editingMatch, result)}
          onClose={() => setEditingMatch(null)}
        />
      )}

      {/* ── HEADER ── */}
      <div className="bg-header-gradient">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-grid-lines" />
          <div className="relative max-w-2xl mx-auto px-5 py-6 text-center">
            <div className="bounce-slow inline-block text-6xl mb-2">⚽</div>
            <h1 className="text-white font-black text-3xl leading-tight drop-shadow">
              Quiniela de<br/>
              <span className="text-yellow-300">Martín Smith</span>
            </h1>
            <p className="text-green-200 text-lg mt-1 font-medium">
              🌎 Mundial 2026 · USA · Canadá · México
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <a
                href={sheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-yellow-400 text-green-900 font-bold text-base px-5 py-2.5 rounded-full shadow-lg active:scale-95 transition"
              >
                📋 Ver mi quiniela
              </a>
              <button
                onClick={syncFromSheet}
                disabled={syncStatus === "loading"}
                className="inline-flex items-center gap-2 bg-white/20 text-white border-2 border-white/40 font-bold text-base px-5 py-2.5 rounded-full shadow active:scale-95 transition disabled:opacity-60"
              >
                {syncStatus === "loading" ? "⏳ Actualizando..." : "🔄 Actualizar quiniela"}
              </button>
            </div>

            {syncStatus === "ok" && (
              <div className="mt-3 bg-green-400/30 border border-green-300 text-white rounded-xl px-4 py-2 text-sm font-medium">
                ✅ {syncMsg}
              </div>
            )}
            {syncStatus === "error" && (
              <div className="mt-3 bg-red-500/30 border border-red-300 text-white rounded-xl px-4 py-2 text-sm">
                <p className="font-bold">❌ {syncMsg}</p>
                {syncDebug && (
                  <p className="mt-2 text-xs bg-black/20 rounded p-2 font-mono break-all leading-relaxed">
                    {syncDebug}
                  </p>
                )}
              </div>
            )}
            {syncedAt && syncStatus == null && overrideCount > 0 && (
              <div className="mt-2 flex items-center justify-center gap-3 flex-wrap">
                <p className="text-green-300 text-xs">🔄 {overrideCount} partidos sync · {syncedAt}</p>
                <button
                  onClick={resetOverrides}
                  className="text-xs text-green-300 underline underline-offset-2"
                >
                  Restablecer originales
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-2xl mx-auto px-3 pt-5">

        {/* ══ TAB: GRUPOS ══ */}
        {tab === "grupos" && (
          <div>
            <div className="text-center mb-5">
              <h2 className="text-2xl font-black text-green-900">🏟️ Fase de Grupos</h2>
              <div className="inline-block mt-2 bg-yellow-100 text-yellow-800 font-bold text-sm px-3 py-1 rounded-full">
                📊 Proyección basada en las predicciones de Martín
              </div>
              <p className="text-gray-500 text-sm mt-2">
                Los equipos en <span className="text-green-700 font-bold">verde</span> clasificarían si sus predicciones se cumplen
              </p>
            </div>

            <div className="space-y-4">
              {Object.keys(GROUPS_TEAMS).map(g => {
                const ranked = GROUPS_TEAMS[g]
                  .map(t => ({ name:t, ...standings[t] }))
                  .sort((a,b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
                return (
                  <div key={g} className="bg-white rounded-2xl shadow-md overflow-hidden border-2 border-green-100">
                    <div className="bg-green-700 px-4 py-3 flex items-center gap-2">
                      <span className="text-white font-black text-xl">GRUPO {g}</span>
                      <span className="ml-auto text-green-200 text-sm font-medium">Pts proyectados</span>
                    </div>
                    {ranked.map((t, i) => (
                      <div key={t.name} className={cn("flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0", i < 2 ? "bg-green-50" : "bg-white opacity-60")}>
                        <span className={cn("w-8 h-8 rounded-full flex items-center justify-center font-black text-base shrink-0", i === 0 ? "bg-yellow-400 text-yellow-900" : i === 1 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500")}>
                          {i + 1}
                        </span>
                        <span className="text-3xl leading-none shrink-0">{flag(t.name)}</span>
                        <span className={cn("font-bold text-lg flex-1", i < 2 ? "text-green-900" : "text-gray-500")}>
                          {t.name}
                        </span>
                        {i < 2 && (
                          <span className="text-xs bg-green-600 text-white font-bold px-2 py-0.5 rounded-full shrink-0">
                            ✓ Clasifica
                          </span>
                        )}
                        <div className={cn("font-black text-xl shrink-0", i < 2 ? "text-green-800" : "text-gray-400")}>{t.pts}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ TAB: BRACKET ══ */}
        {tab === "bracket" && (
          <div>
            <div className="text-center mb-5">
              <h2 className="text-2xl font-black text-green-900">🏆 Bracket del Mundial</h2>
              <p className="text-gray-600 text-base mt-1">
                Quién clasifica de cada grupo según Martín.<br/>
                Las rondas eliminatorias se llenarán después.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md border-2 border-green-100 overflow-hidden mb-5">
              <div className="bg-green-700 px-4 py-3">
                <h3 className="text-white font-black text-xl">✅ Clasificados de Grupos</h3>
                <p className="text-green-200 text-sm">1° y 2° lugar de cada grupo</p>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                {Object.keys(GROUPS_TEAMS).map(g => (
                  <div key={g} className="border-2 border-green-100 rounded-xl overflow-hidden">
                    <div className="bg-green-100 text-green-800 font-black text-sm px-3 py-1.5 text-center">
                      GRUPO {g}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border-b border-green-100">
                      <span className="bg-yellow-400 text-yellow-900 font-black text-xs w-5 h-5 rounded-full flex items-center justify-center shrink-0">1</span>
                      <span className="text-2xl leading-none">{flag(adv[g]?.[0])}</span>
                      <span className="font-bold text-sm text-green-900 truncate">{adv[g]?.[0]}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-50">
                      <span className="bg-green-500 text-white font-black text-xs w-5 h-5 rounded-full flex items-center justify-center shrink-0">2</span>
                      <span className="text-2xl leading-none">{flag(adv[g]?.[1])}</span>
                      <span className="font-bold text-sm text-green-800 truncate">{adv[g]?.[1]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {[
              { label:"⚔️ Octavos de Final", dates:"~Jul 1–3" },
              { label:"🎯 Cuartos de Final", dates:"~Jul 4–5" },
              { label:"🔥 Semifinales",      dates:"~Jul 14–15" },
            ].map(round => (
              <div key={round.label} className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden mb-4 opacity-60">
                <div className="bg-gray-100 px-4 py-3 flex items-center justify-between">
                  <h3 className="font-black text-lg text-gray-500">{round.label}</h3>
                  <span className="text-sm text-gray-400">{round.dates}</span>
                </div>
                <div className="px-4 py-5 text-center">
                  <div className="text-4xl mb-2">⏳</div>
                  <p className="text-gray-400 font-bold text-lg">Por definir</p>
                  <p className="text-gray-400 text-sm">Se completará conforme avance el torneo</p>
                </div>
              </div>
            ))}

            <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden mb-4 opacity-60">
              <div className="bg-gray-100 px-4 py-3 flex items-center justify-between">
                <h3 className="font-black text-lg text-gray-500">🏆 Gran Final</h3>
                <span className="text-sm text-gray-400">19 Jul · MetLife Stadium</span>
              </div>
              <div className="px-4 py-5 text-center">
                <div className="text-5xl mb-2">🏆</div>
                <p className="text-gray-400 font-bold text-lg">Por definir</p>
              </div>
            </div>
          </div>
        )}

        {/* ══ TAB: PARTIDOS ══ */}
        {tab === "partidos" && (
          <div>
            <div className="text-center mb-5">
              <h2 className="text-2xl font-black text-green-900">⚽ Todos los Partidos</h2>
              <p className="text-gray-600 text-base mt-1">
                Toca el marcador para anotar el resultado real
              </p>
              {realCount > 0 && (
                <div className="inline-block mt-2 bg-blue-100 text-blue-800 font-bold text-sm px-4 py-1.5 rounded-full">
                  📝 {realCount} resultado{realCount !== 1 ? "s" : ""} real{realCount !== 1 ? "es" : ""} anotado{realCount !== 1 ? "s" : ""}
                </div>
              )}
            </div>

            {Object.entries(groupByDate(predictions)).map(([date, matches]) => (
              <div key={date} className="mb-5">
                <div className="flex items-center gap-3 mb-2 px-1">
                  <span className="text-base font-black text-green-800">📅 {date}</span>
                  <div className="flex-1 h-px bg-green-200" />
                </div>

                <div className="space-y-2">
                  {matches.map((m, i) => {
                    const real = realResults[matchKey(m)];
                    const g1 = real ? real.r1 : m.p1;
                    const g2 = real ? real.r2 : m.p2;
                    const homeWins = g1 > g2;
                    const awayWins = g2 > g1;
                    const draw = g1 === g2;
                    return (
                      <div key={i} className={cn("bg-white rounded-2xl shadow-sm overflow-hidden border-2", real ? "border-blue-200" : "border-gray-100")}>
                        <div className={cn("px-4 py-1.5 flex items-center justify-between", real ? "bg-blue-600" : "bg-green-700")}>
                          <span className="text-white/80 font-bold text-sm">Grupo {m.g}</span>
                          <span className="text-white/80 text-sm">🕐 {m.h} ET</span>
                          {real && <span className="text-white font-bold text-xs bg-blue-500 px-2 py-0.5 rounded-full">✏️ Real</span>}
                        </div>
                        <div className="px-3 py-3 flex items-center gap-2">
                          {/* home team — name always visible, flag dims if lost */}
                          <div className="flex-1 flex items-center gap-2 min-w-0">
                            <span className={cn("text-3xl leading-none shrink-0", !homeWins && !draw && "opacity-40")}>{flag(m.t1)}</span>
                            <span className="font-bold text-base leading-tight text-green-900 truncate">{m.t1}</span>
                          </div>
                          <button
                            onClick={() => setEditingMatch(m)}
                            className={cn("shrink-0 text-center rounded-2xl px-3 py-1.5 active:scale-95 transition", real ? "bg-blue-600 text-white shadow-md" : "bg-green-900 text-white")}
                          >
                            <div className="font-black text-2xl whitespace-nowrap">{g1} – {g2}</div>
                            <div className="text-xs opacity-70 mt-0.5">{real ? "resultado real" : "predicción · tocar"}</div>
                          </button>
                          {/* away team — name always visible, flag dims if lost */}
                          <div className="flex-1 flex items-center gap-2 justify-end min-w-0">
                            <span className="font-bold text-base leading-tight text-right text-green-900 truncate">{m.t2}</span>
                            <span className={cn("text-3xl leading-none shrink-0", !awayWins && !draw && "opacity-40")}>{flag(m.t2)}</span>
                          </div>
                        </div>
                        {real && (
                          <div className="border-t border-blue-100 px-4 py-1.5 flex items-center gap-2 bg-blue-50">
                            <span className="text-xs text-blue-500 font-medium">Predicción de Martín:</span>
                            <span className="text-xs text-blue-700 font-bold">{m.p1} – {m.p2}</span>
                            {m.p1 === real.r1 && m.p2 === real.r2
                              ? <span className="ml-auto text-xs bg-green-500 text-white font-bold px-2 py-0.5 rounded-full">¡Exacto! 🎯</span>
                              : ((m.p1 > m.p2) === (real.r1 > real.r2) && (m.p1 === m.p2) === (real.r1 === real.r2))
                                ? <span className="ml-auto text-xs bg-yellow-400 text-yellow-900 font-bold px-2 py-0.5 rounded-full">Ganador correcto ⚽</span>
                                : <span className="ml-auto text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">Falló ❌</span>
                            }
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ TAB: PUNTOS ══ */}
        {tab === "puntos" && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-green-900">🎯 Mis Puntos</h2>
              <p className="text-gray-500 text-base mt-1">
                Basado en los resultados reales que anotaste
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-3xl p-6 text-center text-white shadow-xl mb-6">
              <div className="text-6xl font-black mb-1">{score.total}</div>
              <div className="text-green-200 text-lg font-bold">puntos totales</div>
              <div className="mt-3 text-green-300 text-sm">
                de {score.played} partido{score.played !== 1 ? "s" : ""} jugado{score.played !== 1 ? "s" : ""}
                {" · "}máximo posible: {score.played * 7} pts
              </div>
              {score.played === 0 && (
                <div className="mt-4 bg-white/10 rounded-2xl px-4 py-3 text-sm text-green-200">
                  Anota los resultados reales en la pestaña <strong>⚽ Partidos</strong> para ver tu puntaje
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-md border-2 border-green-100 overflow-hidden mb-5">
              <div className="bg-green-700 px-4 py-3">
                <h3 className="text-white font-black text-lg">📋 Cómo se cuentan los puntos</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { icon:"🥇", label:"Acertar el GANADOR", pts:"3 pts", color:"text-yellow-600" },
                  { icon:"🤝", label:"Acertar el EMPATE",  pts:"2 pts", color:"text-blue-600"   },
                  { icon:"⚽", label:"Acertar goles del equipo local (sin importar quién gane)", pts:"2 pts", color:"text-green-700" },
                  { icon:"⚽", label:"Acertar goles del equipo visitante (sin importar quién gane)", pts:"2 pts", color:"text-green-700" },
                ].map((r, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-4">
                    <span className="text-3xl">{r.icon}</span>
                    <span className="flex-1 text-gray-800 font-medium text-base leading-tight">{r.label}</span>
                    <span className={`font-black text-xl ${r.color} shrink-0`}>{r.pts}</span>
                  </div>
                ))}
                <div className="flex items-center gap-3 px-4 py-4 bg-yellow-50">
                  <span className="text-3xl">🏆</span>
                  <span className="flex-1 text-yellow-800 font-bold text-base">Máximo por partido (ganador + ambos goles)</span>
                  <span className="font-black text-2xl text-yellow-600 shrink-0">7 pts</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border-2 border-yellow-100 overflow-hidden mb-5">
              <div className="bg-yellow-500 px-4 py-3">
                <h3 className="text-white font-black text-lg">🏅 Premios</h3>
              </div>
              <div className="divide-y divide-yellow-100">
                <div className="flex items-center gap-3 px-4 py-4">
                  <span className="text-4xl">🥇</span>
                  <div className="flex-1">
                    <div className="font-black text-lg text-gray-900">1er Lugar</div>
                    <div className="text-gray-500 text-sm">Mayor puntaje total</div>
                  </div>
                  <span className="font-black text-xl text-yellow-600">70%</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-4">
                  <span className="text-4xl">🥈</span>
                  <div className="flex-1">
                    <div className="font-black text-lg text-gray-900">2do Lugar</div>
                    <div className="text-gray-500 text-sm">Segundo mayor puntaje</div>
                  </div>
                  <span className="font-black text-xl text-gray-500">30%</span>
                </div>
              </div>
            </div>

            {score.played > 0 && (
              <div className="bg-white rounded-2xl shadow-md border-2 border-green-100 overflow-hidden">
                <div className="bg-green-700 px-4 py-3">
                  <h3 className="text-white font-black text-lg">📊 Desglose por partido</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {predictions.filter(m => realResults[matchKey(m)]).map((m, i) => {
                    const real = realResults[matchKey(m)];
                    const { pts, breakdown } = scoreMatch(m, real);
                    return (
                      <div key={i} className="px-4 py-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{flag(m.t1)}</span>
                          <span className="font-bold text-sm text-gray-800">{m.t1}</span>
                          <span className="text-gray-400 text-sm font-bold mx-1">{real.r1}–{real.r2}</span>
                          <span className="font-bold text-sm text-gray-800">{m.t2}</span>
                          <span className="text-xl">{flag(m.t2)}</span>
                          <span className={cn("ml-auto font-black text-lg", pts >= 5 ? "text-green-600" : pts >= 2 ? "text-yellow-600" : "text-gray-400")}>
                            {pts} pts
                          </span>
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          <span className="text-xs text-gray-400">Predicción: {m.p1}–{m.p2} ·</span>
                          {breakdown.winner > 0 && <span className="text-xs bg-green-100 text-green-700 px-1.5 rounded font-bold">+3 ganador</span>}
                          {breakdown.draw > 0   && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 rounded font-bold">+2 empate</span>}
                          {breakdown.goalsHome > 0 && <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 rounded font-bold">+2 goles {m.t1.split(" ")[0]}</span>}
                          {breakdown.goalsAway > 0 && <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 rounded font-bold">+2 goles {m.t2.split(" ")[0]}</span>}
                          {pts === 0 && <span className="text-xs text-gray-400">sin puntos</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── BOTTOM NAV ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-green-100 shadow-2xl z-50">
        <div className="max-w-2xl mx-auto flex">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn("flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all", tab === t.id ? "text-green-700 bg-green-50" : "text-gray-400")}
            >
              <span className="text-3xl leading-none">{t.icon}</span>
              <span className={cn("text-sm font-bold", tab === t.id ? "text-green-700" : "text-gray-400")}>
                {t.label}
              </span>
              {tab === t.id && (
                <span className="w-8 h-1 bg-green-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
