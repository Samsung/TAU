/* global test, ok, equal, define */
(function () {
	"use strict";

	function runTests(Spin, helpers, ns) {

		var tau = ns || window.ns;

		function initHTML() {
			var HTML = helpers.loadHTMLFromFile("/base/tests/js/core/widget/core/Spin/test-data/sample.html"),
				parent = document.getElementById("qunit-fixture") || helpers.initFixture();

			parent.innerHTML = HTML;
		}

		module("core/widget/core/Spin", {
			setup: initHTML,
			teardown: function () {
				tau.engine._clearBindings();
			}
		});

		test("Default options Spin test", 17, function () {
			var spin = document.getElementById("spin"),
				spinWidget = tau.engine.instanceWidget(spin, "core.Spin"),
				spinClasses = {
					spin: "ui-spin",
					sample: "sample-spin"
				},
				defaultOptions = {
					min: 0,
					max: 9,
					moduloValue: "enabled",
					shortPath: "enabled",
					duration: 600,
					direction: "up",
					rollHeight: "custom", // "container" | "item" | "custom"
					itemHeight: 38,
					momentumLevel: 0, // 0 - one item on swipe
					scaleFactor: 0.4,
					moveFactor: 0.4,
					loop: "enabled",
					labels: [],
					digits: 0, // 0 - doesn't complete by zeros,
					dragTarget: "document"
				};

			ok(spin.classList.contains(spinClasses.spin),
				"Spin classname of element is defined");
			ok(spin.classList.contains(spinClasses.sample),
				"Custom classname of element is defined");

			equal(spinWidget.option("min"), defaultOptions.min, "Default option min of Spin is " + defaultOptions.min);
			equal(spinWidget.option("max"), defaultOptions.max, "Default option max of Spin is " + defaultOptions.max);
			equal(spinWidget.option("moduloValue"), defaultOptions.moduloValue,
				"Default option moduloValue of Spin is " + defaultOptions.moduloValue);
			equal(spinWidget.option("shortPath"), defaultOptions.shortPath,
				"Default option shortPath of Spin is " + defaultOptions.shortPath);
			equal(spinWidget.option("duration"), defaultOptions.duration,
				"Default option duration of Spin is " + defaultOptions.duration);
			equal(spinWidget.option("rollHeight"), defaultOptions.rollHeight,
				"Default option rollHeight of Spin is " + defaultOptions.rollHeight);
			equal(spinWidget.option("itemHeight"), defaultOptions.itemHeight,
				"Default option itemHeight of Spin is " + defaultOptions.itemHeight);
			equal(spinWidget.option("momentumLevel"), defaultOptions.momentumLevel,
				"Default option momentumLevel of Spin is " + defaultOptions.momentumLevel);
			equal(spinWidget.option("scaleFactor"), defaultOptions.scaleFactor,
				"Default option scaleFactor of Spin is " + defaultOptions.scaleFactor);
			equal(spinWidget.option("moveFactor"), defaultOptions.moveFactor,
				"Default option moveFactor of Spin is " + defaultOptions.moveFactor);
			equal(spinWidget.option("loop"), defaultOptions.loop,
				"Default option loop of Spin is " + defaultOptions.loop);
			equal(spinWidget.option("digits"), defaultOptions.digits,
				"Default option digits of Spin is " + defaultOptions.digits);
			equal(typeof spinWidget.option("dragTarget"), typeof defaultOptions.dragTarget,
				"Default option dragTarget of Spin is " + typeof defaultOptions.dragTarget);
			spinWidget.value(5);
			equal(spinWidget.value(), 5,
				"Default option value of Spin is " + 5);
			ok(Array.isArray(spinWidget.option("labels")),
				"Type of Default option labels of Spin is Array");

			spinWidget.destroy();
		});

		test("Defined options Spin test", 14, function () {
			var spin = document.getElementById("spin"),
				options = {
					min: 3,
					max: 10,
					moduloValue: "enabled",
					shortPath: "enabled",
					duration: 200,
					direction: "down",
					rollHeight: "container", // "container" | "item" | "custom"
					itemHeight: 48,
					momentumLevel: 3, // 0 - one item on swipe
					scaleFactor: 0.7,
					moveFactor: 0.1,
					loop: "disabled",
					labels: ["Aaa", "Bbb", "Ccc", "Ddd"],
					digits: 3, // 0 - doesn't complete by zeros
					dragTarget: "self"
				},
				spinWidget = tau.engine.instanceWidget(spin, "core.Spin", options);

			equal(spinWidget.option("min"), options.min, "Option min of Spin is " + options.min);
			equal(spinWidget.option("max"), options.max, "Option max of Spin is " + options.max);
			equal(spinWidget.option("moduloValue"), options.moduloValue,
				"Option moduloValue of Spin is " + options.moduloValue);
			equal(spinWidget.option("shortPath"), options.shortPath,
				"Option shortPath of Spin is " + options.shortPath);
			equal(spinWidget.option("duration"), options.duration,
				"Option duration of Spin is " + options.duration);
			equal(spinWidget.option("rollHeight"), options.rollHeight,
				"Option rollHeight of Spin is " + options.rollHeight);
			equal(spinWidget.option("itemHeight"), options.itemHeight,
				"Option itemHeight of Spin is " + options.itemHeight);
			equal(spinWidget.option("momentumLevel"), options.momentumLevel,
				"Option momentumLevel of Spin is " + options.momentumLevel);
			equal(spinWidget.option("scaleFactor"), options.scaleFactor,
				"Option scaleFactor of Spin is " + options.scaleFactor);
			equal(spinWidget.option("moveFactor"), options.moveFactor,
				"Option moveFactor of Spin is " + options.moveFactor);
			equal(spinWidget.option("loop"), options.loop,
				"Option loop of Spin is " + options.loop);
			equal(spinWidget.option("labels"), options.labels,
				"Option labels of Spin is " + options.labels);
			equal(spinWidget.option("digits"), options.digits,
				"Option digits of Spin is " + options.digits);
			equal(spinWidget.option("dragTarget"), options.dragTarget,
				"Option dragTarget of Spin is " + options.dragTarget);

			spinWidget.destroy();
		});

		test("Undefined values of options Spin test", 4, function () {
			var spin = document.getElementById("spin"),
				options = {
					min: undefined,
					max: undefined,
					duration: undefined
				},
				spinWidget = tau.engine.instanceWidget(spin, "core.Spin", options);

			spinWidget.value();

			equal(spinWidget.option("min"), 0, "Spin option min with undefined value check");
			equal(spinWidget.option("max"), 0, "Spin option max with undefined value check");
			equal(spinWidget.option("duration"), 0, "Spin option duration with undefined value check");
			spinWidget.value(0);
			equal(spinWidget.value(), 0, "Default option value of Spin is " + 0);

			spinWidget.destroy();
		});

		test("Values Spin test", 5, function () {
			var spin = document.getElementById("spin"),
				options = {
					min: 3,
					max: 10,
					loop: "disabled"
				},
				spinWidget = tau.engine.instanceWidget(spin, "core.Spin", options);

			spinWidget.value(3);
			equal(spinWidget.value(), 3, "Spin value check (3)");
			spinWidget.value(10);
			equal(spinWidget.value(), 10, "Spin value check (10)");

			spinWidget.value(0);
			equal(spinWidget.value(), 3, "Spin value check (3) limited to min");
			spinWidget.value(100);
			equal(spinWidget.value(), 10, "Spin value check (100) limited to max");

			spinWidget.option("loop", "enabled");
			spinWidget.value(11);
			equal(spinWidget.value(), 3, "Spin value check for (max + 1) equal min for loop enabled");

			spinWidget.destroy();
		});

		test("Test of _updateItems", 3, function (assert) {
			var widget = new Spin();

			helpers.stub(widget, "_removeSelectedLayout", function () {
				assert.ok(true, "_removeSelectedLayout has been called");
			});

			helpers.stub(widget, "_modifyItems", function () {
				assert.ok(true, "_modifyItems has been called");
			});

			helpers.stub(widget, "_addSelectedLayout", function () {
				assert.ok(true, "_addSelectedLayout has been called");
			});

			widget._updateItems();
		});

		test("Test of _setMax", 2, function (assert) {
			var widget = new Spin(),
				element;

			widget.options.min = 0;
			widget.options.max = 10;
			widget.length = 11;
			widget.step = 1;

			widget._setMax(element, 100);

			assert.equal(widget.options.max, 100, "Max 100 has been set");
			assert.equal(widget.length, 101, "Length of items has been changed to 101");
		});

		test("Test of _setMin", 2, function (assert) {
			var widget = new Spin(),
				element;

			widget.options.min = 10;
			widget.options.max = 20;
			widget.length = 11;
			widget.step = 1;

			widget._setMin(element, 0);

			assert.equal(widget.options.min, 0, "Min 0 has been set");
			assert.equal(widget.length, 21, "Lenght of items has been changed to 21");
		});

		test("Test of _setEnabled", 9, function (assert) {
			var widget = new Spin(),
				element = document.getElementById("spin");

			widget.element = element;
			widget.options.enabled = false;
			widget.dragTarget = element;
			widget._animation = {
				stop: function () {
					assert.ok(true, "_animation.stop() has been called");
				}
			}
			helpers.stub(window, "setTimeout", function () {
				assert.ok(true, "setTimeout has been called");
			});

			// ENABLE
			widget._setEnabled(element, true);

			assert.ok(widget.options.enabled, "Widget enabled");
			assert.ok(element.classList.contains("ui-spin-enabling"), "Widget element has class 'ui-spin-enabling'");
			assert.ok(element.classList.contains("enabled"), "Widget element has class 'enabled'");

			// DISABLE
			widget.options.enabled = true;

			widget._setEnabled(element, false);

			assert.ok(!widget.options.enabled, "Widget disabled");
			assert.ok(element.classList.contains("ui-spin-enabling"), "Widget element has class 'ui-spin-enabling'");
			assert.ok(!element.classList.contains("enabled"), "Widget element has no class 'enabled'");

			element.classList.remove("ui-spin-enabling");
			helpers.restoreStub(window, "setTimeout");
		});

		test("Test of _dragStart", 4, function (assert) {
			var widget = new Spin();

			widget._animation = {
				pause: function () {
					assert.ok(true, "_animation.pause() has been called");
				}
			}
			helpers.stub(widget, "_removeSelectedLayout", function () {
				assert.ok(true, "_removeSelectedLayout has been called");
			});
			widget._count = 10;
			widget._startDragCount = 0;
			widget._previousCount = 0;

			widget._dragStart();

			assert.equal(widget._startDragCount, 10, "widget._startDragCount has been changed to 10");
			assert.equal(widget._previousCount, 10, "widget._previousCount has been changed to 10");
		});

		test("Test of handleEvent appbar", 12, function (assert) {
			var widget = new Spin(),
				testEvent = {
					type: ""
				};

			helpers.stub(widget, "_drag", function (event) {
				assert.ok(true, "_drag has been called");
				assert.equal(event, testEvent, "_drag: event has been provided");
			});

			helpers.stub(widget, "_vmouseDown", function (event) {
				assert.ok(true, "_vmouseDown has been called");
				assert.equal(event, testEvent, "_vmouseDown: event has been provided");
			});

			helpers.stub(widget, "_vmouseUp", function (event) {
				assert.ok(true, "_vmouseUp has been called");
				assert.equal(event, testEvent, "_vmouseUp: event has been provided");
			});

			helpers.stub(widget, "_dragEnd", function (event) {
				assert.ok(true, "_dragEnd has been called");
				assert.equal(event, testEvent, "_dragEnd: event has been provided");
			});

			helpers.stub(widget, "_dragStart", function (event) {
				assert.ok(true, "_dragStart has been called");
				assert.equal(event, testEvent, "_dragStart: event has been provided");
			});

			helpers.stub(widget, "_click", function (event) {
				assert.ok(true, "_click has been called");
				assert.equal(event, testEvent, "_click: event has been provided");
			});

			testEvent.type = "drag";
			widget.handleEvent(testEvent);

			testEvent.type = "vmousedown";
			widget.handleEvent(testEvent);

			testEvent.type = "vmouseup";
			widget.handleEvent(testEvent);

			testEvent.type = "dragend";
			widget.handleEvent(testEvent);

			testEvent.type = "dragstart";
			widget.handleEvent(testEvent);

			testEvent.type = "vclick";
			widget.handleEvent(testEvent);
		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(window.tau.widget.core.Spin,
			window.helpers,
			window.tau);
	}

}());
