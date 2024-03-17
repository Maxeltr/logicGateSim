define(['./TextInputComponent'], function (TextInputComponent) {
	return {
		create: function(object, mouseinput) {
			let lockInput = document.getElementById("lock");
			return new TextInputComponent(object, mouseinput, lockInput);
		}
	};
});