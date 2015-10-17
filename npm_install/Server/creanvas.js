define(['creanvas/serverBus', 'creanvas/modules'],
  function (serverBus, timer) {
  
  return function (callback) {
    serverBus.emit('addApplication', callback);
  };
});