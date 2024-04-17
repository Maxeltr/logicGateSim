

define(function (require) {
	
	let updateTime = document.getElementById("updateTime");
	
	
	
	let canvas = document.getElementById("schemaView");
	let mouseInput = require('./MouseInputFactory').create(canvas);
	let requestAnimationFrame = require('./RequestAnimationFrameFactory').create();
	let render = require('./RenderFactory').create(requestAnimationFrame, mouseInput);
    render.setCanvas(canvas);
    
	let mutex = require('./MutexFactory').create();
		
	let objectManager = require('./ObjectManagerFactory').create(mouseInput, render, mutex);
	
	let serializer = require('./SerializerFactory').create(objectManager);
	
	let mainLoop = require('./MainLoopFactory').create(updateTime, render, objectManager);
	render.start(mainLoop.loop);
   
});
