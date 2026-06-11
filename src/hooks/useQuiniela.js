"use client";
import { useState, useEffect, useCallback } from "react";
import { PREDICTIONS } from "@/data/predictions";
import { buildOverrides } from "@/lib/sync";
import { matchKey, totalScore } from "@/lib/scoring";
import { computeStandings, getAdvancing } from "@/lib/standings";

export function useQuiniela() {
  const [predOverrides, setPredOverrides] = useState({});
  const [realResults, setRealResults] = useState({});
  const [syncStatus, setSyncStatus] = useState(null);
  const [syncMsg, setSyncMsg] = useState("");
  const [syncDebug, setSyncDebug] = useState("");
  const [syncedAt, setSyncedAt] = useState("");
  const [editingMatch, setEditingMatch] = useState(null);

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
          setSyncMsg("No se encontró ningún partido del spreadsheet en la quiniela.");
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
    localStorage.removeItem("quiniela_predictions");

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

  const standings = computeStandings(predictions, realResults);
  const adv = getAdvancing(standings);
  const score = totalScore(predictions, realResults);
  const realCount = Object.keys(realResults).length;
  const overrideCount = Object.keys(predOverrides).length;

  return {
    predictions,
    realResults,
    syncStatus,
    syncMsg,
    syncDebug,
    syncedAt,
    editingMatch,
    setEditingMatch,
    syncFromSheet,
    saveRealResult,
    resetOverrides,
    standings,
    adv,
    score,
    realCount,
    overrideCount,
  };
}
