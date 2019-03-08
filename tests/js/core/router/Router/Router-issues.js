/*global window, document, asyncTest, start, ns */
(function (window, document, tau, define, QUnit) {
	"use strict";

	QUnit.config.reorder = false;
	QUnit.config.notrycatch = true;

	function runTest(engine, Router, helpers) {
		"use strict";
		var router = engine.getRouter();

		function initHTML() {
			return new Promise(function (resolve) {
				var parent = document.getElementById("qunit-fixture") || helpers.initFixture();

				parent.innerHTML =
					helpers.loadHTMLFromFile("/base/tests/js/core/router/Router/test-data/issue-tizenwf-2129.html");
				helpers.loadTAUStyle(document, "wearable", function () {
					ns.setConfig("pageContainer", parent);
					ns.setConfig("autoInitializePage", false);
					resolve();
				});
			});
		}

		module("core/router/Router", {
			teardown: function () {
				var baseTag = document.querySelector("base");

				if (baseTag) {
					baseTag.parentElement.removeChild(baseTag);
				}
				engine._clearBindings();
				router.destroy();
				ns.setConfig("pageContainer", null);
			},
			setup: initHTML
		});

		asyncTest("avoid redundant 'pageshow' event on back button (tizenwf-2129)", 3, function (assert) {
			// http://suprem.sec.samsung.net/jira/browse/TIZENWF-2129

			/**
			 * Test scenario:
			 * 1. #main page show
			 * 2. Change to page "#page"
			 * 3. Call history.back
			 *
			 * Expected result:
			 * 	- Event "pagebeforeshow" on main page has to be trigger only once
			 * 	We expect exactly 3 asserts
			 */
			var firstCall = true,
				onMainPageShow = function () {
					assert.ok(true, "#main event 'pageshow' has been triggered");
					document.removeEventListener("pageshow", onMainPageShow, true);

					document.getElementById("page")
							.addEventListener("pageshow", onSecondPageShow, true);
					window.setTimeout(function () {
						tau.changePage("#page");
					}, 100);
				},
				onSecondPageShow = function () {
					assert.ok(true, "#page event 'pageshow' has been triggered");

					document.getElementById("page")
							.removeEventListener("pageshow", onSecondPageShow, true);

					document.getElementById("main")
							.addEventListener("pageshow", onBackToMainPageShow, true);
					window.setTimeout(function () {
						tau.history.back();
					}, 100);
				},
				onBackToMainPageShow = function () {
					assert.ok(true, "#main event 'pageshow' has been triggered after back");

					if (firstCall) {
						firstCall = false;
						// Wait 200ms for redundand events
						window.setTimeout(function () {
							document.getElementById("main")
								.removeEventListener("pageshow", onBackToMainPageShow, true);
							start();
						}, 100);
					}
				};

			ns.setConfig("autoInitializePage", false);
			router.init();
			document.addEventListener("pageshow", onMainPageShow, true);
			router.open("#main");
		});
	}

	if (typeof define === "function") {
		define(
			[
				"../../../../../src/js/core/engine",
				"../../../../../src/js/core/router/route/page",
				"../../../../../src/js/core/router/route/popup"
			],
			function (engine) {
				return runTest.bind(null, engine);
			}
		);
	} else {
		runTest(ns.engine, ns.router.Router, window.helpers);
	}

}(window, window.document, window.tau, window.define, window.QUnit)
);