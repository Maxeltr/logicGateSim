define(function () {
    function GatePositionComponent(object, mouseinput, mutex) {
		this._object = object;
		this._width = 20;
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

	GatePositionComponent.prototype.unsubscribeAll = function () {
		this._mouseinput.unsubscribe('mousedown', this._object.getId());
		this._mouseinput.unsubscribe('mouseup', this._object.getId());
		this._mouseinput.unsubscribe('mousemove', this._object.getId());
	};

	GatePositionComponent.prototype._onMouseDown = function (mouseInput) {
		let x = mouseInput.lastX();
		let y = mouseInput.lastY();
		if (this.isCoordinatesMatch(x, y)) {
			if (this._mutex.isSet()) {
				return;
			} else {
				this._mutex.set();
				this._captured = true;
				this._capturedDeltaX = x - this._object.getX();
				this._capturedDeltaY = y - this._object.getY();
			}
		}
	};
		
	GatePositionComponent.prototype._onMouseUp = function (mouseInput) {
		this._captured = false;
		this._capturedDeltaX = 0;
		this._capturedDeltaY = 0;
		this._mutex.release();
	};
	
	GatePositionComponent.prototype._onMouseMove = function (mouseInput) {
		if (this._captured === true) {
			this.move(mouseInput.lastX(), mouseInput.lastY());
		}
	};
	
	GatePositionComponent.prototype.move = function (x, y) {
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw new Error('Invalid parameter x - ' + typeof x + '; y - ' + typeof y);
		}
		
		this._object.setX(x - this._capturedDeltaX);
		this._object.setY(y - this._capturedDeltaY);
		this.updateCoordinates();
		this.moveWires();
	};
		
	GatePositionComponent.prototype.updateCoordinates = function () {
		let amountInputs = this._object.getInputs().size;
		if (amountInputs > 0) {
			this._height = amountInputs * this._object.getRadius() + this._initialHeight;
		}
		this._object.setLeftX(this._object.getX() - this._width / 2);
		this._object.setRightX(this._object.getX() + this._width / 2);
		this._object.setTopY(this._object.getY() - this._height / 2);
		this._object.setBottomY(this._object.getY() + this._height / 2);
	};
		
	GatePositionComponent.prototype.moveWires = function() {
		let i = 1, inputCoordinates, outputCoordinates;
		for (let wire of this._object.getInputs().values()) {
			inputCoordinates = this.getInputCoordinates(i);
			if (typeof wire.getEnd1() !== 'undefined' && wire.getEnd1().getId() === this._object.getId()) {
				wire.moveEndSegment(inputCoordinates[0], inputCoordinates[1]);
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
		
	GatePositionComponent.prototype.correctPosition = function () {
		this.updateCoordinates();
		this.moveWires();
	};
	
	GatePositionComponent.prototype.isCoordinatesMatch = function(x, y) {
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw new Error('Invalid parameter x - ' + typeof x + '; y - ' + typeof y);
		}
		if (this._object.getLeftX() < x && this._object.getRightX() > x) {
			if (this._object.getTopY() < y && this._object.getBottomY() > y) {
				return true;
			}
		}
		return false;
	};
	
	GatePositionComponent.prototype.isLeftSideCoordinatesMatch = function (x, y) {
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw new Error('Invalid parameter x - ' + typeof x + '; y - ' + typeof y);
		}
		if (this._object.getLeftX() < x && this._object.getRightX() - this._width / 2 > x) {
			if (this._object.getTopY() < y && this._object.getBottomY() > y) {
				return true;
			}
		}
		return false;
	};
		
	GatePositionComponent.prototype.isRightSideCoordinatesMatch = function (x, y) {
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw new Error('Invalid parameter x - ' + typeof x + '; y - ' + typeof y);
		}
		if (this._object.getLeftX() + this._width / 2 < x && this._object.getRightX() > x) {
			if (this._object.getTopY() < y && this._object.getBottomY() > y) {
				return true;
			}
		}
		return false;
	};
	
	GatePositionComponent.prototype.getInputCoordinates = function (numberInput) {
		if (typeof numberInput !== 'number') {
			throw new Error('Invalid parameter numberInput - ' + typeof numberInput);
		}
		let distanceBetweenInputs = this._height / (this._object.getInputs().size + 1);
		return [this._object.getLeftX(), this._object.getTopY() + distanceBetweenInputs * numberInput];
	};
	
	GatePositionComponent.prototype.getOutputCoordinates = function (numberOutput) {
		return [this._object.getRightX(), this._object.getY()];
	};

	return GatePositionComponent;
});