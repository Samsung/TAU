/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("profile/mobile/widget/mobile/VirtualListview", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});
	function isVirtualListview(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'VirtualListview')), "VirtualListview was created by selector: " + selector);
		ok(/([\s,]+|^)VirtualListview([\s,]+|$)?/.test(element.getAttribute('data-tau-bound')), "VirtualListview widget bound: " + selector);
	}
	test("VirtualListview default selectors" , function () {
		isVirtualListview(document.getElementById('by-data-role'), "[data-role='virtuallistview']");
		isVirtualListview(document.getElementById('by-data-role-virtuallist'), "[data-role='virtuallist']");
		isVirtualListview(document.getElementById('by-css-selector'), ".ui-virtuallistview");
	});

}(window.document));