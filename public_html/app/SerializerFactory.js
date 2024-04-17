define(['./Serializer'], function (Serializer) {
	return {
		create: function(objectManager) {
			let save = document.getElementById("save");
			let load = document.getElementById("load");
			let inputs = new Map();
			inputs.set('save', save);
			inputs.set('load', load);
			return new Serializer(objectManager, inputs);
		}
	};
});