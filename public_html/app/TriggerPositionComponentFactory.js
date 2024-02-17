define(['./TriggerPositionComponent'], function (TriggerPositionComponent) {
	return {
		create: function(object, mouseinput, mutex) {
			return new TriggerPositionComponent(object, mouseinput, mutex);
		}
	};
});