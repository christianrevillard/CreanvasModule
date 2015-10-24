define(['creanvas/Core/serverBus'], function (serverBus) {
  
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
      
      // 'start' event, find by x,y
      if (event.eventId === 'pointerDown' || event.eventId === 'click' || event.eventId === 'doubleclick') {
        if (event.element && ((event.element.position.z || -Infinity) >= (element.position.z || -Infinity))) {
          // got a higher z already, matching for the actual x,y
          return;
        }
        
        appBus.emit('isPointInElement' + element.id, event.x, event.y, function (result) {
          if (result) {
            event.element = element;
          }
        });
      } 
      // 'continue'/'stop' event, find by touchidentifier. pointerUp, pointerMove
      else  {
        if (element.touchIdentifier === event.touchIdentifier) {
          event.element = element;
        }
      }
    });
  };
});
