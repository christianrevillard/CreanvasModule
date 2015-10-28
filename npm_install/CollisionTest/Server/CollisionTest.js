// Common to node and browser.

define(['creanvas/creanvas'], function (creanvas) {
  self = this;
  
  var testApplication = null;
    
  var startANewOne = function (callback) {
    console.log('Starting a new testApplication');
    
    var elementId = 0;

    var app = creanvas({
      left: -800,
      right: 800,
      top: -500,
      bottom: 500
    });
    
    app.addElement({
      id: 'O1',
      type: 'O',
      solid: {},
      position: { x: 400, y: -250, z: -100 },
      speed: { x: 50, y: -50 },
      circular: { radius: 50 },
      events: {
        moved: function (element) {
          
          if (element.position.x > 800) {
            element.position.x = -800;
          }
          
          if (element.position.x < -800) {
            element.position.x = 800;
          }
          
          if (element.position.y > 500) {
            element.position.y = -500;
          }
          
          if (element.position.y < -500) {
            element.position.y = 500;
          }
        }
      }
    });
    
    app.addElement({
      id: 'O2',
      type: 'O',
      solid: {},
      position: { x: 200, y: 250, z: -100 },
      speed: { x: 50, y: 50 },
      circular: { radius: 50 },
      events: {
        moved: function (element) {
          
          if (element.position.x > 800) {
            element.position.x = -800;
          }
          
          if (element.position.x < -800) {
            element.position.x = 800;
          }
          
          if (element.position.y > 500) {
            element.position.y = -500;
          }
          
          if (element.position.y < -500) {
            element.position.y = 500;
          }
        }
      }
    });
    
    app.addElement({
      id: 'O3',
      type: 'O',
      solid: {},
      position: { x: -400, y: -250, z: -100 },
      speed: { x: -50, y: -50 },
      circular: { radius: 50 },
      events: {
        moved: function (element) {
          
          if (element.position.x > 800) {
            element.position.x = -800;
          }
          
          if (element.position.x < -800) {
            element.position.x = 800;
          }
          
          if (element.position.y > 500) {
            element.position.y = -500;
          }
          
          if (element.position.y < -500) {
            element.position.y = 500;
          }
        }
      }
    });
    
    app.addElement({
      id: 'O4',
      type: 'O',
      solid: {},
      position: { x: -400, y: 250, z: -100 },
      speed: { x: -50, y: 50 },
      circular: { radius: 50 },
      events: {
        moved: function (element) {
          
          if (element.position.x > 800) {
            element.position.x = -800;
          }
          
          if (element.position.x < -800) {
            element.position.x = 800;
          }
          
          if (element.position.y > 500) {
            element.position.y = -500;
          }
          
          if (element.position.y < -500) {
            element.position.y = 500;
          }
        }
      }
    });

    testApplication = {
      app: app,
      connect: function (clientChannel) {
        return app.connect(clientChannel);
      }
    };
    callback(testApplication);
  };
  
  return {
    
    getApplication: function (callback) {
      if (!testApplication) {
        console.log('testApplicaton: need a new one!');
        startANewOne(callback);
      }
      else {
        callback(testApplication);
      }
    }
  };
});