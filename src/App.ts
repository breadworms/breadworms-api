import type { Server } from 'http'
import type { RequestHandler } from 'express'
import * as express from 'express'
import * as mcsr from './mcsr'
import * as wc3 from './wc3'
import * as riot from './riot'

export default class App {
  #api: Server | undefined;

  public async boot() {
    const api = express();
    const port = 3100;

    api.get(
      '/mcsr-ranked-elo/:identifier',
      sanitize,
      lowercase,
      async (req, res) => {
        const text = await mcsr.getUserElo(req.params.identifier as string);

        res.send(text);
      }
    );

    api.get(
      '/w3c-mmr/:battleTag',
      sanitize,
      async (req, res) => {
        const text = await wc3.getPlayerMmr(req.params.battleTag as string);

        res.send(text);
      }
    );

    api.get(
      '/lol-rank/:summonerName/:region',
      sanitize,
      lowercase,
      async (req, res) => {
        const text = await riot.getSummonerRank(
          req.params.summonerName as string,
          req.params.region as string
        );

        res.send(text);
      }
    );

    this.#api = api.listen(port);
  }

  public async destroy() {
    this.#api?.close();
  }
}

const sanitize: RequestHandler = ({ params }, res, next) => {
  Object.keys(params).forEach(k => {
    if (typeof params[k] === 'string') {
      params[k] = params[k].replace(/\s/g, '');

      if (params[k] === '') {
        res.status(400).send('invalid parameter');
      }
    } else {
      res.status(400).send('invalid parameter');
    }
  });

  if (res.headersSent) {
    return;
  }

  next();
}

const lowercase: RequestHandler = ({ params }, res, next) => {
  Object.keys(params).forEach(k => {
    if (typeof params[k] === 'string') {
      params[k] = params[k].toLowerCase();
    }
  });

  next();
}
