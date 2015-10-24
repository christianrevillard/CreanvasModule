define(['creanvas/Core/serverBus'], function (serverBus) {
  
  serverBus.on('applicationCreated', function (appBus) {
    appBus.on(
      "elementAdded", 
    function (element) {
        if (element.onClick || element.onDoubleClick) {
          clickable(appBus, element);
        }
      });
  });
  
  var clickable = function (appBus, element) {
    console.log('setting up clickable');
        
    element.on('elementEvent', function (event) {
      
      if (event.eventId === 'click' && element.onClick) {
        console.log('clickable.onClick');
        element.onClick();
      }
      else if (event.eventId === 'doubleclick' && element.onDoubleClick) {
        console.log('clickable.onDoubleClick');
        element.onDoubleClick();
      }
    });
  };
});
