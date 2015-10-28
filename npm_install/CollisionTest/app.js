var server = require('cre-nodejs-server');

server.start(
  {
    port: 8888,
    rootDirectory: require('path').resolve(__dirname + '/../')  ,
    routes: [
      { route: '/', handler: server.clientFileHandler('CollisionTest/Client/index.html') },
      { route: '/*', handler: server.clientFileHandler() },
    ],
    sockets: ['/CollisionTest/Server/CollisionTestSocket']
  }
);