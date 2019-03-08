/*jslint nomen: true */
/*global test, $, equal */
(function (document, ns) {
	"use strict";

	module("profile/mobile/widget/mobile/ListviewAutodivider", {
		teardown: function () {
			ns.engine._clearBindings();
		}
	});

	test("Listview autodividers - constructor", function () {
		var list = document.getElementById("test");

		$(list).listview({
			autodividers: true,
			autodividersSelector: function (li) {
				return $(li).find(".callDate").text() === (new Date()) ? "Today" : $(li).find(".callDate").text();
			}
		}).listview("refresh");
		equal(list.querySelectorAll("li").length, 5, "Number of children");
	});

}(document, window.tau));