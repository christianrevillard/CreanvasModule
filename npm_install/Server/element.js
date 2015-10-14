define(['creanvas/events'], function (events) {
  
  events.serverEvents.on("addElement", function (applicationEvents, elementData) {
    new Element(applicationEvents, elementData);
  });
  
  var Element = function (applicationEvents, elementData) {
    
    var self = this;
    self.x = elementData.x;
    self.y = elementData.y;
       
    applicationEvents.on("getNewFrame", function (dt) {
      
      self.x += dt * 200;
      self.y += dt * 100; 
      
      if (self.x > 400) {
        self.x = 0;
      }
      
      if (self.y > 400) {
        self.y = 0;
      }
      
      applicationEvents.emit('elementUpdated', self);
    });
  };
   
});