/*
 * Unit Test: list
 *
 *
 */
/*jslint browser: true*/
/*global $, jQuery, test, equal, ok*/
$(document).ready(function () {
	"use strict";

	module("List", {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

	var unit_list_test = function (widget) {
		var li ;

		/*markup*/
		equal(widget.hasClass("ui-listview"), true, "Markup check") ;
		equal(widget.find("li.ui-li-multiline").length, 1, "Markup check: multiline text") ;
		equal(widget.find("li.ui-li-multiline span.ui-li-text-sub").length, 1, "Markup check: multiline text") ;
	} ;

	test("List", function () {
		// trigger pagecreate
		$.mobile.changePage("#list-unit-test");
		/* Initialize */
		$("#listsample").listview();
		unit_list_test($("#listsample")) ;

	});

	test("List- dynamic", function () {

		var createEvent = false,
			listHTMML = "<ul id= \"listsample1\"data-role= \"listview\"data-fastscroll= \"true\">" +
									"<li>Anton</li>" +
									"<li class= \"ui-li-multiline\"> Arabella <span class= \"ui-li-text-sub\">Subtext</span></li>" +
									"<li>Art<a href= \"#dummy-page\">1line-sub with anchor<span class= \"ui-li-text-sub\">Subtext</span></a> </li>" +
									"<li>Barry<img src= \"thumbnail.jpg\"class= \"ui-li-bigicon\"/>1line-bigicon1</li></li>" +
									"<li>Bibi</li>" +
									"<li>Billy</li>" +
									"<li>Bob</li>" +
								"</ul>";

		// trigger pagecreate
		$.mobile.changePage("#list-unit-test-dynamic");
		/* Initialize */
		$("#list-unit-test-dynamic").find(":jqmData(role=content)").append(listHTMML) ;
		$("#listsample1").listview({create: function () {
			createEvent = true ;
		}});

		$("#list-unit-test-dynamic").find(":jqmData(role=content)").trigger("create") ;
		$("#listsample1").listview() ;

		equal(createEvent, true, "Create Event") ;
		unit_list_test($("#listsample1")) ;

	});

});
