/*global module, test, asyncTest, ok, equal, tau, window */
(function(document) {
	"use strict";

	module("profile/mobile/widget/mobile/GridView", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});
	function isGridView(element, selector) {
		ok(!!(tau.engine.getBinding(element, 'GridView')), "GridView was created by selector: " + selector);
		equal(element.getAttribute('data-tau-bound'), "GridView", "GridView widget bound: " + selector);
	}
	function isNotGridView(element, selector) {
		ok(!(tau.engine.getBinding(element, 'GridView')), "GridView wasn't created by selector: " + selector);
		notEqual(element.getAttribute('data-tau-bound'), "GridView", "GridView widget wasn't bound: " + selector);
	}
	test("GridView default selectors" , function () {
		isGridView(document.getElementById('gridview'), "ul.ui-gridview");
		isGridView(document.getElementById('gridview2'), "ul[data-role='gridview']");
		isNotGridView(document.getElementById('olgridview'), "ol.ui-gridview");
		isNotGridView(document.getElementById('olgridview2'), "ol[data-role='gridview']");
	});
}(window.document));