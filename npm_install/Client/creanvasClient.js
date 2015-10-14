define([], function () {
  
  return function (eventsReceiver, canvas) {
    
    console.log('Setting up client ', canvas.id, eventsReceiver.id);
        
    eventsReceiver.on('update', function (data) {
      var elements = JSON.parse(data);
      
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.beginPath();
      
      elements.forEach(
        function (element) {
          ctx.beginPath();
          ctx.arc(element.x, element.y, 50, 0, 2 * Math.PI);
          ctx.stroke();
        });
    });
  };
});
