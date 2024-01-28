define(function (require) {
    function CaptureMutex() {
        this._mutex = false;
        
    }

	CaptureMutex.prototype.set = function () {
        this._mutex = true;
    };

    CaptureMutex.prototype.release = function () {
        this._mutex = false;
    };
	
	CaptureMutex.prototype.isSet = function () {
        return this._mutex === true;
    };
		
    return {
        create: function () {
            return new CaptureMutex();
        }
    };
});