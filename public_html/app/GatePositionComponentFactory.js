define(['./GatePositionComponent'], function (GatePositionComponent) {
	return {
		create: function(object, mouseinput, mutex) {
			return new GatePositionComponent(object, mouseinput, mutex);
		}
	};
});