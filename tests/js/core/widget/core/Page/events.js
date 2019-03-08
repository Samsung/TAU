/* global asyncTest, ok, equal, tau, $, start */

module("core/widget/core/Page");

asyncTest("Events listener in correct order", 27, function () {
	var page = document.getElementById("first"),
		pageActive = document.getElementById("two"),
		order = 1;

	$(document).one("pagechange", function () {
		$(document).on("pagebeforechange", function (e) {
			ok(true, "pagebeforechange event called");
			equal(e.target, document.querySelector(".ui-page-container"), "pagebeforechange target is page container");
			equal(order++, 1, "Order correct pagebeforechange");
		}).on("pagebeforecreate", function (e) {
			ok(true, "pagebeforecreate event called");
			equal(e.target, pageActive, "pagebeforecreate target is page");
			equal(order++, 2, "Order correct pagebeforecreate");
		}).on("pagecreate", function (e) {
			ok(true, "pagecreate event called");
			equal(e.target, pageActive, "pagecreate target is page");
			equal(order++, 3, "Order correct pagecreate");
		}).on("pageinit", function (e) {
			ok(true, "pageinit event called");
			equal(e.target, pageActive, "pageinit target is page");
			equal(order++, 4, "Order correct pageinit");
		}).on("pagebeforehide", function (e) {
			ok(true, "pagebeforehide event called");
			equal(e.target, page, "pagebeforehide target is page");
			equal(order++, 5, "Order correct pagebeforehide");
		}).on("pagebeforeshow", function (e) {
			ok(true, "pagebeforeshow event called");
			equal(e.target, pageActive, "pagebeforeshow target is page");
			equal(order++, 6, "Order correct pagebeforeshow");
		}).on("pagehide", function (e) {
			ok(true, "pagehide event called");
			equal(e.target, page, "pagehide target is page");
			equal(order++, 7, "Order correct pagehide");
		}).on("pageshow", function (e) {
			ok(true, "pageshow event called");
			equal(e.target, pageActive, "pageshow target is page");
			equal(order++, 8, "Order correct pageshow");
		}).on("pagechange", function (e) {
			ok(true, "pagechange event called");
			equal(e.target, document.querySelector(".ui-page-container"), "pagechange target is page container");
			equal(order, 9, "Order correct pagechange");
			start();
		});
		tau.engine.getRouter().open(pageActive);
	});
	tau.engine.run();
});