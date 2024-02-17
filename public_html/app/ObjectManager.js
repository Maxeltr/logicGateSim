define(function (require) {
	function ObjectManager(mouseinput, render, mutex) {
		this._mouseinput;
		this._gates = new Map();
		this._links = new Map();
		this._binaryInputs = new Map();
		this._render = render;
		this._gate = require('./GateFactory');
		this._timer = require('./TimerFactory');
		this._trigger = require('./TriggerFactory');
		this._binaryInput = require('./BinaryInputFactory');
		this._mutex = mutex;
		this._wire = require('./WireFactory'); 
		this._mouseinput = mouseinput;
		this.index = 0;
		this.passedTime = 0;
		this.timeSlice = 0;
		this.objects;
		this.currentUpdate;
		this.amount = 0;
	}
	
	ObjectManager.prototype = {
		connect: function (wire) {
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
		},
	
		gates: function () {
			return this._gates;
		},
	
		links: function () {
			return this._links;
		},
	
		binaryInputs: function () {
			return this._binaryInputs;
		},
	
		uuidv4: function () {
			return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
				(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
			);
		},
			
		createGate: function (id, x, y, type) {
			let gate = this._gate.create(id, this._mouseinput, this._mutex, x, y, type);
			this._gates.set(id, gate);
			return gate;
		},
		
		createTimer: function (id, x, y, type) {
			let timer = this._timer.create(id, this._mouseinput, this._mutex, x, y, type);
			this._gates.set(id, timer);
			return timer;
		},
		
		createTrigger: function (id, x, y, type) {
			let trigger = this._trigger.create(id, this._mouseinput, this._mutex, x, y, type);
			this._gates.set(id, trigger);
			return trigger;
		},

		createWire: function (id, x, y) {
			let object = this._wire.create(id, this._mouseinput, this._mutex, x, y, this.connect.bind(this));
			this._links.set(id, object);
			return object;
		},
	
		createBinaryInput: function (id, x, y) {
			let bi = this._binaryInput.create(id, this._mouseinput, this._mutex, x, y);
			this._binaryInputs.set(id, bi);
			return bi;
		},
	
		clearAll: function () {
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
		},
		
		remove: function (x1, x2, y1, y2) {
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
		},
	
		create: function (name, x, y) {
			if (typeof name !== 'string') {
				throw new Error('Invalid parameter');
			}
			if (name === 'BI') {
				this.createBinaryInput(this.uuidv4(), x, y);
			} else if (name === 'wire') {
				this.createWire(this.uuidv4(), x, y);
			} else if (name === '&' || name === '1') {
				this.createGate(this.uuidv4(), x, y, name);
			} else if (name === 'timer') {
				this.createTimer(this.uuidv4(), x, y, name);
			} else if (name === 'trigger') {
				this.createTrigger(this.uuidv4(), x, y, name);
			} else {
				throw new Error('Invalid parameter');
			}
		},
				
		getUpdateObjects: function() {
			let objects = Array.from(this._gates.values());
			objects = objects.concat(Array.from(this._binaryInputs.values()));
			
			return objects;
		},
		
		getDrawObjects: function() {
			let objects = Array.from(this._gates.values());
			objects = objects.concat(Array.from(this._binaryInputs.values()));
			objects = objects.concat(Array.from(this._links.values()));
			return objects;
		},
		
		slowUpdate2: function (seconds) {

			if (this.index === 0) {									//start loop
				this.objects = Array.from(this._gates.values());
				this.amount = this.objects.length;
				let updateTime = 0;
				this.timeSlice = updateTime / this.amount;
			}
			this.passedTime += seconds;
			
			if (this.passedTime > this.timeSlice) {
				if (this.index < this.amount) {
					this.objects[this.index].update(seconds, this.index + 1);
					this.index++;
					this.passedTime = 0;
				} else {
					this.index = 0;									//end loop
					this.passedTime = 0;
				}
				
			}
			
		},
	
		/* update: function (seconds) {
			let updateNumber = 0;
			this.slowUpdate(seconds);
			this.slowUpdate2(seconds);
			for (let object of this._gates.values()) {
				updateNumber++;
				object.update(seconds, updateNumber);
			} 
			for (let object of this._binaryInputs.values()) {
				updateNumber++;
				object.update(seconds, updateNumber);
			}
			for (let object of this._links.values()) {
				object.update(seconds);
			}
			
		}, */
	
		/* draw: function (ctx, debug) {
			
			for (let object of this._gates.values()) {
				object.draw(ctx, debug);
			}
			for (let object of this._binaryInputs.values()) {
				object.draw(ctx, debug);
			}
			for (let object of this._links.values()) {
				object.draw(ctx, debug);
			}
			
		} */
	};
	
	return ObjectManager;
});