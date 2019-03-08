/*global module, test, ok, equal, tau, window*/
(function (document) {
	"use strict";

	module("checkboxradio", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	function isCheckboxradio(element, selector) {
		ok(!!(tau.engine.getBinding(element, "Checkboxradio")), "Checkboxradio was created by selector: " + selector);
		ok(element.getAttribute("data-tau-bound").indexOf("Checkboxradio") > -1, "Checkboxradio widget bound: " + selector);
	}
	function isNotCheckboxradio(element, selector) {
		ok(!(tau.engine.getBinding(element, "Checkboxradio")), "Checkboxradio wasn't created by selector: " + selector);
		equal(element.getAttribute("data-tau-bound"), null, "Checkboxradio widget wasn't bound: " + selector);
	}

	test("Checkboxradio default selectors", function () {
		isCheckboxradio(document.getElementById("checkbox"), "input[type=\"checkbox\"]");
		isCheckboxradio(document.getElementById("radio"), "input[type=\"radio\"]");
		isCheckboxradio(document.getElementById("by-class-selector"), "input.ui-checkbox");

		isNotCheckboxradio(document.getElementById("div-not-checkbox"), "div.ui-checkbox");
		isNotCheckboxradio(document.getElementById("checkbox-not-slider"), "button");
	});

}(window.document));