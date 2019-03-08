/*
 * Unit Test : tokentextarea
 *
 * Kangsik Kim <kangsik81.kim@samsung.com>
 * Minkyeong Kim <minkyeong.kim@samsung.com>
 */
/*jslint browser: true*/
/*global $, jQuery, test, equal, ok*/
(function ($) {
	module("Tokentextarea");

	var unit_tokentextarea = function (widget, type, options) {
		var tokentextarea,
			inputText,
			outputText,
			status,
			selectEvent = false,
			addEvent = false,
			removeEvent = false;

		/* Create */
		tokentextarea = widget.tokentextarea();
		ok(tokentextarea.length > 0, "Create");

		/*markup*/
		equal(widget.jqmData("label"), options.lable, "Property : data-label") ;
		equal(widget.find("span.ui-tokentextarea-label").html(), options.lable, "Property : data-label") ;
		equal(widget.jqmData("description"), options.description, "Property : data-description") ;
		equal(widget.jqmData("link"), options.link, "Property : data-link") ;
		equal(widget.find("input").hasClass("ui-tokentextarea-input"), true, "Markup Check");
		equal(widget.find("span").hasClass("ui-tokentextarea-label"), true, "Markup Check");
		equal(widget.find("a").hasClass("ui-tokentextarea-link-base"), true, "Markup Check");
		equal(widget.find("a").attr("href"), "#address", "Markup Check");

		/*bind events*/
		tokentextarea.bind("select", function () {
			selectEvent = true ;
		}) ;
		tokentextarea.bind("add", function () {
			addEvent = true ;
		}) ;
		tokentextarea.bind("remove", function () {
			removeEvent = true ;
		}) ;

		/* length */
		equal(tokentextarea.tokentextarea("length"), 0, "API : length");

		/* Add */
		tokentextarea.tokentextarea("add", "string1");
		equal(tokentextarea.tokentextarea("length"), 1, "API : add('string1')");
		tokentextarea.tokentextarea("add", "string2");
		equal(tokentextarea.tokentextarea("length"), 2, "API : add('string2')");
		tokentextarea.tokentextarea("add", "string3");
		equal(tokentextarea.tokentextarea("length"), 3, "API : add('string3')");
		equal(widget.find(".ui-tokentextarea-block").length, 3, "API : count number of elements after add") ;


		/* Select */
		tokentextarea.tokentextarea("select", 1);
		outputText = tokentextarea.tokentextarea("select");
		equal(outputText, "string2", "API : select( 1 )");

		/* Focus Out */
		tokentextarea.tokentextarea("focusOut");
		status = tokentextarea.hasClass("ui-tokentextarea-focusout");
		equal(status, true, "API : focusOut");

		/* Focus In */
		tokentextarea.tokentextarea("focusIn");
		status = tokentextarea.hasClass("ui-tokentextarea-focusin");
		equal(status, true, "API : focusIn");

		/* input */
		inputText = "tokentextarea";
		tokentextarea.tokentextarea("inputText", inputText);
		outputText = tokentextarea.tokentextarea("inputText");
		equal(outputText, inputText, "API : input('" + outputText + "')");

		// @TODO Added to test beacuse asyncTest does not remove references. This must be chceck in future.
		tokentextarea.tokentextarea("remove");
	};

	test("Tokentextarea", function () {
		unit_tokentextarea($("#tokentextarea-test"), "tokentextarea", { lable: "To:", description: "description123", link: "#address" });
	});

}(jQuery));
