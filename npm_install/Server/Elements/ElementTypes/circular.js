define(['creanvas/Core/serverBus','modules/Vector'], function (serverBus, Vector) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "elementAdded", 
    function (element) {
        if (element.circular) {
          circular(appBus, element);
        }
      });
  });
  
  var circular = function (appBus, element) {
    console.log('setting up circular');
    var radius = element.circular.radius;
    
    element.isPointInElement = function (x, y) {
      return element.position && ((x - element.position.x) * (x - element.position.x) + (y - element.position.y) * (y - element.position.y) < radius * radius);
    };
    
    element.isInTile = function (tile) {
      var pending = element.pending || element;
      var left = Math.min(element.position.x - radius, pending.position.x - radius);
      var right = Math.max(element.position.x + radius, pending.position.x + radius);
      var top = Math.min(element.position.y - radius, pending.position.y - radius);
      var bottom = Math.max(element.position.y + radius, pending.position.y + radius);
      
      return left <= tile.right && right >= tile.left && top <= tile.bottom && bottom >= tile.top;
    };
    
    element.getCollisionPoint = function (x, y) {
      var distance = Math.sqrt((this.position.x - x) * (this.position.x - x) + (this.position.y - y) * (this.position.y - y));
      
      var collisionPoint = distance == 0 ? 
      { x: this.position.x, y: this.position.y } :
		  {
        x: this.position.x + this.circular.radius / distance * (x - this.position.x),
        y: this.position.y + this.circular.radius / distance * (y - this.position.y)
      };
      
      var normalVector = distance == 0 ? 
        new Vector(1, 0):
        new Vector((x - this.position.x) / distance, (y - this.position.y) / distance);
      
      return { collisionPoint: collisionPoint, normalVector: normalVector };
    };
  };
});
