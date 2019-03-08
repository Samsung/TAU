/* global tau, equal, test */

var dom = tau.util.DOM;

module("core/util/DOM/attributes");

test("util.DOM.attributes - check the existence of objects/functions", function () {
	equal(typeof tau, "object", "tau exists");
	equal(typeof tau.util, "object", "tau.util exists");
	equal(typeof dom.inheritAttr, "function", "function inheritAttr");
	equal(typeof dom.getNumberFromAttribute, "function", "function getNumberFromAttribute");
	equal(typeof dom.setNSData, "function", "function setNSData");
	equal(typeof dom.getNSData, "function", "function getNSData");
	equal(typeof dom.hasNSData, "function", "function hasNSData");
	equal(typeof dom.removeNSData, "function", "function removeNSData");
	equal(typeof dom.getData, "function", "function getData");
	equal(typeof dom.removeAttribute, "function", "function removeAttribute");
	equal(typeof dom.setAttribute, "function", "function setAttribute");
});