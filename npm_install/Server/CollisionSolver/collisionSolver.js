define(['creanvas/Core/serverBus'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus) {
    collisionSolver(appBus);
  });
  
  var collisionSolver = function (appBus) {
    
    var solidElements = [];
    
    var isSolving = false;

    appBus.on(
      "elementAdded", 
    function (element) {
        if (!element.solid)
          return;
        
        element.solid.collisionGroups = element.solid.collisionGroups || [element.id, 'main'];

        solidElements.push(element);
         
        element.solid.getBoundaryBox = function () {
          return {
            left: element.position.x,            
            right: element.position.x,
            top: element.position.y,
            bottom: element.position.y,
          }
        };

        element.solid.isInTile = function (tile) {
          var box = element.solid.getBoundaryBox();
          return box.left <= tile.right && box.right >= tile.left && box.top <= tile.bottom && box.bottom >= tile.top;
        };
        
        element.solid.getCollisionPoint = element.getCollisionPoint || function () {
       //   console.log('getCollisionPoint is not defined for element ', element.id)
          return null;
        };
        
        element.solid.getMomentOfInertia = element.solid.getMomentOfInertia || function () {
      //    console.log('getMomentOfInertia is not defined for element ', element.id)
          return Infinity;
        };
        
        element.mass = element.mass || Infinity;
        
        element.solid.coefficient = element.solid.coefficient || 1;
        
        element.solid.staticFriction = element.solid.staticFriction || 0;
        
        element.solid.dynamicFriction = element.solid.dynamicFriction || 0;
        
        element.on('move', function (dt) {
          
          if (isSolving)
            return;

          element.readyForSolver = true;
          
          if (solidElements.every(function (el) { return el.readyForSolver; })) {
            isSolving = true;
            solidElements.forEach(function (el) { el.readyForSolver = false; })
            appBus.emit("solveCollisions", solidElements);
            isSolving = false;
          }
        });
      });
  };
});