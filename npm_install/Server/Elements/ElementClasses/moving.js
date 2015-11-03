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
      element.position.pendingDt = dt;
      if (element.target.position) {
        console.log('moving to target', element.id, element.target.position);
        if (element.target.position.dt) { 
          // updating, after collision TODO
          element.position.x = element.lastCommited.position.x;
          element.position.y = element.lastCommited.position.y;
          element.position.angle = element.lastCommited.position.angle;
        } else {
          element.target.position.dt = dt;
          element.position.x = element.target.position.x;
          element.position.y = element.target.position.y;
          element.position.angle = element.target.position.angle;
          // TODO, speed to use..
        }
      }
      else {
        element.position.x = element.lastCommited.position.x + (element.speed.x || 0) * dt;
        element.position.y = element.lastCommited.position.y + (element.speed.y || 0) * dt;
        element.position.angle = element.lastCommited.position.angle + (element.speed.angle || 0) * dt;
      }   
    });

    element.on('commitMove', function () {
            
//      element.log('move commited', dt, element.position);
      
      if (element.target.position &&
        element.position.x === element.target.position.x &&
        element.position.y === element.target.position.y &&
        element.position.angle === element.target.position.angle) {
        element.target.position = null;
      }

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
      element.emit('moved', element);
      element.emit('elementUpdated');
    });
  };
});
