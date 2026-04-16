import config from './config'

const ELO_BRACKETS: [number, string][] = [
  [2000, 'netherite'],
  [1500, 'diamond'],
  [1200, 'emerald'],
  [900, 'gold'],
  [600, 'iron'],
  [0, 'coal']
];

async function api(path: string): Promise<{ status: 'error' | 'success', data: any } | null> {
  try {
    const res = await fetch(`https://api.mcsrranked.com/${path}`);

    return res.json();
  } catch {
    return null;
  }
}

export async function getUserElo(searchString: string) {
  const identifier = searchString.toLowerCase();
  const res = await api(`users/${encodeURIComponent(identifier)}`);

  if (!res || (res.status === 'error' && res.data?.error !== 'User is not exists.')) {
    return `error fetching results`;
  } else if (!res.data?.eloRate) {
    return `not rated`;
  }

  const { uuid, eloRate } = res.data;

  for (const [threshold, bracket] of ELO_BRACKETS) {
    if (eloRate >= threshold) {
      const matchesRes = await api(`users/${uuid}/matches?count=100&type=2&excludedecay=true`);
      const sessionAffix = matchesToSession(uuid, matchesRes?.data ?? []);
      const emoteAffix = uuid === config.broadcaster.uuid ? ` bert` : '';

      return `${bracket} ${eloRate}${emoteAffix}${sessionAffix}`;
    }
  }

  throw new Error(`Could not print elo: ${identifier}'s elo was ${eloRate} (a negative or invalid number).`);
}

function matchesToSession(uuid: string, matches: any[]) {
  const timeInSeconds = Math.round(Date.now() * 0.001);
  const terminal24 = timeInSeconds - 86400; // 24h
  let terminal = timeInSeconds - 43200; // 12h
  let wins = 0;
  let losses = 0;
  let total = 0;

  for (const match of matches) {
    if (match.date <= terminal) {
      break;
    }

    for (const vod of match.vod) {
      if (vod.uuid === uuid && vod.startsAt < terminal) {
        terminal = Math.max(vod.startsAt, terminal24);
      }
    }

    if (match.result.uuid === uuid) {
      wins += 1;
    } else if (match.result.uuid !== null) {
      losses += 1;
    }

    total += 1;
  }

  return total > 0
    ? ` (today: ${wins}-${losses}${total > (wins + losses) ? '-' + (total - wins - losses) : ''})`
    : '';
}
