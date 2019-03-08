/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("support/mobile/widget/Swipe", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});
	function isSwipe(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'Swipe')), "Swipe was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "Swipe", "Swipe widget bound: " + selector);
	}
	test("Swipe default selectors" , function () {
		isSwipe(document.getElementById('by-data-role'), "[data-role='swipe']");
		isSwipe(document.getElementById('by-class-selector'), ".ui-swipe");
	});

}(window.document));