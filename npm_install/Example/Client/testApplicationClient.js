define(['../../Client/creanvasClient'], function (creanvasClient) {
  
  return function (clientChannel, canvas) {
    
    var currentMessage = "";
        
    var ctx = canvas.getContext("2d");
    ctx.font = "12px Arial";
    
    creanvasClient({
      clientChannel: clientChannel, 
      canvas: canvas,
      elementTypes: [
        {
          typeName: "X",
          draw: function (context) {
            var color1, color2;
            if (this.dropZone) {
              color1 = "#D22";
              color2 = "#600";
            }
            else {
              color1 = "#F44";
              color2 = "#900";
            }
            context.lineCap = 'round';
            context.lineWidth = 40;
            context.moveTo(-50, -50);
            context.bezierCurveTo(50, 0, 0, 50, 50, 50);
            context.moveTo(-50, 50);
            context.bezierCurveTo(-20, 0, 30, -25, 50, -50);
            var gradient = context.createLinearGradient(-45, -30, 55, 60);
            gradient.addColorStop(0.0, color1);
            gradient.addColorStop(1.0, color2);
            context.strokeStyle = gradient;
            context.stroke();
            context.moveTo(-50, -50);
            context.lineTo(50, -50);
            context.moveTo(50, 50);
            context.lineTo(-50, 50);
            
            context.arc(0, 0, 50, 0, 2 * Math.PI);
          },
          boxData: { width: 150, height: 150 }
        },
        {
          typeName: 'O',
          draw: function (context) {
            var color1, color2;
            if (this.dropZone) {
              color1 = "#88F";
              color2 = "#FFF";
            }
            else {
              color1 = "#AAF";
              color2 = "#DDD";
            }
            context.arc(0, 0, 50, 0, 2 * Math.PI);
            var gradient = context.createRadialGradient(0, 0, 45, -10, -5, 3);
            gradient.addColorStop(0.0, color1);
            gradient.addColorStop(1.0, color2);
            context.fillStyle = gradient;
            context.fill();
          },
          boxData: { width: 150, height: 150 }
        }
      ],
      onDraw: function (){
        ctx.beginPath();
        ctx.fillText(currentMessage, 10, 10);
      }
    });    
    
    clientChannel.on('message', function (message) {
      currentMessage = message + '-'  + currentMessage;
      currentMessage = currentMessage.slice(0, 100);
     });
  };
});
