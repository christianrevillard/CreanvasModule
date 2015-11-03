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
    
    console.log('Applying draggable', element.id);
    var originalZ;    
    
    element.on('elementEvent', function (event) {
      
      if (event.eventId === 'pointerDown') {
        originalZ = element.position.z;
        element.position.z = Infinity;
      }
      else if (event.eventId === 'pointerMove') {
        if (element.solid) {
          element.target.position = {x :event.x, y :event.y};
        }
        else {
          element.position.x = event.x;
          element.position.y = event.y;
        }
      }
      else if (event.eventId === 'pointerUp') {
        element.position.z = originalZ;
      }

      element.emit("elementUpdated");
    });
  };
});
