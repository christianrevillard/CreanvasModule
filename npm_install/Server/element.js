define(['creanvas/serverBus'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "addElement", 
    function (elementData) {
      // will need call back if the client needs the Id.
        new Element(appBus, elementData);
      });
  });
  
  var Element = function (appBus, element) {
    // some format, check ? 
    // TODO, just use as is for the moment.
    console.log('Adding element:', element.id);

    appBus.emit('elementAdded', element);    
  };
});