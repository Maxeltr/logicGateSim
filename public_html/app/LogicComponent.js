define(function () {
    function LogicComponent(object, type) {
		this._object = object;
		this._availableTypes = ['AND', 'OR', 'XOR'];
		this._type = 'AND';
		this._reducingType = '&';
		this._isActivated = false;
		this._equation = '';
		this._traverseEquation = '';
		
		if (typeof type !== 'string') {
			throw new Error('Invalid parameter');
		}
		if (this._availableTypes.includes(type)) { 
			this._type = type;
			this._setReducingType();
		}
	}

	LogicComponent.prototype._setReducingType = function() {	
		if (this._type === 'AND') {
			this._reducingType = '&';
		} else if (this._type === 'OR') {
			this._reducingType = '1';
		} else if (this._type === 'XOR') {
			this._reducingType = '=1';
		}
	};
	
	LogicComponent.prototype.and = function() {								//TODO refactor
		let result = true, inputState = false;
		if (this._object.getInputs().size > 0 ) {
			for (let wire of this._object.getInputs().values()) {
				/* if (typeof wire.getEnd0() !== 'undefined') {
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
				} */
				inputState = this._object.getInputState(wire);
				result = result && inputState;
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
				/* if (typeof wire.getEnd0() !== 'undefined') {
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
				} */
				inputState = this._object.getInputState(wire);
				result = result || inputState;
			}
		} else {
			result = false;
		}
		
		if (this._object.isOutputInverted()) result = !result;
		
		return result;
	};
	
	LogicComponent.prototype.xor = function () {								//TODO refactor
		let result = false, inputState = false;
		if (this._object.getInputs().size > 0 ) {
			for (let wire of this._object.getInputs().values()) {
				
				inputState = this._object.getInputState(wire);
				result = result ^ inputState;
			}
		} else {
			result = false;
		}
		
		if (this._object.isOutputInverted()) result = !result;
		
		return result;
	};
	
/* 	LogicComponent.prototype._getInputState = function() {
		
	}; */
	
	LogicComponent.prototype.isActivated = function() {
		return this._isActivated;
	};
	
	LogicComponent.prototype.isActivated = function(wire) {
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
			this._setReducingType();
		}
	};
	
	LogicComponent.prototype.update = function(seconds) {
		if (this._type === 'AND') {
			this._isActivated = this.and();
		} else if (this._type === 'OR') {
			this._isActivated = this.or();
		} else if (this._type === 'XOR') {
			this._isActivated = this.xor();
		}
	};
	
	LogicComponent.prototype.getEquation = function() {
		let exp = '(', type;
		/* if (this._type === 'AND') {
			type = 'AND';
		} else if (this._type === 'OR') {
			type = 'OR';
		} */
		if (this._object.getInputs().size > 0 ) {
			let i = 0;
			for (let wire of this._object.getInputs().values()) {
				if (typeof wire.getEnd0() !== 'undefined') {
					if (i !==0) exp = exp + ' ' + this._ + ' ';
					if (this._object.getInvertedInputs().includes(wire.getId())) {	//if wire is inverted
						exp = exp + '!' + 'w' + wire.getEnd0().getUpdateNumber();
					} else {
						exp = exp + 'w' + wire.getEnd0().getUpdateNumber();
					}
				}
				i++;
			}
		}
		//exp = exp.length !== 1 ? exp + ')' : '';
		exp = exp + ')'
		if (this._object.isOutputInverted()) exp = '!' + exp;
		this._equation = exp;
	
		return this._equation;
	};
	
	LogicComponent.prototype.getTraverseEquation = function() {
		return this._traverseEquation;
	};
	
	LogicComponent.prototype.setTraverseEquation = function(expr) {
		this._traverseEquation = expr;
	};
	
	return LogicComponent;
});