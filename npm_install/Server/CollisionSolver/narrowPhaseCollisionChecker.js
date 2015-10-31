define(['creanvas/Core/serverBus'], function (serverBus) {
  
  var checkForCollision = function (collisionsToCheck) {
    
    var c = collisionsToCheck.filter(function (toCheck) { return toCheck.status === undefined })[0];
    
    if (!c.e1.position.pendingDt && !c.e2.position.pendingDt) {
      c.status = false;
      return;     // no move for them, so no collision !
    }
    
    if (!c.handler.areColliding()) {
      c.status = false;
      c.e1.collisions[c.e2.id].checkedDt = c.e1.position.pendingDt;
      c.e2.collisions[c.e1.id].checkedDt = c.e2.position.pendingDt;
      return;
    }
    
    c.status = true;
    
    moveOutOfOverlap(c);
    
    requeuePossibleCollisions(c.e1);
    requeuePossibleCollisions(c.e2);
  };
  
  var moveOutOfOverlap = function (collision) {
    var steps = 1;
    
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
      
      highestDtElement.emit('updatePosition', lowestDt);
      
      if (collision.handler.areColliding()) {
        // scenario 2a: collision at lowest pendig.dt => find common pending.dt somewhere between 0 and lowest pending.dt
        // both moved at lowestDt already
        moveOutOfOverlapCommonDt(collision);
      } else {
        // scenario 2b: no collision at lowest pending.dt => decrease pending.dt on highest only				
        highestDtElement.emit('updatePosition', highestDt);
        moveOutOfOverlapDifferentDt(collision);
      }
    }

    collision.e1.collisions[collision.e2.id].checkedDt = collision.e1.position.pendingDt;
    collision.e2.collisions[collision.e1.id].checkedDt = collision.e2.position.pendingDt;
  };
  
  var moveOutOfOverlapCommonDt = function (collision) {
    var steps = 1;
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
      
      collision.e1.emit('updatePosition', testDt);
      collision.e2.emit('updatePosition', testDt);
      
      if (collision.handler.areColliding()) {
        collidedDt = testDt;
      } else {
        okDt = testDt;
      }
    }
    
    collision.e1.emit('updatePosition', okDt);
    collision.e2.emit('updatePosition', okDt);
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
      
      toUpdate.emit('updatePosition', testDt);
      
      if (collision.handler.areColliding(toUpdate, fixed)) { collidedDt = testDt; } else { okDt = testDt; }
    }
    
    toUpdate.emit('updatePosition', okDt);
  };
  
  var requeuePossibleCollisions = function (element) {
    element
	  .collisions
	  .filter(function (c) { return c.collision.status !== undefined && c.checkedDt > element.position.pendingDt; })
		.forEach(function (c) { c.status = undefined; });
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