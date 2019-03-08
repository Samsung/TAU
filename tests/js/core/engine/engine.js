/*global test, ok, equal, module, tau, asyncTest, start, define */

(function () {
	function runTests(BaseWidget, engine, helpers) {
		var parent,
			ns = window.ns || window.tau,
			widget1,
			element1;

		window.tauPerf = {
			finish: function () {
			},
			start: function () {
			},
			get: function () {
			}
		};

		(function () {
			"use strict";
			ns.test = ns.test || {};
			ns.test.widget1 = (function () {
				var testWidget = function () {
				};

				engine.defineWidget(
					"Test1",
					"div.test-widget-by-definition",
					[],
					testWidget
				);

				testWidget.prototype = new BaseWidget();

				testWidget.prototype._build = function (element) {

					element.setAttribute("data-built", "true");
					element.classList.add("test-class-build");
					return element;
				};
				testWidget.prototype._init = function (element) {
					var child = document.createElement("span");

					child.classList.add("test-child");
					element.classList.add("test-class-init");
					element.appendChild(child);
				};
				testWidget.prototype._bindEvents = function (element) {
					element.addEventListener("test-event", function (evt) {
						var data = evt.detail.testData;

						ns.event.trigger(element, "test-event-bounce", {"testData": data * data});
					}, false);
				};
				testWidget.prototype._destroy = function (element) {
					element = element || this.element;
					element.classList.remove("test-class-build");
				};
				testWidget.prototype.apiCall = function (a) {
					return a + a;
				};

				return testWidget;
			}());
		}());


		function initHTML() {
			var HTML = helpers.loadHTMLFromFile("/base/tests/js/core/engine/test-data/sample.html");

			parent = document.getElementById("qunit-fixture") || helpers.initFixture();
			parent.innerHTML = HTML;

			ns.setConfig("pageContainer", parent);
		}

		module("core/engine", {
			setup: initHTML,
			teardown: function () {
				engine.destroyAllWidgets(document.body);
				engine.removeAllBindings(document.body);
				engine.stop();
				engine._clearBindings();
			}
		});

		asyncTest("Generating widgets", 9, function () {
			document.addEventListener("tauinit", function test1() {
				var el1 = document.getElementById("test1-test-widget");

				widget1 = engine.instanceWidget(el1, "Test1", {
					create: function () {
						ok(true, "create was called");
					}
				});
				element1 = widget1.element;

				// @NOTE: ACTUAL TESTS HERE!
				document.removeEventListener("tauinit", test1, false);

				ok(widget1, "binding for widget1 with def created");
				equal(widget1.id, el1.id, "DOM and binding ids are the same for widget1");
				ok(element1.children.length, "widget1 child created");
				ok(element1.classList.contains("test"), "Widget1 classes moved");
				equal(widget1.apiCall(2), 4, "Widget1 api call");
				element1.addEventListener("test-event-bounce", function (evt1) {
					var data = evt1.detail.testData;

					equal(data, 4, "Widget1 event returning data");
					start();
				}, false);

				helpers.triggerEvent(element1, "test-event", {"testData": 2});

				equal(engine.getBinding(el1), widget1, "getBinding return proper widget");
				equal(engine.instanceWidget(el1, "Test1"), widget1, "instanceWidget return proper widget");
			}, false);
			engine.run();
		});

		test("getBinding after change structure", function () {
			var el1 = document.getElementById("test1-test-widget"),
				widget2 = engine.instanceWidget(el1, "Test1");

			ok(widget2 !== widget1, "get binding return new widget");
			equal(engine.getBinding(el1), widget2, "get binding return new widget at second time");
			equal(engine.getBinding(el1.id), widget2, "get binding return new widget third time");
			equal(engine.removeBinding(el1.id), true, "remove binding return true");
			equal(engine.removeBinding(el1.id), false, "remove binding return false at second time");
			widget2 = engine.instanceWidget(el1, "Test1");
			equal(engine.getBinding(el1), widget2, "get binding return new widget after instanceWidget");
			engine._clearBindings();
			equal(engine.getBinding(el1), null, "get binding return null after _clearBindings");
		});

		test("Define widgets without method array", function () {
			var testWidget = function () {
				},
				def;

			testWidget.prototype = new BaseWidget();

			engine.defineWidget(
				"Test2",
				"div.just-to-run-with-empty-methods",
				null,
				testWidget
			);

			def = engine.getWidgetDefinition("Test2");
			ok(def, "Definition exists");
			ok(def.methods, "Definition methods exists");
			equal(def.methods && def.methods.length, 6, "Definition has 6 basic methods");
		});

		test("Redefine widget", function () {
			var NewWidget = function () {
				return this;
			};

			NewWidget.prototype = new BaseWidget();

			equal(engine.defineWidget(
				"Test1",
				"div.test-widget-by-definition",
				[],
				NewWidget
			), false, "define widget return false");
			equal(typeof engine.getWidgetDefinition("Test1"), "object", "get definition return object");
			ok(typeof engine.getDefinitions(), "object", "getDefinitions return object");
			equal(engine.defineWidget(
				"Test1",
				"div.test-widget-by-definition",
				[],
				NewWidget,
				"namespace",
				true
			), true, "define widget with redefine parameter return true");
		});

		test("Create/destroy widgets", function () {
			var widget = engine.getBinding("test1-test-widget"),
				buildChild;

			engine.run();
			ok(!widget, "widget not created");
			helpers.triggerEvent(document, "create");
			widget = engine.getBinding("test1-test-widget");
			ok(widget, "widget Test1 created");
			//widget = engine.getBinding("page1");
			//ok(widget, 'widget page created');

			engine.destroyWidget("test1-test-widget");
			ok(!engine.getBinding("test1-test-widget"), "widget Test1 destroyed");

			widget = engine.getBinding("test3-test-widget");
			ok(widget, "widget Test3 created");
			buildChild = widget.element.querySelector("[data-tau-built]");
			ok(buildChild, "One build child inside");

			engine.destroyAllWidgets("test3-test-widget");
			ok(!engine.getBinding("test3-test-widget"), "widget Test3 destroyed");

			ok(!buildChild.getAttribute("data-tau-built"), "Widget has no property 'data-tau-built' (is destroyed)");
		});

		test("Creating widgets with \"justBuild\"", function () {
			var element,
				widget,
				boundAttr = engine.dataTau.bound;

			// Set justBuild
			engine.setJustBuild(true);

			element = document.getElementById("test2-test-widget");
			widget = engine.instanceWidget(element, "Test1");

			ok(widget, "Widget Test2 created");
			equal(element.getAttribute(boundAttr), null, "Widget not bound");

			// Unset justBuild
			engine.setJustBuild(false);
		});

		test("Create many widgets on one element - attributes", function () {
			var widget = document.getElementById("test4-test-widget");

			engine.instanceWidget(widget, "Test1");
			engine.instanceWidget(widget, "Test2");

			equal(widget.getAttribute("data-tau-built"), "Test1,Test2", "Widget gets proper data-tau-built value");
			equal(widget.getAttribute("data-tau-name"), "Test1,Test2", "Widget gets proper data-tau-name value");
			equal(widget.getAttribute("data-tau-bound"), "Test1,Test2", "Widget gets proper data-tau-bound value");

			engine.destroyAllWidgets(widget);
		});

		test("Create many widgets on one element - bindings", function () {
			var widget = document.getElementById("test4-test-widget"),
				test1Instance = engine.instanceWidget(widget, "Test1"),
				test2Instance = engine.instanceWidget(widget, "Test2"),
				tempBinding1 = engine.getBinding(widget, "Test1"),
				tempBinding2 = engine.getBinding(widget, "Test2"),
				multiBinding = engine.getAllBindings(widget);

			ok(test1Instance === tempBinding1, "getBinding returns reference to that same Test1 object");
			ok(test2Instance === tempBinding2, "getBinding returns reference to that same Test2 object");

			ok(test1Instance === multiBinding.Test1, "getAllBindings.Test1 returs reference to that same Test1 object");
			ok(test2Instance === multiBinding.Test2, "getAllBindings.Test2 returs reference to that same Test2 object");

			engine.destroyAllWidgets(widget);
		});

	}

	if (typeof define === "function") {
		define([
			"../../../../src/js/core/widget/BaseWidget",
			"../../../../src/js/core/router/route/page"
		], function (BaseWidget) {
			return runTests.bind(null, BaseWidget);
		});
	} else {
		runTests(tau.widget.BaseWidget, tau.engine, window.helpers);
	}

}());