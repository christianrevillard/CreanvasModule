define(['../../Client/creanvasClient'], function (creanvasClient) {
  
  return function (clientChannel, canvas) {
    
    var messages = [];
    
    var ctx = canvas.getContext("2d");
    ctx.font = "10px Arial";
    
    var drawX = function (context, color1, color2) {
      context.lineCap = 'round';
      context.lineWidth = 0.04;
      context.moveTo(-0.50, -0.50);
      context.bezierCurveTo(0.50, 0, 0, 0.50, 0.50, 0.50);
      context.moveTo(-0.50, 0.50);
      context.bezierCurveTo(-0.20, 0, 0.30, -0.25, 0.50, -0.50);
      var gradient = context.createLinearGradient(-0.45, -0.30, 0.55, 0.60);
      gradient.addColorStop(0.0, color1);
      gradient.addColorStop(1.0, color2);
      context.strokeStyle = gradient;
      context.stroke();
    };
    
    var drawO = function (context, color1, color2) {
      context.arc(0, 0, 0.50, 0, 2 * Math.PI);
      var gradient = context.createRadialGradient(0, 0, 0.45, -0.10, -0.05, 0.03);
      gradient.addColorStop(0.0, color1);
      gradient.addColorStop(1.0, color2);
      context.fillStyle = gradient;
      context.fill();
    };

    creanvasClient({
      clientChannel: clientChannel, 
      canvas: canvas,
      left: 0,
      right: 5,
      top: 0,
      bottom: 3,
      elementTypes: [
        {
          typeName: "X",
          draw: function (context) {
            drawX(context, "#D22", "#600");
          }
        },
        {
          typeName: "X-Empty",
          draw: function (context) {
            drawX(context, "#EEE", "#CCC");
          }
        },
        {
          typeName: "cell",
          draw: function (context) {
            context.fillStyle = "#BBB";
            context.fillRect(-0.4, -0.4, 0.8, 0.8);
          }
        },
        {
          typeName: 'O',
          draw: function (context) {
            drawO(context, "#88F", "#FFF");
          }
        },
        {
          typeName: 'O-Empty',
          draw: function (context) {
            drawO(context, "#CCC", "#EEE");
          }
        }

      ],
      onUnscaledDraw: function (context) {
        context.beginPath();
        context.fillStyle = "black";
        context.fillText(messages.toString(), 50, 50);
      },
      background: function (context) {
        context.fillStyle = "#EEE";
        context.fillRect(0, 0, 5, 3);
      }
    });
    
    clientChannel.on('message', function (message) {
      messages.unshift(message);
      setTimeout(function () { messages.pop(); }, 5000);
    });
  };
});
