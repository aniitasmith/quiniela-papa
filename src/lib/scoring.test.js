const { scoreMatch, totalScore, matchKey, computeStandings } = require("./scoring.cjs");

// ── scoreMatch ──────────────────────────────────────────────────────────────

describe("scoreMatch — ejemplo oficial de la quiniela", () => {
  // Real: México 2 - 1 Sudáfrica
  const real = { r1: 2, r2: 1 };

  test("pred 2-1 → 7 pts (ganador + ambos goles)", () => {
    const { pts, breakdown } = scoreMatch({ p1: 2, p2: 1 }, real);
    expect(pts).toBe(7);
    expect(breakdown.winner).toBe(3);
    expect(breakdown.goalsHome).toBe(2);
    expect(breakdown.goalsAway).toBe(2);
  });

  test("pred 2-0 → 5 pts (ganador + goles local)", () => {
    const { pts } = scoreMatch({ p1: 2, p2: 0 }, real);
    expect(pts).toBe(5);
  });

  test("pred 1-3 → 0 pts (ganador equivocado, goles incorrectos)", () => {
    const { pts } = scoreMatch({ p1: 1, p2: 3 }, real);
    expect(pts).toBe(0);
  });

  test("pred 2-3 → 2 pts (solo goles local correctos)", () => {
    const { pts } = scoreMatch({ p1: 2, p2: 3 }, real);
    expect(pts).toBe(2);
  });

  test("pred 0-0 → 0 pts (todo incorrecto)", () => {
    const { pts } = scoreMatch({ p1: 0, p2: 0 }, real);
    expect(pts).toBe(0);
  });
});

describe("scoreMatch — empates", () => {
  test("pred 1-1, real 1-1 → 6 pts (empate correcto + ambos goles)", () => {
    const { pts, breakdown } = scoreMatch({ p1: 1, p2: 1 }, { r1: 1, r2: 1 });
    expect(pts).toBe(6);
    expect(breakdown.draw).toBe(2);
    expect(breakdown.goalsHome).toBe(2);
    expect(breakdown.goalsAway).toBe(2);
  });

  test("pred 0-0, real 1-1 → 2 pts (empate correcto, goles incorrectos)", () => {
    const { pts, breakdown } = scoreMatch({ p1: 0, p2: 0 }, { r1: 1, r2: 1 });
    expect(pts).toBe(2);
    expect(breakdown.draw).toBe(2);
  });

  test("pred 1-0, real 1-1 → 2 pts (goles local correctos, resultado incorrecto)", () => {
    const { pts } = scoreMatch({ p1: 1, p2: 0 }, { r1: 1, r2: 1 });
    expect(pts).toBe(2);
  });

  test("pred 2-1, real 1-1 → 2 pts (goles visitante correcto, resultado incorrecto)", () => {
    // Predijo visitante=1, real visitante=1 → 2 pts aunque el resultado sea incorrecto
    const { pts, breakdown } = scoreMatch({ p1: 2, p2: 1 }, { r1: 1, r2: 1 });
    expect(pts).toBe(2);
    expect(breakdown.goalsAway).toBe(2);
    expect(breakdown.winner).toBe(0);
    expect(breakdown.draw).toBe(0);
  });
});

describe("scoreMatch — máximos y límites", () => {
  test("máximo posible: 7 pts por partido", () => {
    const { pts } = scoreMatch({ p1: 3, p2: 0 }, { r1: 3, r2: 0 });
    expect(pts).toBe(7);
  });

  test("goles solo de un equipo dan 2 pts independientes", () => {
    const { pts, breakdown } = scoreMatch({ p1: 3, p2: 2 }, { r1: 3, r2: 1 });
    expect(breakdown.goalsHome).toBe(2);
    expect(breakdown.goalsAway).toBe(0);
    expect(pts).toBe(5); // 3 ganador + 2 goles local
  });

  test("no se ganan puntos de ganador si se predijo el marcador al revés", () => {
    const { breakdown } = scoreMatch({ p1: 1, p2: 2 }, { r1: 2, r2: 1 });
    expect(breakdown.winner).toBe(0);
    expect(breakdown.draw).toBe(0);
  });
});

