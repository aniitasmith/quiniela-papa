"use client";
import { useState } from "react";
import { useQuiniela } from "@/hooks/useQuiniela";
import { matchKey } from "@/lib/scoring";
import ResultModal from "@/components/ResultModal";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import GruposTab from "@/components/GruposTab";
import BracketTab from "@/components/BracketTab";
import PartidosTab from "@/components/PartidosTab";

export default function Home() {
  const [tab, setTab] = useState("grupos");
  const {
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
  } = useQuiniela();

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

      <Header
        syncStatus={syncStatus}
        syncMsg={syncMsg}
        syncDebug={syncDebug}
        syncedAt={syncedAt}
        overrideCount={overrideCount}
        onSync={syncFromSheet}
        onResetOverrides={resetOverrides}
      />

      <div className="max-w-2xl mx-auto px-3 pt-5">
        {tab === "grupos" && (
          <GruposTab
            predictions={predictions}
            realResults={realResults}
            standings={standings}
            score={score}
            onEditMatch={setEditingMatch}
          />
        )}
        {tab === "bracket" && <BracketTab adv={adv} />}
        {tab === "partidos" && (
          <PartidosTab
            predictions={predictions}
            realResults={realResults}
            realCount={realCount}
            onEditMatch={setEditingMatch}
          />
        )}
      </div>

      <BottomNav tab={tab} onTabChange={setTab} />
    </main>
  );
}
