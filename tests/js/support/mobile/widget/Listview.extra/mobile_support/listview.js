/*jslint nomen: true */
/*global window:false, start, asyncTest,
 test:false, ok:false, equal:false, module:false, deepEqual:false, expect:false,
 listviewItemTests: false, dividerTests:false, dividerBuildTests:false,
 $:false, console:false, tau */
$().ready(function () {
	"use strict";

	module("profile/mobile/widget/mobile/Listview", {
		setup: function () {
			tau.engine.run();
		},
		teardown: function () {
			tau.engine._clearBindings();
		}
	});

	test("Default listview", function () {
		var list = document.querySelector("#listview1"),
			divider;

		// Open page
		tau.engine.getRouter().open(document.getElementById("page1"));

		equal(list.getAttribute("data-tau-bound"), "Listview", "List widget is created");
		ok(list.classList.contains("ui-listview"), "List has ui-listview class");

		//test normal items
		listviewItemTests(document.getElementById("li1"));
		//test second normal items
		listviewItemTests(document.getElementById("li2"));
		//list divider;
		divider = document.getElementById("li_divider");
		dividerTests(divider);
		dividerBuildTests(divider);
	});

	test("List divider constructor", function () {
		// listDivider widget, build test
		var li = document.getElementById("li_divider");

		// Open page
		tau.engine.getRouter().open(document.getElementById("page1"));

		$(li).listdivider();
		dividerBuildTests(li);
	});

	asyncTest("Append new items to listview", function () {
		var li3,
			li4,
			divider,
			$li3,
			$li4,
			$divider,
			page2 = document.getElementById("page2"),
			list = document.querySelector("#listview2"),
			ref = document.getElementById("ref2"),
			eventsCalled = {},
			returnValue;

		$(document).on("listviewbeforecreate listviewcreate", function (e) {
			eventsCalled[e.type] = true;
		});

		page2.addEventListener("pageshow", function () {
			// append new li element and refresh list;
			$li3 = $("<li id=\"li3\">added li 3</li>");
			$li4 = $("<li id=\"li4\">added li 4</li>");
			$(list).append($li3);
			$(list).append($li4);
			$(list).listview();
			$(list).listview("refresh");
			li3 = $li3.get(0);
			li4 = $li4.get(0);
			listviewItemTests(li3);
			listviewItemTests(li4);
			ok(eventsCalled.listviewbeforecreate, "listviewbeforecreate called");
			ok(eventsCalled.listviewcreate, "listviewcreate called");
			$(document).off("listviewbeforecreate listviewcreate");

			// append new divider li element and refresh list;
			$divider = $("<li id=\"li_divider2\" data-role=\"list-divider\"><span id=\"ref2\">Divider</span></li>");
			$(list).append($divider);
			returnValue = $(list).listview("refresh");
			deepEqual($(list), returnValue, "compare object listview and return value of method refresh on listview");
			$(list).trigger("create");

			ok(true, "After refresh, check newly added divider");
			divider = $divider.get(0);
			dividerTests(divider);
			dividerBuildTests(divider);

			equal(document.getElementById("ref2"), ref, "Earlier created reference not lost");
			start();
		});

		// Open page
		tau.engine.getRouter().open(page2);
	});

	test("Listview after refresh, test of event", function () {
		var $li3,
			list = document.querySelector("#listview1");

		expect(1);

		// Open page
		tau.engine.getRouter().open(document.getElementById("page1"));

		$(list).listview();
		$(list).on("listviewafterrefresh", function () {
			ok(true, "listviewafterrefresh event triggered");
		});
		// append new li element and refresh list;
		$li3 = $("<li id=\"li3\">added li 3</li>");
		$(list).append($li3);
		$(list).listview("refresh");
	});
});
