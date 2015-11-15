define(['creanvas/Core/serverBus', 'creanvas/CollisionSolver/collisionHandlerFactory','creanvas/CollisionSolver/broadTile'], function (serverBus, collisionFactory) {
  
  serverBus.on('applicationCreated', function (appBus, parameters) {
    var tilesPerRow = 8;
    var broadTiles = [];
    var collisionsToCheck = [];
    
    appBus.on('broadTileAdded', function (tile) {
      broadTiles.push(tile);
    });        

    appBus.on('broadTileProcessed', function (solidElements, tileCollisionsToCheck) {
      collisionsToCheck = collisionsToCheck.concat(tileCollisionsToCheck);
      if (broadTiles.some(function (tile) { return tile.status == 'pending' })) {
        return;
      }
      
      var ids = collisionsToCheck.map(function (c) { return c.id; });
      
      collisionsToCheck = collisionsToCheck.filter(function (item, index, array) {
        return index === ids.indexOf(item.id);
      });
      
      collisionsToCheck.forEach(function (c) {
        c.handler = collisionFactory(c.e1, c.e2);
        c.status = undefined;
        //c.e1.collisions = c.e1.collisions || [];
        //c.e2.collisions = c.e2.collisions || [];
        //c.e1.collisions.push({ collisionWith: c.e2.id, collision: c });
        //c.e2.collisions.push({ collisionWith: c.e1.id, collision: c });
      });

      appBus.emit('broadPhaseCompleted', collisionsToCheck);
      
      collisionsToCheck = [];
      
      solidElements.forEach(function (element) {
        element.emit('commitMove');
        element.emit('moveCommitted', element, element.position.pendingDt || 0);
      });
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

  });
});