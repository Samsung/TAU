/* global tau, test, equal */
var dom = tau.util.DOM;

module("core/util/DOM/css");

test("core/util/DOM/css - check the existence of objects/functions", function () {
	equal(typeof tau, "object", "tau exists");
	equal(typeof tau.util, "object", "tau.util exists");
	equal(typeof dom.getCSSProperty, "function", "function getCSSProperty");
	equal(typeof dom.extractCSSProperties, "function", "function extractCSSProperties");
	equal(typeof dom.getElementHeight, "function", "function getElementHeight");
	equal(typeof dom.getElementWidth, "function", "function getElementWidth");
});