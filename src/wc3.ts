import config from './config'

let _broadcasterMmr = 0;

async function get(path: string) {
  try {
    const res = await fetch(`https://website-backend.w3champions.com/api/${path}`);

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

export async function getPlayerMmr(battleTag: string) {
  const playerUrl = `players/${encodeURIComponent(battleTag)}`;
  const player = await get(playerUrl);

  if (!player) {
    return `error fetching results`;
  }

  for (const { id } of player.participatedInSeasons ?? []) {
    const gameModes = await get(`${playerUrl}/game-mode-stats?gateWay=20&season=${id}`);

    if (!gameModes || !gameModes.length) {
      break;
    }

    for (const gameMode of gameModes) {
      if (gameMode.gameMode !== 1) {
        continue;
      }

      let emoteAffix = '';

      if (battleTag === config.broadcaster.battleTag) {
        emoteAffix = gameMode.mmr >= _broadcasterMmr
          ? ` Climb`
          : ` Fall`;

        _broadcasterMmr = gameMode.mmr;
      }

      return `${gameMode.mmr}${emoteAffix}`;
    }
  }

  return `not rated`;
}
