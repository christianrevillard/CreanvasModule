define(['creanvas/events'], function (events) {
  
  events.serverEvents.on("clientConnected", function (appEvents, clientChannel) {
    new ClientUpdater(appEvents, clientChannel);
  });
  
  var ClientUpdater = function (appEvents, clientChannel) {
    
    var updatedElements = [];
       
    appEvents.on("elementUpdated", function (element) {
      updatedElements.push(element);
    });
    
    appEvents.on("updateClients", function () {
      clientChannel.emit('update', JSON.stringify(updatedElements));
      updatedElements = [];
    });
  };
});
