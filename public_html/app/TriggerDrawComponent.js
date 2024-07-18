define(['./GateDrawComponent'], function (GateDrawComponent) {
    function TriggerDrawComponent(object) {
		GateDrawComponent.apply(this, arguments);
	}
	
	TriggerDrawComponent.prototype = Object.create(GateDrawComponent.prototype);
	TriggerDrawComponent.prototype.constructor = TriggerDrawComponent;

	TriggerDrawComponent.prototype.draw = function (ctx, debug = false) {
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
		if (this._object.getDominantInput() === 'reset') {
			ctx.fillText('S', this._object.getLeftX(), this._object.getTopY() + 17);
			ctx.fillText('RD', this._object.getLeftX(), this._object.getBottomY() - 7);
		} else {
			ctx.fillText('SD', this._object.getLeftX(), this._object.getTopY() + 17);
			ctx.fillText('R', this._object.getLeftX(), this._object.getBottomY() - 7);
		}

		if (this._object.isOutputInverted()) {
			let outCoord = this._object.getOutputCoordinates();
			ctx.moveTo(outCoord[0] + this._object.getRadius(), outCoord[1] + this._object.getRadius());
			ctx.arc(outCoord[0] + this._object.getRadius(), outCoord[1], this._object.getRadius(), Math.PI / 2, 2.5 * Math.PI, false);
		}

		let coordinates;
				
		if (this._object.getInputs().size > 0) {
			let setInput = this._object.getSetInput();
			if (typeof setInput !== 'undefined' && this._object.getInvertedInputs().includes(setInput.getId())) {
				coordinates = this._object.getInputCoordinates(1);
				ctx.moveTo(coordinates[0] - this._object.getRadius(), coordinates[1] + this._object.getRadius());		//TODO radius to draw component
				ctx.arc(coordinates[0] - this._object.getRadius(), coordinates[1], this._object.getRadius(), Math.PI / 2, 2.5 * Math.PI, false);
			}
			
			let resetInput = this._object.getResetInput();
			if (typeof resetInput !== 'undefined' && this._object.getInvertedInputs().includes(resetInput.getId())) {
				coordinates = this._object.getInputCoordinates(2);
				ctx.moveTo(coordinates[0] - this._object.getRadius(), coordinates[1] + this._object.getRadius());		//TODO radius to draw component
				ctx.arc(coordinates[0] - this._object.getRadius(), coordinates[1], this._object.getRadius(), Math.PI / 2, 2.5 * Math.PI, false);
			}
		}
		ctx.stroke();

		if (debug === true) this._debugDraw(ctx);
	};
	
	TriggerDrawComponent.prototype._debugDraw = function(ctx) {
		
	}
	
	return TriggerDrawComponent;
});