// ── totalScore ──────────────────────────────────────────────────────────────

describe("totalScore", () => {
  const predictions = [
    { d:"11-Jun", t1:"México", t2:"Sudáfrica", p1:2, p2:1 },
    { d:"11-Jun", t1:"Corea del Sur", t2:"Chequia", p1:1, p2:1 },
  ];

  test("sin resultados reales → 0 pts jugados", () => {
    const { total, played } = totalScore(predictions, {});
    expect(total).toBe(0);
    expect(played).toBe(0);
  });

  test("un partido con resultado real exacto → 7 pts", () => {
    const real = { ["11-Jun|México|Sudáfrica"]: { r1: 2, r2: 1 } };
    const { total, played } = totalScore(predictions, real);
    expect(total).toBe(7);
    expect(played).toBe(1);
  });

  test("dos partidos con resultados reales", () => {
    const real = {
      ["11-Jun|México|Sudáfrica"]: { r1: 2, r2: 1 },     // exacto → 7 pts
      ["11-Jun|Corea del Sur|Chequia"]: { r1: 1, r2: 1 }, // empate exacto → 6 pts
    };
    const { total, played } = totalScore(predictions, real);
    expect(total).toBe(13);
    expect(played).toBe(2);
  });
});

// ── matchKey ────────────────────────────────────────────────────────────────

describe("matchKey", () => {
  test("genera clave única por partido", () => {
    const m = { d:"11-Jun", t1:"México", t2:"Sudáfrica" };
    expect(matchKey(m)).toBe("11-Jun|México|Sudáfrica");
  });

  test("partidos distintos generan claves distintas", () => {
    const m1 = { d:"11-Jun", t1:"México",   t2:"Sudáfrica" };
    const m2 = { d:"11-Jun", t1:"Canadá",   t2:"Bosnia y Herzegovina" };
    expect(matchKey(m1)).not.toBe(matchKey(m2));
  });
});

// ── computeStandings ────────────────────────────────────────────────────────

describe("computeStandings", () => {
  const grupoPred = [
    { d:"11-Jun", g:"A", t1:"México",       t2:"Sudáfrica",   p1:2, p2:0 },
    { d:"11-Jun", g:"A", t1:"Corea del Sur", t2:"Chequia",    p1:1, p2:1 },
  ];

  test("victoria de local suma 3 pts al local, 0 al visitante", () => {
    const st = computeStandings(grupoPred, {});
    expect(st["México"].pts).toBe(3);
    expect(st["Sudáfrica"].pts).toBe(0);
  });

  test("empate suma 1 pt a cada equipo", () => {
    const st = computeStandings(grupoPred, {});
    expect(st["Corea del Sur"].pts).toBe(1);
    expect(st["Chequia"].pts).toBe(1);
  });

  test("resultado real sobreescribe la predicción en la tabla", () => {
    const real = { ["11-Jun|México|Sudáfrica"]: { r1: 0, r2: 2 } };
    const st = computeStandings(grupoPred, real);
    // Con resultado real, Sudáfrica gana
    expect(st["Sudáfrica"].pts).toBe(3);
    expect(st["México"].pts).toBe(0);
  });

  test("goles se acumulan correctamente", () => {
    const st = computeStandings(grupoPred, {});
    expect(st["México"].gf).toBe(2);
    expect(st["México"].ga).toBe(0);
    expect(st["México"].gd).toBe(2);
  });

  test("todos los equipos de la quiniela tienen entrada en standings", () => {
    const st = computeStandings(grupoPred, {});
    ["México","Sudáfrica","Corea del Sur","Chequia"].forEach(t => {
      expect(st[t]).toBeDefined();
    });
  });
});
