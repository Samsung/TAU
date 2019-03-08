/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("support/mobile/widget/Collapsibleset", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	function isCollapsibleset(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'CollapsibleSet')), "Collapsibleset was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "CollapsibleSet", "Collapsible widget bound: " + selector);
	}
	test( "Collapsible default selectors" , function () {
		isCollapsibleset(document.getElementById('by-data-role'), '[data-role="collapsible-set"]');
		isCollapsibleset(document.getElementById('by-class-selector'), '.ui-collapsible-set');
	});

}(window.document));