// entry point for in-browser, config requirejs here

requirejs.config({
  paths: { 'creanvas': '../../Server' },
  paths: { 'client': '../../Client' }
});

var socket = io("/CollisionTest/Server/CollisionTestSocket");

requirejs(['./collisionTestClient'],
  function (client) {
    
  client(
    socket, 
    document.getElementById('nodeCanvas'));  

  socket.emit("join");

});
