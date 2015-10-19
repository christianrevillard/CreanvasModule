//// put together events stuff

//define(function () {
  
  
//  registerCanvasPointerEvent = function (controlEventId, customEventId) {
//    var self = this;
    
//    self.context.canvas.addEventListener(controlEventId,
//			function (event) {
//      setTimeout(function () {
//        var triggerEvent = function (clientXY, touchIdentifier) {
//          if (DEBUG) {
//            self.logMessage("Canvas event " + controlEventId + " with touchIdentifier " + touchIdentifier);
//          }
//          var eventData = self.getRealXYFromClientXY(clientXY);
//          eventData.touchIdentifier = touchIdentifier;
//          self.triggerElementEvent.call(self, customEventId, eventData);
//        };
        
//        if (event.changedTouches) {
//          for (var i = 0; i < event.changedTouches.length; i++) {
//            triggerEvent(event.changedTouches[i], event.changedTouches[i].identifier);
//          }
//        }
//        else {
//          triggerEvent(event, -1);
//        }
//      });
//    });
//  };
  
  
  
  
    
//  var registerCanvasEvents = function () {
//    this.registerCanvasPointerEvent('click', 'click');
//    this.registerCanvasPointerEvent('mousedown', 'pointerDown');
//    this.registerCanvasPointerEvent('touchstart', 'pointerDown');
//    this.registerCanvasPointerEvent('mousemove', 'pointerMove');
//    this.registerCanvasPointerEvent('touchmove', 'pointerMove');
//    this.registerCanvasPointerEvent('mouseup', 'pointerUp');
//    this.registerCanvasPointerEvent('touchend', 'pointerUp');
//  };
    
//  triggerElementEvent = function (eventId, event) {
//    var self= this;
    
//    self.emitToServer(
//      'pointerEvent', 
//			{
//        "eventId": eventId, 
//        "x": event.x,
//        "y": event.y,
//        "touchIdentifier": event.touchIdentifier
//      },
//			eventId + ':' + event.touchIdentifier);
//  };
  
  
//  getRealXYFromClientXY = function (clientXY) {
//    var boundings = this.context.canvas.getBoundingClientRect();
    
//    var xy = {
//      x: (clientXY.clientX - boundings.left) * this.context.canvas.width / boundings.width / this.lengthScale,
//      y: (clientXY.clientY - boundings.top) * this.context.canvas.height / boundings.height / this.lengthScale
//    };
    
//    //		console.log("ClientXY: (" + clientXY.clientX + "," + clientXY.clientY + ") - RealXY: (" + xy.x + "," + xy.y + ")" );
//    if (DEBUG) this.logMessage("ClientXY: (" + clientXY.clientX + "," + clientXY.clientY + ") - RealXY: (" + xy.x + "," + xy.y + ")");
//    return xy;
//  };
  
//  // x,y in Real values
//  creanvas.NodeJsController.prototype.isPointInPath = function (x, y) {
//    // convert to Canvas XY
//    return this.context.isPointInPath(x * this.lengthScale, y * this.lengthScale);
//  };
//  );
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
