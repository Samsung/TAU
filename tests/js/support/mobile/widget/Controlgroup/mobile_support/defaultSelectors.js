/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("support/mobile/widget/Controlgroup", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	function isControlgroup(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'Controlgroup')), "Controlgroup was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "Controlgroup", "Controlgroup widget bound: " + selector);
	}
	test( "Controlgroup default selectors" , function () {
		isControlgroup(document.getElementById('by-data-role'), '[data-role="controlgroup"]');
		isControlgroup(document.getElementById('by-class-selector'), '.ui-controlgroup');
	});

}(window.document));