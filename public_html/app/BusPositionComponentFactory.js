define(['./BusPositionComponent'], function (BusPositionComponent) {
	return {
		create: function(object, mouseinput, mutex, x, y) {
			let lockInput = document.getElementById("lock");
			return new BusPositionComponent(object, mouseinput, mutex, x, y, function(dummy){}, lockInput);
		}
	};
});