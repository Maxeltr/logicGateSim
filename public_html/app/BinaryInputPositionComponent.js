define(function () {
    function BinaryInputPositionComponent(object, mouseinput, mutex) {
		this._object = object;
		this._wasMoved = false;
		this._mutex = mutex;	//TODO is there mutex in js?
		this._captured = false;
		this._capturedDeltaX = 0;
		this._capturedDeltaY = 0;
		this._width = 30;
		this._height = 20;
		this._mouseinput = mouseinput;
		
		this._mouseinput.subscribe('mousedown', this._onMouseDown.bind(this), this._object.getId());
		this._mouseinput.subscribe('mouseup', this._onMouseUp.bind(this), this._object.getId());
		this._mouseinput.subscribe('mousemove', this._onMouseMove.bind(this), this._object.getId());
		this.updateCoordinates();
	}
	
	BinaryInputPositionComponent.prototype.unsubscribe = function (e) {	//TODO ?
		if (e === 'mousedown') {
			this._mouseinput.unsubscribe('mousedown', this._object.getId());
		} else if (e === 'mouseup') {
			this._mouseinput.unsubscribe('mouseup', this._object.getId());
		} else if (e === 'mousemove') {
			this._mouseinput.unsubscribe('mousemove', this._object.getId());
		}
	};
	
	BinaryInputPositionComponent.prototype.unsubscribeAll = function () {
		this._mouseinput.unsubscribe('mousedown', this._object.getId());
		this._mouseinput.unsubscribe('mouseup', this._object.getId());
		this._mouseinput.unsubscribe('mousemove', this._object.getId());
	};
	
	BinaryInputPositionComponent.prototype._onMouseDown = function (mouseInput) {
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
		this._wasMoved = false;
	};
		
	BinaryInputPositionComponent.prototype._onMouseUp = function (mouseInput) {
		if (this.isCoordinatesMatch(mouseInput.lastX(), mouseInput.lastY()) && this._wasMoved === false && this._captured === true) { //to logic?
			if (this._object.isActivated()) {
				this._object.getLogicComponent().unset();
			} else { 
				this._object.getLogicComponent().set();
			}
		}

		this._captured = false;
		this._capturedDeltaX = 0;
		this._capturedDeltaY = 0;
		this._mutex.release();
	};
		
	BinaryInputPositionComponent.prototype._onMouseMove = function (mouseInput) {
		if (this._captured === true) {
			this.move(mouseInput.lastX(), mouseInput.lastY());
			this._wasMoved = true;
		}
	};
		
	BinaryInputPositionComponent.prototype.move = function (x, y) {
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw new Error('Invalid parameter x - ' + typeof x + '; y - ' + typeof y);
		}
		this._object.setX(x - this._capturedDeltaX);
		this._object.setY(y - this._capturedDeltaY);
		this.correctPosition();
	};
		
	BinaryInputPositionComponent.prototype.correctPosition = function () {
		this.updateCoordinates();
		this.moveWires();
	};
	
	BinaryInputPositionComponent.prototype.updateCoordinates = function () {
		this._object.setLeftX(this._object.getX() - this._width / 2);
		this._object.setRightX(this._object.getX() + this._width / 2);
		this._object.setTopY(this._object.getY() - this._height / 2);
		this._object.setBottomY(this._object.getY() + this._height / 2);
	};
	
	BinaryInputPositionComponent.prototype.moveWires = function() {
		let outputCoordinates = this.getOutputCoordinates();
		for (let wire of this._object.getOutputs().values()) {
			if (typeof wire.getEnd0() !== 'undefined' && wire.getEnd0().getId() === this._object.getId()) {
				wire.moveStartSegment(outputCoordinates[0], outputCoordinates[1]);
			}
		}
	};
		
	BinaryInputPositionComponent.prototype.isCoordinatesMatch = function (x, y) {
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
		
	BinaryInputPositionComponent.prototype.isLeftSideCoordinatesMatch = function (x, y) {
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
		
	BinaryInputPositionComponent.prototype.isRightSideCoordinatesMatch = function (x, y) {
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
			
	BinaryInputPositionComponent.prototype.getOutputCoordinates = function () {
		return [this._object.getRightX(), this._object.getY()];
	};
	
	return BinaryInputPositionComponent;
});