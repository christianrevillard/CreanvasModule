// Common to node and browser.

define(['creanvas/creanvas'], function (creanvas) {
  self = this;
  
  var testApplication = null;
    
  var startANewOne = function (callback) {
    console.log('Starting a new testApplication');
    
    var elementId = 0;

    var app = creanvas();
        
    var xGenerator = {
      id: 'X-Gen',
      type: 'X',
      generator: {
        maxCount: 3,
        Child: function (parent) {
          this.position = {
            x: parent.position.x,
            y: parent.position.y,
            z: parent.position.z + 1,
          };
          this.draggable = true;
          this.droppable = true;
          this.type = 'X';
          this.circular = { radius: 0.5 };
        }
      },
      position: { x: 4.5, y: 1.5, z: -100 },
      circular: { radius: 0.5 }
    }
    
    app.addElement(xGenerator);
    
    xGenerator.on('generatorEmpty', function () {
      xGenerator.type = 'X-Empty';
      xGenerator.emit('elementUpdated');
    });
        
    var oGenerator = {
      id: 'O-Gen',
      type: 'O',
      generator: {
        maxCount: 3,
        Child: function (parent) {
          this.position = {
            x: parent.position.x,
            y: parent.position.y,
            z: parent.position.z + 1,
          };
          this.draggable = true;
          this.droppable = true;
          this.type = 'O';
          this.circular = { radius: 0.5 };
        }
      },
      position: { x: 4.5, y: 2.5, z: -100 },
      circular: { radius: 0.5 }
    };
    
    app.addElement(oGenerator);
    
    oGenerator.on('generatorEmpty', function () {
      oGenerator.type = 'O-Empty';
      oGenerator.emit('elementUpdated');
    });
    
    for (var i = 0; i < 3; i++)
      for (var j = 0; j < 3; j++)
        app.addElement({
          id: 'cell' + i + '-' + j,
          type: 'cell',
          dropZone: { maxCount: 1 },
          position: { x: 0.5 + i , y: 0.5 + j, z: -100 },
          circular: { radius: 0.5 }
        });


    testApplication = {
      app: app,
      nbOfPlayers: 0,
      z:0,
      connect: function (clientChannel) {
        self = this;
        if (self.nbOfPlayers === 2) {
          console.log('testApplicaton: Too many people, create a new one!');
          return;
        }
        
        clientChannel = app.connect(clientChannel);
        
        console.log('testApplicaton: Connecting a client', clientChannel.id);
        
        self.nbOfPlayers++;
        self.z++;
        
  //      element.on('droppedIn', function (dropZone) { element.speed = { x: 0, y: 0, angle: Math.PI / 4 } });
   //     element.on('draggedOut', function (dropZone) { element.speed = { x: 0.2, y: 0.2 }});

        
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
      if (!testApplication || testApplication.nbOfPlayers >= 2) {
        console.log('testApplicaton: need a new one!');
        startANewOne(callback);
      }
      else {
        callback(testApplication);
      }
    }
  };
});