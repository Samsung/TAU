/* global $, ok, asyncTest, start */
module("jqm/router");

$(document).one("pagechange", function () {
	asyncTest("pageContainer", 3, function () {
		var pageContainer = document.getElementById("pageContainer1");

		ok(!document.body.classList.contains("ui-page-container"), "body not contains ui-page-container");
		ok(pageContainer.classList.contains("ui-page-container"), "pageContainer contains ui-page-container");
		window.setTimeout(function () {
			start();
		}, 2000);
		$(pageContainer).bind("pageshow", function (event) {
			ok(event.target, "call pageshow");
		});
		document.getElementById("btn1").click();
		document.getElementById("btn2").click();
	});
});
