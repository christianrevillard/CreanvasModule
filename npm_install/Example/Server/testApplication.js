// Common to node and browser.

define(['creanvas/creanvas'], function (creanvas) {
  self = this;
  
  var testApplication = null;
    
  var startANewOne = function (callback) {
    console.log('Starting a new testApplication');
    
    creanvas(function (app) {
      testApplication = {
        app: app,
        nbOfPlayers: 0,
        connect: function (clientChannel) {
          if (this.nbOfPlayers === 3) {
            console.log('Too many people, create a new one!');
            return;
          }
          
          console.log('Connecting a client', clientChannel.id);
          
          this.nbOfPlayers++;
          
          app.addElement({ x: 100, y: 100 });
          
          setInterval(function () { app.emit('emit', 'Message for everyone in ' + app.id); },10000);
          setInterval(function () { app.emit('broadcast', clientChannel.id, 'Message for others in ' + app.id + ' - from ' + clientChannel.id); }, 10000);

          return app.connect(clientChannel);
        }
      };
      callback(testApplication);
    });
  };
  
  return {
    
    getApplication: function (callback) {
      if (!testApplication || testApplication.nbOfPlayers >= 3) {
        console.log('need a new one!');
        startANewOne(callback);
      }
      else {
        callback(testApplication);
      }
    }
  };
});