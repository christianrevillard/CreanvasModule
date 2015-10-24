define(['creanvas/serverBus', 'creanvas/elementList'], function (serverBus, elements) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "clientConnected", 
    function (clientChannel) {
        new ClientEventReceiver(appBus, clientChannel);
      });
  });
  
  var ClientEventReceiver = function (appBus, clientChannel) {
  // "eventId": eventId,
  // "x": event.x,
  // "y": event.y,
    // "touchIdentifier": event.touchIdentifier
    
    // click, pointerDown, -Move, -Up
    // move, up: only interessant by the touchIdentifier.
    clientChannel.on('pointerEvent', function (eventData) {
      var event = JSON.parse(eventData);
//      console.log(events);
      
      //click and down: do we have an element at this position?
      // not as event, as we want the z-sorting...
      if (event.eventId === 'click' || event.eventId === 'pointerDown') {
        appBus.emit('checkElementEvent', event);
        if (event.element) {
          console.log('event on element:', event.element.id);
          appBus.emit('elementEvent', event, event.element);
        }
      }
    });
  };
});
