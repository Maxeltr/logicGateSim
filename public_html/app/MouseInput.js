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
	
	MouseInput.prototype = {
		lastX: function () {
			return this._lastX;
		},
		
		lastY: function () {
			return this._lastY;
		},
	
		isMouseDown: function () {
			return this._isMouseDown;
		},
	
		_mouseDown: function (event) {
			this._updateLastXY(event);
			this._isMouseDown = true;
			this._notifyMouseDown(this);
		},
	
		_mouseMove: function (event) {
			this._updateLastXY(event);
			this._notifyMouseMove(this);
		},
		
		_mouseUp: function (event) {
			this._updateLastXY(event);
			this._isMouseDown = false;
			this._notifyMouseUp(this);
		},
	
		_mouseDblClick: function (event) {
			this._updateLastXY(event);
			this._notifyMouseDblClick(this);
		},
	
		_mouseClick: function (event) {
			this._updateLastXY(event);
			this._notifyMouseClick(this);
		},
	
		_updateLastXY: function (event) {
			let rect = this._canvas.getBoundingClientRect();
			this._lastX = event.clientX - rect.left;
			this._lastY = event.clientY - rect.top;
		},
	
		subscribe: function (e, fn, id) {
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
		},
	
		unsubscribe: function (e, id) {
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
		},
		
		_notifyMouseDown: function (data) {
			for (let fn of this._mouseDownObservers.values()) {
				fn(data);
			}
		},
	
		_notifyMouseUp: function (data) {
			for (let fn of this._mouseUpObservers.values()) {
				fn(data);
			}
		},
	
		_notifyMouseMove: function (data) {
			for (let fn of this._mouseMoveObservers.values()) {
				fn(data);
			}
		},
	
		_notifyMouseDblClick: function (data) {
			for (let fn of this._mouseDblClickObservers.values()) {
				fn(data);
			}
		},
		
		_notifyMouseClick: function (data) {
			for (let fn of this._mouseClickObservers.values()) {
				fn(data);
			}
		}
	};
	
	return MouseInput;
});