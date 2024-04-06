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
		this._drag = false;
		this._dragStart = {'x': 0, 'y': 0};
		this._dragEnd = {'x': 0, 'y': 0};
		
		this._zoomInInput = inputs.get('zoomInInput');
		this._zoomInInput.addEventListener('click', this._zoomIn.bind(this));
		this._zoomNormalInput = inputs.get('zoomNormalInput');
		this._zoomNormalInput.addEventListener('click', this._zoomNormal.bind(this));
		this._zoomOutInput = inputs.get('zoomOutInput');
		this._zoomOutInput.addEventListener('click', this._zoomOut.bind(this));
		
		this._moveLeftInput = inputs.get('moveLeftInput');
		this._moveLeftInput.addEventListener('click', this._onMoveLeft.bind(this));
		this._moveRightInput = inputs.get('moveRightInput');
		this._moveRightInput.addEventListener('click', this._onMoveRight.bind(this));
		
		this._moveUpInput = inputs.get('moveUpInput');
		this._moveUpInput.addEventListener('click', this._onMoveUp.bind(this));
		this._moveDownInput = inputs.get('moveDownInput');
		this._moveDownInput.addEventListener('click', this._onMoveDown.bind(this));
		
		this._canvasLeftX = 0;
		this._canvasRightX = this._width;
		this._canvasTopY = 0;
		this._canvasBottomY = this._height;
		
