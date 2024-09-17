define(function () {
    function BusDrawComponent(object) {
		this._object = object;
		this._busColor = 'black';
		this._endRadius = 5;
	}
	
	BusDrawComponent.prototype.draw = function(ctx, debug = false) {
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = this._busColor;
		ctx.lineWidth = 3;
		let polyline = this._object.getCoordinates();
		ctx.moveTo(polyline[0], polyline[1]);
		let polyLength = polyline.length;
		for (let i = 2; i < polyLength - 1; i +=2) {
			ctx.lineTo(polyline[i], polyline[i + 1]);
		}
		ctx.stroke();
		
		let inputCoordinates, inputName;
		for (let wire of this._object.getInputs().values()) {
			if (typeof wire.getEnd1() !== 'undefined' && wire.getEnd1().getId() === this._object.getId()) {	//wire is connected to the bus input
				inputCoordinates = this._object.getInputCoordinates(wire);
				this._drawInputs(ctx, debug = false, inputCoordinates[0], inputCoordinates[1]);
				inputName = this._object.getInputName(wire);
				ctx.textBaseline = 'bottom';
				ctx.textAlign = 'right';
				ctx.fillText(inputName === undefined ? '' : inputName, inputCoordinates[0] - 2 * this._endRadius, inputCoordinates[1]);
			}
			
		}
		
		for (let wire of this._object.getOutputs().values()) {
			if (typeof wire.getEnd0() !== 'undefined' && wire.getEnd0().getId() === this._object.getId()) {	//wire is connected to the bus output
				outCoordinates = this._object.getOutputCoordinates(wire);
				this._drawOutputs(ctx, debug = false, outCoordinates[0], outCoordinates[1]);
				outputName = this._object.getOutputName(wire);
				ctx.textBaseline = 'bottom';
				ctx.textAlign = 'left';
				ctx.fillText(outputName === undefined ? '' : outputName, outCoordinates[0] + 2 * this._endRadius, outCoordinates[1]);
			}
			
		}
		
		ctx.restore();
	};
	
	BusDrawComponent.prototype._drawInputs = function(ctx, debug = false, x ,y) {
		ctx.beginPath();
		ctx.moveTo(x , y );
		ctx.arc(x, y, this._endRadius, 0.5 * Math.PI, Math.PI, false);
		ctx.fillStyle = this._busColor;
		ctx.fill();
	};
	
	BusDrawComponent.prototype._drawOutputs = function(ctx, debug = false, x ,y) {
		ctx.beginPath();
		ctx.moveTo(x , y );
		ctx.arc(x, y, this._endRadius, 0, 0.5 * Math.PI, false);
		ctx.fillStyle = this._busColor;
		ctx.fill();
	};
	
	return BusDrawComponent;
});