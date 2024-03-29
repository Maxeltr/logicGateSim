define(function (require) {
    function Render(requestAnimationFrame, inputs, mouseInput) {
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
		
		this._zoomInInput = inputs.get('zoomInInput');
		this._zoomInInput.addEventListener('click', this._zoomIn.bind(this));
		this._zoomNormalInput = inputs.get('zoomNormalInput');
		this._zoomNormalInput.addEventListener('click', this._zoomNormal.bind(this));
		this._zoomOutInput = inputs.get('zoomOutInput');
		this._zoomOutInput.addEventListener('click', this._zoomOut.bind(this));
		
		this._moveLeftInput = inputs.get('moveLeftInput');
		this._moveLeftInput.addEventListener('click', this._moveLeft.bind(this));
		this._moveRightInput = inputs.get('moveRightInput');
		this._moveRightInput.addEventListener('click', this._moveRight.bind(this));
		
		this._moveUpInput = inputs.get('moveUpInput');
		this._moveUpInput.addEventListener('click', this._moveUp.bind(this));
		this._moveDownInput = inputs.get('moveDownInput');
		this._moveDownInput.addEventListener('click', this._moveDown.bind(this));
		
		this._canvasLeftX = 0;
		this._canvasRightX = this._width;
		this._canvasTopY = 0;
		this._canvasBottomY = this._height;
		
		this._scale = 1;
		this._shiftX = 0;
		this._shiftY = 0;
		this._shiftFactor = 10;
		this._scaleFactor = 1.1;
		//this._affineMatrix = [1, 0, 0, 1, 0, 0];
		this._mouseInput = mouseInput;
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
	
	/* Render.prototype._translate = function (x, y) {
		this._affineMatrix[4] += this._affineMatrix[0] * x + this._affineMatrix[2] * y;
		this._affineMatrix[5] += this._affineMatrix[1] * x + this._affineMatrix[3] * y;
		//this._context.translate(x, y);
		this._context.transform(
			this._affineMatrix[0], 
			this._affineMatrix[1], 
			this._affineMatrix[2], 
			this._affineMatrix[3], 
			this._affineMatrix[4], 
			this._affineMatrix[5]
		);
		let matrix = this._context.getTransform();
		this._affineMatrix = [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f];
		this._mouseInput.setAffineMatrix(this._affineMatrix);
	}; */
	
	Render.prototype._zoom = function (scale) {
		this._scale *= 1 / scale;
		this._shiftX *= 1 / scale;
		this._shiftY *= 1 / scale;
		this._shiftFactor *= 1 / scale;
		this._canvasLeftX *= scale;
		this._canvasRightX *= scale;
		this._canvasTopY *= scale;
		this._canvasBottomY *= scale;
		
		/* this._scale = Math.floor(this._scale *1 / scale);
		this._shiftX = Math.floor(this._shiftX * 1 / scale);
		this._shiftY = Math.floor(this._shiftY * 1 / scale);
		this._shiftFactor = Math.floor(this._shiftFactor * 1 / scale);
		this._canvasLeftX = Math.floor(this._canvasLeftX * scale);
		this._canvasRightX = Math.floor(this._canvasRightX * scale);
		this._canvasTopY = Math.floor(this._canvasTopY * scale);
		this._canvasBottomY = Math.floor(this._canvasBottomY * scale); */
		
		//this._clearCanvas(scale);

		this._context.scale(scale, scale);
		//let matrix = this._context.getTransform();
		//this._scale = matrix.a;
		this._mouseInput.setScaleFactor(this._scale);
		this._mouseInput.setXShift(this._shiftX);
		this._mouseInput.setYShift(this._shiftY);
this._dim();
	};
	
	Render.prototype._dim = function () {
		console.log('-------------------')
		console.log('scale ' + this._scale)
		console.log('_shiftFactor ' + this._shiftFactor)
console.log('_shiftX ' + this._shiftX)
console.log('_shiftY ' + this._shiftY)

console.log('_canvasLeftX ' + this._canvasLeftX)
console.log('_canvasRightX ' + this._canvasRightX)
console.log('_canvasTopY ' + this._canvasTopY)
console.log('_canvasBottomY ' + this._canvasBottomY)
	};
	
	Render.prototype._zoomIn = function () {
		let scale = this._scaleFactor;
		this._zoom(scale);
	};
	
	Render.prototype._zoomNormal = function () {
		this._scale = 1;
		this._shiftX = 0;
		this._shiftY = 0;
		this._shiftFactor = 10;
		this._canvasLeftX = 0;
		this._canvasRightX = this._width;
		this._canvasTopY = 0;
		this._canvasBottomY = this._height;
		//this._clearCanvas(scale);
		this._context.setTransform(1, 0, 0, 1, 0, 0);
		this._mouseInput.setScaleFactor(this._scale);
		this._mouseInput.setXShift(this._shiftX);
		this._mouseInput.setYShift(this._shiftY);
		
		console.log(this._context.getTransform());
	};
	
	Render.prototype._zoomOut = function () {
		let scale = 1 / this._scaleFactor;
		this._zoom(scale);
	};
	
	Render.prototype._clearCanvas = function (scale) {
		let currentTransform = this._context.getTransform();
		this._context.setTransform(1.1, 0, 0, 1.1, 0, 0);
		this._context.clearRect(0, 0, this._canvas.width * scale, this._canvas.height * scale);
		this._context.setTransform(currentTransform);
	};
	
	Render.prototype._moveLeft = function () {
		if (this._canvasRightX <= this._width) return;
		
		let shiftFactor = this._shiftFactor;
		let dCanvasRightX = Math.abs(this._canvasRightX - this._width);
		if (dCanvasRightX < shiftFactor) shiftFactor = dCanvasRightX;
			
		this._canvasLeftX -= shiftFactor;
		this._canvasRightX -= shiftFactor;
		//this._clearCanvas(this._scale);
		this._context.translate(- shiftFactor, 0);
		this._shiftX -= shiftFactor;
		this._mouseInput.setXShift(this._shiftX);
		this._dim();
	};
	
	Render.prototype._moveRight = function () {
		if (this._canvasLeftX >= 0) return;
		
		let shiftFactor = this._shiftFactor;
		let dCanvasLeftX = Math.abs(0 - this._canvasLeftX );
		if (dCanvasLeftX < shiftFactor) shiftFactor = dCanvasLeftX;
console.log(dCanvasLeftX)
		this._canvasLeftX += shiftFactor;
		this._canvasRightX += shiftFactor;
		//this._clearCanvas(this._scale);
		this._context.translate(shiftFactor, 0);
		this._shiftX += shiftFactor;
		this._mouseInput.setXShift(this._shiftX);
		this._dim();
	};
	
	Render.prototype._moveUp = function () {
		//this._clearCanvas(this._scale);
		this._context.translate(0, - this._shiftFactor);
		this._shiftY -= this._shiftFactor;
		this._mouseInput.setYShift(this._shiftY);
		console.log('dy ' + this._shiftY)
		
	};
	
	Render.prototype._moveDown = function () {
		//this._clearCanvas(this._scale);
		this._context.translate(0, this._shiftFactor);
		this._shiftY += this._shiftFactor;
		this._mouseInput.setYShift(this._shiftY);
		console.log('dy ' + this._shiftY)
	};
	
    return Render;
});