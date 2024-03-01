define(function () {
    function Gate(id, x, y) {
		this._id;
		this._name = '';
		this._x = 100;
		this._y = 100;
		this._leftX;
		this._rightX;
		this._topY;
		this._bottomY;
		this._logicComponent;
		this._outputsComponent;
		this._inputsComponent;
		this._positionComponent;
		this._drawComponent;
		this._textInputComponent;
		this._radius = 3;
		this._updateNumber = 0;
		this._isVisited = false;
		
		if (typeof id !== 'string') {
			throw new Error('Invalid parameter id');
		}
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw new Error('Invalid parameter x - ' + typeof x + '; y - ' + typeof y);
		}
		this._id = id;
		this._x = x;
		this._y = y;
		
    }

	Gate.prototype.isVisited = function () {
		return this._isVisited;
	};
	
	Gate.prototype.setIsVisited = function () {
		this._isVisited = true;
	};
	
	Gate.prototype.resetIsVisited = function () {
		this._isVisited = false;
	};
	
	Gate.prototype.correctPosition = function () {
		this._positionComponent.correctPosition();
	};
	
	Gate.prototype.isCoordinatesMatch = function (x, y) {
		return this._positionComponent.isCoordinatesMatch(x, y);
	};
	
	Gate.prototype.isLeftSideCoordinatesMatch = function (x, y) {
		return this._positionComponent.isLeftSideCoordinatesMatch(x, y);
	};
	
	Gate.prototype.isRightSideCoordinatesMatch = function (x, y) {
		return this._positionComponent.isRightSideCoordinatesMatch(x, y);
	};
	
	Gate.prototype.getId = function () {
		return this._id;
	};
		
	Gate.prototype.getOutputCoordinates = function (numberOutput) {
		return this._positionComponent.getOutputCoordinates(numberOutput);
	}; 
	
	Gate.prototype.getInputCoordinates = function (numberInput) {
		return this._positionComponent.getInputCoordinates(numberInput);
	};
	
	Gate.prototype.getRadius = function () {
		return this._radius;
	};
	
	Gate.prototype.getType = function () {
		return this._logicComponent.getType();
	};
	
	Gate.prototype.getReducingType = function () {
		return this._logicComponent.getReducingType();
	};
	
	Gate.prototype.getName = function () {
		return this._name;
	};
	
	Gate.prototype.getLeftX = function () {
		return this._leftX;
	};
		
	Gate.prototype.getRightX = function () {
		return this._rightX;
	};
		
	Gate.prototype.getTopY = function () {
		return this._topY;
	};
	
	Gate.prototype.getBottomY = function () {
		return this._bottomY;
	};
	
	Gate.prototype.getX = function () {
		return this._x;
	};
	
	Gate.prototype.getY = function () {
		return this._y;
	};
	
	Gate.prototype.getInputs = function () {
		return this._inputsComponent.getInputs();
	};
	
	Gate.prototype.getInput = function(id) {
		return this._inputsComponent.getInput(id);
	};
		
	Gate.prototype.getOutputs = function () {
		return this._outputsComponent.getOutputs();
	};
	
	Gate.prototype.getInvertedInputs = function () {
		return this._inputsComponent.getInvertedInputs();
	};
	
	Gate.prototype.isInputInverted = function (id) {
		return this._inputsComponent.isInputInverted(id);
	};
	
	Gate.prototype.invertInput = function (id) {
		this._inputsComponent.invertInput(id);
	};
	
	Gate.prototype.isOutputInverted = function () {
		return this._outputsComponent.isOutputInverted();
	};
	
	Gate.prototype.invertOutput = function () {
		this._outputsComponent.invertOutput();
	};
	
	Gate.prototype.isActivated = function() {
		return this._logicComponent.isActivated();
	};
	
	Gate.prototype.getLogicComponent = function () {
		return this._logicComponent;
	};
		
	Gate.prototype.getOutputsComponent = function () {
		return this._outputsComponent;
	};
	
	Gate.prototype.getInputsComponent = function () {
		return this._inputsComponent;
	};
	
	Gate.prototype.getPositionComponent = function () {
		return this._positionComponent;
	};
	
	Gate.prototype.getDrawComponent = function () {
		return this._drawComponent;
	};
	
	Gate.prototype.getTextInputComponent = function () {
		return this._textInputComponent;
	};
	
	Gate.prototype.setType = function (type) {
		return this._logicComponent.setType(type);
	};
	
	Gate.prototype.setName = function (name) {
		this._name = name;
	};
		
	Gate.prototype.setLeftX = function (x) {
		this._leftX = x;
	};
	
	Gate.prototype.setRightX = function (x) {
		this._rightX = x;
	};
	
	Gate.prototype.setTopY = function (y) {
		this._topY = y;
	};
	
	Gate.prototype.setBottomY = function (y) {
		this._bottomY = y;
	};
	
	Gate.prototype.setX = function (x) {
		this._x = x;
	};
	
	Gate.prototype.setY = function (y) {
		this._y = y;
	};
	
	Gate.prototype.setLogicComponent = function (logicComponent) {
		this._logicComponent = logicComponent;
	};
	
	Gate.prototype.setOutputsComponent = function (outputsComponent) {
		this._outputsComponent = outputsComponent;
	};
		
	Gate.prototype.setInputsComponent = function (inputsComponent) {
		this._inputsComponent = inputsComponent;
	};
	
	Gate.prototype.setPositionComponent = function (positionComponent) {
		this._positionComponent = positionComponent;
	};
	
	Gate.prototype.setDrawComponent = function (drawComponent) {
		this._drawComponent = drawComponent;
	};
	
	Gate.prototype.setTextInputComponent = function (textInputComponent) {
		this._textInputComponent = textInputComponent;
	};
	
	Gate.prototype.setOption = function (propertyName, propertyValue) {
		if (propertyName === 'name') {
			this.setName(propertyValue + '');
		}
	};
	
	Gate.prototype.addWireToOutput = function (wire) {
		this._outputsComponent.addWireToOutput(wire);
	};
	
	Gate.prototype.deleteWireFromOutput = function(wire) {
		this._outputsComponent.deleteWireFromOutput(wire);
	};
		
	Gate.prototype.addWireToInputs = function(wire) {
		this._inputsComponent.addWireToInputs(wire);
	};
	
	Gate.prototype.deleteWireFromInputs = function(wire) {
		this._inputsComponent.deleteWireFromInputs(wire);
	};
	
	Gate.prototype.setUpdateNumber = function(updateNumber) {
		this._updateNumber = updateNumber;
	};
	
	Gate.prototype.getUpdateNumber = function() {
		return this._updateNumber;
	};
	
	Gate.prototype.remove = function() {
		this._positionComponent.unsubscribeAll();
		this._textInputComponent.unsubscribeAll();
		this._inputsComponent.deleteInputs();
		this._outputsComponent.deleteOutputs();
	};
	
	Gate.prototype.update = function (seconds, updateNumber) {
		this._logicComponent.update(seconds, updateNumber);
	};
	
	Gate.prototype.draw = function (ctx, debug = false, number) {
		this._drawComponent.draw(ctx, debug, number);
	};
	
	Gate.prototype.getExpression = function () {
		return this._logicComponent.getExpression();
	};
	
	Gate.prototype.getTraverseExpression = function() {
		return this._logicComponent.getTraverseExpression();
	};
	
	Gate.prototype.setTraverseExpression = function(expr) {
		this._logicComponent.setTraverseExpression(expr);
	};
	
	return Gate;
});