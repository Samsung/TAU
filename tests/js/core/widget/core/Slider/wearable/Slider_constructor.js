/* global test, ok, equal, define, tau */
(function () {
	"use strict";
	function runTests(Slider, helpers, ns) {

		ns = ns || window.ns;

		module("core/widget/core/Slider", {});

		test("constructor", 3, function () {
			var element = document.getElementById("normal");

			helpers.checkWidgetBuild("Slider", element, ns);

			ok(element.parentElement.classList.contains("ui-progressbar"), "Slider has ui-progressbar class");
		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.widget.core.Slider,
			window.helpers,
			tau);
	}

}());
