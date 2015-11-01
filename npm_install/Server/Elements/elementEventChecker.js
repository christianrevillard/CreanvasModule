define(['creanvas/Core/serverBus'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "elementAdded", 
    function (element) {
        elementEventChecker(appBus, element);
      });
  });
  
  var elementEventChecker = function (appBus, element) {
    
    appBus.addElementListener(element, 'checkElementEvent', function (event) {
      if (!element.position)
        return;
      
      // 'start' event, find by x,y
      if (event.eventId === 'pointerDown' || event.eventId === 'click' || event.eventId === 'doubleclick') {
        if (event.element && ((event.element.position.z || -Infinity) >= (element.position.z || -Infinity))) {
          // got a higher z already, matching for the actual x,y
          return;
        }
        
        if (element.isPointInElement(event.x, event.y)) {
          event.element = element;
        }
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
