/* global test, ok, equal, define, tau */
(function () {
	"use strict";
	function runTests(Checkbox, helpers, ns) {

		ns = ns || window.ns;

		function initHTML() {
			var HTML = helpers.loadHTMLFromFile("/base/tests/js/core/widget/core/Checkbox/test-data/sample.html"),
				parent = document.getElementById("qunit-fixture") || helpers.initFixture();

			parent.innerHTML = HTML;
		}

		module("core/widget/core/Checkbox", {
			setup: initHTML
		});

		test("constructor", 3, function () {
			var element = document.getElementById("checkbox-1");

			helpers.checkWidgetBuild("Checkbox", element, ns);

			ok(element.classList.contains("ui-checkbox"), "Checkbox has ui-checkbox class");
		});

		test("_getValue", 1, function () {
			var element = document.getElementById("checkbox-1"),
				widget = new Checkbox();

			widget.element = element;
			element.value = "5";

			equal(widget._getValue(), "5", "_getValue return correct value");

		});

		test("_setValue", 1, function () {
			var element = document.getElementById("checkbox-1"),
				widget = new Checkbox();

			widget.element = element;

			widget._setValue(7);

			equal(element.value, "7", "_setValue should se correct value");

		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.widget.core.Checkbox,
			window.helpers,
			tau);
	}
}());
