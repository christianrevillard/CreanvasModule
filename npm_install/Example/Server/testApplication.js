// Common to node and browser.

define(['creanvas/creanvas'], function (creanvas) {
  self = this;
  
  var testApplication = null;
    
  var startANewOne = function (callback) {
    console.log('Starting a new testApplication');
    
    var elementId = 0;

    var app = creanvas();
    
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

        app.addElement(
          {
            id : 'X' + (++elementId),
            position: { x: 100, y: 100, z: self.z },
            type: 'X',
            onClick: function () {
              app.emit('broadcastMessage', clientChannel.id, 'Clicked by someone ' + this.id);
              clientChannel.emit('message', 'Clicked by me' + this.id);
            },
            onDoubleClick: function () {
              app.emit('broadcastMessage', clientChannel.id,'DoubleClicked by someone ' + this.id);
              clientChannel.emit('message', 'DoubleClicked by me' + this.id);
              self.nbOfPlayers--;
              this.emit('dispose');
            },
            draggable: elementId%2,
            speed: { x: 50, y: 50},
            afterMove: function () {
              
              if (this.position.x > 800) {
                this.position.x = -800;
              }
                            
              if (this.position.y > 500) {
                this.position.y = -500;
              }
            },
            circular: {radius:100}
          });
        
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