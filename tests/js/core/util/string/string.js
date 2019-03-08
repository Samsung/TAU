/* global equal, test, tau, deepEqual, define */
(function () {
	"use strict";
	function runTests(string) {
		module("core/util/string");

		test("dashesToCamelCase", function () {
			equal(typeof string.dashesToCamelCase("a"), "string", "function dashesToCamelCase returns number value");
			equal(string.dashesToCamelCase("aa-bb-cc-dd"), "aaBbCcDd", "function dashesToCamelCase(aa-bb-cc-dd) returns value aaBbCcDd");
			equal(string.dashesToCamelCase("-aa-bb-cc-dd"), "AaBbCcDd", "function dashesToCamelCase(-aa-bb-cc-dd) returns value AaBbCcDd");
			equal(string.dashesToCamelCase("--aaa"), "-Aaa", "function dashesToCamelCase(--aaa) returns value -Aaa");
		});

		test("camelCaseToDashes", function () {
			equal(typeof string.camelCaseToDashes("a"), "string", "function camelCaseToDashes returns number value");
			equal(string.camelCaseToDashes("aaBbCcDd"), "aa-bb-cc-dd", "function camelCaseToDashes(aaBbCcDd) returns value aa-bb-cc-dd");
			equal(string.camelCaseToDashes("AaBbCcDd"), "-aa-bb-cc-dd", "function camelCaseToDashes(AaBbCcDd) returns value -aa-bb-cc-dd");
			equal(string.camelCaseToDashes("-Aaa"), "--aaa", "function camelCaseToDashes(-Aaa) returns value --aaa");
		});

		test("firstToUpperCase", function () {
			equal(typeof string.firstToUpperCase(""), "string", "function firstToUpperCase returns number value");
			equal(string.firstToUpperCase("aabbccdd"), "Aabbccdd", "function firstToUpperCase(aabbccdd) returns value Aabbccdd");
			equal(string.firstToUpperCase("Aabbccdd"), "Aabbccdd", "function firstToUpperCase(Aabbccdd) returns value Aabbccdd");
			equal(string.firstToUpperCase("-aabbccdd"), "-aabbccdd", "function firstToUpperCase(-aabbccdd) returns value -aabbccdd");
		});

		test("parseProperty", function () {
			equal(typeof string.parseProperty(""), "object", "function parseProperty returns number value");
			deepEqual(string.parseProperty("1,2,3"), [1, 2, 3], "function parseProperty(1,2,3) returns value [1, 2, 3]");
			deepEqual(string.parseProperty("1,2,a"), [1, 2, null], "function parseProperty(1,2,a) returns value [1, 2, null]");
			deepEqual(string.parseProperty("34%,35%"), ["34%", "35%"], "function parseProperty(34%,35%) returns value [34%, 35%]");
			deepEqual(string.parseProperty([2, 3, 4]), [2, 3, 4], "function parseProperty([2, 3, 4]) returns value [2, 3, 4]");
		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.util.string,
			window.helpers);
	}
}());
