/* global tau, test, equal */

var dom = tau.util.DOM;

module("core/util/DOM/manipulation");

test("util.DOM.manipulation - check the existence of objects/functions", function () {
	equal(typeof tau, "object", "ej exists");
	equal(typeof tau.util, "object", "ej.util exists");
	equal(typeof dom.appendNodes, "function", "function appendNodes");
	equal(typeof dom.replaceWithNodes, "function", "function replaceWithNodes");
	equal(typeof dom.removeAllChildren, "function", "function removeAllChildren");
	equal(typeof dom.insertNodesBefore, "function", "function insertNodesBefore");
	equal(typeof dom.insertNodeAfter, "function", "function insertNodeAfter");
	equal(typeof dom.wrapInHTML, "function", "function wrapInHTML");
});