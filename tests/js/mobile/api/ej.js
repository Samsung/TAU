module("mobile", {
	});

	test ( "API ej" , function () {
		var id1, id2, id3;
		equal(typeof ej, 'object', 'Class ej exists');
		equal(typeof ej.getUniqueId, 'function', 'Method ej.getUniqueId exists');
		equal(typeof ej.set, 'function', 'Method ej.set exists');
		equal(typeof ej.get, 'function', 'Method ej.get exists');
		equal(typeof ej.log, 'function', 'Method ej.log exists');
		equal(typeof ej.warn, 'function', 'Method ej.warn exists');
		equal(typeof ej.error, 'function', 'Method ej.error exists');
	});