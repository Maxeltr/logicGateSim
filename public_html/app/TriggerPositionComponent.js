define(['./GatePositionComponent'], function (GatePositionComponent) {
    function TriggerPositionComponent(object, mouseinput, mutex) {
		this._object = object;
		this._width = 30;
		this._height = 40;
		this._initialHeight = 40;
		this._captured = false;
		this._capturedDeltaX = 0;
		this._capturedDeltaY = 0;
		this._mutex = mutex;	//TODO is there mutex in js?
		
		this._mouseinput = mouseinput;
		this._mouseinput.subscribe('mousedown', this._onMouseDown.bind(this), this._object.getId());
		this._mouseinput.subscribe('mouseup', this._onMouseUp.bind(this), this._object.getId());
		this._mouseinput.subscribe('mousemove', this._onMouseMove.bind(this), this._object.getId());
		this.updateCoordinates();
	}
	
	TriggerPositionComponent.prototype = Object.create(GatePositionComponent.prototype);
	TriggerPositionComponent.prototype.constructor = TriggerPositionComponent;
	
	TriggerPositionComponent.prototype.unsubscribeAll = function () {
		this._mouseinput.unsubscribe('mousedown', this._object.getId());
		this._mouseinput.unsubscribe('mouseup', this._object.getId());
		this._mouseinput.unsubscribe('mousemove', this._object.getId());
	};
		
	TriggerPositionComponent.prototype.isSecondQuadrantCoordinatesMatch = function(x, y) {
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw new Error('Invalid parameter x - ' + typeof x + '; y - ' + typeof y);
		}
		if (this._object.getLeftX() < x && this._object.getRightX() - this._width / 2 > x) {
			if (this._object.getTopY() < y && this._object.getBottomY() - this._height / 2 > y) {
				return true;
			}
		}
		return false;
	};
	
	TriggerPositionComponent.prototype.moveWires = function() {
		let i = 1, inputCoordinates, outputCoordinates;
		for (let wire of this._object.getInputs().values()) {
			if (typeof wire.getEnd1() !== 'undefined' && wire.getEnd1().getId() === this._object.getId()) {
				if (typeof this._object.getSetInput() !== 'undefined' && this._object.getSetInput().getId() === wire.getId()) {
					inputCoordinates = this.getInputCoordinates(1);
					wire.moveEndSegment(inputCoordinates[0], inputCoordinates[1]);
				}
				if (typeof this._object.getResetInput() !== 'undefined' && this._object.getResetInput().getId() === wire.getId()) {
					inputCoordinates = this.getInputCoordinates(2);
					wire.moveEndSegment(inputCoordinates[0], inputCoordinates[1]);
				}
			}
			i++;
		}
		outputCoordinates = this.getOutputCoordinates();
		for (let wire of this._object.getOutputs().values()) {
			if (typeof wire.getEnd0() !== 'undefined' && wire.getEnd0().getId() === this._object.getId()) {
				wire.moveStartSegment(outputCoordinates[0], outputCoordinates[1]);
				
			}
		}
	};
	
	TriggerPositionComponent.prototype.getInputCoordinates = function (numberInput) {
		if (typeof numberInput !== 'number') {
			throw new Error('Invalid parameter numberInput - ' + typeof numberInput);
		}
		let distanceBetweenInputs = this._height / 3;
		return [this._object.getLeftX(), this._object.getTopY() + distanceBetweenInputs * numberInput];
	};
	
	/* TriggerPositionComponent.prototype.isThirdQuadrantCoordinatesMatch = function(x, y) {
		console.log('3')
	}; */
	
	return TriggerPositionComponent;
});