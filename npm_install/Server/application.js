define(['creanvas/serverBus', 'creanvas/timer', 'creanvas/EventEmitter'],
  function (serverBus, timer, EventEmitter) {
  
  var refreshFrameRate = 2000;//40;
  var refreshClientRate = 2000;//40;
  
  serverBus.on('addApplication', function (callback) {
    callback(new Application());
  });
  
  var Application = function () {
    var appBus = new EventEmitter();
    appBus.id = 'App-' + (new Date().getTime() % 1000) + '-' + Math.round(1000 * Math.random());

    console.log('Create application', appBus.id);

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
    
    // extern API
    
    this.id = appBus.id;

    this.on = function () {
    //  console.log('forwarding on with args ', [].slice.apply(arguments))
      appBus.on([].slice.apply(arguments));
    }
    
    this.emit = function () {
    //  console.log('forwarding emit with args ', [].slice.apply(arguments))
      appBus.emit([].slice.apply(arguments));
    }
    
    this.connect = function (clientChannel) {
      console.log('Connecting client', appBus.id, clientChannel.id);
      clientChannel = clientChannel || new EventEmitter();
      clientChannel.id = clientChannel.id || 'Client-' + (new Date().getTime() % 1000) + '-' + Math.round(1000 * Math.random());

      console.log('emit event clientConnected')
      appBus.emit('clientConnected', clientChannel);
      return clientChannel;
    }
    
    this.addElement = function (elementData) {
      console.log('Adding element', appBus.id);
      appBus.emit("addElement", elementData);
    };
    
    this.dispose = function () {
      appBus.emit('dispose');
      appBus.removeAllListeners();
    };
    
    console.log('emit event applicationCreated')
    serverBus.emit('applicationCreated', appBus);
  };
});
