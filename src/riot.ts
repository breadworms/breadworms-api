import config from './config'

const API_KEY = config.auth.riot?.apiKey;
const LOL_REGIONS = new Map(Object.entries({
  'br': 'br1',
  'eune': 'eun1',
  'euw': 'euw1',
  'jp': 'jp1',
  'kr': 'kr',
  'las': 'la1',
  'lan': 'la2',
  'me': 'me1',
  'na': 'na1',
  'oc': 'oc1',
  'ru': 'ru',
  'sg': 'sg2',
  'tr': 'tr1',
  'tw': 'tw2',
  'vn': 'vn2'
}));
const _puuidCache: Map<string, string> = new Map();

async function api(region: string, path: string) {
  if (API_KEY === undefined) {
    return null;
  }

  try {
    const res = await fetch(`https://${region}.api.riotgames.com/${path}`, {
      headers: {
        'X-Riot-Token': API_KEY
      }
    });

    if (res.status === 404) {
      return {};
    }

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch {
    return null;
  }
}

function parseSearchString(searchString: string) {
  const match = searchString.toLowerCase().match(/([^\#]+)#(\S+)(?:\s+(\S+))?/);

  if (match === null) {
    return null;
  }

  return {
    gameName: match[1],
    tagLine: match[2],
    region: LOL_REGIONS.get(match[3]) ?? LOL_REGIONS.get('euw')!
  };
}

export async function getSummonerRank(searchString: string) {
  const summoner = parseSearchString(searchString);

  if (summoner === null) {
    return `not rated`;
  }

  const { gameName, tagLine, region } = summoner;
  const puuidKey = `${gameName}#${tagLine}`;
  let puuid = _puuidCache.get(puuidKey);

  if (puuid === undefined) {
    const account = await api(
      'europe',
      `riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
    );

    if (!account) {
      return `error fetching results`;
    } else if (account.puuid === undefined) {
      return `not rated`;
    }

    _puuidCache.set(puuidKey, puuid = account.puuid);
  }

  const entries = await api(region, `lol/league/v4/entries/by-puuid/${puuid}`);

  if (!entries) {
    return `error fetching results`;
  } else if (!entries.length) {
    return `not rated`;
  }

  for (const entry of entries) {
    if (entry.queueType !== 'RANKED_SOLO_5x5') {
      continue;
    }

    const division = ['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(entry.tier)
      ? `${entry.leaguePoints} lp`
      : { I: 1, II: 2, III: 3, IV: 4 }[entry.rank as string];

    return `${entry.tier.toLowerCase()} ${division}`;
  }

  return `not rated`;
}
