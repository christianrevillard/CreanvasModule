var server = require('cre-nodejs-server');

server.start(
  {
    port: 8888,
    rootDirectory: require('path').resolve(__dirname + '/../')  ,
    routes: [
      { route: '/', handler: server.clientFileHandler('TicTacToe/Client/index.html') },
      { route: '/*', handler: server.clientFileHandler() },
    ],
    sockets: ['/TicTacToe/Server/TicTacToeSocket']
  }
);