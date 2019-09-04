/* global test, equal, define, tau */
(function () {
	"use strict";
	function runTests(Radio, helpers) {

		function initHTML() {
			var HTML,
				parent = document.getElementById("qunit-fixture") || helpers.initFixture();

			if (parent.innerHTML === "") {
				HTML = helpers.loadHTMLFromFile("/base/tests/js/core/widget/core/Checkbox/test-data/sample.html");
				parent.innerHTML = HTML;
			}
		}

		module("core/widget/core/Radio", {
			setup: initHTML
		});

		test("API of Radio Widget", function () {
			var widget;

			equal(typeof tau, "object", "Class tau exists");
			equal(typeof tau.widget, "object", "Class tau.widget exists");
			equal(typeof tau.widget.core, "object", "Class tau.widget exists");
			equal(typeof tau.widget.core.Radio, "function", "Class tau.widget.core.Radio exists");

			widget = new tau.widget.core.Radio(document.getElementById("radio-choice-1"));

			equal(typeof widget._build, "function", "Method Radio._build exists");
			equal(typeof widget._getValue, "function", "Method Radio.getValue exists");
			equal(typeof widget._setValue, "function", "Method Radio._setValue exists");
		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.widget.core.Radio,
			window.helpers);
	}
}());
