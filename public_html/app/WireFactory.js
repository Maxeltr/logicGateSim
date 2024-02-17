define([
	'require', 
	'./Wire',
	'./WirePositionComponentFactory',
	'./WireDrawComponentFactory',
	'./WireTextInputComponentFactory'
	], function (require, Wire) {
	return {
		create: function(id, mouseinput, mutex, x, y, connectCallback) {
			let positionComponent = require('./WirePositionComponentFactory');
			let drawComponent = require('./WireDrawComponentFactory');
			let textInputComponent = require('./WireTextInputComponentFactory');
			
			let wire = new Wire(id);
			positionComponent = positionComponent.create(wire, mouseinput, mutex, x, y, connectCallback)
			wire.setPositionComponent(positionComponent);
			wire.setDrawComponent(drawComponent.create(wire));
			wire.setTextInputComponent(textInputComponent.create(wire, mouseinput));
			
			return wire;
		}
	};
});