if (window.ej === undefined && window.tau) {
	window.ej = window.tau;
	//@TODO quick fix, please update test files
	window.ej.set = window.ej.setConfig;
	window.ej.get = window.ej.getConfig;
}

if (window.ej === undefined && window.$ && window.$.tizen) {
	window.ej = window.$.tizen._export;
}