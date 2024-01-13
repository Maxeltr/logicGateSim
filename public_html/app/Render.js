define(function () {
    function Render() {
        this.canvas;
        this.context;
        this.OffScreenCanvas;
        this.ctxOffScrCanvas;
        //this.OffScreenCanvas = document.createElement('canvas');
        //this.OffScreenCanvas.height = width / 5;
        //this.OffScreenCanvas.width = width / 5;
        //this.ctxOffScrCanvas = this.OffScreenCanvas.getContext("2d");
        this.height = 512;
        this.width = 1024;
    }

    Render.prototype.setCanvas = function (canvas) {
        this.canvas = canvas;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext("2d");
        this.context.msImageSmoothingEnabled = false;
        this.context.mozImageSmoothingEnabled = false;
        this.context.imageSmoothingEnabled = false;
    };

    Render.prototype.drawRect = function (x, y, width, height, color) {
        this.context.save();
        this.context.fillStyle = color;
        this.context.fillRect(x, y, width, height);
        this.context.restore();
    };

    Render.prototype.clearScreen = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    return {
        create: function () {
            return new Render();
        }
    };
});