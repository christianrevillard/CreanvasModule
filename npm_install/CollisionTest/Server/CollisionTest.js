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
      box: { left:-Infinity, right:5, top:-Infinity, bottom: Infinity }
    });
   Infinity
    app.addElement({
      id: 'rightwall',
      type: 'Vertical',
      solid: { coefficient: 0.5, staticFriction: 0.7, dynamicFriction: 0.5 },
      mass: Infinity,
      speed: {},
      position: { x: 800, y: 0, z: -100 },
      box: { left: -5, right: Infinity, top: -Infinity, bottom: Infinity }
    });
    
    app.addElement({
      id: 'topwall',
      type: 'Horizontal',
      solid: { coefficient: 0.5, staticFriction: 0.7, dynamicFriction: 0.5 },
      mass: Infinity,
      speed: {},
      position: { x: 0, y: -500, z: -100 },
      box: { left: -Infinity, right: Infinity, top: -Infinity, bottom: 5 }
    });

    app.addElement({
      id: 'bottomwall',
      type: 'Horizontal',
      solid: { coefficient: 0.5, staticFriction: 0.7, dynamicFriction: 0.5 },
      mass: Infinity,
      speed: {},
      position: { x: 0, y: 500, z: -100 },
      box: { left: -Infinity, right: Infinity, top: -5, bottom: Infinity }
    });
        
    updateBumperScale = function (element, max, dt) {
      element.customScaleSpeed = element.customScaleSpeed || 0;
      element.scale = element.lastCommited.scale + element.customScaleSpeed * dt;
      if (element.scale > max && element.customScaleSpeed > 0) {
        element.customScaleSpeed = -element.customScaleSpeed;
      } else if (element.scale < 1 && element.customScaleSpeed < 0) {
        element.customScaleSpeed = 0;
        element.scale = 1;
      }
    };


    app.addElement({
      id: 'O1',
      type: 'O',
      solid: { coefficient: 0.5, staticFriction: 0.7, dynamicFriction: 0.5 },
      mass: Infinity,
      position: { x: 0, y: 0, z: -100 },
      speed: { x: 0, y: 0, angle:Math.PI/2},
      circular: { radius: 50 },
      events: { moveCommitted: function (e, dt) { updateBumperScale(this, 2, dt); } },
      onClick: function(){          
        this.customScaleSpeed = 10;
      }
    });
    
    app.addElement({
      id: 'O2',
      type: 'O',
      solid: { coefficient: 1, staticFriction: 0.7, dynamicFriction: 0.5 },
      mass: 10,
      position: { x: 120, y: 0, z: -100 },
      circular: { radius: 50 },
      limits: { speed: { angle: [-2 * Math.PI, 2 * Math.PI] } }
    });
    
    app.addElement({
      id: 'O3',
      type: 'HeavyKeep',
      solid: { coefficient: 1, staticFriction: 0.7, dynamicFriction: 0.5 },
      mass: 10,
      draggable: {speed:'keep', dropOnCollision:true},
      position: { x: -400, y: -250, z: -100 },
      speed: { x: 50, y: -50, angle: Math.PI/4 },
      circular: { radius: 50 },
      limits: {
        speed: { v: [0, 1000], angle: [-2 * Math.PI, 2 * Math.PI] }
      },
      events: { moveCommitted: function (e, dt) { updateBumperScale(this, 2, dt); } },
      onDoubleClick: function () {
        this.customScaleSpeed = 10;
      }
    });
    
    app.addElement({
      id: 'O4',
      type: 'HeavyNone',
      solid: { coefficient: 1, staticFriction: 0.7, dynamicFriction: 0.5 },
      mass: 100,
      position: { x: -400, y: 50, z: -100 },
      speed: { x: 50, y: -50 },
      circular: { radius: 50 },
      limits: {
        position: { x: [-600, 600], y: [-300, 300] },
        speed: { v: [0, 1000], angle: [-2 * Math.PI, 2 * Math.PI] }
      }
    });
    
    app.addElement({
      id: 'O5',
      type: 'O',
      solid: { coefficient: 1, staticFriction: 0.7, dynamicFriction: 0.5 },
      mass: 10,
      position: { x: -200, y: 150, z: -100 },
      speed: { x: -50, y: -50, angle:2*Math.PI },
      circular: { radius: 30},
      limits: {
        position: { x: [-400, 0], y: [0, 300] },
        speed: { angle: [-2 * Math.PI, 2 * Math.PI] }
      }
    });
    
    app.addElement({
      id: 'O6',
      type: 'O',
      solid: { coefficient: 1, staticFriction: 0.7, dynamicFriction: 0.5 },
      mass: 10,
      position: { x: 0, y: 250, z: -100 },
      speed: { x: 50, y: 50, angle: -Math.PI },
      circular: { radius: 80 },
      limits: { speed: { angle: [-2 * Math.PI, 2 * Math.PI] } }
    });
    
    app.addElement({
      id: 'O7',
      type: 'O',
      solid: { coefficient: 1, staticFriction: 0.7, dynamicFriction: 0.5 },
      mass: 10,
      position: { x: -150, y: -300, z: -100 },
      speed: { x: 50, y: 20 },
      circular: { radius: 30 },
      limits: { speed: { angle: [-2 * Math.PI, 2 * Math.PI] } }
    });
    
    app.addElement({
      id: 'O8',
      type: 'O',
      solid: { coefficient: 1, staticFriction: 0.7, dynamicFriction: 0.5 },
      mass: 10,
      position: { x: 450, y: 300, z: -100 },
      speed: { x: -50, y: -20 },
      circular: { radius: 90 },
      limits: { speed: { angle: [-2 * Math.PI, 2 * Math.PI] } }
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