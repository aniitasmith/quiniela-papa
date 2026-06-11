export function groupByDate(matches) {
  const map = {};
  matches.forEach(m => {
    if (!map[m.d]) map[m.d] = [];
    map[m.d].push(m);
  });
  return map;
}
