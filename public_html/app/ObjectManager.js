define(function (require) {
	function ObjectManager(_mouseinput, render, mutex) {
		this._mouseinput;
		this._gates = new Map();
		this._links = new Map();
		this._binaryInputs = new Map();
		this._render = render;
		this._gate = require('./Gate')
		this._binaryInput = require('./BinaryInput')
		this._mutex = mutex;
		this.poly = require('./Polyline');
		
		this._mouseinput = _mouseinput;
		this._mouseinput.subscribe('mousedown', this.onMouseDown.bind(this));
		this._mouseinput.subscribe('mouseup', this.onMouseUp.bind(this));
		this._mouseinput.subscribe('mousemove', this.onMouseMove.bind(this));
		
	}
	
	ObjectManager.prototype.connect = function (link) {
		if (! (link.constructor.name === 'Polyline')) return;			//TODO change to link
		let i = 1;
		for (let gate of this._gates.values()) {
			let linkLength = link.coordinates().length;
			let coordinates = link.coordinates();
			if (gate.isOutputsCoordinatesMatch(coordinates[0], coordinates[1])) {
				if (link.setEnd0(gate)) {
					gate.addLinkToOutput(link);
				}
			} else if (gate.isInputsCoordinatesMatch(coordinates[linkLength - 2], coordinates[linkLength - 1])) {
				if (link.setEnd1(gate)) {
					gate.addLinkToInputs(link);
				}
			}
			i++;
		}
		for (let bi of this._binaryInputs.values()) {
			let linkLength = link.coordinates().length;
			let coordinates = link.coordinates();
			if (bi.isOutputsCoordinatesMatch(coordinates[0], coordinates[1])) {
				if (link.setEnd0(bi)) {
					bi.addLinkToOutput(link);
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
			
	ObjectManager.prototype.createGate = function (id, x, y, name) {
		let gate = this._gate.create(id, this._mouseinput, this._mutex, x, y, name);
		this._gates.set(id, gate);
		return gate;
	};
	
	ObjectManager.prototype.createLink = function (id, x, y) {
		let object = this.poly.create(id, this._mouseinput, this._mutex, x, y, this.connect.bind(this));
		this._links.set(id, object);
		return object;
	};
	
	ObjectManager.prototype.createBinaryInput = function (id, x, y) {
		let bi = this._binaryInput.create(id, this._mouseinput, this._mutex, x, y);
		this._binaryInputs.set(id, bi);
		return bi;
	};
	
	ObjectManager.prototype.clearAll = function () {
		this._gates.clear();
		this._links.clear();
		this._binaryInputs.clear();
	};
	
	ObjectManager.prototype.create = function (name, x, y) {
		if (typeof name !== 'string') {
			throw new Error('Invalid parameter');
		}
		if (name === 'BI') {
			this.createBinaryInput(this.uuidv4(), x, y);
		} else if (name === 'link') {
			this.createLink(this.uuidv4(), x, y);
		} else if (name === '&' || name === '1') {
			this.createGate(this.uuidv4(), x, y, name);
		} else {
			throw new Error('Invalid parameter');
		}
	};
	
	ObjectManager.prototype.update = function (seconds) {
		for (let object of this._gates.values()) {
			object.update(seconds);
		}
		for (let object of this._links.values()) {
			object.update(seconds);
		}
		for (let object of this._binaryInputs.values()) {
			object.update(seconds);
		}
	};
	
	ObjectManager.prototype.draw = function (ctx, debug) {
		for (let object of this._gates.values()) {
			object.draw(ctx, debug);
		}
		for (let object of this._links.values()) {
			object.draw(ctx, debug);
		}
		for (let object of this._binaryInputs.values()) {
			object.draw(ctx, debug);
		}
	};
	
	ObjectManager.prototype.onMouseDown = function (mouseinput) {
		
	};
	
	ObjectManager.prototype.onMouseUp = function (mouseinput) {
		
	};
	
	ObjectManager.prototype.onMouseMove = function (mouseinput) {
		
	};
	
	return {
        create: function (_mouseinput, render, mutex) {
            return new ObjectManager(_mouseinput, render, mutex);
        }
    };
});