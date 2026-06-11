const SHEET_ID = "1NDqZzWfJMsM9oHv_dKOnNFi5BykFaEx4";
const GID      = "1964972787";

// Known team names (canonical Spanish spelling) for fuzzy matching
const KNOWN_TEAMS = [
  "México","Corea del Sur","Chequia","Sudáfrica",
  "Canadá","Suiza","Bosnia y Herzegovina","Qatar",
  "Brasil","Marruecos","Escocia","Haití",
  "Estados Unidos","Turquía","Paraguay","Australia",
  "Alemania","Costa de Marfil","Ecuador","Curazao",
  "Países Bajos","Japón","Suecia","Túnez",
  "Bélgica","Irán","Egipto","Nueva Zelanda",
  "España","Uruguay","Arabia Saudita","Cabo Verde",
  "Francia","Noruega","Senegal","Irak",
  "Argentina","Austria","Argelia","Jordania",
  "Portugal","Colombia","RD Congo","Uzbekistán",
  "Inglaterra","Croacia","Ghana","Panamá",
];

const norm = s => s?.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").trim() ?? "";
const NORM_MAP = Object.fromEntries(KNOWN_TEAMS.map(t => [norm(t), t]));

// Resolve a raw CSV string to canonical team name, or return cleaned version
function resolveTeam(raw) {
  const cleaned = cleanCell(raw);
  return NORM_MAP[norm(cleaned)] ?? cleaned;
}

// Strip HTML entities, BOM, non-printable chars, surrounding quotes
function cleanCell(s) {
  return (s ?? "")
    .replace(/^"|"$/g, "")          // CSV quotes
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")          // this was causing the ">" bug
    .replace(/&quot;/g, '"')
    .replace(/&#\d+;/g, "")
    .replace(/﻿/g, "")         // BOM
    .replace(/[^\x20-\xFFÀ-ɏḀ-ỿ]/g, "") // keep latin chars
    .trim();
}

export async function GET() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${GID}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return Response.json(
        { error: "No se pudo acceder al spreadsheet. Asegúrate de que esté compartido como 'Cualquiera con el enlace puede ver'." },
        { status: 400 }
      );
    }
    const csv = await res.text();
    const { predictions, debug } = parseSheet(csv);

    if (!predictions.length) {
      return Response.json(
        { error: `No se encontraron partidos válidos. Columnas detectadas: ${debug.headers}. Filas totales: ${debug.totalRows}. Muestra: ${debug.sample}` },
        { status: 400 }
      );
    }
    return Response.json({ predictions, syncedAt: new Date().toISOString() });
  } catch (e) {
    return Response.json({ error: `Error al acceder al spreadsheet: ${e.message}` }, { status: 500 });
  }
}

function splitCsvRow(line) {
  const fields = [];
  let cur = "", inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQ = !inQ; }
    else if (ch === "," && !inQ) { fields.push(cur); cur = ""; }
    else { cur += ch; }
  }
  fields.push(cur);
  return fields.map(cleanCell);
}

function parseSheet(csv) {
  const rawLines = csv.trim().split(/\r?\n/);
  const lines = rawLines.map(splitCsvRow);
  const debug = {
    headers: lines[0]?.join(" | ") ?? "(vacío)",
    totalRows: lines.length,
    sample: lines[1]?.join(" | ") ?? "(vacío)",
  };

  if (lines.length < 2) return { predictions: [], debug };

  const header = lines[0].map(h => norm(h));

  const find = (...keys) => {
    for (const k of keys) {
      const i = header.findIndex(h => h.includes(norm(k)));
      if (i >= 0) return i;
    }
    return -1;
  };

  const iDate  = find("fecha","date","dia","día","jornada");
  const iHour  = find("hora","time","hour","horario");
  const iGroup = find("grupo","group");
  const iT1    = find("local","home","equipo1","equipo 1","team1","team 1","casa");
  const iT2    = find("visita","visitante","away","equipo2","equipo 2","team2","team 2");
  const iP1    = find("local","home score","goles local","gol local","prediccion local",
                      "predicción local","score1","p1","gol1","marcador local");
  const iP2    = find("visita","away score","goles visita","gol visita","prediccion visita",
                      "predicción visita","score2","p2","gol2","marcador visita");

  // iP1/iP2 might collide with iT1/iT2 — look for the SECOND occurrence of these keywords
  // Better: prefer columns that contain numbers in data rows
  const result = [];
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i];
    if (row.length < 4) continue;

    // Try header-mapped positions first, then fall back to positional
    const d  = iDate  >= 0 ? row[iDate]  : row[0];
    const h  = iHour  >= 0 ? row[iHour]  : row[1];
    const g  = iGroup >= 0 ? row[iGroup] : row[2];
    const t1raw = iT1 >= 0 ? row[iT1] : row[3];
    const t2raw = iT2 >= 0 ? row[iT2] : (row.length > 4 ? row[4] : "");

    // Goals: look for numeric columns — try common positions
    let p1 = NaN, p2 = NaN;
    // Try header-mapped first (avoid reusing team col indices)
    if (iP1 >= 0 && iP1 !== iT1) p1 = parseInt(row[iP1]);
    if (iP2 >= 0 && iP2 !== iT2) p2 = parseInt(row[iP2]);
    // Fall back: scan from position 5 onwards for numeric pairs
    if (isNaN(p1) || isNaN(p2)) {
      for (let c = 5; c < row.length - 1; c++) {
        const a = parseInt(row[c]), b = parseInt(row[c + 1]);
        if (!isNaN(a) && !isNaN(b) && a >= 0 && a <= 20 && b >= 0 && b <= 20) {
          p1 = a; p2 = b; break;
        }
      }
    }

    const t1 = resolveTeam(t1raw);
    const t2 = resolveTeam(t2raw);

    if (!t1 || !t2 || isNaN(p1) || isNaN(p2)) continue;

    result.push({
      d: d || `${i}`,
      h: h || "",
      g: (g || "?").toUpperCase(),
      t1, t2, p1, p2,
    });
  }

  return { predictions: result, debug };
}
