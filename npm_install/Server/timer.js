define(
  ['creanvas/events'],
  function (events) {
    
    var timer = {
      paused: false,
      timeScale: 1,
      time: 0
    };
    
    setInterval(
      function () {
        if (timer.paused)
          return;
        timer.time += 10 * timer.timeScale / 1000;
      }, 10);
    
    return timer;
  });


