define(['./WirePositionComponent'], function (WirePositionComponent) {
	return {
		create: function(object, mouseinput, mutex, x, y, connectCallback) {
			let lockInput = document.getElementById("lock");
			return new WirePositionComponent(object, mouseinput, mutex, x, y, connectCallback, lockInput);
		}
	};
});