/* global tau, ok, equal, test, $ */

module("core/widget/core/Page", {
	teardown: function () {
		tau.engine._clearBindings();
	}
});

test("Page DOM created", function () {
	var page = document.getElementById("page1"),
		header = document.getElementById("header1"),
		content = document.getElementById("content1"),
		footer = document.getElementById("footer1"),
		eventsCalled = {};

	$(document).on("pagebeforecreate pagecreate", function (e) {
		eventsCalled[e.type] = true;
	});
	$("#page1").page();
	equal(page.getAttribute("data-tau-bound"), "Page", "Page widget is created");
	ok(page.classList.contains("ui-page"), "Page has ui-page class");
	ok(page.classList.contains("test"), "Previous class wasn't removed");
	ok(eventsCalled.pagebeforecreate, "pagebeforecreate called");
	ok(eventsCalled.pagecreate, "pagecreate called");
	$(document).off("pagebeforecreate pagecreate");

	ok(header.classList.contains("ui-header"), "Header enhanced");

	ok(content.classList.contains("ui-content"), "Content enhanced");
	equal(content.getAttribute("role"), "main", "Content has role=main");

	ok(footer.classList.contains("ui-footer"), "Footer enhanced");
});

test("Page titles", function () {
	var h1 = document.getElementById("h1"),
		h2 = document.getElementById("h2");

	$("#page1").page();
	ok(h1.classList.contains("ui-title"), "Title has been enhanced");
	equal(h1.getAttribute("role"), "heading");
	equal(h1.getAttribute("aria-level"), "1");
	equal(h1.getAttribute("aria-label"), "title");
});