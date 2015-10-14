var DropZone = function(parent, dropzoneData) {
	this.parent = parent;
	this.availableSpots = dropzoneData.availableSpots;
	this.dropX = dropzoneData.dropX;
	this.dropY = dropzoneData.dropY;
	this.droppedElements = [];
};

DropZone.prototype.drop = function(eventData) {

	if (this.availableSpots - this.droppedElements.length <=0) {
		return;
	};
	
	var dropped = eventData.identifierElement;
	
	if (!dropped || !dropped.droppable) {
		console.log((!dropped)?('not found dropped element for identifier '+ eventData.identifierElement):'not droppable');
		return;
	}

	this.droppedElements.push(dropped);
	
	dropped.droppable.dropZone = this.parent;
	
	console.log('Dropping ' + dropped.id  + ' at (' + dropped.position.x +',' + dropped.position.y +')');
	
	if (this.dropX) dropped.position.x = this.dropX;
	if (this.dropY) dropped.position.y = this.dropY;
	
	console.log('Adjusted ' + dropped.id + ' to (' + dropped.position.x + ',' + dropped.position.y + ')');

	if (dropped.droppable.onDrop)
		dropped.droppable.onDrop(this.parent, dropped);
	
	return false;	
};

DropZone.prototype.drag = function(dropped)
{
	this.droppedElements = this.droppedElements.filter(function(e){ return e.id != dropped.id;});
	dropped.droppable.dropZone = null;
};

var applyTo = function(element, dropzoneData)
{
	element.dropZone = new DropZone(element, dropzoneData);
		
	element.addEventListener(
		'pointerUp',
		function(eventData) { return element.dropZone.drop(eventData); });	
};

exports.applyTo = applyTo;