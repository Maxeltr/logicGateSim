define(function () {
    function GateOutputsComponent(object) {
		this._object = object;
		this._outputs = new Map();
		this._isOutputInverted = false;
	}

	GateOutputsComponent.prototype.addWireToOutput = function(wire) {
		if (! (wire instanceof Object)) {			//TODO change to 
			throw new Error('Invalid parameter');
		}
		if (this._outputs.has(wire.getId())) {
			return false;
		}
		this._outputs.set(wire.getId(), wire);
		this._object.correctPosition();
		return true;
	};
	
	GateOutputsComponent.prototype.deleteWireFromOutput = function(wire) {
		if (! (wire instanceof Object)) {			//TODO change to 
			throw new Error('Invalid parameter');
		}
		this._outputs.delete(wire.getId());
		this._object.correctPosition();
	};

	GateOutputsComponent.prototype.invertOutput = function() {
		this._isOutputInverted = ! this._isOutputInverted;
	};
		
	GateOutputsComponent.prototype.isOutputInverted = function() {
		return this._isOutputInverted;
	};
	
	GateOutputsComponent.prototype.getOutputs = function() {
		return this._outputs;
	};
	
	return GateOutputsComponent;
});