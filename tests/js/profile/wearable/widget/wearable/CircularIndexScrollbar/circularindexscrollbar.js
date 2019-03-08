(function (window, document) {
	"use strict";

	module("profile/wearable/widget/wearable/CircularIndexScrollbar");

	test("circularindexscrollbar class check", 3, function() {
		var el = document.getElementById("widget4"),
			widget = tau.widget.CircularIndexScrollbar(el);

		ok(widget.element.classList.contains("ui-circularindexscrollbar"), "Circular Indexscrollbar has 'ui-circularindexscrollbar' class");
		ok(widget.element.children[0].classList.contains("ui-circularindexscrollbar-indicator"), "indicator has 'ui-circularindexscrollbar-indicator' class");
		ok(widget.element.children[0].children[0].classList.contains("ui-circularindexscrollbar-indicator-text"), "indicator text has 'ui-circularindexscrollbar-indicator-text' class");
		widget.destroy();
	});

	test("basic attributes test", 6, function() {
		var el1 = document.getElementById("widget1"),
			el2 = document.getElementById("widget2"),
			widget1 = tau.widget.CircularIndexScrollbar(el1),
			widget2 = tau.widget.CircularIndexScrollbar(el2);

		equal(widget1.options.index.length, 4, "Widget has new index from data-index");
		equal(widget1.options.index[0], "A", "First index is 'A'");
		equal(widget1.options.index[1], "B", "Second index is 'B'");
		equal(widget1.options.index[2], "C", "Third index is 'C'");
		equal(widget1.options.index[3], "D", "Forth index is 'D'");
		equal(widget2.options.index.length, 6, "Indices was seperated by data-delimeter");
		widget1.destroy();
		widget2.destroy();
	});

	test("change option test", 1, function() {
		var el = document.getElementById("widget3"),
			widget = tau.widget.CircularIndexScrollbar(el);

		widget.option("index", "A,B,C,D,E,F,G");
		equal(widget.options.index.length, 7, "Widget has new index from options");

		widget.destroy();
	});

	test("set/get value test", 1, function() {
		var el = document.getElementById("widget4"),
			widget = tau.widget.CircularIndexScrollbar(el);

		widget._setValue("B");
		equal(widget._getValue(), "B", "widget sets index value by setValue method");
		widget.destroy();
	});

})(window, window.document);

