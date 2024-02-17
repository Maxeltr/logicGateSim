define(['./WirePositionComponent'], function (WirePositionComponent) {
	return {
		create: function(object, mouseinput, mutex, x, y, connectCallback) {
			return new WirePositionComponent(object, mouseinput, mutex, x, y, connectCallback);
		}
	};
});