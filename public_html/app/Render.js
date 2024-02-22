define(function (require) {
    function Render(requestAnimationFrame) {
        this._canvas;
        this._context;
        this._OffScreenCanvas;
        this._ctxOffScrCanvas;
        //this.OffScreenCanvas = document.createElement('canvas');
        //this.OffScreenCanvas.height = width / 5;
        //this.OffScreenCanvas.width = width / 5;
        //this.ctxOffScrCanvas = this.OffScreenCanvas.getContext("2d");
        this._height = 512;
        this._width = 1024;
		this._requestAnimationFrame = requestAnimationFrame;
    }

	Render.prototype.start = function (callback) {
		this._requestAnimationFrame.start(callback);
	};
	
	Render.prototype.stop = function () {
		this._requestAnimationFrame.stop();
	};
		
	Render.prototype.getContext = function (canvas) {
		return this._context;
	};
	
	Render.prototype.setCanvas = function (canvas) {
		this._canvas = canvas;
		this._canvas.width = this._width;
		this._canvas.height = this._height;
		this._context = this._canvas.getContext("2d");
		this._context.msImageSmoothingEnabled = false;
		this._context.mozImageSmoothingEnabled = false;
		this._context.imageSmoothingEnabled = false;
	};
	
	Render.prototype.drawRect = function (x, y, width, height, color) {
		this._context.save();
		this._context.fillStyle = color;
		this._context.fillRect(x, y, width, height);
		this._context.restore();
	};

	Render.prototype.clearScreen = function () {
		this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
	};
		
    return Render;
});