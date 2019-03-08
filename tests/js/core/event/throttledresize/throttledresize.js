/*global document, module, window, start, ns */
(function (window, document, tau, define) {
	"use strict";

	function runTests() {
		module("core/event/throttledresize");

		asyncTest("Test resizes", function (throttledresize) {
			var counter = 0,
				timerID,
				testFunc = function () {
					window.removeEventListener("throttledresize", listener, false);
					equal(counter, 1, "throttledresize run only once");
					start();
				},
				listener = function (evt) {
					ok(evt, "event exists");
					equal(evt.type, "throttledresize", "event has proper type");
					++counter;
					if (timerID) {
						window.clearTimeout(timerID);
					}
					window.setTimeout(testFunc, throttledresize.ttl);
				},
				i = 10,
				eventUtils = ns.event;

			window.addEventListener("throttledresize", listener, false);
			while (--i >= 0) {
				eventUtils.trigger(window, "resize");
			}
		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.event.throttledresize);
	}

}(window, window.document, window.tau, window.define));
