define(function () {
  
  return function (element, otherElement) {
    return {
      areColliding : function () {
        
        var distance = Math.sqrt(
          (element.position.x - otherElement.position.x) * (element.position.x - otherElement.position.x) +
			(element.position.y - otherElement.position.y) * (element.position.y - otherElement.position.y));
        return distance < (element.circular.radius + otherElement.circular.radius);
      },
      
      getCollisionPoint : function () {
        return element.getCollisionPoint(otherElement.position.x, otherElement.position.y);
      }
    };
  };
});