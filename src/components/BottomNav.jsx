import { cn } from "@/lib/utils";

const TABS = [
  { id:"grupos",   icon:"🏟️",  label:"Grupos"   },
  { id:"bracket",  icon:"🏆",  label:"Bracket"  },
  { id:"partidos", icon:"⚽",  label:"Partidos" },
];

export default function BottomNav({ tab, onTabChange }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-green-100 shadow-2xl z-50">
      <div className="max-w-2xl mx-auto flex">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
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
  );
}
