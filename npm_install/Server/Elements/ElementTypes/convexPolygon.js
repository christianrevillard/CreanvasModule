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
      
      var testValue = 0;
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
    
    element.convexPolygon.currentVertices = function () {
      
      return element.convexPolygon.vertices.map(
        function (v) {
          var scaled = [element.getScale() * v[0], element.getScale() * v[1]];
          
          var rotated = [
            scaled[0] * Math.cos(element.position.angle) 
          - scaled[1] * Math.sin(element.position.angle),
            scaled[0] * Math.sin(element.position.angle) 
          + scaled[1] * Math.cos(element.position.angle)];
          
          if (element.position.x + rotated[0] != element.position.x + rotated[0]) {
            debugger;
          }

          return [element.position.x + rotated[0], element.position.y + rotated[1]];
        }
      );
    };
    
    element.convexPolygon.originalVertices = element.convexPolygon.originalVertices || element.convexPolygon.currentVertices();
    
    if (element.solid) {
      
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
      
      element.solid.getBoundaryBox = function () {
        
        var vertices = element.convexPolygon.originalVertices.concat(element.convexPolygon.currentVertices());
        if (element.convexPolygon.currentVertices()[0][0] != element.convexPolygon.currentVertices()[0][0]) {
          console.log('original', element.convexPolygon.originalVertices);
          console.log('current', element.convexPolygon.currentVertices());
          console.log({
            left: Math.min.apply(null, vertices.map(function (v) { return v[0]; })) ,
            right : Math.max.apply(null, vertices.map(function (v) { return v[0]; })) ,
            top: Math.min.apply(null, vertices.map(function (v) { return v[1]; })) ,
            bottom: Math.max.apply(null, vertices.map(function (v) { return v[1]; }))
          });
          debugger;
        }

        return {
          left: Math.min.apply(null, vertices.map(function (v) { return v[0]; })) ,
          right : Math.max.apply(null, vertices.map(function (v) { return v[0]; })) ,
          top: Math.min.apply(null, vertices.map(function (v) { return v[1]; })) ,
          bottom: Math.max.apply(null, vertices.map(function (v) { return v[1]; }))
        };
      };
    }
    

    element.on('moveCommitted', function () { 
      element.convexPolygon.originalVertices = element.convexPolygon.currentVertices();
    });

    element.emit('elementUpdated', {vertices: element.convexPolygon.vertices}); 
  };
});
