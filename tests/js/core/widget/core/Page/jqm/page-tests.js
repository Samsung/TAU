/*
 * page unit tests
 */

$(document).ready(function () {
	$.mobile.defaultTransition = "none";

	module("Page", {
		teardown: function () {
			ej.engine._clearBindings();
		}
	});

	var unit_page = function (widget) {
		var created_page = widget.page();

		/* Create */
		ok(created_page, "Create");

		equal(created_page.children(".ui-footer").length, 1, "check if fixed bar exist");
	};

	test("Basic page create test", function () {
		unit_page($("#main_page"));
	});
});