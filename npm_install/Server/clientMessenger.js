define(['creanvas/events'], function (events) {
  
  events.commands.on(
    "clientConnected", 
    function (appEvents, clientChannel) {
      console.log('Adding a client Messenger');
      new ClientMessenger(appEvents, clientChannel);
    });
  
  var ClientMessenger = function (appEvents, clientChannel) {
        
    var onApplicationMessage = function (message) {
      console.log('Transmitting an application message to client', appEvents.id, clientChannel.id);
      clientChannel.emit('message', message);
    };
    appEvents.on("emit", onApplicationMessage);
    
    var onClientMessage = function (fromClientId, message) {
      if (fromClientId === clientChannel.id)
        return;
      clientChannel.emit('message', message);
    };
    appEvents.on("broadcast", onClientMessage);
        
    clientChannel.on('disconnect', function () {
      appEvents.removeListener("emit", onApplicationMessage);
      appEvents.removeListener("broadcast", onClientMessage);
    });
  };
});
