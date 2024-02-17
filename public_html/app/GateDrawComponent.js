define(function () {
    function GateDrawComponent(object) {
		this._object = object;
		this._connectColor = 'black';
		this._unconnectColor = 'grey';
		this._debugColor = 'pink';
		this._activeColor = 'red';
	}
	
	GateDrawComponent.prototype.draw = function (ctx, debug = false) {
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
	
	GateDrawComponent.prototype._debugDraw = function(ctx) {
		
	}
		
	GateDrawComponent.prototype._chooseColor = function(ctx) {
		if (this._object.getInputs().size === 0 && this._object.getOutputs().size === 0) {	//TODO get component
			ctx.strokeStyle = this._unconnectColor;
		} else {
			if (this._object.isActivated()) {
				ctx.strokeStyle = this._activeColor;
			} else {
				ctx.strokeStyle = this._connectColor;
			}
		}
	};

	return GateDrawComponent;
});