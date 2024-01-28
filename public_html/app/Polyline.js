define(function (require) {
    function Polyline(id, mouseinput, mutex, x, y, connectCallback) {
        this._id;
		this._mouseinput;
		this._mutex;
		this._x;
		this._y;
		this._connectColor = 'black';
		this._unconnectColor = 'grey';
		this._setColor = 'red';
		this._poly = [x,y, x+30,y, x+30,y+50, x+40,y+50, x+40,y+50, x+60,y+50];
		this._capturedDeltaX1 = 0;
		this._capturedDeltaY1 = 0;
		this._capturedDeltaX2 = 0;
		this._capturedDeltaY2 = 0;
		this._capturedSegment = 0;
		this._marginBorder = 5;
        this._capturedStartOfPolyline = false;
		this._capturedEndOfPolyline = false;
		this._end0 = undefined;
		this._end1 = undefined;
		this._connect;
		this._name = undefined;
		this._type = 'polyline';
		
		if (typeof id !== 'string') {
			throw new Error('Invalid parameter id');
		}
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw new Error('Invalid parameter x - ' + typeof x + '; y - ' + typeof y);
		}
		this._id = id;
		this._x = x;
		this._y = y;
		this._mouseinput = mouseinput;
		this._mutex = mutex;
		this._connect = connectCallback;
		this._mouseinput.subscribe('mousedown', this.onMouseDown.bind(this));
		this._mouseinput.subscribe('mouseup', this.onMouseUp.bind(this));
		this._mouseinput.subscribe('mousemove', this.onMouseMove.bind(this));
		this._mouseinput.subscribe('dblclick', this._onMouseDblClick.bind(this));
    }
	
	Polyline.prototype.type = function () {
        return this._type;
    };
	
	Polyline.prototype.setType = function (type) {
        this._type = type;
    };
	
	Polyline.prototype.name = function () {
		return this._name;
	}
	
	Polyline.prototype.setName = function (name) {
		this._name = name;
	}
	
	Polyline.prototype.setPolyline = function (polyline) {
		this._poly = polyline;
	}
	
	Polyline.prototype.end0 = function () {
		return this._end0;
	}
	
	Polyline.prototype.end1 = function () {
		return this._end1;
	}
	
	Polyline.prototype.coordinates = function () {
		return this._poly;
	}
	
	Polyline.prototype.id = function () {
		return this._id;
	}

	Polyline.prototype._onMouseDblClick = function (mouseInput) {
		let length = this._poly.length;
		if (this.isOnSegment(mouseInput.lastX(), mouseInput.lastY(), this._poly[length - 2], this._poly[length - 1], this._poly[length - 4], this._poly[length - 3])) {
			if (typeof this._end1 !== 'undefined') {
				this._end1.invertInput(this._id);
			}
		} else if (this.isOnSegment(mouseInput.lastX(), mouseInput.lastY(), this._poly[0], this._poly[1], this._poly[2], this._poly[3])) {
			if (typeof this._end0 !== 'undefined') {
				this._end0.invertOutput();
			}
		}
	}
	
	Polyline.prototype.onMouseDown = function (mouseInput) {
		let x = mouseInput.lastX();
		let y = mouseInput.lastY();
		if (this.isCoordinatesMatch(x, y)) {
			if (this._mutex.isSet()) {
				return;
			} else {
				this._mutex.set();
				this._captured = true;
				let polyLength = this._poly.length;
				if (Math.abs(this._poly[0] - x) <= this._marginBorder && Math.abs(this._poly[1] - y) <= this._marginBorder) {
					this._capturedStartOfPolyline = true;
				} else if (Math.abs(this._poly[polyLength - 2] - x) <= this._marginBorder && Math.abs(this._poly[polyLength - 1] - y) <= this._marginBorder) {
					this._capturedEndOfPolyline = true;
				} else {
					for (let i = 0; i < this._poly.length - 2; i +=2) {
						if (this.isOnSegment(x, y, this._poly[i], this._poly[i + 1], this._poly[i + 2], this._poly[i + 3])) {
							this._capturedSegment = i;
							this._capturedDeltaX1 = x - this._poly[i];
							this._capturedDeltaY1 = y - this._poly[i + 1];
							this._capturedDeltaX2 = x - this._poly[i + 2];
							this._capturedDeltaY2 = y - this._poly[i + 3];
							break;
						}
					}
				}
			}
		}
	};
	
	Polyline.prototype.onMouseUp = function (mouseInput) {
		if (this._captured && (typeof this._end0 === 'undefined' || typeof this._end1 === 'undefined')) {
			this._connect(this);
		}
		 
		if (this._captured && typeof this._end0 !== 'undefined') {
			let gateOutputCoordinates = this._end0.getOutputCoordinates();
			if ((this._poly[0] !== gateOutputCoordinates[0] || this._poly[1] !== gateOutputCoordinates[1])) {
				let end0 = this._end0;
				this.deleteEnd0();
				end0.deleteLinkFromOutput(this);
			}
		}
		if (this._captured && typeof this._end1 !== 'undefined') {
			let leftX = this._end1.x() - this._end1.width() / 2;
			let topY = this._end1.y() - this._end1.height() / 2;
			let bootomY = this._end1.y() + this._end1.height() / 2;
			let polyLength = this._poly.length;
			if ((Math.abs(this._poly[polyLength - 2] - leftX) > this._marginBorder || this._poly[polyLength - 1] > bootomY ||  this._poly[polyLength - 1] < topY)) {
				let end1 = this._end1;
				this.deleteEnd1();
				end1.deleteLinkFromInputs(this);
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
	
	Polyline.prototype.onMouseMove = function (mouseInput) {
		if (this._captured === true) {
			this.move(mouseInput.lastX(), mouseInput.lastY());
		}
	};
	
	Polyline.prototype.move = function (x, y) {
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw new Error('Invalid parameter x - ' + typeof x + '; y - ' + typeof y);
		}
		if (this._capturedStartOfPolyline === true) {
			this.moveStartSegment(x, y);
		} else if (this._capturedEndOfPolyline === true) {
			this.moveEndSegment(x, y);
		} else { 
			if (this._poly[this._capturedSegment] === this._poly[this._capturedSegment + 2]) {
				this._poly[this._capturedSegment] = x - this._capturedDeltaX1;
				this._poly[this._capturedSegment + 2] = x - this._capturedDeltaX2;
			}
			
			if (this._poly[this._capturedSegment + 1] === this._poly[this._capturedSegment + 3]) {
				this._poly[this._capturedSegment + 1] = y - this._capturedDeltaY1;
				this._poly[this._capturedSegment + 3] = y - this._capturedDeltaY2;
			}
		}
		
	};
	
	Polyline.prototype.moveStartSegment = function (x, y) {
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw new Error('Invalid parameter x - ' + typeof x + '; y - ' + typeof y);
		}
		this._poly[0] = x;
		this._poly[1] = y;
		this._poly[3] = y;
	}
	
	Polyline.prototype.moveEndSegment = function (x, y) {
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw new Error('Invalid parameter x - ' + typeof x + '; y - ' + typeof y);
		}
		this._poly[this._poly.length - 2] = x;
		this._poly[this._poly.length - 1] = y;
		this._poly[this._poly.length - 3] = y;
	}
	
	Polyline.prototype.draw = function (ctx, debug = false) {
		//ctx.save();
		ctx.beginPath();
		this._chooseColor(ctx);
		ctx.moveTo(this._poly[0], this._poly[1]);
		for (let i = 2; i < this._poly.length - 1; i +=2) {
			ctx.lineTo(this._poly[i], this._poly[i + 1]);
		}
		ctx.stroke();
		//ctx.restore();
    };

	Polyline.prototype._chooseColor = function (ctx) {
		if (typeof this._end0 === 'undefined' && typeof this._end1 === 'undefined') {
			ctx.strokeStyle = this._unconnectColor;
		} else {
			if (typeof this._end0 !== 'undefined' && this._end0.isTrue()) {
				ctx.strokeStyle = this._setColor;
			} else {
				ctx.strokeStyle = this._connectColor;
			}
		}
	};
	
	Polyline.prototype.isCoordinatesMatch = function (x, y) {
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw new Error('Invalid parameter x - ' + typeof x + '; y - ' + typeof y);
		}
		for (let i = 0; i < this._poly.length - 2; i +=2) {
			if (this.isOnSegment(x, y, this._poly[i], this._poly[i + 1], this._poly[i + 2], this._poly[i + 3])) {
				return true;
			}
		}
		
		return false;
	}
	
	Polyline.prototype.isOnSegment = function (xp, yp, x1, y1, x2, y2) {
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
	}
	
	Polyline.prototype.setEnd0 = function (gate) {
		if (! (gate instanceof Object)) {					//TODO Gate?
			throw new Error('Invalid parameter');
		}
		if (typeof this._end0 === 'undefined') {
			this._end0 = gate;
			return true;
		}
		return false;
	}
	
	Polyline.prototype.deleteEnd0 = function () {
		this._end0 = undefined;
	}
	
	Polyline.prototype.setEnd1 = function (gate) {
		if (! (gate instanceof Object)) {
			throw new Error('Invalid parameter');
		}
		if (typeof this._end1 === 'undefined') {
			this._end1 = gate;
			return true;
		}
		return false;
	}
	
	Polyline.prototype.deleteEnd1 = function () {
		this._end1 = undefined;
	}

	Polyline.prototype.update = function (seconds) {
		
	}
	
    return {
        create: function (id, mouseinput, mutex, x, y, connectCallback) {
            return new Polyline(id, mouseinput, mutex, x, y, connectCallback);
        }
    };
});