/*
 * Unit Test: Extendable list
 *
 * Wongi Lee <wongi11.lee@samsung.com>
 */
/*jslint browser: true*/
/*global $, jQuery, test, equal, ok*/
$(document).ready(function () {

	module("Extendable List");
	var unit_extendablelist_test = function (widget) {

		var $elContainer = widget,
			$elElements = widget.find("li"),
			$spanElements = widget.find("span.ui-li-text-main"),
			elOptions = widget.extendablelist("option");

		widget.extendablelist();
		/* Initialize and create method */
		ok($elContainer);
		/* Options */

		/*markup check*/
		ok(widget.hasClass("ui-extendable-list-container"), "Markup check") ;

		/* Click Load more button */
		ok((function () {
			/* Click Button */
			$("#load_more_message").click();

			$elElements = $("ul#extendable_list_main li");
			$spanElements = widget.find("span.ui-li-text-main") ;

			return true;
		}()), "Click Load More button( )");

		ok((function () {
			var i = 0,
				newJSON = [],
				newItem,
				firstLI,
				result = true;

			/* make short JSON array */
			for (i = 0; i < 200; i++) {
				newJSON.push(window.JSON_DATA[ (i + 100) ]);
			}

			/* Call recreate */
			$("ul#extendable_list_main").extendablelist("recreate", newJSON);

			$elContainer = $("ul#extendable_list_main");
			$elElements = $("ul#extendable_list_main li");

			/* Check new List */
			ok($elContainer);
			equal($elElements.length, 51);	/* 50 <li> items + one button. */

			newItem = window.JSON_DATA[100];

			firstLI = $("ul#extendable_list_main li:first");

			try {
				equal(newItem.NAME, $(firstLI).find("span.ui-li-text-main").text());
			} catch (exception) {
				console.log(exception);
				return false;
			}

			return true;
		}()), "recreate( )");

		/* Destroy method */
		ok((function () {
			/* Call destroy */
			$("ul#extendable_list_main").extendablelist("destroy");

			var destoyedelElements = $("ul#extendable_list_main li");

			try {
				equal(destoyedelElements.length, 0);
			} catch (exception) {
				console.log("destroy :" + exception);
				return false;
			}
			return true;
		}()), "destroy( )");
	} ;

	/* Load Dummy Data and Init Extendable List widget*/
	if (window.JSON_DATA) {
		$("ul").filter(function () {
			return $(this).data("role") == "extendablelist";
		}).addClass("elLoadSuccess");

		// trigger pagecreate
		//$("#extendablelist-unit-test").page( );
		//$("ul#extendable_list_main").extendablelist();

		var config = {
			itemData: function (idx) {
				return JSON_DATA[idx];
			},
			numItemData: JSON_DATA.length
		}

		var z = $("ul#extendable_list_main").extendablelist();

		z.extendablelist("create", config);

		test("Extendable list test", function () {
			unit_extendablelist_test($("#extendable_list_main")) ;
		});
	} else {
		console.log("Extendable List Init Fail.");
	}
});
