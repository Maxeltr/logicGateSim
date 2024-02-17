define(['./GateDrawComponent'], function (GateDrawComponent) {
	return {
		create: function(object) {
			return new GateDrawComponent(object);
		}
	};
});