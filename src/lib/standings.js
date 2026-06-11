import { GROUPS_TEAMS } from "@/data/predictions";
import { matchKey } from "@/lib/scoring";

export function computeStandings(predictions, realResults) {
  const st = {};
  Object.keys(GROUPS_TEAMS).forEach(g =>
    GROUPS_TEAMS[g].forEach(t => { st[t] = { pts:0, gf:0, ga:0, gd:0, played:0, group:g }; })
  );
  predictions.forEach(m => {
    const real = realResults[matchKey(m)];
    const g1 = real ? real.r1 : m.p1;
    const g2 = real ? real.r2 : m.p2;
    const s1 = st[m.t1], s2 = st[m.t2];
    if (!s1 || !s2) return;
    s1.played++; s2.played++;
    s1.gf += g1; s1.ga += g2; s1.gd = s1.gf - s1.ga;
    s2.gf += g2; s2.ga += g1; s2.gd = s2.gf - s2.ga;
    if (g1 > g2) { s1.pts += 3; }
    else if (g1 < g2) { s2.pts += 3; }
    else { s1.pts += 2; s2.pts += 2; }
  });
  return st;
}

export function getAdvancing(standings) {
  const adv = {};
  Object.keys(GROUPS_TEAMS).forEach(g => {
    const ranked = GROUPS_TEAMS[g]
      .map(t => ({ name:t, ...standings[t] }))
      .sort((a,b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
    adv[g] = [ranked[0]?.name, ranked[1]?.name];
  });
  return adv;
}
