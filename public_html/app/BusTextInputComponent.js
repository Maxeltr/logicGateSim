define(['./TextInputComponent'], function (TextInputComponent) {
    function BusTextInputComponent(object, mouseinput, lockInput) {
		TextInputComponent.apply(this, arguments);
		this._marginBorder = 5;
	}
	
	BusTextInputComponent.prototype = Object.create(TextInputComponent.prototype);
	BusTextInputComponent.prototype.constructor = BusTextInputComponent;
	
	BusTextInputComponent.prototype._onMouseDblClick = function(mouseInput) {		//override
		if (this._isLock) return;
		let positionComponent = this._object.getPositionComponent();
		let polyline = this._object.getCoordinates();
		let length = polyline.length;
		if (positionComponent.isOnSegment(mouseInput.lastX(), mouseInput.lastY(), polyline[length - 2], polyline[length - 1], polyline[length - 4], polyline[length - 3])
			|| positionComponent.isOnSegment(mouseInput.lastX(), mouseInput.lastY(), polyline[0], polyline[1], polyline[2], polyline[3])) {
			for (let wire of this._object.getInputs().values()) {
				if (typeof wire.getEnd1() !== 'undefined' && wire.getEnd1().getId() === this._object.getId()) {	//if wire is connected to the bus input
					inputCoordinates = this._object.getInputCoordinates(wire);
					if (Math.abs(mouseInput.lastX() - inputCoordinates[0]) < this._marginBorder 
						&& Math.abs(mouseInput.lastY() - inputCoordinates[1]) < this._marginBorder) {
						let xy = mouseInput.getRawXY();
						this._showInputHtmlElement(xy.x, xy.y, wire);
					}
				}
			}
			for (let wire of this._object.getOutputs().values()) {
				if (typeof wire.getEnd0() !== 'undefined' && wire.getEnd0().getId() === this._object.getId()) {	//if wire is connected to the bus output
					outputCoordinates = this._object.getOutputCoordinates(wire);
					if (Math.abs(mouseInput.lastX() - outputCoordinates[0]) < this._marginBorder 
						&& Math.abs(mouseInput.lastY() - outputCoordinates[1]) < this._marginBorder) {
						let xy = mouseInput.getRawXY();
						this._showInputHtmlElement(xy.x, xy.y, wire);
					}
				}
			}
		}
	};
	
	BusTextInputComponent.prototype._showInputHtmlElement = function (x, y, wire) {		//override
		if (typeof this._htmlInput !== 'undefined') return;
		this._htmlInput = document.createElement('input');
		this._htmlInput.type = 'text';
		this._htmlInput.style.position = 'fixed';
		this._htmlInput.style.left = x + 'px';
		this._htmlInput.style.top = y + 'px';
		this._htmlInput.onkeydown = this._handleEnter.bind(this, v => this._setOptions(v, wire));
		document.body.appendChild(this._htmlInput);
		this._htmlInput.focus();
		
		return this._htmlInput;
	};
	
	BusTextInputComponent.prototype._setOptions = function (strLine, wire) {		//override
		if (typeof strLine !== 'string') {
			throw new Error('Invalid parameter');
		}
		let options = strLine.split(',');
		let pair, key, val;
		for (let option of options) {
			pair = option.split('=');
			key = pair[0];
			val = pair[1]
			this._setOption(key, val, wire);
		}
	};
	
	BusTextInputComponent.prototype._setOption = function (key, val, wire) {
		let propertyName, propertyValue;
		if (typeof key === 'undefined' || typeof val === 'undefined') return;
		propertyName = key.trim();
		propertyValue = val.trim();
		if (propertyName.length === 0 || propertyValue.length === 0) return;
		this._object.setOption(propertyName, propertyValue, wire);
	};
	
	return BusTextInputComponent;
});