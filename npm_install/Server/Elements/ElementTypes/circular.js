define(['creanvas/Core/serverBus'], function (serverBus) {
  
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

    element.on('isPointInElement', function (x, y, onMatch) {
      if (element.position && ((x - element.position.x) * (x - element.position.x) + (y - element.position.y) * (y - element.position.y) < radius * radius)) { onMatch();};
    });

    element.on('isInTile', function (tile, onMatch) {
      var pending = element.pending || element;
      var left = Math.min(element.position.x - radius, pending.position.x - radius);
      var right = Math.max(element.position.x + radius, pending.position.x + radius);
      var top = Math.min(element.position.y - radius, pending.position.y - radius);
      var bottom = Math.max(element.position.y + radius, pending.position.y + radius);

      if (left <= tile.right && right >= tile.left && top <= tile.bottom && bottom >= tile.top) {
    //    console.log(element.id, left, right, top, bottom, ' IN ', tile.left, tile.right, tile.top, tile.bottom);
        onMatch();
      }
      else {
   //     console.log(left, right, top, bottom, ' NOT IN ', tile.left, tile.right, tile.top, tile.bottom);
      }
    });
  };
});
