define(['creanvas/Core/serverBus'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "elementAdded", 
    function (element) {
        if (element.draggable) {
          draggableElement(appBus, element);
        }
      });
  });
  
  var draggableElement = function (appBus, element) {
    
    var originalZ;    
    
    element.on('elementEvent', function (event) {
      
      if (event.eventId === 'pointerDown') {
        originalZ = element.position.z;
        element.position.z = Infinity;
      }
      else if (event.eventId === 'pointerMove') {
        element.position.x = event.x;
        element.position.y = event.y;
      }
      else if (event.eventId === 'pointerUp') {
        element.position.z = originalZ;
      }

      element.emit("elementUpdated");
    });
  };
});
