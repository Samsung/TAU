/* global test, equal, tau */

var array = tau.util.array;

module("core/util/array");

test("tau.util.array - check the existence of objects/functions", function () {
	equal(typeof tau, "object", "tau exists");
	equal(typeof tau.util, "object", "tau.util exists");
	equal(typeof tau.util.array, "object", "tau.util.easing exists");
	equal(typeof array.range, "function", "function range");
});
