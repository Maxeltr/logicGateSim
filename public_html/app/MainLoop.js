define(function () {
    function MainLoop(render, objects) {
        this._objects = objects;
		this._render = render;
		
		let ctx = this._render.getContext();
        MainLoop.prototype.loop = function (seconds) {
            this._render.clearScreen();
            for (let i = 0; i < this._objects.length; i++) {
				this._objects[i].update(seconds);
				this._objects[i].draw(ctx, true);

			}
			
        }.bind(this);


    }

    return {
        create: function (render, objects) {
            return new MainLoop(render, objects);
        }
    };
});

