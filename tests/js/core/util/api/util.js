/* global test, equal, tau */
var util = tau.util;

module("core/util");

test("tau.util - check the existence of objects/functions", function () {
	equal(typeof tau, "object", "ej exists");
	equal(typeof tau.util, "object", "ej.util exists");
	equal(typeof util.requestAnimationFrame, "function", "function hashObject");
});