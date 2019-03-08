/* global equal, document, tau, define, module, test, window */
(function () {
	"use strict";
	function runTests(rotaryScrolling, helpers) {
		function initHTML() {
			var parent = document.getElementById("qunit-fixture") || helpers.initFixture();

			parent.innerHTML = helpers.loadHTMLFromFile("/base/tests/js/core/util/rotaryScrolling/test-data/sample.html");
		}

		module("core/util/rotaryScrolling", {
			setup: initHTML
		});

		test("enable / disable", 3, function () {
			var content = document.querySelector(".ui-content");

			equal(content.scrollTop, 0, "On start element should have scroll top set to 0");
			rotaryScrolling.enable(content);

			helpers.triggerEvent(content, "rotarydetent", {
				direction: "CW"
			});

			equal(content.scrollTop, 40, "On start element should have scroll top set to 40");

			rotaryScrolling.disable();

			helpers.triggerEvent(content, "rotarydetent", {
				direction: "CW"
			});

			equal(content.scrollTop, 40, "On start element should have scroll top set to 40");
		});

		test("enable / disable", 3, function () {
			var content = document.querySelector(".ui-content");

			content.scrollTop = 120;

			equal(content.scrollTop, 120, "On start element should have scroll top set to 0");
			rotaryScrolling.enable(content, 60);

			helpers.triggerEvent(content, "rotarydetent", {
				direction: "CCW"
			});

			equal(content.scrollTop, 60, "On start element should have scroll top set to 40");

			rotaryScrolling.disable();

			helpers.triggerEvent(content, "rotarydetent", {
				direction: "CCW"
			});

			equal(content.scrollTop, 60, "On start element should have scroll top set to 40");
		});

		test("getScrollStep / setScrollStep", 2, function () {
			equal(rotaryScrolling.getScrollStep(), 40, "scrollStep has default value");

			rotaryScrolling.setScrollStep(100);

			equal(rotaryScrolling.getScrollStep(), 100, "scrollStep was changed to 1000");
		});

	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.util.rotaryScrolling,
			window.helpers);
	}
}());
