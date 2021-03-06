﻿// Common to node and browser.

define(['creanvas/creanvas'], function (creanvas) {
  self = this;
  
  var testApplication = null;
    
  var startANewOne = function (callback) {
    console.log('Starting a new testApplication');
    
    var elementId = 0;

    var app = creanvas({
      left: -800,
      right: 800,
      top: -500,
      bottom: 500
    });
    
    app.addElement({
      id: 'myDropzone',
      type: 'dropZone',
      dropZone: { maxCount: 1 },
      position: { x: 400, y: -250, z: -100 },
      circular: {radius: 250}
    })


    testApplication = {
      app: app,
      nbOfPlayers: 0,
      z:0,
      connect: function (clientChannel) {
        self = this;
        if (self.nbOfPlayers === 3) {
          console.log('testApplicaton: Too many people, create a new one!');
          return;
        }
        
        clientChannel = app.connect(clientChannel);
        
        console.log('testApplicaton: Connecting a client', clientChannel.id);
        
        self.nbOfPlayers++;
        self.z++;
        
        var element = 
      {
          id : 'X' + (++elementId),
          position: { x: 100, y: 100, z: self.z },
          type: 'X',
          onClick: function () {
            app.emit('broadcastMessage', clientChannel.id, 'Clicked by someone ' + this.id);
            clientChannel.emit('message', 'Clicked by me' + this.id);
          },
          onDoubleClick: function () {
            app.emit('broadcastMessage', clientChannel.id, 'DoubleClicked by someone ' + this.id);
            clientChannel.emit('message', 'DoubleClicked by me' + this.id);
            self.nbOfPlayers--;
            this.emit('dispose');
          },
          draggable: elementId % 2,
          droppable: true,
          speed: { x: 50, y: 50 },
          solid: {},
          events: {
            positionUpdated: function (element) {
              
              if (element.position.x > 800) {
                element.position.x = -800;
              }
              
              if (element.position.y > 500) {
                element.position.y = -500;
              }
            }
          },
          circular: { radius: 100 }
        };
        app.addElement(element);
        element.on('droppedIn', function (dropZone) { element.speed = { x: 0, y: 0, angle: Math.PI / 4 } });
        element.on('draggedOut', function (dropZone) { element.speed = { x: 50, y: 50 }});

        
        clientChannel.emit('message', 'Welcome, you are ' + clientChannel.id + ' on ' + app.id);
        app.emit('broadcastMessage', clientChannel.id, clientChannel.id + ' has joined ' + app.id);
        //app.on('elementEvent', function (event, element) {
        //  clientChannel.emit('message', event.eventId + ' on element ' + element.id);
        //});

        return clientChannel;
      }
    };
    callback(testApplication);
  };
  
  return {
    
    getApplication: function (callback) {
      if (!testApplication || testApplication.nbOfPlayers >= 3) {
        console.log('testApplicaton: need a new one!');
        startANewOne(callback);
      }
      else {
        callback(testApplication);
      }
    }
  };
});