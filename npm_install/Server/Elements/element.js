﻿define(['creanvas/Core/serverBus', 'creanvas/Core/EventEmitter'], function (serverBus, EventEmitter) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "addElement", 
    function (elementData) {
        setUpElement(appBus, elementData);
      });
  });
  
  var setUpElement = function (appBus, element) {
        
    element.position = element.position || {};
    element.position.x = element.position.x || 0;
    element.position.y = element.position.y || 0;
    element.position.z = element.position.z || 0;
    element.position.angle = element.position.angle || 0;
    
    element.lastCommited = {      
      position : {
        x: element.position.x,
        y: element.position.y,
        z: element.position.z,
        angle: element.position.angle,
      },
      scale :1 
    };
    
    element.scale = element.scale || 1;
    element.target = {};
    element.elementBus = new EventEmitter();

    element.on = function () {
      element.elementBus.on.apply(element.elementBus, [].slice.apply(arguments));
    }
    
    element.emit = function () {
      element.elementBus.emit.apply(element.elementBus, [].slice.apply(arguments));
    }
    
    element.on('dispose', function () {
      element.elementBus.removeAllListeners();
    });
    
    appBus.addElementListener(element, 'dispose', function () { 
      element.elementBus.emit('dispose');
    });
        
    if (element.events) {
      
      for (var eventId in element.events) {
        if (element.events.hasOwnProperty(eventId)) {
          element.on(eventId, function () {
            var args = [].slice.apply(arguments);
            element.events[eventId].apply(element, args);
          });
        }
      }
    }
    
    element.updatePosition = function (x, y, angle) {
      element.position.x = x;
      element.position.y = y;
      element.position.angle = angle;

      element.emit('positionUpdated');
    };
    
    element.updateSpeed = function (x, y, angle) {
      element.speed.x = x;
      element.speed.y = y;
      element.speed.angle = angle;
      
      element.emit('speedUpdated');
    };

    appBus.addElementListener(element, 'clientConnected', function () {
      element.emit('elementUpdated');
    });
    
    appBus.emit('elementAdded', element);
    
    element.emit('elementUpdated');
  };
});