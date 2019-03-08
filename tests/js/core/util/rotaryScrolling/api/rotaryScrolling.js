/* global test, equal, tau */
module("core/util/rotaryScrolling", {});

test("tau.util.rotaryScrolling - check the existence of objects/functions", function () {
	equal(typeof tau, "object", "tau exists");
	equal(typeof tau.util, "object", "tau.util exists");
	equal(typeof tau.util.rotaryScrolling.enable, "function", "tau.util.enable exists");
	equal(typeof tau.util.rotaryScrolling.disable, "function", "tau.util.disable exists");
	equal(typeof tau.util.rotaryScrolling.getScrollStep, "function", "tau.util.getScrollStep exists");
	equal(typeof tau.util.rotaryScrolling.setScrollStep, "function", "tau.util.setScrollStep exists");
});
