define(function () {
    function Wire(id) {
		this._name = '';
		this._end0 = undefined;
		this._end1 = undefined;
		this._positionComponent;
		this._drawComponent;
		this._textInputComponent;
		this._type = 'Polyline';

		if (typeof id !== 'string') {
			throw new Error('Invalid parameter id');
		}
		this._id = id;
		
	}

	Wire.prototype.getName = function () {
		return this._name;
	};

	Wire.prototype.setName = function (name) {
		this._name = name;
	};
	
	Wire.prototype.getId = function () {
		return this._id;
	};
	
	Wire.prototype.getType = function () {
		return this._type;
	};

	Wire.prototype.getPositionComponent = function () {
		return this._positionComponent;
	};
	
	Wire.prototype.setPositionComponent = function (positionComponent) {
		this._positionComponent = positionComponent;
	};
	
	Wire.prototype.getDrawComponent = function () {
		return this._drawComponent;
	};
		
	Wire.prototype.setDrawComponent = function (drawComponent) {
		this._drawComponent = drawComponent;
	};
	
	Wire.prototype.getTextInputComponent = function () {
		return this._textInputComponent;
	};
	
	Wire.prototype.setTextInputComponent = function (textInputComponent) {
		this._textInputComponent = textInputComponent; 
	};
	
	Wire.prototype.getCoordinates = function () {
		return this._positionComponent.getCoordinates();
	};
	
	Wire.prototype.setCoordinates = function (coordinates) {
		this._positionComponent.setCoordinates(coordinates);
	};
	
	Wire.prototype.getEnd0 = function () {
		return this._end0;
	};

	Wire.prototype.getEnd1 = function () {
		return this._end1;
	};
		
	Wire.prototype.setEnd0 = function (gate) {
		if (! (gate instanceof Object)) {					//TODO Gate?
			throw new Error('Invalid parameter');
		}
		if (typeof this._end0 === 'undefined') {
			this._end0 = gate;
			return true;
		}
		return false;
	};
	
	Wire.prototype.deleteEnd0 = function () {
		this._end0 = undefined;
	};
	
	Wire.prototype.setEnd1 = function (gate) {
		if (! (gate instanceof Object)) {					//TODO Gate?
			throw new Error('Invalid parameter');
		}
		if (typeof this._end1 === 'undefined') {
			this._end1 = gate;
			return true;
		}
		return false;
	};
		
	Wire.prototype.deleteEnd1 = function () {
		this._end1 = undefined;
	};
	
	Wire.prototype.moveEndSegment = function (x, y) {
		this._positionComponent.moveEndSegment(x, y);
	};
	
	Wire.prototype.moveStartSegment = function (x, y) {
		this._positionComponent.moveStartSegment(x, y);
	};
	
	Wire.prototype.isCoordinatesMatch = function(x, y) {
		this._positionComponent.isCoordinatesMatch(x, y);
	};
	
	Wire.prototype.remove = function() {
		this._positionComponent.unsubscribeAll();
		this._textInputComponent.unsubscribeAll();
	};
	
	Wire.prototype.update = function () {
		
	};
	
	Wire.prototype.draw = function (ctx, debug = false) {
		this._drawComponent.draw(ctx, debug);
	};
		
	//Wire.prototype.constructor = Wire;
	
	return Wire;
});