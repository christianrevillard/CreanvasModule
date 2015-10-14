var server = require('cre-nodejs-server');

server.start(
  {
    port: 8888,
    rootDirectory: require('path').resolve(__dirname), 
    routes: [
      { route: '/', handler: server.clientFileHandler('Test/Client/index.html') },
      { route: '/Test/Client/*', handler: server.clientFileHandler() },
      { route: '/npm_install/*', handler: server.clientFileHandler() },
    ],
    sockets: ['/Test/Server/nodeTestSocket']
  }
);