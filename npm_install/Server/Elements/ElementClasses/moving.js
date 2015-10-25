define(['creanvas/Core/serverBus'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "elementAdded", 
    function (element) {
        if (element.speed) {
          moving(appBus, element);
        }
      });
  });
  
  var moving = function (appBus, element) {
    
    appBus.on("getNewFrame", function (dt) {
      
      element.position.x += (element.speed.x || 0) * dt;
      element.position.y += (element.speed.y || 0) * dt;
      element.position.angle += (element.speed.angle ||0) * dt;
      
      if (element.acceleration) {
        element.speed.x += (element.acceleration.x || 0) * dt;
        element.speed.y += (element.acceleration.y || 0) * dt;
        element.speed.angle += (element.acceleration.angle || 0) * dt;
      }
      
      if (element.afterMove) { element.afterMove(); }
      
      element.emit('elementUpdated');
    });
  };
});
