/* global document, tau, define, module, test, strictEqual, window, equal, ok, deepEqual */
(function () {
	"use strict";
	function runTests(Manager, helpers) {
		var SimpleInstance = function () {
			},
			SimpleDetector = function (touchEvent, state) {
				this._touchEvent = touchEvent;
				this.state = state;
			},
			gestureIndex = 0;

		SimpleInstance.prototype = {
			getElement: function () {
				return document.body;
			},
			getGestureDetectors: function () {
				return [{
					index: gestureIndex++ % 3
				}];
			}
		};

		SimpleDetector.prototype = {
			detect: function (_event) {
				equal(_event.type, this._touchEvent.type, "Event is stored");

				return this.state;
			}
		};

		module("core/event/gesture/Manager");

		test("constructor", function () {
			var manager = new Manager();

			ok(Array.isArray(manager.instances), "instances property is initialized");
			ok(Array.isArray(manager.gestureDetectors), "gestureDetectors property is initialized");
			ok(Array.isArray(manager.runningDetectors), "runningDetectors property is initialized");
			strictEqual(manager.detectorRequestedBlock, null, "detectorRequestedBlock property is initialized");

			ok(Array.isArray(manager.unregisterBlockList), "unregisterBlockList property is initialized");

			ok(typeof manager.gestureEvents === "object", "gestureEvents property is initialized");
			strictEqual(manager.velocity, null, "velocity property is initialized");

			equal(manager._isReadyDetecting, false, "_isReadyDetecting property is initialized");

			equal(manager._blockMouseEvent, false, "_blockMouseEvent property is initialized");

			ok(typeof manager.touchSupport == "boolean", "touchSupport property is initialized");
		});

		test("_bindStartEvents/_unbindStartEvents", 4, function () {
			var manager = new Manager(),
				instance = {
					getElement: function () {
						return document.body;
					}
				};

			manager.touchSupport = false;

			manager.handleEvent = function (event) {
				strictEqual(event.target, document.body, "Detected event on body");
				strictEqual(event.type, "mousedown", "Event type id mousedown");
			};

			manager._bindStartEvents(instance);

			helpers.triggerEvent(document.body, "mousedown", {}, true, true, {
				touches: []
			});
			helpers.triggerEvent(document.body, "touchstart", {}, true, true, {
				touches: []
			});

			manager._unbindStartEvents(instance);

			helpers.triggerEvent(document.body, "mousedown", {}, true, true, {
				touches: []
			});
			helpers.triggerEvent(document.body, "touchstart", {}, true, true, {
				touches: []
			});

			manager.touchSupport = true;
			manager.handleEvent = function (event) {
				strictEqual(event.target, document.body, "Detected event on body");
				strictEqual(event.type, "touchstart", "Event type id touchstart");
			};

			manager._bindStartEvents(instance);

			helpers.triggerEvent(document.body, "mousedown", {}, true, true, {
				touches: []
			});
			helpers.triggerEvent(document.body, "touchstart", {}, true, true, {
				touches: []
			});

			manager._unbindStartEvents(instance);

			helpers.triggerEvent(document.body, "mousedown", {}, true, true, {
				touches: []
			});
			helpers.triggerEvent(document.body, "touchstart", {}, true, true, {
				touches: []
			});

		});


		test("_bindEvents/_unbindEvents", 10, function () {
			var manager = new Manager(),
				instance = {
					getElement: function () {
						return document.body;
					}
				};

			manager.touchSupport = false;

			manager.handleEvent = function (event) {
				strictEqual(event.target, document.body, "Detected event on body");
				equal(event.type.indexOf("mouse"), 0, "Event type is mouse");
			};

			manager._bindEvents(instance);

			helpers.triggerEvent(document.body, "touchmove", {}, true, true, {
				touches: [{}]
			});
			helpers.triggerEvent(document.body, "touchend", {}, true, true, {
				touches: []
			});
			helpers.triggerEvent(document.body, "touchcancel", {}, true, true, {
				touches: [{}]
			});
			helpers.triggerEvent(document.body, "mousemove", {}, true, true);
			helpers.triggerEvent(document.body, "mouseup", {}, true, true);

			manager._unbindEvents(instance);

			helpers.triggerEvent(document.body, "touchmove", {}, true, true, {
				touches: [{}]
			});
			helpers.triggerEvent(document.body, "touchend", {}, true, true, {
				touches: []
			});
			helpers.triggerEvent(document.body, "touchcancel", {}, true, true, {
				touches: [{}]
			});
			helpers.triggerEvent(document.body, "mousemove", {}, true, true);
			helpers.triggerEvent(document.body, "mouseup", {}, true, true);

			manager.touchSupport = true;
			manager.handleEvent = function (event) {
				strictEqual(event.target, document.body, "Detected event on body");
				equal(event.type.indexOf("touch"), 0, "Event type is mouse");
			};

			manager._bindEvents(instance);

			helpers.triggerEvent(document.body, "touchmove", {}, true, true, {
				touches: [{}]
			});
			helpers.triggerEvent(document.body, "touchend", {}, true, true, {
				touches: []
			});
			helpers.triggerEvent(document.body, "touchcancel", {}, true, true, {
				touches: [{}]
			});
			helpers.triggerEvent(document.body, "mousemove", {}, true, true);
			helpers.triggerEvent(document.body, "mouseup", {}, true, true);

			manager._unbindEvents(instance);

			helpers.triggerEvent(document.body, "touchmove", {}, true, true, {
				touches: [{}]
			});
			helpers.triggerEvent(document.body, "touchend", {}, true, true, {
				touches: []
			});
			helpers.triggerEvent(document.body, "touchcancel", {}, true, true, {
				touches: [{}]
			});
			helpers.triggerEvent(document.body, "mousemove", {}, true, true);
			helpers.triggerEvent(document.body, "mouseup", {}, true, true);

		});

		test("handleEvent", 7, function () {
			var manager = new Manager();

			manager._start = function (event) {
				ok(event.id < 10, "Correct event is on start");
			};

			manager._move = function (event) {
				ok(event.id > 10 && event.id < 20, "Correct event is on move");
			};

			manager._end = function (event) {
				ok(event.id > 20 && event.id < 30, "Correct event is on end");
			};

			manager._cancel = function (event) {
				ok(event.id > 30 && event.id < 40, "Correct event is on cancel");
			};

			// simulate touch events and block mouse

			manager.handleEvent({
				type: "mousedown",
				id: 1
			});

			manager.handleEvent({
				type: "touchstart",
				touches: [],
				id: 2
			});

			manager.handleEvent({
				type: "mousemove",
				id: 11
			});

			manager.handleEvent({
				type: "touchmove",
				touches: [],
				id: 12
			});

			manager.handleEvent({
				type: "mouseup",
				id: 21
			});

			manager.handleEvent({
				type: "touchend",
				touches: [],
				id: 22
			});

			manager.handleEvent({
				type: "touchcancel",
				touches: [],
				id: 31
			});

			// unblock mouse events and test it

			manager._blockMouseEvent = false;

			manager.handleEvent({
				type: "mousedown",
				which: 1,
				id: 1
			});

			manager.handleEvent({
				type: "mousemove",
				which: 1,
				id: 11
			});

			manager.handleEvent({
				type: "mouseup",
				which: 1,
				id: 21
			});

		});

		function testCreateGesture(event, startEvent, lastEvent, expectedEvent) {
			var manager = new Manager(),
				touchEvent = {
					type: "mousemove",
					touches: [{}]
				},
				startEventPointersLength = startEvent.pointers.length;

			expectedEvent.pointer = event.pointer;
			expectedEvent.pointers = event.pointers;
			expectedEvent.startEvent = startEvent;
			expectedEvent.lastEvent = lastEvent;

			manager.gestureEvents = {
				start: startEvent,
				last: lastEvent
			};

			manager.velocity = {
				event: {
					timeStamp: 1200,
					pointer: {
						clientX: 50,
						clientY: 150
					}
				},
				x: 0,
				y: 0
			};

			manager._createDefaultEventData = function (type, _event) {
				strictEqual(type, "move", "Get move type");
				strictEqual(_event, touchEvent, "Get touch event");
				return event;
			};

			manager._detect = function (detectors, event) {
				deepEqual(detectors, [], "Detectors are empty");
				strictEqual(event, event, "Received created event in detector");
			};

			deepEqual(manager._createGestureEvent("move", touchEvent), expectedEvent, "return correct event");

			if (event.pointers.length !== startEventPointersLength) {
				deepEqual(manager.gestureEvents.start.pointers, event.pointers, "startEvents was updated");
			}
		}

		test("_createGestureEvent", 11, function () {
			// simple case
			testCreateGesture({
				pointer: {
					clientX: 100,
					clientY: 200
				},
				pointers: [],
				timeStamp: 1234
			}, {
				pointer: {
					clientX: 50,
					clientY: 150
				},
				pointers: [],
				timeStamp: 1230
			}, {
				pointer: {
					clientX: 75,
					clientY: 150
				},
				pointers: []
			}, {
				deltaTime: 4,
				angle: 45,
				deltaX: 50,
				deltaY: 50,
				direction: "right",
				distance: 70.71067811865476,
				estimatedDeltaX: 72,
				estimatedX: 122,
				estimatedDeltaY: 72,
				estimatedY: 222,
				rotation: 0,
				scale: 1,
				timeStamp: 1234,
				velocityX: 1.4705882352941178,
				velocityY: 1.4705882352941178
			});

			// add second pointer
			testCreateGesture({
				pointer: {
					clientX: 100,
					clientY: 200
				},
				pointers: [{
					clientX: 100,
					clientY: 200
				}, {
					clientX: 200,
					clientY: 400
				}],
				timeStamp: 1234
			}, {
				pointer: {
					clientX: 50,
					clientY: 150
				},
				pointers: [],
				timeStamp: 1230
			}, {
				pointer: {
					clientX: 75,
					clientY: 150
				},
				pointers: []
			}, {
				deltaTime: 4,
				angle: 45,
				deltaX: 50,
				deltaY: 50,
				direction: "right",
				distance: 70.71067811865476,
				estimatedDeltaX: 72,
				estimatedX: 122,
				estimatedDeltaY: 72,
				estimatedY: 222,
				rotation: 0,
				scale: 1,
				timeStamp: 1234,
				velocityX: 1.4705882352941178,
				velocityY: 1.4705882352941178
			});

			// change direction
			testCreateGesture({
				pointer: {
					clientX: 100,
					clientY: 200
				},
				pointers: [{
					clientX: 100,
					clientY: 200
				}, {
					clientX: 200,
					clientY: 400
				}],
				timeStamp: 1234
			}, {
				pointer: {
					clientX: 25,
					clientY: 25
				},
				pointers: [],
				timeStamp: 1230
			}, {
				pointer: {
					clientX: 75,
					clientY: 150
				},
				pointers: [],
				estimatedX: 150,
				estimatedY: 250
			}, {
				deltaTime: 4,
				angle: 66.80140948635182,
				deltaX: 75,
				deltaY: 175,
				direction: "down",
				distance: 190.3943276465977,
				estimatedDeltaX: 125,
				estimatedX: 150,
				estimatedDeltaY: 225,
				estimatedY: 250,
				rotation: 0,
				scale: 1,
				timeStamp: 1234,
				velocityX: 1.4705882352941178,
				velocityY: 1.4705882352941178
			});
		});

		test("_createDefaultEventData", 21, function () {
			var manager = new Manager(),
				event = {
					type: "mouseup",
					preventDefault: function () {},
					stopPropagation: function () {}
				},
				result = manager._createDefaultEventData("type", event);

			equal(result.eventType, "type",
				"_createDefaultEventData created correct object (eventType)");
			deepEqual(result.pointer, undefined,
				"_createDefaultEventData created correct object (pointer)");
			deepEqual(result.pointers, [],
				"_createDefaultEventData created correct object (pointers)");
			deepEqual(result.srcEvent, event,
				"_createDefaultEventData created correct object (srcEvent)");
			equal(typeof result.timeStamp, "number",
				"_createDefaultEventData created correct object (timeStamp)");
			equal(typeof result.preventDefault, "function",
				"_createDefaultEventData created correct object (preventDefault)");
			equal(typeof result.stopPropagation, "function",
				"_createDefaultEventData created correct object (stopPropagation)");

			event.type = "mousedown";

			result = manager._createDefaultEventData("type", event);

			equal(result.eventType, "type",
				"_createDefaultEventData created correct object (eventType)[2]");
			deepEqual(result.pointer, event,
				"_createDefaultEventData created correct object (pointer)[2]");
			deepEqual(result.pointers, [event],
				"_createDefaultEventData created correct object (pointers)[2]");
			deepEqual(result.srcEvent, event,
				"_createDefaultEventData created correct object (srcEvent)[2]");
			equal(typeof result.timeStamp, "number",
				"_createDefaultEventData created correct object (timeStamp)[2]");
			equal(typeof result.preventDefault, "function",
				"_createDefaultEventData created correct object (preventDefault)[2]");
			equal(typeof result.stopPropagation, "function",
				"_createDefaultEventData created correct object (stopPropagation)[2]");

			event.touches = [{}];
			result = manager._createDefaultEventData("type", event);

			equal(result.eventType, "type",
				"_createDefaultEventData created correct object (eventType)[3]");
			deepEqual(result.pointer, {},
				"_createDefaultEventData created correct object (pointer)[3]");
			deepEqual(result.pointers, [{}],
				"_createDefaultEventData created correct object (pointers)[3]");
			deepEqual(result.srcEvent, event,
				"_createDefaultEventData created correct object (srcEvent)[3]");
			equal(typeof result.timeStamp, "number",
				"_createDefaultEventData created correct object (timeStamp)[3]");
			equal(typeof result.preventDefault, "function",
				"_createDefaultEventData created correct object (preventDefault)[3]");
			equal(typeof result.stopPropagation, "function",
				"_createDefaultEventData created correct object (stopPropagation)[3]");

		});

		test("_detect", 16, function () {
			var manager = new Manager(),
				touchEvent = {
					type: "mousemove"
				},
				runningDetector = new SimpleDetector(touchEvent, 2),
				blockedDetector = new SimpleDetector(touchEvent, 8),
				detectors = [
					new SimpleDetector(touchEvent, 1),
					runningDetector,
					new SimpleDetector(touchEvent, 4)
				];

			manager.detectorRequestedBlock = false;

			manager._detect(detectors, touchEvent);

			strictEqual(manager.detectorRequestedBlock, false, "detectorRequestedBlock is not changed");
			deepEqual(manager.gestureDetectors, [], "gestureDetectors is changed");
			deepEqual(manager.runningDetectors, [runningDetector], "runningDetectors is changed");

			runningDetector.state = 4;

			manager.detectorRequestedBlock = false;

			manager._detect([runningDetector], touchEvent);

			strictEqual(manager.detectorRequestedBlock, false, "detectorRequestedBlock is not changed");
			deepEqual(manager.gestureDetectors, [], "gestureDetectors is changed");
			deepEqual(manager.runningDetectors, [], "runningDetectors is changed");

			manager._detect([
				new SimpleDetector(touchEvent, 2),
				blockedDetector,
				new SimpleDetector(touchEvent, 4)
			], touchEvent);

			strictEqual(manager.detectorRequestedBlock, blockedDetector, "detectorRequestedBlock is changed");
			deepEqual(manager.gestureDetectors, [blockedDetector], "gestureDetectors is changed");
			deepEqual(manager.runningDetectors, [], "runningDetectors is changed");

		});


		test("_move", 5, function () {
			var manager = new Manager(),
				event = {},
				touchEvent = {
					type: "mousemove"
				};

			manager._isReadyDetecting = true;
			manager.gestureDetectors = [];

			manager._createGestureEvent = function (type, _event) {
				strictEqual(type, "move", "Get move type");
				strictEqual(_event, touchEvent, "Get touch event");
				return event;
			};

			manager._detect = function (detectors, _event) {
				deepEqual(detectors, [], "Detectors are empty");
				strictEqual(_event, event, "Received created event in detector");
			};

			manager._move(touchEvent);

			strictEqual(manager.gestureEvents.last, event, "Event is stored");
		});

		test("_start", 12, function () {
			var manager = new Manager(),
				event = {},
				touchEvent = {
					currentTarget: document.body,
					type: "touchstart",
					touches: [{
						clientX: 50,
						clientY: 60
					}]
				};

			manager._isReadyDetecting = false;

			manager.instances = [
				new SimpleInstance(),
				new SimpleInstance(),
				new SimpleInstance(),
				new SimpleInstance(),
				new SimpleInstance(),
				new SimpleInstance(),
				new SimpleInstance(),
				new SimpleInstance(),
				new SimpleInstance()
			];

			manager._createDefaultEventData = function (type, _event) {
				strictEqual(type, "start", "Get start type");
				strictEqual(_event, touchEvent, "Get touch event");
				return event;
			};

			manager._createGestureEvent = function (type, _event) {
				strictEqual(type, "start", "Get start type");
				strictEqual(_event, touchEvent, "Get touch event");
				return event;
			};

			manager.resetDetecting = function () {
				ok(true, "resetDetecting was called");
			};

			manager._bindEvents = function () {
				ok(true, "_bindEvents was called");
			};

			manager._detect = function (detectors, event) {
				deepEqual(detectors.length, this.instances.length, "Detectors array is created");
				strictEqual(event, event, "Received created event in detector");
			};

			manager._start(touchEvent);

			strictEqual(manager._isReadyDetecting, true, "_isReadyDetecting is correct created");
			strictEqual(manager.gestureDetectors.length, manager.instances.length, "gestureDetectors is correct created");
			deepEqual(manager.gestureEvents, {
				start: {},
				last: {}
			}, "gestureEvents is correct created");
			deepEqual(manager.velocity,
				{
					"event": {},
					"x": 0,
					"y": 0
				}, "velocity is correct created");
		});

		test("_cancel", 8, function () {
			var manager = new Manager(),
				event = {},
				touchEvent = {
					type: "touchcancel"
				};

			manager.gestureDetectors = [];

			manager.resetDetecting = function () {
				ok(true, "resetDetecting was called");
			};

			manager._createDefaultEventData = function (type, _event) {
				strictEqual(type, "cancel", "Get cancel type");
				strictEqual(_event, touchEvent, "Get touch event");
				return event;
			};

			manager._detect = function (detectors, _event) {
				deepEqual(detectors, [], "Detectors are empty");
				deepEqual(_event, event, "Received created event in detector");
			};

			manager.unregisterBlockList = [
				"instance",
				"instance"
			];

			manager.unregister = function (instance) {
				equal(instance, "instance", "Instance is unregistered");
			};

			manager._cancel(touchEvent);

			equal(manager._blockMouseEvent, false, "_blockMouseEvent is set to false");
		});


		test("_end", 9, function () {
			var manager = new Manager(),
				event = {
					pointers: []
				},
				touchEvent = {
					type: "touchend",
					touches: []
				};

			manager.resetDetecting = function () {
				ok(true, "resetDetecting was called");
			};

			manager._createDefaultEventData = function (type, _event) {
				strictEqual(type, "end", "Get cancel type");
				strictEqual(_event, touchEvent, "Get touch event");
				return event;
			};

			manager._detect = function (detectors, event) {
				deepEqual(detectors, [], "Detectors are empty");
				strictEqual(event, event, "Received created event in detector");
			};

			manager.unregisterBlockList = [
				"instance",
				"instance"
			];

			manager.unregister = function (instance) {
				equal(instance, "instance", "Instance is unregistered");
			};

			manager._end(touchEvent);

			equal(manager._blockMouseEvent, false, "_blockMouseEvent property is initialized");
			equal(manager.instances.length, 0, "instances property is initialized");
		});

		test("unregister", 8, function () {
			var manager = new Manager();

			manager.gestureDetectors = [];
			manager.instances = ["a", "b", "c"];

			manager._unbindStartEvents = function (instance) {
				ok(instance, "Instance is unbound");
			};

			manager._destroy = function () {
				ok(true, "Destroy was called");
			};

			manager.unregister("b");

			deepEqual(manager.instances, ["a", "c"], "Unregister b instance");

			manager.unregister("c");

			deepEqual(manager.instances, ["a"], "Unregister c instance");

			manager.unregister("a");

			deepEqual(manager.instances, [], "Unregister a instance");

			manager.gestureDetectors = ["a"];

			manager.unregister("d");

			deepEqual(manager.unregisterBlockList, ["d"], "Unregister d instance");
		});

		test("_destroy", 4, function () {
			var manager = new Manager();

			manager.resetDetecting = function () {
				ok(true, "resetDetecting was called");
			};

			manager._destroy();

			equal(manager._blockMouseEvent, false, "_blockMouseEvent property is initialized");
			equal(manager.instances.length, 0, "instances property is initialized");
			equal(manager.unregisterBlockList.length, 0, "unregisterBlockList property is initialized");
		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.event.gesture.Manager,
			window.helpers);
	}
}());
