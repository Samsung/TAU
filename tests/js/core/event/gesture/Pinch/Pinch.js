/* global document, tau, define, module, test, expect, window, notStrictEqual, equal, deepEqual, ok, strictEqual */
(function () {
	"use strict";
	function runTests(Pinch) {

		module("core/event/gesture/Pinch");

		test("constructor", function () {
			var options = {
					option: 1
				},
				expectedOptions = {
					option: 1,
					timeThreshold: 400,
					velocity: 0.6
				},
				pinch = new Pinch(options);

			notStrictEqual(pinch.options, options, "Options is new object");
			deepEqual(pinch.options, expectedOptions, "Options is created correct");
		});

		test("handler", function () {
			var pinch = new Pinch({}),
				senderMove = {
					sendEvent: function (type, event) {
						equal(type, "pinchmove", "Event type is pinchmove");
						equal(typeof event, "object", "Event is object");
					}
				},
				senderIn = {
					sendEvent: function (type, event) {
						equal(type, "pinchin", "Event type is pinchin");
						equal(typeof event, "object", "Event is object");
					}
				},
				senderOut = {
					sendEvent: function (type, event) {
						equal(type, "pinchout", "Event type is pinchout");
						equal(typeof event, "object", "Event is object");
					}
				},
				senderStart = {
					sendEvent: function (type, event) {
						equal(type, "pinchstart", "Event type is pinchstart");
						equal(typeof event, "object", "Event is object");
					}
				},
				senderEnd = {
					sendEvent: function (type, event) {
						equal(type, "pinchend", "Event type is pinchend");
						equal(typeof event, "object", "Event is object");
					}
				},
				senderCancel = {
					sendEvent: function (type, event) {
						equal(type, "pinchcancel", "Event type is pinchcancel");
						equal(typeof event, "object", "Event is object");
					}
				},
				pinchInstance = pinch.create();

			// case when move with one touch point and move more then 35
			equal(pinchInstance.handler({
				eventType: "move",
				pointers: [{}],
				distance: 40
			}, senderMove, {}), 4, "handler return 4 (case when move with one touch point and move more then 35)");

			// case when first move with 2 touches
			equal(pinchInstance.handler({
				eventType: "move",
				pointers: [{}, {}],
				preventDefault: function () {
					ok(1, "Prevent Default was called (case when first move with 2 touches)");
				}
			}, senderStart, {}), 2, "handler return 1 (case when first move with 2 touches)");

			strictEqual(pinchInstance.isTriggered, true, "Event was isTriggered (case when first move with 2 touches)");

			// case when next move with 2 touches, scale in
			equal(pinchInstance.handler({
				eventType: "move",
				pointers: [{}, {}],
				deltaTime: 5,
				velocityX: 2,
				velocityY: 3,
				scale: 0.5,
				preventDefault: function () {
					ok(1, "Prevent Default was called (case when next move with 2 touches, scale in)");
				}
			}, senderIn, {
				timeThreshold: 10,
				delay: 10,
				velocity: 1
			}), 12, "handler return 12 (case when next move with 2 touches, scale in)");

			strictEqual(pinchInstance.isTriggered, false, "Event was isTriggered (case when next move with 2 touches, scale in)");

			// case when next move with 2 touches, scale out
			pinchInstance.isTriggered = true;

			equal(pinchInstance.handler({
				eventType: "move",
				pointers: [{}, {}],
				deltaTime: 5,
				velocityX: 2,
				velocityY: 3,
				scale: 2,
				preventDefault: function () {
					ok(1, "Prevent Default was called (case when next move with 2 touches, scale out)");
				}
			}, senderOut, {
				timeThreshold: 10,
				delay: 10,
				velocity: 1
			}), 12, "handler return 12 (case when next move with 2 touches, scale out)");

			strictEqual(pinchInstance.isTriggered, false, "Event was isTriggered (case when next move with 2 touches, scale in)");

			// case when next move with 2 touches, bigger deltaTime

			pinchInstance.isTriggered = true;

			equal(pinchInstance.handler({
				eventType: "move",
				pointers: [{}, {}],
				deltaTime: 15,
				velocityX: 2,
				velocityY: 3,
				scale: 2,
				preventDefault: function () {
					ok(1, "Prevent Default was called (case when next move with 2 touches, bigger deltaTime)");
				}
			}, senderMove, {
				timeThreshold: 10,
				delay: 10,
				velocity: 1
			}), 2, "handler return 1 (case when next move with 2 touches, bigger deltaTime)");

			// case when event is blocked

			pinchInstance.isTriggered = true;
			equal(pinchInstance.handler({
				eventType: "blocked",
				preventDefault: function () {
					ok(1, "Prevent Default was called (case when event is blocked)");
				}
			}, senderEnd, {}), 4, "handler return 4 (case when event is blocked)");

			// case when event is end

			pinchInstance.isTriggered = true;
			equal(pinchInstance.handler({
				eventType: "end",
				preventDefault: function () {
					ok(1, "Prevent Default was called (case when event is end)");
				}
			}, senderEnd, {}), 4, "handler return 4 (case when event is end)");

			// case when event is cancel

			pinchInstance.isTriggered = true;
			equal(pinchInstance.handler({
				eventType: "cancel",
				preventDefault: function () {
					ok(1, "Prevent Default was called (case when event is cancel)");
				}
			}, senderCancel, {}), 4, "handler return 4 (case when event is cancel)");

		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.event.gesture.Pinch,
			window.helpers);
	}
}());
