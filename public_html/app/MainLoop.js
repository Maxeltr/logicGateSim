define(function () {
    function MainLoop(updateTimeInput, render, objectManager) {
		this._render = render;
		this._objectManager = objectManager;
		this._updateTimeInput = updateTimeInput;
		this._updateTimeInput.addEventListener('change', this._onChange.bind(this));
		this._updateTime = 0;
		this._time = 0;
		this.index = 0;
		this.passedTime = 0;
		this.timeSlice = 0;
		this.amount = 0;
		
		/* MainLoop.prototype.loop = function (seconds) {
			this._render.clearScreen();
			for (let i = 0; i < this._objects.length; i++) {
				if (this._time >= this._updateTime) {
					this._time = 0;
					this._objects[i].update(seconds);
				} else {
					this._time += seconds;
				}
				this._objects[i].draw(this._render.getContext(), true);
			}
		}.bind(this); */
		
		MainLoop.prototype.loop = function (seconds) {
			this._render.clearScreen();
			this._render.drawAxises();
			let ctx = this._render.getContext();
			let objects = this._objectManager.getDrawObjects();
			for (let i = 0; i < objects.length; i++) {
				objects[i].draw(ctx, true);
			}
						
			if (this._updateTime === 0) {
				objects = this._objectManager.getUpdateObjects();
				this.amount = objects.length;
				for (let i = 0; i < this.amount; i++) {
					objects[i].update(seconds, i + 1);
				}
			} else {
				this.slowUpdate(seconds);				
			}
		}.bind(this);
	}
	
	MainLoop.prototype.slowUpdate = function (seconds) {
		if (this.index === 0) {									//start loop
			this.objects = this._objectManager.getUpdateObjects();
			
			this.amount = this.objects.length;
			this.timeSlice = this._updateTime / this.amount;
		}
		this.passedTime += seconds;
		
		if (this.passedTime > this.timeSlice) {
			if (this.index < this.amount) {
				this.objects[this.index].update(seconds, this.index + 1);
				this.index++;
			} else {
				this.index = 0;									//end loop
			}
			this.passedTime = 0;
		}
		
	};
	
	MainLoop.prototype._onChange = function () {
		this._updateTime = parseFloat(this._updateTimeInput.value);
		this.index = 0;
		this.passedTime = 0;
	};

    return MainLoop;
});

