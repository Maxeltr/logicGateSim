define(['./Render'], function (Render) {
	return {
		create: function(requestAnimationFrame) {
			return new Render(requestAnimationFrame);
		}
	};
});