﻿define(['creanvas/Core/serverBus'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "elementAdded", 
    function (element) {
        if (element.speed || element.solid) {
          speedMover(appBus, element);
        }
      });
  });
  
  var speedMover = function (appBus, element) {
    
    if ((!element.solid || element.mass == Infinity) && (!element.speed || (!element.speed.x && !element.speed.y && !element.speed.angle)))
      return;

    element.on('move', function (dt) {
      
      // can use a mover factory
      if (element.target.position)
        return;
      
      element.position.x = element.lastCommited.position.x + (element.speed.x || 0) * dt;
      element.position.y = element.lastCommited.position.y + (element.speed.y || 0) * dt;
      element.position.angle = element.lastCommited.position.angle + (element.speed.angle || 0) * dt;
    });
  };
});
