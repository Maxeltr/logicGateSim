define(function () {
    function LeftPanel(mouseinput, objectManager, width, height, serializer) {
		this.mouseinput;
		this.objectManager;
		this.objectToCreate = undefined;
		this.width = width;
		this.height = height;
		this.isMouseDownOnLeftPanel = false;
		this._serializer = serializer;

		this.mouseinput = mouseinput;
		this.objectManager = objectManager;
		this.mouseinput.subscribe('mousedown', this.onMouseDown.bind(this), 'mousedownLeftpanel');
		this.mouseinput.subscribe('mouseup', this.onMouseUp.bind(this), 'mouseupLeftPanel');
    }

	LeftPanel.prototype.onMouseDown = function (mouseInput) {
		if (mouseInput.lastX() < this.width) {
			if (mouseInput.lastY() > 0 && mouseInput.lastY() < 20) {
				this.objectToCreate = 'wire';
			} else if (mouseInput.lastY() > 25 && mouseInput.lastY() < 35) {
				this.objectToCreate = 'BI';
			} else if (mouseInput.lastY() > 40 && mouseInput.lastY() < 55) {
				this.objectToCreate = 'AND';
			} else if (mouseInput.lastY() > 60 && mouseInput.lastY() < 75) {
				this.objectToCreate = 'OR';
			} else if (mouseInput.lastY() > 80 && mouseInput.lastY() < 95) {
				this.objectToCreate = 'timer';
			} else if (mouseInput.lastY() > 100 && mouseInput.lastY() < 115) {
				this.objectToCreate = 'trigger';
			} else if (mouseInput.lastY() > 280 && mouseInput.lastY() < 295) {
				this._serializer.save();
			} else if (mouseInput.lastY() > 300 && mouseInput.lastY() < 315) {
				this._serializer.load();
			} else if (mouseInput.lastY() > 320 && mouseInput.lastY() < 335) {
				this.objectManager.traverseMap();
			}
			this.isMouseDownOnLeftPanel = true;
		}
	};
	
	LeftPanel.prototype.onMouseUp = function (mouseInput) {
		if (this.isMouseDownOnLeftPanel === true && mouseInput.lastX() > this.width && typeof this.objectToCreate !== 'undefined') {
			this.objectManager.create(this.objectToCreate, mouseInput.lastX(), mouseInput.lastY());
			this.objectToCreate = undefined;
		}
		if (mouseInput.lastX() < this.width && mouseInput.lastY() > 350 && mouseInput.lastY() < 360) {
			this.objectManager.remove(0, this.width, 350, 360);
		}
		
		this.isMouseDownOnLeftPanel = false;
	};
	
	LeftPanel.prototype.draw = function (ctx, debug = false) {
		ctx.save();
		ctx.strokeStyle  = 'orange';
		ctx.beginPath();
		ctx.moveTo(this.width, 0);
		ctx.lineTo(this.width, this.height);
		ctx.stroke();
		
		ctx.textBaseline = "top";
		ctx.font = "12px serif";
		ctx.fillText('Wire', 0, 5);
		ctx.fillText('BI', 0, 25);
		ctx.fillText('AND', 0, 45);
		ctx.fillText('OR', 0, 65);
		ctx.fillText('Timer', 0, 85);
		ctx.fillText('Trigger', 0, 105);
		ctx.fillText('Save', 0, 285);
		ctx.fillText('Load', 0, 300);
		ctx.fillText('Traverse', 0, 315);
		ctx.fillText('Delete', 0, 350);
		ctx.restore();
	};
	
/* 	LeftPanel.prototype.update = function (seconds) {
		
	};
 */	
    return LeftPanel;
});