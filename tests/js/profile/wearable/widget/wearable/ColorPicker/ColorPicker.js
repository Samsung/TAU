/* global QUnit, ns, define, tau, engine */
(function () {
	"use strict";
	function runTests(ColorPicker, helpers, ns, engine) {

		ns = ns || window.ns;

		function initHTML() {
			return new Promise(function (resolve) {
				var HTML = helpers.loadHTMLFromFile("/base/tests/js/profile/wearable/widget/wearable/ColorPicker/test-data/sample.html"),
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

		QUnit.module("profile/wearable/widget/wearable/ColorPicker", {
			setup: initHTML,
			teardown: clearHTML
		});

		QUnit.test("_build", function (assert) {
			var element = document.getElementById("colorpicker"),
				colorpicker;

			colorpicker = new ColorPicker();
			colorpicker._build(element);

			assert.ok(element.classList.contains("ui-colorpicker"), "Colorpicker has ui-colorpicker class.");
			assert.ok(element.classList.contains("ui-selector"), "Colorpicker has ui-selector class.");
		});

		QUnit.test("_setActiveItem", function (assert) {
			var element = document.getElementById("colorpicker"),
				colorpicker;

			colorpicker = new ColorPicker();
			colorpicker._configure();
			colorpicker.element = element;
			colorpicker._build(element);

			colorpicker._setActiveItem(2);

			assert.equal(colorpicker._activeItemIndex, 2, "Colorpicker has active index 2.");
		});

		QUnit.test("_destroy", function (assert) {
			var element = document.getElementById("colorpicker"),
				colorpicker;

			colorpicker = new ColorPicker();
			colorpicker._configure();
			colorpicker.element = element;
			colorpicker._build(element);
			colorpicker._destroy();

			assert.equal(element.childElementCount, 0, "ColorPicker is empty.");
		});

	}
	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.widget.wearable.ColorPicker,
			window.helpers,
			tau,
			tau.engine);
	}
}());
