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
          
          console.log('Connecting a client');
          
          this.nbOfPlayers++;
          
          app.addElement({ x: 100, y: 100 });
          
          setInterval(function () { app.events.emit('message', 'Message for everyone in ' + app.events.id); },2000);
          setInterval(function () { app.events.emit('message', 'Message for everyone in ' + app.events.id); }, 2000);

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
        if (currentInstance) {
       //   currentInstance.instance.dispose();
        }
        startANewOne(callback);
      }
      else {
        callback(currentInstance);
      }
    }
  };
});