/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("profile/mobile/widget/mobile/TextInput", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});
	function isTextInput(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'TextInput')), "TextInput was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "TextInput", "TextInput widget bound: " + selector);
	}
	test("TextInput default selectors" , function () {
		isTextInput(document.getElementById('input-text'), "input[type='text']");
		isTextInput(document.getElementById('input-number'), "input[type='number']");
		isTextInput(document.getElementById('input-password'), "input[type='password']");
		isTextInput(document.getElementById('input-email'), "input[type='email']");
		isTextInput(document.getElementById('input-url'), "input[type='url']");
		isTextInput(document.getElementById('input-tel'), "input[type='tel']");
		isTextInput(document.getElementById('input-not-type'), "input:not([type]).ui-text-input");
		isTextInput(document.getElementById('textarea'), "textarea");
	});

}(window.document));