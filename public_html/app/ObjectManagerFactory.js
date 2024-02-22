define(['./ObjectManager'], function (ObjectManager) {
	return {
		create: function(mouseinput, render, mutex, drawWireNumbers) {
			return new ObjectManager(mouseinput, render, mutex, drawWireNumbers);
		}
	};
});