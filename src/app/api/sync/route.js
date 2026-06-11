const SHEET_ID = "1NDqZzWfJMsM9oHv_dKOnNFi5BykFaEx4";
const GID      = "1964972787";

export async function GET() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${GID}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return Response.json({
        error: "No se pudo acceder al spreadsheet. Asegúrate de que esté compartido como 'Cualquiera con el enlace puede ver'.",
      }, { status: 400 });
    }

    const csv = await res.text();
    const { rows, debug } = parseSheet(csv);

    // Always return rows + debug info so the client can decide what to do
    return Response.json({
      rows,
      totalRows: debug.totalRows,
      sample: debug.sample,
      headers: debug.headers,
      syncedAt: new Date().toISOString(),
    });
  } catch (e) {
    return Response.json({ error: `Error de red: ${e.message}` }, { status: 500 });
  }
}

// ── CSV utilities ──────────────────────────────────────────────────────────

function cleanCell(s) {
  return (s ?? "")
    .replace(/^"|"$/g, "")
    .replace(/&amp;/g,  "&")
    .replace(/&lt;/g,   "<")
    .replace(/&gt;/g,   ">")
    .replace(/&quot;/g, '"')
    .replace(/&#\d+;/g, "")
    .replace(/﻿/g, "")         // BOM
    .trim();
}

function splitRow(line) {
  const fields = [];
  let cur = "", inQ = false;
  for (const ch of line) {
    if (ch === '"') { inQ = !inQ; }
    else if (ch === "," && !inQ) { fields.push(cleanCell(cur)); cur = ""; }
    else { cur += ch; }
  }
  fields.push(cleanCell(cur));
  return fields;
}

const norm = s => s?.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim() ?? "";

function parseSheet(csv) {
  const lines = csv.trim().split(/\r?\n/).map(splitRow);
  const debug = {
    totalRows: lines.length,
    headers:   lines[0]?.join(" | ") ?? "(vacío)",
    sample:    lines[1]?.join(" | ") ?? "(vacío)",
  };
  if (lines.length < 2) return { rows: [], debug };

  const header = lines[0].map(norm);
  const find = (...keys) => {
    for (const k of keys) {
      const i = header.findIndex(h => h === norm(k) || h.includes(norm(k)));
      if (i >= 0) return i;
    }
    return -1;
  };

  // Detect column positions from header names
  const iDate  = find("fecha","date","dia","jornada","day");
  const iHour  = find("hora","time","hour","horario");
  const iGroup = find("grupo","group","grp");
  const iT1    = find("local","home","equipo1","equipo 1","team1","casa","team 1");
  const iT2    = find("visita","visitante","away","equipo2","equipo 2","team2","team 2");
  // For scores, look explicitly — we want the SECOND occurrence of number-like columns
  const iP1    = findScore(header, iT1, "local","home","goles1","score1","p1","gol1","prediccion local");
  const iP2    = findScore(header, iT2, "visita","away","goles2","score2","p2","gol2","prediccion visita");

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i];
    if (row.length < 4 || row.every(c => c === "")) continue;

    const t1 = iT1 >= 0 ? row[iT1] : row[3];
    const t2 = iT2 >= 0 ? row[iT2] : (row[4] ?? "");

    // Find numeric scores — prefer header-mapped, else scan for numeric pair
    let p1 = iP1 >= 0 ? parseInt(row[iP1]) : NaN;
    let p2 = iP2 >= 0 ? parseInt(row[iP2]) : NaN;

    if (isNaN(p1) || isNaN(p2)) {
      // Scan from column 5 for first valid numeric pair
      for (let c = 4; c < row.length - 1; c++) {
        if (c === iT1 || c === iT2) continue;
        const a = parseInt(row[c]), b = parseInt(row[c + 1]);
        if (!isNaN(a) && !isNaN(b) && a >= 0 && a <= 30 && b >= 0 && b <= 30) {
          p1 = a; p2 = b; break;
        }
      }
    }

    if (!t1 || !t2 || isNaN(p1) || isNaN(p2)) continue;

    rows.push({
      d:  iDate  >= 0 ? row[iDate]  : row[0],
      h:  iHour  >= 0 ? row[iHour]  : row[1],
      g:  (iGroup >= 0 ? row[iGroup] : row[2])?.toUpperCase() ?? "?",
      t1: t1.trim(),
      t2: t2.trim(),
      p1, p2,
    });
  }

  return { rows, debug };
}

// Find score column: must not be the same as the team column
function findScore(header, excludeCol, ...keys) {
  for (const k of keys) {
    const n = norm(k);
    for (let i = 0; i < header.length; i++) {
      if (i !== excludeCol && (header[i] === n || header[i].includes(n))) return i;
    }
  }
  return -1;
}
