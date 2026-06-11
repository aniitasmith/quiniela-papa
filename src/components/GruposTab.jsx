import { cn } from "@/lib/utils";
import { GROUPS_TEAMS } from "@/data/predictions";
import { flag } from "@/lib/flags";
import { scoreMatch, matchKey } from "@/lib/scoring";

export default function GruposTab({ predictions, realResults, standings, score, onEditMatch }) {
  return (
    <div>
      {score.played > 0 && (
        <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-3xl p-5 text-center text-white shadow-xl mb-5">
          <div className="text-5xl font-black mb-1">{score.total}</div>
          <div className="text-green-200 text-lg font-bold">puntos de quiniela</div>
          <div className="mt-1 text-green-300 text-sm">
            {score.played} partido{score.played !== 1 ? "s" : ""} jugado{score.played !== 1 ? "s" : ""}
            {" · "}máximo posible: {score.played * 7} pts
          </div>
        </div>
      )}

      <div className="text-center mb-5">
        <h2 className="text-2xl font-black text-green-900">🏟️ Fase de Grupos</h2>
        <div className="inline-block mt-2 bg-yellow-100 text-yellow-800 font-bold text-sm px-3 py-1 rounded-full">
          📊 Proyección basada en las predicciones de Martín
        </div>
        <p className="text-gray-500 text-sm mt-2">
          Equipos en <span className="text-green-700 font-bold">verde</span> clasificarían según las predicciones
        </p>
      </div>

      <div className="space-y-4">
        {Object.keys(GROUPS_TEAMS).map(g => {
          const ranked = GROUPS_TEAMS[g]
            .map(t => ({ name:t, ...standings[t] }))
            .sort((a,b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
          const gMatches = predictions.filter(m => m.g === g);
          const groupQPts = gMatches.reduce((sum, m) => {
            const real = realResults[matchKey(m)];
            return real ? sum + scoreMatch(m, real).pts : sum;
          }, 0);
          const groupPlayed = gMatches.filter(m => realResults[matchKey(m)]).length;
          return (
            <div key={g} className="bg-white rounded-2xl shadow-md overflow-hidden border-2 border-green-100">
              <div className="bg-green-700 px-4 py-3 flex items-center gap-2">
                <span className="text-white font-black text-xl">GRUPO {g}</span>
                {groupPlayed > 0
                  ? <span className="ml-auto text-yellow-300 font-black text-sm">{groupQPts} pts quiniela</span>
                  : <span className="ml-auto text-green-200 text-sm font-medium">Pts proyectados</span>
                }
              </div>
              {ranked.map((t, i) => (
                <div key={t.name} className={cn("flex items-center gap-3 px-4 py-3 border-b border-gray-100", i < 2 ? "bg-green-50" : "bg-white opacity-60")}>
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
              <div className="border-t-2 border-green-100">
                <div className="bg-green-50 px-4 py-2">
                  <span className="text-xs font-bold text-green-700">⚽ Partidos · toca para ingresar el resultado real</span>
                </div>
                {gMatches.map((m, mi) => {
                  const real = realResults[matchKey(m)];
                  const { pts } = real ? scoreMatch(m, real) : {};
                  const projPts = scoreMatch(m, { r1: m.p1, r2: m.p2 }).pts;
                  return (
                    <button
                      key={mi}
                      onClick={() => onEditMatch(m)}
                      className={cn(
                        "w-full flex items-center gap-2 px-4 py-2.5 border-b border-gray-50 last:border-b-0 active:scale-95 transition",
                        real ? "bg-blue-50" : "bg-white"
                      )}
                    >
                      <span className="text-xs text-gray-400 w-14 shrink-0 text-left">{m.d}</span>
                      <span className="text-2xl leading-none shrink-0">{flag(m.t1)}</span>
                      <span className={cn("font-black text-lg shrink-0 w-10 text-center", real ? "text-blue-700" : "text-green-800")}>
                        {real ? `${real.r1}–${real.r2}` : `${m.p1}–${m.p2}`}
                      </span>
                      <span className="text-2xl leading-none shrink-0">{flag(m.t2)}</span>
                      {real && (
                        <span className={cn("font-black text-sm ml-auto shrink-0", pts >= 5 ? "text-green-600" : pts >= 2 ? "text-yellow-600" : "text-red-400")}>
                          {pts}/{projPts} pts
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-white rounded-2xl shadow-md border-2 border-green-100 overflow-hidden mb-4">
        <div className="bg-green-700 px-4 py-3">
          <h3 className="text-white font-black text-lg">📋 Cómo se cuentan los puntos</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            { icon:"🥇", label:"Acertar el GANADOR", pts:"3 pts", color:"text-yellow-600" },
            { icon:"🤝", label:"Acertar el EMPATE",  pts:"2 pts", color:"text-blue-600"   },
            { icon:"⚽", label:"Goles del equipo local (independiente del resultado)", pts:"2 pts", color:"text-green-700" },
            { icon:"⚽", label:"Goles del equipo visitante (independiente del resultado)", pts:"2 pts", color:"text-green-700" },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <span className="text-2xl">{r.icon}</span>
              <span className="flex-1 text-gray-800 font-medium text-sm leading-tight">{r.label}</span>
              <span className={`font-black text-lg ${r.color} shrink-0`}>{r.pts}</span>
            </div>
          ))}
          <div className="flex items-center gap-3 px-4 py-3 bg-yellow-50">
            <span className="text-2xl">🏆</span>
            <span className="flex-1 text-yellow-800 font-bold text-sm">Máximo por partido</span>
            <span className="font-black text-xl text-yellow-600 shrink-0">7 pts</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md border-2 border-yellow-100 overflow-hidden mb-5">
        <div className="bg-yellow-500 px-4 py-3">
          <h3 className="text-white font-black text-lg">🏅 Premios</h3>
        </div>
        <div className="divide-y divide-yellow-100">
          <div className="flex items-center gap-3 px-4 py-4">
            <span className="text-3xl">🥇</span>
            <div className="flex-1">
              <div className="font-black text-base text-gray-900">1er Lugar</div>
              <div className="text-gray-500 text-sm">Mayor puntaje total</div>
            </div>
            <span className="font-black text-xl text-yellow-600">70%</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-4">
            <span className="text-3xl">🥈</span>
            <div className="flex-1">
              <div className="font-black text-base text-gray-900">2do Lugar</div>
              <div className="text-gray-500 text-sm">Segundo mayor puntaje</div>
            </div>
            <span className="font-black text-xl text-gray-500">30%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
