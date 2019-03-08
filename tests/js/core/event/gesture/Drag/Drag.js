/* global document, tau, define, module, test, expect, window, notStrictEqual, equal, deepEqual, ok */
(function () {
	"use strict";
	function runTests(Drag) {

		module("core/event/gesture/Drag");

		test("constructor", function () {
			var options = {
					option: 1
				},
				expectedOptions = {
					blockHorizontal: false,
					blockVertical: false,
					delay: 0,
					option: 1,
					threshold: 20
				},
				drag = new Drag(options);

			notStrictEqual(drag.options, options, "Options is new object");
			deepEqual(drag.options, expectedOptions, "Options is created correct");
		});

		test("handler", function () {
			var drag = new Drag({}),
				senderMove = {
					sendEvent: function (type, event) {
						equal(type, "drag", "Event type is drag");
						equal(typeof event, "object", "Event is object");
					}
				},
				senderPrepare = {
					sendEvent: function (type, event) {
						equal(type, "dragprepare", "Event type is dragprepare");
						equal(typeof event, "object", "Event is object");
					}
				},
				senderDrag = {
					state: 0,
					sendEvent: function (type, event) {
						if (this.state === 0) {
							equal(type, "dragstart", "Event type is dragstart");
							this.state = 1;
						} else {
							equal(type, "drag", "Event type is drag");
							this.state = 0;
						}
						equal(typeof event, "object", "Event is object");
					}
				},
				senderEnd = {
					sendEvent: function (type, event) {
						equal(type, "dragend", "Event type is dragend");
						equal(typeof event, "object", "Event is object");
					}
				},
				dragInstance = drag.create();

			// in phantom one prevent is not called bacause in code this prevent is do only in chrome
			if (window.navigator.userAgent.match("PhantomJS")) {
				expect(39);
			} else {
				expect(40);
			}

			// case when move is smaller then threshold
			equal(dragInstance.handler({
				eventType: "move",
				deltaX: 10,
				deltaY: 10,
				preventDefault: function () {
					ok(1, "Prevent Default was called (case when move is smaller then threshold)");
				}
			}, senderMove, {
				threshold: 20
			}), 1, "handler return 1 (case when move is smaller then threshold)");

			// case when time is smaller then delay
			equal(dragInstance.handler({
				eventType: "move",
				deltaX: 10,
				deltaY: 10,
				deltaTime: 5,
				preventDefault: function () {
					ok(1, "Prevent Default was called (case when time is smaller then delay)");
				}
			}, senderMove, {
				threshold: 5,
				delay: 10
			}), 1, "handler return 1 (case when time is smaller then delay)");

			// block horizontal case
			equal(dragInstance.handler({
				eventType: "move",
				deltaX: 10,
				deltaY: 10,
				deltaTime: 5,
				direction: "left"
			}, senderMove, {
				threshold: 5,
				delay: 0,
				blockHorizontal: true
			}), 4, "handler return 4 (block horizontal case)");


			// standard drag trigger
			dragInstance.triggered = false;
			equal(dragInstance.handler({
				eventType: "move",
				deltaX: 10,
				deltaY: 10,
				deltaTime: 5,
				direction: "left",
				preventDefault: function () {
					ok(1, "Prevent Default was called (standard drag trigger)");
				}
			}, senderDrag, {
				threshold: 5,
				delay: 0
			}), 4, "handler return 4 (standard drag trigger)");

			equal(dragInstance.fixedStartPointX, -5, "fixedStartPointX is correct set (standard drag trigger)");
			equal(dragInstance.fixedStartPointY, 0, "fixedStartPointY is correct set (standard drag trigger)");

			// block partial direction horizontal
			equal(dragInstance.handler({
				eventType: "move",
				deltaX: 10,
				deltaY: 10,
				deltaTime: 5,
				direction: "up",
				preventDefault: function () {
					ok(1, "Prevent Default was called (block partial direction horizontal)");
				}
			}, senderMove, {
				threshold: 5,
				delay: 0,
				blockHorizontal: true
			}), 4, "handler return 4");

			equal(dragInstance.fixedStartPointX, -5, "fixedStartPointX is correct set (block partial direction horizontal)");
			equal(dragInstance.fixedStartPointY, 0, "fixedStartPointY is correct set (block partial direction horizontal)");

			// block partial direction vertical
			equal(dragInstance.handler({
				eventType: "move",
				deltaX: 10,
				deltaY: 10,
				deltaTime: 5,
				direction: "up",
				preventDefault: function () {
					ok(1, "Prevent Default was called (block partial direction vertical)");
				}
			}, senderMove, {
				threshold: 5,
				delay: 0,
				blockVertical: true
			}), 4, "handler return 4 (block partial direction vertical)");

			equal(dragInstance.fixedStartPointX, -5, "fixedStartPointX is correct set (block partial direction vertical)");
			equal(dragInstance.fixedStartPointY, 0, "fixedStartPointY is correct set (block partial direction vertical)");

			// test start event
			equal(dragInstance.handler({
				eventType: "start",
				deltaX: 10,
				deltaY: 10,
				deltaTime: 5,
				direction: "up",
				preventDefault: function () {
					ok(1, "Prevent Default was called (test start event)");
				}
			}, senderPrepare, {
				threshold: 5,
				delay: 0,
				blockVertical: true
			}), 1, "handler return 1 (test start event)");

			equal(dragInstance.isTriggered, false, "isTriggered is correct set (test start event)");

			// test start event, prevented
			equal(dragInstance.handler({
				eventType: "start",
				deltaX: 10,
				deltaY: 10,
				deltaTime: 5,
				direction: "up",
				preventDefault: function () {
					ok(1, "Prevent Default was called (test start event, prevented)");
				}
			}, {
				sendEvent: function () {
					return false;
				}
			}, {
				threshold: 5,
				delay: 0,
				blockVertical: true
			}), 4, "handler return 4 (test start event, prevented)");

			equal(dragInstance.isTriggered, false, "isTriggered is correct set (test start event, prevented)");

			// test move event
			equal(dragInstance.handler({
				eventType: "move",
				deltaX: 10,
				deltaY: 10,
				deltaTime: 5,
				direction: "up",
				preventDefault: function () {
					ok(1, "Prevent Default was called (test move event)");
				}
			}, senderMove, {
				threshold: 5,
				delay: 0,
				blockVertical: true
			}), 4, "handler return 1 (test move event)");

			equal(dragInstance.isTriggered, false, "isTriggered is correct set (test move event)");

			dragInstance.isTriggered = false;

			// test move event, prevented
			equal(dragInstance.handler({
				eventType: "move",
				deltaX: 10,
				deltaY: 10,
				deltaTime: 5,
				direction: "up",
				preventDefault: function () {
					ok(1, "Prevent Default was called (test move event, prevented)");
				}
			}, {
				sendEvent: function () {
					return false;
				}
			}, {
				threshold: 5,
				delay: 0
			}), 4, "handler return 1 (test move event, prevented)");

			equal(dragInstance.isTriggered, true, "isTriggered is correct set (test move event, prevented)");

			dragInstance.isTriggered = true;

			// test end event
			equal(dragInstance.handler({
				eventType: "end",
				deltaX: 10,
				deltaY: 10,
				deltaTime: 5,
				direction: "up",
				preventDefault: function () {
					ok(1, "Prevent Default was called (test end event)");
				}
			}, senderEnd, {
				threshold: 5,
				delay: 0
			}), 4, "handler return 4 (test end event)");

			equal(dragInstance.isTriggered, false, "isTriggered is correct set (test end event)");

			dragInstance.isTriggered = true;

			// test cancel event
			equal(dragInstance.handler({
				eventType: "cancel",
				deltaX: 10,
				deltaY: 10,
				deltaTime: 5,
				direction: "up",
				preventDefault: function () {
					ok(1, "Prevent Default was called (test cancel event)");
				}
			}, {
				sendEvent: function () {
					return false;
				}
			}, {
				threshold: 5,
				delay: 0
			}), 4, "handler return 4 (test cancel event)");

			equal(dragInstance.isTriggered, false, "isTriggered is correct set (test cancel event)");
		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.event.gesture.Drag,
			window.helpers);
	}
}());
