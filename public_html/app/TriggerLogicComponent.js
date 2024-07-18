define(function () {
    function TriggerLogicComponent(object) {
		this._object = object;
		this._isActivated = false;
		this._type = 'Trigger';
		this._reducingType = 'RS';
		this._outputState = false;
		this._traverseEquation = '';
	}
	
	TriggerLogicComponent.prototype._getState = function() {
		let setInputState = false, resetInputState = false, setInput, resetInput;
		resetInput = this._object.getResetInput();
		setInput = this._object.getSetInput();
		
		if (typeof resetInput !== 'undefined') {
			resetInputState = this._object.getInputState(resetInput);
		}
		
		if (typeof setInput !== 'undefined') {
			setInputState = this._object.getInputState(setInput);
		}
		
		if (this._object.getDominantInput() === 'reset') {
			if (resetInputState) {
				this._outputState = false;
			} else if (setInputState) {
				this._outputState = true;
			}
		} else {
			if (setInputState) {
				this._outputState = true;
			} else if (resetInputState) {
				this._outputState = false;
			}
		}
		
		
		if (this._object.isOutputInverted()) {
			this._isActivated = !this._outputState;
		} else {
			this._isActivated = this._outputState;
		}
		
	};
	
	TriggerLogicComponent.prototype.isActivated = function() {
		return this._isActivated;
	};
	
	TriggerLogicComponent.prototype.update = function(seconds, updateNumber) {
		this._object.setUpdateNumber(updateNumber);
		this._getState();
	};
	
	TriggerLogicComponent.prototype.getType = function () {
		return this._type;
	};
	
	TriggerLogicComponent.prototype.setType = function (type) {
		return this._type = type;
	};
	
	TriggerLogicComponent.prototype.getReducingType = function() {
		return this._reducingType;
	};
	
	TriggerLogicComponent.prototype.getEquation = function() {
		return 'Trigger';
	};
	
	TriggerLogicComponent.prototype.getTraverseEquation = function() {
		return this._traverseEquation;
	};
	
	TriggerLogicComponent.prototype.setTraverseEquation = function(expr) {
		if (typeof expr !== 'string') {
			throw new Error('Invalid parameter');
		}
		this._traverseEquation = expr;
	};
	
	return TriggerLogicComponent;
});