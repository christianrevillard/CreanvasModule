define(['creanvas/serverBus'], function (serverBus) {
  
  console.log('register event applicationCreated');
  serverBus.on('applicationCreated', function (appBus) {
    console.log('register event clientConnected');
    appBus.on(
      "clientConnected", 
    function (clientChannel) {
        new ClientUpdater(appBus, clientChannel);
      });
  });
  
  var ClientUpdater = function (appBus, clientChannel) {
    console.log('Adding ClientUpdater', appBus.id, clientChannel.id);
    var updatedElements = [];
    
    var onElementUpdated = function (element) {
      updatedElements.push(element);
    };

    appBus.on("elementUpdated", onElementUpdated);
    
    var onUpdateClients = function () {
      console.log('updating clients: ' + updatedElements.length );
      if (updatedElements.length == 0) return;
      clientChannel.emit('update', JSON.stringify(updatedElements));
      updatedElements = [];
    };

    appBus.on("updateClients", onUpdateClients);
    
    clientChannel.on('disconnect', function () {
      appBus.removeListener("elementUpdated", onElementUpdated);
      appBus.removeListener("updateClients", onUpdateClients);
    });
  };
});
