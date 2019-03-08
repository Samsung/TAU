/* global equal, test, tau */
var string = tau.util.string;

module("core/util/string");

test("tau.util.string - check the existence of objects/functions", function () {
	equal(typeof tau, "object", "tau exists");
	equal(typeof tau.util, "object", "tau.util exists");
	equal(typeof tau.util.string, "object", "tau.util.string exists");
	equal(typeof string.dashesToCamelCase, "function", "function dashesToCamelCase");
	equal(typeof string.camelCaseToDashes, "function", "function camelCaseToDashes");
	equal(typeof string.firstToUpperCase, "function", "function firstToUpperCase");
	equal(typeof string.parseProperty, "function", "function parseProperty");
});