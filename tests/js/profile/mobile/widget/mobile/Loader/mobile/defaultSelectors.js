/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("profile/mobile/widget/mobile/Loader", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	function isLoader(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'Loader')), "Loader was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "Loader", "Loader widget bound: " + selector);
	}
	test( "Loader default selectors" , function () {
		isLoader(document.getElementById('by-data-role'), '[data-role="loader"]');
		isLoader(document.getElementById('by-class-selector'), '.ui-loader');
	});

}(window.document));