define(['./GateInputsComponent'],function (GateInputsComponent) {
    function TriggerInputsComponent(object) {
		GateInputsComponent.apply(this, arguments);
		this._setInputId = undefined;
		this._resetInputId = undefined;
		this._dominantInput = 'reset';
	}
	
	TriggerInputsComponent.prototype = Object.create(GateInputsComponent.prototype);
	TriggerInputsComponent.prototype.constructor = TriggerInputsComponent;
	
	TriggerInputsComponent.prototype.addWireToInputs = function(wire) {
		if (! (wire instanceof Object)) {			//TODO change to wire
			throw new Error('Invalid parameter');
		}
		if (this._inputs.has(wire.getId()) || this._inputs.size > 1) {
			return false;
		}
		
		let polyline = wire.getCoordinates();
		let polylineLength = polyline.length;
		if (this._object.getPositionComponent().isSecondQuadrantCoordinatesMatch(polyline[polylineLength - 2], polyline[polylineLength - 1])) { //TODO refactor
			this.setSetInput(wire);
		} else {
			this.setResetInput(wire);
		}

		this._object.correctPosition();
		
		return true;
	};
	
	TriggerInputsComponent.prototype.deleteWireFromInputs = function(wire) {
		if (! (wire instanceof Object)) {			//TODO change to wire
			throw new Error('Invalid parameter');
		}
		let wireId = wire.getId();
		this._inputs.delete(wireId);
		this._invertedInputs = this._invertedInputs.filter(v => v !== wireId);
		if (this._setInputId === wireId) this._setInputId = undefined;
		if (this._resetInputId === wireId) this._resetInputId = undefined;
		this._object.correctPosition();
	};
		
	TriggerInputsComponent.prototype.getSetInput = function() {
		return this._object.getInput(this._setInputId);
	};
	
	TriggerInputsComponent.prototype.getResetInput = function() {
		return this._object.getInput(this._resetInputId);
	};
	
	TriggerInputsComponent.prototype.setSetInput = function(wire) {
		if (typeof this._setInputId === 'undefined') {
			this._setInputId = wire.getId();
			this._inputs.set(wire.getId(), wire);
			return true;
		}
		return false;
	};
	
	TriggerInputsComponent.prototype.setResetInput = function(wire) {
		if (typeof this._resetInputId === 'undefined') {
			this._resetInputId = wire.getId();
			this._inputs.set(wire.getId(), wire);
			return true;
		}
		return false;
	};
	
	TriggerInputsComponent.prototype.setDominantInput = function(value) {
		if (value === 'reset' || value === 'set') {
			this._dominantInput = value;
		} 
	};
	
	TriggerInputsComponent.prototype.getDominantInput = function() {
		return this._dominantInput;
	};
	
	return TriggerInputsComponent;
});