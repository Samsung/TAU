/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("profile/mobile/widget/mobile/Scrollview", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	function isScrollview(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'Scrollview')), "Scrollview was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "Scrollview", "Scrollview widget bound: " + selector);
	}
	test( "Scrollview default selectors" , function () {
		isScrollview(document.getElementById('by-data-role'), '[data-role="content"]');
		isScrollview(document.getElementById('by-class-selector'), '.ui-scrollview');
	});

}(window.document));