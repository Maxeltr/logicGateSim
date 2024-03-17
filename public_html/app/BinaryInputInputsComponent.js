define(function () {
    function BinaryInputInputsComponent(object) {
		this._object = object;
		this._inputs = new Map();
		this._invertedInputs = [];
	}
	
	BinaryInputInputsComponent.prototype.addWireToInputs = function(wire) {
		//do nothing
	};
	
	BinaryInputInputsComponent.prototype.deleteWireFromInputs = function(wire) {
		//do nothing
	};
		
	BinaryInputInputsComponent.prototype.invertInput = function(id) {
		//do nothing
	};
	
	BinaryInputInputsComponent.prototype.getInput = function(id) {
		return this._inputs.get(id);
	};

	BinaryInputInputsComponent.prototype.getInputs = function() {
		return this._inputs;
	};
		
	BinaryInputInputsComponent.prototype.getInvertedInputs = function() {
		return this._invertedInputs;
	};
	
	BinaryInputInputsComponent.prototype.isInputInverted = function(id) {
		return false;
	};

	BinaryInputInputsComponent.prototype.deleteInputs = function() {
		//do nothing
	};
	
	BinaryInputInputsComponent.prototype.getInputState = function(wire) {
		return false;
	}
	
	return BinaryInputInputsComponent;
});