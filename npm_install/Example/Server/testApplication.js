// eventemitter may need:
// id, join...


define(['creanvas/creanvasServer'], function (server) {
  self = this;
  
  // need to be a creanvasApplicatonInstance, with own elementList, set of clientupdaters
  // if socket join a room, will need to do something about browser events. or just let the ClietnUpdater play this role?
  
  var currentInstance = null;
  
  
  var startANewOne = function (callback) {
    console.log('Starting a new application');
    
    server.getApplicationInstance(function (newInstance) {
      currentInstance = {
        instance: newInstance,
        nbOfPlayers: 0,
        connect: function (eventsOut) {
          if (this.nbOfPlayers === 3) {
            console.log('Too many people, create a new one!');
            return;
          }
          
          console.log('Connecting a client');
          
          this.nbOfPlayers++;
          
          this.instance.addElement({ x: 100, y: 100 });
          
          return newInstance.connect(eventsOut);
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