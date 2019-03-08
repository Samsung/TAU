/* global tau, equal, test, define */
function runTests(date) {

	module("core/util/date");

	test("convertToMiliseconds", function () {
		equal(date.convertToMiliseconds("23s"), 23000, "");
		equal(date.convertToMiliseconds("34ms"), 34, "");
		equal(date.convertToMiliseconds("23.5s"), 23500, "");
	});
}

if (typeof define === "function") {
	define(function () {
		return runTests;
	});
} else {
	runTests(tau.util.date);
}