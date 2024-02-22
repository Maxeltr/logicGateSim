define(['./WireDrawComponent'], function (WireDrawComponent) {
	return {
		create: function(object) {
			let drawWireNumbers = document.getElementById("drawWireNumbers");
			return new WireDrawComponent(object, drawWireNumbers);
		}
	};
});