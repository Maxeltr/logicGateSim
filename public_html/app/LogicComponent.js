define(function () {
    function LogicComponent(object, type) {
		this._object = object;
		this._availableTypes = ['&', '1'];
		this._type = '&';
		this._reducingType = '&';
		this._isActivated = false;
		this._expression = '';
		
		if (typeof type !== 'string') {
			throw new Error('Invalid parameter id');
		}
		if (this._availableTypes.includes(type)) { 
			this._type = type;
			this._reducingType = type;
		}
	}

	LogicComponent.prototype.and = function() {								//TODO refactor
		let result = true, inputState = false;
		if (this._object.getInputs().size > 0 ) {
			for (let wire of this._object.getInputs().values()) {
				if (typeof wire.getEnd0() !== 'undefined') {
					if (this._object.getInvertedInputs().includes(wire.getId())) {	//if wire is inverted
						inputState = !wire.getEnd0().isActivated();
					} else {
						inputState = wire.getEnd0().isActivated();
					}
					result = result && inputState;
				} else {
					if (this._object.getInvertedInputs().includes(wire.getId())) {
						inputState = true;
					} else {
						inputState = false;
					}
					result = result && inputState;
				}
			}
		} else {
			result = false;
		}
		
		if (this._object.isOutputInverted()) result = !result;

		return result;
	};
		
	LogicComponent.prototype.or = function () {								//TODO refactor
		let result = false, inputState = false;
		if (this._object.getInputs().size > 0 ) {
			for (let wire of this._object.getInputs().values()) {
				if (typeof wire.getEnd0() !== 'undefined') {
					if (this._object.getInvertedInputs().includes(wire.getId())) {
						inputState = !wire.getEnd0().isActivated();
					} else {
						inputState = wire.getEnd0().isActivated();
					}
					result = result || inputState;
				} else {
					if (this._object.getInvertedInputs().includes(wire.getId())) {
						inputState = true;
					} else {
						inputState = false;
					}
					result = result || inputState;
				}
			}
		} else {
			result = false;
		}
		
		if (this._object.isOutputInverted()) result = !result;
		
		return result;
	};
		
	LogicComponent.prototype._getInputState = function() {
		
	};
	
	LogicComponent.prototype.isActivated = function() {
		return this._isActivated;
	};
	
	LogicComponent.prototype.getType = function() {
		return this._type;
	};
	
	LogicComponent.prototype.getReducingType = function() {
		return this._reducingType;
	};
	
	LogicComponent.prototype.setType = function(type) {
		if (this._availableTypes.includes(type)) { 
			this._type = type;
			this._reducingType = type;
		}
	};
	
	LogicComponent.prototype.update = function(seconds, updateNumber) {
		this._object.setUpdateNumber(updateNumber);
		if (this._type === '&') {
			this._isActivated = this.and();
		} else if (this._type === '1') {
			this._isActivated = this.or();
		}
	};
	
	LogicComponent.prototype.getExpression = function() {
		let exp = '(', type;
		if (this._type === '&') {
			type = 'AND';
		} else if (this._type === '1') {
			type = 'OR';
		}
		if (this._object.getInputs().size > 0 ) {
			let i = 0;
			for (let wire of this._object.getInputs().values()) {
				if (typeof wire.getEnd0() !== 'undefined') {
					if (i !==0) exp = exp + ' ' + type + ' ';
					if (this._object.getInvertedInputs().includes(wire.getId())) {	//if wire is inverted
						exp = exp + '!' + 'w' + wire.getEnd0().getUpdateNumber();
					} else {
						exp = exp + 'w' + wire.getEnd0().getUpdateNumber();
					}
				}
				i++;
			}
		}
		this._expression = exp.length !== 1 ? exp + ')' : '';
		
		return this._expression;
	};
	
	return LogicComponent;
});