define(function () {
    function LogicComponent(object, type) {
		this._object = object;
		this._availableTypes = ['&', '1'];
		this._type = '&';
		this._reducingType = '&';
		this._isActivated = false;
		
		if (typeof type !== 'string') {
			throw new Error('Invalid parameter id');
		}
		if (this._availableTypes.includes(type)) { 
			this._type = type;
			this._reducingType = type;
		}
	}
	
	LogicComponent.prototype = {
		and: function() {								//TODO refactor
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
		},
		
		or: function () {								//TODO refactor
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
		},
		
		_getInputState: function() {
			
		},
		
		isActivated: function() {
			return this._isActivated;
		},
		
		getType: function() {
			return this._type;
		},
		
		getReducingType: function() {
			return this._reducingType;
		},
		
		setType: function(type) {
			if (this._availableTypes.includes(type)) { 
				this._type = type;
				this._reducingType = type;
			}
		},
		
		update: function(seconds, updateNumber) {
			this._object.setUpdateNumber(updateNumber);
			if (this._type === '&') {
				this._isActivated = this.and();
			} else if (this._type === '1') {
				this._isActivated = this.or();
			}
		},
		
	};
	
	return LogicComponent;
});