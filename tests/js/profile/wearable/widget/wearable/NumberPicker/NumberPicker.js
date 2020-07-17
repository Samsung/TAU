/* global QUnit, define, tau */
(function () {
	"use strict";
	function runTests(NumberPicker, helpers) {

		function initHTML() {
			return new Promise(function (resolve) {
				var HTML = helpers.loadHTMLFromFile("/base/tests/js/profile/wearable/widget/wearable/NumberPicker/test-data/sample.html"),
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

		QUnit.module("profile/wearable/widget/wearable/NumberPicker", {
			setup: initHTML,
			teardown: clearHTML
		});

		QUnit.test("default value of number picker", function (assert) {
			var element = document.getElementById("number-picker"),
				numberPicker = new NumberPicker(),
				inputFieldValue = 4;

			numberPicker.element = element;

			assert.equal(numberPicker.value(), inputFieldValue,
				"Initial value of the NumberPicker widget is same as in the input filed in HTML it's based on");
		});

		QUnit.test("default options", function (assert) {
			var element = document.getElementById("number-picker"),
				numberPicker = new NumberPicker(),
				defaultOptions = {
					min: 0,
					max: 12,
					step: 1,
					disabled: false,
					accelerated: 0
				},
				widgetOptions = numberPicker.options;

			numberPicker.element = element;

			Object.keys(defaultOptions).forEach(function (property) {
				assert.equal(widgetOptions[property], defaultOptions[property], property + " property does not have default value");
			});
		});

		QUnit.test("_build", 15, function (assert) {
			var widget = new NumberPicker(),
				element = document.getElementById("number-picker"),
				result;

			helpers.stub(widget, "_createWidgets", function (param) {
				assert.ok(true, "_createWidgets");
				assert.equal(param, element, "_createWidgets: element is given");
			});

			result = widget._build(element);

			assert.equal(result, element, "_build method returns proper result");
			assert.ok(!!widget._ui.indicator, "indicator exists");
			assert.ok(!!widget._ui.parent, "parent exists");
			assert.ok(!!widget._ui.container, "container exists");
			assert.ok(!!widget._ui.number, "number exists");
			assert.ok(!!widget._ui.buttonSet, "buttonSet exists");
			assert.ok(!!widget._ui.label, "label exists");
			assert.ok(!!widget._ui.footer, "footer exists");

			assert.ok(widget._ui.container.classList.contains("ui-number-picker-container"), "container has proper class");
			assert.ok(widget._ui.number.classList.contains("ui-number-picker-number"), "number element has proper class");
			assert.ok(widget._ui.label.classList.contains("ui-number-picker-label"), "label element has proper class");
			assert.ok(widget._ui.buttonSet.classList.contains("ui-number-picker-set"), "button SET has proper class");

			assert.ok(widget._wasBuilt.buttonSet, "buttonSet has been build by widget");
		});

		QUnit.test("_getOptions", 4, function (assert) {
			var widget = new NumberPicker(),
				element = document.getElementById("number-picker");

			helpers.stub(widget, "_createWidgets", function (param) {
				assert.ok(true, "_createWidgets");
				assert.equal(param, element, "_createWidgets: element is given");
			});

			widget.options = {};
			element.setAttribute("min", 12);
			element.setAttribute("max", 103);
			element.setAttribute("step", 2);
			element.setAttribute("disabled", true);

			widget._getOptions(element);

			assert.equal(widget.options.min, 12, "option min is correct");
			assert.equal(widget.options.max, 103, "option min is correct");
			assert.equal(widget.options.step, 2, "option min is correct");
			assert.ok(widget.options.disabled, "option disabled is correct");
		});

		QUnit.test("_configure", 2, function (assert) {
			var widget = new NumberPicker(),
				element = document.getElementById("number-picker");

			helpers.stub(widget, "_getOptions", function (param) {
				assert.ok(true, "_getOptions");
				assert.equal(param, element, "_getOptions: element is given");
			});

			widget._configure(element);
		});

		QUnit.test("_toggle", 4, function (assert) {
			var widget = new NumberPicker();

			widget.options = {
				disabled: false
			};
			widget._ui = {
				container: document.createElement("div")
			}
			widget._toggle(true);

			assert.ok(widget.options.disabled, "widget has been disabled");
			assert.ok(widget._ui.container.classList.contains("ui-number-picker-disabled"), "widget have disabled class");

			widget.options = {
				disabled: true
			};
			widget._ui = {
				container: document.createElement("div")
			}
			widget._ui.container.classList.add("ui-number-picker-disabled");

			widget._toggle(false);

			assert.ok(!widget.options.disabled, "widget is not disabled");
			assert.ok(!widget._ui.container.classList.contains("ui-number-picker-disabled"), "widget doesn't have disabled class");
		});

		QUnit.test("_refresh", 7, function (assert) {
			var widget = new NumberPicker(),
				element = document.getElementById("number-picker");

			helpers.stub(widget, "_getOptions", function () {
				assert.ok(true, "_getOptions");
			});
			helpers.stub(widget, "_setValue", function (value) {
				assert.ok(true, "_setValue");
				assert.equal(value, element.getAttribute("value"), "element.value is correct");
			});
			helpers.stub(widget, "_toggleCircleIndicator", function (value) {
				assert.ok(true, "_toggleCircleIndicator");
				assert.ok(!value, "value is false");
			});
			helpers.stub(widget, "_toggle", function (value) {
				assert.ok(true, "_toggle");
				assert.ok(value, "value is true");
			});

			element.setAttribute("value", 10);
			widget.element = element;
			widget.options = {
				disabled: true
			};

			widget._refresh();
		});

		QUnit.test("_setValue", 12, function (assert) {
			var widget = new NumberPicker(),
				element = document.getElementById("number-picker");


			widget.element = element;
			widget.options = {
				min: 34,
				max: 60
			}

			// case 1
			helpers.stub(widget, "_updateValue", function (value) {
				assert.ok(true, "_updateValue");
				assert.equal(value, 40, "value is correct");
			});

			widget._setValue(40);
			assert.equal(element.value, 40, "Value has been properly set");
			assert.equal(element.getAttribute("value"), "40", "Value has been properly set");

			// case LOOP if value < min the value = max
			helpers.stub(widget, "_updateValue", function (value) {
				assert.ok(true, "_updateValue");
				assert.equal(value, 60, "value is correct");
			});
			widget._setValue(10);
			assert.equal(element.value, 60, "Value has been properly set");
			assert.equal(element.getAttribute("value"), "60", "Value has been properly set");

			// case LOOP if value > max the value = min
			helpers.stub(widget, "_updateValue", function (value) {
				assert.ok(true, "_updateValue");
				assert.equal(value, 34, "value is correct");
			});
			widget._setValue(70);
			assert.equal(element.value, 34, "Value has been properly set");
			assert.equal(element.getAttribute("value"), "34", "Value has been properly set");

		});

		QUnit.test("_updateValue", 2, function (assert) {
			var widget = new NumberPicker();

			widget._spin = {
				value: function (number) {
					assert.ok(true, "_spin.value");
					assert.equal(number, 4, "spin value is correct");
				}
			}

			widget._updateValue(4);
		});

	}
	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.widget.wearable.NumberPicker,
			window.helpers);
	}
}());
