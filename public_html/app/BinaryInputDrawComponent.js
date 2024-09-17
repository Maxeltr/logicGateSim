define(function () {
    function BinaryInputDrawComponent(object) {
		this._object = object;
		this._connectColor = 'black';
		this._unconnectColor = 'grey';
		this._debugColor = 'pink';
		this._activeColor = 'red';
	}
	
	BinaryInputDrawComponent.prototype.draw = function (ctx, debug = false) {
		ctx.save();
		ctx.beginPath();
		this._chooseColor(ctx);
		ctx.moveTo(this._object.getLeftX(), this._object.getTopY());
		ctx.lineTo(this._object.getRightX(), this._object.getTopY());
		ctx.lineTo(this._object.getRightX(), this._object.getBottomY());
		ctx.lineTo(this._object.getLeftX(), this._object.getBottomY());
		ctx.lineTo(this._object.getLeftX(), this._object.getTopY());
		
		ctx.textBaseline = "bottom";
		ctx.fillText(this._object.getReducingType(), this._object.getX(), this._object.getY());
		ctx.fillText(this._object.getUpdateNumber() + ' ' + this._object.getName(), this._object.getLeftX(), this._object.getTopY());

		if (this._object.isOutputInverted()) {
			let outCoord = this._object.getOutputCoordinates();
			ctx.moveTo(outCoord[0] + this._object.getRadius(), outCoord[1] + this._object.getRadius());
			ctx.arc(outCoord[0] + this._object.getRadius(), outCoord[1], this._object.getRadius(), Math.PI / 2, 2.5 * Math.PI, false);
		}
		
		ctx.stroke();
		
		if (debug === true) this._debugDraw(ctx);
		
		ctx.restore();
	
	};
		
	BinaryInputDrawComponent.prototype._chooseColor = function(ctx) {
		if (this._object.getOutputs().size === 0) {
			ctx.strokeStyle = this._unconnectColor;
		} else {
			if (this._object.isActivated()) {
				ctx.strokeStyle = this._activeColor;
			} else {
				ctx.strokeStyle = this._connectColor;
			}
		}
	};
	
	BinaryInputDrawComponent.prototype._debugDraw = function(ctx) {
		
	}
	
	return BinaryInputDrawComponent;
});