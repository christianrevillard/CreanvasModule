define(['creanvas/Core/serverBus'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "clientConnected", 
    function (clientChannel) {
        clientMessenger(appBus, clientChannel);
      });
  });
  
  var clientMessenger = function (appBus, clientChannel) {
    
    appBus.addClientChannelListener(clientChannel, "sendMessage", function (message) {
      clientChannel.emit('message', message);
    });
    
    appBus.addClientChannelListener(clientChannel, "broadcastMessage", function (fromClientId, message) {
      if (fromClientId === clientChannel.id)
        return;
      clientChannel.emit('message', message);
    });
  };
});
