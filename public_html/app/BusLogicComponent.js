define(function () {
    function BusLogicComponent(object) {
		this._object = object;
		this._isActivated = new Set();
		this._type = 'Bus';
		this._reducingType = 'Bus';
		this._traverseEquation = '';
	}
	
	BusLogicComponent.prototype.isActivated = function() {
		return false;
	};
	
	BusLogicComponent.prototype.isActivated = function(wire) {
		return this._isActivated.has(wire.getId());
	}
	
	BusLogicComponent.prototype.update = function(seconds) {
		let inputId, input;
		for (let wire of this._object.getOutputs().values()) {
			inputId = this._object.getInputIdByName(this._object.getOutputName(wire));
			input = this._object.getInput(inputId);
			if (typeof input !== 'undefined') {
				this._object.getInputState(input) === true ? this._isActivated.add(wire.getId()) : this._isActivated.delete(wire.getId());
			} else {
				this._isActivated.delete(wire.getId())
			}
		}
	};
	
	BusLogicComponent.prototype.getType = function() {
		return this._type;
	};
	
	BusLogicComponent.prototype.getReducingType = function() {
		return this._reducingType;
	};
	
	BusLogicComponent.prototype.setType = function(type) {
		this._type = type;
	};
	
	BusLogicComponent.prototype.getEquation = function() {
		return '';
	};
	
	BusLogicComponent.prototype.getTraverseEquation = function() {
		return this._traverseEquation;
	};
	
	BusLogicComponent.prototype.setTraverseEquation = function(expr) {
		if (typeof expr !== 'string') {
			throw new Error('Invalid parameter');
		}
		this._traverseEquation = expr;
	};
	
	return BusLogicComponent;
});