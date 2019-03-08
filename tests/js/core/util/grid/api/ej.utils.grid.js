/*global ej, module, test*/
(function (ns) {
	'use strict';
	var grid = ns.util.grid;

	module("core/util/grid");

	test("ns.util.grid - check the existence of objects/functions", function () {
		equal(typeof ns, "object", "ns exists");
		equal(typeof ns.util, "object", "ns.util exists");
		equal(typeof ns.util.grid, "object", "ns.util.grid exists");
		equal(typeof grid.makeGrid, "function", "function cubicOut");
	});

	test("ns.util.grid - check function makeGrid", function () {
		var elem1 = document.getElementById("grid1");
		equal(grid.makeGrid(elem1, "a"), null, "function makeGrid returns number value");
	});
}(ej));