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
      
      element.position.x += element.speed.x * dt;
      element.position.y += element.speed.y * dt;
      element.position.angle += element.speed.angle * dt;
      
      if (element.acceleration) {
        element.speed.x += element.acceleration.x * dt;
        element.speed.y += element.acceleration.y * dt;
        element.speed.angle += element.acceleration.angle * dt;
      }
      
      if (element.afterMove) { element.afterMove(); }
      
      element.emit('elementUpdated');
    });
  };
});
