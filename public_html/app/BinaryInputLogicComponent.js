define(function () {
    function BinaryInputLogicComponent(object) {
		this._object = object;
		this._isActivated = false;
		this._type = 'BinaryInput';
		this._reducingType = 'BI';
		this._traverseExpression = '';
	}
	
	BinaryInputLogicComponent.prototype.isActivated = function() {
		if (this._object.isOutputInverted()) {
			return ! this._isActivated;
		} else {
			return this._isActivated;
		}
	};
	
	BinaryInputLogicComponent.prototype.set = function() {
		this._isActivated = true;
	};
	
	BinaryInputLogicComponent.prototype.unset = function() {
		this._isActivated = false;
	};
	
	BinaryInputLogicComponent.prototype.update = function(seconds, updateNumber) {
		this._object.setUpdateNumber(updateNumber);
	};
	
	BinaryInputLogicComponent.prototype.getType = function() {
		return this._type;
	};
	
	BinaryInputLogicComponent.prototype.getReducingType = function() {
		return this._reducingType;
	};
	
	BinaryInputLogicComponent.prototype.setType = function(type) {
		this._type = type;
	};
	
	BinaryInputLogicComponent.prototype.getExpression = function() {
		return 'BI' + this._object.getUpdateNumber();
	};
	
	BinaryInputLogicComponent.prototype.getTraverseExpression = function() {
		return this._traverseExpression;
	};
	
	BinaryInputLogicComponent.prototype.setTraverseExpression = function(expr) {
		if (typeof expr !== 'string') {
			throw new Error('Invalid parameter');
		}
		this._traverseExpression = expr;
	};
	
	return BinaryInputLogicComponent;
});