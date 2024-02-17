define(['./TriggerLogicComponent'], function (TriggerLogicComponent) {
	return {
		create: function(object) {
			return new TriggerLogicComponent(object);
		}
	};
});