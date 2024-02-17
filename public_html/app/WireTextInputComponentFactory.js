define(['./WireTextInputComponent'], function (WireTextInputComponent) {
	return {
		create: function(object, mouseinput) {
			return new WireTextInputComponent(object, mouseinput);
		}
	};
});