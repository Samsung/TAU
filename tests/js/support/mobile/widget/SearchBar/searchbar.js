/*global window, console, test, equal, module, ej, asyncTest, start, HTMLElement, HTMLDivElement */
/*jslint nomen: true */
(function (window, document) {
	"use strict";

	module("support/mobile/widget/SearchBar", {
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	test( "Searchbar", function () {
		/* Initialize */
		var searchBar = document.getElementById("test"),
			searchBarWidget = tau.widget.SearchBar(searchBar),
			inputSearchBar,
			searchBarCancelButton;

		inputSearchBar = document.querySelectorAll(".input-search-bar")[0];
		searchBarCancelButton = inputSearchBar.querySelectorAll(".ui-input-cancel")[0];

		equal(searchBarCancelButton.getAttribute("title"), "Clear text", "cancel button");
		equal(tau.util.DOM.getNSData(searchBarCancelButton, "role"), "button", "cancel button");

		equal(searchBarWidget.option("cancelBtn"), true, "option for cancelBtn be true");
		equal(searchBarWidget.option("clearBtn"), true, "options for clearBtn default is true");
		equal(searchBarWidget.option("icon"), "call", "option for icon be call");

		ok(document.querySelectorAll(".ui-search-bar-icon")[0], "searchBarIcon has been created");

		searchBarWidget.disable();
		ok(searchBar.classList.contains('ui-disabled'), 'has class ui-disabled');
		searchBarWidget.enable();
		ok(!searchBar.classList.contains('ui-disabled'), 'searchbar has been enabled and removed ui-disabled');
	});
}(window, window.document));
