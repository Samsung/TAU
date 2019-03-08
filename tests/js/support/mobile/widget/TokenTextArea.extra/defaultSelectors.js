/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("support/profile/mobile/widget/mobile/Tokentextarea", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});
	function isTokenTextarea(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'TokenTextarea')), "TokenTextarea was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "TokenTextarea", "TokenTextarea widget bound: " + selector);
	}
	test("TokenTextarea default selectors" , function () {
		isTokenTextarea(document.getElementById('by-data-role'), "[data-role='tokentextarea']");
		isTokenTextarea(document.getElementById('by-css-selector'), ".ui-tokentextarea");
	});

}(window.document));