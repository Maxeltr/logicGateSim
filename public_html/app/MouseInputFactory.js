define(['./MouseInput'], function (MouseInput) {
    return {
        create: function (canvas) {
			return new MouseInput(canvas);
		}
	};
});