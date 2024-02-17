define(['./Gate'], function (Gate) {
    function Timer(id, x, y) {
		Gate.apply(this, arguments);
	}
	
	Timer.prototype = Object.create(Gate.prototype);
	Timer.prototype.constructor = Timer;
	
	Timer.prototype.setOption = function (propertyName, propertyValue) {
		if (propertyName === 'time') {
			this._logicComponent.setTimeSetting(parseFloat(propertyValue));
		} else if (propertyName === 'name') {
			this.setName(propertyValue + '');
		}
	};
	
	Timer.prototype.setTimeSetting = function(time) {
		this._logicComponent.setTimeSetting(time);
	};
	
	Timer.prototype.getTimeSetting = function() {
		return this._logicComponent.getTimeSetting();
	};
	
	Timer.prototype.getCurrentTime = function() {
		return this._logicComponent.getCurrentTime();
	};
	
	return Timer;
});