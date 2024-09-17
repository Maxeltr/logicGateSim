define([
	'require', 
	'./Bus', 
	'./BusDrawComponentFactory',
	'./BusPositionComponentFactory',
	'./BusTextInputComponentFactory',
	'./BusInputsComponentFactory',
	'./BusOutputsComponentFactory',
	'./BusLogicComponentFactory'
	], function (require, Bus) {return {
		create: function(id, mouseinput, mutex, x, y) {
			let logicComponent = require('./BusLogicComponentFactory');
			let outputsComponent = require('./BusOutputsComponentFactory');
			let inputsComponent = require('./BusInputsComponentFactory');
			let positionComponent = require('./BusPositionComponentFactory');
			let drawComponent = require('./BusDrawComponentFactory');
			let textInputComponent = require('./BusTextInputComponentFactory');

			
			let bus = new Bus(id, x, y);
			bus.setLogicComponent(logicComponent.create(bus));
			bus.setOutputsComponent(outputsComponent.create(bus));
			bus.setInputsComponent(inputsComponent.create(bus));
			bus.setPositionComponent(positionComponent.create(bus, mouseinput, mutex, x, y));
			bus.setDrawComponent(drawComponent.create(bus));
			bus.setTextInputComponent(textInputComponent.create(bus, mouseinput));

					
			
			return bus;
		}
	};
});