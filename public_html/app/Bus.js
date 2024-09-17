define(['./Gate'], function (Gate) {
    function Bus(id) {
		Gate.apply(this, arguments);
	}
	
	Bus.prototype = Object.create(Gate.prototype);
	Bus.prototype.constructor = Bus;
	
	Bus.prototype.correctPosition = function () {
		this._positionComponent.correctPosition();
	};
	
	Bus.prototype.getCoordinates = function () {
		return this._positionComponent.getCoordinates();
	};
				
	Bus.prototype.getOutputCoordinates = function (wire) {				//override
		return this._positionComponent.getOutputCoordinates(wire);
	}; 
	
	Bus.prototype.getInputCoordinates = function (wire) {				//overload method
		return this._positionComponent.getInputCoordinates(wire);
	};
/* 	
	Bus.prototype.isActivated = function(wire) {					//override	
		console.log(wire)
		if (! (wire instanceof Object)) {					//TODO Wire?
			throw new Error('Invalid parameter');
		}
		//return this._logicComponent.isActivated(wire);
		return false
	}; */
		
	Bus.prototype.setType = function (type) {			//overriding method
		//do nothing
	};
	
	Bus.prototype.setOption = function (propertyName, propertyValue, wire) {				//overriding method
		if (propertyName === 'in') {
			this.setInputName(propertyValue, wire);
		} else if (propertyName === 'out') {
			this.setOutputName(propertyValue, wire);
		}
	};
	
	Bus.prototype.setInputName = function (name, wire) {				
		this._inputsComponent.setInputName(name, wire);
	};
	
	Bus.prototype.setOutputName = function (name, wire) {				
		this._outputsComponent.setOutputName(name, wire);
	};
	
	Bus.prototype.update = function (seconds, updateNumber) {
		this._logicComponent.update(seconds, updateNumber);
	};
	
	Bus.prototype.isOnSegment = function (xp, yp, x1, y1, x2, y2) {
		return this._positionComponent.isOnSegment(xp, yp, x1, y1, x2, y2);
	}
	
	Bus.prototype.getCoordinates = function () {
		return this._positionComponent.getCoordinates();
	};
	
	Bus.prototype.setCoordinates = function (polyline) {
		return this._positionComponent.setCoordinates(polyline);
	};
	
	Bus.prototype.getBusSegmentNumberForInput = function(wire) {
		return this._inputsComponent.getBusSegmentNumber(wire);
	}
	
	Bus.prototype.getBusSegmentNumberForOutput = function(wire) {
		return this._outputsComponent.getBusSegmentNumber(wire);
	}
	
	Bus.prototype.setBusSegmentNumberForInput = function(segmentNumber, wire) {
		this._inputsComponent.setBusSegmentNumber(segmentNumber, wire);
	}
	
	Bus.prototype.setBusSegmentNumberForOutput = function(segmentNumber, wire) {
		this._outputsComponent.setBusSegmentNumber(segmentNumber, wire);
	}
	
	Bus.prototype.getInputName = function(wire) {
		return this._inputsComponent.getInputName(wire);
	};
	
	Bus.prototype.getInputIdByName = function(name) {
		return this._inputsComponent.getInputIdByName(name);
	};
	
	Bus.prototype.getOutputName = function(wire) {
		return this._outputsComponent.getOutputName(wire);
	};
	
	Bus.prototype.getOutputByName = function(name) {
		return this._outputsComponent.getOutputByName(name);
	};
	
	Bus.prototype.getInputWireByOutputWire = function(wire) {
		let inputId, outputName, input;
		outputName = this._outputsComponent.getOutputName(wire);
		if (typeof outputName !== 'undefined') {
			inputId = this._inputsComponent.getInputIdByName(outputName);
			if (typeof outputName !== 'undefined') {
				input = this._inputsComponent.getInput(inputId);
			}
		}
		return input;			//return wire
	}
	
	return Bus;
});