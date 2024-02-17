define([
	'require', 
	'./Timer',
	'./TimerLogicComponentFactory',
	'./GateOutputsComponentFactory',
	'./TimerInputsComponentFactory',
	'./GatePositionComponentFactory',
	'./TimerDrawComponentFactory',
	'./TextInputComponentFactory'
	], function (require, Timer) {
	return {
		create: function(id, mouseinput, mutex, x, y) {
			let logicComponent = require('./TimerLogicComponentFactory');
			let outputsComponent = require('./GateOutputsComponentFactory');
			let inputsComponent = require('./TimerInputsComponentFactory');
			let positionComponent = require('./GatePositionComponentFactory');
			let drawComponent = require('./TimerDrawComponentFactory');
			let textInputComponent = require('./TextInputComponentFactory');

			let timer = new Timer(id, x, y);
			timer.setLogicComponent(logicComponent.create(timer));
			timer.setOutputsComponent(outputsComponent.create(timer));
			timer.setInputsComponent(inputsComponent.create(timer));
			timer.setPositionComponent(positionComponent.create(timer, mouseinput, mutex));
			timer.setDrawComponent(drawComponent.create(timer));
			timer.setTextInputComponent(textInputComponent.create(timer, mouseinput));
			
			return timer;
		}
	};
});