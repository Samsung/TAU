/*global window, document, test, asyncTest, start, ns */
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
					helpers.loadHTMLFromFile("/base/tests/js/core/router/Router/test-data/sample.html");
				helpers.loadTAUStyle(document, "wearable", function () {
					ns.setConfig("pageContainer", parent);
					ns.setConfig("autoInitializePage", true);
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
		test("init for justBuild:true", function (assert) {
			router.init(true);
			assert.equal(router.justBuild, true, "Router has set property justBuild:true");
		});

		test("init for justBuild:false", function (assert) {
			router.init(false);
			assert.equal(router.justBuild, false, "Router has not property justBuild");
		});
			/*
			 test('init for justBuild:false and active page', function () {
			 var activePage = helper.createPage('activePage'),
			 page = document.getElementById('secondPage');
			 activePage.classList.add('ui-page-active');
			 page.parentNode.appendChild(activePage);

			 router.init(false);
			 equal(router.getFirstPage(), activePage, 'Active page was proper initialized');
			 });
			 */
		test("getFirstPage", function (assert) {
			var firstPage = document.getElementById("firstPage");

			router.init(false);
			assert.equal(router.getRoute("page").getFirstElement(), firstPage, "router.getFirstPage()");
		});

		asyncTest("open enbedded #firstPage autoInitializePage:true", function (assert) {
			var onPageShow = function () {
				start();
				assert.equal(router.container.activePage.element.id, "firstPage",
					"router.open(\"#firstPage\")");
				document.removeEventListener("pageshow", onPageShow, true);
			};

			document.addEventListener("pageshow", onPageShow, true);
			router.init();
		});

		asyncTest("open enbedded #firstPage", function (assert) {
			var onPageShow = function () {
				start();
				assert.equal(router.container.activePage.element.id, "firstPage",
					"router.open(\"#firstPage\")");
				document.removeEventListener("pageshow", onPageShow, true);
			};

			ns.setConfig("autoInitializePage", false);
			router.init();
			document.addEventListener("pageshow", onPageShow, true);
			router.open("#firstPage");
		});

		asyncTest("open enbedded #secondPage", function (assert) {
			var onPageShow = function () {
				start();
				assert.equal(router.container.activePage.element.id, "secondPage",
					"router.open(\"#secondPage\")");
				document.removeEventListener("pageshow", onPageShow, true);
			};

			ns.setConfig("autoInitializePage", false);
			router.init();
			document.addEventListener("pageshow", onPageShow, true);
			router.open("#secondPage");
		});

		asyncTest("open enbedded #thirdPage", function (assert) {
			var onPageShow = function () {
				start();
				assert.equal(router.container.activePage.element, document.getElementById("thirdPage"),
					"router.open(\"#thirdPage\")");
				document.removeEventListener("pageshow", onPageShow, true);
			};

			ns.setConfig("autoInitializePage", false);
			router.init();
			document.addEventListener("pageshow", onPageShow, true);
			router.open("#thirdPage");
		});

			/*
			 * #issue: event.which is never equal 1 in method linkClickHandler
			 */
			/*
			 asyncTest('open enbedded #secondPage by click on link', function () {
			 var link = document.getElementById('linkToSecondPage'),
			 onFirstPageShow = function () {
			 document.removeEventListener('pageshow', onFirstPageShow, true);
			 document.addEventListener('pageshow', onSecondPageShow, true);
			 utilsEvent.trigger(link, 'click');
			 },
			 onSecondPageShow = function () {
			 start();
			 equal(router.container.activePage.id, 'secondPage', 'page "secondPage" was opened after click');
			 document.removeEventListener('pageshow', onSecondPageShow, true);
			 };
			 ns.setConfig('autoInitializePage', true);
			 document.addEventListener('pageshow', onFirstPageShow, true);
			 router.init();
			 });
			 */
			// temporary disabled all external page test because generate a problem in current test runner
		// if (!window.navigator.userAgent.match("PhantomJS")) {
		// 	asyncTest("open externalPage", function () {
		// 		var onBack = function () {
		// 				document.removeEventListener("pageshow", onBack, true);
		// 				start();
		// 			},
		// 			onPageShow = function () {
		// 				ok(router.container.activePage.id, "externalPage", "router.open(\"test-data/externalPage.html\")");
		// 				document.removeEventListener("pageshow", onPageShow, true);
		// 				document.addEventListener("pageshow", onBack, true);
		// 				router.close();
		// 			};
		//
		// 		ns.setConfig("autoInitializePage", false);
		// 		router.init();
		// 		document.addEventListener("pageshow", onPageShow, true);
		// 		router.open("test-data/externalPage.html")
		// 	});
		// }

		test("destroy", function (assert) {
			router.destroy();
			assert.ok(true, "router.destroy()");
		});

		test("setContainer", function (assert) {
			var containerElement = document.getElementById("qunit-fixture"),
				container = engine.instanceWidget(containerElement, "pagecontainer");

			router.setContainer(container);
			assert.equal(router.container, container, "router.setContainer()");
		});

		test("getContainer", function (assert) {
			var containerElement = document.getElementById("qunit-fixture"),
				container = engine.instanceWidget(containerElement, "pagecontainer");

			router.setContainer(container);
			assert.equal(router.getContainer(), container, "router.getContainer()");
		});

		test("register", function (assert) {
			var containerElement = document.getElementById("qunit-fixture"),
				container = engine.instanceWidget(containerElement, "pagecontainer"),
				firstPage = document.getElementById("firstPage");

			router.register(container, firstPage);
			assert.equal(router.container, container, "is container");
			assert.equal(router.getRoute("page").getFirstElement(), firstPage, "is firstPage");
		});

		asyncTest("openPopup", function (assert) {
			var onPageShow = function () {
					document.removeEventListener("pageshow", onPageShow, true);
					router.open("#firstPopup", {rel: "popup"});
					assert.ok("Page was opened");
				},
				onPopupShow = function () {
					assert.ok(document.querySelector(".ui-popup-active"),
						"router.openPopup(\"#firstPopup\")");
					document.getElementById("firstPopup").removeEventListener("popupshow", onPopupShow);
					start();
				};

			document.addEventListener("pageshow", onPageShow, true);
			document.getElementById("firstPopup").addEventListener("popupshow", onPopupShow);
			ns.setConfig("autoInitializePage", true);
			router.init();
		});

		// if (!window.navigator.userAgent.match("PhantomJS")) {
		// 	asyncTest("openPopup from externalPage", 2, function () {
		// 		var onPageShow = function () {
		// 				document.removeEventListener("pageshow", onPageShow, true);
		// 				router.open("#externalPopup", {rel: "popup"});
		// 				ok("Page was opened");
		// 			},
		// 			onPopupShow = function () {
		// 				start();
		// 				ok(document.querySelector(".ui-popup-active"), "router.openPopup(\"#externalPopup\")");
		// 				document.removeEventListener("popupshow", onPopupShow, true);
		// 			};
		//
		// 		router.init();
		// 		setTimeout(function () {
		// 			document.addEventListener("pageshow", onPageShow, true);
		// 			document.addEventListener("popupshow", onPopupShow, true);
		// 			router.open("test-data/externalPage.html");
		// 		}, 1000);
		// 	});
		// }

		asyncTest("closePopup", function (assert) {
			var firstPopup = document.getElementById("firstPopup"),
				onPageShow = function () {
					document.removeEventListener("pageshow", onPageShow, true);
					router.open("#firstPopup", {rel: "popup"});
				},
				onPopupShow = function () {
					firstPopup.removeEventListener("popupshow", onPopupShow);
					router.getRoute("popup").close();
				},
				onPopupHide = function (event) {
					assert.equal(event.target.classList.contains("ui-popup-active"), false,
						"router.closePopup(\"#firstPopup\")");
					firstPopup.removeEventListener("popuphide", onPopupHide);
					start();
				};

			document.addEventListener("pageshow", onPageShow, true);
			firstPopup.addEventListener("popupshow", onPopupShow);
			firstPopup.addEventListener("popuphide", onPopupHide);
			router.init();
		});

		test("close", function (assert) {
			var popup = document.getElementById("secondPopup");

			router.init(true);

			router.openPopup("#secondPopup");
			router.close("#secondPopup", {rel: "popup"});
			assert.equal(popup.classList.contains("ui-popup-active"), false, "closed popup should not" +
				" contain ui-popup-active class");

			router.openPopup("#secondPopup");
			router.close("#secondPopup", {rel: "back"});
			assert.equal(popup.classList.contains("ui-popup-active"), false, "closed popup should not" +
				" contain ui-popup-active class");

			assert.throws(
				function () {
					router.openPopup("#secondPopup");
					router.close("#secondPopup", {rel: "notDefinedRouterRule"});
					assert.equal(popup.classList.contains("ui-popup-active"), true, "error should be" +
						" thrown when router rule does not exist");
				},
				"Error(\"Not defined router rule [notDefinedRouterRule]\")"
				);
		});

		// if (!window.navigator.userAgent.match("PhantomJS")) {
		// 	asyncTest("open externalPage (load error)", function () {
		// 		var onChangeFailed = function () {
		// 			start();
		// 			ok(true, "router.open(\"test-data/not-exists-page.html\") \"changefailed\" event triggered");
		// 			document.removeEventListener("changefailed", onChangeFailed, true);
		// 		};
		//
		// 		router.init();
		// 		document.addEventListener("changefailed", onChangeFailed, true);
		// 		router.open("test-data/not-exists-page.html")
		// 	});
		//
		// 	test("open enbedded #not-embedded-page (change failed expected)", function () {
		// 		var onChangeFailed = function () {
		// 			ok(true, "router.open(\"#not-embedded-page\") \"changefailed\" event triggered");
		// 			document.removeEventListener("changefailed", onChangeFailed, true);
		// 		};
		//
		// 		router.init();
		// 		document.addEventListener("changefailed", onChangeFailed, true);
		// 		router.open("#not-embedded-page")
		// 	});
		// }

		test("open enbedded (unknown rule)", function (assert) {
			router.init();
			assert.throws(function () {
				router.open("#firstPage", {rel: "unknown-rule"})
			},
				Error,
				"Throw exception: Not defined router rule [\"unknown-rule\"]"
				);
		});

			/* protected */
		test("(protected method) _getInitialContent", function (assert) {
			router.init();
			assert.equal(router._getInitialContent(), router.getRoute("page").getFirstElement(), "router");
		});

		test("hasActivePopup", function (assert) {
			router.openPopup("#secondPopup");
			assert.deepEqual(router.hasActivePopup(), true);
		});

		test("detectRel", function (assert) {
			var divWithRelAttrEqBack = document.getElementById("fourthPage");

			assert.equal(router.detectRel(divWithRelAttrEqBack), undefined, "function should not" +
				" return anything");
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