define(['./Gate'], function (Gate) {
    function BinaryInput(id, x, y) {
		Gate.apply(this, arguments);
	}
	
	BinaryInput.prototype = Object.create(Gate.prototype);
	BinaryInput.prototype.constructor = BinaryInput;
	
	BinaryInput.prototype.setOption = function (propertyName, propertyValue) {
		if (propertyName === 'name') {
			this.setName(propertyValue + '');
		}
	};
	
	return BinaryInput;
});