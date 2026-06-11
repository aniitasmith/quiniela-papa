// CommonJS version for Jest (mirrors scoring.js)

const GROUPS_TEAMS = {
  A:["México","Corea del Sur","Chequia","Sudáfrica"],
  B:["Canadá","Suiza","Bosnia y Herzegovina","Qatar"],
  C:["Brasil","Marruecos","Escocia","Haití"],
  D:["Estados Unidos","Turquía","Paraguay","Australia"],
  E:["Alemania","Costa de Marfil","Ecuador","Curazao"],
  F:["Países Bajos","Japón","Suecia","Túnez"],
  G:["Bélgica","Irán","Egipto","Nueva Zelanda"],
  H:["España","Uruguay","Arabia Saudita","Cabo Verde"],
  I:["Francia","Noruega","Senegal","Irak"],
  J:["Argentina","Austria","Argelia","Jordania"],
  K:["Portugal","Colombia","RD Congo","Uzbekistán"],
  L:["Inglaterra","Croacia","Ghana","Panamá"],
};

function matchKey(m) {
  return `${m.d}|${m.t1}|${m.t2}`;
}

function scoreMatch(pred, real) {
  const { p1, p2 } = pred;
  const { r1, r2 } = real;

  let pts = 0;
  let breakdown = { winner: 0, draw: 0, goalsHome: 0, goalsAway: 0 };

  const predDraw = p1 === p2;
  const realDraw = r1 === r2;
  const predHomeWins = p1 > p2;
  const realHomeWins = r1 > r2;

  if (realDraw && predDraw) {
    pts += 2;
    breakdown.draw = 2;
  } else if (!realDraw && !predDraw && predHomeWins === realHomeWins) {
    pts += 3;
    breakdown.winner = 3;
  }

  if (p1 === r1) { pts += 2; breakdown.goalsHome = 2; }
  if (p2 === r2) { pts += 2; breakdown.goalsAway = 2; }

  return { pts, breakdown };
}

function totalScore(predictions, realResults) {
  let total = 0;
  let played = 0;
  predictions.forEach(m => {
    const real = realResults[matchKey(m)];
    if (!real) return;
    const { pts } = scoreMatch(m, real);
    total += pts;
    played++;
  });
  return { total, played };
}

function computeStandings(predictions, realResults) {
  const st = {};
  Object.keys(GROUPS_TEAMS).forEach(g =>
    GROUPS_TEAMS[g].forEach(t => { st[t] = { pts:0, gf:0, ga:0, gd:0, played:0, group:g }; })
  );
  predictions.forEach(m => {
    const real = realResults ? realResults[matchKey(m)] : null;
    const g1 = real ? real.r1 : m.p1;
    const g2 = real ? real.r2 : m.p2;
    const s1 = st[m.t1], s2 = st[m.t2];
    if (!s1 || !s2) return;
    s1.played++; s2.played++;
    s1.gf += g1; s1.ga += g2; s1.gd = s1.gf - s1.ga;
    s2.gf += g2; s2.ga += g1; s2.gd = s2.gf - s2.ga;
    if (g1 > g2) { s1.pts += 3; }
    else if (g1 < g2) { s2.pts += 3; }
    else { s1.pts += 1; s2.pts += 1; }
  });
  return st;
}

module.exports = { scoreMatch, totalScore, matchKey, computeStandings };
