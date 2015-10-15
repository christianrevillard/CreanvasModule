define(['creanvas/events'], function (events) {
  
  events.serverEvents.on(
    "clientConnected", 
    function (appEvents, clientChannel) {
      new ClientUpdater(appEvents, clientChannel);
    });
  
  var ClientUpdater = function (appEvents, clientChannel) {
    var updatedElements = [];
    
    var onElementUpdated = function (element) { updatedElements.push(element); };
    appEvents.on("elementUpdated", onElementUpdated);
    
    var onUpdateClients = function () {
      if (updatedElements.length == 0) return;
      clientChannel.emit('update', JSON.stringify(updatedElements));
      updatedElements = [];
    };
    appEvents.on("updateClients", onUpdateClients);
    
    clientChannel.on('disconnect', function () {
      console.log('Client disconnected, remove listeners.');
      appEvents.removeListener("elementUpdated", onElementUpdated);
      appEvents.removeListener("updateClients", onUpdateClients);
    });
  };
});
