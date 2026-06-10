const SHEET_ID = "1NDqZzWfJMsM9oHv_dKOnNFi5BykFaEx4";
const GID      = "1964972787";

export async function GET() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${GID}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();
    // Return first 5 lines and status info
    const lines = text.split("\n").slice(0, 5);
    return Response.json({ status: res.status, ok: res.ok, lines, full: text.slice(0, 2000) });
  } catch(e) {
    return Response.json({ error: e.message });
  }
}
