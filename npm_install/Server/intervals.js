// see later when it is needed or not
// if (typeof define !== 'function') { var define = require('amdefine')(module); }

intervals = [];

define(['creanvas/events'], function (events) {
  
  if (!events.serverEvents) {
    console.error('No events available here !');
    return;
  }
  
  console.log('Register event AddInterval');
  
  events.serverEvents.on("AddInterval", function (handler, time) {
    console.log('Adding an interval' + time);
    var handlerId = setInterval(handler, time);
    intervals.push(handlerId);
//    return handlerId;
  });
  

  //return {
  //  setInterval: function (handler, time) { 
  //    var handlerId = setInterval(handler, time); 
  //    intervals.push(handlerId);
  //    return handlerId;
  //  },
  //  clearIntervals: function () {
  //    intervals.forEach(function (handlerId) { 
  //      clearInterval(handlerId);
  //    });
  //    intervals = [];
  //  },
  //  clearInterval: function (handlerId) {
  //    clearInterval(handlerId);
  //    intervals = intervals.filter(function (hid) { return hid !== handlerId; });
  //  }
  //};
});