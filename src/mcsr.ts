const rankedEloBrackets: [number, string][] = [
  [2000, 'netherite'],
  [1500, 'diamond'],
  [1200, 'emerald'],
  [900, 'gold'],
  [600, 'iron'],
  [0, 'coal']
];

export function printElo(elo: number) {
  for (const [eloBracket, title] of rankedEloBrackets) {
    if (elo >= eloBracket) {
      return `${title} ${elo}`;
    }
  }

  return `unrated`;
}
