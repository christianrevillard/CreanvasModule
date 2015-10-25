define(['client/coordinatesConverter'], function (coordinates) {
  
  return function (system) {
    
    var needRedraw = true;
    var isDrawing = false;
    var refreshTime = system.refreshTime || 40;
        
    var drawElement = function (element) {
      
      if (!element.elementType)
        return;
      
      coordinates.resetTransform(system);
      
      system.context.translate(element.x, element.y);
      system.context.rotate(element.angle || 0);
      //      ctx.scale(element.scale.x || 1, element.scale.y || 1);
      
      system.context.beginPath();
      element.elementType.draw(system.context);
    };
    
    setInterval(
      function () {
        if (needRedraw && !isDrawing) {
          isDrawing = true;
                    
          system.elements
						.sort(function (a, b) { return ((a.z || 0) - (b.z || 0)); })
						.forEach(drawElement);
          
          if (system.onDraw) {
            coordinates.resetTransform(system);
            system.onDraw(system.context);
          }
                    
          if (system.onUnscaledDraw) {
            system.context.setTransform(1, 0, 0, 1, 0, 0);
            system.onUnscaledDraw(system.context);
          }          
          
          isDrawing = false;
        }
      },
    refreshTime);
  };
});