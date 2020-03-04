/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("profile/mobile/widget/mobile/Button", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	function isButton(element, selector, valid) {
		var binding = tau.engine.getBinding(element, "Button"),
			attr = tau.util.DOM.getNSData(element, "tau-bound");
		if (valid) {
			ok(binding, "Button was created by selector: " + selector);
			equal(binding.element, element, "Proper element bound: " + selector);
			notEqual(attr.indexOf("Button"), -1, "Button widget bound: " + selector);
		} else {
			equal(binding, null, "Button was created by selector: " + selector);
			equal(!!((attr && attr.indexOf("Button") > -1) || attr ), false, "Button widget bound: " + selector);
		}
	}

	test( "Button default selectors" , function () {
		isButton(document.getElementById('button-data-role'), '[data-role="button"]', true);
		isButton(document.getElementById('button-button'), 'button', true);
		isButton(document.getElementById('button-type-button'), '[type="button"]', true);
		isButton(document.getElementById('button-type-submit'), '[type="submit"]', false);
		isButton(document.getElementById('button-type-reset'), '[type="reset"]', false);
		isButton(document.getElementById('button-class-selector'), '.ui-btn', true);
		isButton(document.getElementById('link-button'), '.ui-btn', true);
	});

}(window.document));
