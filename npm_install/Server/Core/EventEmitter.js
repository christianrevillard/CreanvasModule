define(['creanvas/Core/browserifiedEventEmitter'],
  function (browserEvents) {
  
  var isNode = (typeof module !== 'undefined' && module.exports);
  
  var EventEmitter = (isNode ? require('events'):browserEvents).EventEmitter
  
  return EventEmitter;
});
