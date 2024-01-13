define(function () {
    function RequestAnimationFrame() {
        this.lastTime = 0;
        this.callback = function () {};
        this.frame = this.frame.bind(this);
        this.requestId;
    }

    RequestAnimationFrame.prototype.start = function (callback) {
        if (this.requestId)
            this.stop();
        this.callback = callback;
        this.requestId = requestAnimationFrame(this.frame);
    };

    RequestAnimationFrame.prototype.stop = function () {
        if (this.requestId)
            cancelAnimationFrame(this.requestId);
    };

    RequestAnimationFrame.prototype.frame = function (time) {
        var seconds = (time - this.lastTime) / 1000;
        this.lastTime = time;
        if (seconds < 0.2)
            this.callback(seconds);
        this.requestId = requestAnimationFrame(this.frame);
    };

    return {
        create: function () {
            return new RequestAnimationFrame();
        }
    };
});

