define(['creanvas/Core/serverBus', 'creanvas/Core/timer', 'creanvas/Core/EventEmitter', 'creanvas/Core/modules'],
  function (serverBus, timer, EventEmitter) {
  
  var refreshFrameRate = 40;
  var refreshClientRate = 40;
  
  var appId = 0;
  
  var Application = function () {
    var appBus = new EventEmitter();
    appBus.setMaxListeners(0);
    
    appBus.id = 'App-' + (++appId);
    
    var lastUpdateTime = timer.time;
    
    setInterval(
      function () {
        appBus.emit("getNewFrame", timer.time - lastUpdateTime);
        lastUpdateTime = timer.time;
      }, 
  refreshFrameRate);
    
    setInterval(
      function () {
        appBus.emit("updateClients");
      }, 
  refreshClientRate);
    
    // extern interface
    
    this.id = appBus.id;
    
    this.on = function () {
      appBus.on.apply(appBus, [].slice.apply(arguments));
    }
    
    this.emit = function () {
      appBus.emit.apply(appBus, [].slice.apply(arguments));
    }
    
    this.connect = function (clientChannel) {
      
      appBus.emit('connectClient', clientChannel);
      return clientChannel;
    }
    
    this.addElement = function (elementData) {
      appBus.emit("addElement", elementData);
    };
    
    this.dispose = function () {
      appBus.emit('dispose');
      appBus.removeAllListeners();
    };
    
    appBus.addClientChannelListener = function (clientChannel, event, handler) {
      appBus.on(event, handler);
      clientChannel.on('disconnect', function () { 
        appBus.removeListener(event, handler);
      });
    };
    
    appBus.addElementListener = function (element, event, handler) {
      appBus.on(event, handler);
      element.on('dispose', function () {
        appBus.removeListener(event, handler);
      });
    };
   
    serverBus.emit('applicationCreated', appBus);
  };
  
  return function () {
    return new Application();
  }
});
