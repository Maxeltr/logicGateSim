define(['./TimerInputsComponent'], function (TimerInputsComponent) {
	return {
		create: function(object) {
			return new TimerInputsComponent(object);
		}
	};
});