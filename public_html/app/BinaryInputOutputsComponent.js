define(['./GateOutputsComponent'], function (GateOutputsComponent) {
    function BinaryInputOutputsComponent(object) {
		GateOutputsComponent.apply(this, arguments);
		/* this._object = object;
		this._outputs = new Map();
		this._isOutputInverted = false; */
	}
	
	BinaryInputOutputsComponent.prototype = Object.create(GateOutputsComponent.prototype);
	BinaryInputOutputsComponent.prototype.constructor = BinaryInputOutputsComponent;
	
	BinaryInputOutputsComponent.prototype.invertOutput = function() {
		//do nothing
	};
	
	return BinaryInputOutputsComponent;
});