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

			if (tau.support.shape.circle) {
				equal(defaults.pageTransition, "pop", "defaults.pageTransition");
				defaults.pageTransition = "slideup";
				equal(defaults.pageTransition, "slideup", "defaults.pageTransition after change");
				defaults.pageTransition = "pop";

				equal(defaults.popupTransition, "pop", "defaults.popupTransition");
				defaults.popupTransition = "slideup";
				equal(defaults.popupTransition, "slideup", "defaults.popupTransition after change");
				defaults.popupTransition = "pop";
			} else {
				equal(defaults.pageTransition, "none", "defaults.pageTransition");
				defaults.pageTransition = "slideup";
				equal(defaults.pageTransition, "slideup", "defaults.pageTransition after change");
				defaults.pageTransition = "none";

				equal(defaults.popupTransition, "slideup", "defaults.popupTransition");
				defaults.popupTransition = "pop";
				equal(defaults.popupTransition, "pop", "defaults.popupTransition after change");
				defaults.popupTransition = "slideup";
			}
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
