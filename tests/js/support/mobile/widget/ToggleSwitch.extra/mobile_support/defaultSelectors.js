/*global module, test, asyncTest, ok, equal, tau, window */
(function (document) {
	"use strict";

	module("profile/mobile/widget/mobile/ToggleSwitch", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});
	function isToggleSwitchExtra(element, selector) {
		ok(!!(tau.engine.getBinding(element, "ToggleSwitchExtra")), "ToggleSwitch was created by selector: " + selector);
		equal(element.getAttribute("data-tau-bound"), "ToggleSwitchExtra", "ToggleSwitch widget bound: " + selector);
	}

	test("ToggleSwitch extra selectors", function () {
		isToggleSwitchExtra(document.getElementById("select-data-role-slider"), "select[data-role='slider']");
	});

}(window.document));