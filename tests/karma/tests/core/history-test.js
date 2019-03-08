/*global define */
define(
	[
		"/base/tests/js/core/history/history.js",
		"../helpers",
		"src/js/core/history"
	],
	function (testsHistory) {
		"use strict";

		testsHistory(window.ns, "/base/tests/js/core/router/Router/", function () {
		});
	}
);

