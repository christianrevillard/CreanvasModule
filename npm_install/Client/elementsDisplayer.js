define(['client/coordinatesConverter'], function (coordinates) {
  
  return function (system) {
    
    var needRedraw = true;
    var isDrawing = false;
    var refreshTime = system.refreshTime || 40;
        
    var drawElement = function (element) {
      
      if (!element.elementType)
        return;
            
      system.context.translate(element.x, element.y);
      system.context.rotate(element.angle || 0);
      //      ctx.scale(element.scale.x || 1, element.scale.y || 1);
      
      system.context.beginPath();
      element.elementType.draw(system.context);
      
      coordinates.resetTransform(system);
    };
    
    setInterval(
      function () {
        if (needRedraw && !isDrawing) {
          isDrawing = true;
          
          coordinates.resetTransform(system);
          
          system.elements
						.sort(function (a, b) { return ((a.z || 0) - (b.z || 0)); })
						.forEach(drawElement);
          
          if (system.onDraw) {
            system.onDraw(system.context);
          }
          
          isDrawing = false;
        }
      },
    refreshTime);
  };
});