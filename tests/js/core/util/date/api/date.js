/* global test, equal, tau */

module("core/util/date");

test("tau.util.date - check the existence of objects/functions", function () {
	equal(typeof tau, "object", "tau exists");
	equal(typeof tau.util, "object", "tau.util exists");
	equal(typeof tau.util.date, "object", "tau.util.date exists");
	equal(typeof tau.util.date.convertToMiliseconds, "function", "method convertToMiliseconds exists in date");
});
