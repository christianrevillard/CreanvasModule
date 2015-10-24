define(['creanvas/Core/serverBus'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "clientConnected", 
    function (clientChannel) {
        clientMessenger(appBus, clientChannel);
      });
  });
  
  var clientMessenger = function (appBus, clientChannel) {
    var onSendMessage = function (message) {
      clientChannel.clientSide.emit('message', message);
    };
    
    appBus.on("sendMessage", onSendMessage);
    
    var onBroadcastMessage = function (fromClientId, message) {
      if (fromClientId === clientChannel.id)
        return;
      clientChannel.clientSide.emit('message', message);
    };
    
    appBus.on("broadcastMessage", onBroadcastMessage);
    
    clientChannel.clientSide.on('disconnect', function () {
      appBus.removeListener("sendMessage", onSendMessage);
      appBus.removeListener("broadCastMessage", onBroadcastMessage);
    });
  };
});
