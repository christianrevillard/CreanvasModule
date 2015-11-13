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
    
    element.lastCommited = element.lastCommited || {};
    
    element.isPointInElement = function (x, y) {
      var radius = element.circular.currentRadius();
      return element.position && ((x - element.position.x) * (x - element.position.x) + (y - element.position.y) * (y - element.position.y) < radius * radius);
    };
       
    element.solid.getCollisionPoint = function (x, y) {
      var distance = Math.sqrt((element.position.x - x) * (element.position.x - x) + (element.position.y - y) * (element.position.y - y));
      
      var radius = element.circular.currentRadius();
      
      var collisionPoint = distance == 0 ? 
      { x: element.position.x, y: element.position.y } :
		  {
        x: element.position.x + radius / distance * (x - element.position.x),
        y: element.position.y + radius / distance * (y - element.position.y)
      };
      
      var normalVector = distance == 0 ? 
        new Vector(1, 0):
        new Vector((x - element.position.x) / distance, (y - element.position.y) / distance);
      
      return { collisionPoint: collisionPoint, normalVector: normalVector };
    };

    element.solid.getMomentOfInertia = function () {
      var radius = element.circular.currentRadius();
      return element.mass / 2 * radius * radius;
    };
    
    element.solid.getBoundaryBox = function () {
      var original = element.lastCommited.position || element.position;
      var originalRadius = element.circular.originalRadius();
      var currentRadius = element.circular.currentRadius();
      
      return {
        left: Math.min(element.position.x - currentRadius, original.x - originalRadius) ,
        right : Math.max(element.position.x + currentRadius, original.x + originalRadius) ,
        top: Math.min(element.position.y - currentRadius, original.y - originalRadius) ,
        bottom: Math.max(element.position.y + currentRadius, original.y + originalRadius) 
      };
    };
        
    element.circular.currentRadius = function () { 
      return element.circular.radius * element.getScale();
    };
    
    element.circular.originalRadius = function () {
      if (!element.lastCommited.scale && element.lastCommited.scale !== 0) {
        return element.circular.currentRadius();
      }
      return element.circular.radius * element.lastCommited.scale;
    };

    element.emit('elementUpdated', {circularRadius: element.circular.radius}); 
  };
});
