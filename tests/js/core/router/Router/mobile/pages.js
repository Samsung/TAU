module("profile/mobile/router/Page");

asyncTest("Enhance only first page", function () {
	function checkFirstPageEnhanced() {
		var first = document.getElementById("first"),
			second = document.getElementById("second"),
			mock1 = document.getElementById("mock1"),
			mock2 = document.getElementById("mock2");

		equal(first.getAttribute("data-tau-bound"), "Page", "First page widget is created");
		equal(mock1.getAttribute("data-tau-bound"), "Mock", "First mock widget is created");
		ok(!second.getAttribute("data-tau-bound"), "Second page widget wasn't created");
		ok(!mock2.getAttribute("data-tau-bound"), "Second mock widget wasn't created");
		document.removeEventListener("bound", checkFirstPageEnhanced);
		start();
	}
	document.addEventListener("bound", checkFirstPageEnhanced);
	tau.engine.run();
});

asyncTest("Create page", function () {
	function checkPageCreated() {
		document.removeEventListener("bound", checkPageCreated);
		equal(document.querySelectorAll(".ui-page").length, 1, "Page was created and body contents wrapped.");
		equal(document.body.children.length, 1, "All body elements are moved to page div");
		start();
	}
	document.getElementById("qunit-fixture").innerHTML = ""; //remove all pages, leave only mock widget
	document.addEventListener("bound", checkPageCreated);
	tau.engine.run();
});

(function (window, tau) {
	"use strict";
	tau.test = {};
	tau.test.mock = (function () {
		var Mock = function () {};

		tau.engine.defineWidget(
			"Mock",
			"[data-role='mock']",
			[],
			Mock
		);
		Mock.prototype = new tau.widget.BaseWidget();
		Mock.prototype._build = function (element) {
			element.className = "mock_built";
			return element;
		};
		return Mock;
	}());
}(window, window.tau));