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
	
	Gate.prototype = {
		correctPosition: function () {
			this._positionComponent.correctPosition();
		},
		
		isCoordinatesMatch: function (x, y) {
			return this._positionComponent.isCoordinatesMatch(x, y);
		},
		
		isLeftSideCoordinatesMatch: function (x, y) {
			return this._positionComponent.isLeftSideCoordinatesMatch(x, y);
		},
		
		isRightSideCoordinatesMatch: function (x, y) {
			return this._positionComponent.isRightSideCoordinatesMatch(x, y);
		},
		
		getId: function () {
			return this._id;
		},
		
		getOutputCoordinates: function (numberOutput) {
			return this._positionComponent.getOutputCoordinates(numberOutput);
		}, 
		
		getInputCoordinates: function (numberInput) {
			return this._positionComponent.getInputCoordinates(numberInput);
		},
		
		getRadius: function () {
			return this._radius;
		},
		
		getType: function () {
			return this._logicComponent.getType();
		},
		
		getReducingType: function () {
			return this._logicComponent.getReducingType();
		},
		
		getName: function () {
			return this._name;
		},
		
		getLeftX: function () {
			return this._leftX;
		},
		
		getRightX: function () {
			return this._rightX;
		},
		
		getTopY: function () {
			return this._topY;
		},
		
		getBottomY: function () {
			return this._bottomY;
		},
		
		getX: function () {
			return this._x;
		},
		
		getY: function () {
			return this._y;
		},
		
		getInputs: function () {
			return this._inputsComponent.getInputs();
		},
		
		getInput: function(id) {
			return this._inputsComponent.getInput(id);
		},
		
		getOutputs: function () {
			return this._outputsComponent.getOutputs();
		},
		
		getInvertedInputs: function () {
			return this._inputsComponent.getInvertedInputs();
		},
		
		isInputInverted: function (id) {
			return this._inputsComponent.isInputInverted(id);
		},
		
		invertInput: function (id) {
			this._inputsComponent.invertInput(id);
		},
		
		isOutputInverted: function () {
			return this._outputsComponent.isOutputInverted();
		},
		
		invertOutput: function () {
			this._outputsComponent.invertOutput();
		},
		
		isActivated: function() {
			return this._logicComponent.isActivated();
		},
		
		getLogicComponent: function () {
			return this._logicComponent;
		},
		
		getOutputsComponent: function () {
			return this._outputsComponent;
		},
		
		getInputsComponent: function () {
			return this._inputsComponent;
		},
		
		getPositionComponent: function () {
			return this._positionComponent;
		},
		
		getDrawComponent: function () {
			return this._drawComponent;
		},
		
		getTextInputComponent: function () {
			return this._textInputComponent;
		},
		
		setType: function (type) {
			return this._logicComponent.setType(type);
		},
		
		setName: function (name) {
			this._name = name;
		},
		
		setLeftX: function (x) {
			this._leftX = x;
		},
		
		setRightX: function (x) {
			this._rightX = x;
		},
		
		setTopY: function (y) {
			this._topY = y;
		},
		
		setBottomY: function (y) {
			this._bottomY = y;
		},
		
		setX: function (x) {
			this._x = x;
		},
		
		setY: function (y) {
			this._y = y;
		},
		
		setLogicComponent: function (logicComponent) {
			this._logicComponent = logicComponent;
		},
		
		setOutputsComponent: function (outputsComponent) {
			this._outputsComponent = outputsComponent;
		},
		
		setInputsComponent: function (inputsComponent) {
			this._inputsComponent = inputsComponent;
		},
		
		setPositionComponent: function (positionComponent) {
			this._positionComponent = positionComponent;
		},
		
		setDrawComponent: function (drawComponent) {
			this._drawComponent = drawComponent;
		},
		
		setTextInputComponent: function (textInputComponent) {
			this._textInputComponent = textInputComponent;
		},
		
		setOption: function (propertyName, propertyValue) {
			if (propertyName === 'name') {
				this.setName(propertyValue + '');
			}
		},
		
		addWireToOutput: function (wire) {
			this._outputsComponent.addWireToOutput(wire);
		},
		
		deleteWireFromOutput: function(wire) {
			this._outputsComponent.deleteWireFromOutput(wire);
		},
		
		addWireToInputs: function(wire) {
			this._inputsComponent.addWireToInputs(wire);
		},
		
		deleteWireFromInputs: function(wire) {
			this._inputsComponent.deleteWireFromInputs(wire);
		},
		
		setUpdateNumber: function(updateNumber) {
			this._updateNumber = updateNumber;
		},
		
		getUpdateNumber: function() {
			return this._updateNumber;
		},
		
		remove: function() {
			this._positionComponent.unsubscribeAll();
			this._textInputComponent.unsubscribeAll();
		},
		
		update: function (seconds, updateNumber) {
			this._logicComponent.update(seconds, updateNumber);
		},
		
		draw: function (ctx, debug = false, number) {
			this._drawComponent.draw(ctx, debug, number);
		}
	};
	
	Gate.prototype.constructor = Gate;
	
	return Gate;
});