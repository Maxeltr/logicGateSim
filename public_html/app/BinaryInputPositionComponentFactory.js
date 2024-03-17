define(['./BinaryInputPositionComponent'], function (BinaryInputPositionComponent) {
	return {
		create: function(object, mouseinput, mutex) {
			let lockInput = document.getElementById("lock");
			return new BinaryInputPositionComponent(object, mouseinput, mutex, lockInput);
		}
	};
});