// to be required by the application specific client
// the client will pass a list of element types.
// move out of example, is common code !

var DEBUG = true;


define(function () {
  
  // parameters: clientChannel, canvas, elementTypes, onDraw
  // ?? refreshTime, log, 
  
  return function (parameters) {
    var clientToServerBuffering = 20;
    var emitBuffer = [];
    
    var refreshTime = parameters['refreshTime'] || 40;
    var canvas = parameters['canvas'];
    var context = canvas.getContext("2d");
    var logger = parameters['log'];//|| console.log; illegal invocation trouble
    var clientChannel = parameters["clientChannel"];
    var elementTypes = parameters.elementTypes;
    
    
    context.setTransform(1, 0, 0, 1, 0, 0); //context.setTransform(self.lengthScale, 0, 0, self.lengthScale, 0, 0);
    
    
    
    var needRedraw = true;
    var isDrawing = false;
    var elements = [];
    
    var emitToServer = function (action, actionData, overrideActionKey) {
      if (overrideActionKey) {
        emitBuffer = emitBuffer.filter(function (e) { return e.overrideActionKey != overrideActionKey; });
      }
      
      emitBuffer.push({ action: action, actionData: actionData, overrideActionKey: overrideActionKey });
    };
    
        
    var addBackground = function (draw) {
      removeElementById(0);
      
      if (DEBUG) logMessage('Adding background');
      
      draw = draw || function (context) {
        context.fillStyle = "#FFF";
        context.fillRect(0, 0, canvas.width, canvas.height);
      };
      
      var background = elements.push({
        'id': 0,
        'name': 'background',
        'elementType': { draw: draw },
        'x': 0, 
        'y': 0, 
        'z': -Infinity
      });
    };
    
    var logMessage = function (logData) {
      if (logger)
        logger(logData);
    };
    
    var removeElementById = function (id) {
      elements = elements.filter(function (e) { return e.id != id; });
    };
    
    var triggerElementEvent = function (eventId, event) {
      
      emitToServer(
        'pointerEvent', 
			{
          "eventId": eventId, 
          "x": event.x,
          "y": event.y,
          "touchIdentifier": event.touchIdentifier
        },
			eventId + ':' + event.touchIdentifier);
    };
    
    var registerCanvasPointerEvent = function (controlEventId, customEventId) {
      
      canvas.addEventListener(controlEventId,
			function (event) {
        setTimeout(function () {
          var triggerEvent = function (clientXY, touchIdentifier) {
            if (DEBUG) {
              logMessage("Canvas event " + controlEventId + " with touchIdentifier " + touchIdentifier);
            }
            var eventData = getRealXYFromClientXY(clientXY);
            eventData.touchIdentifier = touchIdentifier;
            triggerElementEvent(customEventId, eventData);
          };
          
          if (event.changedTouches) {
            for (var i = 0; i < event.changedTouches.length; i++) {
              triggerEvent(event.changedTouches[i], event.changedTouches[i].identifier);
            }
          }
          else {
            triggerEvent(event, -1);
          }
        });
      });
    };
    
    getRealXYFromClientXY = function (clientXY) {
      var boundings = canvas.getBoundingClientRect();
      
      var xy = {
        x: (clientXY.clientX - boundings.left) * canvas.width / boundings.width,
        y: (clientXY.clientY - boundings.top) * canvas.height / boundings.height
      };
      
      return xy;
    };
    
    // x,y in Real values
    isPointInPath = function (x, y) {
      // convert to Canvas XY
      return context.isPointInPath(x, y);

//      return context.isPointInPath(x * this.lengthScale, y * this.lengthScale);
    };
    
    
    
    
    
    
    
    
    
    
    
    registerCanvasPointerEvent('click', 'click');
    registerCanvasPointerEvent('mousedown', 'pointerDown');
    registerCanvasPointerEvent('touchstart', 'pointerDown');
    registerCanvasPointerEvent('mousemove', 'pointerMove');
    registerCanvasPointerEvent('touchmove', 'pointerMove');
    registerCanvasPointerEvent('mouseup', 'pointerUp');
    registerCanvasPointerEvent('touchend', 'pointerUp');
    
    
    
    setInterval(
      function () {
        if (emitBuffer.length == 0)
          return;
        
        emitBuffer.forEach(function (e) {
          
          parameters.clientChannel.emit(
            e.action, 
						JSON.stringify(e.actionData));
          
          emitBuffer = [];
        });
      },
			clientToServerBuffering);
    
    var drawElement = function (element) {
            
      if (!element.elementType)
        return;
            
      context.translate(element.x, element.y);
      context.rotate(element.angle || 0);
      //      ctx.scale(element.scale.x || 1, element.scale.y || 1);
      
      context.beginPath();
      element.elementType.draw(context);
      context.setTransform(1, 0, 0, 1, 0, 0);
    };
    
    
    setInterval(
      function () {
        if (needRedraw && !isDrawing) {
          isDrawing = true;
          
          elements
						.sort(function (a, b) { return ((a.z || 0) - (b.z || 0)); })
						.forEach(drawElement);
          
          if (parameters.onDraw) {
            parameters.onDraw(context);
          }
          
          isDrawing = false;
        }
        else {
          if (DEBUG) logMessage("No redraw");
        }
      },
			refreshTime);
    
    
    clientChannel.on('elementsUpdated', function (msg) {
      var data = JSON.parse(msg);
            
      data.forEach(function (updated) {
        var els = elements.filter(function (e) { return e.id == updated.id; });
        
        if (els.length > 0) {
          // updates			
          var el = els[0];
          el.x = updated["x"] === undefined?el.x:updated["x"];
          el.y = updated["y"] === undefined?el.y:updated["y"];
          el.z = updated["z"] === undefined?el.z:updated["z"];
     //     el.scale.x = updated["scaleX"] === undefined?el.scale.x:updated["scaleX"];
       //   el.scale.y = updated["scaleY"] === undefined?el.scale.y:updated["scaleY"];
          el.angle = updated["angle"] === undefined?el.angle:updated["angle"];
          
          if (updated.type && (!el.elementType || el.elementType.typeName != updated.type)) {
            el.elementType = elementTypes.filter(function (e) { return e.typeName == updated.type; })[0];
          }
        }
        else {
          //inserts
          updated.elementType = elementTypes.filter(function (e) { return e.typeName == updated.type; })[0];
          elements.push({
            id: updated.id,
            x: updated["x"],
            y: updated["y"],
            z: updated["z"],
            //el.scale.x = updated["scaleX"] === undefined?el.scale.x:updated["scaleX"];
            //el.scale.y = updated["scaleY"] === undefined?el.scale.y:updated["scaleY"];
            angle: updated["angle"],
            elementType: updated.type ? elementTypes.filter(function (e) { return e.typeName == updated.type; })[0]:null
          });
        }
      });
      
      //data.deletes.forEach(function (deleted) {
      //  removeElementById(deleted.id);
      //});
      
      needRedraw = true;
    });
    
    addBackground(null);
  };
});




