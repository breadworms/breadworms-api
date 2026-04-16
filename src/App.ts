import type { Server } from 'http'
import type { RequestHandler } from 'express'
import * as express from 'express'
import * as mcsr from './mcsr'
import * as wc3 from './wc3'
import * as riot from './riot'

export default class App {
  #server: Server | undefined;

  public async boot() {
    const app = express();
    const port = 3100;

    const trim: RequestHandler<{ message: string }> = (req, res, next) => {
      req.params.message = req.params.message.trim();

      if (req.params.message === '') {
        throw new Error(`Request ${req.url} had empty message.`);
      }

      next();
    };

    app.get('/mcsr-ranked-elo/:message', trim, async (req, res) => {
      const text = await mcsr.getUserElo(req.params.message);

      res.send(text);
    });

    app.get('/w3c-mmr/:message', trim, async (req, res) => {
      const text = await wc3.getPlayerMmr(req.params.message);

      res.send(text);
    });

    app.get('/lol-rank/:message', trim, async (req, res) => {
      const text = await riot.getSummonerRank(req.params.message);

      res.send(text);
    });

    this.#server = app.listen(port);
  }

  public async destroy() {
    this.#server?.close();
  }
}
