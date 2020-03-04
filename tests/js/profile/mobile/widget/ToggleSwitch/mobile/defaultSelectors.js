/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("profile/mobile/widget/mobile/ToggleSwitch", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});
	function isToggleSwitch(element, selector) {
		ok(!!(tau.engine.getBinding(element, "ToggleSwitch")), "ToggleSwitch was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "ToggleSwitch", "ToggleSwitch widget bound: " + selector);
	}
	test("ToggleSwitch default selectors" , function () {
		isToggleSwitch(document.getElementById('select-data-role-toggleswitch'), "select[data-role='toggleswitch']");
		isToggleSwitch(document.getElementById('input-data-role-toggleswitch'), "input[type='checkbox'][data-role='toggleswitch']");
		isToggleSwitch(document.getElementById('by-class-selector'), "select.ui-toggleswitch");
		isToggleSwitch(document.getElementById('input-class-toggleswitch'), "input.ui-toggleswitch");
	});

}(window.document));