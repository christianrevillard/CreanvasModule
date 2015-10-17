define(['creanvas/serverBus'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "addElement", 
    function (elementData) {
        new Element(appBus, elementData);
      });
  });
  
  var Element = function (appBus, elementData) {
    
    console.log('Element - Adding Element', appBus.id);
    
    var self = this;
    self.x = elementData.x;
    self.y = elementData.y;
    
    appBus.on("getNewFrame", function (dt) {
      
      self.x += dt * 200 / 10;
      self.y += dt * 100 / 10;
      
      if (self.x > 400) {
        self.x = 0;
      }
      
      if (self.y > 400) {
        self.y = 0;
      }
      
      console.log('element is now updated');
      appBus.emit('elementUpdated', self);
    });
  };
});