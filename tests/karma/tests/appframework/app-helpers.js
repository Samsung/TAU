/* global define, equal, ok, start, asyncTest, test */
define(
	["../helpers"],
	function (helpers) {
		var appHelpers = {},
			visitedPages = {},
			timeout,
			loadCount = {};

		function pushTests(tests, value, expect, description) {
			tests.push({
				value: value,
				expect: expect,
				description: description
			});
		}

		function prepareIframe(appname, size, callback) {
			helpers.createIframe(document, {
				src: "/base/demos/" + appname,
				width: size[0],
				height: size[1]
			}, function (iframe) {
				var iframeWindow = iframe.contentWindow;

				loadCount[appname] = loadCount[appname] || 0;

				if (loadCount[appname] > 0) {
					ok(false, "reload iframe");
				}				else {
					ok(iframeWindow.tau, "TAU exists");
				}
				loadCount[appname]++;
				callback(iframeWindow);
			});
		}

		function testPage(orgWindow, page, testFunctions, timeout, controllerEvents, callback) {
			var simpleLocation = orgWindow.location + "",
				tests = [];

			if (!controllerEvents) {
				pushTests(tests,
					page && page.classList && page.classList.contains("ui-page-active"),
					true,
					"ui-page-active class is set"
				);
			} else {
				pushTests(tests,
					!!page,
					true,
					"page was loaded"
				);
			}

			if (page && page.id && testFunctions[page.id]) {
				testFunctions[page.id](orgWindow, page, tests);
			}

			asyncTest(simpleLocation, function (tests) {
				tests.forEach(function (test) {
					equal(test.value, test.expect, test.description);
				});
				start();
			}.bind(null, tests));

			getLinks(orgWindow, page, testFunctions, timeout, controllerEvents, function () {
				if (page.id === "main") {
					callback();
				} else {
					pageBack(orgWindow, timeout, controllerEvents, callback);
				}
			});
		}

		function clickLink(orgWindow, link1, testFunctions, timeout, controllerEvents, callback) {
			var pageChanges = 0,
				target,
				event = controllerEvents ? "controller-path-resolved" : "pageshow popupshow",
				pageChangeCallback = function (event) {
					pageChanges++;
					console.log("event", event.type, event.target.id);
					target = event.target;
					setTimeout(function () {
						callback(target);
					}, timeout);
				},
				href = link1.getAttribute("href");

			if (href !== "#" && href !== "" && link1) {
				orgWindow.tau.event.one(orgWindow, event, pageChangeCallback);
				link1.click();
				console.log("clicked on link with href " + href);
			} else {
				console.log("not clicked on link with href " + href);
				callback();
			}
		}

		function pageBack(orgWindow, timeout, controllerEvents, callback) {
			var pageChanges = 0,
				event = controllerEvents ? "controller-path-resolved" : "pageshow panelshow popuphide",
				pageChangeCallback = function () {
					pageChanges++;
					setTimeout(function () {
						callback();
					}, timeout);
				};

			orgWindow.tau.event.one(orgWindow, event, pageChangeCallback);
			setTimeout(function () {
				window.history.go(-1);
			}, 100);
		}

		function getLinks(orgWindow, page, testFunctions, timeout, controllerEvents, callback) {
			var links = [].slice.call(page && page.querySelectorAll("a[href]:not([href='#']):not([data-ignore]):not([data-rel])") || []),
				internalCallback = function () {
					var link = links.shift();

					if (link) {
						if (visitedPages[link.href]) {
							internalCallback();
						} else {
							visitedPages[link.href] = true;
							clickLink(orgWindow, link, testFunctions, timeout, controllerEvents, function (page) {
								testPage(orgWindow, page, testFunctions, timeout, controllerEvents, internalCallback);
							});
						}
					} else {
						callback();
					}
				};

			internalCallback();
		}

		appHelpers.pushTests = pushTests;

		appHelpers.run = function (url, testFunctions, timeout, size, controllerEvents) {
			asyncTest("App " + url, function () {
				var finished = false;

				setTimeout(function () {
					if (!finished) {
						start();
					}
				}, 120000);

				prepareIframe(url, size, function (orgWindow) {
					setTimeout(function () {
						var mainPage = orgWindow.document.getElementById("main");

						orgWindow.onerror = function (event) {
							asyncTest("error", function (event) {
								ok(false, event);
							}.bind(null, event));
						};
						if (mainPage) {
							testPage(orgWindow, mainPage, testFunctions, timeout, controllerEvents, function () {
								finished = true;
								start();
							});
						} else {
							finished = true;
							start();
						}
					}, timeout);
				});
			});
		};

		return appHelpers;
	});