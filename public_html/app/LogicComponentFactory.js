define(['./LogicComponent'], function (LogicComponent) {
	return {
		create: function(object, type) {
			return new LogicComponent(object, type);
		}
	};
});