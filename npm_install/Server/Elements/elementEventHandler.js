define(['creanvas/Core/serverBus'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "elementAdded", 
    function (element) {
        elementEventHandler(appBus, element);
      });
  });
  
  var elementEventHandler = function (appBus, element) {
    element.on('elementEvent', function (event) {
      if (event.eventId === 'pointerDown') {
        //        console.log('element/identifier connected', element.id, event.touchIdentifier);
        element.touchIdentifier = event.touchIdentifier;
        return;
      }
      
      if (event.eventId === 'pointerUp') {
        //       console.log('element/identifier disconnected', element.id, event.touchIdentifier);
        element.touchIdentifier = null;
        return;
      }
    });
  };
});
