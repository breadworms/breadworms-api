const eloBrackets: [number, string][] = [
  [2000, 'netherite'],
  [1500, 'diamond'],
  [1200, 'emerald'],
  [900, 'gold'],
  [600, 'iron'],
  [0, 'coal']
];

export async function getUserElo(user: string) {
  const userData = await fetch(`https://api.mcsrranked.com/users/${user}`)
    .then(res => res.json());
  const elo: number = userData?.data?.eloRate ?? null;

  for (const [threshold, bracket] of eloBrackets) {
    if (elo >= threshold) {
      return `${bracket} ${elo}`;
    }
  }

  return `not rated`;
}
