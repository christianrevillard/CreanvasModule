﻿// entry point for server/node, config requirejs here

var requirejs = require('requirejs');

requirejs.config({
  nodeRequire: require,
  paths: {'creanvas':'../Server','local':'Server', 'modules':'../Modules'}
});

var onConnection = function (socket) {
  requirejs(['local/TicTacToe'],
    function (testApplication) {
    
    var joined = false;
    
    socket.on("join", function (){
      
      if (joined)
        return;
      
      joined = true;
      
      testApplication.getApplication(function (newInstance) {
        newInstance.connect(socket);
      });
    });
  })
};

module.exports = onConnection;