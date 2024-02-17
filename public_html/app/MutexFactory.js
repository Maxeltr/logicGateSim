define(['./Mutex'], function (Mutex) {
	return {
		create: function() {
			return new Mutex();
		}
	};
});