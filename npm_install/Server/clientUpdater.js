define(['creanvas/serverBus'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "clientConnected", 
    function (clientChannel) {
        new ClientUpdater(appBus, clientChannel);
      });
  });
  
  var ClientUpdater = function (appBus, clientChannel) {
    var updatedElements = [];
    
    var onElementUpdated = function (element) {
      updatedElements.push({
        id: element.id,
        type: element.type,
        x: element.position.x,
        y: element.position.y,        
        z: element.position.z,
        angle: element.position.angle
      });
    };
    
    appBus.on("elementUpdated", onElementUpdated);
    
    var onUpdateClients = function () {
      if (updatedElements.length == 0) return;
      clientChannel.emit('elementsUpdated', JSON.stringify(updatedElements));
      updatedElements = [];
    };
    
    appBus.on("updateClients", onUpdateClients);
    
    clientChannel.on('disconnect', function () {
      appBus.removeListener("elementUpdated", onElementUpdated);
      appBus.removeListener("updateClients", onUpdateClients);
    });
  };
});
