define(function (require) {
    function Mutex() {
        this._mutex = false;
    }

	Mutex.prototype = {
		set: function () {
			this._mutex = true;
		},

		release: function () {
			this._mutex = false;
		},
	
		isSet: function () {
			return this._mutex === true;
		}
	};
	
    return Mutex;
});