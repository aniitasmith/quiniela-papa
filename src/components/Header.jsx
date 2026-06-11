import { SHEET_URL } from "@/data/predictions";

export default function Header({
  syncStatus,
  syncMsg,
  syncDebug,
  syncedAt,
  overrideCount,
  onSync,
  onResetOverrides,
}) {
  return (
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
              href={SHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-yellow-400 text-green-900 font-bold text-base px-5 py-2.5 rounded-full shadow-lg active:scale-95 transition"
            >
              📋 Ver mi quiniela
            </a>
            <button
              onClick={onSync}
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
              <p className="text-green-300 text-xs">🔄 {overrideCount} partidos sincronizados · {syncedAt}</p>
              <button
                onClick={onResetOverrides}
                className="text-xs text-green-300 underline underline-offset-2"
              >
                Restablecer originales
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
