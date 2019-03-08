/*global test, define, equal, start, asyncTest */
define(
	[
		"../../helpers",
		"src/js/core/history",
		"src/js/core/history/manager",
		"src/js/core/event",
		"src/js/core/event/vmouse"
	],
	function (helpers, history, manager, eventUtils) {
		"use strict";
		var events = manager.events;

		function startOnHashChange() {
			if (document.location.hash === "") {
				window.removeEventListener("hashchange", startOnHashChange);
				start();
			}
		}

		function clearStart() {
			manager.unlock();
			manager.disable();
			if (document.location.hash === "") {
				start();
			} else {
				window.addEventListener("hashchange", startOnHashChange);
				document.location.hash = "";
			}
		}

		module("ns.core.manager");

		test("class tests", function (assert) {
			equal(typeof manager, "object", "manager object exists");
		});

		test("api tests", function () {
			equal(typeof manager.events, "object", "manager has events dictionary");
			equal(typeof manager.enabled, "boolean", "enabled flag available");
			equal(typeof manager.locked, "boolean", "locked flag available");
			equal(typeof manager.lock, "function", "lock function exists");
			equal(typeof manager.unlock, "function", "unlock function exists");
			equal(typeof manager.enable, "function", "enable function exists");
			equal(typeof manager.disable, "function", "disable function exists");
		});

		test("enable/disable test", function () {
			manager.enable();
			equal(manager.enabled, true, "manager enabled");
			manager.disable();
			equal(manager.enabled, false, "manager disabled");
		});

		module("ns.core.manager", {
			setup: function () {
				manager.enable();
			}
		});

		asyncTest("lock/unlock test", 3, function () {
			var popstate = new PopStateEvent("popstate", {
					bubbles: true,
					cancelable: true,
					state: {
						uid: 0,
						url: "#testlock2"
					}
				}),
				statechangelistener = function (event) {
					equal(manager.locked, false, "manager is unlocked");
					equal(document.location.hash, "#testlock1", "Proper hash in statechange");
					history.replace({}, "testlock1", "#testlock1");
					manager.lock();
					document.removeEventListener(events.STATECHANGE, statechangelistener);
					window.addEventListener("popstate", poplistener);
					window.dispatchEvent(popstate);
				},
				poplistener = function (event) {
					window.removeEventListener("popstate", poplistener);
					equal(manager.locked, true, "manager is locked");
					clearStart();
				};

			document.addEventListener(events.STATECHANGE, statechangelistener);
			document.location.hash = "testlock1";
		});

		asyncTest("continuation test", 1, function () {
			var popstate = new PopStateEvent("popstate", {
					bubbles: true,
					cancelable: true,
					state: {
						uid: 0,
						url: "#testcontinuepopstate"
					}
				}),
				count = 0,
				statechangelistener = function (event) {
					++count;
					history.replace({}, "testcontinue", "#testcontinue");
					document.removeEventListener(events.STATECHANGE, statechangelistener);

					window.addEventListener("popstate", poplistener);
					document.addEventListener(events.STATECHANGE, statechangelistener2);
					document.addEventListener(events.HASHCHANGE, hashchange);

					window.dispatchEvent(popstate);
				},
				statechangelistener2 = function (event) {
					++count;
				},
				hashchange = function (event) {
					++count;
					event.preventDefault();
					document.removeEventListener(events.HASHCHANGE, hashchange);
				},
				poplistener = function (event) {
					window.removeEventListener("popstate", poplistener);
					document.removeEventListener(events.STATECHANGE, statechangelistener2);
					equal(count, 2, "blocked state change event");
					clearStart();
				};

			document.addEventListener(events.STATECHANGE, statechangelistener);
			document.location.hash = "testcontinue";
		});

		asyncTest("link prevented test", 2, function () {
			var count = 0,
				listener = function (event) {
					document.removeEventListener(events.STATECHANGE, listener);
					ok(event, events.STATECHANGE + " called");
					event.preventDefault();
					equal(count, 0, "link default action was prevented");
					window.setTimeout(function () {
						window.removeEventListener("hashchange", hashchange);
						clearStart();
					}, 200);
				},
				link = document.createElement("a"),
				hashchange = function (event) {
					++count;
				};

			link.href = "#linktestprevented";
			link.rel = "page";
			document.body.appendChild(link);

			document.addEventListener(events.STATECHANGE, listener);
			window.addEventListener("hashchange", hashchange);

			link.click();
		});

		asyncTest("link test", 1, function () {
			var listener = function (event) {
					document.removeEventListener(events.STATECHANGE, listener, false);
					ok(event, events.STATECHANGE + " called");
					clearStart();
				},
				link = document.createElement("a");

			document.addEventListener(events.STATECHANGE, listener, false);
			document.body.appendChild(link);
			link.href = "#linktest";
			link.rel = "page";
			link.click();
		});

		asyncTest("popstate test", 1, function () {
			var listener = function (event) {
					document.removeEventListener(events.STATECHANGE, listener);
					ok(event, events.STATECHANGE + " called");
					clearStart();
				},
				event = new PopStateEvent("popstate", {
					bubbles: true,
					cancelable: true,
					state: {
						uid: 0,
						url: "#teststate"
					}
				});

			document.addEventListener(events.STATECHANGE, listener);
			window.dispatchEvent(event);
		});

		asyncTest("statechange prevent", 2, function () {
			var count = 0,
				listener1 = function (event) {
					document.removeEventListener(events.STATECHANGE, listener1, false);
					ok(event, events.STATECHANGE + " called");
					++count;
				},
				listener2 = function (event) {
					window.removeEventListener(events.STATECHANGE, listener2, true);
					ok(event, events.STATECHANGE + " called");
					event.preventDefault();
					event.stopPropagation();
					++count;
					window.setTimeout(function () {
						equal(count, 1, "first listener not executed");
                        // this removing of listener has to be in timeout
						document.removeEventListener(events.STATECHANGE, listener1, false);
						clearStart();
					}, 200);
				};

			document.addEventListener(events.STATECHANGE, listener1, false);
			window.addEventListener(events.STATECHANGE, listener2, true);
			document.location.hash = "#testprevent";
		});

		asyncTest("hashchange test", 1, function () {
			var listener = function (event) {
				document.removeEventListener(events.STATECHANGE, listener);
				ok(event, events.STATECHANGE + " called");
				clearStart();
			};

			document.addEventListener(events.STATECHANGE, listener);
			document.location.hash = "#testhash";
		});

	}
);

