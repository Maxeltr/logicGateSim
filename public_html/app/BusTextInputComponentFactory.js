define(['./BusTextInputComponent'], function (BusTextInputComponent) {
	return {
		create: function(object, mouseinput) {
			let lockInput = document.getElementById("lock");
			return new BusTextInputComponent(object, mouseinput, lockInput);
		}
	};
});