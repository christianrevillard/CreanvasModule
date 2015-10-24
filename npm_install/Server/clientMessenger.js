define(['creanvas/serverBus'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "clientConnected", 
    function (clientChannel) {
        new ClientMessenger(appBus, clientChannel);
      });
  });
  
  var ClientMessenger = function (appBus, clientChannel) {
    var onSendMessage = function (message) {
      clientChannel.emit('message', message);
    };
    
    appBus.on("sendMessage", onSendMessage);
    
    var onBroadcastMessage = function (fromClientId, message) {
      if (fromClientId === clientChannel.id)
        return;
      clientChannel.emit('message', message);
    };
    
    appBus.on("broadcastMessage", onBroadcastMessage);
    
    clientChannel.on('disconnect', function () {
      appBus.removeListener("sendMessage", onSendMessage);
      appBus.removeListener("broadCastMessage", onBroadcastMessage);
    });
  };
});
