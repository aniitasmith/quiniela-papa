import { GROUPS_TEAMS } from "@/data/predictions";
import { flag } from "@/lib/flags";

const ROUND16_MATCHES = [
  ["A",0,"B",1],["C",0,"D",1],["E",0,"F",1],
  ["G",0,"H",1],["I",0,"J",1],["K",0,"L",1],
  ["B",0,"A",1],["D",0,"C",1],["F",0,"E",1],
  ["H",0,"G",1],["J",0,"I",1],["L",0,"K",1],
];

const LATER_ROUNDS = [
  { label:"🎯 Cuartos de Final", dates:"~Jul 4–5" },
  { label:"🔥 Semifinales",      dates:"~Jul 14–15" },
];

export default function BracketTab({ adv }) {
  return (
    <div>
      <div className="text-center mb-5">
        <h2 className="text-2xl font-black text-green-900">🏆 Bracket del Mundial</h2>
        <p className="text-gray-600 text-base mt-1">
          Clasificados y cruces según las predicciones de Martín.<br/>
          Cuartos, semis y final se actualizarán conforme avance el torneo.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-md border-2 border-green-100 overflow-hidden mb-5">
        <div className="bg-green-700 px-4 py-3">
          <h3 className="text-white font-black text-xl">✅ Clasificados por grupo</h3>
          <p className="text-green-200 text-sm">1° y 2° de cada grupo</p>
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

      <div className="bg-white rounded-2xl shadow-md border-2 border-green-100 overflow-hidden mb-4">
        <div className="bg-green-700 px-4 py-3 flex items-center justify-between">
          <h3 className="text-white font-black text-xl">⚔️ Octavos de Final</h3>
          <span className="text-green-200 text-sm">~Jul 1–3</span>
        </div>
        <div className="divide-y divide-gray-100">
          {ROUND16_MATCHES.map(([g1,r1,g2,r2], i) => {
            const t1 = adv[g1]?.[r1];
            const t2 = adv[g2]?.[r2];
            return (
              <div key={i} className="flex items-center gap-2 px-4 py-3">
                <span className="text-xs text-green-700 font-black w-7 shrink-0">{g1}{r1+1}</span>
                <span className="text-2xl leading-none shrink-0">{flag(t1)}</span>
                <span className="font-bold text-sm text-green-900 flex-1 truncate">{t1 ?? "?"}</span>
                <span className="text-xs font-black text-gray-400 shrink-0 px-1">vs</span>
                <span className="font-bold text-sm text-green-900 flex-1 text-right truncate">{t2 ?? "?"}</span>
                <span className="text-2xl leading-none shrink-0">{flag(t2)}</span>
                <span className="text-xs text-green-700 font-black w-7 shrink-0 text-right">{g2}{r2+1}</span>
              </div>
            );
          })}
          <div className="px-4 py-3 bg-gray-50 text-center text-xs text-gray-400 font-medium">
            + 4 partidos con los 8 mejores 3ros. lugares (por definir)
          </div>
        </div>
      </div>

      {LATER_ROUNDS.map(round => (
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
  );
}
