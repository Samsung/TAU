/* global QUnit, define, tau, equal */
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

		QUnit.test("default value of number picker", function () {
			var element = document.getElementById("number-picker"),
				numberPicker = new NumberPicker(),
				inputFieldValue = 4;

			numberPicker.element = element;

			equal(numberPicker.value(), inputFieldValue,
				"Initial value of the NumberPicker widget is same as in the input filed in HTML it's based on");
		});

		QUnit.test("default options", function () {
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
				equal(widgetOptions[property], defaultOptions[property], property + " property does not have default value");
			});
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
