define(['creanvas/Core/serverBus', 'modules/Vector'], function (serverBus, Vector) {
  
  var handleCollision = function (c) {
    
    var collisionEffects = getCollisionEffects(c.e1, c.e2, c.handler);
    
    if (!collisionEffects)
      return;
           
    c.e1.speed.x += collisionEffects.e1.dSpeedX;
    c.e1.speed.y += collisionEffects.e1.dSpeedY;
    c.e1.speed.angle += collisionEffects.e1.dSpeedAngle;
    
    c.e2.speed.x += collisionEffects.e2.dSpeedX;
    c.e2.speed.y += collisionEffects.e2.dSpeedY;
    c.e2.speed.angle += collisionEffects.e2.dSpeedAngle;

    c.e1.emit('collided', c.e2);
    c.e2.emit('collided', c.e1);
  };
  
  var getCollisionEffects = function (e1, e2, handler) {
    
    if (e1.mass === Infinity && e2.mass === Infinity) {
      return;
    }
    
    var collisionPointInformation = handler.getCollisionPoint();
    
    
    if (!collisionPointInformation || !collisionPointInformation.normalVector) {
      console.log('error getting collision effects for:', e1, e2);
      return null;
    }
    
    var collisionBasis = Vector.getBasisFromFirstVector(collisionPointInformation.normalVector);
    var collisionPoint = collisionPointInformation.collisionPoint;
    
    var col1 = getCollisionInformation(collisionBasis, collisionPoint, e1);
    var col2 = getCollisionInformation(collisionBasis, collisionPoint, e2);
    
    var impulseNormal = 
   -(1 + e1.solid.coefficient * e2.solid.coefficient) 
		* (col2.localSpeed.x - col1.localSpeed.x) 
		/ (1 / e1.mass + 1 / e2.mass + col1.N.x / col1.momentOfInertia + col2.N.x / col2.momentOfInertia);
    
    var impulseFriction = 
     -(col2.localSpeed.y - col1.localSpeed.y + impulseNormal * (col1.N.y / col1.momentOfInertia + col2.N.y / col2.momentOfInertia)) 
		  / (1 / e1.mass + 1 / e2.mass + col1.T.y / col1.momentOfInertia + col2.T.y / col2.momentOfInertia);
    
    var muS = (e1.solid.staticFriction + e2.solid.staticFriction)/2; // not really correct...
    var muD = (e1.solid.dynamicFriction + e2.solid.dynamicFriction)/2; // not really correct...    
    
    if (Math.abs(impulseFriction / impulseNormal) > muS) { impulseFriction = muD * impulseNormal;}
    
    var impulse = new Vector(
      impulseNormal * collisionBasis.v1.x + impulseFriction * collisionBasis.v2.x,
		  impulseNormal * collisionBasis.v1.y + impulseFriction * collisionBasis.v2.y,
		  0);
    
    var effects = {
      e1: {
        dSpeedX:  -impulse.x / e1.mass,
        dSpeedY:  -impulse.y / e1.mass,
        dSpeedAngle:  -Vector.vectorProduct(col1.centerToCollision, impulse).z / col1.momentOfInertia
      },
      e2: {
        dSpeedX: impulse.x / e2.mass,
        dSpeedY:  impulse.y / e2.mass,
        dSpeedAngle: Vector.vectorProduct(col2.centerToCollision, impulse).z / col2.momentOfInertia
      }
    };
    
    return effects;
  };
 
  
  var getCollisionInformation = function (collisionBasis, collisionPoint, element) {
    
    var centerToCollision = new Vector(collisionPoint.x - element.position.x, collisionPoint.y - element.position.y);
    
    var rotation = new Vector(0, 0, element.speed.angle);
    
    var localSpeed = Vector.sum(
      element.speed,
			Vector.vectorProduct(rotation, centerToCollision));
    
    if (element.solid.getEdgeSpeed) {
     localSpeed = Vector.sum(
        localSpeed,
        element.solid.getEdgeSpeed(collisionPoint.x, collisionPoint.y));
    }    
    
    //if (element.moving.scaleSpeed) {
    //  localSpeed.x += centerToCollision.x * element.moving.scaleSpeed.x;
    //  localSpeed.y += centerToCollision.y * element.moving.scaleSpeed.y;
    //};
    
    var localSpeedInCollisionBasis = localSpeed.getCoordinates(collisionBasis);
    
    var moi = element.solid.getMomentOfInertia();
    
    var N = Vector.vectorProduct(		
      Vector.vectorProduct(centerToCollision, collisionBasis.v1),
  		centerToCollision);
    
    var T = Vector.vectorProduct(		
      Vector.vectorProduct(centerToCollision, collisionBasis.v2),
			centerToCollision);
    
    return {
      localSpeed: localSpeedInCollisionBasis,
      centerToCollision: centerToCollision,
      mass: element.fixedPoint ? Infinity:element.mass,
      momentOfInertia: moi,
      N: N.getCoordinates(collisionBasis),
      T: T.getCoordinates(collisionBasis)
    };
  };
  

  serverBus.on('applicationCreated', function (appBus, parameters) {
    
    appBus.on('collisionsFound', function (collisions) {
      
      collisions.forEach(handleCollision);
      
    });
  });
});