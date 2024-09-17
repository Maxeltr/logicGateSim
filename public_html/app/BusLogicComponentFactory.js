define(['./BusLogicComponent'], function (BusLogicComponent) {
	return {
		create: function(object) {
			return new BusLogicComponent(object);
		}
	};
});