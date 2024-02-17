define(['./ObjectManager'], function (ObjectManager) {
	return {
		create: function(mouseinput, render, mutex) {
			return new ObjectManager(mouseinput, render, mutex);
		}
	};
});