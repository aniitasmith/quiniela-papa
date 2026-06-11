import { cn } from "@/lib/utils";
import { flag } from "@/lib/flags";
import { matchKey } from "@/lib/scoring";
import { groupByDate } from "@/lib/match-utils";

export default function PartidosTab({ predictions, realResults, realCount, onEditMatch }) {
  return (
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
                    <div className="flex-1 flex items-center gap-2 min-w-0">
                      <span className={cn("text-3xl leading-none shrink-0", !homeWins && !draw && "opacity-40")}>{flag(m.t1)}</span>
                      <span className="font-bold text-base leading-tight text-green-900 truncate">{m.t1}</span>
                    </div>
                    <button
                      onClick={() => onEditMatch(m)}
                      className={cn("shrink-0 text-center rounded-2xl px-3 py-1.5 active:scale-95 transition", real ? "bg-blue-600 text-white shadow-md" : "bg-green-900 text-white")}
                    >
                      <div className="font-black text-2xl whitespace-nowrap">{g1} – {g2}</div>
                      <div className="text-xs opacity-70 mt-0.5">{real ? "resultado real" : "mi predicción · tocar"}</div>
                    </button>
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
  );
}
