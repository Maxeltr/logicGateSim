define(['./BinaryInputDrawComponent'], function (BinaryInputDrawComponent) {
	return {
		create: function(object) {
			return new BinaryInputDrawComponent(object);
		}
	};
});