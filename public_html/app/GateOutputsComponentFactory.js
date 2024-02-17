define(['./GateOutputsComponent'], function (GateOutputsComponent) {
	return {
		create: function(object) {
			return new GateOutputsComponent(object);
		}
	};
});