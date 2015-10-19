define(['creanvas/serverBus'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "addElement", 
    function (elementData) {
      // will need call back if the client needs the Id.
        new Element(appBus, elementData);
      });
  });
  
  var elementId = 0;
    
  var Element = function (appBus, element) {
    // some format, check ? 
    // TODO, just use as is for the moment.
    // how to pass condition some x=0 when x>400?

    element.id = element.id || (++elementId);

    // do we need this at all?  
    // any need for a lit of elements somewhere (in collision solver of course)   
   
    appBus.emit('elementAdded', element);
  };
});