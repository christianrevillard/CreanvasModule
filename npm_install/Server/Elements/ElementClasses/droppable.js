define(['creanvas/Core/serverBus'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "elementAdded", 
    function (element) {
        if (element.droppable) {
          droppable(appBus, element);
        }
      });
  });
  
  var droppable = function (appBus, element) {
    element.droppable = {};
        
    element.on('elementEvent', function (event) {      
      if (event.eventId === 'pointerUp') {
        appBus.emit('checkDropZone', element, event.x, event.y);
      } 
    });

    element.on('elementEvent', function (event) {
      if (event.eventId === 'pointerDown') {
        console.log('pointer down on droppable');
        if (element.droppable.dropZone) {
          element.droppable.dropZone.emit('dragOut', element);
        }
      }
    });
  };
});
