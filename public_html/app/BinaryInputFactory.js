define([
	'require', 
	'./BinaryInput',
	'./BinaryInputLogicComponentFactory',
	'./BinaryInputDrawComponentFactory',
	'./BinaryInputPositionComponentFactory',
	'./BinaryInputOutputsComponentFactory.js',
	'./TextInputComponentFactory'
	], function (require, BinaryInput) {
	return {
		create: function(id, mouseinput, mutex, x, y) {
			let logicComponent = require('./BinaryInputLogicComponentFactory');
			let positionComponent = require('./BinaryInputPositionComponentFactory');
			let outputsComponent = require('./BinaryInputOutputsComponentFactory.js');
			let drawComponent = require('./BinaryInputDrawComponentFactory');
			let textInputComponent = require('./TextInputComponentFactory');
			
			let binaryInput = new BinaryInput(id, x, y);
			binaryInput.setLogicComponent(logicComponent.create(binaryInput));
			binaryInput.setPositionComponent(positionComponent.create(binaryInput, mouseinput, mutex));
			binaryInput.setOutputsComponent(outputsComponent.create(binaryInput));
			binaryInput.setDrawComponent(drawComponent.create(binaryInput));
			binaryInput.setTextInputComponent(textInputComponent.create(binaryInput, mouseinput));
			
			return binaryInput;
		}
	};
});