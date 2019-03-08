/* global equal, test, tau */
var easing = tau.util.easing;

module("core/util/easing");

test("tau.util.easing - check the existence of objects/functions", function () {
	equal(typeof tau, "object", "tau exists");
	equal(typeof tau.util, "object", "tau.util exists");
	equal(typeof tau.util.easing, "object", "tau.util.easing exists");
	equal(typeof easing.cubicOut, "function", "function cubicOut");
	equal(typeof easing.easeOutQuad, "function", "function easeOutQuad");
	equal(typeof easing.easeOutExpo, "function", "function easeOutExpo");
	equal(typeof easing.linear, "function", "function linear");
});