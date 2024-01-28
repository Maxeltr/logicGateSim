define(function () {
    function Saver(objectManager) {
        this._objectManager = objectManager;


    }

	Saver.prototype.save = function () {
		let dataToSave;
		
		dataToSave = this._objectManager.links().size 	//amount
			+ this._objectManager.binaryInputs().size 
			+ this._objectManager.gates().size 
			+ '\n';
		
		for (let object of this._objectManager.links().values()) {	//save links
			dataToSave = dataToSave 
				+ object.constructor.name + ',' 
				+ object.id() + ',' 
				+ object.name() + ','
				+ object.type() + ',';
			let end0 = 'undefined', end1 = 'undefined';
			if (typeof object.end0() !== 'undefined') end0 = object.end0().id()
			if (typeof object.end1() !== 'undefined') end1 = object.end1().id()
			dataToSave = dataToSave + end0 + ',' + end1 + ',';
			object.coordinates().forEach(v => dataToSave = dataToSave + v + ',');
			dataToSave = dataToSave + '\n';
		}
		
		for (let object of this._objectManager.binaryInputs().values()) {	//save BI
			dataToSave = dataToSave 
				+ object.constructor.name + ',' 
				+ object.id() + ',' 
				+ object.name() + ','
				+ object.type() + ','
				+ object.x() + ','
				+ object.y() + ',';
			object.outputs().forEach(v => dataToSave = dataToSave + v.id() + ',');
			dataToSave = dataToSave + '\n';
		}
		
		for (let object of this._objectManager.gates().values()) {	//save gates
			dataToSave = dataToSave 
				+ object.constructor.name + ',' 
				+ object.id() + ',' 
				+ object.name() + ','
				+ object.type() + ','
				+ object.x() + ','
				+ object.y() + ','
				+ object.isOutputInverted() + ',';
			object.invertedInputs().forEach(v => dataToSave = dataToSave + v + ',');
			dataToSave = dataToSave + 'outputs,';
			object.outputs().forEach(v => dataToSave = dataToSave + v.id() + ',');
			dataToSave = dataToSave + 'inputs,';
			object.inputs().forEach(v => dataToSave = dataToSave + v.id() + ',');
			dataToSave = dataToSave + '\n';
		}
		
		this._output(dataToSave);
	}
	
	Saver.prototype._output = function (data) {
		let file = new Blob([data], {'type': 'plain/text'});
		//let t = document.createElement("textarea");
		//t.id = 'dataToSave';
		let t = document.getElementById('dataToSave');
		t.value = data;
		//t.style.width = 600;
		//t.style.height = 480;
		//document.body.appendChild(t);
	}
	
	Saver.prototype.load = function () {
		//this._objectManager.clearAll();
		let data = document.getElementById('dataToSave').value;
		data = data.split('\n');
		let objectAmount = data[0];
		for (let i = 1; i < data.length; i++) {
			this._deserealize(data[i]);
		}
		
	}
	
	Saver.prototype._deserealize = function (data) {
		if (data.length === 0) return;
		let row = data.split(',');
		let object, objectsToAddToLinks = new Map(), objectsToAddToBi = new Map();
		if (row[0] === 'Polyline') {
			object = this._objectManager.createLink(row[1], -100, -100);
			object.setName(row[2]);
			//object.setType(row[3]);
			let poly = [];
			for (let i = 6; i < row.length; i++) {
				if (row[i] !== 'undefined' && row[i].length > 0) poly.push(parseInt(row[i]));	//x, y
			}
			object.setPolyline(poly);
			if (typeof row[4] !== 'undefined' || typeof row[5] !== 'undefined') 
				objectsToAddToLinks.set(object.id(), [row[4], row[5]]);			//end0, end1

		} else if (row[0] === 'BinaryInput') {
			object = this._objectManager.createBinaryInput(row[1], parseInt(row[4]), parseInt(row[5]));
			object.setName(row[2]);
			object.setType(row[3]);
			let inputs = [];
			for (let i = 6; i < row.length; i++) {
				if (row[i] !== 'undefined' && row[i].length > 0) inputs.push(row[i]);	//id of inputs
			}
			if (inputs.length > 0) objectsToAddToBi.set(object.id(), inputs);
			console.log(object)
		} else if (row[0] === 'Gate') {
			
		} else {
			
		}
	}
		
    return {
        create: function (objectManager) {
            return new Saver(objectManager);
        }
    };
});
