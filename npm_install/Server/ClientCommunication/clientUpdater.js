define(['creanvas/Core/serverBus'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus) {
    
    var updatedElements = [];

    appBus.on(
      "elementAdded", 
    function (element) {        
        element.on("elementUpdated", function () {
          
          updatedElements = updatedElements.filter(function (existing) { return existing.id !== element.id });
          
          updatedElements.push({
            id: element.id,
            type: element.type,
            x: element.position.x,
            y: element.position.y,        
            z: element.position.z,
            angle: element.position.angle
          });
        });
        
        element.on("dispose", function () {
          updatedElements = updatedElements.filter(function (existing) { return existing.id !== element.id });
          
          updatedElements.push({
            id: element.id,
            deleted: true
          });
        });
      });    
    
    appBus.on(
      "clientConnected", 
    function (clientChannel) {
        
        var onUpdateClients = function () {
          if (updatedElements.length == 0) return;
          clientChannel.clientSide.emit('elementsUpdated', JSON.stringify(updatedElements));
          updatedElements = [];
        };
        
        appBus.on("updateClients", onUpdateClients);
        
        clientChannel.clientSide.on('disconnect', function () {
          appBus.removeListener("updateClients", onUpdateClients);
        });
      });
  });
});
