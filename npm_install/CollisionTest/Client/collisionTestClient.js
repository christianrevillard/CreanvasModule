﻿define(['../../Client/creanvasClient'], function (creanvasClient) {
  
  return function (clientChannel, canvas) {
    creanvasClient({
      clientChannel: clientChannel, 
      canvas: canvas,
      left: -800,
      right: 800,
      top: -500,
      bottom: 500,
      elementTypes: [
        {
          typeName: 'Horizontal',
          draw: function (context) {
            context.moveTo(-800, -5);
            context.lineTo(800, -5);
            context.lineTo(800, 5);
            context.lineTo(-800, 5);
            context.lineTo(-800, -5);
            context.fillStyle = "#000";
            context.fill();
          }
        },
        {
          typeName: 'Vertical',
          draw: function (context) {
            context.moveTo(-5, -500);
            context.lineTo(5, -500);
            context.lineTo(5, 500);
            context.lineTo(-5, 500);
            context.lineTo(-5, -500);
            context.fillStyle = "#000";
            context.fill();
          }
        },

        {
          typeName: 'O',
          draw: function (context, el) {
            var color1, color2;
            if (this.dropZone) {
              color1 = "#88F";
              color2 = "#FFF";
            }
            else {
              color1 = "#AAF";
              color2 = "#DDD";
            }
            context.moveTo(0, 0);
            context.lineTo(el.circularRadius * el.scale, 0);
            context.arc(0, 0, el.circularRadius * el.scale, 0, 6);
            context.lineTo(0, 0);
            var gradient = context.createRadialGradient(0, 0, 45, -20, -20, 3);
            gradient.addColorStop(0.0, color1);
            gradient.addColorStop(1.0, color2);
            context.fillStyle = gradient;
            context.fill();
          }
        },
        {
          typeName: 'Poly',
          draw: function (context, el) {
            
            if (!el.vertices)
              return;

            var color1, color2;
            if (this.dropZone) {
              color1 = "#88F";
              color2 = "#FFF";
            }
            else {
              color1 = "#AAF";
              color2 = "#DDD";
            }
            context.scale(el.scale, el.scale);
            context.moveTo(el.vertices[el.vertices.length - 1][0], el.vertices[el.vertices.length - 1][1]);
            el.vertices.forEach(function (v) {
              context.lineTo(v[0], v[1]);
            });
            
            var gradient = context.createRadialGradient(0, 0, 45, -20 , -20, 3);
            gradient.addColorStop(0.0, color1);
            gradient.addColorStop(1.0, color2);
            context.fillStyle = gradient;
            context.fill();
          }
        },
        {
          typeName: 'HeavyNone',
          draw: function (context, el) {
            var color1, color2;
            if (this.dropZone) {
              color1 = "#8F8";
              color2 = "#FFF";
            }
            else {
              color1 = "#AFA";
              color2 = "#DDD";
            }
            context.moveTo(0, 0);
            context.lineTo(el.circularRadius * el.scale, 0);
            context.arc(0, 0, el.circularRadius * el.scale, 0, 6);
            context.lineTo(0, 0);
            var gradient = context.createRadialGradient(0, 0, 45, -20 , -20, 3);
            gradient.addColorStop(0.0, color1);
            gradient.addColorStop(1.0, color2);
            context.fillStyle = gradient;
            context.fill();
          }
        },
        {
          typeName: 'HeavyKeep',
          draw: function (context, el) {
            var color1, color2;
            if (this.dropZone) {
              color1 = "#88F";
              color2 = "#FFF";
            }
            else {
              color1 = "#FAA";
              color2 = "#DDD";
            }
            context.moveTo(0, 0);
            context.lineTo(el.circularRadius * el.scale, 0);
            context.arc(0, 0, el.circularRadius * el.scale, 0, 6);
            context.lineTo(0, 0);
            var gradient = context.createRadialGradient(0, 0, 45, -20 , -20, 3);
            gradient.addColorStop(0.0, color1);
            gradient.addColorStop(1.0, color2);
            context.fillStyle = gradient;
            context.fill();
          }
        }

      ],
      background: function (context) {
        context.fillStyle = "#EEE";
        context.fillRect(-795, -495, 1590, 990);
      }
    });
  };
});
