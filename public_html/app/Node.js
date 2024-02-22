define(['./Gate'], function (Gate) {
    function Node() {
		this.node;
        this._updateNumber = 0;
		this._parent;
        this._children = [];
        
    }

	Node.prototype.getUpdateNumber = function () {
		return this._updateNumber;
	};

	Node.prototype.setUpdateNumber = function (updateNumber) {
		if (typeof updateNumber !== 'number') {
			throw new Error('Invalid parameter updateNumber - ' + typeof updateNumber);
		}
		this._updateNumber = updateNumber;
	};
	
	Node.prototype.getParent = function () {
		return this._parent;
	};

	Node.prototype.setParent = function (parnt) {
		if (! parnt instanceof Gate) {
			throw new Error('Invalid parameter parent - ' + typeof parnt);
		}
		this._parent = parnt;
	};
	
	Node.prototype.getChildren = function () {
		return this._children;
	};

	Node.prototype.setChildren = function (children) {
		if (! children instanceof Array) {
			throw new Error('Invalid parameter children - ' + typeof children);
		}
		this._children = children;
	};
	
	Node.prototype.addChild = function (child) {
		if (! child instanceof Gate) {
			throw new Error('Invalid parameter child - ' + typeof child);
		}
		this._children.push(child);
	};
		
    return Node;
});

