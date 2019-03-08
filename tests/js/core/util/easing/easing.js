/* global equal, test, tau, define */
(function () {
	"use strict";
	function runTests(easing) {
		module("core/util/easing");

		test("cubicOut", function () {
			equal(typeof easing.cubicOut(1, 1, 1, 1), "number", "function cubicOut returns number value");
			equal(easing.cubicOut(1, 1, 1, 1), 2, "function cubicOut(1, 1, 1, 1) returns value (2)");
			equal(easing.cubicOut(2, 1, 1, 1), 3, "function cubicOut(2, 1, 1, 1) returns value (3)");
			equal(easing.cubicOut(3, 1, 1, 1), 10, "function cubicOut(3, 1, 1, 1) returns value (10)");
		});

		test("easeOutQuad", function () {
			equal(typeof easing.easeOutQuad(1, 1, 1, 1), "number", "function easeOutQuad(1, 1, 1, 1) returns number value");
			equal(easing.easeOutQuad(1, 1, 1, 1), 2, "function easeOutQuad(1, 1, 1, 1) returns value (2)");
			equal(easing.easeOutQuad(2, 1, 1, 1), 1, "function easeOutQuad(2, 1, 1, 1) returns value (1)");
			equal(easing.easeOutQuad(3, 1, 1, 1), -2, "function easeOutQuad(3, 1, 1, 1) returns value (-2)");
		});

		test("easeOutExpo", function () {
			equal(typeof easing.easeOutExpo(1, 1, 1, 1), "number", "function easeOutExpo(1, 1, 1, 1) returns number value");
			equal(easing.easeOutExpo(1, 1, 1, 1), 2, "function easeOutExpo(1, 1, 1, 1) returns value (2)");
			equal(easing.easeOutExpo(2, 1, 1, 1), 1.9999990463256836, "function easeOutExpo(2, 1, 1, 1) returns value (1.9999990463256836)");
			equal(easing.easeOutExpo(3, 1, 1, 1), 1.9999999990686774, "function easeOutExpo(3, 1, 1, 1) returns value (1.9999999990686774)");
		});

		test("linear", function () {
			equal(typeof easing.linear(1, 1, 1, 1), "number", "function linear(1, 1, 1, 1) returns number value");
			equal(easing.linear(1, 1, 1, 1), 2, "function linear(1, 1, 1, 1) returns value (2)");
			equal(easing.linear(2, 1, 1, 1), 3, "function linear(2, 1, 1, 1) returns value (3)");
			equal(easing.linear(3, 1, 1, 1), 4, "function linear(3, 1, 1, 1) returns value (4)");
		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.util.easing);
	}
}());
