define(function () {
    function TimerLogicComponent(object, type) {
		this._object = object;
		this._isActivated = false;
		this._currentTime = 0;
		this._settingTime = 0;
		this._availableTypes = [ON_DELAY, OFF_DELAY];
		this._type = ON_DELAY;
		this._reducingType = 'Ton';
		this._traverseEquation = '';
		this._offDelayOn = false;
		
		this.setType(type);
	}
	
	const ON_DELAY = 'On-delay', OFF_DELAY = 'Off-delay';
	
	TimerLogicComponent.prototype._correctReducingType = function() {	
		if (this._type === ON_DELAY) {
			this._reducingType = 'Ton';
		} else if (this._type === OFF_DELAY) {
			this._reducingType = 'Toff';
		}
	};
	
	TimerLogicComponent.prototype.isActivated = function() {
		return this._isActivated;
	};
	
	TimerLogicComponent.prototype.isActivated = function(wire) {
		return this._isActivated;
	};
	
	TimerLogicComponent.prototype.setTimeSetting = function(time) {
		this._settingTime = time;
	};
	
	TimerLogicComponent.prototype.getTimeSetting = function() {
		return this._settingTime;
	};
	
	/* TimerLogicComponent.prototype.setCurrentTime = function(time) {
		this._currentTime = time;
	}; */
	
	TimerLogicComponent.prototype.getCurrentTime = function() {
		return Math.round((this._currentTime + Number.EPSILON) * 100) / 100;
	};
	
	/* TimerLogicComponent.prototype.getInputState = function(wire) {
		if (typeof wire.getEnd0() !== 'undefined') {
			if (this._object.getInvertedInputs().includes(wire.getId())) {
				inputState = !wire.getEnd0().isActivated();
			} else {
				inputState = wire.getEnd0().isActivated();
			}

		} else {
			if (this._object.getInvertedInputs().includes(wire.getId())) {
				inputState = true;
			} else {
				inputState = false;
			}
		}
	}; */
	
	TimerLogicComponent.prototype._start = function(seconds) {
		let result = false, inputState = false;
		if (this._object.getInputs().size > 0 ) {
			for (let wire of this._object.getInputs().values()) {
				inputState = this._object.getInputState(wire);
				if (this._type === ON_DELAY) {
					result = this._onDelay(seconds, inputState);
				} else if (this._type === OFF_DELAY) {
					result = this._offDelay(seconds, inputState);
				}
			}
		} else {
			result = false;
		}
		
		if (this._object.isOutputInverted()) result = !result;
		
		return result;
	};
	
	TimerLogicComponent.prototype._onDelay = function(seconds, inputState) {
		if (inputState) {
			this._currentTime += seconds;
		} else {
			this._currentTime = 0;
		}
		if (this._currentTime > this._settingTime) {
			this._currentTime = this._settingTime;
			return true;
		} else {
			return false;
		}
	}
	
	TimerLogicComponent.prototype._offDelay = function(seconds, inputState) {
		if (inputState) {
			this._offDelayOn = true;
			this._currentTime = this._settingTime;
		} else if (!inputState && this._offDelayOn) {
			this._currentTime -= seconds;
			if (this._currentTime <= 0) {
				this._currentTime = 0;
				this._offDelayOn = false;
				return false;
			}
		} else {
			return false;
		}
		return true;
	}
	
	TimerLogicComponent.prototype._pulseDelay = function(seconds, inputState) {
		if (inputState) {
			this._currentTime -= seconds;
			if (this._currentTime <= 0) {
				this._currentTime = 0;
				return false;
			} else {
				return true;
			}
		} else {
			this._currentTime = this._settingTime;
		}
		
		return false;
	}
	
	TimerLogicComponent.prototype.update = function(seconds) {
		this._isActivated = this._start(seconds);
	};
	TimerLogicComponent.prototype.getType = function () {
		return this._type;
	};
	
	TimerLogicComponent.prototype.setType = function (type) {
		let tempType;
		switch (type) {
			case 'on':
			case 'On':
			case 'ON':
				tempType = ON_DELAY;
				break;
			case 'off':
			case 'Off':
			case 'OFF':
				tempType = OFF_DELAY;
				break;
			default:
				//throw new Error('Invalid parameter');
		}
		if (this._availableTypes.includes(tempType)) { 
			this._type = tempType;
			this._correctReducingType();
		}
	};
	
	TimerLogicComponent.prototype.getReducingType = function() {
		return this._reducingType;
	};
	
	TimerLogicComponent.prototype.getEquation = function() {
		return 'Timer';
	};
	
	TimerLogicComponent.prototype.getTraverseEquation = function() {
		return this._traverseEquation;
	};
	
	TimerLogicComponent.prototype.setTraverseEquation = function(expr) {
		if (typeof expr !== 'string') {
			throw new Error('Invalid parameter');
		}
		this._traverseEquation = expr;
	};
	
	return TimerLogicComponent;
});