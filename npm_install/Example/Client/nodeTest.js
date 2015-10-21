// entry point for in-browser, config requirejs here

requirejs.config({
  paths: { 'creanvas': '../../Server' },
  paths: { 'client': '../../Client' }
});

var socket = io("/Example/Server/nodeTestSocket");

requirejs(['./testApplicationClient'],
  function (client) {
    
  client(
    socket, 
    document.getElementById('nodeCanvas'));  

  socket.emit("join");

});
