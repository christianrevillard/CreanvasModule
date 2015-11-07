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
    
    element.on("speedUpdated", function () {
      if (element.limits.speed) {
        speedSquare = element.speed.x * element.speed.x + element.speed.y * element.speed.y;
        if (speedSquare > element.limits.speed[1] * element.limits.speed[1]) {
          element.speed.x = element.speed.x * element.limits.speed[1] / Math.sqrt(speedSquare);
          element.speed.y = element.speed.y * element.limits.speed[1] / Math.sqrt(speedSquare);
          if (!element.originalMass) {
            element.originalMass = element.mass
            element.mass = Infinity;
          }
        } else if (speedSquare < element.limits.speed[0] * element.limits.speed[0] && speedSquare>0) {
          element.speed.x = element.speed.x * element.limits.speed[0] / Math.sqrt(speedSquare);
          element.speed.y = element.speed.y * element.limits.speed[0] / Math.sqrt(speedSquare);
          if (!element.originalMass) {
            element.originalMass = element.mass
            element.mass = Infinity;
          }
        }
      }
    });
        
    element.on("commitMove", function () {
      if (element.mass === Infinity && element.originalMass) {
        element.mass = element.originalMass;
        element.originalMass = null;
      }
    })

    if (element.solid) {
      
      if (element.limits.position && element.limits.position.y) {
         appBus.emit("addElement", {
          id: 'LimitTop' + element.id,
          solid: { collisionGroups: [element.id] },
          mass: Infinity,
          position: { x: 0, y: 0, z: 0 },
          box: { top: -Infinity, bottom: element.limits.position.y[0], left: -Infinity, right: Infinity },
        });
        
         appBus.emit("addElement", {
          id: 'LimitBottom' + element.id,
          solid: { collisionGroups: [element.id] },
          mass: Infinity,
          position: { x: 0, y: 0, z: 0 },
          box: { top: element.limits.position.y[1], bottom: Infinity, left: -Infinity, right: Infinity },
        });
      }
      
      if (element.limits.position && element.limits.position.x) {
         appBus.emit("addElement", {
          id: 'LimitLeft' + element.id,
          solid: { collisionGroups: [element.id] },
          mass: Infinity,
          position: { x: 0, y: 0, z: 0 },
          box: { top: -Infinity, bottom: Infinity, left: -Infinity, right: element.limits.position.x[0] },
        });
        
         appBus.emit("addElement", {
          id: 'LimitRight' + element.id,
          solid: { collisionGroups: [element.id] },
          mass: Infinity,
          position: { x: 0, y: 0, z: 0 },
          box: { top: -Infinity, bottom: Infinity, left: element.limits.position.x[1], right: Infinity },
        });
      }
      
      return;
    }

    
    var setLimits = function (position) {
      if (element.limits.position) {
        if (element.limits.position.x) {
          if (position.x < element.limits.position.x[0]) {
            position.x = element.limits.position.x[0];
          }
          if (position.x > element.limits.position.x[1]) {
            position.x = element.limits.position.x[1];
          }
        }
        if (element.limits.position.y) {
          if (position.y < element.limits.position.y[0]) {
            position.y = element.limits.position.y[0];
          }
          if (position.y > element.limits.position.y[1]) {
            position.y = element.limits.position.y[1];
          }
        }
      };
    }
    
    element.on("targetDestinationSet", function () {
      setLimits(element.target.position);
    });
    
    element.on("moved", function () {
      setLimits(element.position);
    });
  };
});
