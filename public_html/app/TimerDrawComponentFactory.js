define(['./TimerDrawComponent'], function (TimerDrawComponent) {
	return {
		create: function(object) {
			return new TimerDrawComponent(object);
		}
	};
});