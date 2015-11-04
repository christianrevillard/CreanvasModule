define(['creanvas/Core/serverBus'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "elementAdded", 
    function (element) {
        if (element.limits) {
          limited(appBus, element);
        }
      });
  });
    
  var limited = function (appBus, element) {
    
      
      element.on("positionUpdated", function () {
      if (element.limits.position) {
        var updated = false;
        var position = (element.target && element.target.position)? element.target.position:element.position;
        var x = position.x;
        var y = position.y;

        if (element.limits.position.x) {
          if (x < element.limits.position.x[0]) {
            x = element.limits.position.x[0];
            updated = true;
          }
          if (x > element.limits.position.x[1]) {
            x = element.limits.position.x[1];
            updated = true;
          }
        }
        if (element.limits.position.y) {
          if (y < element.limits.position.y[0]) {
            y = element.limits.position.y[0];
            updated = true;
          }
          if (y > element.limits.position.y[1]) {
            y = element.limits.position.y[1];
            updated = true;
          }
          if (updated) {
            element.emit("updatePosition", x, y);
          }
        }
      }
    });
    
    element.on('targetReached', function () {
      if (!element.limits.position)
        return;
              
      if (element.limits.position.x && (element.position.x == element.limits.position.x[0] || element.position.x == element.limits.position.x[1])){
        element.speed.x = 0;
      }
      
      if (element.limits.position.y && (element.position.y == element.limits.position.y[0] || element.position.y == element.limits.position.y[1])){
        element.speed.y = 0;
      }
    });

    element.on("speedUpdated", function () {
      if (element.limits.speed) {
        speedSquare = element.speed.x * element.speed.x + element.speed.y * element.speed.y;
        if (speedSquare > element.limits.speed[1] * element.limits.speed[1]) {
          element.speed.x = element.speed.x * element.limits.speed[1] / Math.sqrt(speedSquare);
          element.speed.y = element.speed.y * element.limits.speed[1] / Math.sqrt(speedSquare);
        } else if (speedSquare < element.limits.speed[0] * element.limits.speed[0]) {
          element.speed.x = element.speed.x * element.limits.speed[0] / Math.sqrt(speedSquare);
          element.speed.y = element.speed.y * element.limits.speed[0] / Math.sqrt(speedSquare);
        }
      }
    });
  };
});
