define(['creanvas/Core/serverBus'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "elementAdded", 
    function (element) {
        if (element.generator) {
          generator(appBus, element);
        }
      });
  });
  
  var generator = function (appBus, element) {
    
    var childCount = 0;
    var maxChildCount = element.generator.maxCount || Infinity;   
    
    element.on('elementEvent', function (event) {
      
      if (childCount >= maxChildCount)
        return;
      
      if (event.eventId === 'pointerDown') {
        var newElement = new element.generator.Child(element);
        newElement.id = element.id + '-child-' + (++childCount);
        
        appBus.emit('addElement', newElement);
        newElement.emit('elementEvent', { eventId: 'pointerDown', touchIdentifier: element.touchIdentifier });
        element.emit('elementEvent', { eventId: 'pointerUp' });
        
        if (childCount === maxChildCount) { 
          element.emit('generatorEmpty');
        }
      }
    });
  };
});
