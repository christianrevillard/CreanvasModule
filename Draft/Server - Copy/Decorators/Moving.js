var applyTo = function(element, elementMoving)
{	
	console.log('Applying moving');	
	element.moving = new MovingElement(element, elementMoving);		
}		

var MovingElement = function(parent, elementMoving)
{	
	var moving = this;
	
	moving.parent = parent;
	
	elementMoving.speed = elementMoving.speed || {};
	
	moving.speed = {
		x: elementMoving.speed.x || 0, 
		y: elementMoving.speed.y || 0, 
		angle: elementMoving.speed.angle || 0
	};
	
	elementMoving.acceleration = elementMoving.acceleration || {};

	moving.acceleration = { 
		x: elementMoving.acceleration.x || 0, 
		y: elementMoving.acceleration.y || 0,
		angle: elementMoving.acceleration.angle || 0
	};

	elementMoving.scaleSpeed = elementMoving.scaleSpeed || {};

	moving.scaleSpeed = { 
		x: elementMoving.scaleSpeed.x || 0, 
		y: elementMoving.scaleSpeed.y || 0
	};

	elementMoving.movingLimits = elementMoving.movingLimits || {};

	moving.movingLimits = {
		vMax: elementMoving.movingLimits.vMax === 0 ? 0 : elementMoving.movingLimits.vMax || Infinity,
		vxMax: elementMoving.movingLimits.vxMax === 0 ? 0 : elementMoving.movingLimits.vxMax || Infinity,
		vyMax: elementMoving.movingLimits.vyMax === 0 ? 0 : elementMoving.movingLimits.vyMax || Infinity,
		vxMin: elementMoving.movingLimits.vxMin || 0,
		vyMin: elementMoving.movingLimits.vyMin || 0,
		xMin: elementMoving.movingLimits.xMin === 0 ? 0 : elementMoving.movingLimits.xMin || -Infinity,
		yMin: elementMoving.movingLimits.yMin === 0 ? 0 : elementMoving.movingLimits.yMin || -Infinity,
		xMax: elementMoving.movingLimits.xMax === 0 ? 0 : elementMoving.movingLimits.xMax || Infinity,
		yMax: elementMoving.movingLimits.yMax === 0 ? 0 : elementMoving.movingLimits.yMax || Infinity
	};
	
	moving.lastUpdated = moving.parent.controller.getTime();
};

// do not take previous here, do it at caller

MovingElement.prototype.commitMove = function()
{	
	if(!this.dt)
		return;
		
//	console.log('Commiting move for dt = ' + this.dt + ' at ' + this.parent.position.x + ',' + this.parent.position.y);

	if (!this.wasAdjusted){
		this.speed.x += this.acceleration.x * this.dt;
		this.speed.y += this.acceleration.y * this.dt;
		this.speed.angle += this.acceleration.angle * this.dt;
	}
	
	if (this.movingLimits.vxMax && Math.abs(this.speed.x)>this.movingLimits.vxMax){
		this.speed.x = this.speed.x / Math.abs(this.speed.x) * this.movingLimits.vxMax
	}

	if (this.movingLimits.vyMax && Math.abs(this.speed.y)>this.movingLimits.vyMax){
		this.speed.y = this.speed.y / Math.abs(this.speed.y) * this.movingLimits.vyMax
	}

	if (this.movingLimits.vxMin && Math.abs(this.speed.x)<this.movingLimits.vxMin){
		this.speed.x = this.speed.x ===0 ? this.movingLimits.vxMin : this.speed.x / Math.abs(this.speed.x) * this.movingLimits.vxMin
	}

	if (this.movingLimits.vyMin && Math.abs(this.speed.y)<this.movingLimits.vyMin){
		this.speed.y =  this.speed.y ===0 ? this.movingLimits.vyMin : this.speed.y / Math.abs(this.speed.y) * this.movingLimits.vyMin
	}

	//console.log('new speed is ' + this.speed.y + ' at ' + this.parent.position.y);

	this.originalPosition = null;
	this.originalScale = null;
	this.originalBoundaryBox = null;
	this.wasAdjusted = false;
	
	this.dt = null;	
	this.maxDt = null;
	/*var ec = this.parent.solid.mass * this.speed.y * this.speed.y / 2;
	var ep = this.parent.solid.mass * 100 * (500-this.parent.position.y);
	console.log ("E: " + Math.round(ec + ep) + " (ec: " + Math.round(ec) + ", ep: " + Math.round(ep) + ") - y: " + Math.round(this.parent.position.y) + 
			' - vy: ' + Math.round(this.speed.y) +
			' - ay: ' + this.acceleration.y);
	console.log ();*/
};

