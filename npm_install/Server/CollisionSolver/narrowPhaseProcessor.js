﻿define(['creanvas/Core/serverBus'], function (serverBus) {
  
  var checkForCollision = function (c, collisionsToCheck) {
        
    if (c.status !== undefined)
      return; // already handled - can this really happen, check.
    
    if (!c.e1.pending.dt && !c.e2.pending.dt)
      return;     // no move for them, so no collision !
    
    if (!c.handler.areColliding()) {
      c.e1.collisions[c.e2.id].status = c.e2.collisions[c.e1.id].status = false;
      c.e1.collisions[c.e2.id].checkedDt = c.e1.pending.dt;
      c.e2.collisions[c.e1.id].checkedDt = c.e2.pending.dt;
      return;
    }
    
    c.e1.collisions[c.e2.id].status = c.e2.collisions[c.e1.id].status = true;
    
    moveOutOfOverlap(c);
    
    c.e1.collisions[c.e2.id].checkedDt = c.e1.pending.dt;
    c.e2.collisions[c.e1.id].checkedDt = c.e2.pending.dt;
    c.e1.collisions[c.e2.id].handler = c.handler;
    c.e2.collisions[c.e1.id].handler = c.handler;
    
    requeuePossibleCollisions(collisionsToCheck, c.e1);
    requeuePossibleCollisions(collisionsToCheck, c.e2);
  };
  
  var moveOutOfOverlap = function (collision) {
    var steps = 1;
    
    // Input: e1 and e2 overlap in their currentDt
    // Out: update currentDt and moving into an non-overlaping position. dt goes always down
    // See later, drop for the moment - CollisionMatrix to contain the most actual collisionInfo => needed really?
    
    // scenario 1: same currentDt 
    if (Math.abs(collision.e1.pending.dt - collision.e2.pending.dt) < 0.0001) {
      moveOutOfOverlapCommonDt(collision);
    }
    else {
      var highestDtElement = (collision.e1.pending.dt > collision.e2.pending.dt)?collision.e1:collision.e2;
      var lowestDtElement = (collision.e1.pending.dt > collision.e2.pending.dt)?collision.e2:collision.e1;
      
      var highestDt = highestDtElement.pending.dt;
      var lowestDt = lowestDtElement.pending.dt;
      
      highestDtElement.emit('updatePendingMove',lowestDt);
      
      if (collision.handler.areColliding()) {
        // scenario 2a: different currentDt, do collide at minimum of the 2 => common dt to find between 0 and lowestDt
        // both moved at lowestDt already
        moveOutOfOverlapCommonDt(collision);
      } else {
        // scenario 2b: different currentDt, do no collide at minimum of the 2. => only update highest dt to find non-collision				
        highestDtElement.emit('updatePendingMove',highestDt);
        moveOutOfOverlapDifferentDt(collision);
      }
    }
  };  
  
  var moveOutOfOverlapCommonDt = function (collision) {
    var steps = 1;
    // Input: e1 and e2 overlap in their currentDt, which is the same
    // Out: update currentDt and moving into an non-overlaping position.
    
    //	console.log('Fixing overlap - common dt -for ' + e1.id + '/' + e2.id);
    
    var okDt = 0;
    var collidedDt = Math.min(collision.e1.pending.dt, collision.e2.pending.dt); // in case not perfectly equal.
    var testDt;
    var collision;
    
    var step = steps; // tood, use distance or stuff to refine.
    while (step > 0) {
      step--;
      
      testDt = (okDt + collidedDt) / 2;
      
      collision.e1.emit('updatePendingMove',testDt);
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
    
    // Input: e1 and e2 overlap in their currentDt, but not at fixed.dt. Find the correct value for toUpdate
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
	.filter(function (c) { return c.status !== undefined && c.checkedDt > element.pending.dt; })
		.forEach(function (c) {
      c.status = c.collisionWith.collisions[element.id].status = undefined;
      
      collisionsToCheck.push({
        e1: element,
        e2: c.collisionWith,
        status: undefined,
        handler: c.handler
      });
    });
  };

  serverBus.on('applicationCreated', function (appBus, parameters) {

    appBus.on('broadPhaseCompleted', function (elements, collisionsToCheck) {
            
      while (collisionsToCheck.length > 0) {
        checkForCollision(collisionsToCheck.shift(), collisionsToCheck);
      };
                        
      // fill in directly while checking collisions ? let them stay in collisionsToCheck for example?
      var collisions = [];
      elements.forEach(function (e) {
        if (!e.collisions)
          return;
        e.collisions.forEach(function (c) {
          if (c.collisionWith.id < e.id)
            return;
          if (!c.status)
            return;
          collisions.push({
            e1: e, 
            e2: c.collisionWith,
            collisionHandler: c.handler
          });
        });
        e.collisions = null;
      });
      console.log(collisions);
    });
  });
});