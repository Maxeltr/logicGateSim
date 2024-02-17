define(['./GateDrawComponent'], function (GateDrawComponent) {
    function TimerDrawComponent(object) {
		GateDrawComponent.apply(this, arguments);
	}
	
	TimerDrawComponent.prototype = Object.create(GateDrawComponent.prototype);
	TimerDrawComponent.prototype.constructor = TimerDrawComponent;

	TimerDrawComponent.prototype.draw = function (ctx, debug = false) {
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
		let timeSetting = this._object.getTimeSetting();
		ctx.fillText(timeSetting, this._object.getLeftX(), this._object.getBottomY());
		ctx.fillText(this._object.getCurrentTime(), this._object.getLeftX(), this._object.getBottomY() - 10);

		if (this._object.isOutputInverted()) {
			let outCoord = this._object.getOutputCoordinates();
			ctx.moveTo(outCoord[0] + this._object.getRadius(), outCoord[1] + this._object.getRadius());
			ctx.arc(outCoord[0] + this._object.getRadius(), outCoord[1], this._object.getRadius(), Math.PI / 2, 2.5 * Math.PI, false);
		}

		let coordinates;
		
		let i = 1;
		for (let wire of this._object.getInputs().values()) {
			if (this._object.getInvertedInputs().includes(wire.getId())) {
				coordinates = this._object.getInputCoordinates(i);
				ctx.moveTo(coordinates[0] - this._object.getRadius(), coordinates[1] + this._object.getRadius());		//TODO radius to draw component
				ctx.arc(coordinates[0] - this._object.getRadius(), coordinates[1], this._object.getRadius(), Math.PI / 2, 2.5 * Math.PI, false);
			}
			i++;
		}
		
		ctx.stroke();
		
		if (debug === true) {
			this._debugDraw(ctx);
		}
	
	};
	
	TimerDrawComponent.prototype._debugDraw = function(ctx) {
		
	}
	
	return TimerDrawComponent;
});