define(['creanvas/serverBus', 'creanvas/elementList'], function (serverBus, elements) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "addElement", 
    function (element) {
        new ElementEventChecker(appBus, element);
      });
  });
  
  var ElementEventChecker = function (appBus, element) {
    
    appBus.on('checkElementEvent', function (event) {
      if (!element.position)
        return;
      
      if (event.element && ((event.element.position.z || -Infinity) >= (element.position.z || -Infinity)))
        return;
      
      // TODO isPointInElement    
      if (Math.sqrt((event.x - element.position.x) * (event.x - element.position.x) + (event.y - element.position.y) * (event.y - element.position.y)) < 100) {
        // console.log('(temp) event on element:', element.id, element.position.z);
        event.element = element;
      }
    });
  };
});
