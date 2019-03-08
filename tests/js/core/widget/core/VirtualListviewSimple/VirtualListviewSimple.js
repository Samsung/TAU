/* global test, tau, define */
(function () {
	"use strict";

	function runTests(VirtualListviewSimple, helpers) {

		function initHTML() {
			return new Promise(function (resolve) {
				var parent = document.getElementById("qunit-fixture") || helpers.initFixture();

				parent.innerHTML =
					helpers.loadHTMLFromFile("/base/tests/js/core/widget/core/VirtualListSimple/test-data/sample.html");
				resolve();
			});
		}

		module("core/widget/core/VirtualListviewSimple", {
			setup: initHTML
		});

		// This widget use animations and style injections which can't be tested in phantom
		test("_refresh", 3, function (assert) {
			var listviewWidget = new VirtualListviewSimple();

			listviewWidget._buildList = function () {
				assert.ok(true, "_buildList was called");
			};
			listviewWidget.trigger = function (eventName) {
				assert.equal(eventName, "draw", "eventName is draw");
			};
			listviewWidget._snapListviewWidget = {
				refresh: function () {
					assert.ok(true, "_buildList was called");
				}
			};
			listviewWidget._refresh();
		});
	}

	if (typeof define === "function") {
		define([], function () {
			return runTests;
		});
	} else {
		runTests(tau.engine,
			tau.widget.core.VirtualListviewSimple,
			window.helpers);
	}
}());

