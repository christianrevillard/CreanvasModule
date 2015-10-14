﻿define(['creanvas/events', 'creanvas/timer', 'creanvas/modules'],
  function (events, timer) {
  
  var elements = [];
  var refreshFrameRate = 40;
  var refreshClientRate = 40;
  
  var lastUpdateTime = timer.time;
  
  setInterval(
    function () {
      events.serverEvents.emit("getNewFrame", timer.time - lastUpdateTime);
      lastUpdateTime = timer.time;
    }, 
  refreshFrameRate);
  
  setInterval(
    function () {
      events.serverEvents.emit("updateClients");
    }, 
  refreshClientRate);
  
  return {
    getApplicationInstance: function (callback) {
      events.serverEvents.emit('addApplicationInstance', callback);    
    },
    events: events.serverEvents
  };
});