/*global module, test, ok, equal, tau, window */
(function (document) {
	"use strict";

	module("scrollhandler", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	function isScrollHandler(element, selector) {
		ok(!!(tau.engine.getBinding(element, "ScrollHandler")), "ScrollHandler was created by selector: " + selector);
		equal(element.getAttribute("data-tau-bound"), "ScrollHandler", "ScrollHandler widget bound: " + selector);
	}
	test("ScrollHandler default selectors", function () {
		isScrollHandler(document.getElementById("by-class-selector"), ".ui-scrollhandler");
	});

}(window.document));