define([
	'require', 
	'./BinaryInput',
	'./BinaryInputLogicComponentFactory',
	'./BinaryInputDrawComponentFactory',
	'./BinaryInputPositionComponentFactory',
	'./BinaryInputInputsComponentFactory',
	'./BinaryInputOutputsComponentFactory',
	'./TextInputComponentFactory'
	], function (require, BinaryInput) {
	return {
		create: function(id, mouseinput, mutex, x, y) {
			let logicComponent = require('./BinaryInputLogicComponentFactory');
			let positionComponent = require('./BinaryInputPositionComponentFactory');
			let inputsComponent = require('./BinaryInputInputsComponentFactory');
			let outputsComponent = require('./BinaryInputOutputsComponentFactory');
			let drawComponent = require('./BinaryInputDrawComponentFactory');
			let textInputComponent = require('./TextInputComponentFactory');
			
			let binaryInput = new BinaryInput(id, x, y);
			binaryInput.setLogicComponent(logicComponent.create(binaryInput));
			binaryInput.setPositionComponent(positionComponent.create(binaryInput, mouseinput, mutex));
			binaryInput.setInputsComponent(inputsComponent.create(binaryInput));
			binaryInput.setOutputsComponent(outputsComponent.create(binaryInput));
			binaryInput.setDrawComponent(drawComponent.create(binaryInput));
			binaryInput.setTextInputComponent(textInputComponent.create(binaryInput, mouseinput));
			
			return binaryInput;
		}
	};
});