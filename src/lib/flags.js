import { GROUP_FLAGS } from "@/data/predictions";

const _norm = s => s?.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").trim() ?? "";

const _flagByNorm = Object.fromEntries(
  Object.entries(GROUP_FLAGS).map(([k, v]) => [_norm(k), v])
);

export function flag(t) {
  return GROUP_FLAGS[t] ?? _flagByNorm[_norm(t)] ?? "🏳️";
}
