define([], function () {
  return function (parameters) {
    
    var system = {};
    
    system.elements = [];
    system.canvas = parameters.canvas;
    system.elementTypes = parameters.elementTypes;
    system.clientChannel = parameters.clientChannel;
    system.onDraw = parameters.onDraw;
    system.onUnscaledDraw = parameters.onUnscaledDraw;    
    system.context = system.canvas.getContext("2d");
    system.left = parameters.left || 0;
    system.right = parameters.right || system.canvas.width;
    system.top = parameters.top || 0;
    system.bottom = parameters.bottom || system.canvas.height;
    
    system.removeElementById = function (id) {
      system.elements = system.elements.filter(function (e) { return e.id != id; });
    };
    
    return system;
  };
});