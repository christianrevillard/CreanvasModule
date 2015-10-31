define(['creanvas/Core/serverBus'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus) {
    collisionSolver(appBus);
  });
  
  var collisionSolver = function (appBus) {
    
    var solidElements = [];
    
    appBus.on(
      "elementAdded", 
    function (element) {
        if (!element.solid)
          return;
        
        solidElements.push(element);
        
        element.solid.isInTile = element.isInTile || function () {
          console.log('isInTile is not defined for element ', element.id)
          return false;
        };
        
        element.solid.getCollisionPoint = element.getCollisionPoint || function () {
          console.log('getCollisionPoint is not defined for element ', element.id)
          return null;
        };
        
        element.solid.getMomentOfInertia = element.solid.getMomentOfInertia || function () {
          console.log('getMomentOfInertia is not defined for element ', element.id)
          return Infinity;
        };
        
        element.mass = element.mass || 0;
        
        element.solid.coefficient = element.solid.coefficient || 1;
        
        element.solid.staticFriction = element.solid.staticFriction || 0;
        
        element.solid.dynamicFriction = element.solid.dynamicFriction || 0;
        
        element.on('move', function (dt) {
          
          element.readyForSolver = true;
          
          if (solidElements.every(function (el) { return el.readyForSolver; })) {
            solidElements.forEach(function (el) { el.readyForSolver = false; })
            appBus.emit("solveCollisions", solidElements);
          }
        });
      });
  };
});