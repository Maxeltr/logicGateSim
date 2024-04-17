define(['./MainLoop'], function (MainLoop) {
	return {
		create: function(updateTime, render, objectManager) {
			return new MainLoop(updateTime, render, objectManager);
		}
	};
});