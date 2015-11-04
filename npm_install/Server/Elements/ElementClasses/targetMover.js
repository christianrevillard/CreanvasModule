define(['creanvas/Core/serverBus'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "elementAdded", 
    function (element) {
        elementMover(appBus, element);
      });
  });
  
  var elementMover = function (appBus, element) {
    
    element.on('updatePosition', function (x, y) {
      
      if (element.solid || (element.limits && element.limits.speed)) {
        element.target = element.target || {};
        element.target.position = { x : x, y : y };
      }
      else {
        element.position.x = x;
        element.position.y = y;
      }
    });
    
    element.on('move', function (dt) {
      if (!element.target.position)
        return;
      
      if (!element.target.speedCalculated) {
        
        element.speed.x = (element.target.position.x - element.position.x) / dt;
        element.speed.y = (element.target.position.y - element.position.y) / dt;
        element.speed.angle = 0;
        
        element.emit("speedUpdated");
        
        element.target.speedCalculated = true;
      }
      
      element.position.x = element.lastCommited.position.x + dt * element.speed.x;
      element.position.y = element.lastCommited.position.y + dt * element.speed.y;
    });
    
    element.on('commitMove', function () {
      if (!element.target.position)
        return;
      
      element.target.speedCalculated = false;
      
      if (
        element.position.x === element.target.position.x &&
        element.position.y === element.target.position.y) {        
        element.emit("targetReached");
      }
    });

    element.on('targetReached', function () {
      element.target.position = null;
    });
  };
});
