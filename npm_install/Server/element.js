define(['creanvas/events'], function (events) {
  
  events.commands.on("addElement", function (appEvents, elementData) {
    new Element(appEvents, elementData);
  });
  
  var Element = function (appEvents, elementData) {
    
    var self = this;
    self.x = elementData.x;
    self.y = elementData.y;
       
    appEvents.on("getNewFrame", function (dt) {
      
     // console.log('update element for appId', appEvents.id, dt.toFixed(2));
     // console.log('new position for appId', appEvents.id, self.x.toFixed(2), self.y.toFixed(2));

      self.x += dt * 200 / 10;
      self.y += dt * 100 / 10; 
      
      if (self.x > 400) {
        self.x = 0;
      }
      
      if (self.y > 400) {
        self.y = 0;
      }
      
      appEvents.emit('elementUpdated', self);
    });
  };
   
});