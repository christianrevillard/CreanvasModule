var DEBUG = false;

define(['client/coordinatesConverter'], function (coordinates) {
  return function (system) {
    
    var clientToServerBuffering = 40;
    var emitBuffer = [];    
    
    var queueEvent = function (action, actionData, overrideActionKey, allowBuffering) {
      if (overrideActionKey) {
        emitBuffer = emitBuffer.filter(function (e) { return e.overrideActionKey != overrideActionKey; });
      }      
      emitBuffer.push({ action: action, actionData: actionData, overrideActionKey: overrideActionKey });
      if (!allowBuffering) { 
        sendToServer();
      }
    };
    
    var sendToServer = function () {
      
      emitBuffer.forEach(function (e) {
        
        system.clientChannel.emit(
          e.action, 
						JSON.stringify(e.actionData));
        
        emitBuffer = [];
      });
    };
        
    var triggerElementEvent = function (eventId, event, allowBuffering) {
      
      queueEvent(
        'pointerEvent', 
			{
          "eventId": eventId, 
          "x": event.x,
          "y": event.y,
          "touchIdentifier": event.touchIdentifier
        },
			eventId + ':' + event.touchIdentifier, 
      allowBuffering);
    };
    
    var registerCanvasPointerEvent = function (controlEventId, customEventId, allowBuffering) {
      
      system.canvas.addEventListener(controlEventId,
			function (event) {
        setTimeout(function () {
          var triggerEvent = function (clientXY, touchIdentifier) {
            var eventData = coordinates.eventToCustom(system, clientXY)
            if (DEBUG) {
              console.log("Canvas event:", controlEventId, customEventId, touchIdentifier, eventData);
            }
            eventData.touchIdentifier = touchIdentifier;
            triggerElementEvent(customEventId, eventData, allowBuffering);
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
        
    registerCanvasPointerEvent('click', 'click', false);
    registerCanvasPointerEvent('dblclick', 'doubleclick', false);
    registerCanvasPointerEvent('mousedown', 'pointerDown', false);
    registerCanvasPointerEvent('touchstart', 'pointerDown', false);
    registerCanvasPointerEvent('mousemove', 'pointerMove', true);
    registerCanvasPointerEvent('touchmove', 'pointerMove', true);
    registerCanvasPointerEvent('mouseup', 'pointerUp', false);
    registerCanvasPointerEvent('touchend', 'pointerUp', false);
    
    setInterval(sendToServer, clientToServerBuffering);    
  };
});
 
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
