/*global expect, document, module, test, window, initFixture, start */
(function (window, document, tau, define) {
	"use strict";

	function runTests(vmouse, helpers) {
		// ------ start test body ---------
		var testQueue = [],
			currentTest = 0;


		QUnit.config.notrycatch = true;
		QUnit.config.testTimeout = 5000;

		function fireEvent(el, type, props, touches) {
			var evt = new CustomEvent(type, {
					"bubbles": true,
					"cancelable": true
				}),
				prop;

			for (prop in props) {
				evt[prop] = props[prop];
			}

			if (touches !== undefined ) {
				if (touches === true) {
					evt.touches = [{pageX: 0, pageY: 0}];
				} else {
					evt.touches = touches || [];
				}
			}

			try {
				return el.dispatchEvent(evt);
			} catch (err) {
				console.err(err);
			}
			return false;
		}

		function initHTML() {
			var html = "<div class=\"ui-page\">\
					<content></content>\
					<div id=\"mock\" style=\"width: 10px; height: 10px;\"></div>\
					<div id=\"mock2\" style=\"width: 10px; height: 10px;\"></div>\
					</div>",
				fixture = document.getElementById("qunit-fixture") || initFixture();

			fixture.style.left = "0px";
			fixture.style.top = "0px";

			fixture.innerHTML = html;
		}

		function bindMouseEvents() {
			vmouse.bindMouse();
		}

		function bindTouchEvents() {
			vmouse.bindTouch();
		}

		function unbindEvents() {
			vmouse.unbindMouse();
			vmouse.unbindTouch();
		}

		function nextTest(assert) {
			if (currentTest === testQueue.length) {
				currentTest++;
			} else if (currentTest < testQueue.length) {
				testQueue[currentTest++](assert);
				unbindEvents();
			}
		}

		module("core/event/vmouse", {
			setup: function () {
				initHTML();
			}
		});

		// vmouse events must be run in queue
		testQueue.push(function (assert) {
			var body = document.body,
				mock = document.getElementById("mock"),
				mock2 = document.getElementById("mock2"),
				mockRect = mock.getBoundingClientRect(),
				mock2Rect = mock2.getBoundingClientRect(),
				states = {
					vmouseup: 0,
					vmousedown: 0,
					vmousemove: 0,
					vmouseout: 0,
					vmousecancel: 0,
					vmouseover: 0
				},
				listener = function (e) {
					var eventName = "";
					ok(states[e.type] !== undefined, e.type + " called only once");

					if (states[e.type] !== undefined) {
						states[e.type]++;
					}

					if (states.vmouseup && states.vmousedown === 2 && states.vmouseout && states.vmousemove === 3 && states.vmousecancel === 2 && states.vmouseover === 2) {
						for (eventName in states) {
							if (states.hasOwnProperty(eventName)) {
								body.removeEventListener(eventName, listener, false);
							}
						}
						nextTest(assert);
					}
				};

			bindTouchEvents();

			body.addEventListener("vmouseup", listener, false);
			body.addEventListener("vmousedown", listener, false);
			body.addEventListener("vmousemove", listener, false);
			body.addEventListener("vmouseout", listener, false);
			body.addEventListener("vmousecancel", listener, false);
			body.addEventListener("vmouseover", listener, false);

			fireEvent(
				mock,
				"touchstart",
				{clientX: mockRect.left, clientY: mockRect.top},
				true
			);
			// touchmove first touch ignore
			fireEvent(
				mock,
				"touchmove",
				{clientX: mockRect.left, clientY: mockRect.top},
				[{identifier: 1}]
			);
			fireEvent(
				mock,
				"touchmove",
				{clientX: 0, clientY: 0},
				[{pageX: mockRect.left, pageY: -mock2Rect.top * vmouse.eventDistanceThreshold}]
			);
			fireEvent(
				mock,
				"touchmove",
				{clientX: 0, clientY: 0},
				[{pageX: mockRect.left, pageY: mockRect.top}]
			);
			fireEvent(
				mock2,
				"touchmove",
				{clientX: 0, clientY: 0},
				[{pageX: mock2Rect.left, pageY: mock2Rect.top}]
			);
			fireEvent(
				mock,
				"touchleave",
				{clientX: mockRect.left, clientY: mockRect.top},
				true
			);
			fireEvent(
				mock,
				"touchend",
				{clientX: mockRect.left, clientY: mockRect.top},
				false
			);
			fireEvent(
				mock,
				"touchstart", // reset state for didScroll
				{clientX: mockRect.left, clientY: mockRect.top},
				true
			);
			fireEvent(
				mock,
				"touchcancel",
				{clientX: mockRect.left, clientY: mockRect.top},
				false
			);
		});

		testQueue.push(function (assert) {
			var body = document.body,
					mock = document.getElementById("mock"),
					listener = function (e) {
						body.removeEventListener("vclick", listener, false);
						assert.equal(e.type, "vclick", "ENTER key keyup generates vclick");
						nextTest(assert);
					};

			body.addEventListener("vclick", listener, false);
			fireEvent(
				mock,
				"keyup",
				{keyCode: 13},
				false
			);
		});

		testQueue.push(function (assert) {
			var body = document.body,
					mock = document.getElementById("mock"),
					listener = function (e) {
						body.removeEventListener("vmousedown", listener, false);
						assert.equal(e.type, "vmousedown", "ENTER key keydown generates vmousedown");
						nextTest(assert);
					};

			body.addEventListener("vmousedown", listener, false);
			fireEvent(
				mock,
				"keydown",
				{keyCode: 13},
				false
			);
		});

		testQueue.push(function (assert) {
			var body = document.body,
					mock = document.getElementById("mock"),
					listener = function (e) {
						body.removeEventListener("vmousecancel", listener, false);
						assert.equal(e.type, "vmousecancel", "scroll event generates vmousecancel");
						nextTest(assert);
					};

			body.addEventListener("vmousecancel", listener, false);
			fireEvent(
				mock,
				"scroll",
				{},
				false
			);
		});

		testQueue.push(function (assert) {
			var body = document.body,
				mock = document.getElementById("mock"),
				mock2 = document.getElementById("mock2"),
				mockRect = mock.getBoundingClientRect(),
				mock2Rect = mock2.getBoundingClientRect(),
				states = {
					vmouseup: 0,
					vmousedown: 0,
					vmousemove: 0,
					vmouseout: 0,
					vmouseover: 0,
					vclick: 0
				},
				listener = function (e) {
					var eventName = "";
					ok(states[e.type] !== undefined, e.type + " called only once");

					if (states[e.type] !== undefined) {
						states[e.type]++;
					}

					if (states.vmouseup && states.vmousedown && states.vmouseout && states.vmousemove && states.vmouseover && states.vclick) {
						for (eventName in states) {
							if (states.hasOwnProperty(eventName)) {
								body.removeEventListener(eventName, listener, false);
							}
						}
						nextTest(assert);
					}
				};

			bindMouseEvents();

			body.addEventListener("vmouseup", listener, false);
			body.addEventListener("vmousedown", listener, false);
			body.addEventListener("vmousemove", listener, false);
			body.addEventListener("vmouseover", listener, false);
			body.addEventListener("vmouseout", listener, false);
			body.addEventListener("vclick", listener, false);

			fireEvent(
				mock,
				"mousedown",
				{}
			);
			fireEvent(
				mock,
				"mouseup",
				{}
			);
			fireEvent(
				mock,
				"mouseover",
				{}
			);
			fireEvent(
				mock,
				"mouseout",
				{}
			);
			fireEvent(
				mock,
				"mousemove",
				{}
			);
			fireEvent(
				mock,
				"click",
				{}
			);
		});

		test("vmouse tests", function (assert) {
			nextTest(assert);
		});
		// ------ end test body ---------
	}

	if (typeof define === "function") {
		define(
			["src/js/core/event/vmouse"],
			function (vmouse) {
				return runTests.bind(null, vmouse);
			}
		);
	} else {
		runTests(tau.event.vmouse, window.helpers);
	}

}(window, window.document, window.tau, window.define));
