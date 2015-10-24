define(['creanvas/Core/serverBus', 'creanvas/core/EventEmitter'], function (serverBus, EventEmitter) {
  
  serverBus.on('applicationCreated', function (appBus) {
    
    appBus.on(
      "connectClient", 
    function (clientChannel) {
        var clientId = 0;
        var serverSide = new EventEmitter();
        serverSide.setMaxListeners(0);
        
        if (!clientChannel) {
          clientChannel || new EventEmitter()
          clientChannel.setMaxListeners(0);
        };
        
        appBus.emit('clientConnected', {
          id: clientChannel.id || (appBus.id + '-Client-' + (++clientId)),
          serverSide: serverSide,
          clientSide: clientChannel
        })
        
        clientChannel.on('disconnect', function () {
          serverSide.removeAllListeners();
          clientChannel.removeAllListeners();
        });
      });
  });
});
