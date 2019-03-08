/*global window, module, test, asyncTest, ok, equal, start, stop, ej, $ */
(function (document) {
	"use strict";

	module("core/router/Router");

	if (!window.navigator.userAgent.match("PhantomJS")) {
		asyncTest("By default first page is active", 6, function () {
			var body = document.body;

			function checkPage1() {
				var page = document.getElementById("page1");

				page.removeEventListener("pagechange", checkPage1);

				equal(page.getAttribute("data-tau-bound"), "Page", "Page1 is enhanced");
				ok(page.classList.contains("ui-page-active"), "Page1 is active");
				equal(document.querySelectorAll("[data-role=\"page\"].ui-page-active").length, 1, "Only one page is active");

				start();
			}

			function checkFirstPage() {
				var page = document.getElementById("first");

				equal(page.getAttribute("data-tau-bound"), "Page", "First page is enhanced");
				ok(page.classList.contains("ui-page-active"), "First page is active");
				equal(document.querySelectorAll("[data-role=\"page\"].ui-page-active").length, 1, "Only one page is active");

				body.removeEventListener("pagechange", checkFirstPage);
				body.addEventListener("pagechange", checkPage1);

				$.mobile.changePage("test-data/page1.html");
			}

			body.addEventListener("pagechange", checkFirstPage);
			ej.engine.run();
		});
	} else {
		test("PhantomJS does not support XMLHttpRequest.responseType = document", function () {
			ok(true, "bypassing");
		});
	}
}(window.document));
