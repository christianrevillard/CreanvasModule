define([], function () {
  
  return function (system) {
    
    system.clientChannel.on('elementsUpdated', function (msg) {
      var data = JSON.parse(msg);
      
      data.forEach(function (updated) {
        var el = system.elements.filter(function (e) { return e.id == updated.id; })[0];
        
        if (updated.deleted) {
          if (el) {
            system.removeElementById(updated.id);
          }
          return;
        }
        
        var insert = el === undefined;
        
        el = el || {};
        
        for (var property in updated) {
          if (updated.hasOwnProperty(property) && updated[property] !== undefined) {
            el[property] = updated[property];
          }
        }
        if (el.type && (!el.elementType || el.elementType.typeName != el.type)) {
          el.elementType = system.elementTypes.filter(function (e) { return e.typeName == el.type; })[0];
        }
        
        if (insert) { system.elements.push(el);}        
      });
      
      needRedraw = true;
    });
  };
});