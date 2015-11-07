define(['creanvas/Core/serverBus'], function (serverBus) {
  
  var checkForCollision = function (collisionsToCheck) {
    
    var c = collisionsToCheck.filter(function (toCheck) { return toCheck.status === undefined })[0];
    
    if (!c.e1.position.pendingDt && !c.e2.position.pendingDt) {
      c.status = false;
      return;     // no move for them, so no collision !
    }
    
    if (!c.handler) {
      c.status = false;
      return;     // do not know what to do...
    }
    
    if (!c.e1.solid.collisionGroups.some(function (group1) {
      return c.e2.solid.collisionGroups.some(function (group2) {
        return group1 === group2;
      });
    })) {
      c.status = false;
      return;
    }
    
    if (!c.handler.areColliding()) {
      c.status = false;
      c[c.e1.id] = c.e1.position.pendingDt;
      c[c.e2.id] = c.e2.position.pendingDt;
      return;
    }
        
    c.status = true;
        
    moveOutOfOverlap(c);
           
    requeuePossibleCollisions(collisionsToCheck, c.e1);
    requeuePossibleCollisions(collisionsToCheck, c.e2);
  };
  
  var moveOutOfOverlap = function (collision) {
    var steps = 4;
    
    // Input: e1 and e2 overlap in current pending.dt
    // Out: pending.dt updated to an non-overlaping position.
    
    // scenario 1: same pending.dt 
    if (Math.abs(collision.e1.position.pendingDt - collision.e2.position.pendingDt) < 0.0001) {
      moveOutOfOverlapCommonDt(collision);
    }
    // scenario 2: different pending.dt
    else {
      var highestDtElement = (collision.e1.position.pendingDt > collision.e2.position.pendingDt)?collision.e1:collision.e2;
      var lowestDtElement = (collision.e1.position.pendingDt > collision.e2.position.pendingDt)?collision.e2:collision.e1;
      
      var highestDt = highestDtElement.position.pendingDt;
      var lowestDt = lowestDtElement.position.pendingDt;
      
      highestDtElement.emit('move', lowestDt);
      
      if (collision.handler.areColliding()) {
        // scenario 2a: collision at lowest pendig.dt => find common pending.dt somewhere between 0 and lowest pending.dt
        // both positionUpdated at lowestDt already
        moveOutOfOverlapCommonDt(collision);
      } else {
        // scenario 2b: no collision at lowest pending.dt => decrease pending.dt on highest only				
        highestDtElement.emit('move', highestDt);
        moveOutOfOverlapDifferentDt(collision);
      }
    }

    collision[collision.e1.id] = collision.e1.position.pendingDt;
    collision[collision.e2.id] = collision.e2.position.pendingDt;
  };
  
  var moveOutOfOverlapCommonDt = function (collision) {
    var steps = 4;
    // Input: e1 and e2 overlap in their current pending.dt, which is the same
    // Out: no nore overlap !
    var okDt = 0;
    var collidedDt = Math.min(collision.e1.position.pendingDt, collision.e2.position.pendingDt); // in case not perfectly equal.
    var testDt;
    var collision;
    
    var step = steps;
    while (step > 0) {
      step--;
      
      testDt = (okDt + collidedDt) / 2;
      
      collision.e1.emit('move', testDt);
      collision.e2.emit('move', testDt);
      
      if (collision.handler.areColliding()) {
        collidedDt = testDt;
      } else {
        okDt = testDt;
      }
    }
    
    collision.e1.emit('move', okDt);
    collision.e2.emit('move', okDt);
  };
  
  var moveOutOfOverlapDifferentDt = function (collision) {
    var toUpdate = (collision.e1.position.pendingDt > collision.e2.position.pendingDt)?collision.e1:collision.e2;
    var fixed = (collision.e1.position.pendingDt > collision.e2.position.pendingDt)?collision.e2:collision.e1;
    
    // Input: e1 and e2 overlap in their current pending.dt, 
    // but not at fixed.position.pendingDt.
    // Find the correct dt value for toUpdate
    var steps = 1;
    var okDt = fixed.position.pendingDt;
    var collidedDt = toUpdate.position.pendingDt;

    var testDt;
    var collision;
    
    var step = steps; // tood, use distance or stuff to refine.
    while (step > 0) {
      step--;
      
      testDt = (okDt + collidedDt) / 2;
      
      toUpdate.emit('move', testDt);
      
      if (collision.handler.areColliding()) {
        collidedDt = testDt;
      } else {
        okDt = testDt;
      }
    }
    
    toUpdate.emit('move', okDt);
  };
  
  var requeuePossibleCollisions = function (collisionsToCheck, element) {
    collisionsToCheck
    .filter(function (c) {
      return (c.e1.id === element.id || c.e2.id === element.id) &&
     c.status !== undefined &&
      c[element.id] > element.position.pendingDt;
    })
		.forEach(function (c) {
      c.status = undefined;
    });
  };
  
  serverBus.on('applicationCreated', function (appBus, parameters) {
    
    appBus.on('broadPhaseCompleted', function (collisionsToCheck) {
      
      while (collisionsToCheck.some(function (c) { return c.status === undefined; })) {
        checkForCollision(collisionsToCheck);
      };
      
      var collisions = collisionsToCheck.filter(function (c) { return c.status === true; });
      
      if (collisions.length > 0) {
        appBus.emit('collisionsFound', collisions);
      }
    });
  });
});