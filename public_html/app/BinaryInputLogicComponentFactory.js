define(['./BinaryInputLogicComponent'], function (BinaryInputLogicComponent) {
	return {
		create: function(object) {
			return new BinaryInputLogicComponent(object);
		}
	};
});