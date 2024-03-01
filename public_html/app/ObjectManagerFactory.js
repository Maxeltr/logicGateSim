define(['./ObjectManager'], function (ObjectManager) {
	return {
		create: function(mouseinput, render, mutex) {
			let expression = document.getElementById("expression");
			return new ObjectManager(mouseinput, render, mutex, expression);
		}
	};
});