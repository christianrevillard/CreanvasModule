// entry point for in-browser, config requirejs here

requirejs.config({
  paths: { 'creanvas': '../../Server' }
});

var socket = io("/Example/Server/nodeTestSocket");

requirejs(['../Client/creanvasClient'],
  function (client) {
    
  client(
    socket, 
    document.getElementById('nodeCanvas'));  

  socket.emit("join");

});
