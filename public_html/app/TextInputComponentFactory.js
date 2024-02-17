define(['./TextInputComponent'], function (TextInputComponent) {
	return {
		create: function(object, mouseinput) {
			return new TextInputComponent(object, mouseinput);
		}
	};
});