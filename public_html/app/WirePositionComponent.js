define(function () {
    function WirePositionComponent(object, mouseinput, mutex, x, y, connectCallback, lockInput) {
		this._object = object;
		this._polyline = [x,y, x+30,y, x+30,y+50, x+40,y+50, x+40,y+50, x+60,y+50];
		this._mutex = mutex;
		this._connect = connectCallback;
		this._capturedDeltaX1 = 0;
		this._capturedDeltaY1 = 0;
		this._capturedDeltaX2 = 0;
		this._capturedDeltaY2 = 0;
		this._capturedSegment = 0;
		this._marginBorder = 5;
        this._capturedStartOfPolyline = false;
		this._capturedEndOfPolyline = false;
		this._captured = false;
		this._mouseinput = mouseinput;
		this._mouseinput.subscribe('mousedown', this._onMouseDown.bind(this), this._object.getId());
		this._mouseinput.subscribe('mouseup', this._onMouseUp.bind(this), this._object.getId());
		this._mouseinput.subscribe('mousemove', this._onMouseMove.bind(this), this._object.getId());
		this._lockInput = lockInput;
		this._lockInput.addEventListener('change', this._onChange.bind(this));
		this._isLock = this._lockInput.checked;
		
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw new Error('Invalid parameter x - ' + typeof x + '; y - ' + typeof y);
		}
	}
	
	WirePositionComponent.prototype._onChange = function (e) {
		this._isLock = this._lockInput.checked;
	};

	WirePositionComponent.prototype.unsubscribeAll = function () {
		this._mouseinput.unsubscribe('mousedown', this._object.getId());
		this._mouseinput.unsubscribe('mouseup', this._object.getId());
		this._mouseinput.unsubscribe('mousemove', this._object.getId());
	};
		
	WirePositionComponent.prototype._onMouseDown = function(mouseInput) {
		if (mouseInput.lastEvent().button !== 0) return;
		let x = mouseInput.lastX();
		let y = mouseInput.lastY();
		if (this.isCoordinatesMatch(x, y)) {
			if (this._mutex.isSet()) {
				return;
			} else {
				this._mutex.set();
				this._captured = true;
				let polyLength = this._polyline.length;
				if (Math.abs(this._polyline[0] - x) <= this._marginBorder && Math.abs(this._polyline[1] - y) <= this._marginBorder) {
					this._capturedStartOfPolyline = true;
				} else if (Math.abs(this._polyline[polyLength - 2] - x) <= this._marginBorder && Math.abs(this._polyline[polyLength - 1] - y) <= this._marginBorder) {
					this._capturedEndOfPolyline = true;
				} else {
					for (let i = 0; i < this._polyline.length - 2; i +=2) {
						if (this.isOnSegment(x, y, this._polyline[i], this._polyline[i + 1], this._polyline[i + 2], this._polyline[i + 3])) {
							this._capturedSegment = i;
							this._capturedDeltaX1 = x - this._polyline[i];
							this._capturedDeltaY1 = y - this._polyline[i + 1];
							this._capturedDeltaX2 = x - this._polyline[i + 2];
							this._capturedDeltaY2 = y - this._polyline[i + 3];
							break;
						}
					}
				}
			}
		}
	};
		
	WirePositionComponent.prototype._onMouseUp = function(mouseInput) {
		let polyLength = this._polyline.length;
		
		if (this._captured && (typeof this._object.getEnd0() === 'undefined' || typeof this._object.getEnd1() === 'undefined')) {
			this._connect(this._object);
		}
		
		if (this._capturedStartOfPolyline && typeof this._object.getEnd0() !== 'undefined') {	//disconnect wire end0 from gate output
			let gateOutputCoordinates = this._object.getEnd0().getOutputCoordinates();
			if ((this._polyline[0] !== gateOutputCoordinates[0] || this._polyline[1] !== gateOutputCoordinates[1])) {
				let end0 = this._object.getEnd0();
				this._object.deleteEnd0();
				end0.deleteWireFromOutput(this._object);
			}
		}
		
		if (this._capturedEndOfPolyline && typeof this._object.getEnd1() !== 'undefined') {   //disconnect wire end1 from gate input
			let end1 = this._object.getEnd1();
			let leftX = end1.getLeftX();
			let topY = end1.getTopY();
			let bottomY = end1.getBottomY();
			if ((Math.abs(this._polyline[polyLength - 2] - leftX) > this._marginBorder || this._polyline[polyLength - 1] > bottomY ||  this._polyline[polyLength - 1] < topY)) {
				this._object.deleteEnd1();
				end1.deleteWireFromInputs(this._object);
			}
		}
	
		if (typeof this._object.getEnd0() !== 'undefined') {						//if Y of a wire not equal Y of gate output, then correct position		
			let outputCoordinates = this._object.getEnd0().getOutputCoordinates();
			if (this._polyline[1] !== outputCoordinates[1]) {
				this._object.getEnd0().correctPosition();
			}
		}
		
		if (typeof this._object.getEnd1() !== 'undefined') {		// if Y of a wire not between topY and bottomY of a gate, then correct position
			let end1 = this._object.getEnd1();
			let topY = end1.getTopY();
			let bottomY = end1.getBottomY();
			if (this._polyline[polyLength - 1] > bottomY || this._polyline[polyLength - 1] < topY) {
				this._object.getEnd1().correctPosition();
			}
		}
		
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
		
	WirePositionComponent.prototype._onMouseMove = function(mouseInput) {
		if (this._captured === true) {
			this.move(mouseInput.lastX(), mouseInput.lastY());
		}
	};
	
	WirePositionComponent.prototype.moveStartSegment = function (x, y) {
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw new Error('Invalid parameter x - ' + typeof x + '; y - ' + typeof y);
		}
		if (this._isLock) return;
		this._polyline[0] = x;
		this._polyline[1] = y;
		this._polyline[3] = y;
	};
	
	WirePositionComponent.prototype.moveEndSegment = function (x, y) {
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw new Error('Invalid parameter x - ' + typeof x + '; y - ' + typeof y);
		}
		if (this._isLock) return;
		this._polyline[this._polyline.length - 2] = x;
		this._polyline[this._polyline.length - 1] = y;
		this._polyline[this._polyline.length - 3] = y;
	};
	
	WirePositionComponent.prototype.move = function (x, y) {
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
	};
		
	WirePositionComponent.prototype.getCoordinates = function () {
		return this._polyline;
	};
	
	WirePositionComponent.prototype.setCoordinates = function (coordinates) {
		return this._polyline = coordinates;
	};
	
	WirePositionComponent.prototype.isCoordinatesMatch = function (x, y) {
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw new Error('Invalid parameter x - ' + typeof x + '; y - ' + typeof y);
		}
		for (let i = 0; i < this._polyline.length - 2; i +=2) {
			if (this.isOnSegment(x, y, this._polyline[i], this._polyline[i + 1], this._polyline[i + 2], this._polyline[i + 3])) {
				return true;
			}
		}
		
		return false;
	};
		
	WirePositionComponent.prototype.isOnSegment = function (xp, yp, x1, y1, x2, y2) {		//TODO refactor (false positive occurs
		//console.log('xp=' + xp + '  yp=' + yp + '  x1=' + x1 + '  y1=' + y1 + '  x2=' +  x2 + '  y2=' + y2)
		if (Math.abs(xp - x1) < this._marginBorder 
				|| Math.abs(xp - x2) < this._marginBorder 
				|| Math.abs(yp - y1) < this._marginBorder 
				|| Math.abs(yp - y2) < this._marginBorder
			) {
					
			let maxDistance = this._marginBorder;
			
			let dxl = x2 - x1;
			let dyl = y2 - y1;
			let dxp = xp - x1;
			let dyp = yp - y1;
			let dxq = xp - x2;
			let dyq = yp - y2;
			
			let squareLen = dxl * dxl + dyl * dyl;
			let dotProd = dxp * dxl + dyp * dyl;
			let crossProd = dyp * dxl - dxp * dyl;
			
			let distance = Math.abs(crossProd) / Math.sqrt(squareLen);
			
			let distFromEnd1 = Math.sqrt(dxp * dxp + dyp + dyp);
			let distFromEnd2 = Math.sqrt(dxq * dxq + dyq + dyq);
			
			if (dotProd < 0) return distFromEnd1 <= maxDistance;
			if (dotProd > squareLen) return distFromEnd2 <= maxDistance;
			
			return distance <= maxDistance;
		
		} else {
			return false;
		}
	};

	return WirePositionComponent;
});