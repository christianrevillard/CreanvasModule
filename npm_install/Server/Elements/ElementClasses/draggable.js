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
    
    element.draggable.speed = element.draggable.speed || 'keep';
    
    element.on('elementEvent', function (event) {
      
      if (event.eventId === 'pointerDown') {
        originalZ = element.position.z;
        element.position.z = Infinity;
      }
      else if (event.eventId === 'pointerMove') {
        element.emit("updatePosition", event.x, event.y);
      }
      else if (event.eventId === 'pointerUp') {
        element.position.z = originalZ;
      }

      element.emit("positionUpdated");
    });

    element.on('move', function (dt) {
      if (!element.target.position)
        return;
        
      if (!element.draggable.originalSpeed) {
        element.draggable.originalSpeed = {
          x: element.speed.x,
          y: element.speed.y,
          angle: element.speed.angle,
        };
      }        
    });
    
    var targetDragCompleted = function () {
      
      element.target.position = null;
           
      if (element.draggable.speed === 'none') {
        element.speed = { x: 0, y: 0, angle: 0 };
      }
      else if (element.draggable.speed === 'original' && element.draggable.originalSpeed) {
        element.speed = element.draggable.originalSpeed;
      }
      
      element.draggable.originalSpeed = null;
    };
    
    element.on('targetReached', function () {
      targetDragCompleted();
    });
    
    element.on('collided', function () {
      if (!element.target.position)
        return;

      if (element.draggable.dropOnCollision) {
        element.emit('elementEvent', { eventId: 'pointerUp' });
      }
      targetDragCompleted();
    });
  };
});
