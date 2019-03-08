/*global window, document, initFixture */
(function (window, document, tau, define, QUnit) {
	"use strict";

	QUnit.config.reorder = false;
	QUnit.config.notrycatch = true;

	function runTest(route) {
		//********** test start ********/
		var originalHistory = null,
			originalPath = null,
			originalRouter = null,
			originalAsyncState = false,
			historyMock = {
				backCalled: 0,
				replaceCalled: 0,
				lastReplaceParams: {},
				back: function () {
					this.backCalled++;
				},
				replace: function (options, title, url) {
					this.lastReplaceParams = {
						options: options,
						title: title,
						url: url
					};
					this.replaceCalled++;
				},
				reset: function () {
					this.backCalled = 0;
					this.replaceCalled = 0;
					this.lastReplaceParams = {};
				}
			},
			pathMock = {
				location: "",
				getLocationCalled: 0,
				addHashSearchParamsCalled: 0,
				lastAddHashSearchParams: {},
				getLocation: function () {
					this.getLocationCalled++;
					return this.location;
				},
				addHashSearchParams: function (url, key) {
					this.lastAddHashSearchParams = {
						url: url,
						key: key
					};
				},
				reset: function () {
					this.location = "";
					this.getLocationCalled = 0;
					this.addHashSearchParamsCalled = 0;
					this.lastAddHashSearchParams = {};
				},
				convertUrlToDataUrl: function (url, key, base) {
					return originalPath.convertUrlToDataUrl(url, key, base);
				},
				isPath: function (path) {
					return originalPath.isPath(path);
				}
			},
			routerMock = {
				unlockCalled: 0,
				lockCalled: 0,
				container: {
					getActivePage: function () {
						return {
							element: document.getElementById("qunit-fixture").querySelector(".ui-page")
						};
					}
				},
				getContainer: function () {
					return this.container;
				},
				unlock: function () {
					this.unlockCalled++;
				},
				lock: function () {
					this.lockCalled++;
				},
				getRoute: function (routeName) {
					if (routeName === "popup") {
						return route;
					}
					return originalRouter().getRoute(routeName);
				},
				close: function () {
					return originalRouter().close();
				}
			};

		function initHTML() {
			var html = "<div class=\"ui-page\">\
					<div id=\"first-popup\" data-transition=\"none\"></div>\
					<div id=\"second-popup\" data-external=\"true\" data-transition=\"none\"></div>\
					<div id=\"third-popup\" data-transition=\"none\"></div>\
					<div id=\"fourth-popup\" data-transition=\"none\"></div>\
					<div id=\"fift-popup\" class=\"ui-popup\" data-external=\"true\" data-transition=\"none\" data-url=\"data/url/popup\"></div>\
					<div id=\"sixth-popup\" class=\"ui-popup\" data-external=\"true\" data-transition=\"none\"></div>\
					</div>",
				fixture = document.getElementById("qunit-fixture") || initFixture();

			fixture.style.top = "0px";
			fixture.style.left = "0px";
			fixture.innerHTML = html;
		}

		function closePopupInRoute(route) {
			route.close(route.getActiveElement());
			if (route.activePopup) {
				route.activePopup.state = 3;
				route.activePopup = null;
			}

			if (route.active) {
				route.active = false;
			}
		}

		QUnit.module("core/router/route/popup", {
			setup: function () {
				originalHistory = route._history;
				originalPath = route._path;

				route._history = historyMock;
				route._path = pathMock;

				originalRouter = tau.router.getInstance;
				tau.router.Router.getInstance = function () {
					return routerMock;
				};
				originalAsyncState = !!tau.getConfig("noAsync");
				tau.setConfig("noAsync", true);

				initHTML();
			},
			teardown: function () {
				pathMock.reset();
				historyMock.reset();
				route._history = originalHistory;
				route._path = originalPath;
				closePopupInRoute(route);
				tau.router.getInstance = originalRouter;
				tau.setConfig("noAsync", originalAsyncState);
				tau.engine._clearBindings();
			}
		});

		test("option setting test", function (assert) {
			tau.setConfig("popupTransition", "none");
			assert.deepEqual(route.option(), route.defaults, "Options set correctly");
		});

		test("active popup", function (assert) {
			var popupMock = tau.engine.instanceWidget(document.getElementById("first-popup"), "Popup"),
				testOpts = {fromHashChange: false, history: true};

			route.setActive(popupMock);
			assert.deepEqual(route.getActiveElement().id, popupMock.element.id, "the active popup is mock data");
			assert.ok(!route.active, "route is not active");
			assert.ok(!route.hasActive(), "route has no active popup");

			// deactivate
			pathMock.location = "?popup=true";
			route.setActive();
			assert.notDeepEqual(route.activePopup, popupMock, "mock data removed");
			assert.ok(!route.active, "route is not active");
			assert.ok(!route.hasActive(), "route has no active popup");

			// set again with options
			route.setActive(popupMock, testOpts);
			assert.deepEqual(route.activePopup, popupMock, "the active popup is mock data");
			assert.ok(route.active, "route is active");

			assert.deepEqual(historyMock.lastReplaceParams.options, testOpts, "propert options in history");
			assert.equal(pathMock.lastAddHashSearchParams.key, "popup=true", "propert key in search params");
		});

		test("open/close popup", function (assert) {
			var popup1 = document.getElementById("first-popup"),
				popup2 = document.getElementById("second-popup"),
				popup3 = document.getElementById("third-popup"),
				popup4 = document.getElementById("fourth-popup"),
				mockPosition = {clientX: -10, clientY: -10};

			// test opening of fist popup
			route.open(popup1, {"position-to": "none", history: true});

			assert.ok(route.hasActive(), "route has active popup");
			assert.equal(route.getActiveElement().id, popup1.id, "proper popup has been opened");
			assert.equal(route.getActive().options["position-to"], "none", "proper position to set in popup");

			closePopupInRoute(route);

			// open other with touches
			route.open(popup2, {history: true}, {touches: [mockPosition]});

			assert.ok(route.hasActive(), "route has active popup");
			// need to compare element ids since importNode used in importing
			// external popups recreates nodes
			assert.equal(route.getActiveElement().id, popup2.id, "second popup opened");
			assert.equal(route.getActive().options.x, mockPosition.clientX, "horizontal position passed");
			assert.equal(route.getActive().options.y, mockPosition.clientY, "horizontal position passed");

			// test close
			assert.ok(route.onHashChange("", {transition: "none", history: true}), "popup closed on hash change, method returns true");
			assert.ok(!route.active, "route is not active");
			assert.ok(!route.onHashChange("", {}), "onHashChange returns false when no active popup");

			route.onOpenFailed();
			assert.ok(true, "onOpenFailed called @TODO");

			closePopupInRoute(route);

			// test opening of fist popup again with mouse pos
			route.open(popup1, {history: true, dismissible: false}, mockPosition);

			assert.ok(route.hasActive(), "route has active popup");
			assert.equal(route.getActiveElement().id, popup1.id, "proper popup has been opened");
			assert.equal(route.getActive().options.x, mockPosition.clientX, "horizontal position passed");
			assert.equal(route.getActive().options.y, mockPosition.clientY, "horizontal position passed");
			assert.equal(routerMock.lockCalled, 1, "router locked when opening not dismissable popup");

			historyMock.reset();
			pathMock.reset();
			pathMock.location = "?popup=true";
			closePopupInRoute(route);

			assert.equal(routerMock.unlockCalled, 1, "router unlocked when closing not dismissible popup");
			assert.equal(historyMock.backCalled, 1, "back called if popup param used when closing popup");

			route.open(popup3, {history: true});
			tau.event.one(document, "popuphide", function (event) {
				assert.equal(event.target.id, popup3.id, "second popup closed when opening first");
			});
			route.open(popup4, {history: true});
		});

		test("find popup", function (assert) {
			var popup5 = document.getElementById("fift-popup"),
				popup6 = document.getElementById("sixth-popup");

			assert.equal(route.find("data/url/popup"), popup5, "popup found by data url");
			assert.equal(route.find("sixth-popup"), popup6, "popup found by id");
			assert.equal(route.find("not-found-popup"), null, "popup not found");
		});

		test("parse popup from external source", function (assert) {
			var popup = null,
				url = "external/popup",
				found = null,
				external = document.createElement("div");

			external.innerHTML = "<div><div class=\"ui-popup\"></div></div>";

			popup = external.querySelector(".ui-popup");
			found = route.parse(external, url);

			assert.equal(found, popup, "found proper popup in external html");
			assert.equal(tau.util.DOM.getNSData(found, "url"), url, "found element has url set");
			assert.equal(tau.util.DOM.getNSData(found, "external"), true, "found element has external flag set");
		});

		//********** test end **********/
	}

	if (typeof define === "function") {
		define(
			[
				"src/js/core/router/route/popup",
				"src/js/core/core",
				"src/js/core/engine",
				"src/js/core/router/Router"
			],
			function (route, fetchedTau) {
				tau = fetchedTau; // something is messed up in dependencies in routes
				return runTest.bind(null, route);
			}
		);
	} else {
		runTest(tau.router.route.popup, window.helpers);
	}

}(window, window.document, window.tau, window.define, window.QUnit));

