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
      position: { x: 200, y: 0, z: -100 },
      speed: { x: 50, y: 0 },
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
      id: 'O4',
      type: 'O',
      solid: {},
      position: { x: -400, y: 250, z: -100 },
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
      id: 'O5',
      type: 'O',
      solid: {},
      position: { x: -200, y: 250, z: -100 },
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
      id: 'O6',
      type: 'O',
      solid: {},
      position: { x: 0, y: 250, z: -100 },
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
      id: 'O7',
      type: 'O',
      solid: {},
      position: { x: -150, y: -300, z: -100 },
      speed: { x: 50, y: 20 },
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
      id: 'O8',
      type: 'O',
      solid: {},
      position: { x: 450, y: 300, z: -100 },
      speed: { x: -50, y: -20 },
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