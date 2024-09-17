define(['./BusDrawComponent'], function (BusDrawComponent) {
	return {
		create: function(object) {
			return new BusDrawComponent(object);
		}
	};
});