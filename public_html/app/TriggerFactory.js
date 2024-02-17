define([
	'require', 
	'./Trigger', 
	'./TriggerDrawComponentFactory',
	'./TriggerPositionComponentFactory',
	'./TextInputComponentFactory',
	'./TriggerInputsComponentFactory',
	'./GateOutputsComponentFactory',
	'./TriggerLogicComponentFactory'
	], function (require, Trigger) {return {
		create: function(id, mouseinput, mutex, x, y, type) {
			let logicComponent = require('./TriggerLogicComponentFactory');
			let outputsComponent = require('./GateOutputsComponentFactory');
			let inputsComponent = require('./TriggerInputsComponentFactory');
			let positionComponent = require('./TriggerPositionComponentFactory');
			let drawComponent = require('./TriggerDrawComponentFactory');
			let textInputComponent = require('./TextInputComponentFactory');

			
			let trigger = new Trigger(id, x, y);
			trigger.setLogicComponent(logicComponent.create(trigger));
			trigger.setOutputsComponent(outputsComponent.create(trigger));
			trigger.setInputsComponent(inputsComponent.create(trigger));
			trigger.setPositionComponent(positionComponent.create(trigger, mouseinput, mutex));
			trigger.setDrawComponent(drawComponent.create(trigger));
			trigger.setTextInputComponent(textInputComponent.create(trigger, mouseinput));

					
			
			return trigger;
		}
	};
});