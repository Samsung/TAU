/*global module, ok, equal, test, tau*/
(function (document) {
	"use strict";
	var handles = [],
		on = tau.event.on,
		off = tau.event.off,
		one = tau.event.one;
	//module('tau.event');

	function clearListeners() {
		var i,
			handle,
			length = handles.length;

		for (i = 0; i < length; i++) {
			handle = handles[i];
			handle.element.removeEventListener(handle.event, handle.callback, handle.useCapture);
		}
	}

	module("core/event", {
		teardown: function () {
			clearListeners()
		}
	});

	function oneOk() {
		ok(true, "event catch");
	}

	function mouseEvent(el, type) {
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

	function createEvent(newType, original) {
		var evt = new CustomEvent(newType, {
			"bubbles": original.bubbles,
			"cancelable": original.cancelable,
			"detail": original.detail
		});

		evt._originalEvent = original;
		original.target.dispatchEvent(evt);
	}

	// @TODO This test is not Unit test, depend from router
	test("preventDefault on the same event", 2, function () {
		var element = document.getElementById("prevented");

		on(element, "click", function (event) {
			tau.event.preventDefault(event);
			ok(true, "First event");
			ok(!location.hash);
		}, true);
		element.click();
	});

	// @TODO This test is not Unit test, depend from vmouse
	test("preventDefault on the same event", 2, function () {
		var element = document.getElementById("prevented");

		on(element, "vclick", function (event) {
			tau.event.preventDefault(event);
			ok(true, "First event");
			ok(!location.hash);
		}, true);
		element.click();
	});

	test("tau.event - check function trigger", function () {
		var element = document.getElementById("events1"),
			events = tau.event;

		equal(typeof events.trigger(element, "vclick"), "boolean", "function trigger returns boolean value");
	});

	test("asynchronous tests for click event", 1, function () {
		var element = document.getElementById("events1"),
			events = tau.event,
			callback = oneOk;

		//tau.engine.run();
		on(element, "click", callback, true);

		events.trigger(element, "click");
		on(element, "click", callback, false);
	});

	test("asynchronous tests for vclick event", 1, function () {
		var element = document.getElementById("events1"),
			events = tau.event;

		on(element, "vclick", oneOk, true);

		events.trigger(element, "vclick");
	});

	test("asynchronous tests for other event", 1, function () {
		var element = document.getElementById("events1"),
			events = tau.event;

		on(element, "test-event", oneOk, true);

		events.trigger(element, "test-event");
	});

	test("stop propagation on the same event", 1, function () {
		var element = document.getElementById("test1");

		on(element, "click", function (event) {
			tau.event.stopPropagation(event);
			ok(true, "First event");
		}, true);
		on(document.body, "click", oneOk, false);

		mouseEvent(element, "click");
	});

	test("stop propagation on custom event", 1, function () {
		var element = document.getElementById("test2");

		on(element, "testEvent", function (event) {
			tau.event.stopPropagation(event);
			ok(true, "First event");
		}, true);
		on(document.body, "testEvent", oneOk, false);

		mouseEvent(element, "testEvent");
	});

	test("stop propagation on cloned event", 1, function () {
		var element = document.getElementById("test3"),
			events = tau.event;

		on(element, "testEvent2", function (event) {
			ok(true, "First event");
			events.stopPropagation(event);
		}, false);
		on(document, "testEvent1", function (event) {
			createEvent("testEvent2", event);
		}, true);
		on(document, "testEvent1", oneOk, false);

		events.trigger(element, "testEvent1");
	});

	test("stop Immediate propagation", 2, function () {
		var element = document.getElementById("test4");

		on(element, "click", function () {
			ok(true, "First callback");
		}, true);
		on(element, "click", function (event) {
			tau.event.stopImmediatePropagation(event);
			ok(true, "Second callback");
		}, true);
		on(element, "click", function () {
			ok(true, "Third callback");
		}, true);

		mouseEvent(element, "click");
	});

	test("stop Immediate propagation", 2, function () {
		var element = document.getElementById("test4");

		on(element, "click", function () {
			ok(true, "First first callback");
		}, true);
		on(element, "click", function (event) {
			tau.event.stopImmediatePropagation(event);
			ok(true, "First second callback");
		}, true);
		on(element, "click", function () {
			ok(true, "First third callback");
		}, false);

		mouseEvent(element, "click");
	});
	test("stop Immediate propagation", 1, function () {
		var element = document.getElementById("test3"),
			events = tau.event;

		on(element, "testEvent2", function (event) {
			ok(true, "First event");
			tau.event.stopImmediatePropagation(event);
		}, false);
		on(document, "testEvent1", function (event) {
			createEvent("testEvent2", event);
		}, true);
		on(document, "testEvent1", function () {
			ok(true, "Second event");
		}, false);

		events.trigger(element, "testEvent1");
	});

	test("stop Immediate propagation", 1, function () {
		var element = document.getElementById("test3"),
			events = tau.event;

		on(element, "testEvent2", function (event) {
			ok(true, "First event");
			events.stopImmediatePropagation(event);
		}, false);
		on(document, "testEvent1", function (event) {
			createEvent("testEvent2", event);
		}, false);
		on(document, "testEvent1", oneOk, false);

		events.trigger(element, "testEvent1");
	});

	test("on event catch on elements collection", 2, function () {
		var elements = document.querySelectorAll(".testone input"),
			events = tau.event;

		on(elements, "testEventOn", oneOk, false);

		events.trigger(elements[0], "testEventOn");
		events.trigger(elements[1], "testEventOn");
	});

	test("prefixed on on/off lement", 5, function () {
		var elements = document.querySelectorAll(".testone input"),
			events = tau.event;

		events.prefixedFastOn(elements[0], "testEventOn", oneOk, false);

		events.trigger(elements[0], "webkitTestEventOn");
		events.trigger(elements[0], "mozTestEventOn");
		events.trigger(elements[0], "msTestEventOn");
		events.trigger(elements[0], "otesteventon");
		events.trigger(elements[0], "testeventon");

		events.prefixedFastOff(elements[0], "testEventOn", oneOk, false);
		events.trigger(elements[0], "webkitTestEventOn");
		events.trigger(elements[0], "mozTestEventOn");
		events.trigger(elements[0], "msTestEventOn");
		events.trigger(elements[0], "otesteventon");
		events.trigger(elements[0], "testeventon");
	});

	test("off event catch on elements collection", 1, function () {
		var elements = document.querySelectorAll(".testone input"),
			events = tau.event;

		off(elements, "testEventOn", oneOk, false);

		events.trigger(elements[0], "testEventOn");
		events.trigger(elements[1], "testEventOn");
		ok("event not catch");
	});

	test("one event catch", 1, function () {
		var element = document.getElementById("test3"),
			events = tau.event;

		one(element, "testEventOne", oneOk, false);

		events.trigger(element, "testEventOne");
		events.trigger(element, "testEventOne");
	});

	test("one event catch on elements collection", 1, function () {
		var elements = document.querySelectorAll(".testone input"),
			events = tau.event;

		one(elements, "testEventOne", oneOk, false);

		events.trigger(elements[0], "testEventOne");
		events.trigger(elements[0], "testEventOne");
	});

	test("one events (array) catch", 2, function () {
		var element = document.getElementById("test3"),
			events = tau.event;

		one(element, ["testEventOne", "testEventTwo"], oneOk, false);

		events.trigger(element, "testEventOne");
		events.trigger(element, "testEventTwo");
	});

	test("one events (object) catch", 2, function () {
		var element = document.getElementById("test3"),
			events = tau.event;

		one(element, {"testEventOne": oneOk, "testEventTwo": oneOk}, false);

		events.trigger(element, "testEventOne");
		events.trigger(element, "testEventTwo");
	});


	function fireEvent(el, type, props, touches) {
		var evt = new CustomEvent(type, {
				"bubbles": true,
				"cancelable": true
			}),
			prop;

		for (prop in props) {
			if (props.hasOwnProperty(prop)) {
				evt[prop] = props[prop];
			}
		}
		if (touches) {
			evt.touches = touches;
			evt.targetTouches = touches;
		}
		try {
			return el.dispatchEvent(evt);
		} catch (err) {
			console.error(err);
		}
		return false;
	}

	test("targetRelativeCoordsFromEvent", 3, function () {
		var element = document.getElementById("test3"),
			events = tau.event;

		one(element, "mouseup", function (event) {
			var coords = events.targetRelativeCoordsFromEvent(event);

			ok(coords.x);
			ok(coords.y);
		}, false);

		ok(fireEvent(element, "mouseup", {
			"offsetX": 50,
			"offsetY": 50
		}, []), "mouseup fired");
	});

	test("targetRelativeCoordsFromEvent", 3, function () {
		var element = document.getElementById("test3"),
			events = tau.event;

		one(element, "mouseup", function (event) {
			var coords = events.targetRelativeCoordsFromEvent(event);

			ok(coords.x);
			ok(coords.y);
		}, false);

		ok(fireEvent(element, "mouseup", {
			"pageX": 50,
			"pageY": 50,
			"clientX": 10,
			"clientY": 10
		}, []), "mouseup fired");
	});

	test("targetRelativeCoordsFromEvent", 3, function () {
		var element = document.getElementById("test3"),
			events = tau.event;

		one(element, "touchstart", function (event) {
			var coords = events.targetRelativeCoordsFromEvent(event);

			ok(coords.x);
			ok(coords.y);
		}, false);

		ok(fireEvent(element, "touchstart", {
			"pageX": 0,
			"pageY": 0,
			"clientX": 10,
			"clientY": 10
		}, [{"pageX": 0,
			"pageY": 0,
			"clientX": 10,
			"clientY": 10, target: element}]), "mouseup fired");
	});
}(document));
