define(function () {
    function TimerLogicComponent(object) {
		this._object = object;
		this._isActivated = false;
		this._currentTime = 0;
		this._settingTime = 0;
		this._type = 'Timer';
		this._reducingType = 'T';
	}
	
	TimerLogicComponent.prototype.isActivated = function() {
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
	
	TimerLogicComponent.prototype._start = function(seconds) {
		let result = false, inputState = false;
		if (this._object.getInputs().size > 0 ) {
			for (let wire of this._object.getInputs().values()) {
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
				if (inputState) {
					this._currentTime += seconds;
				} else {
					this._currentTime = 0;
				}
				if (this._currentTime > this._settingTime) {
					this._currentTime = this._settingTime
					result = true;
				} else {
					result = false
				}
			}
		} else {
			result = false;
		}
		
		if (this._object.isOutputInverted()) result = !result;
		
		return result;
	};
		
	TimerLogicComponent.prototype.update = function(seconds, updateNumber) {
		this._object.setUpdateNumber(updateNumber);
		this._isActivated = this._start(seconds);
	};
	TimerLogicComponent.prototype.getType = function () {
		return this._type;
	};
	
	TimerLogicComponent.prototype.setType = function (type) {
		return this._type = type;
	};
	
	TimerLogicComponent.prototype.getReducingType = function() {
		return this._reducingType;
	};
	
	TimerLogicComponent.prototype.getExpression = function() {
		return 't';
	};
	
	return TimerLogicComponent;
});