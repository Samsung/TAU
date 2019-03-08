var selectors = ej.util.selectors;

module("core/util/selectors");

test("ej.util.selectors - check functions with 'parent'", function () {
	var elem1 = document.getElementById("selectors1-parent"),
		child1 = document.getElementById("selectors1-child"),
		child2 = document.getElementById("selectors1-child-second");

	equal(typeof selectors.getParents(elem1), "object", "function getParents returns object");
	ok(selectors.getParents(elem1) instanceof Array, "function getParents returns Array");
	equal(selectors.getParents(child1).length, 6, "function getParents returns right value");
	equal(selectors.getParents(elem1).length, 5, "function getParents returns right value");
	equal(selectors.getParents(child1)[0].id, elem1.id, "function getParents returns right value");

	ok(selectors.getParentsBySelector(elem1, "[data-type='selector']") instanceof Array, "function getParentsBySelector returns Array");
	equal(selectors.getParentsBySelector(child1, "[data-type='selector']")[0].id, elem1.id, "function getParentsBySelector returns right value");

	equal(typeof selectors.getParentsByClass(child1, "parent"), "object", "function getParentsByClass returns object");
	ok(selectors.getParentsByClass(child2, "className") instanceof Array, "function getParentsByClass returns Array");
	equal(selectors.getParentsByClass(child2, "parent").length, 1, "function getParentsByClass");

	equal(typeof selectors.getParentsByTag(elem1, "div"), "object", "function getParentsByTag returns object");
	ok(selectors.getParentsByTag(child1, "form") instanceof Array, "function getParentsByTag returns Array");
	equal(selectors.getParentsByTag(child1, "div").length, 3, "function getParentsByTag returns right value");
	equal(selectors.getParentsByTag(child2, "a").length, 1, "function getParentsByTag returns right value");
	equal(selectors.getParentsByTag(child2, "form").length, 0, "function getParentsByTag returns right value");
});