define(['./ObjectManager'], function (ObjectManager) {
	return {
		create: function(mouseinput, render, mutex) {
			let equation = document.getElementById("equation");
			let wire = document.getElementById("wire");
			let bi = document.getElementById("bI");
			let and = document.getElementById("and");
			let or = document.getElementById("or");
			let xor = document.getElementById("xor");
			let timer = document.getElementById("timer");
			let trigger = document.getElementById("trigger");
			let traverse = document.getElementById("traverse");
			let del = document.getElementById("delete");
			
			let inputs = new Map();
			inputs.set('equation', equation);
			inputs.set('wire', wire);
			inputs.set('bi', bi);
			inputs.set('and', and);
			inputs.set('or', or);
			inputs.set('xor', xor);
			inputs.set('timer', timer);
			inputs.set('trigger', trigger);
			inputs.set('traverse', traverse);
			inputs.set('delete', del);
			
			return new ObjectManager(mouseinput, render, mutex, inputs);
		}
	};
});