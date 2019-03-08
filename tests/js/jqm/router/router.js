/*global module, $, asyncTest, document, ok, start, window, test */
$().ready(function () {
	"use strict";

	module("jqm/router", {});

	if (!window.navigator.userAgent.match("PhantomJS")) {
		asyncTest("$.mobile.changePage", 1, function () {
			var page2 = $("#test2");

			$(document).on("pagechange", function () {
				ok(page2.hasClass("ui-page-active"), "Check active page.");
				start();
			});
			$.mobile.changePage(page2);
		});
	} else {
		test("PhantomJS does not support XMLHttpRequest.responseType = document", function () {
			ok(true, "bypassing");
		});
	}
});
