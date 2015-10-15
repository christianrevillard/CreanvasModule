define(['creanvas/events', 'creanvas/timer'],
  function (events, timer) {
  
  events.serverEvents.on('addApplication', function (callback) { callback(new Application()); });
  
  var Application = function () {
    var appEvents = this.events = events.newEmitter();
    
    var onGetNewFrame = function (dt) {
      appEvents.emit("getNewFrame", dt);
    };
    
    events.serverEvents.on('getNewFrame', onGetNewFrame);
    
    var onUpdateClients = function () {
      appEvents.emit("updateClients");
    };    
    events.serverEvents.on('updateClients', onUpdateClients);
    
    this.connect = function (clientChannel) {
      clientChannel = clientChannel || events.newEmitter();
      events.serverEvents.emit('clientConnected', appEvents, clientChannel);
      return clientChannel;
    }
    
    this.addElement = function (elementData) {      
      events.serverEvents.emit("addElement", appEvents, elementData);
    };
    
    this.dispose = function () {
      appEvents.removeAllListeners();
      events.serverEvents.removeListener('getNewFrame', onGetNewFrame);
      events.serverEvents.removeListener('updateClients', onUpdateClients);
    };
  };
});
