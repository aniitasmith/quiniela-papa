import { PREDICTIONS } from "@/data/predictions";
import { matchKey } from "@/lib/scoring";

const _norm = s => s?.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").trim() ?? "";

const _predIndex = {};
PREDICTIONS.forEach(m => {
  _predIndex[`${_norm(m.t1)}|${_norm(m.t2)}`] = matchKey(m);
});

export function buildOverrides(syncedRows) {
  const overrides = {};
  syncedRows.forEach(row => {
    const canonKey = _predIndex[`${_norm(row.t1)}|${_norm(row.t2)}`];
    if (canonKey && !isNaN(row.p1) && !isNaN(row.p2)) {
      overrides[canonKey] = { p1: row.p1, p2: row.p2 };
    }
  });
  return overrides;
}
