define(['./Gate'], function (Gate) {
    function Trigger(id, x, y) {
		Gate.apply(this, arguments);
	}
	
	Trigger.prototype = Object.create(Gate.prototype);
	Trigger.prototype.constructor = Trigger;
	
	Trigger.prototype.setOption = function (propertyName, propertyValue) {
		if (propertyName === 'name') {
			this.setName(propertyValue + '');
		} else if (propertyName === 'dominant') {
			this.setDominantInput(propertyValue);
		}
	};
	
	Trigger.prototype.getSetInput = function() {
		return this._inputsComponent.getSetInput();
	};
	
	Trigger.prototype.getResetInput = function() {
		return this._inputsComponent.getResetInput();
	};
	
	Trigger.prototype.setSetInput = function(wire) {
		return this._inputsComponent.setSetInput(wire);
	};
	
	Trigger.prototype.setResetInput = function(wire) {
		return this._inputsComponent.setResetInput(wire);
	};
	
	Trigger.prototype.setDominantInput = function(value) {
		return this._inputsComponent.setDominantInput(value);
	};
	
	Trigger.prototype.getDominantInput = function() {
		return this._inputsComponent.getDominantInput();
	};
	
	return Trigger;
});