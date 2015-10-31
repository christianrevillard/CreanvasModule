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
        
        element.on('updatePendingMove', function (dt) {
          element.pending = {
            dt: dt,
            position: {
              x : element.position.x + (element.speed.x || 0) * dt,
              y : element.position.y + (element.speed.y || 0) * dt,
              angle : element.position.y + (element.speed.angle || 0) * dt
            }
          };
        });
          
        element.on('pendingMove', function (dt) {
          
          element.emit('updatePendingMove', dt);
          
          if (solidElements.every(function (el) { return el.pending; })) {
            appBus.emit("solveCollisions", solidElements);
          }
        });
        
        element.on('commitMove', function (dt) {
          element.pending = null;
        });
      });
  };
});