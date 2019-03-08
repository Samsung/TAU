/* global tau, test, equal */

module("core/util/DOM");

test("util.DOM - check the existence of objects/functions", function () {
	equal(typeof tau, "object", "tau exists");
	equal(typeof tau.util, "object", "tau.util exists");
	equal(typeof tau.util.DOM, "object", "tau.util.DOM exists");
});