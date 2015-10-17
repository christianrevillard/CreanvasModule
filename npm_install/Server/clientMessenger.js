define(['creanvas/serverBus'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "clientConnected", 
    function (clientChannel) {
        new ClientMessenger(appBus, clientChannel);
      });
  });
  
  var ClientMessenger = function (appBus, clientChannel) {
    
    console.log('Adding ClientMEssenger', appBus.id, clientChannel.id);
    
    var onEmit = function (message) {
      clientChannel.emit('message', message);
    };
    
    appBus.on("emit", onEmit);
    
    var onBroadcast = function (fromClientId, message) {
      if (fromClientId === clientChannel.id)
        return;
      clientChannel.emit('message', message);
    };
    
    appBus.on("broadcast", onBroadcast);
    
    clientChannel.on('disconnect', function () {
      appBus.removeListener("emit", onEmit);
      appBus.removeListener("broadcast", onBroadcast);
    });
  };
});
