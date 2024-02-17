define(['./GateInputsComponent'], function (GateInputsComponent) {
	return {
		create: function(object) {
			return new GateInputsComponent(object);
		}
	};
});