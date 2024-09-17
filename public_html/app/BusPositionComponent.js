define(['./WirePositionComponent'], function (WirePositionComponent) {
    function BusPositionComponent(object, mouseinput, mutex, x, y, connectCallback, lockInput) {
		WirePositionComponent.apply(this, arguments);
		this._polyline = [x,y, x,y+50, x+40,y+50, x+40,y];
		this._marginBorder = 3;
		
	}
	
	BusPositionComponent.prototype = Object.create(WirePositionComponent.prototype);
	BusPositionComponent.prototype.constructor = BusPositionComponent;
	
	BusPositionComponent.prototype.moveStartSegment = function (x, y) {		//override
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw new Error('Invalid parameter x - ' + typeof x + '; y - ' + typeof y);
		}
		if (this._isLock) return;
		this._polyline[0] = x;
		this._polyline[1] = y;
		this._polyline[2] = x;
	};
	
	BusPositionComponent.prototype.moveEndSegment = function (x, y) {		//override
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw new Error('Invalid parameter x - ' + typeof x + '; y - ' + typeof y);
		}
		if (this._isLock) return;
		this._polyline[this._polyline.length - 2] = x;
		this._polyline[this._polyline.length - 1] = y;
		this._polyline[this._polyline.length - 4] = x;
	};
	
	BusPositionComponent.prototype._onMouseUp = function(mouseInput) {		//override
				
		this._captured = false;
		this._capturedDeltaX1 = 0;
		this._capturedDeltaY1 = 0;
		this._capturedDeltaX2 = 0;
		this._capturedDeltaY2 = 0;
		this._capturedSegment = 0;
		this._capturedStartOfPolyline = false;
		this._capturedEndOfPolyline = false;
		this._mutex.release();
	};
	
	BusPositionComponent.prototype.isCoordinatesMatch = function(x, y) {		//override
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw new Error('Invalid parameter x - ' + typeof x + '; y - ' + typeof y);
		}
		for (let i = 0; i < this._polyline.length - 2; i +=2) {
			if (this.isOnSegment(x, y, this._polyline[i], this._polyline[i + 1], this._polyline[i + 2], this._polyline[i + 3])) {
				return true;
			}
		}
		
		return false;
	}
	
	BusPositionComponent.prototype.isLeftSideCoordinatesMatch = function (x, y) {	//override
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw new Error('Invalid parameter x - ' + typeof x + '; y - ' + typeof y);
		}
		for (let i = 0; i < this._polyline.length - 2; i +=2) {
			if (this.isOnSegment(x, y, this._polyline[i], this._polyline[i + 1], this._polyline[i + 2], this._polyline[i + 3])) {
				if (x > this._polyline[i] - 7 && x <= this._polyline[i]) {
					return true;
				}
			}
		}
		
		return false;
	};
		
	BusPositionComponent.prototype.isRightSideCoordinatesMatch = function (x, y) {	//override
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw new Error('Invalid parameter x - ' + typeof x + '; y - ' + typeof y);
		}
		for (let i = 0; i < this._polyline.length - 2; i +=2) {
			if (this.isOnSegment(x, y, this._polyline[i], this._polyline[i + 1], this._polyline[i + 2], this._polyline[i + 3])) {
				if (x >= this._polyline[i] && x < this._polyline[i] + 7) {
					return true;
				}
			}
		}
		
		return false;
	};
	
	BusPositionComponent.prototype.move = function (x, y) {
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw new Error('Invalid parameter x - ' + typeof x + '; y - ' + typeof y);
		}
		if (this._isLock) return;
		if (this._capturedStartOfPolyline === true) {
			this.moveStartSegment(x, y);
		} else if (this._capturedEndOfPolyline === true) {
			this.moveEndSegment(x, y);
		} else { 
			if (this._polyline[this._capturedSegment] === this._polyline[this._capturedSegment + 2]) {
				this._polyline[this._capturedSegment] = x - this._capturedDeltaX1;
				this._polyline[this._capturedSegment + 2] = x - this._capturedDeltaX2;
			}
			
			if (this._polyline[this._capturedSegment + 1] === this._polyline[this._capturedSegment + 3]) {
				this._polyline[this._capturedSegment + 1] = y - this._capturedDeltaY1;
				this._polyline[this._capturedSegment + 3] = y - this._capturedDeltaY2;
			}
		}
		this.correctPosition();
	};
	
	BusPositionComponent.prototype.correctPosition = function () {
		this.updateCoordinates();
		this.moveWires();
	};
	
	BusPositionComponent.prototype.getInputCoordinates = function (wire) {
		if (! wire instanceof Object) {
			throw new Error('Invalid parameter');
		}
		let wireCoordinates = wire.getCoordinates();
		let wireX = wireCoordinates[wireCoordinates.length - 2];
		let wireY = wireCoordinates[wireCoordinates.length - 1];
		
		return this._correctCoordinates(wireX, wireY, this._object.getBusSegmentNumberForInput(wire));
	};
	
	BusPositionComponent.prototype.getOutputCoordinates = function (wire) {
		if (! wire instanceof Object) {
			throw new Error('Invalid parameter');
		}
		let wireCoordinates = wire.getCoordinates();
		let wireX = wireCoordinates[0];
		let wireY = wireCoordinates[1];
		
		return this._correctCoordinates(wireX, wireY, this._object.getBusSegmentNumberForOutput(wire));
	};
	
	BusPositionComponent.prototype._correctCoordinates = function (x, y, segmentNumber) {
		if (segmentNumber === 1) {
			if (this._polyline[1] < this._polyline[3]) {
				if (y < this._polyline[1]) y = this._polyline[1];
				if (y > this._polyline[3]) y = this._polyline[3];
			} else {
				if (y > this._polyline[1]) y = this._polyline[1];
				if (y < this._polyline[3]) y = this._polyline[3];
			}
			return [this._polyline[0], y];
		} else if (segmentNumber === 3) {
			if (this._polyline[this._polyline.length - 1] < this._polyline[this._polyline.length - 3]) {
				if (y < this._polyline[this._polyline.length - 1]) y = this._polyline[this._polyline.length - 1];
				if (y > this._polyline[this._polyline.length - 3]) y = this._polyline[this._polyline.length - 3];
			} else {
				if (y > this._polyline[this._polyline.length - 1]) y = this._polyline[this._polyline.length - 1];
				if (y < this._polyline[this._polyline.length - 3]) y = this._polyline[this._polyline.length - 3];
			}
			return [this._polyline[this._polyline.length - 2], y];
		}
		
		return [x, y];
	}
	
	BusPositionComponent.prototype.moveWires = function() {
		let inputCoordinates, outputCoordinates;
		for (let wire of this._object.getInputs().values()) {
			if (typeof wire.getEnd1() !== 'undefined' && wire.getEnd1().getId() === this._object.getId()) {
				inputCoordinates = this.getInputCoordinates(wire);
				wire.moveEndSegment(inputCoordinates[0], inputCoordinates[1]);
			}
			
		}

		for (let wire of this._object.getOutputs().values()) {
			if (typeof wire.getEnd0() !== 'undefined' && wire.getEnd0().getId() === this._object.getId()) {
				outputCoordinates = this.getOutputCoordinates(wire);
				wire.moveStartSegment(outputCoordinates[0], outputCoordinates[1]);
				
			}
		}
	};
	
	BusPositionComponent.prototype.updateCoordinates = function () {
		this._object.setLeftX(this._polyline[0]);
		this._object.setRightX(this._polyline[this._polyline.length - 2]);
		this._object.setTopY(this._polyline[1]);
		this._object.setBottomY(this._polyline[this._polyline.length - 3]);
	};
	
	BusPositionComponent.prototype.getCoordinates = function () {
		return this._polyline;
	};
	
	BusPositionComponent.prototype.setCoordinates = function (polyline) {
		this._polyline = polyline;
	};
	
	return BusPositionComponent;
});