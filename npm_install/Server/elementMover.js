define(['creanvas/serverBus'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "elementAdded", 
    function (element) {
        if (element.speed) {
          new ElementMover(appBus, element);
        }  
      });
  });
  
  var ElementMover = function (appBus, element) {
    
    // KISS for the moment, until the intercation between client and server incl Movable is ready.
    
    console.log('Create element mover');
    appBus.on("getNewFrame", function (dt) {
      
      element.position.x += element.speed.x * dt;
      element.position.y += element.speed.x * dt;
      
      if (element.afterMove) { element.afterMove(); }
            
      appBus.emit('elementUpdated', element);
    });
  };
});
