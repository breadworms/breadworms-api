import * as express from 'express'
import type { Server } from 'http'
import * as mcsr from './mcsr'

export default class App {
  #api: Server | undefined;

  public async boot() {
    const api = express();
    const port = 3100;

    api.get('/mcsr-ranked-elo', async (req, res) => {
      const userData = await fetch('https://api.mcsrranked.com/users/breadworms')
        .then(r => r.json());

      res.send(mcsr.printElo(userData?.data?.eloRate ?? null));
    });

    this.#api = api.listen(port);
  }

  public async destroy() {
    this.#api?.close();
  }
}
