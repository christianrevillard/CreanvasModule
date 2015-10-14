// this does not need to know about communication.
// Use only events to communicate
// can pass a set of eventhandlers for browser usage, not supporting EventEmitter



// keep collection of elements, make time to pass, that is all

// comment passer les résultats? dependency? 

define(
  ['./CreJsElement', './null'],
  function (creJsElement, collisionSolver) {
    
    var self = this;
    var currentTime = 0;
    var timeScale = 1;
    var time = 0; // seconds
    var nextFrameInterval = 40;
    var timeInterval = 10;

    var round = function (x) { return Math.round(10000 * x) / 10000; }
    
    self.intervals = [];    
    self.paused = true;//!autoStart;
    self.elements = [];    
    self.lastUpdated = 0;    
    
    self.getTime = function () { return time; };
    
    self.setInterval = function (intervalFunction, time) {
      this.intervals.push(setInterval(intervalFunction, time));
    };
        
    self.processNextFrame = function () {
      if (self.paused)
        return;

      var start = (new Date()).getTime();
      
      var currentTime = self.getTime();
      var dt = currentTime - self.lastUpdated;
      this.lastUpdated = currentTime;
      
      // for solid. for other, just move.
      this.updatePositions(dt);
      if (!collisionSolver) {
        this.commitMoves();
      }
      else {
        //var collisions = this.collisionSolver.solveCollisions(this.elements.filter(function (e) { return e.solid; }));
        //this.commitMoves();
        //this.collisionSolver.updateSpeeds(collisions);
      }
      this.updateClient();
      
      if ((new Date()).getTime() - start > 40)
        console.log("Full frame process time : " + ((new Date()).getTime() - start) + ": this is too long.");
    };  
    
    self.updatePositions = function (dt) {
      self
		.elements
    .filter(function (e) { return e.moving; })
		.forEach(
        function (e) {
          e.moving.updatePosition(dt);
        }
      );
    };
    
    self.commitMoves = function () {
      this
	.elements
		.filter(function (e) { return e.moving; })
		.forEach(
        function (e) {
          e.moving.commitMove();
        }
      );
    };
    
    self.updateClient = function () {
      
      var toUpdate = 
    this
		.elements
		.map(
        function (e) {
          return e.getUpdatedClientData();
        }
      )
		.filter(
        function (updatedData) {
          return updatedData != null;
        }
      );
      
      var toDelete = this.elements.filter(function (e) {
        return e.toDelete;
      });
      
      if (toUpdate.length > 0 || toDelete.length > 0) {
        this.applicationInstanceEmit('updateClientElements', {
          updates : toUpdate,
          deletes : toDelete.map(function (e) {
            return {
              id : e.id
            };
          })
        });
        
        toDelete.forEach(function (e) {
          this.removeElement(e);
        });
      }
    };
  
    
    
    // start the stuff !        
    // start time
    self.setInterval(function () {
      if (self.paused)
        return;
      time += timeInterval / 1000 * timeScale;
    }, timeInterval);
    
    // start frame processing
    self.setInterval(
      function () { self.processNextFrame(); }, 
		nextFrameInterval);    
  }
);



var Controller = function(autoStart) {
	

};



Controller.prototype.getElementById = function(id) {
	var els = this.elements.filter(function(e) {
		return e.id == id;
	});
	if (els.length == 0)
		return null;
	return els[0];
};

Controller.prototype.getElementByTouchIdentifier = function(socketId, touchId) {
	var byIdentifier = this.elements.filter(function(e) {
		return e.touchIdentifier == touchId && e.originSocketId == socketId;
	});
	return byIdentifier.length > 0 ? byIdentifier[0] : null;
};

Controller.prototype.add = function(element){
	this.elements.push(element);
	return element;	
};

Controller.prototype.addElement = function(elementTemplate) {
	return this.add(new serverElement.Element(this, elementTemplate));
};

Controller.prototype.addCircle = function(elementTemplate) {
	return this.add(new circle.CircleElement(this, elementTemplate));
};

Controller.prototype.addAxeAlignedBox = function(elementTemplate) {
	return this.add(new aab.AxeAlignedBox(this, elementTemplate));
};

Controller.prototype.stop = function() {	
	if (this.intervals)
	{
		this.intervals.forEach(function(interval){
			//console.log("cleanInterval: " + interval);
			clearInterval(interval);
			});
	}
	this.intervals = [];
};



Controller.prototype.pause = function() {
	this.paused = true;	
};

Controller.prototype.resume = function() {
	this.paused = false;	
};

exports.Controller = Controller;
