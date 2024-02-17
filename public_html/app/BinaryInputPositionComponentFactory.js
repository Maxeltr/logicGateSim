define(['./BinaryInputPositionComponent'], function (BinaryInputPositionComponent) {
	return {
		create: function(object, mouseinput, mutex) {
			return new BinaryInputPositionComponent(object, mouseinput, mutex);
		}
	};
});