define(function () {
	function MouseInput(_canvas) {
		this._lastX;
		this._lastY;
		this._isMouseDown = false;
		this._mouseDownObservers = [];
		this._mouseUpObservers = [];
		this._mouseMoveObservers = [];
		this._mouseDblClickObservers = [];
		this._mouseClickObservers = [];
		this._canvas;
		
		if (typeof this._canvas === 'undefined') {
			//throw new Error('Invalid parameter');
		}
		this._canvas = _canvas;
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
	}
	
	MouseInput.prototype._mouseClick = function (event) {
		this._updateLastXY(event);
		this._notifyMouseClick(this);
	}
	
	MouseInput.prototype._updateLastXY = function (event) {
		let rect = this._canvas.getBoundingClientRect();
		this._lastX = event.clientX - rect.left;
		this._lastY = event.clientY - rect.top;
	};
	
	MouseInput.prototype.subscribe = function (e, fn) {
		if (typeof e === 'string' && typeof fn === 'function') {
			if (e === 'mousedown') {
				this._mouseDownObservers.push(fn);
			} else if (e === 'mouseup') {
				this._mouseUpObservers.push(fn);
			} else if (e === 'mousemove') {
				this._mouseMoveObservers.push(fn);
			} else if (e === 'dblclick') {
				this._mouseDblClickObservers.push(fn);
			} else if (e === 'click') {
				this._mouseClickObservers.push(fn);
			} else {
				throw new Error('Invalid parameter');
			}
		} else {
			throw new Error('Invalid parameter');
		}
	};
	
	MouseInput.prototype.unsubscribe = function (e, fn) {
		if (typeof e === 'string' && typeof fn === 'function') {
			if (e === 'mousedown') {
				this._mouseDownObservers = this._mouseDownObservers.filter(v => v !== fn);
			} else if (e === 'mouseup') {
				this._mouseUpObservers = this._mouseUpObservers.filter(v => v !== fn);
			} else if (e === 'mousemove') {
				this._mouseMoveObservers = this._mouseMoveObservers.filter(v => v !== fn);
			} else if (e === 'dblclick') {
				this._mouseDblClickObservers = this._mouseDblClickObservers.filter(v => v !== fn);
			} else if (e === 'click') {
				this._mouseClickObservers = this._mouseClickObservers.filter(v => v !== fn);
			} else {
				throw new Error('Invalid parameter');
			}
		} else {
			throw new Error('Invalid parameter');
		}
	};
	
	MouseInput.prototype._notifyMouseDown = function (data) {
		this._mouseDownObservers.forEach(v => v(data));
	};
	
	MouseInput.prototype._notifyMouseUp = function (data) {
		this._mouseUpObservers.forEach(v => v(data));
	};
	
	MouseInput.prototype._notifyMouseMove = function (data) {
		this._mouseMoveObservers.forEach(v => v(data));
	};
	
	MouseInput.prototype._notifyMouseDblClick = function (data) {
		this._mouseDblClickObservers.forEach(v => v(data));
	}
	
	MouseInput.prototype._notifyMouseClick = function (data) {
		this._mouseClickObservers.forEach(v => v(data));
	}
	
	return {
        create: function (_canvas) {
            return new MouseInput(_canvas);
        }
    };
});