define(['./MainLoop'], function (MainLoop) {
	return {
		create: function(updateTime, render, objectManager, leftPanel) {
			return new MainLoop(updateTime, render, objectManager, leftPanel);
		}
	};
});