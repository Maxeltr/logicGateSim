define(['./Serializer'], function (Serializer) {
	return {
		create: function(objectManager) {
			return new Serializer(objectManager);
		}
	};
});