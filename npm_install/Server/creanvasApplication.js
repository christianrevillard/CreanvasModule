define(['creanvas/events', 'creanvas/timer'],
  function (events, timer) {
  
  events.commands.on('addApplication', function (callback) { callback(new Application()); });
  
  var Application = function () {
    var appEvents = this.events = events.newEmitter();
        
    events.commands.emit('appCommand', 'getNewFrame', appEvents, function (dt) {
      appEvents.emit("getNewFrame", dt);
    });
    
    events.commands.emit('appCommand', 'updateClients', appEvents, function (dt) {
      appEvents.emit("updateClients", dt);
    });
    
    this.connect = function (clientChannel) {
      clientChannel = clientChannel || events.newEmitter();
      events.commands.emit('clientConnected', appEvents, clientChannel);
      return clientChannel;
    }
    
    this.sendMessage = function (message) { 
      appEvents.emit("emit", message);
    };
    
    this.addElement = function (elementData) {      
      events.commands.emit("addElement", appEvents, elementData);
    };
    
    this.dispose = function () {
      appEvents.emit('dispose');
      appEvents.removeAllListeners();
    };
  };
});
