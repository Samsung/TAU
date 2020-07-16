/* global QUnit, define, tau */
(function () {
	"use strict";
	function runTests(DatePicker, helpers) {

		function initHTML() {
			return new Promise(function (resolve) {
				var HTML = helpers.loadHTMLFromFile("/base/tests/js/profile/wearable/widget/wearable/DatePicker/test-data/sample.html"),
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

		QUnit.module("profile/wearable/widget/wearable/DatePicker", {
			setup: initHTML,
			teardown: clearHTML
		});

		QUnit.test("_init", function (assert) {
			var widget = new DatePicker();

			widget._setValue = function (date) {
				assert.ok(date instanceof Date, "_setValue is called with Date instance");
			};

			widget._setActiveSelector = function (type) {
				assert.equal(type, "month", "_setActiveSelector is called with month");
			};
			widget._init();
		});

		QUnit.test("_build", 6, function (assert) {
			var widget = new DatePicker(),
				element = document.getElementById("date-picker"),
				result;

			helpers.stub(widget, "_buildNumberPicker", function () {
				assert.ok(true, "_buildNumberPicker has been called");
			});

			result = widget._build(element);

			assert.equal(result, element, "method _build returns proper value");
			assert.ok(!!widget._ui.buttonSet, "buttonSet exists");
			assert.ok(!!widget._ui.dayNameContainer, "dayNameContainer exists");
			assert.ok(!!widget._ui.footer, "footer exists");
			assert.equal(widget._ui.footer, widget._ui.buttonSet.parentElement, "Footer is parent for setButton");
		});

		QUnit.test("_getValue", 4, function (assert) {
			var widget = new DatePicker(),
				result;

			helpers.stub(widget, "_buildNumberPicker", function () {
				assert.ok(true, "_buildNumberPicker has been called");
			});

			widget._value = new Date(2020, 6, 13);

			result = widget._getValue("month");
			assert.equal(result, 7, "method returns month equals 7");

			result = widget._getValue("day");
			assert.equal(result, 13, "method returns day equals 13");

			result = widget._getValue("year");
			assert.equal(result, 2020, "method returns year equals 2020");

			result = widget._getValue();
			assert.equal(result, widget._value, "by default method returns widget value");
		});

		QUnit.test("handleEvent", 8, function (assert) {
			var widget = new DatePicker(),
				event;

			helpers.stub(widget, "_onClick", function (event) {
				assert.ok(true, "_onClick has been called");
				assert.ok(!!event, "Event has been provided")
			});
			helpers.stub(widget, "_onRotary", function (event) {
				assert.ok(true, "_onRotary has been called");
				assert.ok(!!event, "Event has been provided")
			});
			helpers.stub(widget, "_onSpinChange", function (value) {
				assert.ok(true, "_onRotary has been called");
				assert.equal(value, 10, "Value has been provided")
			});

			event = {
				type: "click",
				preventDefault: function () {
					assert.ok(true, "preventDefault has been called");
				}
			};
			widget.handleEvent(event);

			event = {
				type: "rotarydetent",
				preventDefault: function () {
					assert.ok(true, "preventDefault has been called");
				}
			};
			widget.handleEvent(event);

			event = {
				type: "spinchange",
				detail: {
					value: 10
				}
			};
			widget.handleEvent(event);
		});

		QUnit.test("_changeMonth", 6, function (assert) {
			var widget = new DatePicker();

			// case 1
			helpers.stub(widget, "value", function () {
				assert.ok(true, "value has been called");
				return new Date(2020, 7, 16, 10, 10, 10);
			});
			helpers.stub(widget, "_changeValue", function (value) {
				assert.ok(true, "_changeValue has been called");
				assert.equal(value.toString(),
					(new Date(2020, 8, 16, 10, 10, 10)).toString(),
					"Month has been changed");
			});
			widget._changeMonth(1);

			// case 2
			helpers.stub(widget, "value", function () {
				assert.ok(true, "value has been called");
				return new Date(2020, 9, 31, 10, 10, 10);
			});
			helpers.stub(widget, "_changeValue", function (value) {
				assert.ok(true, "_changeValue has been called");
				assert.equal(value.toString(),
					(new Date(2020, 10, 30, 10, 10, 10)).toString(),
					"Month has been changed");
			});
			widget._changeMonth(1);
		});

		QUnit.test("_changeDay", 6, function (assert) {
			var widget = new DatePicker();

			// case 1
			helpers.stub(widget, "value", function () {
				assert.ok(true, "value has been called");
				return new Date(2020, 1, 16, 10, 10, 10);
			});
			helpers.stub(widget, "_changeValue", function (value) {
				assert.ok(true, "_changeValue has been called");
				assert.equal(value.toString(),
					(new Date(2020, 1, 17, 10, 10, 10)).toString(),
					"Day has been changed");
			});
			widget._changeDay(1);

			// case 2
			helpers.stub(widget, "value", function () {
				assert.ok(true, "value has been called");
				return new Date(2020, 2, 1, 10, 10, 10);
			});
			helpers.stub(widget, "_changeValue", function (value) {
				assert.ok(true, "_changeValue has been called");
				assert.equal(value.toString(),
					(new Date(2020, 2, 31, 10, 10, 10)).toString(),
					"Day has been changed");
			});
			widget._changeDay(-1);
		});

		QUnit.test("_onRotary: active month selector", 4, function (assert) {
			var widget = new DatePicker(),
				event;

			helpers.stub(widget, "_changeMonth", function (changeValue) {
				assert.ok(true, "_changeMonth has been called");
				assert.equal(changeValue, 1, "changeValue equals 1");
			});

			event = {
				detail: {
					direction: "CW"
				}
			};
			widget._activeSelector = "month";
			widget._onRotary(event);

			helpers.stub(widget, "_changeMonth", function (changeValue) {
				assert.ok(true, "_changeMonth has been called");
				assert.equal(changeValue, -1, "changeValue equals -1");
			});

			event = {
				detail: {
					direction: "not CW"
				}
			};
			widget._activeSelector = "month";
			widget._onRotary(event);
		});

		QUnit.test("_onRotary: active day selector", 4, function (assert) {
			var widget = new DatePicker(),
				event;

			helpers.stub(widget, "_changeDay", function (changeValue) {
				assert.ok(true, "_changeDay has been called");
				assert.equal(changeValue, 1, "changeValue equals 1");
			});

			event = {
				detail: {
					direction: "CW"
				}
			};
			widget._activeSelector = "day";
			widget._onRotary(event);

			helpers.stub(widget, "_changeDay", function (changeValue) {
				assert.ok(true, "_changeDay has been called");
				assert.equal(changeValue, -1, "changeValue equals -1");
			});

			event = {
				detail: {
					direction: "not CW"
				}
			};
			widget._activeSelector = "day";
			widget._onRotary(event);
		});

		QUnit.test("_onRotary: active year selector", 4, function (assert) {
			var widget = new DatePicker(),
				event;

			helpers.stub(widget, "_changeYear", function (changeValue) {
				assert.ok(true, "_changeYear has been called");
				assert.equal(changeValue, 1, "changeValue equals 1");
			});

			event = {
				detail: {
					direction: "CW"
				}
			};
			widget._activeSelector = "year";
			widget._onRotary(event);

			helpers.stub(widget, "_changeYear", function (changeValue) {
				assert.ok(true, "_changeYear has been called");
				assert.equal(changeValue, -1, "changeValue equals -1");
			});

			event = {
				detail: {
					direction: "not CW"
				}
			};
			widget._activeSelector = "year";
			widget._onRotary(event);
		});

		QUnit.test("_onSpinChange", 9, function (assert) {
			var widget = new DatePicker();

			helpers.stub(widget, "value", function () {
				assert.ok(true, "value has been called");
				return new Date(2020, 4, 16, 10, 10, 10);
			});
			helpers.stub(widget, "_changeMonth", function (changeValue) {
				assert.ok(true, "_changeMonth has been called");
				assert.equal(changeValue, 1, "changeValue equals 1");
			});
			helpers.stub(widget, "_changeDay", function (changeValue) {
				assert.ok(true, "_changeDay has been called");
				assert.equal(changeValue, 3, "changeValue equals 3");
			});
			helpers.stub(widget, "_changeYear", function (changeValue) {
				assert.ok(true, "_changeYear has been called");
				assert.equal(changeValue, 1, "changeValue equals 1");
			});

			widget._activeSelector = "month";
			widget._onSpinChange(6);

			widget._activeSelector = "day";
			widget._onSpinChange(19);

			widget._activeSelector = "year";
			widget._onSpinChange(2021);
		});

		QUnit.test("_destroy", 2, function (assert) {
			var widget = new DatePicker(),
				element = document.getElementById("date-picker");

			helpers.stub(widget, "_unbindEvents", function () {
				assert.ok(true, "_unbindEvents has been called");
			});

			widget.element = element;
			widget.element.innerHTML = "<div></div>";
			widget._destroy();

			assert.equal(element.innerHTML, "", "content of widget element has been cleared");
		});
	}
	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.widget.wearable.DatePicker,
			window.helpers);
	}
}());
