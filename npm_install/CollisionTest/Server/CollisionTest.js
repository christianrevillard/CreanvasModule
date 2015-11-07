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
      id: 'leftwall',
      type: 'Vertical',
      solid: { coefficient: 0.5, staticFriction: 0.7, dynamicFriction: 0.5 },
      mass: Infinity,
      speed: {},
      position: { x: -800, y: 0, z: -100 },
      box: { left:-5, right:5, top:-500, bottom:500 }
    });
    
    app.addElement({
      id: 'rightwall',
      type: 'Vertical',
      solid: { coefficient: 0.5, staticFriction: 0.7, dynamicFriction: 0.5 },
      mass: Infinity,
      speed: {},
      position: { x: 800, y: 0, z: -100 },
      box: { left: -5, right: 5, top: -500, bottom: 500 }
    });
    
    app.addElement({
      id: 'topwall',
      type: 'Horizontal',
      solid: { coefficient: 0.5, staticFriction: 0.7, dynamicFriction: 0.5 },
      mass: Infinity,
      speed: {},
      position: { x: 0, y: -500, z: -100 },
      box: { left: -800, right: 800, top: -5, bottom: 5 }
    });

    app.addElement({
      id: 'bottomwall',
      type: 'Horizontal',
      solid: { coefficient: 0.5, staticFriction: 0.7, dynamicFriction: 0.5 },
      mass: Infinity,
      speed: {},
      position: { x: 0, y: 500, z: -100 },
      box: { left: -800, right: 800, top: -5, bottom: 5 }
    });
    
    app.addElement({
      id: 'O1',
      type: 'O',
      solid: { coefficient: 0.5, staticFriction: 0.7, dynamicFriction: 0.5 },
      mass: 10,
      position: { x: 0, y: 0, z: -100 },
      speed: { x: 0, y: 0, angle:Math.PI/2},
      circular: { radius: 50, minRadius: 20, maxRadius: 100, speedRadius: 50 },
      limits: {
        position: { x: [-110, 110], y: [-110, 110] },
        speed: [0,1000]
      }
    });
    
    app.addElement({
      id: 'O2',
      type: 'O',
      solid: { coefficient: 1, staticFriction: 0.7, dynamicFriction: 0.5 },
      mass: 10,
      position: { x: 200, y: 0, z: -100 },
      speed: { x: 50, y: 0, angle: -Math.PI/4 },
      circular: { radius: 50, minRadius: 10, maxRadius: 100, speedRadius: 50 }
    });
    
    app.addElement({
      id: 'O3',
      type: 'HeavyKeep',
      solid: { coefficient: 1, staticFriction: 0.7, dynamicFriction: 0.5 },
      mass: 10,
      draggable: {speed:'keep', dropOnCollision:true},
      position: { x: -400, y: -250, z: -100 },
      speed: { x: 50, y: -50, angle: Math.PI/4 },
      circular: { radius: 50, minRadius: 30, maxRadius: 200, speedRadius: 30 },
      limits: { speed: [0, 1000]},
      timer: { time: 0.01, eventId: 'newFrame' }
    });
    
    app.addElement({
      id: 'O4',
      type: 'HeavyNone',
      solid: { coefficient: 1, staticFriction: 0.7, dynamicFriction: 0.5 },
      mass: 100,
      draggable: { speed: 'none', dropOnCollision: false },
      position: { x: -400, y: 250, z: -100 },
      speed: { x: 50, y: -50 },
      circular: { radius: 50, minRadius: 10, maxRadius: 100, speedRadius: 40 },
      limits: { speed: [0, 1000]}
    });
    
    app.addElement({
      id: 'O5',
      type: 'O',
      solid: { coefficient: 1, staticFriction: 0.7, dynamicFriction: 0.5 },
      mass: 10,
      position: { x: -200, y: 150, z: -100 },
      speed: { x: -50, y: -50, angle:2*Math.PI },
      circular: { radius: 5, minRadius: 5, maxRadius: 50, speedRadius: 10 },
      limits: {
        position: { x: [-400, 0], y: [0, 300] },
        speed: [0, 1000]
      }
    });
    
    app.addElement({
      id: 'O6',
      type: 'O',
      solid: { coefficient: 1, staticFriction: 0.7, dynamicFriction: 0.5 },
      mass: 10,
      position: { x: 0, y: 250, z: -100 },
      speed: { x: 50, y: 50, angle: -Math.PI },
      circular: { radius: 5, minRadius: 5, maxRadius: 50, speedRadius: 50 }
    });
    
    app.addElement({
      id: 'O7',
      type: 'O',
      solid: { coefficient: 1, staticFriction: 0.7, dynamicFriction: 0.5 },
      mass: 10,
      position: { x: -150, y: -300, z: -100 },
      speed: { x: 50, y: 20 },
      circular: { radius: 5, minRadius: 5, maxRadius: 50, speedRadius: 40 }
    });
    
    app.addElement({
      id: 'O8',
      type: 'O',
      solid: { coefficient: 1, staticFriction: 0.7, dynamicFriction: 0.5 },
      mass: 10,
      position: { x: 450, y: 300, z: -100 },
      speed: { x: -50, y: -20 },
      circular: { radius: 5, minRadius: 10, maxRadius: 30, speedRadius: 5 }
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