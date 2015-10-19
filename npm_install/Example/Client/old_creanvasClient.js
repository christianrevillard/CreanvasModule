define([], function () {
  
  return function (eventsReceiver, canvas) {
    
    console.log('Setting up client ', canvas.id);
    
    var ctx = canvas.getContext("2d");
    ctx.font = "12px Arial";
        
    var elementTypes = [
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
    ];
    
       
    var drawElement = function (element) {
      
      if (!element.elementType)
        return;
      
      ctx.translate(element.x, element.y);
      ctx.rotate(element.angle || 0);
//      ctx.scale(element.scale.x || 1, element.scale.y || 1);
      
      ctx.beginPath();
      element.elementType.draw(ctx);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    };

    var currentMessage = "";    
    var elements = [];
    
    eventsReceiver.on('message', function (message) {
      currentMessage = message + '-'  + currentMessage;
      currentMessage = currentMessage.slice(0, 100);
     });
        
    eventsReceiver.on('elementsUpdated', function (data) {
      // TODO deleted
      JSON.parse(data).forEach(function (updatedElement) { 
        if (!elements.some(function (existing) {
          return existing.id == updatedElement.id;
        })) {
          elements.push(updatedElement);
        }
        var element = elements.filter(function (existing) {
          return existing.id == updatedElement.id;
        })[0];
        if (!element.elementType) {
          element.elementType = elementTypes.filter(function (type) { 
            return type.typeName == updatedElement.type;
          })[0];
        }
        element.x = updatedElement.position.x;
        element.y = updatedElement.position.y;
      });      
    });

    setInterval(
      function () {
        //draw
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();        
        ctx.fillText(currentMessage, 10, 10);
        
        elements.forEach(drawElement);
         
      }, 50);
  };
});
