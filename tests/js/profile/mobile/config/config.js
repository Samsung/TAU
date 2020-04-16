/* global document, tau, define, module, test, equal */

function runTests(tau) {
	module("profile/mobile/config");

	test("config (mobile)", function () {
		equal(tau.getConfig("autoBuildOnPageChange"), true, "autoBuildOnPageChange is set correct");
		equal(tau.getConfig("loader"), false, "loader is set correct");
		equal(tau.getConfig("pageContainerBody"), true, "pageContainerBody is set correct");
		equal(tau.getConfig("popupTransition"), "slideup", "popupTransition is set correct");
		equal(tau.getConfig("pageTransition"), "none", "pageTransition is set correct");
	});
}

if (typeof define === "function") {
	define(function () {
		return runTests;
	});
} else {
	runTests(tau);
}
