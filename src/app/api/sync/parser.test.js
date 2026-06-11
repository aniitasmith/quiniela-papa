// Tests for the CSV parser logic (extracted from route.js for testability)

const norm = s => s?.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").trim() ?? "";

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
const NORM_MAP = Object.fromEntries(KNOWN_TEAMS.map(t => [norm(t), t]));

function cleanCell(s) {
  return (s ?? "")
    .replace(/^"|"$/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#\d+;/g, "")
    .replace(/﻿/g, "")
    .replace(/[^\x20-\xFFÀ-ɏḀ-ỿ]/g, "")
    .trim();
}

function resolveTeam(raw) {
  const cleaned = cleanCell(raw);
  return NORM_MAP[norm(cleaned)] ?? cleaned;
}

// ── cleanCell ──────────────────────────────────────────────────────────────

describe("cleanCell", () => {
  test("quita comillas CSV", () => {
    expect(cleanCell('"México"')).toBe("México");
  });

  test("decodifica &gt; (la causa del bug del >)", () => {
    expect(cleanCell("&gt;")).toBe(">");
    // but resolveTeam should handle this gracefully
  });

  test("decodifica &amp; &lt; &quot;", () => {
    expect(cleanCell("&amp;")).toBe("&");
    expect(cleanCell("&lt;")).toBe("<");
    expect(cleanCell("&quot;")).toBe('"');
  });

  test("quita BOM \\uFEFF", () => {
    expect(cleanCell("﻿México")).toBe("México");
  });

  test("trimea espacios", () => {
    expect(cleanCell("  México  ")).toBe("México");
  });

  test("cadena vacía → cadena vacía", () => {
    expect(cleanCell("")).toBe("");
    expect(cleanCell(undefined)).toBe("");
  });
});

// ── resolveTeam ────────────────────────────────────────────────────────────

describe("resolveTeam — normalización de nombres", () => {
  test("nombre exacto pasa directo", () => {
    expect(resolveTeam("México")).toBe("México");
    expect(resolveTeam("Brasil")).toBe("Brasil");
    expect(resolveTeam("Estados Unidos")).toBe("Estados Unidos");
  });

  test("sin acento → canonical con acento", () => {
    expect(resolveTeam("Mexico")).toBe("México");
    expect(resolveTeam("Belgica")).toBe("Bélgica");
    expect(resolveTeam("Japon")).toBe("Japón");
    expect(resolveTeam("Tunez")).toBe("Túnez");
    expect(resolveTeam("Canada")).toBe("Canadá");
    expect(resolveTeam("Panama")).toBe("Panamá");
    expect(resolveTeam("Espana")).toBe("España");
    expect(resolveTeam("Suecia")).toBe("Suecia");
  });

  test("mayúsculas → canonical", () => {
    expect(resolveTeam("MEXICO")).toBe("México");
    expect(resolveTeam("BRASIL")).toBe("Brasil");
    expect(resolveTeam("ARGENTINA")).toBe("Argentina");
  });

  test("mixto mayúsculas/minúsculas", () => {
    expect(resolveTeam("estados unidos")).toBe("Estados Unidos");
    expect(resolveTeam("paises bajos")).toBe("Países Bajos");
    expect(resolveTeam("corea del sur")).toBe("Corea del Sur");
  });

  test("nombre con comillas CSV", () => {
    expect(resolveTeam('"México"')).toBe("México");
    expect(resolveTeam('"Estados Unidos"')).toBe("Estados Unidos");
  });

  test("nombre desconocido pasa limpio (no crashea)", () => {
    expect(resolveTeam("Ruritania")).toBe("Ruritania");
    expect(resolveTeam("")).toBe("");
  });

  test("RD Congo se resuelve correctamente", () => {
    expect(resolveTeam("RD Congo")).toBe("RD Congo");
    expect(resolveTeam("rd congo")).toBe("RD Congo");
  });
});

// ── flag normalization (same logic used in page.jsx) ──────────────────────

describe("flag lookup es robusto a acentos", () => {
  const GROUP_FLAGS = {
    "México":"🇲🇽","Bélgica":"🇧🇪","Japón":"🇯🇵","Túnez":"🇹🇳",
    "Canadá":"🇨🇦","España":"🇪🇸","Panamá":"🇵🇦","Países Bajos":"🇳🇱",
  };
  const flagByNorm = Object.fromEntries(
    Object.entries(GROUP_FLAGS).map(([k,v]) => [norm(k), v])
  );
  const flag = t => GROUP_FLAGS[t] ?? flagByNorm[norm(t)] ?? "🏳️";

  test("nombre con acento → bandera correcta", () => {
    expect(flag("México")).toBe("🇲🇽");
    expect(flag("Bélgica")).toBe("🇧🇪");
  });

  test("nombre sin acento → misma bandera (el bug principal)", () => {
    expect(flag("Mexico")).toBe("🇲🇽");
    expect(flag("Belgica")).toBe("🇧🇪");
    expect(flag("Japon")).toBe("🇯🇵");
    expect(flag("Tunez")).toBe("🇹🇳");
    expect(flag("Canada")).toBe("🇨🇦");
    expect(flag("Espana")).toBe("🇪🇸");
    expect(flag("Panama")).toBe("🇵🇦");
    expect(flag("Paises Bajos")).toBe("🇳🇱");
  });

  test("nombre desconocido → bandera blanca (no crash)", () => {
    expect(flag("Ruritania")).toBe("🏳️");
    expect(flag("")).toBe("🏳️");
    expect(flag(undefined)).toBe("🏳️");
  });
});
