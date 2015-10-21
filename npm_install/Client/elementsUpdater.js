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

        if (el) {
          el.x = updated["x"] === undefined?el.x:updated["x"];
          el.y = updated["y"] === undefined?el.y:updated["y"];
          el.z = updated["z"] === undefined?el.z:updated["z"];
          //     el.scale.x = updated["scaleX"] === undefined?el.scale.x:updated["scaleX"];
          //   el.scale.y = updated["scaleY"] === undefined?el.scale.y:updated["scaleY"];
          el.angle = updated["angle"] === undefined?el.angle:updated["angle"];
          
          if (updated.type && (!el.elementType || el.elementType.typeName != updated.type)) {
            el.elementType = system.elementTypes.filter(function (e) { return e.typeName == updated.type; })[0];
          }
        }
        else {
          //inserts
          updated.elementType = system.elementTypes.filter(function (e) { return e.typeName == updated.type; })[0];
          system.elements.push({
            id: updated.id,
            x: updated["x"],
            y: updated["y"],
            z: updated["z"],
            //el.scale.x = updated["scaleX"] === undefined?el.scale.x:updated["scaleX"];
            //el.scale.y = updated["scaleY"] === undefined?el.scale.y:updated["scaleY"];
            angle: updated["angle"],
            elementType: updated.type ? system.elementTypes.filter(function (e) { return e.typeName == updated.type; })[0]:null
          });
        }
      });
      
      needRedraw = true;
    });
  };
});