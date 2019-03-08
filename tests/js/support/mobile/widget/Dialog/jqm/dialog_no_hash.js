/*global module, $, asyncTest, document, ok, start, window, test, expect, jQuer, jQuery */
/*
 * mobile dialog unit tests
 */
(function ($) {
	"use strict";

	module("support/mobile/widget/Dialog", {
		setup: function () {
			$.mobile.page.prototype.options.contentTheme = "d";
		}
	});

	if (!window.navigator.userAgent.match("PhantomJS")) {
		asyncTest("dialog opens and closes correctly when hash handling is off", function () {
			var activePage;

			expect(3);

			$.testHelper.sequence([
				function () {
					$.mobile.changePage($("#mypage"));
				},
				function () {
					activePage = $.mobile.activePage;
					//bring up the dialog
					$("#dialog-no-hash-link").click();
				},
				function () {
					// make sure the dialog came up
					ok($("#dialog-no-hash").is(":visible"), "dialog showed up");
					// close the dialog
					$("#dialog-no-hash a").click();
				},
				function () {
					ok(!$("#dialog-no-hash").is(":visible"), "dialog disappeared");
					ok($.mobile.activePage[0] === activePage[0], "active page has been restored");
					start();
				}
			], 1000);
		});
	} else {
		test("PhantomJS does not support XMLHttpRequest.responseType = document", function () {
			ok(true, "bypassing");
		});
	}

}(jQuery));
