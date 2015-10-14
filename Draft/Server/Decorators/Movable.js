var moving = require("./Moving");

var MovableElement = function(parent, movableData) {
	this.parent = parent;
	this.isBlocked =  movableData.isBlocked;
	this.alwaysMoving = movableData.alwaysMoving;
	this.suspendMoving = false;
};

MovableElement.prototype.startMoving = function () {
	console.log('startMoving: ' + this.parent.id  + ' from (' + this.parent.position.x +',' + this.parent.position.y +') ');
	
	if (this.isMoving)
		return;
	
	this.isMoving = true;
	this.originalZ = this.parent.position.z;
	this.parent.position.z = this.parent.position.z + 100;	
	this.parent.moving.originalSpeed = this.parent.moving.speed;
};

MovableElement.prototype.stopMoving = function(eventData) {
	console.log('Stop moving ?');	
	if (this.alwaysMoving)
		return;
	
	if (this.isBlocked && this.isBlocked(this.parent, eventData.originSocketId)) 
		return;

    console.log('Stop moving');
	this.isMoving = false;
	this.lastMoved = null;
	this.parent.position.z = this.originalZ;
    console.log('Cleaning' + this.parent.id + ' as touchIdentifier ' + this.parent.touchIdentifier + ' for socket ' + this.parent.originSocketId)
	this.parent.touchIdentifier = null;
	this.parent.originSocketId = null;
	this.parent.moving.speed = this.parent.moving.speed;

	return false;
};

MovableElement.prototype.onPointerDown = function(eventData) {
	console.log('Pointer down');	

	if (this.isMoving)
		return;
	
	if (this.isBlocked && this.isBlocked(this.parent, eventData.originSocketId)) 
		return;

	this.startMoving();
	this.suspendMoving = false;
	this.lastMoved = this.parent.controller.getTime();

	if (eventData.identifierElement) {
        console.log('Cleaning' + eventData.identifierElement.id + ' as touchIdentifier ' + eventData.identifierElement.touchIdentifier + ' for socket ' + eventData.identifierElement.originSocketId)
		eventData.identifierElement.touchIdentifier = null;
		eventData.identifierElement.originSocketId = null;
	}
	
	if (this.parent.droppable && this.parent.droppable.dropZone) {
		this.parent.droppable.dropZone.dropZone.drag(this.parent);
	}
	
	this.parent.touchIdentifier = eventData.touchIdentifier;
	this.parent.originSocketId = eventData.originSocketId;
		
	return false;
};

MovableElement.prototype.onPointerMove = function(eventData) {
//	console.log('Pointer move');	

	if (this.isBlocked && this.isBlocked(this.parent, eventData.originSocketId)) 
		return;

	if (!this.isMoving) {
		return true;
	}
				
	if (this.suspendMoving) {
		if (this.parent.isPointInElementEdges(eventData.x, eventData.y)) {
			this.suspendMoving = false;
		}
		else {
			return false;
		}
	}

	this.parent.moving.targetElementX = eventData.x;  
	this.parent.moving.targetElementY = eventData.y;
	//console.log("Target updated " + this.parent.moving.targetElementX + "," + this.parent.moving.targetElementY);

	return false;
};

var applyTo = function(element, movableData) {
	if (!element.moving)
		moving.applyTo(element, {});

//	console.log('Applying movable');	
	element.movable = new MovableElement(element, movableData);
	
	var controller = element.controller;
	
	element.addEventListener(
		'pointerDown',
		function(eventData) {
			return element.movable.onPointerDown(eventData); });

	element.addEventListener(
		'pointerMove', 
		function(eventData) {
			return element.movable.onPointerMove(eventData); });
	
	element.addEventListener(
		'pointerUp', 
		function(eventData) { 
			return element.movable.stopMoving(eventData); });
};

exports.applyTo = applyTo;