define(['creanvas/Core/serverBus'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "elementAdded", 
    function (element) {
        if (element.speed || element.solid) {
          moving(appBus, element);
        }
      });
  });
  
  var moving = function (appBus, element) {
    
    element.speed = element.speed || {};

    element.speed.x = element.speed.x || 0;
    element.speed.y = element.speed.y || 0;
    element.speed.angle = element.speed.angle || 0;
    
    appBus.on("getNewFrame", function (dt) {
      
      element.emit('move', dt)
      
      if (!element.solid) {
        element.emit('commitMove')
      }
    });
    
    element.on('move', function (dt) {
      element.position.pendingDt = dt;
    });
    
    element.on('commitMove', function () {
                  
      element.lastCommited.position = {
        x: element.position.x,
        y: element.position.y,
        z: element.position.z,
        angle: element.position.angle,
      };
            
      var dt = element.position.pendingDt;
      
      if (element.acceleration) {
        element.speed.x += (element.acceleration.x || 0) * dt;
        element.speed.y += (element.acceleration.y || 0) * dt;
        element.speed.angle += (element.acceleration.angle || 0) * dt;
      }
      
      element.emit('positionUpdated', element);
      element.emit("speedUpdated");
    });
  };
});
