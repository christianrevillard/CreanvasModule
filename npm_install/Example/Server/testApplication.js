// Common to node and browser.

define(['creanvas/creanvasServer'], function (creanvas) {
  self = this;
  
  var currentInstance = null;
    
  var startANewOne = function (callback) {
    console.log('Starting a new application');
    
    creanvas(function (app) {
      currentInstance = {
        instance: app,
        nbOfPlayers: 0,
        connect: function (clientChannel) {
          if (this.nbOfPlayers === 3) {
            console.log('Too many people, create a new one!');
            return;
          }
          
          console.log('Connecting a client', clientChannel ? clientChannel.id:'auto');
          
          this.nbOfPlayers++;
          
          app.addElement({ x: 100, y: 100 });
          
          setInterval(function () { app.events.emit('emit', 'Message for everyone in ' + app.events.id); },2000);
          setInterval(function () { app.events.emit('broadcast', clientChannel.id, 'Message for others in ' + app.events.id + ' - from ' + clientChannel.id); }, 2000);

          return app.connect(clientChannel);
        }
      };
      callback(currentInstance);
    });
  };
  
  return {
    
    getApplication: function (callback) {
      if (!currentInstance || currentInstance.nbOfPlayers >= 3) {
        console.log('need a new one!');
        startANewOne(callback);
      }
      else {
        callback(currentInstance);
      }
    }
  };
});