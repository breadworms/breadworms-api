import * as express from 'express'
import type { Server } from 'http'

export default class App {
  #api: Server | undefined;

  /**
   * Start the app.
   */
  public async boot() {
    const api = express();
    const port = 3100;

    api.get('/mcsr-ranked-elo', async (req, res) => {
      const { data } = await fetch('https://api.mcsrranked.com/users/breadworms')
        .then(r => r.json());

      res.send(data.eloRate);
    });

    this.#api = api.listen(port);
  }

  /**
   * Shut the app down, closing all open connections.
   */
  public async destroy() {
    this.#api?.close();
  }
}
