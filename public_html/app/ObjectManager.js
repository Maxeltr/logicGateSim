define(function (require) {
	function ObjectManager(mouseinput, render, mutex, inputs) {
		this._mouseinput;
		this._gates = new Map();
		this._links = new Map();
		this._binaryInputs = new Map();
		this._buses = new Map();
		this._render = render;
		this._gate = require('./GateFactory');
		this._timer = require('./TimerFactory');
		this._trigger = require('./TriggerFactory');
		this._binaryInput = require('./BinaryInputFactory');
		this._wire = require('./WireFactory'); 
		this._bus = require('./BusFactory'); 
		this._mutex = mutex;
		this._mouseinput = mouseinput;
		this._equation = inputs.get('equation');
		this._objectToCreate = '';
		this._objectToDelete = false;
		this._radiusForDelete = 5;
		
		inputs.get('wire').addEventListener('click', this._onClickCreate.bind(this, 'wire'));
		inputs.get('bus').addEventListener('click', this._onClickCreate.bind(this, 'bus'));
		inputs.get('bi').addEventListener('click', this._onClickCreate.bind(this, 'BI'));
		inputs.get('and').addEventListener('click', this._onClickCreate.bind(this, 'AND'));
		inputs.get('or').addEventListener('click', this._onClickCreate.bind(this, 'OR'));
		inputs.get('xor').addEventListener('click', this._onClickCreate.bind(this, 'XOR'));
		inputs.get('timer').addEventListener('click', this._onClickCreate.bind(this, 'timer'));
		inputs.get('trigger').addEventListener('click', this._onClickCreate.bind(this, 'trigger'));
		inputs.get('traverse').addEventListener('click', this.traverseMap.bind(this));
		inputs.get('delete').addEventListener('click', this._onClickDelete.bind(this));
		this._mouseinput.subscribe('mouseup', this.onMouseUp.bind(this), 'mouseUpObjectManager');
		
	}
	
	ObjectManager.prototype._onClickDelete = function () {
		this._objectToDelete = true;
	};
	
	ObjectManager.prototype._onClickCreate = function (objectToCreate) {
		this._objectToCreate = objectToCreate;
	};
	
	ObjectManager.prototype.onMouseUp = function () {
		if (this._objectToCreate !== '') {
			this.create(this._objectToCreate, this._mouseinput.lastX(), this._mouseinput.lastY());
			this._objectToCreate = '';
		}
		if (this._objectToDelete === true) {
			this.remove(this._mouseinput.lastX(), this._mouseinput.lastY());
			
		}
		this._objectToDelete = false;
	};
	
	
	ObjectManager.prototype.connect = function (wire) {
		if (! (wire instanceof Object)) return;			//TODO change to wire
		let i = 1;
		let connectable = Array.from(this._buses.values());
		connectable = connectable.concat(Array.from(this._gates.values()));
		for (let gate of connectable) {
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
	
	ObjectManager.prototype.buses = function () {
		return this._buses;
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
	
	ObjectManager.prototype.createBus = function (id, x, y) {
		let bus = this._bus.create(id, this._mouseinput, this._mutex, x, y);
		this._buses.set(id, bus);
		//this._gates.set(id, bus);
		return bus;
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
		this._buses.clear();
	};
	
	ObjectManager.prototype.remove = function (x, y) {
		for (let object of this._gates.values()) {
			if (object.isCoordinatesMatch(x, y)) {
				this._gates.delete(object.getId());
				object.remove();
				
			}
		}
		
		for (let object of this._binaryInputs.values()) {
			if (object.isCoordinatesMatch(x, y)) {
				this._binaryInputs.delete(object.getId());
				object.remove();
			}
		}
		
		for (let object of this._links.values()) {
			if (object.isCoordinatesMatch(x, y)){
				this._links.delete(object.getId());
				object.remove();
			}
		}
		
		for (let object of this._buses.values()) {
			if (object.isCoordinatesMatch(x, y)){
				this._buses.delete(object.getId());
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
		} else if (name === 'bus') {
			this.createBus(this.uuidv4(), x, y);
		} else if (name === 'AND' || name === 'OR' || name === '&' || name === '1' || name === 'XOR') {
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
		let objects = Array.from(this._binaryInputs.values());
		objects = objects.concat(Array.from(this._buses.values()));
		objects = objects.concat(Array.from(this._gates.values()));
		
		return objects;
	};
	
	ObjectManager.prototype.getDrawObjects = function() {
		let objects = Array.from(this._gates.values());
		objects = objects.concat(Array.from(this._binaryInputs.values()));
		objects = objects.concat(Array.from(this._links.values()));
		objects = objects.concat(Array.from(this._buses.values()));
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
						gate.setTraverseEquation('');
					}
					out += 'w' + wire.getEnd0().getUpdateNumber() + ' = ' + this._traverse(gate) + '\n';
					
				}
			}
		}
		this._output(out);
	};
	
	ObjectManager.prototype._getEnd0OfWireThroughBus = function(wire) {
		/* if (wire.constructor.name !== 'Wire') {
			return wire;
		} */
		let end0 = wire.getEnd0();
		if (typeof end0 !== 'undefined') {
			if (end0.constructor.name === 'Bus') {
				let input = end0.getInputWireByOutputWire(wire);
				if (typeof input !== 'undefined') {
					return this._getEnd0OfWireThroughBus(input);
				}
			} else { 
				return end0;
			}
		}
		return undefined;	
	}
	
	ObjectManager.prototype._traverse = function(node) {
		if (node.isVisited()) {
			return node.getTraverseEquation().length === 0 ? 'w' + node.getUpdateNumber() : node.getTraverseEquation();
		}
		node.setIsVisited();
		let tempVal = '', inputWire, gate;
		for (let wire of node.getInputs().values()) {
			let end0 = wire.getEnd0();
			let inversion = node.isInputInverted(wire.getId()) ? '!' : '';
			if (typeof end0 !== 'undefined') {
				if (end0.constructor.name === 'BinaryInput') {
					tempVal = tempVal.length !== 0 ? tempVal + ' ' + node.getType() + ' ' + inversion + end0.getEquation() : inversion + end0.getEquation();
				} else if (end0.constructor.name === 'Bus') {
					gate = this._getEnd0OfWireThroughBus(wire);
					if (typeof gate !== 'undefined') {
						if (gate.constructor.name === 'BinaryInput') {
							tempVal = tempVal.length !== 0 ? tempVal + ' ' + node.getType() + ' '  + inversion + gate.getEquation() : inversion + gate.getEquation();
						} else {
							tempVal = tempVal.length !== 0 ? tempVal + ' ' + node.getType() + ' ' + inversion + this._traverse(gate) : inversion + this._traverse(gate);
						}
					} else {			//wire end0 is not connected. end0 is undefined
						tempVal = tempVal.length !== 0 ? tempVal + ' ' + node.getType() + ' ' + inversion + gate : inversion + gate;
					}
				} else {	//end0 is not BI neither Bus
					tempVal = tempVal.length !== 0 ? tempVal + ' ' + node.getType() + ' ' + inversion + this._traverse(end0) : inversion + this._traverse(end0);
				}
			} else {
				tempVal = tempVal.length !== 0 ? tempVal + ' ' + node.getType() + ' ' + inversion + end0 : inversion + end0;	//wire end0 is not connected. end0 is undefined
			}
		}
		tempVal = tempVal.length !== 0 ?  tempVal : 'w' + node.getUpdateNumber()
		inversion = node.isOutputInverted() ? '!' : '';
		node.setTraverseEquation(inversion + '(' + tempVal + ')');
		
		return node.getTraverseEquation();
	};
	
	ObjectManager.prototype._output = function (data) {
		this._equation.value = data;
	};
	
	return ObjectManager;
});