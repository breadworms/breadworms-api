import * as express from 'express'
import type { Server } from 'http'
import * as mcsr from './mcsr'

export default class App {
  #api: Server | undefined;

  public async boot() {
    const api = express();
    const port = 3100;

    api.get('/mcsr-ranked-elo', async (req, res) => {
      res.send(await mcsr.getUserElo('breadworms'));
    });

    this.#api = api.listen(port);
  }

  public async destroy() {
    this.#api?.close();
  }
}
