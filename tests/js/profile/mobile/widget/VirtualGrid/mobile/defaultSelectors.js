/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("profile/mobile/widget/mobile/VirtualGrid", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});
	function isVirtualGrid(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'VirtualGrid')), "VirtualGrid was created by selector: " + selector);
		ok(/([\s,]+|^)VirtualGrid([\s,]+|$)?/.test(element.getAttribute('data-tau-bound')), "VirtualGrid widget bound: " + selector);
	}
	test("VirtualGrid default selectors" , function () {
		isVirtualGrid(document.getElementById('by-data-role'), "[data-role='virtualgrid']");
		isVirtualGrid(document.getElementById('by-css-selector'), ".ui-virtualgrid");
	});

}(window.document));