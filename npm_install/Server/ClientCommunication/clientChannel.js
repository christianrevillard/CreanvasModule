define(['creanvas/Core/serverBus', 'creanvas/core/EventEmitter'], function (serverBus, EventEmitter) {
  
  serverBus.on('applicationCreated', function (appBus) {
    
    appBus.on(
      "connectClient", 
    function (clientChannel) {
        var clientId = 0;
        
        if (!clientChannel) {
          clientChannel = new EventEmitter();
          clientChannel.setMaxListeners(0);
          clientChannel.id = appBus.id + '-Client-' + (++clientId);
        }
        
        appBus.emit('clientConnected', clientChannel);
        
        clientChannel.on('disconnect', function () {
          clientChannel.removeAllListeners();
        });
      });
  });
});
