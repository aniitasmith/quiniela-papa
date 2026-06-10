"use client";
import { useState } from "react";

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

function flag(t) { return GROUP_FLAGS[t] || "🏳️"; }

function computeStandings() {
  const st = {};
  Object.keys(GROUPS_TEAMS).forEach(g =>
    GROUPS_TEAMS[g].forEach(t => { st[t] = { pts:0, gf:0, ga:0, gd:0, played:0, group:g }; })
  );
  PREDICTIONS.forEach(m => {
    const s1 = st[m.t1], s2 = st[m.t2];
    if (!s1 || !s2) return;
    s1.played++; s2.played++;
    s1.gf += m.p1; s1.ga += m.p2; s1.gd = s1.gf - s1.ga;
    s2.gf += m.p2; s2.ga += m.p1; s2.gd = s2.gf - s2.ga;
    if (m.p1 > m.p2) { s1.pts += 3; }
    else if (m.p1 < m.p2) { s2.pts += 3; }
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

// Group a list of matches by date label
function groupByDate(matches) {
  const map = {};
  matches.forEach(m => {
    if (!map[m.d]) map[m.d] = [];
    map[m.d].push(m);
  });
  return map;
}

export default function Home() {
  const [tab, setTab] = useState("grupos");

  const standings = computeStandings();
  const adv = getAdvancing(standings);

  const sheetUrl = "https://docs.google.com/spreadsheets/d/1NDqZzWfJMsM9oHv_dKOnNFi5BykFaEx4/edit";

  const tabs = [
    { id:"grupos",   icon:"🏟️",  label:"Grupos"   },
    { id:"bracket",  icon:"🏆",  label:"Bracket"  },
    { id:"partidos", icon:"⚽",  label:"Partidos" },
  ];

  return (
    <main className="min-h-screen bg-green-50 font-sans pb-24">

      {/* ── HEADER ── */}
      <div style={{background:"linear-gradient(135deg, #15803d 0%, #166534 60%, #14532d 100%)"}}>
        {/* decorative field lines */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
            backgroundImage:"repeating-linear-gradient(90deg, white 0, white 1px, transparent 1px, transparent 60px)",
          }} />
          <div className="relative max-w-2xl mx-auto px-5 py-6 text-center">
            <div className="bounce-slow inline-block text-6xl mb-2">⚽</div>
            <h1 className="text-white font-black text-3xl leading-tight drop-shadow">
              Quiniela de<br/>
              <span className="text-yellow-300">Martín Smith</span>
            </h1>
            <p className="text-green-200 text-lg mt-1 font-medium">
              🌎 Mundial 2026 · USA · Canadá · México
            </p>
            <a
              href={sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 bg-yellow-400 text-green-900 font-bold text-base px-5 py-2.5 rounded-full shadow-lg active:scale-95 transition"
            >
              📋 Ver mi quiniela completa
            </a>
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
              <p className="text-gray-600 text-base mt-1">
                Los equipos marcados en <span className="text-green-700 font-bold">verde</span> clasifican según las predicciones de Martín
              </p>
            </div>

            <div className="space-y-4">
              {Object.keys(GROUPS_TEAMS).map(g => {
                const rows = GROUPS_TEAMS[g]
                  .map(t => ({ name:t, ...standings[t] }))
                  .sort((a,b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
                return (
                  <div key={g} className="bg-white rounded-2xl shadow-md overflow-hidden border-2 border-green-100">
                    {/* group header */}
                    <div className="bg-green-700 px-4 py-3 flex items-center gap-2">
                      <span className="text-white font-black text-xl">GRUPO {g}</span>
                      <span className="ml-auto text-green-200 text-sm font-medium">Pts · GD · Goles</span>
                    </div>
                    {/* rows */}
                    {rows.map((t, i) => (
                      <div key={t.name} className={`flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0 ${i < 2 ? "bg-green-50" : "bg-white opacity-60"}`}>
                        {/* position badge */}
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-base shrink-0 ${i === 0 ? "bg-yellow-400 text-yellow-900" : i === 1 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}>
                          {i + 1}
                        </span>
                        {/* flag + name */}
                        <span className="text-3xl leading-none shrink-0">{flag(t.name)}</span>
                        <span className={`font-bold text-lg flex-1 ${i < 2 ? "text-green-900" : "text-gray-500"}`}>
                          {t.name}
                        </span>
                        {/* classified badge */}
                        {i < 2 && (
                          <span className="text-xs bg-green-600 text-white font-bold px-2 py-0.5 rounded-full shrink-0">
                            ✓ Clasifica
                          </span>
                        )}
                        {/* stats */}
                        <div className="text-right shrink-0">
                          <div className={`font-black text-xl ${i < 2 ? "text-green-800" : "text-gray-400"}`}>{t.pts}</div>
                          <div className="text-xs text-gray-400">{t.gd > 0 ? `+${t.gd}` : t.gd} · {t.gf}gf</div>
                        </div>
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

            {/* Clasificados section */}
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
                    {/* 1st */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border-b border-green-100">
                      <span className="bg-yellow-400 text-yellow-900 font-black text-xs w-5 h-5 rounded-full flex items-center justify-center shrink-0">1</span>
                      <span className="text-2xl leading-none">{flag(adv[g]?.[0])}</span>
                      <span className="font-bold text-sm text-green-900 truncate">{adv[g]?.[0]}</span>
                    </div>
                    {/* 2nd */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-50">
                      <span className="bg-green-500 text-white font-black text-xs w-5 h-5 rounded-full flex items-center justify-center shrink-0">2</span>
                      <span className="text-2xl leading-none">{flag(adv[g]?.[1])}</span>
                      <span className="font-bold text-sm text-green-800 truncate">{adv[g]?.[1]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending rounds */}
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

            {/* Final */}
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
                Las predicciones de Martín para los 72 partidos<br/>
                <span className="text-sm">(Hora de Toronto)</span>
              </p>
            </div>

            {Object.entries(groupByDate(PREDICTIONS)).map(([date, matches]) => (
              <div key={date} className="mb-5">
                {/* date header */}
                <div className="flex items-center gap-3 mb-2 px-1">
                  <span className="text-base font-black text-green-800">📅 {date}</span>
                  <div className="flex-1 h-px bg-green-200" />
                </div>

                <div className="space-y-2">
                  {matches.map((m, i) => {
                    const homeWins = m.p1 > m.p2;
                    const awayWins = m.p2 > m.p1;
                    const draw = m.p1 === m.p2;
                    return (
                      <div key={i} className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 overflow-hidden">
                        {/* group + time badge */}
                        <div className="bg-green-700 px-4 py-1.5 flex items-center justify-between">
                          <span className="text-green-200 font-bold text-sm">Grupo {m.g}</span>
                          <span className="text-green-200 text-sm">🕐 {m.h} ET</span>
                        </div>
                        {/* match */}
                        <div className="px-4 py-3 flex items-center gap-3">
                          {/* home team */}
                          <div className={`flex-1 flex items-center gap-2 ${homeWins ? "" : "opacity-50"}`}>
                            <span className="text-3xl leading-none">{flag(m.t1)}</span>
                            <span className={`font-bold text-base leading-tight ${homeWins ? "text-green-900" : "text-gray-600"}`}>
                              {m.t1}
                            </span>
                          </div>
                          {/* score */}
                          <div className="shrink-0 text-center">
                            <div className={`font-black text-2xl px-3 py-1 rounded-xl ${draw ? "bg-gray-100 text-gray-700" : "bg-green-900 text-white"}`}>
                              {m.p1} – {m.p2}
                            </div>
                            {draw && <div className="text-xs text-gray-400 mt-0.5 font-bold">EMPATE</div>}
                          </div>
                          {/* away team */}
                          <div className={`flex-1 flex items-center gap-2 justify-end ${awayWins ? "" : "opacity-50"}`}>
                            <span className={`font-bold text-base leading-tight text-right ${awayWins ? "text-green-900" : "text-gray-600"}`}>
                              {m.t2}
                            </span>
                            <span className="text-3xl leading-none">{flag(m.t2)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
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
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all ${
                tab === t.id
                  ? "text-green-700 bg-green-50"
                  : "text-gray-400"
              }`}
            >
              <span className="text-3xl leading-none">{t.icon}</span>
              <span className={`text-sm font-bold ${tab === t.id ? "text-green-700" : "text-gray-400"}`}>
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
