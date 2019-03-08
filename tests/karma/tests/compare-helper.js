/* global define, equal, ok, start, asyncTest, test */
define(
	["./helpers", "./compare-helper-excludes", "./properties-typeof-compare"],
	function (helpers, cssPropExcludes, cssPropTypeofCheck) {
		var errorsCount = {},
			simpleLocation;

		function prepareIframes(app, callback) {
			helpers.createIframe(document, {
				src: app.path + "/" + app.appName + "/" + app.indexFile,
				width: app.width,
				height: app.height
			}, function (iframe) {
				var iframeWindow = iframe.contentWindow;

				ok(iframeWindow.tau);
				helpers.createIframe(document, {
					src: app.path + "/" + app.appName + "CE/" + app.indexFile + "?" + ((Math.random() * Date.now()) | 0),
					width: app.width,
					height: app.height
				}, function (iframeCE) {
					var iframeCEWindow = iframeCE.contentWindow;

					ok(iframeCEWindow.tau);
					window.setTimeout(function () {
						callback(iframeWindow, iframeCEWindow);
					}, 500);
				});
			});
		}

		function compareStylesFunction(orgWindow, ceWindow, element1, element2, selector, ignore) {
			var computedStyles1 = element1 && orgWindow.getComputedStyle(element1, selector) || [],
				computedStyles2,
				result = [],
				widgetName = orgWindow.tau.util.selectors.getClosestBySelector(element1, "[data-tau-name]").dataset.tauName,
				id = widgetName,
				testName;

			ignore = ignore || [];

			try {
				computedStyles2 = ceWindow.getComputedStyle(element2, selector);
			} catch (e) {
				computedStyles2 = {};
			}

			if (id === undefined) {
				id = "." + element1.className;
				id += ":" + [].indexOf.call(element1.parentElement.children, element1);
			} else {
				id = "[" + id + "]";
			}

			[].forEach.call(computedStyles1, function (property) {
				if (ignore.indexOf(property) === -1) {
					var computedStyles1Property = computedStyles1[property],
						computedStyles2Property = computedStyles2[property];

					if (cssPropExcludes.indexOf(property) === -1) {
						if (computedStyles2Property && typeof computedStyles2Property) {
							if (typeof computedStyles2Property === "string") {
								// remove "CE" suffix from url() for property like
								// "-webkit-mask-image", "-webkit-mask-box-image-source",
								// "-webkit-mask-box-image", "background-image"
								if (computedStyles2Property.indexOf("url(") > -1) {
									computedStyles2Property = computedStyles2Property.replace("CE/", "/");
									computedStyles1Property = computedStyles1Property.replace("CE/", "/");
								}
							}
						}
						// if property is on list then check only typeof
						if (cssPropTypeofCheck.indexOf(property) > -1) {
							if (typeof computedStyles1Property !== typeof computedStyles2Property) {
								result.push({
									property: property,
									value1: computedStyles1[property],
									value2: computedStyles2Property
								});
							}
						} else if (computedStyles1Property !== computedStyles2Property) {
							result.push({
								property: property,
								value1: computedStyles1[property],
								value2: computedStyles2Property
							});
						}
					}
				}
			});

			if (result.length) {
				testName = element1.tagName + " .(" + element1.className + ") / " + (element2 && element2.tagName) + (selector || "");
				if (!errorsCount[widgetName + testName]) {
					errorsCount[widgetName + testName] = 1;
					module(widgetName);
					asyncTest(testName + " " + simpleLocation, function (result) {
						[].forEach.call(result, function (info) {
							equal(info.value2, info.value1, info.property);
						});
						start();
					}.bind(null, result));
				}
			}
		}

		function mapElement(element1, document) {
			var path = [],
				index,
				currentElement = element1,
				parentElement;

			while (currentElement && (currentElement.tagName.toLowerCase() !== "body")) {
				parentElement = currentElement.parentElement;
				if (parentElement) {
					index = [].slice.call(parentElement.children).indexOf(currentElement);
					path.push(index);
				}
				currentElement = parentElement;
			}

			path = path.reverse();

			currentElement = document.body;
			path.forEach(function (index) {
				if (currentElement && currentElement.children) {
					currentElement = currentElement.children[index];
				}
			});
			return currentElement;
		}

		function compareTree(ceDocument, compareStyles, element, callback, ignore) {
			compareStyles(element, mapElement(element, ceDocument), null, ignore);
			compareStyles(element, mapElement(element, ceDocument), ":before", ignore);
			compareStyles(element, mapElement(element, ceDocument), ":after", ignore);
			[].forEach.call(element.children, function (childElement) {
				if (childElement.dataset.tauName === undefined) {
					compareTree(ceDocument, compareStyles, childElement, null, ignore);
				}
			});
			if (callback) {
				callback();
			}
		}

		function testWidget(ceDocument, compareStyles, element, callback) {
			if (element.dataset.tauName === "PageIndicator") {
				setTimeout(function () {
					compareTree(ceDocument, compareStyles, element, callback);
				}, 300);
			} else if (element.dataset.tauName === "Marquee") {
				// adding ignore properties
				// marquee on left and right iframe start in different time, we can't test transform property
				compareTree(ceDocument, compareStyles, element, callback, ["transform", "-webkit-transform"]);
			} else {
				compareTree(ceDocument, compareStyles, element, callback);
			}
		}

		function testPage(app, orgWindow, ceWindow, page, callback) {
			var compareStyles = compareStylesFunction.bind(null, orgWindow, ceWindow),
				ceDocument = ceWindow.document,
				widgets = page && [].slice.call(page.querySelectorAll("[data-tau-name]")) || [],
				location = orgWindow.location + "",
				simpleLocationIndex = location.indexOf("UIComponents"),
				widgetLoop;

			simpleLocation = location.substring(simpleLocationIndex + 12);

			compareStyles(page, mapElement(page, ceDocument));
			compareStyles(page, mapElement(page, ceDocument), ":before");
			compareStyles(page, mapElement(page, ceDocument), ":after");

			widgetLoop = function () {
				var widget = widgets.shift();

				if (widget) {
					testWidget(ceDocument, compareStyles, widget, widgetLoop);
				} else {
					getLinks(app, orgWindow, ceWindow, page, function () {
						if (page.id === "main") {
							callback();
						} else {
							pageBack(orgWindow, ceWindow, callback);
						}
					});
				}
			};
			widgetLoop();
		}

		function clickLink(app, orgWindow, ceWindow, link1, link2, callback) {
			var events = "pageshow popupshow",
				current = null,
				currentEl = null,
				pathRegexp = new RegExp("^.*" + app.path + "/" + app.appName + "(CE)?", "i"),
				randomIDRegexp = /tau-\d+-\d+/,
				checkMode = 0, // 0 - id checking, 1 - base url checking
				pageChangeCallback = function (event) {
					var element = event.target,
						cls = element.classList,
						doc = element.ownerDocument || (element instanceof HTMLDocument && element),
						location = doc && doc.location.href || "",
						baseLocation = location.replace(pathRegexp, ""),
						id = checkMode === 0 ? element.id : baseLocation;

					console.log("got event", event.type, "on", id, event, location);
					if (id && cls && (cls.contains("ui-page") || cls.contains("ui-popup"))) {
						if (current === null) {
							if (id.match(randomIDRegexp)) {
								console.log("random page id detected, using urls as fallback for sync", baseLocation);
								checkMode = 1;
								current = baseLocation;
							} else {
								checkMode = 0;
								current = id;
							}
							currentEl = element;
						} else if (current === id) {
							console.log("page match", current, id, "executing callback");
							orgWindow.tau.event.off(orgWindow, events, pageChangeCallback);
							ceWindow.tau.event.off(ceWindow, events, pageChangeCallback);
							callback(currentEl);
							current = null;
							currentEl = null;
						}
					}
				},
				href = link1.getAttribute("href");

			if (href !== "#" && href !== "" && link1 && link2) {
				orgWindow.tau.event.on(orgWindow, events, pageChangeCallback);
				ceWindow.tau.event.on(ceWindow, events, pageChangeCallback);
				link1.click();
				link2.click();
				console.log("clicked on link with href " + href);
			} else {
				console.log("not clicked on link with href " + href);
				callback();
			}
		}

		function pageBack(orgWindow, ceWindow, callback) {
			var pageChanges = 0,
				event = "pageshow panelshow popuphide",
				pageChangeCallback = function (event) {
					pageChanges++;
					if (pageChanges === 2) {
						callback();
					}
				};

			orgWindow.tau.event.one(orgWindow, event, pageChangeCallback);
			ceWindow.tau.event.one(ceWindow, event, pageChangeCallback);
			setTimeout(function () {
				//orgWindow.tau.changePage("#main");
				//ceWindow.tau.changePage("#main");
				window.history.go(-2);
			}, 100);
		}

		function getLinks(app, orgWindow, ceWindow, page, callback) {
			var ceDocument = ceWindow.document,
				links = [].slice.call(page.querySelectorAll("a[href]:not([href='#']):not([data-ignore]):not([ignore])")),
				internalCallback = function () {
					var link = links.shift(),
						mirrorLink;

					if (link) {
						mirrorLink = mapElement(link, ceDocument);
						if (mirrorLink === undefined) {
							console.log("[WARNING] Probably DOM structure change at: ", link);
							//try to find link by href attribute;
							mirrorLink = ceDocument.querySelector("[href='" + link.getAttribute("href") + "']");
							if (mirrorLink === undefined) {
								console.error("Important DOM structure change at: " + link);
							}
						}

						if (mirrorLink) {
							clickLink(app, orgWindow, ceWindow, link, mirrorLink, function (page) {
								testPage(app, orgWindow, ceWindow, page, internalCallback);
							});
						}
					} else {
						callback();
					}
				};

			internalCallback();
		}

		return {
			compare: function (app) {
				asyncTest("test was started", function () {
					var finished = false;

					setTimeout(function () {
						if (!finished) {
							start();
						}
					}, 120000);
					prepareIframes(app, function (orgWindow, ceWindow) {
						testPage(app, orgWindow, ceWindow, orgWindow.document.getElementById("main"), function () {
							finished = true;
							start();
						});
					});
				});
			}
		};
	});
