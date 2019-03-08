/*jslint nomen: true */
/*global window:false, document:false,
 test:false, ok:false, equal:false, module:false,
 console:false */
(function (document, ej) {
	"use strict";
	module("profile/mobile/widget/mobile/Listview", {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

	test("Links in listview", function () {
		var list1 = document.getElementById("list1"),
			list2 = document.getElementById("list2"),
			li;

		equal(list1.getAttribute("data-tau-bound"), "Listview", "List1 widget is created");
		equal(list2.getAttribute("data-tau-bound"), "Listview", "List2 widget is created");
		ok(list1.classList.contains("ui-listview"), "List1 has ui-listview class");
		ok(list2.classList.contains("ui-listview"), "List2 has ui-listview class");

		li = document.getElementById("li2_1");
		ok(li.children.length === 0, "LI element on List2 has not children");
	});
}(document, window.ej));
