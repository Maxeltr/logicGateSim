define(['./WireDrawComponent'], function (WireDrawComponent) {
	return {
		create: function(object) {
			return new WireDrawComponent(object);
		}
	};
});