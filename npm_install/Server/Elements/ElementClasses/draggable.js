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
    var isDragging = false;
        
    element.draggable.speed = element.draggable.speed || 'keep';
    
    element.on('elementEvent', function (event) {
      if (event.eventId === 'pointerDown') {
        isDragging = true;
        originalZ = element.position.z;
        element.position.z = Infinity;
      }
      else if (event.eventId === 'pointerMove') {
        element.emit("setTargetDestination", event.x, event.y);
      }
      else if (event.eventId === 'pointerUp') {
        targetDragCompleted();
      }

      element.emit("positionUpdated");
    });
           
    var targetDragCompleted = function () {
      isDragging = false;
      element.target.position = null;      
      element.position.z = originalZ;           
    };
    
    element.on('targetReached', function () {
      if (element.draggable.speed === 'none') {
        element.speed = { x: 0, y: 0, angle: 0 };
      }
      else if (element.draggable.speed === 'original' && element.target.originalSpeed) {        
        element.speed = element.target.originalSpeed;
      }
      element.target.originalSpeed = null;
    });
    
    element.on('collided', function () {
      if (!isDragging)
        return;

      if (element.draggable.dropOnCollision) {
        targetDragCompleted();
      }

      element.target.position = null;
    });
  };
});
