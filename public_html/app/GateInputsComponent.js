define(function () {
    function GateInputsComponent(object) {
		this._object = object;
		this._inputs = new Map();
		this._invertedInputs = [];	//id of invert inputs
	}

	GateInputsComponent.prototype.addWireToInputs = function(wire) {
		if (! (wire instanceof Object)) {			//TODO change to wire
			throw new Error('Invalid parameter');
		}
		if (this._inputs.has(wire.getId())) {
			return false;
		}
		this._inputs.set(wire.getId(), wire);
				
		this._object.correctPosition();
		return true;
	};
	
	GateInputsComponent.prototype.deleteWireFromInputs = function(wire) {
		if (! (wire instanceof Object)) {			//TODO change to wire
			throw new Error('Invalid parameter');
		}
		this._inputs.delete(wire.getId());
		this._invertedInputs = this._invertedInputs.filter(v => v !== wire.getId());
		this._object.correctPosition();
	};
		
	GateInputsComponent.prototype.invertInput = function(id) {
		let input = this._inputs.get(id);
		if (typeof input !== undefined) {
			if (this._invertedInputs.includes(id)) {
				this._invertedInputs = this._invertedInputs.filter(v => v !== id);
			} else {
				this._invertedInputs.push(id);
			}
		}
	};
	
	GateInputsComponent.prototype.getInput = function(id) {
		return this._inputs.get(id);
	};

	GateInputsComponent.prototype.getInputs = function() {
		return this._inputs;
	};
		
	GateInputsComponent.prototype.getInvertedInputs = function() {
		return this._invertedInputs;
	};
	
	GateInputsComponent.prototype.isInputInverted = function(id) {
		return this._invertedInputs.includes(id);
	};
	
	GateInputsComponent.prototype.deleteInputs = function() {
		for (let wire of this._object.getInputs().values()) {		//disconnect wire from inputs
			wire.deleteEnd1();
		}
		this._inputs.clear();
		this._invertedInputs = [];
		this._object.correctPosition();
	};
	
	return GateInputsComponent;
});