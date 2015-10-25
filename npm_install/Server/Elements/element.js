define(['creanvas/Core/serverBus', 'creanvas/Core/EventEmitter'], function (serverBus, EventEmitter) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "addElement", 
    function (elementData) {
        setUpElement(appBus, elementData);
      });
  });
  
  var setUpElement = function (appBus, element) {
    
    element.position = element.position || {};
    element.position.x = element.position.x || 0;
    element.position.y = element.position.y || 0;
    element.position.z = element.position.z || 0;
    element.position.angle = element.position.angle || 0;

    element.elementBus = new EventEmitter();

    element.on = function () {
      element.elementBus.on.apply(element.elementBus, [].slice.apply(arguments));
    }
    
    element.emit = function () {
      element.elementBus.emit.apply(element.elementBus, [].slice.apply(arguments));
    }
    
    element.on('dispose', function () {
      element.elementBus.removeAllListeners();
    });
    
    appBus.addElementListener(element, 'dispose', function () { 
      element.elementBus.emit('dispose');
    });
        
    if (element.events) {
      
      for (var eventId in element.events) {
        if (element.events.hasOwnProperty(eventId)) {
          element.on(eventId, element.events[eventId]);
        }
      }
    }

    appBus.addElementListener(element, 'clientConnected', function () {
      element.emit('elementUpdated');
    });

    appBus.emit('elementAdded', element);
    
    element.emit('elementUpdated');
  };
});