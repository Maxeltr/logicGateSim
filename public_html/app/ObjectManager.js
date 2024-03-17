define(function (require) {
	function ObjectManager(mouseinput, render, mutex, expression) {
		this._mouseinput;
		this._gates = new Map();
		this._links = new Map();
		this._binaryInputs = new Map();
		this._render = render;
		this._gate = require('./GateFactory');
		this._timer = require('./TimerFactory');
		this._trigger = require('./TriggerFactory');
		this._binaryInput = require('./BinaryInputFactory');
		this._wire = require('./WireFactory'); 
		this._mutex = mutex;
		this._mouseinput = mouseinput;
		this._expression = expression;
		//this.index = 0;
		//this.passedTime = 0;
		//this.timeSlice = 0;
		//this.objects;
		//this.currentUpdate;
		//this.amount = 0;
	}
	
	ObjectManager.prototype.connect = function (wire) {
		if (! (wire instanceof Object)) return;			//TODO change to wire
		let i = 1;
		for (let gate of this._gates.values()) {
			let linkLength = wire.getCoordinates().length;
			let coordinates = wire.getCoordinates();
			if (gate.isRightSideCoordinatesMatch(coordinates[0], coordinates[1])) {
				if (wire.setEnd0(gate)) {
					gate.addWireToOutput(wire);
				}
			} else if (gate.isLeftSideCoordinatesMatch(coordinates[linkLength - 2], coordinates[linkLength - 1])) {
				if (wire.setEnd1(gate)) {
					gate.addWireToInputs(wire);
				}
			}
			i++;
		}
		for (let bi of this._binaryInputs.values()) {
			let linkLength = wire.getCoordinates().length;
			let coordinates = wire.getCoordinates();
			if (bi.isRightSideCoordinatesMatch(coordinates[0], coordinates[1])) {
				if (wire.setEnd0(bi)) {
					bi.addWireToOutput(wire);
				}
			}
			i++;
		}
	};
	
	ObjectManager.prototype.gates = function () {
		return this._gates;
	};

	ObjectManager.prototype.links = function () {
		return this._links;
	};

	ObjectManager.prototype.binaryInputs = function () {
		return this._binaryInputs;
	};

	ObjectManager.prototype.uuidv4 = function () {
		return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
			(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
		);
	};
		
	ObjectManager.prototype.createGate = function (id, x, y, type) {
		let t;
		if (type === '&') {
			t = 'AND';
		} else if (type === '1') {
			t = 'OR';
		} else {
			t = type;
		}
		let gate = this._gate.create(id, this._mouseinput, this._mutex, x, y, t);
		this._gates.set(id, gate);
		return gate;
	};
	
	ObjectManager.prototype.createTimer = function (id, x, y, type) {
		let timer = this._timer.create(id, this._mouseinput, this._mutex, x, y, 'On');
		this._gates.set(id, timer);
		return timer;
	};
		
	ObjectManager.prototype.createTrigger = function (id, x, y, type) {
		let trigger = this._trigger.create(id, this._mouseinput, this._mutex, x, y, type);
		this._gates.set(id, trigger);
		return trigger;
	};

	ObjectManager.prototype.createWire = function (id, x, y) {
		let object = this._wire.create(id, this._mouseinput, this._mutex, x, y, this.connect.bind(this));
		this._links.set(id, object);
		return object;
	};

	ObjectManager.prototype.createBinaryInput = function (id, x, y) {
		let bi = this._binaryInput.create(id, this._mouseinput, this._mutex, x, y);
		this._binaryInputs.set(id, bi);
		return bi;
	};

	ObjectManager.prototype.clearAll = function () {
		for (let object of this._gates.values()) {
			object.remove();
		}
		for (let object of this._binaryInputs.values()) {
			object.remove();
		}
		for (let object of this._links.values()) {
			object.remove();
		}
		this._gates.clear();
		this._links.clear();
		this._binaryInputs.clear();
	};
		
	ObjectManager.prototype.remove = function (x1, x2, y1, y2) {
		for (let object of this._gates.values()) {
			if (object.getX() < x2 && object.getY() > y1 && object.getY() < y2) {
				this._gates.delete(object.getId());
				object.remove();
				
			}
		}
		for (let object of this._binaryInputs.values()) {
			if (object.getX() < x2 && object.getY() > y1 && object.getY() < y2) {
				this._binaryInputs.delete(object.getId());
				object.remove();
			}
		}
		let poly, polyLength;
		for (let object of this._links.values()) {
			poly = object.getCoordinates();
			polyLength = poly.length;
			if ((poly[0] > x1 && poly[0] < x2 && poly[1] > y1 && poly[1] < y2) 
					|| (poly[polyLength - 2] > x1 && poly[polyLength - 2] < x2 && poly[polyLength - 1] > y1 && poly[polyLength - 1] < y2)
			){
				this._links.delete(object.getId());
				object.remove();
			}
		}
	};
	
	ObjectManager.prototype.create = function (name, x, y) {
		if (typeof name !== 'string') {
			throw new Error('Invalid parameter');
		}
		if (name === 'BI') {
			this.createBinaryInput(this.uuidv4(), x, y);
		} else if (name === 'wire') {
			this.createWire(this.uuidv4(), x, y);
		} else if (name === 'AND' || name === 'OR' || name === '&' || name === '1') {
			this.createGate(this.uuidv4(), x, y, name);
		} else if (name === 'timer') {
			this.createTimer(this.uuidv4(), x, y, name);
		} else if (name === 'trigger') {
			this.createTrigger(this.uuidv4(), x, y, name);
		} else {
			throw new Error('Invalid parameter');
		}
	};
				
	ObjectManager.prototype.getUpdateObjects = function() {
		let objects = Array.from(this._gates.values());
		objects = objects.concat(Array.from(this._binaryInputs.values()));
		
		return objects;
	};
	
	ObjectManager.prototype.getDrawObjects = function() {
		let objects = Array.from(this._gates.values());
		objects = objects.concat(Array.from(this._binaryInputs.values()));
		objects = objects.concat(Array.from(this._links.values()));
		return objects;
	};
	
	ObjectManager.prototype.traverseMap = function() {
		let val = '';
		/* for (let gate of this._gates.values()) {
			gate.resetIsVisited();
			gate.val = '';
		} */
		let out = '';
		for (let gate of this._gates.values()) {
			for (let wire of gate.getOutputs().values()) {
				let end1 = wire.getEnd1();
				if (typeof end1 === 'undefined') {
					for (let gate of this._gates.values()) {
						gate.resetIsVisited();
						gate.setTraverseExpression('');
					}
					out += 'w' + wire.getEnd0().getUpdateNumber() + ' = ' + this._traverse(gate) + '\n';
					
				}
			}
			
			
			//console.log(val);
		}
		this._output(out);
	};
	
	ObjectManager.prototype._traverse = function(node) {
		if (node.isVisited()) {
			return node.getTraverseExpression().length === 0 ? 'w' + node.getUpdateNumber() : node.getTraverseExpression();
		}
		node.setIsVisited();
		let tempVal = '';
		for (let wire of node.getInputs().values()) {
			let end0 = wire.getEnd0();
			let inversion = node.isInputInverted(wire.getId()) ? '!' : '';
			if (typeof end0 !== 'undefined') {
				if (end0.constructor.name === 'BinaryInput') {
					tempVal = tempVal.length !== 0 ? tempVal + ' ' + node.getType() + ' ' + inversion + end0.getExpression() : inversion + end0.getExpression();
				} else {
					tempVal = tempVal.length !== 0 ? tempVal + ' ' + node.getType() + ' ' + inversion + this._traverse(end0) : inversion + this._traverse(end0);
				}
			} else {
				tempVal = tempVal.length !== 0 ? tempVal + ' ' + node.getType() + ' ' + inversion + end0 : inversion + end0;
			}
		}
		inversion = node.isOutputInverted() ? '!' : '';
		node.setTraverseExpression(inversion + '(' + tempVal + ')');
		
		return node.getTraverseExpression();
	};
	
	ObjectManager.prototype._output = function (data) {
		this._expression.value = data;
	};
	
	return ObjectManager;
});