/* global QUnit, ns, define, tau, engine */
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
			var datepicker = new DatePicker();

			datepicker._setValue = function (date) {
				assert.ok(date instanceof Date, "_setValue is called with Date instance");
			};

			datepicker._setActiveSelector = function (type) {
				assert.equal(type, "month", "_setActiveSelector is called with month");
			};
			datepicker._init();
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
