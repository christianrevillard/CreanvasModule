define(['modules/Vector'], function (Vector) {
  /*
 * Represents a collision between a circle and a box
 */

  var cornerCollision = function(circle, cornerX, cornerY) {
    var distance = Math.sqrt(
      (cornerX - circle.position.x) * (cornerX - circle.position.x) +
			(cornerY - circle.position.y) * (cornerY - circle.position.y));
    
    return distance < circle.circular.radius;
  };

  return function (box, circle, reverse) {
    return {
      areColliding : function () {
        
        var circleBox = circle.solid.getBoundaryBox();
        var boxBox = box.solid.getBoundaryBox();
        
    if (circleBox.right < boxBox.left)
      return false;
    
    if (circleBox.left > boxBox.right)
      return false;
    
    if (circleBox.bottom < boxBox.top)
      return false;
    
    if (circleBox.top > boxBox.bottom)
      return false;
    
    if (
      circle.position.x < boxBox.left && 
      circle.position.y < boxBox.top &&
      !cornerCollision(circle, boxBox.left, boxBox.top))
      return false;
    
    if (
      circle.position.x < boxBox.left && 
      circle.position.y > boxBox.bottom &&
      !cornerCollision(circle, boxBox.left, boxBox.bottom))
      return false;
    
    if (
      circle.position.x > boxBox.right && 
      circle.position.y < boxBox.top &&
      !cornerCollision(circle, boxBox.right, boxBox.top))
      return false;
    
    if (
      circle.position.x > boxBox.right && 
      circle.position.y > boxBox.bottom &&
      !cornerCollision(circle, boxBox.right, boxBox.bottom))
      return false;
        
    return true;
      },
      
      getCollisionPoint : function () {
        
        var circleBox = circle.solid.getBoundaryBox();
        var boxBox = box.solid.getBoundaryBox();
        
        var collision = null;
        
        if (
          circle.position.x < boxBox.left && 
          circle.position.y < boxBox.top)
          collision = circle.getCollisionPoint(boxBox.left, boxBox.top);
        
        if (
          circle.position.x < boxBox.left && 
          circle.position.y > boxBox.bottom)
          collision = circle.getCollisionPoint(boxBox.left, boxBox.bottom);
        
        if (
          circle.position.x > boxBox.right && 
          circle.position.y < boxBox.top)
          collision = circle.getCollisionPoint(boxBox.right, boxBox.top);
        
        if (
          circle.position.x > boxBox.right && 
          circle.position.y > boxBox.bottom)
          collision = circle.getCollisionPoint(boxBox.right, boxBox.bottom);
        
        if (circle.position.x < boxBox.left && !collision)
          collision = {
            collisionPoint: { x: circleBox.right, y: circle.position.y },
            normalVector: new Vector(1, 0, 0)
          };
        
        if (circle.position.x > (boxBox.right)  && !collision)
          collision = {
            collisionPoint: { x: circleBox.left, y: circle.position.y },
            normalVector: new Vector(-1, 0, 0)
          };
        
        if (circle.position.y <(box.position.y +  box.box.top) && !collision)
          collision = {
            collisionPoint: { x: circle.position.x, y: circleBox.bottom },
            normalVector: new Vector(0, 1, 0)
          };
        
        if (circle.position.y > (boxBox.bottom) && !collision)
          collision = {
            collisionPoint: { x: circle.position.x, y: circleBox.top },
            normalVector: new Vector(0, -1, 0)
          };

        // normalVector is always going from circle to the box, reverse whe box was the first element 
        if (reverse) {
          collision.normalVector.x = -collision.normalVector.x;
          collision.normalVector.y = -collision.normalVector.y;
        }

        return collision;
      }
    };
  };
});