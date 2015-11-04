define(['creanvas/Core/serverBus'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "elementAdded", 
    function (element) {
        if (element.dropZone) {
          dropZone(appBus, element);
        }
      });
  });
  
  var dropZone = function (appBus, element) {
    var maxCount = element.dropZone.maxCount || Infinity;
    var droppedElements = []; 

    appBus.addElementListener(element, 'checkDropZone', function (dropped, x, y) {
      
      if (droppedElements.length >= maxCount) {
        console.log('dropZone full', element.id);
        return;
      }

      if (dropped.droppable.dropZone) {
        console.log('element already dropped', dropped.id, dropped.droppable.dropZone.id);
        return;
      }

      if (element.isPointInElement(x, y)) {
        droppedElements.push(dropped);
        dropped.position.x = element.position.x;
        dropped.position.y = element.position.y;
        dropped.droppable.dropZone = element;
        dropped.emit('positionUpdated');
        dropped.emit('droppedIn', element);
        element.emit('droppedIn', dropped);
      }
    });

    element.on('dragOut', function (draggedOut) {
      droppedElements = droppedElements.filter(function (dropped) { return dropped.id != draggedOut.id });
      draggedOut.droppable.dropZone = null;
      draggedOut.emit('draggedOut', element);
      element.emit('draggedOut', draggedOut);
    });
  };
});
