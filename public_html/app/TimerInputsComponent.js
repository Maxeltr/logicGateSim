define(['./GateInputsComponent'],function (GateInputsComponent) {
    function TimerInputsComponent(object) {
		GateInputsComponent.apply(this, arguments);
	}
	
	TimerInputsComponent.prototype = Object.create(GateInputsComponent.prototype);
	TimerInputsComponent.prototype.constructor = TimerInputsComponent;
	
	TimerInputsComponent.prototype.addWireToInputs = function(wire) {
		if (! (wire instanceof Object)) {			//TODO change to wire
			throw new Error('Invalid parameter');
		}
		if (this._inputs.has(wire.getId()) || this._inputs.size >= 1) {
			return false;
		}
		this._inputs.set(wire.getId(), wire);
				
		this._object.correctPosition();
		return true;
	};
	
	return TimerInputsComponent;
});