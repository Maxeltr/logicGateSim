define(['./LeftPanel'], function (LeftPanel) {
	return {
		create: function(mouseinput, objectManager, width, height, serializer) {
			return new LeftPanel(mouseinput, objectManager, width, height, serializer);
		}
	};
});