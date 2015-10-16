var socket = io("/Example/Server/nodeTestSocket");

requirejs(['../Client/creanvasClient'],
  function (client) {
    
  client(
    socket, 
    document.getElementById('nodeCanvas'));  
});


var joinNode = function () {
  socket.emit("join");
};
