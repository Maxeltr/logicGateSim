define(function () {
    function MainLoop(render) {
        this.render = render;
        this.asd = 1;

        MainLoop.prototype.loop = function () {
            render.clearScreen();
            let x = Math.floor(Math.random() * (200 - 1 + 1) + 1);
            let y = Math.floor(Math.random() * (200 - 1 + 1) + 1);
            render.drawRect(x, y, 56, 66, 'red');

        }.bind(this);


    }

    return {
        create: function (render) {
            return new MainLoop(render);
        }
    };
});

