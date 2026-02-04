import * as express from 'express'
import type { Server } from 'http'
import * as mcsr from './mcsr'

export default class App {
  #api: Server | undefined;

  public async boot() {
    const api = express();
    const port = 3100;

    api.get('/mcsr-ranked-elo/:identifier', async (req, res) => {
      const text = await mcsr.getUserElo(req.params.identifier.toLowerCase());

      res.send(text);
    });

    this.#api = api.listen(port);
  }

  public async destroy() {
    this.#api?.close();
  }
}
