import * as express from 'express'
import type { Server } from 'http'
import * as mcsr from './mcsr'
import * as wc3 from './wc3'

export default class App {
  #api: Server | undefined;

  public async boot() {
    const api = express();
    const port = 3100;

    api.get('/mcsr-ranked-elo/:identifier', async (req, res) => {
      const text = await mcsr.getUserElo(req.params.identifier.toLowerCase());

      res.send(text);
    });

    api.get('/w3c-mmr/:battleTag', async (req, res) => {
      const text = await wc3.getPlayerMmr(req.params.battleTag);

      res.send(text);
    });

    this.#api = api.listen(port);
  }

  public async destroy() {
    this.#api?.close();
  }
}
