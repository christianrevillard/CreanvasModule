define(['creanvas/Core/serverBus'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "elementAdded", 
    function (element) {
        scaling(appBus, element);
      });
  });
  
  var scaling = function (appBus, element) {
    
    // extern client sets element.scale directly.
    // working internally with getScale()    
    
    element.on('collided', function () {
      element.hasCollided = true;
    });
    
    element.scale = element.scale || 1;
    element.lastCommited.scale = element.lastCommited.scale || element.scale;
    
    if (element.solid) {
      element.solid.getEdgeSpeed = function (x, y) {
        
        var scaleSpeed = element.position.pendingDt ? (element.scale - element.lastCommited.scale) / element.position.pendingDt:0;
        
        return {
          x: scaleSpeed * (x - element.position.x),
          y: scaleSpeed * (y - element.position.y)
        }
      };
    }
    
    element.getScale = function () {
      
      var dt = element.position.pendingDt;
      
      if (!dt) {
        return element.lastCommited.scale;
      }
      
      if (!element.scaleSpeed && element.scaleSpeed !== 0) {
        element.scaleSpeed = (element.scale - element.lastCommited.scale) / dt;
        if (element.scaleSpeed != element.scaleSpeed) {
          debugger;
        }
      }
      
      return element.lastCommited.scale + dt * element.scaleSpeed;
    };
    
    element.on('commitMove', function () {
      element.scale = element.lastCommited.scale = element.getScale();      
      if (element.scale != element.scale) {
        debugger;
      }
      element.scaleSpeed = null;
    });
  };
});
