define(['../../Client/creanvasClient'], function (creanvasClient) {
  
  return function (clientChannel, canvas) {
     
    clientChannel.on('applicationParameters', function (parameters) {
      creanvasClient({
        clientChannel: clientChannel, 
        canvas: canvas,
        left: parameters.left,
        right: parameters.right,
        top: parameters.top,
        bottom: parameters.bottom,
        elementTypes: [
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
        background: function (context) {
          context.fillStyle = "#EEE";
          context.fillRect(-795, -495, 1590, 990);
        }
      });
    });
  };
});
