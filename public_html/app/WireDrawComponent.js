define(function () {
    function WireDrawComponent(object, drawWireNumbers) {
		this._object = object;
		this._connectColor = 'black';	//nonactive, false, 0
		this._unconnectColor = 'grey';
		this._activatedColor = 'red';			//active, true, 1
		this._drawNumber = false;
		this._drawWireNumbersInput = drawWireNumbers;
		this._drawWireNumbersInput.addEventListener('change', this._onChange.bind(this));
		this._drawNumber = this._drawWireNumbersInput.checked;
	}

	WireDrawComponent.prototype._onChange = function (e) {
		this._drawNumber = this._drawWireNumbersInput.checked;
	};
	
	WireDrawComponent.prototype.draw = function(ctx, debug = false) {
		ctx.save();
		ctx.beginPath();
		this._chooseColor(ctx);
		if (this._highlight) ctx.lineWidth = 3;
		let polyline = this._object.getCoordinates();
		ctx.moveTo(polyline[0], polyline[1]);
		let polyLength = polyline.length;
		for (let i = 2; i < polyLength - 1; i +=2) {
			ctx.lineTo(polyline[i], polyline[i + 1]);
		}
		ctx.stroke();
		
		if (this._drawNumber) {
			let num = '';
			if (typeof this._object.getEnd0() !== 'undefined') {
				num = 'w' + this._object.getEnd0().getUpdateNumber();
			}
			ctx.textBaseline = "bottom";
			ctx.fillText(num, polyline[0] + 5, polyline[1]);
			ctx.fillText(num, polyline[polyLength - 4 ] + 5, polyline[polyLength - 3]);
		}
		ctx.restore();
	};
		
	WireDrawComponent.prototype._chooseColor = function (ctx) {
		if (typeof this._object.getEnd0() === 'undefined' && typeof this._object.getEnd1() === 'undefined') {
			ctx.strokeStyle = this._unconnectColor;
		} else {
			if (typeof this._object.getEnd0() !== 'undefined' && this._object.getEnd0().isActivated()) {
				ctx.strokeStyle = this._activatedColor;
			} else {
				ctx.strokeStyle = this._connectColor;
			}
		}
	};

	return WireDrawComponent;
});