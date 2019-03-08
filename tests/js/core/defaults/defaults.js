/* global document, define, tau, test, window, equal */
(function () {
	"use strict";
	function runTests(defaults) {
		module("core/defaults", {});

		test("defaults", function () {
			equal(typeof defaults, "object", "defaults is object");
			equal(defaults.autoInitializePage, true, "defaults.autoInitializePage");
			equal(defaults.dynamicBaseEnabled, true, "defaults.dynamicBaseEnabled");

			defaults.autoInitializePage = false;
			equal(defaults.autoInitializePage, false, "defaults.autoInitializePage after change");
			defaults.autoInitializePage = true;

			defaults.dynamicBaseEnabled = false;
			equal(defaults.dynamicBaseEnabled, false, "defaults.dynamicBaseEnabled after change");
			defaults.dynamicBaseEnabled = true;

			equal(defaults.pageTransition, "slide", "defaults.pageTransition");
			defaults.pageTransition = "slidedown";
			equal(defaults.pageTransition, "slidedown", "defaults.pageTransition after change");
			defaults.pageTransition = "slide";

			equal(defaults.popupTransition, "slideup", "defaults.popupTransition");
			defaults.popupTransition = "slidedown";
			equal(defaults.popupTransition, "slidedown", "defaults.popupTransition after change");
			defaults.popupTransition = "slideup";
		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.defaults,
			window.helpers);
	}
}());
