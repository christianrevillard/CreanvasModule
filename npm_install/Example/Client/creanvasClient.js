define([], function () {
  
  return function (eventsReceiver, canvas) {
    
    console.log('Setting up client ', canvas.id);
    
    var ctx = canvas.getContext("2d");
    ctx.font = "12px Arial";
    
    var currentMessage = "";    
    
    eventsReceiver.on('message', function (message) {
      currentMessage = message + '-'  + currentMessage;
      currentMessage = currentMessage.slice(0, 100);
     });
        
    eventsReceiver.on('elementsUpdated', function (data) {
      var elements = JSON.parse(data);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.beginPath();
      
      ctx.fillText(currentMessage, 10, 10);
 
      elements.forEach(
        function (element) {
          ctx.beginPath();
          ctx.arc(element.x, element.y, 10, 0, 2 * Math.PI);
          ctx.stroke();
        });
    });
  };
});
