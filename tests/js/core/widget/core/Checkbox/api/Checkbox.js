/* global test, equal, define, tau */
(function () {
	"use strict";
	function runTests(Checkbox, helpers) {

		function initHTML() {
			var HTML = helpers.loadHTMLFromFile("/base/tests/js/core/widget/core/Checkbox/test-data/sample.html"),
				parent = document.getElementById("qunit-fixture") || helpers.initFixture();

			parent.innerHTML = HTML;
		}

		module("core/widget/core/Checkbox", {
			setup: initHTML
		});

		test("API of Checkbox Widget", function () {
			var widget;

			equal(typeof tau, "object", "Class tau exists");
			equal(typeof tau.widget, "object", "Class tau.widget exists");
			equal(typeof tau.widget.core, "object", "Class tau.widget exists");
			equal(typeof tau.widget.core.Checkbox, "function", "Class tau.widget.core.Checkbox exists");

			widget = new tau.widget.core.Checkbox(document.getElementById("checkbox-1"));

			equal(typeof widget._build, "function", "Method Checkbox._build exists");
			equal(typeof widget._getValue, "function", "Method Checkbox.getValue exists");
			equal(typeof widget._setValue, "function", "Method Checkbox._setValue exists");
		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.widget.core.Checkbox,
			window.helpers);
	}
}());
