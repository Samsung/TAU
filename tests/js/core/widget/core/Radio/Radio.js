/* global test, ok, equal, define, tau */
(function () {
	"use strict";
	function runTests(Radio, helpers, ns) {

		// differences between phantom nad karma
		ns = ns || window.ns;

		function initHTML() {
			var HTML = helpers.loadHTMLFromFile("/base/tests/js/core/widget/core/Radio/test-data/sample.html"),
				parent = document.getElementById("qunit-fixture") || helpers.initFixture();

			parent.innerHTML = HTML;
		}

		module("core/widget/core/Radio", {
			setup: initHTML
		});

		test("constructor", 3, function () {
			var element = document.getElementById("radio-choice-1");

			helpers.checkWidgetBuild("Radio", element, ns);

			ok(element.classList.contains("ui-radio"), "Radio has ui-radio class");
		});

		test("_getValue", 1, function () {
			var element = document.getElementById("radio-choice-1"),
				widget = new Radio();

			widget.element = element;
			element.value = "5";

			equal(widget._getValue(), "5", "_getValue return correct value");

		});

		test("_setValue", 1, function () {
			var element = document.getElementById("radio-choice-1"),
				widget = new Radio();

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
		runTests(tau.widget.core.Radio,
			window.helpers,
			tau);
	}
}());
