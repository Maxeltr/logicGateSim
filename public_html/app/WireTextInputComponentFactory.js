define(['./WireTextInputComponent'], function (WireTextInputComponent) {
	return {
		create: function(object, mouseinput) {
			let lockInput = document.getElementById("lock");
			return new WireTextInputComponent(object, mouseinput, lockInput);
		}
	};
});