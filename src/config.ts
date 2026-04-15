interface Config {
  broadcaster: {
    uuid?: string;
    battleTag?: string;
  }

  auth: {
    riot?: {
      apiKey: string;
    }
  }
}

export default Object.assign(
  {
    broadcaster: {},
    auth: {}
  } as Config,
  require(`${process.cwd()}/config.json`) as Config
);