MovingElement.prototype.updatePosition = function(dt) {	

	var useAcceleration = 1;
	if (this.originalPosition){
		this.wasAdjusted = true;
		useAcceleration = 0;
	}
	
	if (this.targetElementX == undefined && this.speed.x==0 && this.speed.y==0 && this.speed.angle==0 && this.acceleration.x==0 && this.acceleration.y==0 && this.acceleration.angle==0) // tood add scale
	{
		this.dt=0;

		this.bigBoundaryBox = this.parent.boundaryBox = this.parent.getBoundaryBox();
			
		return;
	}

	// Can do something when originalPoistion is not null.
	this.originalPosition = this.originalPosition || this.parent.position;	
	this.originalScale = this.originalScale|| this.parent.scale;	
	this.originalBoundaryBox = this.originalBoundaryBox || this.parent.boundaryBox;	
	
	this.dt = dt;

	this.maxDt  = this.maxDt || dt;
	
	if (this.targetElementX !== undefined)
	{
	//	console.log("Moving to target " + this.targetElementX + "," + this.targetElementY + " (" + dt + ")" );
		
		var maxDistance = this.movingLimits.vMax * dt;
		var actualDistance = Math.sqrt(
				(this.targetElementX- this.originalPosition.x)*(this.targetElementX- this.originalPosition.x)+
				(this.targetElementY- this.originalPosition.y)*(this.targetElementY- this.originalPosition.y));
		var k=1;
		
		if (actualDistance>maxDistance)
			k = maxDistance/actualDistance;
		
		var dX = dt/this.maxDt*(this.targetElementX- this.originalPosition.x)*k;
			var  dY = dt/this.maxDt*(this.targetElementY- this.originalPosition.y)*k;
		
		this.speed ={
				x:dX/dt,
				y:dY/dt,
				angle:0		
		};
		
		this.parent.position = {
				x: this.originalPosition.x + dX,
				y: this.originalPosition.y + dY,
				angle: this.originalPosition.angle
		};
	}	
	else {
		this.parent.position = {
			x: this.originalPosition.x + (this.speed.x  + useAcceleration*this.acceleration.x * dt/2) * dt,
			y: this.originalPosition.y + (this.speed.y + useAcceleration*this.acceleration.y * dt/2) * dt,
			angle: this.originalPosition.angle + (this.speed.angle + useAcceleration*this.acceleration.angle * dt/2) * dt
		};
	}
	this.parent.scale = {
		x: this.originalScale.x + (this.scaleSpeed?this.scaleSpeed.x * dt : 0),
		y: this.originalScale.y + (this.scaleSpeed?this.scaleSpeed.y * dt : 0) 
	};

	if (this.parent.position.x > this.movingLimits.xMax)
	{
		this.parent.position.x = this.movingLimits.xMax; 
	}

	if (this.parent.position.x < this.movingLimits.xMin)
	{
		this.parent.position.x = this.movingLimits.xMin; 
	}

	if (this.parent.position.y > this.movingLimits.yMax) 				
	{
		this.parent.position.y = this.movingLimits.yMax; 
	}

	if (this.parent.position.y < this.movingLimits.yMin) 				
	{
		this.parent.position.y = this.movingLimits.yMin; 
	}
	
	this.parent.boundaryBox = this.parent.getBoundaryBox();
	this.originalBoundaryBox = this.originalBoundaryBox || this.parent.boundaryBox;	

	// only needed with max dt!

	this.bigBoundaryBox = {
		left: Math.min(this.parent.boundaryBox.left, this.originalBoundaryBox.left),
		top: Math.min(this.parent.boundaryBox.top, this.originalBoundaryBox.top),
		right: Math.max(this.parent.boundaryBox.right, this.originalBoundaryBox.right),
		bottom: Math.max(this.parent.boundaryBox.bottom, this.originalBoundaryBox.bottom)
	};
			
	if (this.targetElementX !== undefined)
	{
		//console.log("Target hit " + this.targetElementX + "," + this.targetElementY + " (" + dt + ")" );
 		if ( 
		(this.targetElementX-this.parent.position.x)*(this.targetElementX-this.parent.position.x)<1
		&& (this.targetElementY-this.parent.position.y)*(this.targetElementY-this.parent.position.y) <1)
		{
 			this.targetElementX = this.targetElementY = undefined;
 			this.speed = this.originalSpeed || { x:0, y:0, angle:0};
		}
	}

	//moving.parent.previousTiles = moving.parent.broadTiles;
	
};

exports.applyTo = applyTo;