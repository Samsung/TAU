/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("support/mobile/widget/Notification", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	function isNotification(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'Notification')), "Notification was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "Notification", "Notification widget bound: " + selector);
	}
	test( "Notification default selectors" , function () {
		isNotification(document.getElementById('by-data-role'), '[data-role="notification"]');
		isNotification(document.getElementById('by-class-selector'), '.ui-notification');
	});

}(window.document));