define(['./TriggerPositionComponent'], function (TriggerPositionComponent) {
	return {
		create: function(object, mouseinput, mutex) {
			let lockInput = document.getElementById("lock");
			return new TriggerPositionComponent(object, mouseinput, mutex, lockInput);
		}
	};
});