define(['./GatePositionComponent'], function (GatePositionComponent) {
	return {
		create: function(object, mouseinput, mutex) {
			let lockInput = document.getElementById("lock");
			return new GatePositionComponent(object, mouseinput, mutex, lockInput);
		}
	};
});