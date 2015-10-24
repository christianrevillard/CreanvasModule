define(['creanvas/Core/serverBus'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "addElement", 
    function (element) {
        new ElementBorderChecker(appBus, element);
      });
  });
  
  var ElementBorderChecker = function (appBus, element) {
    
    appBus.on('isPointInElement' + element.id, function (x,y, callback) {
      // TODO for real, with different element classes.
      callback(element.position && ((x - element.position.x) * (x - element.position.x) + (y - element.position.y) * (y - element.position.y) < 100 * 100));
    });
  }; 
});
