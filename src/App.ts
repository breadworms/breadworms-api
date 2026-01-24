import * as express from 'express'
import type { Server } from 'http'
import { printElo } from './mcsr'

export default class App {
  #api: Server | undefined;

  public async boot() {
    const api = express();
    const port = 3100;

    api.get('/mcsr-ranked-elo', async (req, res) => {
      const { data } = await fetch('https://api.mcsrranked.com/users/breadworms')
        .then(r => r.json());

      res.send(printElo(data.eloRate));
    });

    this.#api = api.listen(port);
  }

  public async destroy() {
    this.#api?.close();
  }
}
