/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("profile/mobile/widget/mobile/Listview", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	function isListview(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'Listview')), "Listview was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "Listview", "Listview widget bound: " + selector);
	}
	test( "Listview default selectors" , function () {
		isListview(document.getElementById('ul-by-data-role'), '[data-role="listview"]');
		isListview(document.getElementById('ul-by-class-selector'), '.ui-listview');
		isListview(document.getElementById('ol-by-data-role'), '[data-role="listview"]');
		isListview(document.getElementById('ol-by-class-selector'), '.ui-listview');
	});

}(window.document));