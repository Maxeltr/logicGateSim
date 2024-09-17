define(['./BusOutputsComponent'], function (BusOutputsComponent) {
	return {
		create: function(object) {
			return new BusOutputsComponent(object);
		}
	};
});