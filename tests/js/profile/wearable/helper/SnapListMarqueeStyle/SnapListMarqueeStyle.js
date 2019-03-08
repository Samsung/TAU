/* global QUnit, Promise, define, tau, ns, start */
(function () {
	"use strict";

	function runTests(SnapListMarqueeStyle, helpers) {
		function initHTML() {
			return new Promise(function (resolve) {
				var HTML = helpers.loadHTMLFromFile("/base/tests/js/profile/wearable/helper/SnapListMarqueeStyle/test-data/sample.html"),
					parent = document.getElementById("qunit-fixture") || helpers.initFixture();

				parent.innerHTML = HTML;
				helpers.loadTAUStyle(document, "wearable", function () {
					resolve();
				});
			});
		}

		function clearHTML() {
			helpers.removeTAUStyle(document);
		}

		QUnit.module("helper/SnapListMarqueeStyle", {
			setup: initHTML,
			teardown: clearHTML
		});


		QUnit.test("constructor", function (assert) {
			var listElement = document.getElementById("snap-list"),
				listElement2 = document.getElementById("snap-list2"),
				helper = new SnapListMarqueeStyle(listElement);

			assert.expect(7);

			assert.deepEqual(helper.options, {
				"autoRun": false,
				"ellipsisEffect": "gradient",
				"iteration": 1,
				"marqueeDelay": 0,
				"marqueeStyle": "slide",
				"runOnlyOnEllipsisText": true,
				"snapListview": true,
				"speed": 60,
				"timingFunction": "linear"
			}, "Default options are initialized");

			assert.equal(helper._selectedMarqueeWidget, null, "_selectedMarqueeWidget is initialized");

			assert.equal(helper.element, listElement, "element is initialized");

			// destroy helper for remove event listeners
			helper.destroy();

			// simulate circle mode
			helpers.stub(ns.support.shape, "circle", true);

			helper = new SnapListMarqueeStyle(listElement2);

			assert.deepEqual(helper.options, {
				"autoRun": false,
				"ellipsisEffect": "gradient",
				"iteration": 1,
				"marqueeDelay": 0,
				"marqueeStyle": "slide",
				"runOnlyOnEllipsisText": true,
				"snapListview": true,
				"speed": 60,
				"timingFunction": "linear"
			}, "Default options are initialized");

			assert.equal(typeof helper._listviewWidget, "object", "_snapListStyleHelper is" +
				" initialized");
			assert.equal(helper._selectedMarqueeWidget, null, "_selectedMarqueeWidget is initialized");

			assert.equal(helper.element, listElement2, "element is initialized");

			// destroy helper for remove event listeners
			helper.destroy();

			helpers.restoreStub(ns.support.shape, "circle");

		});

		QUnit.test("init", function (assert) {
			var listElement = document.getElementById("snap-list"),
				listElement2 = document.getElementById("snap-list-2"),
				helper = new SnapListMarqueeStyle(listElement);

			assert.expect(2);

			helper.init();

			assert.deepEqual(helper.options, {
				"autoRun": false,
				"delay": 0,
				"ellipsisEffect": "gradient",
				"iteration": 1,
				"marqueeDelay": 0,
				"marqueeStyle": "slide",
				"runOnlyOnEllipsisText": true,
				"snapListview": false,
				"speed": 60,
				"timingFunction": "linear"
			}, "Default options changed after init");

			// destroy helper for remove event listeners
			helper.destroy();

			helpers.stub(ns.support.shape, "circle", true);

			helper = new SnapListMarqueeStyle(listElement2);

			helper.init();

			assert.deepEqual(helper.options, {
				"autoRun": false,
				"delay": 0,
				"ellipsisEffect": "gradient",
				"iteration": 1,
				"marqueeDelay": 0,
				"marqueeStyle": "slide",
				"runOnlyOnEllipsisText": true,
				"snapListview": true,
				"speed": 60,
				"timingFunction": "linear"
			}, "Default options changed after init");

			// destroy helper for remove event listeners
			helper.destroy();

			helpers.restoreStub(ns.support.shape, "circle");

		});

		QUnit.test("_destroyMarqueeWidget", function (assert) {
			var listElement = document.getElementById("snap-list"),
				helper = new SnapListMarqueeStyle(listElement),
				testFlow = [];

			assert.expect(2);

			helper._selectedMarqueeWidget = {
				_state: null,
				element: listElement,
				reset: function () {
					testFlow.push("reset");
				},
				start: function () {
					testFlow.push("start");
				},
				stop: function () {
					testFlow.push("stop");
				},
				destroy: function () {
					testFlow.push("destroy");
				}
			};

			helper._destroyMarqueeWidget();

			assert.deepEqual(testFlow, [
				"stop",
				"reset",
				"destroy"
			], "flow of call methods is correct (stop, reset, destroy)");

			helper._selectedMarqueeWidget = null;

			testFlow = [];

			helper._destroyMarqueeWidget();

			assert.deepEqual(testFlow, [], "flow of call methods is correct (empty), widget Marquee is not available");

			// destroy helper for remove event listeners
			helper.destroy();
		});

		QUnit.test("_bindEventsForRectangular / _unbindEventsForRectangular", function (assert) {
			var listElement = document.getElementById("snap-list"),
				helper = new SnapListMarqueeStyle(listElement),
				// first expected event is click
				expectedType = "click";

			assert.expect(2);

			helper.handleEvent = function (event) {
				assert.equal(event.type, expectedType, "Event type is correct");
				// after first call
				expectedType = "scroll";
			};

			helper._bindEventsForRectangular();

			// call 2 events which will generate equals
			helpers.triggerEvent(document, "click");
			helpers.triggerEvent(document, "scroll");

			helper._unbindEventsForRectangular();

			// 2 events which will not generate equals
			helpers.triggerEvent(document, "click");
			helpers.triggerEvent(document, "scroll");

			// destroy helper for remove event listeners
			helper.destroy();
		});

		QUnit.test("_bindEventsForCircular / _unbindEventsForCircular", function (assert) {
			var listElement = document.getElementById("snap-list"),
				helper = new SnapListMarqueeStyle(listElement),
				expectedEvents = ["touchstart", "scrollend", "rotarydetent", "selected"],
				// get first expected event
				expectedType = expectedEvents.shift();

			assert.expect(4);

			helper.handleEvent = function (event) {
				assert.equal(event.type, expectedType, "Event type is correct ");
				// change next expected event
				expectedType = expectedEvents.shift();
			};

			helper._bindEventsForCircular();

			// call events which will generate equals
			helpers.triggerEvent(document, "touchstart", null, null, null, {touches: []});
			helpers.triggerEvent(document, "scrollend");
			helpers.triggerEvent(document, "rotarydetent", {direction: "CW"});
			helpers.triggerEvent(document, "selected");

			helper._unbindEventsForCircular();

			// events which will not generate equals
			helpers.triggerEvent(document, "touchstart", null, null, null, {touches: []});
			helpers.triggerEvent(document, "scrollend");
			helpers.triggerEvent(document, "rotarydetent", {direction: "CW"});
			helpers.triggerEvent(document, "selected");

			// destroy helper for remove event listeners
			helper.destroy();
		});

		QUnit.asyncTest("_clickHandlerForRectangular", function (assert) {
			var listElement = document.getElementById("snap-list"),
				helper = new SnapListMarqueeStyle(listElement),
				testFlow = [],
				marqueeWidget = {
					_state: null,
					element: listElement,
					reset: function () {
						testFlow.push("reset");
					},
					start: function () {
						testFlow.push("start");
					},
					stop: function () {
						testFlow.push("stop");
					},
					destroy: function () {
						testFlow.push("destroy");
					}
				};

			assert.expect(5);

			helper._selectedMarqueeWidget = marqueeWidget;

			helper._clickHandlerForRectangular({
				target: listElement.querySelector(".ui-marquee")
			});

			setTimeout(function () {

				assert.deepEqual(testFlow, [
					"stop",
					"reset",
					"destroy"
				], "flow of call methods is correct (stop, reset, destroy), case with Marquee widget exist on another element");

				testFlow = [];

				helper._selectedMarqueeWidget = marqueeWidget;

				helper._clickHandlerForRectangular({
					target: listElement.firstElementChild
				});

				setTimeout(function () {

					assert.deepEqual(testFlow, [
						"start"
					], "flow of call methods is correct (start), case with Marquee widget exist current element and is not running");

					testFlow = [];

					helper._selectedMarqueeWidget = marqueeWidget;
					helper._selectedMarqueeWidget._state = "running";

					helper._clickHandlerForRectangular({
						target: listElement.firstElementChild
					});

					setTimeout(function () {

						assert.deepEqual(testFlow, [
							"reset"
						], "flow of call methods is correct (reset), case with Marquee widget exist current element and is running");

						testFlow = [];

						helper._clickHandlerForRectangular({
							target: listElement.querySelector(".ui-marquee")
						});

						setTimeout(function () {

							assert.deepEqual(testFlow, [
								"stop",
								"reset",
								"destroy"
							], "flow of call methods is correct (stop, reset, destroy), click on anaother element with maquee");

							assert.equal(helper._selectedMarqueeWidget.element, listElement.querySelector(".ui-marquee"), "");

							testFlow = [];

							// destroy helper for remove event listeners
							helper.destroy();
							start();
						}, 300);
					}, 300);
				}, 300);
			}, 300);
		});

		QUnit.asyncTest("_scrollHandlerForRectangular", function (assert) {
			var listElement = document.getElementById("snap-list"),
				helper = new SnapListMarqueeStyle(listElement),
				testFlow = [];

			assert.expect(1);

			helper._selectedMarqueeWidget = {
				_state: null,
				element: listElement,
				reset: function () {
					testFlow.push("reset");
				},
				start: function () {
					testFlow.push("start");
				},
				stop: function () {
					testFlow.push("stop");
				},
				destroy: function () {
					testFlow.push("destroy");
				}
			};

			helper._scrollHandlerForRectangular({
				target: listElement
			});
			setTimeout(function () {

				assert.deepEqual(testFlow, [
					"stop",
					"reset",
					"destroy"
				], "flow of call methods is correct (stop, reset, destroy), destroy widget");

				// destroy helper for remove event listeners
				helper.destroy();
				start();
			}, 100);
		});

		QUnit.asyncTest("_touchStartHandler", function (assert) {
			var listElement = document.getElementById("snap-list"),
				helper = new SnapListMarqueeStyle(listElement),
				testFlow = [];

			assert.expect(2);

			helper._selectedMarqueeWidget = {
				_state: null,
				element: listElement,
				reset: function () {
					testFlow.push("reset");
				},
				start: function () {
					testFlow.push("start");
				},
				stop: function () {
					testFlow.push("stop");
				},
				destroy: function () {
					testFlow.push("destroy");
				}
			};

			helper._touchStartHandler({
				target: listElement
			});
			setTimeout(function () {

				assert.deepEqual(testFlow, [
					"reset"
				], "flow of call methods is correct (reset), reset widget if was initialized");

				testFlow = [];

				helper._selectedMarqueeWidget = null;

				helper._touchStartHandler({
					target: listElement
				});

				assert.deepEqual(testFlow, [], "flow of call methods is correct (empty), widget wasn't initialized");

				// destroy helper for remove event listeners
				helper.destroy();
				start();
			}, 100);
		});

		QUnit.asyncTest("_scrollEndHandler", function (assert) {
			var listElement = document.getElementById("snap-list"),
				helper = new SnapListMarqueeStyle(listElement);

			assert.expect(1);

			helpers.stub(helper, "_destroyMarqueeWidget", function () {
				assert.ok(true, "_destroyMarqueeWidget was called");
			});

			helper._scrollEndHandler({
				target: listElement
			});

			setTimeout(function () {

				helpers.restoreStub(helper, "_destroyMarqueeWidget");

				// destroy helper for remove event listeners
				helper.destroy();
				start();
			}, 100);
		});

		QUnit.asyncTest("_selectedHandler", function (assert) {
			var listElement = document.getElementById("snap-list"),
				helper = new SnapListMarqueeStyle(listElement);

			assert.expect(3);

			helper._selectedMarqueeWidget = null;

			helpers.stub(helper, "_destroyMarqueeWidget", function () {
				assert.ok(true, "_destroyMarqueeWidget was called");
			});

			helper._selectedHandler({
				target: listElement
			});

			setTimeout(function () {
				assert.equal(helper._selectedMarqueeWidget && helper._selectedMarqueeWidget.element,
					listElement.querySelector(".ui-marquee"), "Marquee was initialized on correct element");

				helper._selectedMarqueeWidget = null;

				helper._selectedHandler({
					target: listElement.querySelector(".ui-marquee")
				});

				assert.equal(helper._selectedMarqueeWidget, null, "Marquee wasn't initialized on element");

				helpers.restoreStub(helper, "_destroyMarqueeWidget");

				// destroy helper for remove event listeners
				helper.destroy();
				start();
			}, 100);
		});

		QUnit.test("handleEvent", function (assert) {
			var listElement = document.getElementById("snap-list"),
				helper = new SnapListMarqueeStyle(listElement);

			assert.expect(6);

			helpers.stub(helper, "_clickHandlerForRectangular", function () {
				assert.ok(true, "_clickHandlerForRectangular was called");
			});

			helpers.stub(helper, "_scrollHandlerForRectangular", function () {
				assert.ok(true, "_scrollHandlerForRectangular was called");
			});

			helpers.stub(helper, "_touchStartHandler", function () {
				assert.ok(true, "_touchStartHandler was called");
			});

			helpers.stub(helper, "_scrollEndHandler", function () {
				assert.ok(true, "_scrollEndHandler was called");
			});

			helpers.stub(helper, "_selectedHandler", function () {
				assert.ok(true, "_selectedHandler was called");
			});

			helper.handleEvent({type: "click"});
			helper.handleEvent({type: "scroll"});
			helper.handleEvent({type: "rotarydetent", detail: {}});
			helper.handleEvent({type: "touchstart"});
			helper.handleEvent({type: "scrollend"});
			helper.handleEvent({type: "selected"});

			helpers.restoreStub(helper, "_clickHandlerForRectangular");
			helpers.restoreStub(helper, "_scrollHandlerForRectangular");
			helpers.restoreStub(helper, "_touchStartHandler");
			helpers.restoreStub(helper, "_scrollEndHandler");
			helpers.restoreStub(helper, "_selectedHandler");

			// destroy helper for remove event listeners
			helper.destroy();
		});

		QUnit.test("create", function (assert) {
			var listElement = document.getElementById("snap-list"),
				helper = SnapListMarqueeStyle.create(listElement);

			assert.expect(1);

			assert.equal(helper instanceof SnapListMarqueeStyle, true, "create return helper instance");

			// destroy helper for remove event listeners
			helper.destroy();
		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.helper.SnapListMarqueeStyle,
			window.helpers);
	}
}());
