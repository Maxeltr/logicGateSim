define(function () {
    function TextInputComponent(object, mouseinput, lockInput) {
		this._object = object;
		this._htmlInput;
		this._mouseinput = mouseinput;
		this._mouseinput.subscribe('dblclick', this._onMouseDblClick.bind(this), this._object.getId());
		this._lockInput = lockInput;
		this._lockInput.addEventListener('change', this._onChange.bind(this));
		this._isLock = this._lockInput.checked;
	}

	TextInputComponent.prototype._onChange = function (e) {
		this._isLock = this._lockInput.checked;
	};
	
	TextInputComponent.prototype.unsubscribeAll = function () {
		this._mouseinput.unsubscribe('dblclick', this._object.getId());
	};
	
	TextInputComponent.prototype._onMouseDblClick = function(mouseInput) {
		if (this._isLock) return;
		if (this._object.isCoordinatesMatch(mouseInput.lastX(), mouseInput.lastY())) {
			//this._showInputHtmlElement(mouseInput.lastX(), mouseInput.lastY());
			let xy = mouseInput.getRawXY();
			this._showInputHtmlElement(xy.x, xy.y);
		}
	};
		
	TextInputComponent.prototype._showInputHtmlElement = function (x, y) {
		if (typeof this._htmlInput !== 'undefined') return;
		this._htmlInput = document.createElement('input');
		this._htmlInput.type = 'text';
		this._htmlInput.style.position = 'fixed';
		this._htmlInput.style.left = x + 'px';
		this._htmlInput.style.top = y + 'px';
		this._htmlInput.onkeydown = this._handleEnter.bind(this, v => this._setOptions(v));
		document.body.appendChild(this._htmlInput);
		this._htmlInput.focus();
		
		return this._htmlInput;
	};
		
	TextInputComponent.prototype._removeInput = function () {
		document.body.removeChild(this._htmlInput);
		this._htmlInput = undefined;
	};
		
	TextInputComponent.prototype._handleEnter = function(callback, e) {
		let keyCode = e.keyCode;
		if (keyCode === 13) {
			callback(this._htmlInput.value);
			this._removeInput();
		} else if (keyCode === 27) {
			this._removeInput();
		}
	};
		
	TextInputComponent.prototype._setOptions = function (strLine) {
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
	};

	TextInputComponent.prototype._setOption = function (key, val) {
		let propertyName, propertyValue;
		if (typeof key === 'undefined' || typeof val === 'undefined') return;
		propertyName = key.trim();
		propertyValue = val.trim();
		if (propertyName.length === 0 || propertyValue.length === 0) return;
		this._object.setOption(propertyName, propertyValue);
	};

	return TextInputComponent;
});