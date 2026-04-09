interface Config {
  broadcaster: {
    uuid?: string;
    battleTag?: string;
  }
}

export default Object.assign(
  {
    broadcaster: {}
  } as Config,
  require(`${process.cwd()}/config.json`) as Config
);
