define(['./TriggerDrawComponent'], function (TriggerDrawComponent) {
	return {
		create: function(object) {
			return new TriggerDrawComponent(object);
		}
	};
});