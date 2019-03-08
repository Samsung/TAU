/* global ok, equal, test, $, define, tau, QUnit, test, module */
(function () {
	"use strict";
	function runTests(selectors, helpers) {
		QUnit.config.testTimeout = 10000;
		function initHTML() {
			var parent = document.getElementById("qunit-fixture") || helpers.initFixture();

			parent.innerHTML =
				helpers.loadHTMLFromFile("/base/tests/js/core/util/selectors/test-data/sample.html");
		}

		module("core.util.selectors", {
			setup: initHTML
		});

		test("matchesSelector", function () {
			var div1 = document.querySelector("#test2");

			ok(selectors.matchesSelector, "Function exists");
			equal(selectors.matchesSelector(div1, "#test2"), true, "Matches proper selector");
		});

		test("getParents", function () {
			var div = document.getElementById("test1");

			ok(selectors.getParents, "Function exist");
			equal(selectors.getParents(div).length, $(div).parents().length,
				"Returns the same number of elements like jquery");
		});

		test("getParentsBySelector", function () {
			var div = document.getElementById("test1");

			ok(selectors.getParentsBySelector, "Function exist");
			equal(selectors.getParentsBySelector(div, "div.test1a").length,
				$(div).parents("div.test1a").length, "Returns the same number of elements like jquery");
			equal(selectors.getParentsBySelector(div, "div.test1b").length,
				$(div).parents("div.test1b").length, "Returns the same number of elements like jquery");
		});

		test("getParentsByClass", function () {
			var div = document.getElementById("test1");

			ok(selectors.getParentsByClass, "Function exist");
			equal(selectors.getParentsByClass(div, "test1a").length, $(div).parents(".test1a").length,
				"Returns the same number of elements like jquery");
			equal(selectors.getParentsByClass(div, "test1b").length, $(div).parents(".test1b").length,
				"Returns the same number of elements like jquery");
		});

		test("getParentsByTag", function () {
			var div = document.getElementById("test1");

			ok(selectors.getParentsByTag, "Function exist");
			equal(selectors.getParentsByTag(div, "div").length, $(div).parents("div").length,
				"Returns the same number of elements like jquery");
		});

		test("getParentsBySelectorNS", function () {
			var div = document.getElementsByClassName("test1a");

			ok(selectors.getParentsBySelectorNS, "Function exist");
			equal(selectors.getParentsBySelectorNS(div[0], "role=page").length, $("#page1").length,
				"Returns the same number of elements like jquery");
		});


		test("getChildrenBySelector", function () {
			var div = document.getElementById("test2");

			ok(selectors.getChildrenBySelector, "Function exist");
			equal(selectors.getChildrenBySelector(div, "p.test2a").length,
				$(div).children("p.test2a").length, "Returns the same number of elements like jquery");
			equal(selectors.getChildrenBySelector(div, "p.test2b").length,
				$(div).children("p.test2b").length, "Returns the same number of elements like jquery");
		});

		test("getChildrenByDataNS", function () {
			var div = document.getElementById("qunit-fixture");

			ok(selectors.getChildrenByDataNS, "Function exist");
			equal(selectors.getChildrenByDataNS(div, "role=page").length, $("[data-role='page']").length,
				"Returns the same number of elements like jquery");
		});

		test("getChildrenByClass", function () {
			var div = document.getElementById("test2");

			ok(selectors.getChildrenByClass, "Function exist");
			equal(selectors.getChildrenByClass(div, "test2a").length, $(div).children(".test2a").length,
				"Returns the same number of elements like jquery");
			equal(selectors.getChildrenByClass(div, "test2b").length, $(div).children(".test2b").length,
				"Returns the same number of elements like jquery");
		});

		test("getChildrenByTag", function () {
			var div = document.getElementById("test2");

			ok(selectors.getChildrenByTag, "Function exist");
			equal(selectors.getChildrenByTag(div, "p").length, $(div).children("p").length,
				"Returns the same number of elements like jquery");
			equal(selectors.getChildrenByTag(div, "h1").length, $(div).children("h1").length,
				"Returns the same number of elements like jquery");
		});

		test("getClosestBySelector", function () {
			var div = document.getElementById("test1");

			ok(selectors.getClosestBySelector, "Function exist");
			equal(selectors.getClosestBySelector(div, "div.test1a"), $(div).closest("div.test1a")[0],
				"Returns the same element like jquery");
			equal(selectors.getClosestBySelector(div, "div.test1b"), $(div).closest("div.test1b")[0],
				"Returns the same element like jquery");
		});

		test("getClosestByClass", function () {
			var div = document.getElementById("test1");

			ok(selectors.getClosestByClass, "Function exist");
			equal(selectors.getClosestByClass(div, "test1a"), $(div).closest(".test1a")[0],
				"Returns the same element like jquery");
			equal(selectors.getClosestByClass(div, "test1b"), $(div).closest(".test1b")[0],
				"Returns the same element like jquery");
		});

		test("getClosestBySelectorNS", function () {
			var div1 = document.getElementsByClassName("test1a"),
				div2 = document.getElementById("test1"),
				pageLength = $("#page1").length;

			ok(selectors.getClosestBySelectorNS, "Function exist");
			equal($(selectors.getClosestBySelectorNS(div1[0], "role=page")).length, pageLength,
				"Returns the same number of elements like jquery");
			equal($(selectors.getClosestBySelectorNS(div2, "role=page")).length, pageLength,
				"Returns the same number of elements like jquery");
		});

		test("getClosestByTag", function () {
			var div = document.getElementById("test1");

			ok(selectors.getClosestByTag, "Function exist");
			equal(selectors.getClosestByTag(div, "div"), $(div).closest("div")[0],
				"Returns the same element like jquery");
		});

		test("getAllByDataNS", function () {
			var div = document.getElementById("test1");

			ok(selectors.getAllByDataNS, "Function exist");
			equal(selectors.getAllByDataNS(div, "role=button")[0], $(div).find("[data-role=button]")[0],
				"Returns the same element like jquery");
		});

		test("tau.util.selectors - check function matchesSelector", function () {
			var elem1 = document.getElementById("selectors1-parent"),
				elem2 = document.getElementById("selectors1-child");

			equal(typeof selectors.matchesSelector(elem1, "[data-type='selector']"), "boolean",
				"function matchesSelector returns boolean value");
			equal(selectors.matchesSelector(elem1, "[data-type='selector']"), true,
				"function matchesSelector returns true value");
			equal(selectors.matchesSelector(elem2, "[data-type='selector']"), false,
				"function matchesSelector returns false value");
		});

		test("tau.util.selectors - check functions with 'children'", function () {
			var elem1 = document.getElementById("selectors1-parent"),
				child1 = document.getElementById("selectors1-child");

			equal(typeof selectors.getChildrenBySelector(elem1, "[data-type='selector']"), "object",
				"function getChildrenBySelector returns object");
			ok(selectors.getChildrenBySelector(elem1, "[data-type='selector']") instanceof Array,
				"function getChildrenBySelector returns Array");
			equal(selectors.getChildrenBySelector(elem1, "[data-type='child']")[0].id, child1.id,
				"function getChildrenBySelector returns right value");

			equal(typeof selectors.getChildrenByClass(elem1, "className"), "object",
				"function getChildrenByClass returns object");
			ok(selectors.getChildrenByClass(elem1, "className") instanceof Array,
				"function getChildrenByClass returns Array");
			equal(selectors.getChildrenByClass(elem1, "className").length, 1,
				"function getChildrenByClass");

			equal(typeof selectors.getChildrenByTag(elem1, "div"), "object",
				"function getChildrenByTag returns object");
			ok(selectors.getChildrenByTag(elem1, "a") instanceof Array,
				"function getChildrenByTag returns Array");
			equal(selectors.getChildrenByTag(elem1, "div").length, 2,
				"function getChildrenByTag finds element with div tag");
			equal(selectors.getChildrenByTag(elem1, "a").length, 0,
				"function getChildrenByTag doesn't find element with a tag");
		});

		test("tau.util.selectors - check functions with 'closest'", function () {
			var elem1 = document.getElementById("selectors1-parent"),
				child1 = document.getElementById("selectors1-child"),
				child2 = document.getElementById("selectors1-child-second");

			equal(typeof selectors.getClosestBySelector(elem1, "[data-type='selector']"), "object",
				"function getClosestBySelector returns object");
			ok(selectors.getClosestBySelector(elem1, "[data-type='selector']") instanceof Element,
				"function getClosestBySelector returns element");
			equal(selectors.getClosestBySelector(child1, "[data-type='selector']"), elem1,
				"function getClosestBySelector returns object");

			equal(selectors.getClosestByClass(child2, "no-class"), null,
				"function getClosestByClass returns null");
			equal(selectors.getClosestByClass(child2, "className2"), child2,
				"function getClosestByClass returns itself");
			equal(selectors.getClosestByClass(child1, "parent"), elem1,
				"function getClosestByClass returns parent");

			equal(typeof selectors.getClosestByTag(elem1, "div"), "object",
				"function getClosestByTag returns object");
			equal(selectors.getClosestByTag(elem1, "div"), elem1,
				"function getClosestByTag returns itself");
			equal(selectors.getClosestByTag(elem1, "form"), null,
				"function getClosestByTag returns null");
			ok(selectors.getClosestByTag(elem1, "a") instanceof Element,
				"function getClosestByTag returns element");
			equal(selectors.getClosestByTag(child2, "ul"), elem1.parentNode,
				"function getClosestByTag returns right element");
		});

		test("getScrollableParent", function () {
			equal(selectors.getScrollableParent(document.getElementById("test1")),
				document.getElementById("page1"), "function getScrollableParent return correct element");
			equal(selectors.getScrollableParent(document.getElementById("selectors1-parent")),
				null, "function getScrollableParent return null");
		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.util.selectors,
			window.helpers);
	}
}());
