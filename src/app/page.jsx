"use client";
import { useState, useEffect } from "react";

// ── Predictions of Martín Smith read from his Google Sheet ──
const PREDICTIONS = [
  { d:"11-Jun", h:"3:00 PM",  g:"A", t1:"México",               t2:"Sudáfrica",          p1:2, p2:0 },
  { d:"11-Jun", h:"10:00 PM", g:"A", t1:"Corea del Sur",         t2:"Chequia",            p1:1, p2:1 },
  { d:"12-Jun", h:"3:00 PM",  g:"B", t1:"Canadá",                t2:"Bosnia y Herzegovina",p1:2, p2:1 },
  { d:"12-Jun", h:"9:00 PM",  g:"D", t1:"Estados Unidos",        t2:"Paraguay",           p1:1, p2:0 },
  { d:"13-Jun", h:"3:00 PM",  g:"B", t1:"Qatar",                 t2:"Suiza",              p1:0, p2:2 },
  { d:"13-Jun", h:"6:00 PM",  g:"C", t1:"Brasil",                t2:"Marruecos",          p1:3, p2:1 },
  { d:"13-Jun", h:"9:00 PM",  g:"C", t1:"Haití",                 t2:"Escocia",            p1:0, p2:2 },
  { d:"14-Jun", h:"12:00 AM", g:"D", t1:"Australia",             t2:"Turquía",            p1:1, p2:2 },
  { d:"14-Jun", h:"1:00 PM",  g:"E", t1:"Alemania",              t2:"Curazao",            p1:4, p2:0 },
  { d:"14-Jun", h:"4:00 PM",  g:"F", t1:"Países Bajos",          t2:"Japón",              p1:1, p2:1 },
  { d:"14-Jun", h:"7:00 PM",  g:"E", t1:"Costa de Marfil",       t2:"Ecuador",            p1:1, p2:2 },
  { d:"14-Jun", h:"10:00 PM", g:"F", t1:"Suecia",                t2:"Túnez",              p1:2, p2:0 },
  { d:"15-Jun", h:"12:00 PM", g:"H", t1:"España",                t2:"Cabo Verde",         p1:3, p2:0 },
  { d:"15-Jun", h:"3:00 PM",  g:"G", t1:"Bélgica",               t2:"Egipto",             p1:2, p2:1 },
  { d:"15-Jun", h:"6:00 PM",  g:"H", t1:"Arabia Saudita",        t2:"Uruguay",            p1:0, p2:1 },
  { d:"15-Jun", h:"9:00 PM",  g:"G", t1:"Irán",                  t2:"Nueva Zelanda",      p1:0, p2:0 },
  { d:"16-Jun", h:"3:00 PM",  g:"I", t1:"Francia",               t2:"Senegal",            p1:2, p2:1 },
  { d:"16-Jun", h:"6:00 PM",  g:"I", t1:"Irak",                  t2:"Noruega",            p1:0, p2:2 },
  { d:"16-Jun", h:"9:00 PM",  g:"J", t1:"Argentina",             t2:"Argelia",            p1:2, p2:0 },
  { d:"17-Jun", h:"12:00 AM", g:"J", t1:"Austria",               t2:"Jordania",           p1:2, p2:0 },
  { d:"17-Jun", h:"1:00 PM",  g:"K", t1:"Portugal",              t2:"RD Congo",           p1:2, p2:0 },
  { d:"17-Jun", h:"4:00 PM",  g:"L", t1:"Inglaterra",            t2:"Croacia",            p1:2, p2:1 },
  { d:"17-Jun", h:"7:00 PM",  g:"L", t1:"Ghana",                 t2:"Panamá",             p1:1, p2:0 },
  { d:"17-Jun", h:"10:00 PM", g:"K", t1:"Uzbekistán",            t2:"Colombia",           p1:1, p2:2 },
  { d:"18-Jun", h:"12:00 PM", g:"A", t1:"Chequia",               t2:"Sudáfrica",          p1:1, p2:0 },
  { d:"18-Jun", h:"3:00 PM",  g:"B", t1:"Suiza",                 t2:"Bosnia y Herzegovina",p1:1, p2:0 },
  { d:"18-Jun", h:"6:00 PM",  g:"B", t1:"Canadá",                t2:"Qatar",              p1:2, p2:0 },
  { d:"18-Jun", h:"9:00 PM",  g:"A", t1:"México",                t2:"Corea del Sur",      p1:1, p2:1 },
  { d:"19-Jun", h:"3:00 PM",  g:"D", t1:"Estados Unidos",        t2:"Australia",          p1:2, p2:1 },
  { d:"19-Jun", h:"6:00 PM",  g:"C", t1:"Escocia",               t2:"Marruecos",          p1:1, p2:2 },
  { d:"19-Jun", h:"8:30 PM",  g:"C", t1:"Brasil",                t2:"Haití",              p1:4, p2:0 },
  { d:"19-Jun", h:"11:00 PM", g:"D", t1:"Turquía",               t2:"Paraguay",           p1:1, p2:1 },
  { d:"20-Jun", h:"1:00 PM",  g:"F", t1:"Países Bajos",          t2:"Suecia",             p1:2, p2:1 },
  { d:"20-Jun", h:"4:00 PM",  g:"E", t1:"Alemania",              t2:"Costa de Marfil",    p1:2, p2:0 },
  { d:"20-Jun", h:"8:00 PM",  g:"E", t1:"Ecuador",               t2:"Curazao",            p1:2, p2:0 },
  { d:"21-Jun", h:"12:00 AM", g:"F", t1:"Túnez",                 t2:"Japón",              p1:0, p2:1 },
  { d:"21-Jun", h:"12:00 PM", g:"H", t1:"España",                t2:"Arabia Saudita",     p1:2, p2:0 },
  { d:"21-Jun", h:"3:00 PM",  g:"G", t1:"Bélgica",               t2:"Irán",               p1:2, p2:0 },
  { d:"21-Jun", h:"6:00 PM",  g:"H", t1:"Uruguay",               t2:"Cabo Verde",         p1:3, p2:1 },
  { d:"21-Jun", h:"9:00 PM",  g:"G", t1:"Nueva Zelanda",         t2:"Egipto",             p1:1, p2:1 },
  { d:"22-Jun", h:"1:00 PM",  g:"J", t1:"Argentina",             t2:"Austria",            p1:2, p2:0 },
  { d:"22-Jun", h:"5:00 PM",  g:"I", t1:"Francia",               t2:"Irak",               p1:3, p2:0 },
  { d:"22-Jun", h:"8:00 PM",  g:"I", t1:"Noruega",               t2:"Senegal",            p1:1, p2:1 },
  { d:"22-Jun", h:"11:00 PM", g:"J", t1:"Jordania",              t2:"Argelia",            p1:0, p2:2 },
  { d:"23-Jun", h:"1:00 PM",  g:"K", t1:"Portugal",              t2:"Uzbekistán",         p1:1, p2:0 },
  { d:"23-Jun", h:"4:00 PM",  g:"L", t1:"Inglaterra",            t2:"Ghana",              p1:2, p2:0 },
  { d:"23-Jun", h:"7:00 PM",  g:"L", t1:"Panamá",                t2:"Croacia",            p1:0, p2:1 },
  { d:"23-Jun", h:"10:00 PM", g:"K", t1:"Colombia",              t2:"RD Congo",           p1:1, p2:0 },
  { d:"24-Jun", h:"3:00 PM",  g:"B", t1:"Suiza",                 t2:"Canadá",             p1:1, p2:1 },
  { d:"24-Jun", h:"3:00 PM",  g:"B", t1:"Bosnia y Herzegovina",  t2:"Qatar",              p1:2, p2:0 },
  { d:"24-Jun", h:"6:00 PM",  g:"C", t1:"Escocia",               t2:"Brasil",             p1:0, p2:2 },
  { d:"24-Jun", h:"6:00 PM",  g:"C", t1:"Marruecos",             t2:"Haití",              p1:3, p2:0 },
  { d:"24-Jun", h:"9:00 PM",  g:"A", t1:"Chequia",               t2:"México",             p1:1, p2:2 },
  { d:"24-Jun", h:"9:00 PM",  g:"A", t1:"Sudáfrica",             t2:"Corea del Sur",      p1:2, p2:2 },
  { d:"25-Jun", h:"4:00 PM",  g:"E", t1:"Ecuador",               t2:"Alemania",           p1:1, p2:2 },
  { d:"25-Jun", h:"4:00 PM",  g:"E", t1:"Curazao",               t2:"Costa de Marfil",    p1:0, p2:3 },
  { d:"25-Jun", h:"7:00 PM",  g:"F", t1:"Japón",                 t2:"Suecia",             p1:1, p2:1 },
  { d:"25-Jun", h:"7:00 PM",  g:"F", t1:"Túnez",                 t2:"Países Bajos",       p1:0, p2:2 },
  { d:"25-Jun", h:"10:00 PM", g:"D", t1:"Turquía",               t2:"Estados Unidos",     p1:1, p2:2 },
  { d:"25-Jun", h:"10:00 PM", g:"D", t1:"Paraguay",              t2:"Australia",          p1:1, p2:1 },
  { d:"26-Jun", h:"3:00 PM",  g:"I", t1:"Noruega",               t2:"Francia",            p1:1, p2:2 },
  { d:"26-Jun", h:"3:00 PM",  g:"I", t1:"Senegal",               t2:"Irak",               p1:2, p2:0 },
  { d:"26-Jun", h:"8:00 PM",  g:"H", t1:"Cabo Verde",            t2:"Arabia Saudita",     p1:1, p2:1 },
  { d:"26-Jun", h:"8:00 PM",  g:"H", t1:"Uruguay",               t2:"España",             p1:1, p2:2 },
  { d:"26-Jun", h:"11:00 PM", g:"G", t1:"Egipto",                t2:"Irán",               p1:1, p2:0 },
  { d:"26-Jun", h:"11:00 PM", g:"G", t1:"Nueva Zelanda",         t2:"Bélgica",            p1:0, p2:3 },
  { d:"27-Jun", h:"5:00 PM",  g:"L", t1:"Panamá",                t2:"Inglaterra",         p1:0, p2:3 },
  { d:"27-Jun", h:"5:00 PM",  g:"L", t1:"Croacia",               t2:"Ghana",              p1:2, p2:1 },
  { d:"27-Jun", h:"7:30 PM",  g:"K", t1:"Colombia",              t2:"Portugal",           p1:1, p2:1 },
  { d:"27-Jun", h:"7:30 PM",  g:"K", t1:"RD Congo",              t2:"Uzbekistán",         p1:1, p2:0 },
  { d:"27-Jun", h:"10:00 PM", g:"J", t1:"Argelia",               t2:"Austria",            p1:1, p2:1 },
  { d:"27-Jun", h:"10:00 PM", g:"J", t1:"Jordania",              t2:"Argentina",          p1:0, p2:3 },
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

function flag(t) { return GROUP_FLAGS[t] || "🏳"; }

// ── Compute standings from predictions ──
function computeStandings(results) {
  const st = {};
  Object.keys(GROUPS_TEAMS).forEach(g =>
    GROUPS_TEAMS[g].forEach(t => { st[t] = { pts:0, gf:0, ga:0, gd:0, played:0, group:g }; })
  );
  PREDICTIONS.forEach((m,i) => {
    const r = results[i];
    const g1 = r ? r.r1 : m.p1;
    const g2 = r ? r.r2 : m.p2;
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

function getAdvancing(results) {
  const st = computeStandings(results);
  const adv = {};
  Object.keys(GROUPS_TEAMS).forEach(g => {
    const ranked = GROUPS_TEAMS[g]
      .map(t => ({ name:t, ...st[t] }))
      .sort((a,b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
    adv[g] = [ranked[0]?.name, ranked[1]?.name];
  });
  return adv;
}

// ── Components ──
function TeamChip({ name, winner, small }) {
  const f = flag(name || "?");
  const size = small ? "text-xs" : "text-sm";
  return (
    <div className={`flex items-center gap-1.5 py-1 px-2 rounded ${winner ? "bg-emerald-900/40 text-white font-semibold" : "text-gray-400"} ${size}`}>
      <span className="text-base leading-none">{f}</span>
      <span className="truncate">{name || "?"}</span>
    </div>
  );
}

function MatchCard({ t1, t2, score, round, date }) {
  const [g1, g2] = score ? score.split("-").map(Number) : [null, null];
  const winner1 = g1 !== null && g1 > g2;
  const winner2 = g2 !== null && g2 > g1;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden w-44 shrink-0">
      {round && (
        <div className="bg-gray-800 px-2 py-1 text-[10px] text-gray-500 flex justify-between">
          <span>{round}</span>
          {date && <span>{date}</span>}
        </div>
      )}
      <div className="p-1">
        <div className="flex items-center justify-between gap-1">
          <TeamChip name={t1} winner={winner1} />
          {score && <span className="text-white font-bold text-xs whitespace-nowrap">{score}</span>}
        </div>
        <div className="border-t border-gray-800 my-0.5" />
        <div className="flex items-center justify-between gap-1">
          <TeamChip name={t2} winner={winner2} />
        </div>
      </div>
    </div>
  );
}

function GroupTable({ group, teams, standings, results }) {
  const rows = teams.map(t => ({
    name: t,
    ...standings[t],
    usesPred: !results.some((r,i) => r && PREDICTIONS[i] && (PREDICTIONS[i].t1 === t || PREDICTIONS[i].t2 === t))
  })).sort((a,b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <div className="bg-gray-800 px-3 py-2 text-xs font-semibold text-gray-400 tracking-widest">
        GRUPO {group}
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-gray-600 border-b border-gray-800">
            <th className="text-left px-3 py-1.5 font-normal">Equipo</th>
            <th className="text-center px-1 py-1.5 font-normal w-6">J</th>
            <th className="text-center px-1 py-1.5 font-normal w-6">GD</th>
            <th className="text-center px-1 py-1.5 font-normal w-8">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((t,i) => (
            <tr key={t.name} className={`border-b border-gray-800/50 ${i < 2 ? "" : "opacity-50"}`}>
              <td className="px-3 py-1.5 flex items-center gap-1.5">
                {i < 2 && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                {i >= 2 && <span className="w-1.5 h-1.5 rounded-full bg-gray-700 shrink-0" />}
                <span>{flag(t.name)}</span>
                <span className="text-gray-200 truncate">{t.name}</span>
              </td>
              <td className="text-center text-gray-500 px-1 py-1.5">{t.played}</td>
              <td className={`text-center px-1 py-1.5 ${t.gd > 0 ? "text-emerald-400" : t.gd < 0 ? "text-red-400" : "text-gray-500"}`}>
                {t.gd > 0 ? `+${t.gd}` : t.gd}
              </td>
              <td className={`text-center font-bold px-1 py-1.5 ${i < 2 ? "text-white" : "text-gray-500"}`}>
                {t.pts}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BracketColumn({ title, matches, small }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-[10px] font-semibold text-gray-600 tracking-widest uppercase text-center px-2">
        {title}
      </div>
      {matches.map((m,i) => (
        <MatchCard key={i} {...m} small={small} />
      ))}
    </div>
  );
}

export default function Home() {
  const [results, setResults] = useState(PREDICTIONS.map(() => null));
  const [tab, setTab] = useState("bracket");
  const [lastUpdate, setLastUpdate] = useState("—");

  // Compute standings
  const standings = computeStandings(results);
  const adv = getAdvancing(results);

  // Build R32 matchups (from group winners/runners-up)
  const r32 = [
    { t1:adv.A?.[0], t2:adv.B?.[1], date:"~Jun 28" },
    { t1:adv.B?.[0], t2:adv.A?.[1], date:"~Jun 28" },
    { t1:adv.C?.[0], t2:adv.D?.[1], date:"~Jun 28" },
    { t1:adv.D?.[0], t2:adv.C?.[1], date:"~Jun 28" },
    { t1:adv.E?.[0], t2:adv.F?.[1], date:"~Jun 29" },
    { t1:adv.F?.[0], t2:adv.E?.[1], date:"~Jun 29" },
    { t1:adv.G?.[0], t2:adv.H?.[1], date:"~Jun 29" },
    { t1:adv.H?.[0], t2:adv.G?.[1], date:"~Jun 29" },
    { t1:adv.I?.[0], t2:adv.J?.[1], date:"~Jun 30" },
    { t1:adv.J?.[0], t2:adv.I?.[1], date:"~Jun 30" },
    { t1:adv.K?.[0], t2:adv.L?.[1], date:"~Jun 30" },
    { t1:adv.L?.[0], t2:adv.K?.[1], date:"~Jun 30" },
    { t1:adv.A?.[0], t2:adv.C?.[1], date:"~Jul 1" },
    { t1:adv.B?.[0], t2:adv.D?.[1], date:"~Jul 1" },
    { t1:adv.E?.[0], t2:adv.G?.[1], date:"~Jul 1" },
    { t1:adv.F?.[0], t2:adv.H?.[1], date:"~Jul 1" },
  ];

  // Octavos — winners of R32 pairs
  const oct = [
    { t1:r32[0]?.t1, t2:r32[1]?.t1, date:"~Jun 28" },
    { t1:r32[2]?.t1, t2:r32[3]?.t1, date:"~Jun 29" },
    { t1:r32[4]?.t1, t2:r32[5]?.t1, date:"~Jun 29" },
    { t1:r32[6]?.t1, t2:r32[7]?.t1, date:"~Jun 30" },
    { t1:r32[8]?.t1, t2:r32[9]?.t1, date:"~Jun 30" },
    { t1:r32[10]?.t1, t2:r32[11]?.t1, date:"~Jul 1" },
    { t1:r32[12]?.t1, t2:r32[13]?.t1, date:"~Jul 1" },
    { t1:r32[14]?.t1, t2:r32[15]?.t1, date:"~Jul 1" },
  ];

  const qf = [
    { t1:oct[0]?.t1, t2:oct[1]?.t1, date:"~Jul 4" },
    { t1:oct[2]?.t1, t2:oct[3]?.t1, date:"~Jul 4" },
    { t1:oct[4]?.t1, t2:oct[5]?.t1, date:"~Jul 5" },
    { t1:oct[6]?.t1, t2:oct[7]?.t1, date:"~Jul 5" },
  ];

  const sf = [
    { t1:qf[0]?.t1, t2:qf[1]?.t1, date:"~Jul 14" },
    { t1:qf[2]?.t1, t2:qf[3]?.t1, date:"~Jul 15" },
  ];

  const final = { t1:sf[0]?.t1, t2:sf[1]?.t1, date:"19 Jul" };

  const sheetUrl = "https://docs.google.com/spreadsheets/d/1NDqZzWfJMsM9oHv_dKOnNFi5BykFaEx4/edit";

  return (
    <main className="min-h-screen bg-gray-950 text-white font-sans">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚽</span>
            <div>
              <h1 className="text-base font-semibold">Quiniela de Martín Smith</h1>
              <p className="text-xs text-gray-500">Mundial 2026 · USA · Canadá · México</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3 flex-wrap">
            <span className="text-xs text-gray-600">Actualizado: {lastUpdate}</span>
            <a
              href={sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-green-900/50 text-green-400 border border-green-800 px-3 py-1.5 rounded-lg hover:bg-green-900 transition"
            >
              📊 Ver quiniela original
            </a>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-gray-900/50 border-b border-gray-800 px-4 py-2">
        <div className="max-w-7xl mx-auto flex gap-6 text-xs overflow-x-auto">
          {[
            { label:"Clasificados", value: Object.values(adv).map(a=>a[0]).filter(Boolean).length + " líderes" },
            { label:"Final predicha", value: `${flag(final.t1)}${final.t1 || "?"} vs ${flag(final.t2)}${final.t2 || "?"}` },
            { label:"Grupos completados", value:`${Object.keys(GROUPS_TEAMS).length} grupos` },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-gray-600">{s.label}</span>
              <span className="text-white font-medium">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800 px-4">
        <div className="max-w-7xl mx-auto flex gap-0">
          {[["bracket","🏆 Bracket"],["grupos","📊 Grupos"],["partidos","📋 Partidos"]].map(([id,label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-4 py-3 text-sm border-b-2 transition ${
                tab === id
                  ? "border-emerald-500 text-white font-medium"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* BRACKET TAB */}
        {tab === "bracket" && (
          <div>
            <p className="text-xs text-gray-600 mb-4">
              Bracket generado automáticamente de las predicciones de Martín. Los equipos que avanzan se calculan por puntos, diferencia de goles y goles a favor.
            </p>

            {/* Final highlight */}
            <div className="mb-8 flex justify-center">
              <div className="bg-gradient-to-br from-yellow-900/30 to-amber-900/20 border border-yellow-700/50 rounded-2xl p-6 text-center max-w-sm w-full">
                <div className="text-yellow-500 text-xs font-semibold tracking-widest mb-3">🏆 FINAL PREDICHA · 19 JUL · METLIFE STADIUM</div>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <div className="text-4xl mb-1">{flag(final.t1)}</div>
                    <div className="text-sm font-semibold text-white">{final.t1 || "?"}</div>
                  </div>
                  <div className="text-gray-600 text-lg font-bold">vs</div>
                  <div className="text-center">
                    <div className="text-4xl mb-1">{flag(final.t2)}</div>
                    <div className="text-sm font-semibold text-white">{final.t2 || "?"}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Semis */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-600 tracking-widest uppercase mb-3">🔥 Semifinales</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {sf.map((m,i) => (
                  <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden w-52 shrink-0">
                    <div className="bg-gray-800 px-3 py-1.5 text-[10px] text-gray-500 flex justify-between">
                      <span>Semifinal {i+1}</span><span>{m.date}</span>
                    </div>
                    <div className="p-2 space-y-1">
                      <TeamChip name={m.t1} winner={true} />
                      <div className="border-t border-gray-800" />
                      <TeamChip name={m.t2} winner={true} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* QF */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-600 tracking-widest uppercase mb-3">🎯 Cuartos de final</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {qf.map((m,i) => (
                  <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden w-48 shrink-0">
                    <div className="bg-gray-800 px-3 py-1.5 text-[10px] text-gray-500 flex justify-between">
                      <span>Cuartos {i+1}</span><span>{m.date}</span>
                    </div>
                    <div className="p-2 space-y-1">
                      <TeamChip name={m.t1} winner={true} />
                      <div className="border-t border-gray-800" />
                      <TeamChip name={m.t2} winner={true} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Octavos */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-600 tracking-widest uppercase mb-3">⚔️ Octavos de final</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {oct.map((m,i) => (
                  <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden w-44 shrink-0">
                    <div className="bg-gray-800 px-2 py-1 text-[10px] text-gray-500 flex justify-between">
                      <span>Octavos {i+1}</span><span>{m.date}</span>
                    </div>
                    <div className="p-1.5 space-y-0.5">
                      <TeamChip name={m.t1} winner={true} small />
                      <div className="border-t border-gray-800" />
                      <TeamChip name={m.t2} winner={true} small />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* R32 */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-600 tracking-widest uppercase mb-3">🔵 Ronda de 32 — clasificados de grupos</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {r32.map((m,i) => (
                  <div key={i} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                    <div className="bg-gray-800/50 px-2 py-1 text-[10px] text-gray-600">
                      Partido {i+1} · {m.date}
                    </div>
                    <div className="p-1.5 space-y-0.5">
                      <TeamChip name={m.t1} winner={true} small />
                      <div className="border-t border-gray-800" />
                      <TeamChip name={m.t2} winner={false} small />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* GRUPOS TAB */}
        {tab === "grupos" && (
          <div>
            <p className="text-xs text-gray-600 mb-4">
              Clasificación basada en las predicciones de goles de Martín. Verde = avanza a ronda de 32.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Object.keys(GROUPS_TEAMS).map(g => (
                <GroupTable
                  key={g}
                  group={g}
                  teams={GROUPS_TEAMS[g]}
                  standings={standings}
                  results={results}
                />
              ))}
            </div>
          </div>
        )}

        {/* PARTIDOS TAB */}
        {tab === "partidos" && (
          <div>
            <p className="text-xs text-gray-600 mb-4">
              Predicciones de Martín Smith para los 72 partidos · Hora Toronto (ET)
            </p>
            <div className="space-y-1">
              {PREDICTIONS.map((m,i) => (
                <div key={i} className="flex items-center gap-3 py-2 px-3 bg-gray-900 rounded-lg border border-gray-800 hover:border-gray-700 transition text-sm">
                  <span className="text-xs text-gray-600 w-16 shrink-0">{m.d}</span>
                  <span className="text-xs text-gray-700 w-16 shrink-0">{m.h} ET</span>
                  <span className="text-xs bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded w-6 text-center shrink-0">{m.g}</span>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="flex items-center gap-1 text-gray-200 flex-1 min-w-0">
                      <span>{flag(m.t1)}</span>
                      <span className="truncate text-xs">{m.t1}</span>
                    </span>
                    <span className="bg-gray-800 text-white font-bold text-xs px-2 py-0.5 rounded shrink-0">
                      {m.p1}–{m.p2}
                    </span>
                    <span className="flex items-center gap-1 text-gray-200 flex-1 min-w-0 justify-end">
                      <span className="truncate text-xs text-right">{m.t2}</span>
                      <span>{flag(m.t2)}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
