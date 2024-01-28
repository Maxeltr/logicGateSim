

define(function (require) {
	
	let canvas = document.getElementById("schemaView");
	
	let render = require('./Render').create();
    render.setCanvas(canvas);
	
	let mouseinput = require('./MouseInput').create(canvas);

	let mutex = require('./CaptureMutex').create();
	
	let objectManager = require('./ObjectManager').create(mouseinput, render, mutex);
	
	let saver = require('./Saver').create(objectManager);
	let leftPanel = require('./LeftPanel').create(mouseinput, objectManager, 40, 500, saver);

	
	
	let mainLoop = require('./MainLoop').create(render, [objectManager, leftPanel]);
	
	render.start(mainLoop.loop);
   
});
