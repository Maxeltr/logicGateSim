define(['./TimerLogicComponent'], function (TimerLogicComponent) {
	return {
		create: function(object) {
			return new TimerLogicComponent(object);
		}
	};
});