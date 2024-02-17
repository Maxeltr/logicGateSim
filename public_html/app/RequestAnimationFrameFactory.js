define(['./RequestAnimationFrame'], function (RequestAnimationFrame) {
	return {
		create: function () {
			return new RequestAnimationFrame();
		}
	};
});