/* global QUnit, define, tau, expect */
(function () {
	"use strict";
	function runTests(CircleIndicator, helpers) {

		function initHTML() {
			return new Promise(function (resolve) {
				var HTML = helpers.loadHTMLFromFile("/base/tests/js/profile/wearable/widget/wearable/CircleIndicator/test-data/sample.html"),
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

		QUnit.module("profile/wearable/widget/wearable/CircleIndicator", {
			setup: initHTML,
			teardown: clearHTML
		});

		QUnit.test("_refresh", function (assert) {
			var element = document.getElementById("circle-indicator"),
				circleIndicator = new CircleIndicator();

			expect(3);

			circleIndicator.element = element;
			circleIndicator._ui.pointer = document.getElementById("circle-pointer");
			circleIndicator._removeTicksCircle = function () {
				assert.ok(true, "called _removeTicksCircle");
			};
			circleIndicator._prepareTicksCircle = function (_element) {
				assert.equal(_element, element, "called _prepareTicksCircle with element");
			};
			circleIndicator._refresh();

			assert.equal(circleIndicator._ui.pointer.nextElementChild, null, "Pointer is last element");
		});

		QUnit.test("_destroy", function (assert) {
			var circleIndicator = new CircleIndicator();

			expect(1);

			circleIndicator._removeItems = function () {
				assert.ok(true, "called _removeItems");
			};
			circleIndicator._destroy();
		});

	}
	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.widget.wearable.CircleIndicator,
			window.helpers,
			tau);
	}
}());
