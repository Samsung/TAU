/*global window, console, test, equal, module, ej, asyncTest, start, HTMLElement, HTMLDivElement */
/*jslint nomen: true */
(function (window, document) {
	"use strict";

	module("support/mobile/widget/ListDivider", {
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	test( "ListDivider with options style", function () {
		var listdivider1 = document.getElementById("divider1"),
			listdividerW = tau.widget.ListDivider(listdivider1),
			listdivider1Text = listdivider1.querySelector(".ui-divider-text");

		equal(listdividerW.options.style, "check", "listdivider has check style for options");
		equal(listdivider1Text.tagName, "SPAN", "listdivider has 'ui-divider-text' element");

		listdividerW.destroy();
	});

	test( "ListDivider with options folded", function() {
		var listdivider2 = document.getElementById("divider2"),
			listdividerW2 = tau.widget.ListDivider(listdivider2),
			listdivider2Text = listdivider2.querySelector("A");

		equal(listdividerW2.options.folded, true, "listdivider has folded option");
		ok(listdivider2Text, "listdivider has A tag child element");

		listdividerW2.destroy();
	});

	test( "ListDivider with options line", function() {
		var listdivider3 = document.getElementById("divider3"),
			listdividerW3 = tau.widget.ListDivider(listdivider3),
			listdivider3Text = listdivider3.querySelector(".ui-divider-normal-line");

		equal(listdividerW3.options.line, true, "listdivider has line option");
		equal(listdivider3Text.tagName, "SPAN", "listdivider has 'ui-divider-normal-line' element");
		listdividerW3.destroy();
	});
}(window, window.document));
