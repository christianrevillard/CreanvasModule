define(['creanvas/Core/serverBus'], function (serverBus) {
  
  // todo log levels to avoid comment in/out !
  
  serverBus.on('applicationCreated', function (appBus) {
    console.log('applicationCreated', appBus.id);
    
   // appBus.on("getNewFrame", function () { console.log('getNewFrame', appBus.id); });
  
  //  appBus.on("updateElements", function (elements) { console.log('updateElements', appBus.id, JSON.parse(elements).length); });
        
    appBus.on("addElement", function () { console.log('addElement', appBus.id); });
  
    appBus.on("dispose", function () { console.log('dispose', appBus.id); });

    appBus.on("sendMessage", function () { console.log('sendMessage', appBus.id); });
    
    appBus.on("broadcastMessage", function (fromClientId) { console.log('broadcastMessage', appBus.id, fromClientId); });

    appBus.on("elementAdded", function () { console.log('elementAdded', appBus.id); });
    
   // appBus.on("elementUpdated", function () { console.log('elementUpdated', appBus.id); });
    
    appBus.on("elementEvent", function (event, element) { console.log('elementEvent', appBus.id, event.eventId, element.id); });
        
    appBus.on("clientConnected", function (clientChannel) {
      console.log('clientConnected', appBus.id, clientChannel.id);
      
      clientChannel.clientSide.on("disconnect", function () { console.log('disconnect', appBus.id, clientChannel.id); });
     });
  });
});
