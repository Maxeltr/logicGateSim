define(function () {
    function BusOutputsComponent(object) {
		this._object = object;
		this._outputs = new Map();
		this._outputs1Segment = [];					//TODO how to do better?
		this._outputs3Segment = [];					//TODO how to do better?
		this._outputNames = new Map();
	}

	BusOutputsComponent.prototype.getBusSegmentNumber = function(wire) {
		if (this._outputs1Segment.includes(wire.getId())) {
			return 1;
		} else if (this._outputs3Segment.includes(wire.getId())) {
			return 3;
		}
		
		return 0;
	}
	
	BusOutputsComponent.prototype.setBusSegmentNumber = function(segmentNumber, wire) {
		if (segmentNumber === 1) {
			this._outputs1Segment.push(wire.getId);
		} else {
			this._outputs3Segment.push(wire.getId);
		}
	}
	
	BusOutputsComponent.prototype.addWireToOutput = function(wire) {
		if (! (wire instanceof Object)) {			//TODO change to 
			throw new Error('Invalid parameter');
		}
		if (this._outputs.has(wire.getId())) {
			return false;
		}
		this._outputs.set(wire.getId(), wire);
		
		let wireCoordinates = wire.getCoordinates();
		let x = wireCoordinates[0];
		let y = wireCoordinates[1];
		
		let busCoordinates = this._object.getCoordinates();
		
		if (this._object.isOnSegment(x, y, busCoordinates[0], busCoordinates[1], busCoordinates[2], busCoordinates[3])) {
			this._outputs1Segment.push(wire.getId());
		} else if (this._object.isOnSegment(x, y, busCoordinates[busCoordinates.length - 4], busCoordinates[busCoordinates.length - 3], busCoordinates[busCoordinates.length - 2], busCoordinates[busCoordinates.length - 1])) {
			this._outputs3Segment.push(wire.getId());
		}
		
		this._object.correctPosition();
		return true;
	};
	
	BusOutputsComponent.prototype.deleteWireFromOutput = function(wire) {
		if (! (wire instanceof Object)) {			//TODO change to 
			throw new Error('Invalid parameter');
		}
		this._outputs.delete(wire.getId());
		this.deleteOutputName(wire);
		this._outputs1Segment = this._outputs1Segment.filter(v => v !== wire.getId());
		this._outputs3Segment = this._outputs3Segment.filter(v => v !== wire.getId());
		this._object.correctPosition();
	};

	BusOutputsComponent.prototype.invertOutput = function() {
		//do nothing
	};
		
	BusOutputsComponent.prototype.isOutputInverted = function() {
		return false;
	};
	
	BusOutputsComponent.prototype.getOutputs = function() {
		return this._outputs;
	};
	
	BusOutputsComponent.prototype.deleteOutputs = function() {
		for (let wire of this._object.getOutputs().values()) {		//disconnect wire from outputs
			wire.deleteEnd0();
		}
		this._outputs.clear();
		this._inputNames.clear();
		this._outputs1Segment = [];	
		this._outputs3Segment = [];
	};
	
	BusOutputsComponent.prototype.setOutputName = function(name, wire) {
		if (! this._outputs.has(wire.getId())) return;
		this._outputNames.set(wire.getId(), name);
	};
	
	BusOutputsComponent.prototype.getOutputName = function(wire) {
		let outputName = this._outputNames.get(wire.getId());
		if (typeof outputName === 'undefined') {
			outputName = '';
		}
		return outputName;
	};
	
	/* BusOutputsComponent.prototype.getOutputIdByName = function(name) {
		for (let [key, value] of this._outputNames.entries()) {
			if (value === name) return key;
		}
		return '';
	}; */
	
	BusOutputsComponent.prototype.deleteOutputName = function(wire) {
		this._outputNames.delete(wire.getId());
	};
	
	return BusOutputsComponent;
});