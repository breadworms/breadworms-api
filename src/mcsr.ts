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

async function get(path: string): Promise<{ status: 'error' | 'success', data: any } | null> {
  try {
    return await fetch(`https://api.mcsrranked.com/${path}`).then(res => res.json());
  } catch {
    return null;
  }
}

export async function getUserElo(identifier: string) {
  const res = await get(`users/${encodeURIComponent(identifier)}`);

  if (!res || (res.status === 'error' && res.data?.error !== 'User is not exists.')) {
    return `error fetching data`;
  } else if (!res.data?.eloRate) {
    return `not rated`;
  }

  const { uuid, eloRate } = res.data;
  const matchesRes = await get(`users/${uuid}/matches?count=100&type=2`);
  const sessionText = printSessionForUser(uuid, matchesRes?.data ?? []);

  for (const [threshold, bracket] of eloBrackets) {
    if (eloRate >= threshold) {
      return `${bracket} ${eloRate} ${userEmotes[identifier] ?? ''}${sessionText}`;
    }
  }

  throw new Error(`Could not print elo: ${identifier}'s elo was ${eloRate} (a negative number).`);
}

function printSessionForUser(uuid: string, matches: any[]) {
  const terminal = Math.round(Date.now() * 0.001) - 60 * 60 * 12;
  let wins = 0;
  let losses = 0;
  let draws = 0;

  for (const match of matches) {
    if (match.date <= terminal) {
      break;
    }

    if (match.result.uuid === uuid) {
      wins += 1;
    } else if (match.result.uuid !== null) {
      losses += 1;
    } else {
      draws += 1;
    }
  }

  return wins + losses + draws > 0
    ? ` (today: ${wins}-${losses}${draws > 0 ? '-' + draws : ''})`
    : '';
}
