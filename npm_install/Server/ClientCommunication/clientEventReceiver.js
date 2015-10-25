define(['creanvas/Core/serverBus'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "clientConnected", 
    function (clientChannel) {
        clientEventReceiver(appBus, clientChannel);
      });
  });
  
  var clientEventReceiver = function (appBus, clientChannel) {
    
    clientChannel.on('pointerEvent', function (eventData) {
      var event = JSON.parse(eventData);
      appBus.emit('checkElementEvent', event);
      if (event.element) {
        appBus.emit('elementEvent', event, event.element);
        event.element.emit('elementEvent', event);
      }
    });
  };
});
