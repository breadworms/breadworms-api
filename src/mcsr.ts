const eloBrackets: [number, string][] = [
  [2000, 'netherite'],
  [1500, 'diamond'],
  [1200, 'emerald'],
  [900, 'gold'],
  [600, 'iron'],
  [0, 'coal']
];

export function printElo(elo: number | null) {
  for (const [threshold, bracket] of eloBrackets) {
    if (elo! >= threshold) {
      return `${bracket} ${elo}`;
    }
  }

  return `unrated`;
}
