/* global test, equal */

(function (ns) {
	var data = ns.util.object;

	module("core/util/object");

	test("ns.util.object - check the existence of objects/functions", function () {
		equal(typeof ns, "object", "ns exists");
		equal(typeof ns.util, "object", "ns.util exists");
		equal(typeof ns.util.object, "object", "ns.util.data exists");
		equal(typeof data.copy, "function", "function copy");
		equal(typeof data.merge, "function", "function merge");
		equal(typeof data.fastMerge, "function", "function fastMerge");
	});
}(window.tau))