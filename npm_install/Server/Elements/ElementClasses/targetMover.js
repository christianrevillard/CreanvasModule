define(['creanvas/Core/serverBus'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "elementAdded", 
    function (element) {
        targetMover(appBus, element);
      });
  });
  
  var targetMover = function (appBus, element) {
    
    element.on('setTargetDestination', function (x, y, angle) {
      element.target = element.target || {};
      element.target.position = { x : x, y : y };
      element.emit('targetDestinationSet');
    });
    
    element.on('move', function (dt) {
      
      // can use a mover factory
      if (!element.target.position)
        return;
            
      if (!element.target.speedCalculated) {
        
        if (!element.target.originalSpeed) {
          element.target.originalSpeed = {
            x: element.speed.x,
            y: element.speed.y,
            angle: element.speed.angle,
          };
        }
        
        element.speed.x = (element.target.position.x - element.position.x) / dt;
        element.speed.y = (element.target.position.y - element.position.y) / dt;
        element.speed.angle = 0;
        
        element.emit("speedUpdated");
        
        element.target.speedCalculated = true;
      }
      
      element.position.x = element.lastCommited.position.x + dt * element.speed.x;
      element.position.y = element.lastCommited.position.y + dt * element.speed.y;
      element.position.angle = element.lastCommited.position.angle + dt * element.speed.angle;
    });
    
    element.on('commitMove', function () {
      
      element.target.speedCalculated = false;
      
      if (
        element.target.position &&
        element.position.x === element.target.position.x &&
        element.position.y === element.target.position.y) {
        element.target.position = null;
      }
    });
  };
});
