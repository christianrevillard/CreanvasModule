define(['creanvas/events', 'creanvas/timer', 'creanvas/modules'],
  function (events, timer) {
  
  var elements = [];
  var refreshFrameRate = 2000;//40;
  var refreshClientRate =2000;//40;
  
  var lastUpdateTime = timer.time;
  
  setInterval(
    function () {
      events.commands.emit("getNewFrame", timer.time - lastUpdateTime);
      lastUpdateTime = timer.time;
    }, 
  refreshFrameRate);
  
  setInterval(
    function () {
      events.commands.emit("updateClients");
    }, 
  refreshClientRate);
  
  return function (callback) {
    events.commands.emit('addApplication', callback);
  };
});