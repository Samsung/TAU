/* global document, tau, define, module, test, expect, window, notStrictEqual, equal, deepEqual, ok */
(function () {
	"use strict";
	function runTests(Swipe) {

		module("core/event/gesture/Swipe");

		test("constructor", function () {
			var options = {
					option: 1
				},
				expectedOptions = {
					option: 1,
					orientation: "horizontal",
					timeThreshold: 400,
					velocity: 0.6
				},
				swipe = new Swipe(options);

			notStrictEqual(swipe.options, options, "Options is new object");
			deepEqual(swipe.options, expectedOptions, "Options is created correct");
		});

		test("handler", function () {
			var swipe = new Swipe({}),
				senderEnd = {
					sendEvent: function (type, event) {
						equal(type, "swipe", "Event type is swipe");
						equal(typeof event, "object", "Event is object");
					}
				},
				swipeInstance = swipe.create();

			// case when move where move is slow
			equal(swipeInstance.handler({
				eventType: "end",
				deltaTime: 30
			}, senderEnd, {
				timeThreshold: 20
			}), 4, "handler return 4 (case when move where move is slow)");

			// case when move where move is fast
			equal(swipeInstance.handler({
				eventType: "end",
				velocityX: 1,
				direction: "left"
			}, senderEnd, {
				velocity: 0.5,
				orientation: "horizontal"
			}), 12, "handler return 12 (case when move where move is fast)");

		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.event.gesture.Swipe,
			window.helpers);
	}
}());
