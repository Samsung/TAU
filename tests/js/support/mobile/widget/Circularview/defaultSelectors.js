/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("support/mobile/widget/Circularview", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	function isCircularview(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'Circularview')), "Circularview was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "Circularview", "Circularview widget bound: " + selector);
	}
	test( "Circularview default selectors" , function () {
		isCircularview(document.getElementById('by-data-role'), '[data-role="circularview"]');
		isCircularview(document.getElementById('by-class-selector'), '.ui-circularview');
	});

}(window.document));