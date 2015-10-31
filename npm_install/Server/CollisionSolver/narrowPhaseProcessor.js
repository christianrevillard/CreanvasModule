define(['creanvas/Core/serverBus'], function (serverBus) {
  
  var checkForCollision = function (collisionsToCheck) {
    
    var c = collisionsToCheck.filter(function (toCheck) { return toCheck.status === undefined })[0];
    
    if (!c.e1.pending.dt && !c.e2.pending.dt) {
      c.status = false;
      return;     // no move for them, so no collision !
    }
    
    if (!c.handler.areColliding()) {
      c.status = false;
      c.e1.collisions[c.e2.id].checkedDt = c.e1.pending.dt;
      c.e2.collisions[c.e1.id].checkedDt = c.e2.pending.dt;
      return;
    }
    
    c.status = true;
    
    moveOutOfOverlap(c);
        
    requeuePossibleCollisions(collisionsToCheck, c.e1);
    requeuePossibleCollisions(collisionsToCheck, c.e2);
  };
  
  var moveOutOfOverlap = function (collision) {
    var steps = 1;
    
    // Input: e1 and e2 overlap in current pending.dt
    // Out: pending.dt updated to an non-overlaping position.
    
    // scenario 1: same pending.dt 
    if (Math.abs(collision.e1.pending.dt - collision.e2.pending.dt) < 0.0001) {
      moveOutOfOverlapCommonDt(collision);
    }
    // scenario 2: different pending.dt
    else {
      var highestDtElement = (collision.e1.pending.dt > collision.e2.pending.dt)?collision.e1:collision.e2;
      var lowestDtElement = (collision.e1.pending.dt > collision.e2.pending.dt)?collision.e2:collision.e1;
      
      var highestDt = highestDtElement.pending.dt;
      var lowestDt = lowestDtElement.pending.dt;
      
      highestDtElement.emit('updatePendingMove', lowestDt);
      
      if (collision.handler.areColliding()) {
        // scenario 2a: collision at lowest pendig.dt => find common pending.dt somewhere between 0 and lowest pending.dt
        // both moved at lowestDt already
        moveOutOfOverlapCommonDt(collision);
      } else {
        // scenario 2b: no collision at lowest pending.dt => decrease pending.dt on highest only				
        highestDtElement.emit('updatePendingMove', highestDt);
        moveOutOfOverlapDifferentDt(collision);
      }
    }

    collision.e1.collisions[collision.e2.id].checkedDt = collision.e1.pending.dt;
    collision.e2.collisions[collision.e1.id].checkedDt = collision.e2.pending.dt;
  };
  
  var moveOutOfOverlapCommonDt = function (collision) {
    var steps = 1;
    // Input: e1 and e2 overlap in their current pending.dt, which is the same
    // Out: no nore overlap !
    var okDt = 0;
    var collidedDt = Math.min(collision.e1.pending.dt, collision.e2.pending.dt); // in case not perfectly equal.
    var testDt;
    var collision;
    
    var step = steps;
    while (step > 0) {
      step--;
      
      testDt = (okDt + collidedDt) / 2;
      
      collision.e1.emit('updatePendingMove', testDt);
      collision.e2.emit('updatePendingMove', testDt);
      
      if (collision.handler.areColliding()) {
        collidedDt = testDt;
      } else {
        okDt = testDt;
      }
    }
    
    collision.e1.emit('updatePendingMove', okDt);
    collision.e2.emit('updatePendingMove', okDt);
  };
  
  var moveOutOfOverlapDifferentDt = function (collision) {
    var toUpdate = (collision.e1.pending.dt > collision.e2.pending.dt)?collision.e1:collision.e2;
    var fixed = (collision.e1.pending.dt > collision.e2.pending.dt)?collision.e2:collision.e1;
    
    // Input: e1 and e2 overlap in their current pending.dt, 
    // but not at fixed.pending.dt.
    // Find the correct dt value for toUpdate
    var steps = 1;
    var okDt = fixed.pending.dt;
    var collidedDt = toUpdate.pending.dt;
    
    var testDt;
    var collision;
    
    var step = steps; // tood, use distance or stuff to refine.
    while (step > 0) {
      step--;
      
      testDt = (okDt + collidedDt) / 2;
      
      toUpdate.emit('updatePendingMove', testDt);
      
      if (collision.handler.areColliding(toUpdate, fixed)) { collidedDt = testDt; } else { okDt = testDt; }
    }
    
    toUpdate.emit('updatePendingMove', okDt);
  };
  
  var requeuePossibleCollisions = function (collisionsToCheck, element) {
    element
	  .collisions
	  .filter(function (c) { return c.collision.status !== undefined && c.checkedDt > element.pending.dt; })
		.forEach(function (c) { c.status = undefined; });
  };
  
  serverBus.on('applicationCreated', function (appBus, parameters) {
    
    appBus.on('broadPhaseCompleted', function (elements, collisionsToCheck) {
      
      while (collisionsToCheck.some(function (c) { return c.status === undefined; })) {
        checkForCollision(collisionsToCheck);
      };
      
      var collisions = collisionsToCheck.filter(function (c) { return c.status === true; });
      
      console.log(collisions.map(function (c) { return c.id; }));
    });
  });
});