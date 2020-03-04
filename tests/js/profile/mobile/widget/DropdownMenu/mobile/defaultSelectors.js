/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("profile/mobile/widget/mobile/DropdownMenu", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});
	function isDropdownMenu(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'DropdownMenu')), "DropdownMenu was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "DropdownMenu", "DropdownMenu widget bound: " + selector);
	}
	function isNotDropdownMenu(element, selector) {
		ok(!(tau.engine.getBinding(element, 'DropdownMenu')), "DropdownMenu wasn't created by selector: " + selector);
		notEqual(element.getAttribute('data-tau-bound'), "DropdownMenu", "DropdownMenu widget wasn't bound: " + selector);
	}
	test("DropdownMenu default selectors" , function () {
		isDropdownMenu(document.getElementById('select'), "select:not([data-role='slider']):not([data-role='range'])");
		isNotDropdownMenu(document.getElementById('select-slider'), "select:not([data-role='slider']):not([data-role='range'])");
		isNotDropdownMenu(document.getElementById('select-range'), "select:not([data-role='slider']):not([data-role='range'])");
		isDropdownMenu(document.getElementById('by-css-selector'), "select.ui-select-menu");
		isNotDropdownMenu(document.getElementById('element-by-css-selector'), "*.ui-select-menu:not([data-role='slider']):not([data-role='range'])");
	});
}(window.document));