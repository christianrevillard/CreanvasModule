define(['creanvas/Core/serverBus','modules/Vector'], function (serverBus, Vector) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "elementAdded", 
    function (element) {
        if (element.convexPolygon) {
          convexPolygon(appBus, element);
        }
      });
  });
  
  var convexPolygon = function (appBus, element) {
    console.log('setting up convexPolygon');
    
    element.lastCommited = element.lastCommited || {};
    
    element.isPointInElement = function (x, y) {
      
      var vertices = element.convexPolygon.currentVertices();
      var testValue=0;
      for (var vertex = 0; vertex < vertices.length - 1; vertex++) {
        
        var A = vertices[vertex];
        if (A[0] === x && A[1] === y)
          return true;

        var B = vertices[vertex === vertices.length - 1?0:(vertex + 1)];
        if (B[0] === x && B[1] === y)
          return true;

        var MA = new Vector(A[0] - x, A[1] - y);
        var MB = new Vector(B[0] - x, B[1] - y);

        var value = Vector.vectorProduct(MA, MB).z;

        if (testValue && testValue * value < 0)          
          return false;

        if (!testValue)
          testValue = value;
      }      
      return true;
    };
       
    //element.solid.getCollisionPoint = function (x, y) {
    //  var distance = Math.sqrt((element.position.x - x) * (element.position.x - x) + (element.position.y - y) * (element.position.y - y));
      
    //  var radius = element.circular.currentRadius();
      
    //  var collisionPoint = distance == 0 ? 
    //  { x: element.position.x, y: element.position.y } :
		  //{
    //    x: element.position.x + radius / distance * (x - element.position.x),
    //    y: element.position.y + radius / distance * (y - element.position.y)
    //  };
      
    //  var normalVector = distance == 0 ? 
    //    new Vector(1, 0):
    //    new Vector((x - element.position.x) / distance, (y - element.position.y) / distance);
      
    //  return { collisionPoint: collisionPoint, normalVector: normalVector };
    //};

    ////element.solid.getMomentOfInertia = function () {
    //  var radius = element.circular.currentRadius();
    //  return element.mass / 2 * radius * radius;
    //};
    
    //element.solid.getBoundaryBox = function () {
    //  var original = element.lastCommited.position || element.position;
    //  var originalRadius = element.circular.originalRadius();
    //  var currentRadius = element.circular.currentRadius();
      
    //  return {
    //    left: Math.min(element.position.x - currentRadius, original.x - originalRadius) ,
    //    right : Math.max(element.position.x + currentRadius, original.x + originalRadius) ,
    //    top: Math.min(element.position.y - currentRadius, original.y - originalRadius) ,
    //    bottom: Math.max(element.position.y + currentRadius, original.y + originalRadius) 
    //  };
    //};
        
    
    element.convexPolygon.currentVertices = function () {
      
      return element.convexPolygon.vertices.map(
        function (v) {
          var scaled = [element.getScale() * v[0], element.getScale() * v[1]];
          
          var rotated = [
            scaled[0] * Math.cos(element.position.angle) 
          - scaled[1] * Math.sin(element.position.angle),
            scaled[0] * Math.sin(element.position.angle) 
          + scaled[1] * Math.cos(element.position.angle)];
          
          return [element.position.x + rotated[0], element.position.y + rotated[1]];
        }
      );
    };
        
    //element.circular.currentRadius = function () { 
    //  return element.circular.radius * element.getScale();
    //};
    
    //element.circular.originalRadius = function () {
    //  if (!element.lastCommited.scale && element.lastCommited.scale !== 0) {
    //    return element.circular.currentRadius();
    //  }
    //  return element.circular.radius * element.lastCommited.scale;
    //};

    element.emit('elementUpdated', {vertices: element.convexPolygon.vertices}); 
  };
});
