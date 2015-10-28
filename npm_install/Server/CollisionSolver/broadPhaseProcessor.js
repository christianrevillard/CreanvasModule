//var vector = require('../Vector');
//var collisionFactory = require('./CollisionFactory');

define(['creanvas/Core/serverBus','creanvas/CollisionSolver/broadTile'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus, parameters) {
    var tilesPerRow = 8;
    var broadTiles = [];
    var collisionsToCheck = [];
    
    appBus.on('broadTileAdded', function (tile) {
      broadTiles.push(tile);
    });
        

    appBus.on('broadTileProcessed', function (solidElements, tileCollisionsToCheck) {
      collisionsToCheck = collisionsToCheck.concat(tileCollisionsToCheck);
      if (broadTiles.every(function (tile) { return tile.status != 'pending' })) {
        appBus.emit('broadPhaseCompleted', solidElements, collisionsToCheck);
        collisionsToCheck = [];
      }
    });
    
    var height = (parameters.bottom - parameters.top) / tilesPerRow;
    var width = (parameters.right - parameters.left) / tilesPerRow;
    
    for (var i = 0; i < tilesPerRow; i++) {
      for (var j = 0; j < tilesPerRow; j++) {
        appBus.emit('addBroadTile', {
          left: parameters.left + i * width,
          right: parameters.left + (i + 1) * width,
          top: parameters.top + j * height , 
          bottom: parameters.top + (j + 1) * height
        });
      }
    }
    
    appBus.on("solveCollisions", function (solidElements) {
      
      broadTiles.forEach(function (tile) { tile.status = 'pending' });
      
      appBus.emit('processBroadPhase', solidElements);
    });
    
    
    
    
    

    // temp, 
    appBus.on('broadPhaseCompleted', function (solidElements, collisionsToCheck) {
      
      if (collisionsToCheck.length > 0) { 
        console.log('Collisions to check:', collisionsToCheck.length);
      }
      
      collisionsToCheck = [];

      solidElements.forEach(function (element) {
        element.emit('commitMove', element.pending.dt);
      });
    });



  });
});