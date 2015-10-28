//var vector = require('../Vector');
//var collisionFactory = require('./CollisionFactory');

define(['creanvas/Core/serverBus'], function (serverBus) {
  
  
  var BroadTile = function (parameters) { 
    this.top = parameters.top;
    this.bottom = parameters.bottom;
    this.right = parameters.right;
    this.left = parameters.left;
  }

  serverBus.on('applicationCreated', function (appBus) {
    
    appBus.on('addBroadTile', function (parameters) {
      var tile = new BroadTile(parameters);
      appBus.emit('broadTileAdded', tile);

      appBus.on('processBroadPhase', function (elements) {
        
        var tileElements = [];
        var collisionsToCheck = [];
        
        elements.forEach(function (element) {
          element.emit('isInTile', tile, function () {
//            console.log(element.id, 'is in tile', tile.left, tile.top);
            tileElements.forEach(function (other) {
              collisionsToCheck.push({ e1: other, e2: element })
            });
            tileElements.push(element);
          });
        });
        
        tile.status = 'done';
        appBus.emit('broadTileProcessed', elements, collisionsToCheck);
      });
    })    
  });
});