/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("profile/mobile/widget/mobile/Drawer", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	function isDrawer(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'Drawer')), "Drawer was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "Drawer", "Drawer widget bound: " + selector);
	}
	test( "Drawer default selectors" , function () {
		isDrawer(document.getElementById('by-data-role'), '[data-role="drawer"]');
		isDrawer(document.getElementById('by-class-selector'), '.ui-drawer');
	});

}(window.document));