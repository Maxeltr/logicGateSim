define(['./TimerLogicComponent'], function (TimerLogicComponent) {
	return {
		create: function(object, type) {
			return new TimerLogicComponent(object, type);
		}
	};
});