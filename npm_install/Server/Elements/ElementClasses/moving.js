define(['creanvas/Core/serverBus'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "elementAdded", 
    function (element) {
        if (element.speed) {
          moving(appBus, element);
        }
      });
  });
  
  var moving = function (appBus, element) {
    
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
      element.originalPosition = {
        x: element.position.x,
        y: element.position.y,
        angle: element.position.angle
      };
      
      element.emit('updatePosition', dt);
    });
    
    element.on('updatePosition', function (dt) {      
      element.position.pendingDt = dt;
      element.position.x = element.originalPosition.x + (element.speed.x || 0) * dt;
      element.position.y = element.originalPosition.y + (element.speed.y || 0) * dt;
      element.position.angle = element.originalPosition.angle + (element.speed.angle || 0) * dt;
    });

    element.on('commitMove', function () {
            
      element.originalPosition = null;
      var dt = element.position.pendingDt;
      
      if (element.acceleration) {
        element.speed.x += (element.acceleration.x || 0) * dt;
        element.speed.y += (element.acceleration.y || 0) * dt;
        element.speed.angle += (element.acceleration.angle || 0) * dt;
      }
      element.emit('moved', element);
      element.emit('elementUpdated', element);
    });
  };
});
