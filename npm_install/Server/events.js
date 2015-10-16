define(['creanvas/browserifiedEventEmitter'],
  function (browserEvents) {
  
  var isNode = (typeof module !== 'undefined' && module.exports);
  
  var EventEmitter = (isNode ? require('events'):browserEvents).EventEmitter
  
  var commands = new EventEmitter()
  
  commands.on('appCommand', 
  function (command, appEvents, handler) {
    commands.on(command, handler);
    appEvents.on("dispose", function () {
      console.log('Dispose called, remove an appCommand')
      commands.removeListener(command, handler);
    });
  });

  return {
    commands: commands,
    
    // needed as method? can evetn be used? will need a callback... any point? need a value...
    newEmitter: function () {
      var eventEmitter = new EventEmitter();
      eventEmitter.id = (new Date().getTime() % 1000) + '-' + Math.round(1000 * Math.random());
      return eventEmitter;
    },
  };
});
