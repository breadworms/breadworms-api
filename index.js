const app = new (require('./dist/App').default)();

function destructor() {
  app.destroy().then(() => process.exit(0));
}

function errorDestructor(error) {
  log.error(error.stack ?? error);
  app.destroy().finally(() => process.exit(1));
}

process.on('SIGINT', destructor);
process.on('message', msg => msg === 'shutdown' && destructor()); // Windows
process.on('uncaughtException', errorDestructor);
process.on('unhandledRejection', errorDestructor);

app.boot().then(() => process.send !== undefined && process.send('ready'));

module.exports.default = app;
