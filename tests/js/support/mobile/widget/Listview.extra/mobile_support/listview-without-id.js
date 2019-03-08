/*jslint nomen: true */
/*global window:false, document:false,
 test:false, ok:false, equal:false, module:false, deepEqual:false, expect:false,
 $:false, console:false */
(function (document, ej) {
	"use strict";
	module("profile/mobile/widget/mobile/Listview", {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

	test("test: after refresh event", function () {
		expect(1);
		var $li3,
			list = document.querySelector("[data-role=\"listview\"]");

		$(list).on("listviewafterrefresh", function () {
			ok(true, "listviewafterrefresh event triggered");
		});
		// append new li element and refresh list;
		$li3 = $("<li id=\"li3\">added li 3</li>");
		$(list).append($li3);
		$(list).listview("refresh");
		$(list).off("listviewafterrefresh");
	});
}(document, window.ej));

