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

    element.on('move', function (dt) {
      if (element.target.position) {
        
        if (!element.draggable.originalSpeed) {          
          element.draggable.originalSpeed = {
            x: element.speed.x,
            y: element.speed.y,
            angle: element.speed.angle,
          };
        }
        
        if(!element.draggable.speedCalculated){

          element.speed.x = (element.target.position.x - element.position.x) / dt;
          element.speed.y = (element.target.position.y - element.position.y) / dt;          
          element.speed.angle = 0;

          if (element.draggable.maxSpeed) {
            speedSquare = element.speed.x * element.speed.x + element.speed.y * element.speed.y;
            if (speedSquare > element.draggable.maxSpeed * element.draggable.maxSpeed) {
              element.speed.x = element.speed.x * element.draggable.maxSpeed / Math.sqrt(speedSquare);
              element.speed.y = element.speed.y * element.draggable.maxSpeed / Math.sqrt(speedSquare);
            }
          }
          
          element.draggable.speedCalculated = true;
        }
        
        element.position.x = element.lastCommited.position.x + dt * element.speed.x;
        element.position.y = element.lastCommited.position.y + dt * element.speed.y;
      }
    });
    
    var targetDragCompleted = function () {
      element.target.position = null;
            
      if (element.draggable.speed === 'none') {
        element.speed = { x: 0, y: 0, angle: 0 };
        console.log('none', element.speed);
      }
      else if (element.draggable.speed === 'original' && element.draggable.originalSpeed) {
        element.speed = element.draggable.originalSpeed;
        console.log('original', element.speed);
      }
      else {
        console.log('keep', element.speed);
      }
      
      element.draggable.originalSpeed = null;
    };

    element.on('commitMove', function () {
      if (!element.target.position)
        return;
      
      element.draggable.speedCalculated = false;

      if (
        element.position.x === element.target.position.x &&
        element.position.y === element.target.position.y) {
        console.log('target reached, complete drag', element.id, element.target.position);
        targetDragCompleted();
      }
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
