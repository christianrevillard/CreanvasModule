define(['creanvas/Core/serverBus','modules/Vector'], function (serverBus, Vector) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "elementAdded", 
    function (element) {
        if (element.circular) {
          circular(appBus, element);
        }
      });
  });
  
  var circular = function (appBus, element) {
    console.log('setting up circular');
    
    element.isPointInElement = function (x, y) {
      return element.position && ((x - element.position.x) * (x - element.position.x) + (y - element.position.y) * (y - element.position.y) < element.circular.radius * element.circular.radius);
    };
       
    element.solid.getCollisionPoint = function (x, y) {
      var distance = Math.sqrt((element.position.x - x) * (element.position.x - x) + (element.position.y - y) * (element.position.y - y));
      
      var collisionPoint = distance == 0 ? 
      { x: element.position.x, y: element.position.y } :
		  {
        x: element.position.x + element.circular.radius / distance * (x - element.position.x),
        y: element.position.y + element.circular.radius / distance * (y - element.position.y)
      };
      
      var normalVector = distance == 0 ? 
        new Vector(1, 0):
        new Vector((x - element.position.x) / distance, (y - element.position.y) / distance);
      
      return { collisionPoint: collisionPoint, normalVector: normalVector };
    };

    element.solid.getMomentOfInertia = function () {
      return element.mass / 2 * element.circular.radius * element.circular.radius;
    };
    
    element.solid.getBoundaryBox = function () {
      var original = element.originalPosition || element.position;
      var originalRadius = element.originalPosition || element.circular;
      
      return {
        left: Math.min(element.position.x - element.circular.radius, original.x - originalRadius.radius) ,
        right : Math.max(element.position.x + element.circular.radius, original.x + originalRadius.radius) ,
        top: Math.min(element.position.y - element.circular.radius, original.y - originalRadius.radius) ,
        bottom: Math.max(element.position.y + element.circular.radius, original.y + originalRadius.radius) 
      };
    };
    
    element.solid.getEdgeSpeed = function (x, y) {
      return {
        x: (element.circular.speedRadius || 0) * (x - element.position.x) / element.circular.radius,
        y: (element.circular.speedRadius || 0) * (y - element.position.y) / element.circular.radius
      }
    };

    element.on('updatePosition', function (dt) {
      element.originalPosition.radius = element.originalPosition.radius || element.circular.radius;     
      element.circular.radius = element.originalPosition.radius + (element.circular.speedRadius || 0) * dt;
      
      if (element.circular.radius > element.circular.maxRadius) {
        element.circular.radius = element.circular.maxRadius;
      }
      
      if (element.circular.radius <= element.circular.minRadius) {
        element.circular.radius = element.circular.minRadius;
      }
      
      element.log('radius updated', dt, element.circular.radius);

      if (element.circular.originalSpeedRadius) {
        element.circular.speedRadius = element.circular.originalSpeedRadius;
        element.circular.originalSpeedRadius = null;
      };
    });
    
    element.on('collided', function () {
      // stop radius expand, a growing radius may cause immediate recollision when radius expansion speed higher than  relative speed.
      if (element.circular.speedRadius > 0) {
        element.circular.originalSpeedRadius = element.circular.speedRadius;
        element.circular.speedRadius = 0;
      }
    });

    element.on('commitMove', function () {
      if(element.originalPosition)
        element.originalPosition.radius = null;
      if (element.circular.speedRadius > 0 && element.circular.radius >= element.circular.maxRadius) {
        element.circular.speedRadius = -element.circular.speedRadius;
      }
      
      if (element.circular.speedRadius < 0 && element.circular.radius <= element.circular.minRadius) {
        element.circular.speedRadius = -element.circular.speedRadius;
      }

      element.emit('elementUpdated', {circularRadius: element.circular.radius}); 


    });
  };
});
