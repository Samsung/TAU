/*global window, console, test, equal, module, HTMLElement, HTMLDivElement, ok, tau */
/*jslint nomen: true */
(function (window, document) {
	"use strict";

	module("SearchInput tests", {
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	test("searchInput test", 5, function () {
		var searchEl = document.getElementById("searchinput"),
			searchinputWidget = tau.widget.SearchInput(searchEl);

		ok(searchEl.classList.contains("ui-search-input"), "<input type='search'> has ui-search-input class");
		equal(searchEl.getAttribute("placeholder"), "Search", "searchinput element has 'search' text as placeholder");
		equal(searchEl.value, "search area", "search input value");

		searchinputWidget.disable();
		ok(searchEl.classList.contains("ui-state-disabled"), "SearchInput disabled");
		searchinputWidget.enable();
		ok(!searchEl.classList.contains("ui-state-disabled"), "SearchInput enabled");

		searchinputWidget.destroy();
	});
}(window, window.document));
