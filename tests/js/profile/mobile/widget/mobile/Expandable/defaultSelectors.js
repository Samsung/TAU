/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("profile/mobile/widget/mobile/Expandable", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	function isExpandable(element, selector) {
		equal(element.getAttribute('data-tau-bound'), "Expandable", "Expandable widget bound: " + selector);
	}

	test( "Expandable default selectors" , function () {
		isExpandable(document.getElementById('data-role'), '[data-role="expandable"]');
		isExpandable(document.getElementById('from-class'), '.ui-expandable');
	});

}(window.document));