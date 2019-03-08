/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("profile/mobile/widget/mobile/Popup", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	function isPopup(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'Popup')), "Popup was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "Popup", "Popup widget bound: " + selector);
	}
	test( "Popup default selectors" , function () {
		isPopup(document.getElementById('by-data-role'), '[data-role="popup"]');
		isPopup(document.getElementById('by-class-selector'), '.ui-popup');
	});

}(window.document));