/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("support/mobile/widget/Dialog", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	function isDialog(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'Dialog')), "Dialog was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "Dialog", "Dialog widget bound: " + selector);
	}
	test( "Dialog default selectors" , function () {
		isDialog(document.getElementById('by-data-role'), '[data-role="dialog"]');
		isDialog(document.getElementById('by-class-selector'), '.ui-dialog');
	});

}(window.document));