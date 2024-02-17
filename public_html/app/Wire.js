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
	
	Wire.prototype = {
		getName: function () {
			return this._name;
		},
	
		setName: function (name) {
			this._name = name;
		},
		
		getId: function () {
			return this._id;
		},
		
		getType: function () {
			return this._type;
		},
	
		getPositionComponent: function () {
			return this._positionComponent;
		},
		
		setPositionComponent: function (positionComponent) {
			this._positionComponent = positionComponent;
		},
		
		getDrawComponent: function () {
			return this._drawComponent;
		},
		
		setDrawComponent: function (drawComponent) {
			this._drawComponent = drawComponent;
		},
		
		getTextInputComponent: function () {
			return this._textInputComponent;
		},
		
		setTextInputComponent: function (textInputComponent) {
			this._textInputComponent = textInputComponent; 
		},
		
		getCoordinates: function () {
			return this._positionComponent.getCoordinates();
		},
		
		setCoordinates: function (coordinates) {
			this._positionComponent.setCoordinates(coordinates);
		},
		
		getEnd0: function () {
			return this._end0;
		},
	
		getEnd1: function () {
			return this._end1;
		},
		
		setEnd0: function (gate) {
			if (! (gate instanceof Object)) {					//TODO Gate?
				throw new Error('Invalid parameter');
			}
			if (typeof this._end0 === 'undefined') {
				this._end0 = gate;
				return true;
			}
			return false;
		},
		
		deleteEnd0: function () {
			this._end0 = undefined;
		},
		
		setEnd1: function (gate) {
			if (! (gate instanceof Object)) {					//TODO Gate?
				throw new Error('Invalid parameter');
			}
			if (typeof this._end1 === 'undefined') {
				this._end1 = gate;
				return true;
			}
			return false;
		},
		
		deleteEnd1: function () {
			this._end1 = undefined;
		},
		
		moveEndSegment: function (x, y) {
			this._positionComponent.moveEndSegment(x, y);
		},
		
		moveStartSegment: function (x, y) {
			this._positionComponent.moveStartSegment(x, y);
		},
		
		isCoordinatesMatch: function(x, y) {
			this._positionComponent.isCoordinatesMatch(x, y);
		},
		
		remove: function() {
			this._positionComponent.unsubscribeAll();
			this._textInputComponent.unsubscribeAll();
		},
		
		update: function () {
			
		},
		
		draw: function (ctx, debug = false) {
			this._drawComponent.draw(ctx, debug);
		},
		
	};
	Wire.prototype.constructor = Wire;
	
	return Wire;
});