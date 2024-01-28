define(function () {
    function LeftPanel(mouseinput, objectManager, width, height, saver) {
		this.mouseinput;
		this.objectManager;
		this.objectToCreate = undefined;
		this.width = width;
		this.height = height;
		this.isMouseDownOnLeftPanel = false;
		this._saver = saver;

		this.mouseinput = mouseinput;
		this.objectManager = objectManager;
		mouseinput.subscribe('mousedown', this.onMouseDown.bind(this));
		mouseinput.subscribe('mouseup', this.onMouseUp.bind(this));
    }

	LeftPanel.prototype.onMouseDown = function (mouseInput) {
		if (mouseInput.lastX() < this.width) {
			if (mouseInput.lastY() > 0 && mouseInput.lastY() < 20) {
				this.objectToCreate = 'link';
			} else if (mouseInput.lastY() > 25 && mouseInput.lastY() < 35) {
				this.objectToCreate = 'BI';
			} else if (mouseInput.lastY() > 40 && mouseInput.lastY() < 55) {
				this.objectToCreate = '&';
			} else if (mouseInput.lastY() > 60 && mouseInput.lastY() < 75) {
				this.objectToCreate = '1';
			} else if (mouseInput.lastY() > 280 && mouseInput.lastY() < 295) {
				this._saver.save();
			} else if (mouseInput.lastY() > 300 && mouseInput.lastY() < 315) {
				this._saver.load();
			}
			this.isMouseDownOnLeftPanel = true;
		}
	}
	
	LeftPanel.prototype.onMouseUp = function (mouseInput) {
		if (this.isMouseDownOnLeftPanel === true && mouseInput.lastX() > this.width && typeof this.objectToCreate !== 'undefined') {
			this.objectManager.create(this.objectToCreate, mouseInput.lastX(), mouseInput.lastY());
			this.objectToCreate = undefined;
		}
		this.isMouseDownOnLeftPanel = false;
	}
	
	LeftPanel.prototype.draw = function (ctx, debug = false) {
		ctx.save();
		ctx.strokeStyle  = 'orange';
		ctx.beginPath();
		ctx.moveTo(this.width, 0);
		ctx.lineTo(this.width, this.height);
		ctx.stroke();
		
		ctx.textBaseline = "top";
		ctx.font = "12px serif";
		ctx.fillText('Link', 0, 5);
		ctx.fillText('BI', 0, 25);
		ctx.fillText('AND', 0, 45);
		ctx.fillText('OR', 0, 65);
		ctx.fillText('Save', 0, 285);
		ctx.fillText('Load', 0, 300);
		ctx.restore();
	}
	
	LeftPanel.prototype.update = function (seconds) {
		
	}
	
    return {
        create: function (mouseinput, objectManager, width, height, saver) {
            return new LeftPanel(mouseinput, objectManager, width, height, saver);
        }
    };
});