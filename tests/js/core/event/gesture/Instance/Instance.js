/* global ok, document, tau, define, module, test, strictEqual, window, equal, ok, deepEqual */
(function () {
	"use strict";
	function runTests(Manager, Instance) {
		module("core/event/gesture/Instance");

		test("constructor", function () {
			var instance = new Instance(document.body, {
				myOptions: 2
			});

			strictEqual(instance.element, document.body, "element property is initialized");
			deepEqual(instance.eventDetectors, [], "eventDetectors property is initialized");
			deepEqual(instance.options, {
				estimatedPointerTimeDifference: 15,
				triggerEvent: false,
				updateVelocityInterval: 16,
				myOptions: 2
			}, "options property is initialized");
			deepEqual(instance.gestureManager, Manager.getInstance(), "gestureManager property is initialized");
			ok(typeof instance.eventSender.sendEvent === "function", "eventSender property is initialized");

		});

		test("setOptions", function () {
			var instance = new Instance(document.body, {});

			strictEqual(instance.setOptions({
				newOption: "a"
			}), instance, "setOptions return this");

			deepEqual(instance.options, {
				estimatedPointerTimeDifference: 15,
				triggerEvent: false,
				updateVelocityInterval: 16,
				newOption: "a"
			}, "options property is initialized");
		});

		test("addDetector", 3, function () {
			var instance = new Instance(document.body, {}),
				detector = {
					create: function () {
						ok(true, "create was called");
						return {
							name: "a",
							index: 1,
							options: {}
						}
					}
				};

			strictEqual(instance.addDetector(detector), instance, "addDetector return this");

			equal(instance.eventDetectors.length, 1, "eventDetectors property is set");
		});

		test("removeDetector", 5, function () {
			var instance = new Instance(document.body, {}),
				detector = {
					create: function () {
						ok(false);
					}
				};

			instance.gestureManager = {
				unregister: function () {
					ok(true, "Unregister wass called");
				}
			};

			instance.eventDetectors = [detector, null];

			strictEqual(instance.removeDetector(detector), instance, "removeDetector return this");

			deepEqual(instance.eventDetectors, [
				null
			], "options property is initialized");

			strictEqual(instance.removeDetector(null), instance, "removeDetector return this");

			deepEqual(instance.eventDetectors, [], "options property is initialized");
		});

		test("trigger", 2, function () {
			var instance = new Instance(document.body, {}),
				eventCallback = function () {
					ok(true, "Event was called");
					document.body.removeEventListener("gesture", eventCallback, false);
				};

			document.body.addEventListener("gesture", eventCallback, false);

			strictEqual(instance.trigger("gesture", {}), true, "trigger return this");
		});

		test("getElement", function () {
			var instance = new Instance(document.body, {});

			strictEqual(instance.getElement(), document.body, "getElement return document.body");
		});


		test("getGestureDetectors", function () {
			var instance = new Instance(document.body, {}),
				detectors = [1, 2, 3];

			instance.eventDetectors = detectors;

			strictEqual(instance.getGestureDetectors(), detectors, "getGestureDetectors return correct array");
		});

		test("destroy", function () {
			var instance = new Instance();

			instance.destroy();

			strictEqual(instance.element, null, "_blockMouseEvent property is destroyed");
			deepEqual(instance.eventHandlers, {}, "eventHandlers property is destroyed");
			strictEqual(instance.gestureManager, null, "gestureManager property is destroyed");
			strictEqual(instance.eventSender, null, "gestureManager property is destroyed");
			deepEqual(instance.eventDetectors, [], "eventDetectors property is destroyed");
		});
	}

	if (typeof define === "function") {
		define([
				"../../../../../../src/js/core/event/gesture/Manager"
			],
			function (Manager) {
				return runTests.bind(null, Manager);
			});
	} else {
		runTests(
			tau.event.gesture.Manager,
			tau.event.gesture.Instance,
			window.helpers);
	}
}());
