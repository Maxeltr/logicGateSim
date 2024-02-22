define(function () {
    function Serializer(objectManager) {
        this._objectManager = objectManager;
		this._links = new Map();
		this._binaryInputs = new Map();
		this._inputsToAddToGates = new Map();
		this._outputsToAddToGates = new Map();
		this._invertedGateInputs = new Map();

    }

	Serializer.prototype.save = function () {
		let dataToSave;
		
		dataToSave = this._objectManager.links().size 	//amount
			+ this._objectManager.binaryInputs().size 
			+ this._objectManager.gates().size 
			+ '\n';
		
		for (let object of this._objectManager.links().values()) {	//save links
			dataToSave = dataToSave 
				+ object.constructor.name + ',' 
				+ object.getId() + ',' 
				+ object.getName().replace(/,/g,'') + ','
				+ object.getType() + ',';
			let end0 = 'undefined', end1 = 'undefined';
			if (typeof object.getEnd0() !== 'undefined') end0 = object.getEnd0().getId()
			if (typeof object.getEnd1() !== 'undefined') end1 = object.getEnd1().getId()
			dataToSave = dataToSave + end0 + ',' + end1 + ',';
			object.getCoordinates().forEach(v => dataToSave = dataToSave + v + ',');
			dataToSave = dataToSave + '\n';
		}
		
		for (let object of this._objectManager.binaryInputs().values()) {	//save BI
			dataToSave = dataToSave 
				+ object.constructor.name + ',' 
				+ object.getId() + ',' 
				+ object.getName().replace(/,/g,'') + ','
				+ object.getType() + ','
				+ object.getX() + ','
				+ object.getY() + ',';
			object.getOutputs().forEach(v => dataToSave = dataToSave + v.getId() + ',');
			dataToSave = dataToSave + '\n';
		}
		
		for (let object of this._objectManager.gates().values()) {	//save gates
			dataToSave = dataToSave 
				+ object.constructor.name + ',' 
				+ object.getId() + ',' 
				+ object.getName().replace(/,/g,'') + ','
				+ object.getType() + ','
				+ object.getX() + ','
				+ object.getY() + ','
				+ object.isOutputInverted() + ',';
				if (object.constructor.name === 'Timer') dataToSave = dataToSave + object.getTimeSetting() + ',';	//if Timer
			dataToSave = dataToSave + 'outputs,';
			object.getOutputs().forEach(v => dataToSave = dataToSave + v.getId() + ',');
			dataToSave = dataToSave + 'inputs,';
			if (object.constructor.name === 'Trigger') {	
				if (typeof object.getSetInput() !== 'undefined') dataToSave = dataToSave + object.getSetInput().getId(); //first is set input
				dataToSave = dataToSave + ',';		
				if (typeof object.getResetInput() !== 'undefined') dataToSave = dataToSave + object.getResetInput().getId();
				dataToSave = dataToSave + ',';
			} else {
				object.getInputs().forEach(v => dataToSave = dataToSave + v.getId() + ',');
			}
			dataToSave = dataToSave + 'invertedInputs,';
			object.getInvertedInputs().forEach(v => dataToSave = dataToSave + v + ',');
			dataToSave = dataToSave + '\n';
		}
		
		this._output(dataToSave);
	};
	
	Serializer.prototype._output = function (data) {
		let file = new Blob([data], {'type': 'plain/text'});
		//let t = document.createElement("textarea");
		//t.id = 'dataToSave';
		let t = document.getElementById('dataToSave');
		t.value = data;
		//t.style.width = 600;
		//t.style.height = 480;
		//document.body.appendChild(t);
	};
	
	Serializer.prototype.load = function () {
		let data = document.getElementById('dataToSave').value;
		data = data.split('\n');
		let objectAmount = data[0];
		if (objectAmount.length === 0) return;
		this._objectManager.clearAll();
		for (let i = 1; i < data.length; i++) {
			this._deserealize(data[i]);
		}
		let binaryInput, lnk, gate, lnkId;
		for (let [bi, inputs] of this._binaryInputs) {
			binaryInput = this._objectManager.binaryInputs().get(bi);
			for (let i = 0; i < inputs.length; i++) {
				lnk = this._objectManager.links().get(inputs[i]);
				binaryInput.addWireToOutput(lnk);
				lnk.setEnd0(binaryInput);
			}
			
		}
		for (let [gateId, outputs] of this._outputsToAddToGates) {
			gate = this._objectManager.gates().get(gateId);
			for (let i = 0; i < outputs.length; i++) {
				lnk = this._objectManager.links().get(outputs[i]);
				gate.addWireToOutput(lnk);
				lnk.setEnd0(gate);
			}
		}
		for (let [gateId, inputs] of this._inputsToAddToGates) {
			gate = this._objectManager.gates().get(gateId);
			if (gate.constructor.name === 'Trigger') {
				lnk = this._objectManager.links().get(inputs[0]);
				if (typeof lnk !== 'undefined') {
					gate.setSetInput(lnk);
					lnk.setEnd1(gate);
				}
				lnk = this._objectManager.links().get(inputs[1]);
				if (typeof lnk !== 'undefined') {
					gate.setResetInput(lnk);
					lnk.setEnd1(gate);
				}
			} else {
				for (let i = 0; i < inputs.length; i++) {
					lnk = this._objectManager.links().get(inputs[i]);
					gate.addWireToInputs(lnk);
					lnk.setEnd1(gate);
				}
			}
		}
		for (let [gateId, inputs] of this._invertedGateInputs) {
			gate = this._objectManager.gates().get(gateId);
			for (let i = 0; i < inputs.length; i++) {
				gate.invertInput(inputs[i]);
			}
		}
		
	};
	
	Serializer.prototype._deserealize = function (data) {
		if (data.length === 0) return;
		let row = data.split(',');
		
		if (row[0] === 'Wire') {
			object = this._objectManager.createWire(row[1], -100, -100);
			object.setName(row[2]);
			//object.setType(row[3]);
			let poly = [];
			for (let i = 6; i < row.length; i++) {
				if (row[i] !== 'undefined' && row[i].length > 0) poly.push(parseInt(row[i]));	//x, y
			}
			object.setCoordinates(poly);
			if (typeof row[4] !== 'undefined' || typeof row[5] !== 'undefined') 
				this._links.set(object.getId(), [row[4], row[5]]);			//end0, end1

		} else if (row[0] === 'BinaryInput') {
			object = this._objectManager.createBinaryInput(row[1], parseInt(row[4]), parseInt(row[5]));
			object.setName(row[2]);
			object.setType(row[3]);
			let inputs = [];
			for (let i = 6; i < row.length; i++) {
				if (row[i] !== 'undefined' && row[i].length > 0) inputs.push(row[i]);	//id of inputs
			}
			if (inputs.length > 0) this._binaryInputs.set(object.getId(), inputs);
			
		} else if (row[0] === 'Gate') {
			object = this._objectManager.createGate(row[1], parseInt(row[4]), parseInt(row[5]), row[3]);
			object.setName(row[2]);
			if (row[6] === 'true') object.invertOutput();
			let outputs, inputs, invertedInputs;
			outputs = row.slice(row.indexOf('outputs') + 1, row.indexOf('inputs'));
			inputs = row.slice(row.indexOf('inputs') + 1, row.indexOf('invertedInputs'));
			invertedInputs = row.slice(row.indexOf('invertedInputs') + 1, row.length - 1);
			if (outputs.length > 0) this._outputsToAddToGates.set(object.getId(), outputs);
			if (inputs.length > 0) this._inputsToAddToGates.set(object.getId(), inputs);
			if (invertedInputs.length > 0) this._invertedGateInputs.set(object.getId(), invertedInputs);
			
		} else if (row[0] === 'Timer') {
			object = this._objectManager.createTimer(row[1], parseInt(row[4]), parseInt(row[5]), row[3]);
			object.setName(row[2]);
			object.setTimeSetting(parseFloat(row[7]));
			if (row[6] === 'true') object.invertOutput();
			let outputs, inputs, invertedInputs;
			outputs = row.slice(row.indexOf('outputs') + 1, row.indexOf('inputs'));
			inputs = row.slice(row.indexOf('inputs') + 1, row.indexOf('invertedInputs'));
			invertedInputs = row.slice(row.indexOf('invertedInputs') + 1, row.length - 1);
			if (outputs.length > 0) this._outputsToAddToGates.set(object.getId(), outputs);
			if (inputs.length > 0) this._inputsToAddToGates.set(object.getId(), inputs);
			if (invertedInputs.length > 0) this._invertedGateInputs.set(object.getId(), invertedInputs);
			
		} else if (row[0] === 'Trigger') {
			object = this._objectManager.createTrigger(row[1], parseInt(row[4]), parseInt(row[5]), row[3]);
			object.setName(row[2]);
			if (row[6] === 'true') object.invertOutput();
			let outputs, inputs, invertedInputs;
			outputs = row.slice(row.indexOf('outputs') + 1, row.indexOf('inputs'));
			inputs = row.slice(row.indexOf('inputs') + 1, row.indexOf('invertedInputs'));
			invertedInputs = row.slice(row.indexOf('invertedInputs') + 1, row.length - 1);
			if (outputs.length > 0) this._outputsToAddToGates.set(object.getId(), outputs);
			if (inputs.length > 0) this._inputsToAddToGates.set(object.getId(), inputs);
			if (invertedInputs.length > 0) this._invertedGateInputs.set(object.getId(), invertedInputs);
		}
	};

    return Serializer;
});
