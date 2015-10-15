define(['creanvas/browserifiedEventEmitter'],
  function (browserEvents) {
  
  var isNode = (typeof module !== 'undefined' && module.exports);
  
  var EventEmitter = (isNode ? require('events'):browserEvents).EventEmitter
     
  return {
    serverEvents: new EventEmitter(),
    
    newEmitter: function () {
      var eventEmitter = new EventEmitter();
      eventEmitter.id = (new Date().getTime() % 1000) + '-' + Math.round(1000 * Math.random());
      return eventEmitter;
    }
  };
});
