/* global start, document, tau, define, module, test, expect, window, notStrictEqual, equal, deepEqual, ok, strictEqual */
(function () {
	"use strict";
	function runTests(LongPress) {

		module("core/event/gesture/LongPress");

		test("constructor", function () {
			var options = {
					option: 1
				},
				expectedOptions = {
					longPressDistanceThreshold: 20,
					longPressTimeThreshold: 750,
					option: 1,
					preventClick: true
				},
				longPress = new LongPress(options);

			notStrictEqual(longPress.options, options, "Options is new object");
			deepEqual(longPress.options, expectedOptions, "Options is created correct");
		});

		asyncTest("handler", function () {
			var longPress = new LongPress({}),
				senderMove = {
					sendEvent: function (type, event) {
						equal(type, "longpress", "Event type is longpress");
						equal(typeof event, "object", "Event is object");
					}
				},
				senderStart = {
					sendEvent: function (type, event) {
						equal(type, "longPressstart", "Event type is longPressstart");
						equal(typeof event, "object", "Event is object");
					}
				},
				senderEnd = {
					sendEvent: function (type, event) {
						equal(type, "longPressend", "Event type is longPressend");
						equal(typeof event, "object", "Event is object");
					}
				},
				longPressInstance = longPress.create();

			// case when start touch
			equal(longPressInstance.handler({
				eventType: "start"
			}, senderMove, {
				longPressTimeThreshold: 750
			}), 1, "handler return 1 (case when start touch)");

			// case when end touch direct after start
			equal(longPressInstance.handler({
				eventType: "end"
			}, senderEnd, {
			}), 4, "handler return 4 (case when end touch direct after start)");

			// case when start touch and wait for end
			equal(longPressInstance.handler({
				eventType: "start"
			}, senderMove, {
				longPressTimeThreshold: 750
			}), 1, "handler return 1 (case when start touch and wait for end)");

			setTimeout(function () {
				equal(longPressInstance.handler({
					eventType: "end",
					pointers: [{}, {}],
					preventDefault: function () {
						ok(1, "Prevent Default was called (case when start touch and wait for end)");
					}
				}, senderStart, {
					preventClick: true
				}), 4, "handler return 1 (case when start touch and wait for end)");

				equal(longPressInstance.isTriggered, true, "isTriggered is true (case when start touch and wait for end)");

				// case when start touch and move
				equal(longPressInstance.handler({
					eventType: "start"
				}, senderMove, {
					longPressTimeThreshold: 750
				}), 1, "handler return 1 (case when start touch and move)");

				// case when move touch with big distance
				equal(longPressInstance.handler({
					eventType: "move",
					distance: 30
				}, senderEnd, {
					longPressDistanceThreshold: 20
				}), 4, "handler return 4 (case when move touch with big distance)");

				setTimeout(function () {
					equal(longPressInstance.isTriggered, false, "isTriggered is true (case when move touch with big distance)");
					start();
				}, 1000);
			}, 1000);
		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.event.gesture.LongPress,
			window.helpers);
	}
}());
