/*
 * collapse unit tests
 */
(function (window, document) {
	"use strict";

	module("support/mobile/widget/Collapsible", {
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	test("simple collapsible markup test", function () {
		var collapsibleEl = document.getElementById("collapsible"),
			collapsibleWidget = tau.widget.Collapsible(collapsibleEl),
			collapsibleHeading = collapsibleEl.querySelector(".ui-expandable-heading"),
			collapsibleContent = collapsibleEl.querySelector(".ui-expandable-content"),
			collapsibleHeadingToggle = collapsibleHeading.querySelector("a");

		equal(collapsibleHeading.tagName, 'H2', 'collapsible created heading element through expandable widget');
		equal(collapsibleContent.tagName, 'DIV', 'collapsible created content element through expandable widget');

		equal(collapsibleWidget.option("collapsed"), true, 'Default collapsible style is true');
		equal(collapsibleWidget.option("heading"), 'h1,h2,h3,h4,h5,h6,legend,li', 'Default collapsible heading options');
		equal(collapsibleHeadingToggle.className, 'ui-expandable-heading-toggle', 'Collapsible Heading element has toggle child');

		collapsibleWidget.destroy();
	});
}(window, window.document));
