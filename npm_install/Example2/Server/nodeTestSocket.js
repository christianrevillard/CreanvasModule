// entry point for server/node, config requirejs here

var requirejs = require('requirejs');

requirejs.config({
  nodeRequire: require,
  paths: {'creanvas':'../Server'}
});

var onConnection = function (socket) {
  requirejs(['../Server/creanvasServer'],
    function (server) {
    console.log('Connection socket ' + socket.id);
    server.connect(socket);
    server.events.emit("addElement", 100, 100);
  })
};

module.exports = onConnection;