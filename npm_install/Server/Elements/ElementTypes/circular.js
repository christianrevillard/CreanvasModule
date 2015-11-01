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
    var radius = element.circular.radius;
    
    element.isPointInElement = function (x, y) {
      return element.position && ((x - element.position.x) * (x - element.position.x) + (y - element.position.y) * (y - element.position.y) < radius * radius);
    };
       
    element.solid.getCollisionPoint = function (x, y) {
      var distance = Math.sqrt((element.position.x - x) * (element.position.x - x) + (element.position.y - y) * (element.position.y - y));
      
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
      return element.mass / 2 * radius * radius;
    };
    
    element.solid.getBoundaryBox = function () {
      var original = element.originalPosition || element.position;
      
      return {
        left: Math.min(element.position.x, original.x) - radius,
        right : Math.max(element.position.x, original.x) + radius,
        top: Math.min(element.position.y, original.y) - radius,
        bottom: Math.max(element.position.y, original.y) + radius
      };
    };
  };
});
