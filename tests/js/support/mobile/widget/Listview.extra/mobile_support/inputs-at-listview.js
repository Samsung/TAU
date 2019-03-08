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

	test("Checkbox in listview", function () {
		var list = document.getElementById("test"),
			li1 = document.getElementById("li1"),
			li2 = document.getElementById("li2"),
			li3 = document.getElementById("li3"),
			li4 = document.getElementById("li4"),
			li5 = document.getElementById("li5"),
			li6 = document.getElementById("li6"),
			li7 = document.getElementById("li7"),
			li8 = document.getElementById("li8");

		equal(list.getAttribute("data-tau-bound"), "Listview", "List widget is created");
		ok(list.classList.contains("ui-listview"), "List has ui-listview class");
		ok(!li1.classList.contains("ui-li-has-checkbox"), "Normal li element has not class ui-li-has-checkbox");
		ok(!li1.classList.contains("ui-li-has-right-btn"), "Normal li element has not class ui-li-has-right-btn");
		ok(li2.classList.contains("ui-li-has-right-btn"), "Input type button has class ui-li-has-right-btn");
		ok(li3.classList.contains("ui-li-has-right-btn"), "Input data-role button has class ui-li-has-right-btn");
		ok(li4.classList.contains("ui-li-has-right-btn"), "Select data-role slider has class ui-li-has-right-btn");
		ok(li5.classList.contains("ui-li-has-checkbox"), "Checkbox has class ui-li-has-right-btn");
		ok(li6.classList.contains("ui-li-has-right-circle-btn"), "Input type button && data-style circle has class ui-li-has-right-circle-btn");
		ok(li7.classList.contains("ui-li-has-right-circle-btn"), "Input data-role button && data-style circle has class ui-li-has-right-circle-btn");
		ok(li8.classList.contains("ui-li-has-right-circle-btn"), "Select data-role slider && data-style circle has class ui-li-has-right-circle-btn");
	});
}(document, window.ej));
