/*global test, define, equal, start, asyncTest */
define(
	[
		"../helpers",
		"src/js/core/controller",
		"src/js/core/history/manager",
		"src/js/core/event",
		"src/js/core/event/vmouse"
	],
	function (helpers, Controller, historyManager, eventUtils) {
		"use strict";
		var events = Controller.events;

		module("tau.controller", {
			teardown: function () {
				var c = Controller.getInstance();

				c.removeAllRoutes();
				historyManager.disable();
			},
			setup: function () {
				historyManager.enable();

			}
		});

		test("class tests", function () {
			equal(typeof Controller, "function", "controller class exists");
			equal(typeof Controller.getInstance(), "object", "instance object exists");
			ok(Controller.getInstance() instanceof Controller, "and is the right instance");
		});

		test("api tests", function () {
			var c = Controller.getInstance();

			equal(typeof c.addRoute, "function", "addRoute method exists");
			equal(typeof c.removeRoute, "function", "addRoute method exists");
		});

		asyncTest("basic rule test", 1, function () {
			var callback = function (defer) {
					ok(true, "callback called");
					document.location.hash = "";
					defer.resolve();
					start();
				},
				c = Controller.getInstance();

			c.init();
			c.addRoute("basictest", callback);
			document.location.hash = "basictest";
		});

		asyncTest("rule with params test", 1, function () {
			var callback = function (defer, param) {
					equal(param, "value1", "callback called");
					document.location.hash = "";
					defer.resolve();
					start();
				},
				c = Controller.getInstance();

			c.init();
			c.addRoute("paramtest/:param", callback);
			document.location.hash = "paramtest/value1";
		});

		asyncTest("multiple rules test", 3, function () {
			var callbacks = [
					function (defer, param) {
						equal(param, undefined, "callbacki 1 called with no param");
						defer.resolve();
						document.location.hash = "user/edit/5";
					},
					function (defer, userid) {
						equal(userid, "5", "callback 2 called with proper param");
						defer.resolve();
						document.location.hash = "display";
					},
					function (defer, param) {
						equal(param, undefined, "calback 3 called with no param");
						defer.resolve();
						document.location.hash = "";
						start();
					}
				],
				c = Controller.getInstance();

			c.init();
			c.addRoute("user", callbacks[0]);
			c.addRoute("user/edit/:id", callbacks[1]);
			c.addRoute("display", callbacks[2]);
			document.location.hash = "user";
		});

		asyncTest("rule remove test", 2, function () {
			var c = Controller.getInstance(),
				callback1 = function (defer, n) {
					equal(n, "1", "callback 1 called with proper param");
					c.removeRoute("ruleremove/:n", callback1);
					c.addRoute("ruleremove/:n", callback2);
					defer.resolve();
					document.location.hash = "ruleremove/2";
				},
				callback2 = function (defer, n) {
					equal(n, "2", "callback 2 called with proper param");
					defer.resolve();
					document.location.hash = "";
					start();
				};

			c.init();
			c.addRoute("ruleremove/:n", callback1);
			document.location.hash = "ruleremove/1";
		});

		asyncTest("rule events test", 5, function () {
			var callback1 = function (defer) {
					ok(defer, "callback 1 called");
					document.addEventListener(events.PATH_RESOLVED, onsuccess, false);
					document.addEventListener(events.CONTENT_AVAILABLE, oncontent, false);
					defer.resolve("test");
				},
				callback2 = function (defer) {
					ok(defer, "callback 2 called");
					document.removeEventListener(events.PATH_RESOLVED, onsuccess, false);
					document.addEventListener(events.PATH_REJECTED, onfailure, false);
					defer.reject();
				},
				oncontent = function (event) {
					var options = event.detail;

					document.removeEventListener(events.PATH_REJECTED, onfailure, false);
					document.removeEventListener(events.CONTENT_AVAILABLE, oncontent, false);
					equal(options.content, "test", "content passed");
				},
				onsuccess = function (event) {
					ok(event.detail, "on success callback called and passed options");
					document.location.hash = "successtest";
				},
				onfailure = function (event) {
					ok(event, "on failure callback called"); // event detail not always available
					document.location.hash = "";
					start();
				},
				c = Controller.getInstance();

			c.init();
			c.addRoute("eventtest", callback1);
			c.addRoute("successtest", callback2);
			document.location.hash = "eventtest";
		});

		asyncTest("hashchange after success rule test", 1, function () {
			var callback = function (defer) {
					defer.resolve();
					equal(document.location.hash, "#testhash", "proper hash");
					document.location.hash = "";
					start();
				},
				c = Controller.getInstance(),
				link = document.createElement("a");

			c.init();
			c.addRoute("testhash", callback);
			link.href = "#testhash";
			document.body.appendChild(link);
			link.click();
		});

		asyncTest("hashchange back call", 1, function () {
			var callback = function (defer) {
					var button = document.createElement("a");

					button.rel = "back";
					document.body.appendChild(button);
					eventUtils.one(document, events.PATH_RESOLVED, function () {
						clicked = true;
						button.click();
					});
					defer.resolve();
				},
				testCallback = function (defered) {
					if (clicked) {
						eventUtils.one(document, events.PATH_RESOLVED, function () {
							equal(document.location.hash, "#test", "previous hash restored");
							start();
						});
					}
					defered.resolve();
				},
				clicked = false,
				c = Controller.getInstance();

			c.init();
			c.addRoute("testback", callback);
			c.addRoute("test", testCallback);
			document.location.hash = "test";
			eventUtils.one(window, "hashchange", function () {
				document.location.hash = "testback";
			});
		});

		asyncTest("undefined route", 2, function () {
			var callback = function (defer) {
					defer.resolve();
					ok(true, "Known route");
					eventUtils.off(document, "historystatechange", eventCallback);
					start();
				},
				eventCallback = function () {
					ok(true, "Hash was changed only once");
				},
				c = Controller.getInstance();

			c.init();
			c.addRoute("testback2", callback);
			eventUtils.on(document, "historystatechange", eventCallback);
			document.location.hash = "test2";
			document.location.hash = "testback2";
		});

		asyncTest("open/back methods", 3, function () {
			var calls = 0,
				callback = function (defer) {
					calls++;
					defer.resolve();
					ok(true, "Known route");
					if (calls == 2) {
						start();
					} else {
						c.open("test4");
					}
				},
				callback2 = function (defer) {
					defer.resolve();
					ok(true, "Known route");
					c.back();
				},
				c = Controller.getInstance();

			c.init();
			c.addRoute("test3", callback);
			c.addRoute("test4", callback2);
			c.open("test3");
		});

		test("destoy test", function () {
			var c = Controller.getInstance();

			historyManager.disable();
			// @TODO this test is probably wrong, we should have some enabled flag
			equal(c.onStateChange, null, "controller was destroyed");
		});

		test("instancing test", function () {
			var c1 = Controller.newInstance(),
				c2 = Controller.newInstance();

			notEqual(c1, c2, "two new intances different");
		});
	}
);

