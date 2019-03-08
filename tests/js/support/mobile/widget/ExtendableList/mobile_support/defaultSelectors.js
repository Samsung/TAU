/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("support/profile/mobile/widget/ExtendableList", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	function isExtendableList(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'ExtendableList')), "ExtendableList was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "ExtendableList", "ExtendableList widget bound: " + selector);
	}
	test( "ExtendableList default selectors" , function () {
		isExtendableList(document.getElementById('by-data-role'), '[data-role="extendablelist"]');
		isExtendableList(document.getElementById('by-class-selector'), '.ui-extendablelist');
	});

}(window.document));