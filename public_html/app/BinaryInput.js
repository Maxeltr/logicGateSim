define(function (require) {
    function BinaryInput(id, mouseinput, mutex, x, y) {
        //save
		this._id;
		this._type = 'BI';
		this._name = undefined;
		this._outputs = new Map();
		this._x = 100;
		this._y = 100;
		//nonsave
		this._connectColor = 'black';
		this._unconnectColor = 'grey';
		this._debugColor = 'pink';
		this._setColor = 'red';
		this._width = 30;
		this._height = 20;
		this._radius = 3;
		this._leftX;
		this._rightX;
		this._topY;
		this._bottomY;
		this._captured = false;
		this._capturedDeltaX = 0;
		this._capturedDeltaY = 0;
		this._mutex = mutex;	//TODO is there mutex in js?
		this._htmlInput;
		this._state = false;
		this._wasMoved = false;
		
		if (typeof id !== 'string') {
			throw new Error('Invalid parameter id');
		}
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw new Error('Invalid parameter x - ' + typeof x + '; y - ' + typeof y);
		}
		
		this._id = id;
		this._x = x;
		this._y = y;
		this.mouseinput = mouseinput;
		this.mouseinput.subscribe('mousedown', this._onMouseDown.bind(this));
		this.mouseinput.subscribe('mouseup', this._onMouseUp.bind(this));
		this.mouseinput.subscribe('mousemove', this._onMouseMove.bind(this));
		this.mouseinput.subscribe('dblclick', this._onMouseDblClick.bind(this));
		this.mouseinput.subscribe('click', this._onMouseClick.bind(this));
		this._correctPosition();
    }

	BinaryInput.prototype.name = function () {
        return this._name;
    };
	
	BinaryInput.prototype.type = function () {
        return this._type;
    };
	
	BinaryInput.prototype.setName = function (name) {
        this._name = name;
    };
	
	BinaryInput.prototype.setType = function (type) {
        this._type = type;
    };
	
	BinaryInput.prototype.id = function () {
        return this._id;
    };
	
	BinaryInput.prototype.outputs = function () {
        return this._outputs;
    };

    BinaryInput.prototype.x = function () {
        return this._x;
    };
	
	BinaryInput.prototype.y = function () {
        return this._y;
    };
		
	BinaryInput.prototype.width = function () {
		return this._width;
	};
	
	BinaryInput.prototype.height = function () {
		return this._height;
	};
	
	BinaryInput.prototype.isTrue = function () {
        return this._state;
    };
	
	BinaryInput.prototype.set = function () {
        this._state = true;
    };
	
	BinaryInput.prototype.unset = function () {
        this._state = false;
    };
	
	BinaryInput.prototype._onMouseClick = function (mouseInput) {
				
	}

	BinaryInput.prototype._onMouseDblClick = function (mouseInput) {
		if (this.isCoordinatesMatch(mouseInput.lastX(), mouseInput.lastY())) {
			this._addInputHtmlElement(mouseInput, v => this._setOptions(v));
		}
	}

	BinaryInput.prototype._onMouseDown = function (mouseInput) {
		let x = mouseInput.lastX();
		let y = mouseInput.lastY();
		if (this.isCoordinatesMatch(x, y)) {
			if (this._mutex.isSet()) {
				return;
			} else {
				this._mutex.set();
				this._captured = true;
				this._capturedDeltaX = x - this._x;
				this._capturedDeltaY = y - this._y;
			}
		}
		this._wasMoved = false;
	};
	
	BinaryInput.prototype._onMouseUp = function (mouseInput) {
		if (this.isCoordinatesMatch(mouseInput.lastX(), mouseInput.lastY()) && this._wasMoved === false && this._captured === true) {
			if (this.isTrue()) {
				this.unset();
			} else { 
				this.set();
			}
		}
		this._captured = false;
		this._capturedDeltaX = 0;
		this._capturedDeltaY = 0;
		this._mutex.release();
	};
	
	BinaryInput.prototype._onMouseMove = function (mouseInput) {
		if (this._captured === true) {
			this.move(mouseInput.lastX(), mouseInput.lastY());
			this._wasMoved = true;
		}
	};
	
	BinaryInput.prototype.move = function (x, y) {
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw new Error('Invalid parameter x - ' + typeof x + '; y - ' + typeof y);
		}
		
		this._x = x - this._capturedDeltaX;
		this._y = y - this._capturedDeltaY;
		
		this._correctPosition();
	};
	
	BinaryInput.prototype._correctPosition = function () {
		this._leftX = this._x - this._width / 2;
		this._rightX = this._x + this._width / 2;
		this._topY = this._y - this._height / 2;
		this._bottomY = this._y + this._height / 2;
		let i = 1, outputCoordinates;
		outputCoordinates = this.getOutputCoordinates();
		for (let link of this._outputs.values()) {
			if (typeof link.end0() !== 'undefined' && link.end0().id() === this._id) {
				link.moveStartSegment(outputCoordinates[0], outputCoordinates[1]);
				
			}
		}
	}
	
	BinaryInput.prototype.isCoordinatesMatch = function (x, y) {
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw new Error('Invalid parameter x - ' + typeof x + '; y - ' + typeof y);
		}
		if (this._leftX < x && this._rightX > x) {
			if (this._topY < y && this._bottomY > y) {
				return true;
			}
		}
		return false;
	}
	
	BinaryInput.prototype.isOutputsCoordinatesMatch = function (x, y) {
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw new Error('Invalid parameter x - ' + typeof x + '; y - ' + typeof y);
		}
		if (this._leftX + this._width / 2 < x && this._rightX > x) {
			if (this._topY < y && this._bottomY > y) {
				return true;
			}
		}
		return false;
	}
		
	BinaryInput.prototype.getOutputCoordinates = function () {
		return [this._rightX, this._y];
	}
			
	BinaryInput.prototype.addLinkToOutput = function (link) {
		if (! (link instanceof Object)) {			//TODO change to link
			throw new Error('Invalid parameter');
		}
		if (this._outputs.has(link.id())) {
			return false;
		}
		this._outputs.set(link.id(), link);
		this._correctPosition();
		return true;
	}
	
	BinaryInput.prototype.deleteLinkFromOutput = function (link) {
		if (! (link instanceof Object)) {			//TODO change to link
			throw new Error('Invalid parameter');
		}
		this._outputs.delete(link.id());
		this._correctPosition();
	}
	
	BinaryInput.prototype.draw = function (ctx, debug = false) {
		//ctx.save();
		ctx.beginPath();
		this._chooseColor(ctx);
		ctx.moveTo(this._leftX, this._topY);
		ctx.lineTo(this._rightX, this._topY);
		ctx.lineTo(this._rightX, this._bottomY);
		ctx.lineTo(this._leftX, this._bottomY);
		ctx.lineTo(this._leftX, this._topY);
		
		ctx.textBaseline = "bottom";
		ctx.fillText(this._type, this._x, this._y);

		if (this._invertedOutput) {
			let outCoord = this.getOutputCoordinates();
			ctx.moveTo(outCoord[0] + this._radius, outCoord[1] + this._radius);
			ctx.arc(outCoord[0] + this._radius, outCoord[1], this._radius, Math.PI / 2, 2.5 * Math.PI, false);
		}
		
		ctx.stroke();
		
		if (debug === true) {
			this._debugDraw(ctx);
		}
		
		//ctx.restore();
	};
	
	BinaryInput.prototype._debugDraw = function (ctx) {
		
		
	};
	
	BinaryInput.prototype._chooseColor = function (ctx) {
		if (this._outputs.size === 0) {
			ctx.strokeStyle = this._unconnectColor;
		} else {
			if (this.isTrue()) {
				ctx.strokeStyle = this._setColor;
			} else {
				ctx.strokeStyle = this._connectColor;
			}
		}
	};
	
	BinaryInput.prototype._addInputHtmlElement = function (mouseInput, callback) {
		if (typeof this._htmlInput !== 'undefined') return;
		this._htmlInput = document.createElement('input');
		this._htmlInput.type = 'text';
		this._htmlInput.style.position = 'fixed';
		this._htmlInput.style.left = mouseInput.lastX() + 'px';
		this._htmlInput.style.top = mouseInput.lastY() + 'px';
		this._htmlInput.onkeydown = this._handleEnter.bind(this, callback);
		document.body.appendChild(this._htmlInput);
		this._htmlInput.focus();
		
		return this._htmlInput;
	}
	
	BinaryInput.prototype._removeInput = function () {
		document.body.removeChild(this._htmlInput);
		this._htmlInput = undefined;
	}
	
	BinaryInput.prototype._handleEnter = function (callback, e) {
		let keyCode = e.keyCode;
		if (keyCode === 13) {
			callback(this._htmlInput.value);
			this._removeInput();
		} else if (keyCode === 27) {
			this._removeInput();
		}
	}
	
	BinaryInput.prototype._setOptions = function (strLine) {
		if (typeof strLine !== 'string') {
			throw new Error('Invalid parameter');
		}
		let options = strLine.split(',');
		let pair, key, val;
		for (let option of options) {
			pair = option.split('=');
			key = pair[0];
			val = pair[1]
			this._setOption(key, val);
		}
	}
	
	BinaryInput.prototype._setOption = function (key, val) {
		let propertyName, property;
		if (typeof key === 'undefined' || typeof val === 'undefined') return;
		propertyName = key.trim();
		property = val.trim();
		if (propertyName.length === 0 || property.length === 0) return;
		if (propertyName === 'state') {
			if (property === 'true' || property === '1') {
				this.set();
			} else if (property === 'false' || property === '0') {
				this.unset();
			}
		} else if (propertyName === ' ') {
			
		} else {
			console.log('Unknown property');
		}
	}

	BinaryInput.prototype.update = function (seconds) {
		
	}
	
    return {
        create: function (id, mouseinput, mutex, x, y) {
            return new BinaryInput(id, mouseinput, mutex, x, y);
        }
    };
});