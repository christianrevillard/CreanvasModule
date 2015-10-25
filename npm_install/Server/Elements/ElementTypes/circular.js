define(['creanvas/Core/serverBus'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "elementAdded", 
    function (element) {
        if (element.circular) {
          circular(appBus, element);
        }
      });
  });
  
  var circular = function (appBus, element) {
    console.log('setting up circular');
    
    element.on('isPointInElement', function (x, y, onMatch) {
      if (element.position && ((x - element.position.x) * (x - element.position.x) + (y - element.position.y) * (y - element.position.y) < element.circular.radius * element.circular.radius)) { onMatch();};
    });
  };
});
