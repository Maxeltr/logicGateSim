define(['./GateInputsComponent'], function (GateInputsComponent) {
    function BusInputsComponent(object) {
	GateInputsComponent.apply(this, arguments);
		this._inputs1Segment = [];					//TODO how to do better?
		this._inputs3Segment = [];					//TODO how to do better?
		this._inputNames = new Map();
	}

	BusInputsComponent.prototype = Object.create(GateInputsComponent.prototype);
	BusInputsComponent.prototype.constructor = BusInputsComponent;
	
	BusInputsComponent.prototype.getBusSegmentNumber = function(wire) {
		if (this._inputs1Segment.includes(wire.getId())) {
			return 1;
		} else if (this._inputs3Segment.includes(wire.getId())) {
			return 3;
		}
		
		return 0;
	}
	
	BusInputsComponent.prototype.setBusSegmentNumber = function(segmentNumber, wire) {
		if (segmentNumber === 1) {
			this._inputs1Segment.push(wire.getId);
		} else {
			this._inputs3Segment.push(wire.getId);
		}
	}
	
	BusInputsComponent.prototype.addWireToInputs = function(wire) {			//override
		if (! (wire instanceof Object)) {			//TODO change to wire
			throw new Error('Invalid parameter');
		}
		if (this._inputs.has(wire.getId())) {
			return false;
		}
		this._inputs.set(wire.getId(), wire);
		
		
		let wireCoordinates = wire.getCoordinates();
		let x = wireCoordinates[wireCoordinates.length - 2];
		let y = wireCoordinates[wireCoordinates.length - 1];
		
		let busCoordinates = this._object.getCoordinates();
		
		
		if (this._object.isOnSegment(x, y, busCoordinates[0], busCoordinates[1], busCoordinates[2], busCoordinates[3])) {
			this._inputs1Segment.push(wire.getId());
		} else if (this._object.isOnSegment(x, y, busCoordinates[busCoordinates.length - 4], busCoordinates[busCoordinates.length - 3], busCoordinates[busCoordinates.length - 2], busCoordinates[busCoordinates.length - 1])) {
			this._inputs3Segment.push(wire.getId());
		}
		
			
		this._object.correctPosition();
		return true;
	};
	
	BusInputsComponent.prototype.deleteWireFromInputs = function(wire) {			//override
		if (! (wire instanceof Object)) {			//TODO change to wire
			throw new Error('Invalid parameter');
		}
		this._inputs.delete(wire.getId());
		this.deleteInputName(wire);
		this._inputs1Segment = this._inputs1Segment.filter(v => v !== wire.getId());
		this._inputs3Segment = this._inputs3Segment.filter(v => v !== wire.getId());
		this._object.correctPosition();
	};
	
	BusInputsComponent.prototype.invertInput = function(id) {			//override
		//do nothing
	};
	
	BusInputsComponent.prototype.getInputState = function(wire) {			//override
		let inputState = false;
		if (typeof wire.getEnd0() !== 'undefined') {
			inputState = wire.getEnd0().isActivated(wire);
		}
		
		return inputState;
	};
			
	BusInputsComponent.prototype.getInvertedInputs = function() {			//override
		return [];
	};
	
	BusInputsComponent.prototype.isInputInverted = function(id) {			//override
		return false;
	};
	
	BusInputsComponent.prototype.setInputName = function(name, wire) {
		if (this.getInputIdByName(name) !== '') return;
		if (! this._inputs.has(wire.getId())) return;
		this._inputNames.set(wire.getId(), name);
	};
	
	BusInputsComponent.prototype.getInputName = function(wire) {
		let inputName = this._inputNames.get(wire.getId());
		if (typeof inputName === 'undefined') {
			inputName = '';
		}
		return inputName;
	};
	
	BusInputsComponent.prototype.getInputIdByName = function(name) {
		for (let [key, value] of this._inputNames.entries()) {
			if (value === name) return key;
		}
		return '';
	};
	
	BusInputsComponent.prototype.deleteInputName = function(wire) {
		this._inputNames.delete(wire.getId());
	};
	
	return BusInputsComponent;
});