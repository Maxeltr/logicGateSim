define([
	'require', 
	'./Gate', 
	'./GateDrawComponentFactory',
	'./GatePositionComponentFactory',
	'./TextInputComponentFactory',
	'./GateInputsComponentFactory',
	'./GateOutputsComponentFactory',
	'./LogicComponentFactory'
	], function (require, Gate) {return {
		create: function(id, mouseinput, mutex, x, y, type) {
			let logicComponent = require('./LogicComponentFactory');
			let outputsComponent = require('./GateOutputsComponentFactory');
			let inputsComponent = require('./GateInputsComponentFactory');
			let positionComponent = require('./GatePositionComponentFactory');
			let drawComponent = require('./GateDrawComponentFactory');
			let textInputComponent = require('./TextInputComponentFactory');

			
			let gate = new Gate(id, x, y);
			gate.setLogicComponent(logicComponent.create(gate, type));
			gate.setOutputsComponent(outputsComponent.create(gate));
			gate.setInputsComponent(inputsComponent.create(gate));
			gate.setPositionComponent(positionComponent.create(gate, mouseinput, mutex));
			gate.setDrawComponent(drawComponent.create(gate));
			gate.setTextInputComponent(textInputComponent.create(gate, mouseinput));

					
			
			return gate;
		}
	};
});