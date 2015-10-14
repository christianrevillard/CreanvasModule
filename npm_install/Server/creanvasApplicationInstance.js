define(['creanvas/events'],
  function (events) {
  
  events.serverEvents.on('addApplicationInstance', function (callback) {
    var instance = new ApplicationInstance();
    if (callback) { 
      callback(instance);
    }
  });

  var ApplicationInstance = function () {
    self = this;

    var applicationInstanceEvents = events.getNew();
    
    var connections = 0;

    events.serverEvents.on('getNewFrame', function (dt) {
      applicationInstanceEvents.emit("getNewFrame", dt);
    });
        
    events.serverEvents.on('updateClients', function () {
      applicationInstanceEvents.emit("updateClients");
    });
    
    this.connect = function (eventsOut) {
      if (!eventsOut)
        eventsOut = events.getNew();
      
      connections++;
      eventsOut.on('disconnect', function () {
        connections--;
        if (connections == 0) {
          console.log('Everybody is out, should dispose events');
        }
      });
      events.serverEvents.emit('clientConnected', applicationInstanceEvents, eventsOut);
      
      return eventsOut;
    }

    this.events = applicationInstanceEvents;

    this.addElement = function (elementData) { 
      events.serverEvents.emit("addElement", applicationInstanceEvents, elementData);
    };
  };
});