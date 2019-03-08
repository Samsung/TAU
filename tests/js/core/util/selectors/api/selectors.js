/* global tau, test, equal */
var selectors = tau.util.selectors;

module("core/util/selectors");

test("tau.util.selectors - check the existence of objects/functions", function () {
	equal(typeof tau, "object", "tau exists");
	equal(typeof tau.util, "object", "tau.util exists");
	equal(typeof tau.util.selectors, "object", "tau.util.selectors exists");
	equal(typeof selectors.matchesSelector, "function", "function set");
	equal(typeof selectors.getChildrenBySelector, "function", "function set");
	equal(typeof selectors.getChildrenByClass, "function", "function get");
	equal(typeof selectors.getChildrenByTag, "function", "function remove");
	equal(typeof selectors.getParents, "function", "function set");
	equal(typeof selectors.getParentsBySelector, "function", "function get");
	equal(typeof selectors.getParentsByClass, "function", "function remove");
	equal(typeof selectors.getParentsByTag, "function", "function set");
	equal(typeof selectors.getClosestBySelector, "function", "function get");
	equal(typeof selectors.getClosestByClass, "function", "function remove");
	equal(typeof selectors.getClosestByTag, "function", "function remove");
	equal(typeof selectors.getChildrenByDataNS, "function", "function get");
	equal(typeof selectors.getParentsBySelectorNS, "function", "function get");
	equal(typeof selectors.getClosestBySelectorNS, "function", "function get");
	equal(typeof selectors.getAllByDataNS, "function", "function get");
});
