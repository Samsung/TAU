	module('core/event');

	function mouseEvent(el, type){
		var ev = document.createEvent("MouseEvent");
		ev.initMouseEvent(
			type,
			true /* bubble */, true /* cancelable */,
			window, null,
			0, 0, 0, 0, /* coordinates */
			false, false, false, false, /* modifier keys */
			0 /*left*/, null
		);
		el.dispatchEvent(ev);
	}

	asyncTest('stop propagation', 1, function() {
		var element = document.getElementById('test1');
		element.addEventListener('vclick', function (event) {
			ej.event.stopPropagation(event);
			ok('First event');
		}, true);
		document.body.addEventListener('mouseup', function (event) {
			ok('Second event');
		}, false);
		mouseEvent(element, 'mousedown');
		mouseEvent(element, 'mouseup');
		start();
	});
