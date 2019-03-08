module("core/util/deferred");

var deferred = ej.util.deferred();

test("deferred - check the existence of objects/functions", function () {
	equal(typeof ej, "object", "ej exists");
	equal(typeof ej.util, "object", "ej.util exists");
	equal(typeof ej.util.deferred, "function", "ej.util.callbacks exists");
});
