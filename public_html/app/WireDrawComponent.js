define(function () {
    function WireDrawComponent(object) {
		this._object = object;
		this._connectColor = 'black';	//nonactive, false, 0
		this._unconnectColor = 'grey';
		this._activatedColor = 'red';			//active, true, 1
	}
	
	WireDrawComponent.prototype = {
		draw: function(ctx, debug = false) {
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
			
			ctx.textBaseline = "bottom";
			ctx.fillText(this._object.getName(), polyline[0] + 5, polyline[1]);
			ctx.fillText(this._object.getName(), polyline[polyLength - 4 ] + 5, polyline[polyLength - 3]);
			ctx.restore();
		},
		
		_chooseColor: function (ctx) {
			if (typeof this._object.getEnd0() === 'undefined' && typeof this._object.getEnd1() === 'undefined') {
				ctx.strokeStyle = this._unconnectColor;
			} else {
				if (typeof this._object.getEnd0() !== 'undefined' && this._object.getEnd0().isActivated()) {
					ctx.strokeStyle = this._activatedColor;
				} else {
					ctx.strokeStyle = this._connectColor;
				}
			}
		}
		
		
		
	};
	
	return WireDrawComponent;
});