define(['creanvas/serverBus', 'creanvas/timer', 'creanvas/EventEmitter', 'creanvas/modules'],
  function (serverBus, timer, EventEmitter) {
  
  var refreshFrameRate = 2000;//40;
  var refreshClientRate = 2000;//40;
  
  var nextAppId = 1;
  
  var Application = function () {
    var appBus = new EventEmitter();
    var nextClientId = 1;
    
    appBus.id = 'App-' + (nextAppId++);
    
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
      clientChannel = clientChannel || new EventEmitter();
      
      clientChannel.id = clientChannel.id || (appBus.id + '-Client-' + (nextClientId++));
      
      appBus.emit('clientConnected', clientChannel);
      return clientChannel;
    }
    
    this.addElement = function (elementData) {
      appBus.emit("addElement", elementData);
    };
    
    this.dispose = function () {
      appBus.emit('dispose');
      appBus.removeAllListeners();
    };
    
    serverBus.emit('applicationCreated', appBus);
  };
  
  return function () {
    return new Application();
  }
});
