define(['./Render'], function (Render) {
	return {
		create: function(requestAnimationFrame, mouseInput) {
			let zoomIn = document.getElementById('zoomIn');
			let zoomNormal = document.getElementById('zoomNormal');
			let zoomOut = document.getElementById('zoomOut');
			
			let moveLeft = document.getElementById('moveLeft');
			let moveRight = document.getElementById('moveRight');
			let moveUp = document.getElementById('moveUp');
			let moveDown = document.getElementById('moveDown');
			
			let inputs = new Map();
			inputs.set('zoomInInput', zoomIn);
			inputs.set('zoomNormalInput', zoomNormal);
			inputs.set('zoomOutInput', zoomOut);
			inputs.set('moveLeftInput', moveLeft);
			inputs.set('moveRightInput', moveRight);
			inputs.set('moveUpInput', moveUp);
			inputs.set('moveDownInput', moveDown);
			
			return new Render(requestAnimationFrame, inputs, mouseInput);
		}
	};
});