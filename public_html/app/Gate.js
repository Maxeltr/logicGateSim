define(function (require) {
    function Gate(id, mouseinput, mutex, x, y, type) {
        //save
		this._id;
		this._type = '&';
		this._name = undefined;
		this._x = 100;
		this._y = 100;
		this._inputs = new Map();
		this._outputs = new Map();
		this._invertedInputs = [];
		this._invertedOutput = false;
		//nonsave
		this._availableTypes = ['&', '1'];
		this._connectColor = 'black';
		this._unconnectColor = 'grey';
		this._debugColor = 'pink';
		this._setColor = 'red';
		this._width = 20;
		this._height = 40;
		this._initialHeight = 40;
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
		this._mouseinput;
		
		
		if (typeof id !== 'string') {
			throw new Error('Invalid parameter id');
		}
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw new Error('Invalid parameter x - ' + typeof x + '; y - ' + typeof y);
		}
		if (typeof type !== 'string') {
			throw new Error('Invalid parameter id');
		}
		if (this._availableTypes.includes(type)) { 
			this._type = type;
		}

		this._id = id;
		this._x = x;
		this._y = y;
		this._mouseinput = mouseinput;
		this._mouseinput.subscribe('mousedown', this._onMouseDown.bind(this));
		this._mouseinput.subscribe('mouseup', this._onMouseUp.bind(this));
		this._mouseinput.subscribe('mousemove', this._onMouseMove.bind(this));
		this._mouseinput.subscribe('dblclick', this._onMouseDblClick.bind(this));
		this._correctPosition();
    }

	Gate.prototype.name = function () {
        return this._name;
    };
	
	Gate.prototype.type = function () {
        return this._type;
    };
	
	Gate.prototype.setName = function (name) {
        this._name = name;
    };
	
	Gate.prototype.setInputs = function (inputs) {
        this._inputs = inputs;
    };
	
	Gate.prototype.setOutputs = function (outputs) {
        this._outputs = outputs;
    };
	
	Gate.prototype.setInvertedInputs = function (invertedInputs) {
        this._invertedInputs = invertedInputs;
    };
	
	Gate.prototype.isTrue = function () {
        return this._state;
    };
	
	Gate.prototype.id = function () {
        return this._id;
    };

    Gate.prototype.x = function () {
        return this._x;
    };
	
	Gate.prototype.y = function () {
        return this._y;
    };
	
	Gate.prototype.inputs = function () {
		return this._inputs;
	};
	
	Gate.prototype.invertedInputs = function () {
		return this._invertedInputs;
	};
	
	Gate.prototype.outputs = function () {
		return this._outputs;
	};
	
	Gate.prototype.isOutputInverted = function () {
		return this._invertedOutput;
	};
	
	Gate.prototype.width = function () {
		return this._width;
	};
	
	Gate.prototype.height = function () {
		return this._height;
	};
	
	Gate.prototype._onMouseDblClick = function (mouseInput) {
		if (this.isCoordinatesMatch(mouseInput.lastX(), mouseInput.lastY())) {
			this._addInputHtmlElement(mouseInput, v => this._setOptions(v));
		}
	}

	Gate.prototype._onMouseDown = function (mouseInput) {
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
	};
	
	Gate.prototype._onMouseUp = function (mouseInput) {
		this._captured = false;
		this._capturedDeltaX = 0;
		this._capturedDeltaY = 0;
		this._mutex.release();
	};
	
	Gate.prototype._onMouseMove = function (mouseInput) {
		if (this._captured === true) {
			this.move(mouseInput.lastX(), mouseInput.lastY());
		}
	};
	
	Gate.prototype.move = function (x, y) {
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw new Error('Invalid parameter x - ' + typeof x + '; y - ' + typeof y);
		}
		
		this._x = x - this._capturedDeltaX;
		this._y = y - this._capturedDeltaY;
		
		this._correctPosition();
	};
	
	Gate.prototype._correctPosition = function () {
		let amountInputs = this._inputs.size;
		if (amountInputs > 0) {
			this._height = amountInputs * this._radius + this._initialHeight;
		}
		this._leftX = this._x - this._width / 2;
		this._rightX = this._x + this._width / 2;
		this._topY = this._y - this._height / 2;
		this._bottomY = this._y + this._height / 2;
		let i = 1, inputCoordinates, outputCoordinates;
		for (let link of this._inputs.values()) {
			inputCoordinates = this.getInputCoordinates(i);
			if (typeof link.end1() !== 'undefined' && link.end1().id() === this._id) {
				link.moveEndSegment(inputCoordinates[0], inputCoordinates[1]);
			}
			i++;
		}
		outputCoordinates = this.getOutputCoordinates();
		for (let link of this._outputs.values()) {
			if (typeof link.end0() !== 'undefined' && link.end0().id() === this._id) {
				link.moveStartSegment(outputCoordinates[0], outputCoordinates[1]);
				
			}
		}
	}
	
	Gate.prototype.isCoordinatesMatch = function (x, y) {
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
	
	Gate.prototype.isInputsCoordinatesMatch = function (x, y) {
		if (typeof x !== 'number' || typeof y !== 'number') {
			throw new Error('Invalid parameter x - ' + typeof x + '; y - ' + typeof y);
		}
		if (this._leftX < x && this._rightX - this._width / 2 > x) {
			if (this._topY < y && this._bottomY > y) {
				return true;
			}
		}
		return false;
	}
	
	Gate.prototype.isOutputsCoordinatesMatch = function (x, y) {
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
	
	Gate.prototype.getInputCoordinates = function (numberInput) {
		if (typeof numberInput !== 'number') {
			throw new Error('Invalid parameter numberInput - ' + typeof numberInput);
		}
		let distanceBetweenInputs = this._height / (this._inputs.size + 1);
		return [this._leftX, this._topY + distanceBetweenInputs * numberInput];
	}
	
	Gate.prototype.getOutputCoordinates = function () {
		return [this._rightX, this._y];
	}
	
	Gate.prototype.addLinkToInputs = function (link) {
		if (! (link instanceof Object)) {			//TODO change to link
			throw new Error('Invalid parameter');
		}
		if (this._inputs.has(link.id())) {
			return false;
		}
		this._inputs.set(link.id(), link);
				
		this._correctPosition();
		return true;
	}
	
	Gate.prototype.deleteLinkFromInputs = function (link) {
		if (! (link instanceof Object)) {			//TODO change to link
			throw new Error('Invalid parameter');
		}
		this._inputs.delete(link.id());
		this._invertedInputs = this._invertedInputs.filter(v => v !== link.id());
		this._correctPosition();
	}
	
	Gate.prototype.addLinkToOutput = function (link) {
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
	
	Gate.prototype.deleteLinkFromOutput = function (link) {
		if (! (link instanceof Object)) {			//TODO change to link
			throw new Error('Invalid parameter');
		}
		this._outputs.delete(link.id());
		this._correctPosition();
	}
	
	Gate.prototype.draw = function (ctx, debug = false) {
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

		let coordinates;
		/*for (let i = 1; i <= this._inputs.size; i++) {	//from 1
			if (this._invertedInputs.includes(this._inputs.get)) {
				coordinates = this.getInputCoordinates(i);
				ctx.moveTo(coordinates[0] - this._radius, coordinates[1] + this._radius);
				ctx.arc(coordinates[0] - this._radius, coordinates[1], this._radius, Math.PI / 2, 2.5 * Math.PI, false);
			}
		}*/
		
		let i = 1;
		for (let link of this._inputs.values()) {
			if (this._invertedInputs.includes(link.id())) {
				coordinates = this.getInputCoordinates(i);
				ctx.moveTo(coordinates[0] - this._radius, coordinates[1] + this._radius);
				ctx.arc(coordinates[0] - this._radius, coordinates[1], this._radius, Math.PI / 2, 2.5 * Math.PI, false);
			}
			i++;
		}
		
		ctx.stroke();
		
		if (debug === true) {
			this._debugDraw(ctx);
		}
		
		//ctx.restore();
	};
	
	Gate.prototype._debugDraw = function (ctx) {
		
		
	};
	
	Gate.prototype._chooseColor = function (ctx) {
		if (this._inputs.size === 0 && this._outputs.size === 0) {
			ctx.strokeStyle = this._unconnectColor;
		} else {
			if (this.isTrue()) {
				ctx.strokeStyle = this._setColor;
			} else {
				ctx.strokeStyle = this._connectColor;
			}
		}
	};
	
	Gate.prototype._addInputHtmlElement = function (mouseInput, callback) {
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
	
	Gate.prototype._removeInput = function () {
		document.body.removeChild(this._htmlInput);
		this._htmlInput = undefined;
	}
	
	Gate.prototype._handleEnter = function (callback, e) {
		let keyCode = e.keyCode;
		if (keyCode === 13) {
			callback(this._htmlInput.value);
			this._removeInput();
		} else if (keyCode === 27) {
			this._removeInput();
		}
	}
	
	Gate.prototype._setOptions = function (strLine) {
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
	
	Gate.prototype._setOption = function (key, val) {
		let propertyName, property;
		if (typeof key === 'undefined' || typeof val === 'undefined') return;
		propertyName = key.trim();
		property = val.trim();
		if (propertyName.length === 0 || property.length === 0) return;
		if (propertyName === 'type') {
			if (this._availableTypes.includes(property)) { 
				this._type = property;
			} else {
				console.log('Unknown gate type');
			}
		} else if (propertyName === 'invert') {
			if (property === 'out') {
				this._invertedOutput = !this._invertedOutput;
			}
		} else if (propertyName === 'state') {
			if (property === 'true' || property === '1') {
				this._state = true;
			} else if (property === 'false' || property === '0') {
				this._state = false;
			}
		} else {
			console.log('Unknown property');
		}
	}

	Gate.prototype.invertInput = function (id) {
		let input = this._inputs.get(id);
		if (typeof input !== undefined) {
			if (this._invertedInputs.includes(id)) {
				this._invertedInputs = this._invertedInputs.filter(v => v !== id);
			} else {
				this._invertedInputs.push(id);
			}
		}
	}
	
	Gate.prototype.invertOutput = function () {
		this._invertedOutput = !this._invertedOutput;
	}
	
	Gate.prototype.update = function (seconds) {
		if (this._inputs.size > 0) {
			if (this._type === '&') {
				this._state = this._calcAnd(seconds);
			} else if (this._type === '1') {
				this._state = this._calcOr(seconds);
			}
		} else {
			this._state = this._invertedOutput;
		}
	}
	
	Gate.prototype._calcAnd = function (seconds) {
		let result = true, inputState = false;
		for (let link of this._inputs.values()) {
			if (typeof link.end0() !== 'undefined') {
				if (this._invertedInputs.includes(link.id())) {
					inputState = !link.end0().isTrue();
				} else {
					inputState = link.end0().isTrue();
				}
				result = result && inputState;
			} else {
				if (this._invertedInputs.includes(link.id())) {
					inputState = true;
				} else {
					inputState = false;
				}
				result = result && inputState;
			}
		}
		if (this._invertedOutput) result = !result;
		return result;
	}
	
	Gate.prototype._calcOr = function (seconds) {
		let result = false;
		for (let link of this._inputs.values()) {
			if (typeof link.end0() !== 'undefined') {
				if (this._invertedInputs.includes(link.id())) {
					inputState = !link.end0().isTrue();
				} else {
					inputState = link.end0().isTrue();
				}
				result = result || inputState;
			} else {
				if (this._invertedInputs.includes(link.id())) {
					inputState = true;
				} else {
					inputState = false;
				}
				result = result || inputState;
			}
		}
		if (this._invertedOutput) result = !result;
		return result;
	}
	
    return {
        create: function (id, mouseinput, mutex, x, y, type) {
            return new Gate(id, mouseinput, mutex, x, y, type);
        }
    };
});