define(['./BusInputsComponent'], function (BusInputsComponent) {
	return {
		create: function(object) {
			return new BusInputsComponent(object);
		}
	};
});