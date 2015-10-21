var DEBUG = true;

define(
  ['client/system', 'client/elementsDisplayer', 'client/elementsUpdater', 'client/clientEvents'], 
  function (creanvasSystem, displayer, updater, events) {
  
  return function (parameters) {
      var system = creanvasSystem(parameters);
    displayer(system);
    updater(system);
    events(system);

    var addBackground = function (draw) {
      system.removeElementById(0);
      
      draw = draw || function (context) {
        context.fillStyle = "#FFF";
        context.fillRect(system.left, system.top, system.right - system.left, system.bottom - system.top);
      };
      
      var background = system.elements.push({
        'id': 0,
        'name': 'background',
        'elementType': { draw: draw },
        'x': 0, 
        'y': 0, 
        'z': -Infinity
      });
    };
    
    addBackground(parameters.background);
  };
});




