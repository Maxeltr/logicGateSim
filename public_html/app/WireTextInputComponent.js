define(['./TextInputComponent'], function (TextInputComponent) {
    function WireTextInputComponent(object, mouseinput, lockInput) {
		TextInputComponent.apply(this, arguments);
	}
	
	WireTextInputComponent.prototype = Object.create(TextInputComponent.prototype);
	WireTextInputComponent.prototype.constructor = WireTextInputComponent;
	
	WireTextInputComponent.prototype._onMouseDblClick = function(mouseInput) {
		if (this._isLock) return;
		let positionComponent = this._object.getPositionComponent();
		let polyline = this._object.getCoordinates();
		let length = polyline.length;
		if (positionComponent.isOnSegment(mouseInput.lastX(), mouseInput.lastY(), polyline[length - 2], polyline[length - 1], polyline[length - 4], polyline[length - 3])) {
			if (typeof this._object.getEnd1() !== 'undefined') {				//TODO move to ?
				this._object.getEnd1().invertInput(this._object.getId());
			}
		} else if (positionComponent.isOnSegment(mouseInput.lastX(), mouseInput.lastY(), polyline[0], polyline[1], polyline[2], polyline[3])) {
			if (typeof this._object.getEnd0() !== 'undefined') {				//TODO move to ?
				this._object.getEnd0().invertOutput();
			}
		} else {
			if (positionComponent.isCoordinatesMatch(mouseInput.lastX(), mouseInput.lastY())) {
				console.log('addHTML')
			}
		}
	};
		
	
	return WireTextInputComponent;
});