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
          if (element.solid.isInTile(tile)) {
            tileElements.forEach(function (other) {
              var first = element.id < other.id?element:other;
              var second = element.id < other.id?other:element;
              collisionsToCheck.push({
                id: first.id + '-' + second.id, 
                e1: first, 
                e2: second
              });                
            });
            tileElements.push(element);
          }
        });
        
        tile.status = 'done';
        appBus.emit('broadTileProcessed', elements, collisionsToCheck);
      });
    })    
  });
});