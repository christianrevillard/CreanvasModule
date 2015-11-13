define(function () {
  
  return function (e1, e2) {
    return {
      areColliding : function () {
        
        var distance = Math.sqrt(
          (e1.position.x - e2.position.x) * (e1.position.x - e2.position.x) +
			(e1.position.y - e2.position.y) * (e1.position.y - e2.position.y));
        return distance < (e1.circular.currentRadius() + e2.circular.currentRadius());
      },
      
      getCollisionPoint : function () {
        return e1.solid.getCollisionPoint(e2.position.x, e2.position.y);
      }
    };
  };
});