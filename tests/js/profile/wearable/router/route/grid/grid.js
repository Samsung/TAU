/* global QUnit, ns, define, tau, Promise */
(function () {
	"use strict";
	function runTests(routeGrid, helpers) {
		QUnit.module("router/route/grid");

		QUnit.test("options", function (assert) {
			assert.equal(routeGrid.orderNumber, 1000, "orderNumber is 1000");
			assert.equal(routeGrid.filter, ".ui-grid", "filter is ui-grid");
		});

		QUnit.test("option", function (assert) {
			assert.equal(routeGrid.option(), null, "method option return null");
		});

		QUnit.test("open", function (assert) {
			helpers.stub(ns.history, "replace", function (options, url, title) {
				assert.deepEqual(options, {
					"rel": "grid",
					"url": "url"
				}, "options is ");
				assert.equal(url, "url", "url is 'url'");
				assert.equal(title, "title", "title is 'title'");
			});
			routeGrid.open(null, {
				url: "url",
				title: "title",
				rel: "grid"
			});
			helpers.restoreStub(ns.history, "replace");
		});

		QUnit.test("onHashChange", function (assert) {
			assert.equal(routeGrid.onHashChange(), null, "method onHashChange return null");
		});

		QUnit.test("find", function (assert) {
			assert.equal(routeGrid.find(), null, "method find return null");
		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests
		});
	} else {
		runTests(tau.router.route.grid,
			window.helpers);
	}
}());
