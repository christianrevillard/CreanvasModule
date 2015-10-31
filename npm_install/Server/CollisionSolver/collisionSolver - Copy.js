
  
  var getCollisionInformation = function (collisionBasis, collisionPoint, element) {
    
    var centerToCollision = new vector.Vector(collisionPoint.x - element.position.x, collisionPoint.y - element.position.y);
    
    var rotation = new vector.Vector(0, 0, element.moving.speed.angle);
    
    var localSpeed = vector.Vector.sum(
      element.moving.speed,
			vector.Vector.vectorProduct(
        rotation,
				centerToCollision));
    
    if (element.moving.scaleSpeed) {
      localSpeed.x += centerToCollision.x * element.moving.scaleSpeed.x;
      localSpeed.y += centerToCollision.y * element.moving.scaleSpeed.y;
    };
    
    var localSpeedInCollisionBasis = localSpeed.getCoordinates(collisionBasis);
    
    var moi = element.fixed ? Infinity: (element.getMomentOfInertia ? element.getMomentOfInertia(): element.solid.getMomentOfInertia());
    
    var N = vector.Vector.vectorProduct(		
      vector.Vector.vectorProduct(
        centerToCollision,
			collisionBasis.v1),
		centerToCollision);
    
    var T = vector.Vector.vectorProduct(		
      vector.Vector.vectorProduct(
        centerToCollision,
				collisionBasis.v2),
			centerToCollision);
    
    return {
      localSpeed: localSpeedInCollisionBasis,
      centerToCollision: centerToCollision,
      mass: element.fixedPoint ? Infinity:element.solid.mass,
      momentOfInertia: moi,
      N: N.getCoordinates(collisionBasis),
      T: T.getCoordinates(collisionBasis)
    };
  };
  
  CollisionSolver.prototype.getCollisionDetails = function (element, other, collisionHandler) {
    
    if (element.solid.mass == Infinity && other.solid.mass == Infinity) {
      return;
    }
    
    var collisionGeometry = collisionHandler.getCollisionPoint(element, other);
    
    var collisionBasis = vector.Vector.getBasisFromFirstVector(collisionGeometry.normalVector);
    var collisionPoint = collisionGeometry.collisionPoint;
    
    var e1 = getCollisionInformation(collisionBasis, collisionPoint, element);
    var e2 = getCollisionInformation(collisionBasis, collisionPoint, other);
    
    var impulseNormal = 
 -(1 + element.solid.collisionCoefficient * other.solid.collisionCoefficient) 
		* (e2.localSpeed.x - e1.localSpeed.x) 
		/ (1 / e1.mass + 1 / e2.mass + e1.N.x / e1.momentOfInertia + e2.N.x / e2.momentOfInertia);
    
    var impulseFriction = 
 -(e2.localSpeed.y - e1.localSpeed.y + impulseNormal * (e1.N.y / e1.momentOfInertia + e2.N.y / e2.momentOfInertia)) 
		/ (1 / e1.mass + 1 / e2.mass + e1.T.y / e1.momentOfInertia + e2.T.y / e2.momentOfInertia);
    
    var muS = 0.7; // static
    var muD = 0.5; // dynamic
    
    if (Math.abs(impulseFriction / impulseNormal) > muS) {
      impulseFriction = muD * impulseNormal;
    }
    
    var impulse = new vector.Vector(
      impulseNormal * collisionBasis.v1.x + impulseFriction * collisionBasis.v2.x,
		impulseNormal * collisionBasis.v1.y + impulseFriction * collisionBasis.v2.y,
		0);
    
    var updates = {
      e1: {
        dSpeedX: 
 -impulse.x / e1.mass,
        dSpeedY: 
 -impulse.y / e1.mass,
        dSpeedAngle: 
 -vector.Vector.vectorProduct(
          e1.centerToCollision,
					impulse).z / e1.momentOfInertia
      },
      e2: {
        dSpeedX: 
 impulse.x / e2.mass,
        dSpeedY: 
 impulse.y / e2.mass,
        dSpeedAngle: 
 vector.Vector.vectorProduct(
          e2.centerToCollision,
					impulse).z / e2.momentOfInertia
      }
    };
    
    return updates;
  };
  
  
  CollisionSolver.prototype.updateSpeeds = function (collisionList) {
    var collisionSolver = this;
    
    collisionList.forEach(function (c) {
      
      c.collisionDetails = collisionSolver.getCollisionDetails(
        c.e1, 
				c.e2,
				c.collisionHandler);
      
      
      c.e1.moving.speed.x += c.collisionDetails.e1.dSpeedX;
      c.e1.moving.speed.y += c.collisionDetails.e1.dSpeedY;
      c.e1.moving.speed.angle += c.collisionDetails.e1.dSpeedAngle;
      
      c.e2.moving.speed.x += c.collisionDetails.e2.dSpeedX;
      c.e2.moving.speed.y += c.collisionDetails.e2.dSpeedY;
      c.e2.moving.speed.angle += c.collisionDetails.e2.dSpeedAngle;
    });
  };

});
