/* global test, asyncTest, start, define, strictEqual, equal, expect */
(function () {
	var ns = window.ns || window.tau;

	function runTests(PageContainer, helpers) {
		var qunitFuxturesElement;

		function initHTML() {
			var HTML = helpers.loadHTMLFromFile("/base/tests/js/core/widget/core/PageContainer/test-data/sample.html"),
				qunitFuxturesElement,
				parent;

			qunitFuxturesElement = document.getElementById("qunit-fixture");
			parent = qunitFuxturesElement || helpers.initFixture();

			parent.innerHTML = HTML;
		}

		module("core/widget/core/PageContainer", {
			setup: initHTML
		});

	// temporary if for disable errors in karma, @TODO reorganize tests in if to karma UT
		if (qunitFuxturesElement) {
			qunitFuxturesElement.addEventListener("widgetbuilt", function () {

				asyncTest("ns.widget.core.PageContainer change page", 1, function (assert) {
					var element = document.getElementById("qunit-fixture"),
						nextPage = document.getElementById("page2"),
						widget = ns.engine.instanceWidget(element, "pagecontainer"),
						nextPageWidget = null;

					widget.change(nextPage);
					setTimeout(function () {
						nextPageWidget = ns.engine.getBinding(nextPage);
						assert.equal(widget.getActivePage(), nextPageWidget, "Page changed properly");
						start();
					}, 10);
				});

				asyncTest("ns.widget.core.PageContainer change page", 1, function (assert) {
					var element = document.getElementById("qunit-fixture"),
						nextPage = document.getElementById("page2"),
						widget = ns.engine.instanceWidget(element, "pagecontainer"),
						nextPageWidget = null;

					widget.change(nextPage);
					setTimeout(function () {
						nextPageWidget = ns.engine.getBinding(nextPage);
						assert.equal(widget.getActivePage(), nextPageWidget, "Page changed properly");
						start();
					}, 10);
				});

				if (!window.navigator.userAgent.match("PhantomJS")) {
					asyncTest("ns.widget.core.PageContainer change page with transition", 1, function (assert) {
						var element = document.getElementById("qunit-fixture"),
							currentPage = document.getElementById("page3"),
							nextPage = document.getElementById("page4"),
							widget = ns.engine.instanceWidget(element, "pagecontainer"),
							nextPageWidget = null,
							oneEvent = function () {
								document.removeEventListener("pageshow", oneEvent, false);
								nextPageWidget = ns.engine.getBinding(nextPage);
								assert.equal(widget.getActivePage(), nextPageWidget, "Page changed properly");
								start();
							},
							onPageShow = function () {
								document.addEventListener("pageshow", oneEvent, false);
								document.removeEventListener("pageshow", onPageShow, false);
								ns.engine.getRouter().open(nextPage, {transition: "fade"});
							};
					//set a page if does not have any

						document.addEventListener("pageshow", onPageShow, false);
						ns.engine.getRouter().open(currentPage);
					});

					asyncTest("ns.widget.core.PageContainer change page with transition reverse", 1, function (assert) {
						var element = document.getElementById("qunit-fixture"),
							currentPage = document.getElementById("page5"),
							nextPage = document.getElementById("page6"),
							widget = ns.engine.instanceWidget(element, "pagecontainer"),
							nextPageWidget = null,
							oneEvent = function () {
								document.removeEventListener("pageshow", oneEvent, false);
								nextPageWidget = ns.engine.getBinding(nextPage);
								assert.equal(widget.getActivePage(), nextPageWidget, "Page changed properly");
								start();
							},
							onPageShow = function () {
								document.removeEventListener("pageshow", onPageShow, false);
								document.addEventListener("pageshow", oneEvent, false);
								ns.engine.getRouter().open(nextPage, {transition: "fade", reverse: true});
							};
					//set a page if does not have any

						document.addEventListener("pageshow", onPageShow, false);
						ns.engine.getRouter().open(currentPage);
					});
				}
			}, false);
		}

		test("_include", 2, function () {
			var pageContainer = new PageContainer(),
				pageElement = document.getElementById("page-not-in-container"),
				pageContainerElement = document.getElementById("qunit-fixture"),
				result = null,
				tempPageElement;

			pageContainer.element = pageContainerElement;
			helpers.stub(ns.util, "importEvaluateAndAppendElement", function (page, element) {
				strictEqual(pageContainerElement, element, "PageContainer is pass");
				return "result";
			});

			tempPageElement = pageElement.cloneNode(true);
			result = pageContainer._include(tempPageElement);

			strictEqual(result, "result", "method return correct value");

			helpers.restoreStub(ns.util, "importEvaluateAndAppendElement");
		});

		test("_include", function (assert) {
			var pageContainer = new PageContainer(),
				pageElement = document.getElementById("page-not-in-container"),
				pageContainerElement = document.getElementById("qunit-fixture"),
				tempPageElement;

			expect(2);

			pageContainer.element = pageContainerElement;
			helpers.stub(ns.util, "importEvaluateAndAppendElement", function (page, element) {
				assert.strictEqual(pageContainerElement, element, "PageContainer is pass");
				return "result";
			});

			tempPageElement = pageElement.cloneNode(true);

			assert.strictEqual(pageContainer._include(tempPageElement), "result", "method return correct value");

			helpers.restoreStub(ns.util, "importEvaluateAndAppendElement");
		});

		test("change", function (assert) {
			var pageContainer = new PageContainer(),
				pageElement = document.getElementById("page6");

			expect(22);

			helpers.stub(ns.engine, "instanceWidget", function (element, widgetName) {
				assert.strictEqual(element, pageElement, "page element is correct");
				assert.strictEqual(widgetName, "Page", "widget type is Page");
				return {
					layout: function () {
						assert.ok(1, "layout was called");
					},
					option: function () {
						assert.ok(1, "options was called");
					},
					onBeforeShow: function () {
						assert.ok(1, "layout was onBeforeShow");
					}
				};
			});

			helpers.stub(ns.engine, "createWidgets", function () {
				assert.ok(1, "createWidgets was called");
			});

			pageContainer._transition = function (toPageWidget, fromPageWidget, calculatedOptions) {
				assert.equal(typeof toPageWidget, "object", "to page widget is object");
				assert.equal(fromPageWidget, null, "from page is null");
				assert.equal(calculatedOptions.widget, "Page", "options.widget is Page");
				assert.equal(typeof calculatedOptions.deferred.resolve, "function", "options.deferred.resolve is function");

				calculatedOptions.deferred.resolve({
					onHide: function () {
						assert.ok(1, "called onHide");
					}
				}, {
					onShow: function () {
						assert.ok(1, "called onShow");
					}
				}, {
					_removeExternalPage: function (_fromPage, _options) {
						assert.equal(typeof _fromPage, "object", "_fromPage is correct");
						assert.deepEqual(_options, {}, "_options is correct");
					},
					trigger: function (eventName) {
						assert.equal(eventName, "pagechange", "pagechange event was trigger");
					}
				}, {});

				calculatedOptions.deferred.resolve({
					onHide: function () {
						assert.ok(1, "called onHide");
					},
					destroy: function () {
						assert.ok(1, "called destroy");
					}
				}, {
					onShow: function () {
						assert.ok(1, "called onShow");
					}
				}, {
					_removeExternalPage: function (_fromPage, _options) {
						assert.equal(typeof _fromPage, "object", "_fromPage is correct");
						assert.deepEqual(_options, {
							reverse: true
						}, "_options is correct");
					},
					trigger: function (eventName) {
						assert.equal(eventName, "pagechange", "pagechange event was trigger");
					}
				}, {
					reverse: true
				});
			};

			pageContainer.trigger = function (eventName) {
				assert.equal(eventName, "pagebeforechange");
			};

			pageContainer._include = function (pageElement) {
				assert.ok(1, "_include was called");
				return pageElement;
			};

			pageContainer.change(pageElement, {});

			helpers.restoreStub(ns.engine, "instanceWidget");
			helpers.restoreStub(ns.engine, "createWidgets");
		});

		test("_build", function (assert) {
			var pageContainer = new PageContainer(),
				pageContainerElement = document.getElementById("qunit-fixture");

			pageContainerElement.classList.remove("ui-page-container");

			pageContainer._build(pageContainerElement);

			assert.strictEqual(pageContainerElement.classList.contains("ui-page-container"), true,
				"page container class was added");
		});

		test("_setActivePage", 3, function () {
			var pageContainer = new PageContainer(),
				pageContainerElement = document.getElementById("qunit-fixture"),
				newPageWidget = {
					setActive: function (value) {
						strictEqual(value, true, "Active new page");
					}
				};

			pageContainer.element = pageContainerElement;

			pageContainer.activePage = {
				setActive: function (value) {
					strictEqual(value, false, "Deactive active page");
				}
			};

			pageContainer._setActivePage(newPageWidget);

			strictEqual(pageContainer.activePage, newPageWidget, "Active page is changed");
		});


		test("_removeExternalPage", 2, function () {
			var pageContainer = new PageContainer(),
				pageContainerElement = document.getElementById("qunit-fixture"),
				pageElement = document.getElementById("page-not-in-container"),
				newPageWidget = {
					element: pageElement
				},
				options = {
					reverse: true
				};

			pageContainer.element = pageContainerElement;

			pageContainer.trigger = function (name) {
				equal(name, "pageremove", "Event is triggered");
			};

			pageContainer._removeExternalPage(newPageWidget, options);

			strictEqual(pageElement.parentNode, null, "Page is removed");
		});

		asyncTest("_transition", function (assert) {
			var pageContainer,
				pageSource,
				pageDestination,
				pageContainerElement = document.getElementById("qunit-fixture"),
				pageSourceElement = document.getElementById("page1"),
				pageDestinationElement = document.getElementById("page2"),
				count = 0,
				options = {
					reverse: true,
					deferred: {
						resolve: function (fromPageWidget, toPageWidget, self, options) {
							assert.ok(fromPageWidget);
							assert.ok(toPageWidget);
							assert.ok(self);
							assert.ok(options);
							if (count === 1) {
								start();
							}
							count++;
						}
					},
					transition: "slide"
				};

			expect(27);

			pageContainer = new PageContainer();
			pageContainer.element = pageContainerElement;

			pageSource = {
				element: pageSourceElement,
				setActive: function () { }
			};

			pageDestination = {
				element: pageDestinationElement,
				setActive: function () {
					assert.ok(2);
				},
				on: function (name, callback) {
					assert.deepEqual(name, [
						"animationend",
						"webkitAnimationEnd",
						"mozAnimationEnd",
						"msAnimationEnd",
						"oAnimationEnd"
					], "events names are correct in on");
					assert.ok(pageContainer.inTransition, "inTransition was set to true.");
					assert.ok(pageContainer.element.classList.contains(PageContainer.classes.uiViewportTransitioning), "PageContainer element contains uiViewportTransitioning class.");

					callback();
				},
				off: function (name) {
					assert.deepEqual(name, [
						"animationend",
						"webkitAnimationEnd",
						"mozAnimationEnd",
						"msAnimationEnd",
						"oAnimationEnd"
					], "events names are correct in off");
				}
			};

			pageContainer._appendTransitionClasses = function (fromPageWidget, toPageWidget, transition, optionsReverse) {
				assert.strictEqual(fromPageWidget, pageSource, "fromPageWidget is correct object");
				assert.strictEqual(toPageWidget, pageDestination, "toPageWidget is correct object");
				assert.equal(transition, "slide", "transition is slide");
				assert.equal(optionsReverse, true, "options.reverse is true");
			};

			pageContainer._transition(pageDestination, pageSource, options);

			options.transition = "none";

			pageContainer._setActivePage = function (toPageWidget) {
				assert.equal(toPageWidget, pageDestination, "toPageWidget is correct object");
			};

			pageContainer._clearTransitionClasses = function (clearClasses, fromPageWidgetClassList, toPageWidgetClassList) {
				assert.deepEqual(clearClasses.length, 5, "clearClasses has correct length");
				assert.strictEqual(fromPageWidgetClassList, pageSource.element.classList,
					"fromPageWidgetClassList is correct");
				assert.strictEqual(toPageWidgetClassList, pageDestination.element.classList,
					"toPageWidgetClassList is correct");
			};

			pageContainer._transition(pageDestination, pageSource, options);

			assert.ok(pageContainer.inTransition, "inTransition was set to true.");
			assert.ok(pageContainer.element.classList.contains(PageContainer.classes.uiViewportTransitioning),
				"PageContainer element contains uiViewportTransitioning class.")
		});

		test("_appendTransitionClasses", function (assert) {
			var pageContainer,
				count = 0,
				fromPageWidget = {
					element: {
						classList: {
							add: function () {
								if (count === 0 || count === 2) {
									assert.equal(arguments[0], "transition", "(from) arguments[0] is transition");
									assert.equal(arguments[1], "out", "(from) arguments[1] is out");
								} else {
									assert.equal(arguments[0], "reverse", "(from) arguments[0] is reverse");
								}
								count++;
							}
						}
					}
				},
				toPageWidget = {
					element: {
						classList: {
							add: function () {
								if (count === 1 || count === 4) {
									assert.equal(arguments[0], "transition", "(to) arguments[0] is transition");
									assert.equal(arguments[1], "in", "(to) arguments[1] is in");
									assert.equal(arguments[2], "ui-pre-in", "(to) arguments[2] is ui-pre-in");
								} else {
									assert.equal(arguments[0], "reverse", "(to) arguments[0] is reverse");
								}
								count++;
							}
						}
					}
				};

			pageContainer = new PageContainer();
			pageContainer._appendTransitionClasses(fromPageWidget, toPageWidget, "transition");
			pageContainer._appendTransitionClasses(fromPageWidget, toPageWidget, "transition", true);
		});

		test("_clearTransitionClasses", function (assert) {
			var pageContainer,
				clearClasses,
				pageContainerElement = document.getElementById("qunit-fixture"),
				pageSourceElement = document.getElementById("page1"),
				pageDestinationElement = document.getElementById("page2");

			pageContainer = new PageContainer();
			pageContainer.element = pageContainerElement;

			clearClasses = [PageContainer.classes.in, PageContainer.classes.out];
			pageSourceElement.classList.add(PageContainer.classes.in, PageContainer.classes.out);
			pageDestinationElement.classList.add(PageContainer.classes.in, PageContainer.classes.out);

			pageContainer._clearTransitionClasses(clearClasses, pageSourceElement.classList, pageDestinationElement.classList);
			assert.ok(!pageSourceElement.classList.contains(PageContainer.classes.in, PageContainer.classes.out), "Classes were successfully removed from source Page element.");
			assert.ok(!pageDestinationElement.classList.contains(PageContainer.classes.in, PageContainer.classes.out), "Classes were successfully removed from destination Page element.");
		});
	}

	if (typeof define === "function") {
		define([
			"../../../../../../src/js/tools/performance"
		],
			function () {
				return runTests;
			});
	} else {
		runTests(ns.widget.core.PageContainer, window.helpers, window.tauPerf);
	}
}());