/* 		this._screenLeftX = 0;
		this._screenRightX = this._width;
		this._screenTopY = 0;
		this._screenBottomY = this._height; */
		
		this._currentScale = 1;
		this._currentShiftX = 0;
		this._currentShiftY = 0;
		this._shiftFactor = 100;
		this._scaleFactor = 1.1;
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
		
		this._canvas.addEventListener('wheel', this._onWheel.bind(this));
		this._canvas.addEventListener('mousedown', this._onMouseDown.bind(this));
		this._canvas.addEventListener('mousemove', this._onMouseMove.bind(this));
		this._canvas.addEventListener('mouseup', this._onMouseUp.bind(this));
	};
	
	Render.prototype._onMouseDown = function (e) {
		if (e.button === 1) {
			e.preventDefault();
			let rect = this._canvas.getBoundingClientRect();
			let x = Math.round((e.clientX - rect.left));
			let y = Math.round((e.clientY - rect.top ));
			this._drag = true;
			this._dragStart = {'x': x, 'y': y};
		} else {
			this._drag = false;
		}
	}
	
	Render.prototype._onMouseMove = function (e) {
		if (this._drag === true) {
			let rect = this._canvas.getBoundingClientRect();
			let x = Math.round((e.clientX - rect.left));
			let y = Math.round((e.clientY - rect.top));
			this._dragEnd = {'x': x, 'y': y};
			let shiftX = this._dragEnd.x - this._dragStart.x;
			let shiftY = this._dragEnd.y - this._dragStart.y;
			this._move(shiftX, shiftY);
			this._dragStart = this._dragEnd;
		}
	};
	
	Render.prototype._onMouseUp = function (e) {
		this._drag = false;
	};
	
	Render.prototype.drawRect = function (x, y, width, height, color) {
		this._context.save();
		this._context.fillStyle = color;
		this._context.fillRect(x, y, width, height);
		this._context.restore();
	};
	
	Render.prototype.drawAxises = function () {
		this._context.strokeStyle = 'grey';
		this._context.beginPath();
		this._context.moveTo(0, 0);
		this._context.lineTo(50, 0);
		this._context.lineTo(45, 5);
		this._context.moveTo(50, 0);
		this._context.lineTo(45, -5);
		this._context.moveTo(0, 0);
		this._context.lineTo(0, 50);
		this._context.lineTo(5, 45);
		this._context.moveTo(0, 50);
		this._context.lineTo(-5, 45);
		this._context.stroke();
	};

	Render.prototype.clearScreen = function () {
		let dimensions = this._getScreenDimensions();
		this._context.clearRect(
			dimensions.lX,
			dimensions.tY,
			dimensions.width,
			dimensions.height
		);
	};
	
	Render.prototype._getScreenDimensions = function () {
		/* let currentCanvasLeftX = this._canvasLeftX * this._currentScale + this._currentShiftX;
		let currentCanvasRightX = this._canvasRightX * this._currentScale + this._currentShiftX;
		let currentCanvasTopY = this._canvasTopY * this._currentScale + this._currentShiftY;
		let currentCanvasBottomY = this._canvasBottomY * this._currentScale + this._currentShiftY; */
		
		let lx = (this._canvasLeftX - this._currentShiftX) / this._currentScale;
		let ty = (this._canvasTopY - this._currentShiftY) / this._currentScale;
		let width = (this._canvasRightX - this._canvasLeftX) / this._currentScale;
		let height = (this._canvasBottomY - this._canvasTopY) / this._currentScale;
		
		return {
			'lX': lx,
			'tY': ty,
			'width': width,
			'height': height,
		}
	};
	
	Render.prototype._onWheel = function (e) {
		e.preventDefault();
		if (e.deltaY < 0) {
			this._zoomIn();
		} else {
			this._zoomOut();
		}
	};
	
	Render.prototype._zoom = function (scale) {
		this._currentScale *= scale;
		this._context.scale(scale, scale);
		this._mouseInput.setScaleFactor(this._currentScale);
	};
	
	Render.prototype._zoomIn = function () {
		let scale = this._scaleFactor;
		this._zoom(scale);
	};
	
	Render.prototype._zoomNormal = function () {
		this._currentScale = 1;
		this._currentShiftX = 0;
		this._currentShiftY = 0;
		this._context.setTransform(1, 0, 0, 1, 0, 0);
		this._mouseInput.setScaleFactor(this._currentScale);
		this._mouseInput.setXShift(this._currentShiftX);
		this._mouseInput.setYShift(this._currentShiftY);
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
	
	Render.prototype._onMoveLeft = function () {
		this._moveLeft(this._shiftFactor);
	};
	
	Render.prototype._moveLeft = function (offset) {
		let shift = offset;
		/* let currentCanvasRightX = this._canvasRightX * this._currentScale + this._currentShiftX;
		let newCurrentCanvasRightX = currentCanvasRightX - shift * this._currentScale;
		if (newCurrentCanvasRightX <= this._canvasRightX) {
			shift = (newCurrentCanvasRightX - this._canvasRightX) / this._currentScale + shift;
		} */
		
		this._context.translate(- shift, 0);
		this._currentShiftX -= shift * this._currentScale;
		this._mouseInput.setXShift(this._currentShiftX);
	};
	
	Render.prototype._onMoveRight = function () {
		this._moveRight(this._shiftFactor);
	};
	
	Render.prototype._moveRight = function (offset) {
		let shift = offset;
		/* let currentCanvasLeftX = this._canvasLeftX * this._currentScale + this._currentShiftX;
		let newCurrentCanvasLeftX = currentCanvasLeftX + shift * this._currentScale;
		if (newCurrentCanvasLeftX >= this._canvasLeftX) {
			shift = (this._canvasLeftX - newCurrentCanvasLeftX) / this._currentScale + shift;
		} */
		
		this._context.translate(shift, 0);
		this._currentShiftX += shift * this._currentScale;
		this._mouseInput.setXShift(this._currentShiftX);
	};
	
	Render.prototype._onMoveUp = function () {
		this._moveUp(this._shiftFactor);
	};
	
	Render.prototype._moveUp = function (offset) {
		let shift = offset;
		/* let currentCanvasBottomY = this._canvasBottomY * this._currentScale + this._currentShiftY;
		let newCurrentCanvasBottomY = currentCanvasBottomY - shift * this._currentScale;
		if (newCurrentCanvasBottomY <= this._canvasBottomY) {
			shift = (newCurrentCanvasBottomY - this._canvasBottomY) / this._currentScale + shift;
		} */
		
		this._context.translate(0, - shift);
		this._currentShiftY -= shift * this._currentScale;
		this._mouseInput.setYShift(this._currentShiftY);
	};
	
	Render.prototype._onMoveDown = function () {
		this._moveDown(this._shiftFactor);
	};
	
	Render.prototype._moveDown = function (offset) {
		let shift = offset;
		/* let currentCanvasTopY = this._canvasTopY * this._currentScale + this._currentShiftY;
		let newCurrentCanvasTopY = currentCanvasTopY + shift * this._currentScale;
		if (newCurrentCanvasTopY >= this._canvasTopY) {
			shift = (this._canvasTopY - newCurrentCanvasTopY) / this._currentScale + shift;
		} */
		
		this._context.translate(0, shift);
		this._currentShiftY += shift * this._currentScale;
		this._mouseInput.setYShift(this._currentShiftY);
	};
	
	Render.prototype._move = function (shiftX, shiftY) {
		this._context.translate(shiftX, shiftY);
		this._currentShiftX += shiftX * this._currentScale;
		this._currentShiftY += shiftY * this._currentScale;
		this._mouseInput.setXShift(this._currentShiftX);
		this._mouseInput.setYShift(this._currentShiftY);
	};
	
    return Render;
});