define(function () {
	function MouseInput(canvas) {
		this._lastX;
		this._lastY;
		this._isMouseDown = false;
		this._mouseDownObservers = new Map();
		this._mouseUpObservers = new Map();
		this._mouseMoveObservers = new Map();
		this._mouseDblClickObservers = new Map();
		this._mouseClickObservers = new Map();
		this._canvas;
		this.t = Date.now();
		this._scaleFactor = 1;
		this._XShift = 0;
		this._YShift = 0;
		//this._affineMatrix = [1, 0, 0, 1, 0, 0];

		if (typeof canvas === 'undefined') {
			throw new Error('Invalid parameter');
		}
		this._canvas = canvas;
		this._canvas.addEventListener('mousedown', this._mouseDown.bind(this));
		this._canvas.addEventListener('mousemove', this._mouseMove.bind(this));
		this._canvas.addEventListener('mouseup', this._mouseUp.bind(this));
		this._canvas.addEventListener('dblclick', this._mouseDblClick.bind(this));
		this._canvas.addEventListener('click', this._mouseClick.bind(this));
	}

	MouseInput.prototype.lastX = function () {
		return this._lastX;
	};
	
	MouseInput.prototype.lastY = function () {
		return this._lastY;
	};

	MouseInput.prototype.isMouseDown = function () {
		return this._isMouseDown;
	};

	MouseInput.prototype._mouseDown = function (event) {
		this._updateLastXY(event);
		this._isMouseDown = true;
		this._notifyMouseDown(this);
	};
	
	MouseInput.prototype._mouseMove = function (event) {
		this._updateLastXY(event);
		this._notifyMouseMove(this);
	};
	
	MouseInput.prototype._mouseUp = function (event) {
		this._updateLastXY(event);
		this._isMouseDown = false;
		this._notifyMouseUp(this);
	};

	MouseInput.prototype._mouseDblClick = function (event) {
		this._updateLastXY(event);
		this._notifyMouseDblClick(this);
	};

	MouseInput.prototype._mouseClick = function (event) {
		this._updateLastXY(event);
		this._notifyMouseClick(this);
	};
	
	MouseInput.prototype.setScaleFactor = function (scale) {
		this._scaleFactor = scale;
	};
	
	MouseInput.prototype.setXShift = function (shift) {
		this._XShift = shift;
	};
	
	MouseInput.prototype.setYShift = function (shift) {
		this._YShift = shift;
	};
	
	/* MouseInput.prototype.setAffineMatrix = function (matrix) {
		this._affineMatrix = matrix;
	}; */
	
	MouseInput.prototype._updateLastXY = function (event) {
		let rect = this._canvas.getBoundingClientRect();
		this._lastX = Math.round(((event.clientX - rect.left) * this._scaleFactor)) - this._XShift;
		this._lastY = Math.round(((event.clientY - rect.top) * this._scaleFactor)) - this._YShift;
		/* let x = event.clientX - rect.left;
		let y = event.clientY - rect.top;
		this._lastX = x / this._affineMatrix[0] + y * this._affineMatrix[2] - this._affineMatrix[4];
		this._lastY = x * this._affineMatrix[1] + y / this._affineMatrix[3] - this._affineMatrix[5]; */
	};
	
	MouseInput.prototype.subscribe = function (e, fn, id) {
		if (typeof e === 'string' && typeof fn === 'function') {
			if (e === 'mousedown') {
				this._mouseDownObservers.set(id, fn);
			} else if (e === 'mouseup') {
				this._mouseUpObservers.set(id, fn);
			} else if (e === 'mousemove') {
				this._mouseMoveObservers.set(id, fn);
			} else if (e === 'dblclick') {
				this._mouseDblClickObservers.set(id, fn);
			} else if (e === 'click') {
				this._mouseClickObservers.set(id, fn);
			} else {
				throw new Error('Invalid parameter');
			}
		} else {
			throw new Error('Invalid parameter');
		}
	};
	
	MouseInput.prototype.unsubscribe = function (e, id) {
		if (typeof e === 'string') {
			if (e === 'mousedown') {
				this._mouseDownObservers.delete(id);
			} else if (e === 'mouseup') {
				this._mouseUpObservers.delete(id);
			} else if (e === 'mousemove') {
				this._mouseMoveObservers.delete(id);
			} else if (e === 'dblclick') {
				this._mouseDblClickObservers.delete(id);
			} else if (e === 'click') {
				this._mouseClickObservers.delete(id);
			} else {
				throw new Error('Invalid parameter');
			}
		} else {
			throw new Error('Invalid parameter');
		}
	};
		
	MouseInput.prototype._notifyMouseDown = function (data) {
		for (let fn of this._mouseDownObservers.values()) {
			fn(data);
		}
	};

	MouseInput.prototype._notifyMouseUp = function (data) {
		for (let fn of this._mouseUpObservers.values()) {
			fn(data);
		}
	};

	MouseInput.prototype._notifyMouseMove = function (data) {
		for (let fn of this._mouseMoveObservers.values()) {
			fn(data);
		}
	};

	MouseInput.prototype._notifyMouseDblClick = function (data) {
		for (let fn of this._mouseDblClickObservers.values()) {
			fn(data);
		}
	};
		
	MouseInput.prototype._notifyMouseClick = function (data) {
		for (let fn of this._mouseClickObservers.values()) {
			fn(data);
		}
	};

	return MouseInput;
});