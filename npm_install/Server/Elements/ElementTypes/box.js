define(['creanvas/Core/serverBus'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "elementAdded", 
    function (element) {
        if (element.box) {
          box(appBus, element);
        }
      });
  });
  
  var box = function (appBus, element) {
    console.log('setting up box');
    
    element.on('isPointInElement', function (x, y, onMatch) {
      if (element.position && 
        (x>=element.position.x + element.box.left && x <= element.position.x + element.box.right && y >= element.position.y + element.box.top && y <= element.position.y + element.box.bottom)) { onMatch(); };
    });
  };
});
