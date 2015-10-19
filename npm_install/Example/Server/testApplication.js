// Common to node and browser.

define(['creanvas/creanvas'], function (creanvas) {
  self = this;
  
  var testApplication = null;
    
  var startANewOne = function (callback) {
    console.log('Starting a new testApplication');
    
    var app = creanvas();
    
    testApplication = {
      app: app,
      nbOfPlayers: 0,
      connect: function (clientChannel) {
        if (this.nbOfPlayers === 3) {
          console.log('testApplicaton: Too many people, create a new one!');
          return;
        }
        
        clientChannel = app.connect(clientChannel);
        
        console.log('testApplicaton: Connecting a client', clientChannel.id);
        
        this.nbOfPlayers++;
        
        app.addElement(
          {
            position: { x: 100, y: 100 },
            type:'X',
            speed: { x: 50, y: 50},
            afterMove: function () {
              
              if (this.position.x > 400) {
                this.position.x = 0;
              }
                            
              if (this.position.y > 400) {
                this.position.y = 0;
              }
            }
          });
        
        clientChannel.emit('message', 'Welcome, you are ' + clientChannel.id + ' on ' + app.id);
        app.emit('broadcastMessage', clientChannel.id, clientChannel.id + ' has joined ' + app.id);
        
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