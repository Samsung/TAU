/*
 * Unit Test : autodivider
 *
 *
 */
/*jslint browser: true, nomen: true*/
/*global document: false, ej:false, $: false, module: false, test: false, equal: false,  */

$(document).ready(function () {
	"use strict";
	module("Autodivider", {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

	function unitListdividersTest(widget) {
		var li;
		/*markup*/

		equal(widget.hasClass("ui-listview"), true, "Markup check");
		equal(widget.find(" li ").length, 24, "Markup check");
		equal(widget.find(":jqmData(role=list-divider)").length, 8, "Markup check : list dividers count");
		equal(widget.find(" li.ui-li-divider ").length, 8, "Markup check : list dividers count");

		/*adding element which fits in last divisiov*/
		li = "<li>Harry</li>";
		$(li).appendTo(widget);
		$(widget).listview("refresh");
		equal(widget.find(" li ").length, 25, "API : refresh check");

		/*adding element which need new divisiov*/
		li = "<li>Jack</li>";
		$(li).appendTo(widget);
		$(widget).listview("refresh");
		equal(widget.find(" li ").length, 27, "API : refresh check");
	};

	test("Autodivider", function () {
		// trigger pagecreate
		$("#autodivider-unit-test").page();
		/* Initialize */
		$(" #autodividersample ").listview();
		unitListdividersTest($(" #autodividersample "), {button: " call ", cancel: true});

	});

	test("autodivider- dynamic", function () {

		var createEvent = false,
			listHTMML = " <ul data-role=\"listview\"id=\"autodividersample1\"data-autodividers=\"true\"> " +
											" <li><a href=\"#\">Adam Kinkaid</a></li> " +
											" <li><a href=\"#\">Alex Wickerham</a></li> " +
											" <li><a href=\"#\">Avery Johnson</a></li> " +
											" <li><a href=\"#\">Bob Cabot</a></li> " +
											" <li><a href=\"#\">Caleb Booth</a></li> " +
											" <li><a href=\"#\">Christopher Adams</a></li> " +
											" <li><a href=\"#\">Culver James</a></li> " +
											" <li><a href=\"#\">David Walsh</a></li> " +
											" <li><a href=\"#\">Drake Alfred</a></li> " +
											" <li><a href=\"#\">Elizabeth Bacon</a></li> " +
											" <li><a href=\"#\">Emery Parker</a></li> " +
											" <li><a href=\"#\">Enid Voldon</a></li> " +
											" <li><a href=\"#\">Francis Wall</a></li> " +
											" <li><a href=\"#\">Graham Smith</a></li> " +
											" <li><a href=\"#\">Greta Peete</a></li> " +
											" <li><a href=\"#\">Harvey Walls</a></li> " +
								" </ul> ";

		// trigger pagecreate
		$("#autodivider-unit-test-dynamic").page();

		/* Initialize */
		$("#autodivider-unit-test-dynamic")
				.find(":jqmData(role=contents)")
				.append(listHTMML);
		equal($("#autodivider-unit-test-dynamic").find(" li ").length, 16, "Markup check before autodividers created");
		$(" #autodividersample1 ").listview({create: function () {
			createEvent = true;
		}});

		$("#autodivider-unit-test-dynamic")
				.find(":jqmData(role=contents)")
				.trigger(" create ");
		$(" #autodividersample1 ").listview();

		equal(createEvent, true, "Create Event");
		equal($("#autodivider-unit-test-dynamic").find(" li").length, 24, "Markup check after autodividers created");
		unitListdividersTest($(" #autodividersample1 "));

	});

});
