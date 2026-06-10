// Proxy server-side fetch of the Google Sheet CSV to avoid CORS
const SHEET_ID = "1NDqZzWfJMsM9oHv_dKOnNFi5BykFaEx4";
const GID      = "1964972787";

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
    const predictions = parseSheet(csv);
    if (!predictions.length) {
      return Response.json({ error: "El spreadsheet no tiene datos reconocibles." }, { status: 400 });
    }
    return Response.json({ predictions, syncedAt: new Date().toISOString() });
  } catch {
    return Response.json({ error: "Error de red al intentar acceder al spreadsheet." }, { status: 500 });
  }
}

function parseSheet(csv) {
  const lines = csv.trim().split("\n").map(l =>
    l.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(c => c.replace(/^"|"$/g, "").trim())
  );
  if (lines.length < 2) return [];

  // Try to detect header row and column positions
  const header = lines[0].map(h => h.toLowerCase());
  const find = (...keys) => keys.map(k => header.findIndex(h => h.includes(k))).find(i => i >= 0) ?? -1;

  const iDate  = find("fecha", "date", "día", "dia");
  const iHour  = find("hora", "time", "hour");
  const iGroup = find("grupo", "group");
  const iT1    = find("local", "home", "equipo 1", "t1");
  const iT2    = find("visita", "away", "equipo 2", "t2");
  const iP1    = find("goles local", "score 1", "p1", "gol1", "marcador 1", "prediccion 1", "predicción 1");
  const iP2    = find("goles visita", "score 2", "p2", "gol2", "marcador 2", "prediccion 2", "predicción 2");

  // Fallback: assume fixed column order if headers not matched
  // Try to parse rows where at least 5 columns exist and last two look like numbers
  const result = [];
  for (let i = 1; i < lines.length; i++) {
    const row = lines[i];
    if (row.length < 5) continue;

    const d  = iDate  >= 0 ? row[iDate]  : row[0];
    const h  = iHour  >= 0 ? row[iHour]  : row[1];
    const g  = iGroup >= 0 ? row[iGroup] : row[2];
    const t1 = iT1    >= 0 ? row[iT1]    : row[3];
    const t2 = iT2    >= 0 ? row[iT2]    : row[4];
    const p1 = iP1    >= 0 ? parseInt(row[iP1]) : parseInt(row[5]);
    const p2 = iP2    >= 0 ? parseInt(row[iP2]) : parseInt(row[6]);

    if (!t1 || !t2) continue;
    if (isNaN(p1) || isNaN(p2)) continue;

    result.push({ d, h, g: g.toUpperCase(), t1, t2, p1, p2 });
  }
  return result;
}
