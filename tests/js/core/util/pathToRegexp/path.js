/*global ej: false, document: false,
 module: false, test:false, equal: false*/
document.addEventListener("DOMContentLoaded", function () {
	"use strict";
	var pathToRegexp = tau.util.pathToRegexp;

	module("core/util/pathToRegexp");
	test("pathToRegexp is function and return Regexp", function () {
		equal(typeof pathToRegexp, "function", "pathToRegexp is function");
		ok(pathToRegexp("/") instanceof RegExp, "pathToRegexp return RegExp");
	});

	test("", function() {
		var keys = [],
			re = pathToRegexp("/:foo/:bar", keys),
			result;
			// re = /^\/foo\/([^\/]+?)\/?$/i
			// keys = [{ name: "bar", prefix: "/", delimiter: "/", optional: false, repeat: false, pattern: "[^\\/]+?" }]

		equal(keys.length, 2, "parse 2 parameters");

		result = re.exec("/test/route");
		//=> ["/test/route", "test", "route"]

		equal(result.length, 3, "match to path");
		equal(result[0], "/test/route", "on 0 position is full path");
		equal(result[1], "test", "on 1 position is first argument");
		equal(result[2], "route", "on 2 position is second argument");
	});
});