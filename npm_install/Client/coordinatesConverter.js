define([], function () {
  
  return {
    eventToCustom: function (system, xy) {
      var boundings = system.canvas.getBoundingClientRect();
      return {
        x: system.left + (xy.x - boundings.left) * (system.right - system.left) / boundings.width  ,
        y: system.top + (xy.y - boundings.top) * (system.bottom - system.top) / boundings.height
      };
    },
    resetTransform: function (system) {
      system.context.setTransform(1, 0, 0, 1, 0, 0);
      system.context.scale(system.canvas.width / (system.right - system.left), system.canvas.height / (system.bottom - system.top));
      system.context.translate(-system.left, -system.top);
    }
  };
});

