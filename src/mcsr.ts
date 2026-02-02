const eloBrackets: [number, string][] = [
  [2000, 'netherite'],
  [1500, 'diamond'],
  [1200, 'emerald'],
  [900, 'gold'],
  [600, 'iron'],
  [0, 'coal']
];

const userEmotes: Record<string, string> = {
  'breadworms': 'bert'
};

export async function getUserElo(identifier: string) {
  const userData = await fetch(`https://api.mcsrranked.com/users/${encodeURIComponent(identifier)}`)
    .then(res => res.json());
  const elo: number = userData?.data?.eloRate ?? -1;

  for (const [threshold, bracket] of eloBrackets) {
    if (elo >= threshold) {
      return `${bracket} ${elo} ${userEmotes[identifier] ?? 'ep'}`;
    }
  }

  return `not rated`;
}
