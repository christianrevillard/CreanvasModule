define(['creanvas/events'], function (events) {
  
  events.serverEvents.on(
    "clientConnected", 
    function (appEvents, clientChannel) {
      new ClientMessenger(appEvents, clientChannel);
    });
  
  var ClientMessenger = function (appEvents, clientChannel) {
        
    var onApplicationMessage = function (message) {
      clientChannel.emit('message', message);
    };
    appEvents.on("applicationMessage", onApplicationMessage);
    
    var onClientMessage = function (clientId, message) {
      if (clientId !== clientChannel.id)
        return;
      clientChannel.emit('message', message);
    };
    appEvents.on("clientMessage", onClientMessage);
        
    clientChannel.on('disconnect', function () {
      appEvents.removeListener("applicationMessage", onApplicationMessage);
      appEvents.removeListener("clientMessage", onClientMessage);
    });
  };
});
