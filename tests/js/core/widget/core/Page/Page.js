/* global notEqual, expect, document, tau, define, module, test, strictEqual, initFixture, window, ok, equal */
(function () {
	"use strict";
	function runTests(engine, Page, helpers) {

		function initHTML() {
			var HTML = helpers.loadHTMLFromFile("/base/tests/js/core/widget/core/Page/test-data/sample.html"),
				parent = document.getElementById("qunit-fixture") || initFixture();

			parent.innerHTML = HTML;
		}

		module("core/widget/core/Page", {
			setup: initHTML,
			teardown: function () {
				engine._clearBindings();
			}
		});

		test("constructor", function () {
			var pageWidget = new Page();

			strictEqual(pageWidget.options.header, undefined, "Option header is set correct");
			strictEqual(pageWidget.options.content, undefined, "Option content is set correct");
			strictEqual(pageWidget.options.footer, undefined, "Option footer is set correct");
			pageWidget._configure();
			strictEqual(pageWidget.options.header, null, "Option header is set correct");
			strictEqual(pageWidget.options.content, null, "Option content is set correct");
			strictEqual(pageWidget.options.footer, null, "Option footer is set correct");
		});

		test("_contentFill", function () {
			var pageElement = document.getElementById("first"),
				pageWidget = new Page();

			pageWidget.element = pageElement;
			pageWidget._contentFill();
			strictEqual(pageElement.style.width, window.innerWidth + "px", "Element's width is set correct");
			strictEqual(pageElement.style.height, window.innerHeight + "px", "Element's height is set correct");
			// we test that method not throw exception
		});

		test("getScroller", function (assert) {
			var pageElement = document.getElementById("first"),
				pageWidget = new Page();

			pageWidget.element = pageElement;
			// children[1] is content
			assert.equal(pageWidget.getScroller(), pageElement.children[1], "getScroller return element in base case");
		});

		test("_storeContentStyle/_restoreContentStyle", function () {
			var pageElement = document.getElementById("first"),
				contentElement = pageElement.querySelector(".ui-content"),
				pageWidget = new Page();

			contentElement.style.marginTop = "20px";
			contentElement.style.marginBottom = "30px";
			contentElement.style.height = "40px";
			contentElement.style.width = "50px";
			contentElement.style.minHeight = "60px";
			pageWidget.element = pageElement;
			pageWidget._storeContentStyle();
			strictEqual(pageWidget._initialContentStyle.marginTop, "20px", "Content's width is set correct");
			strictEqual(pageWidget._initialContentStyle.marginBottom, "30px", "Content's width is set correct");
			strictEqual(pageWidget._initialContentStyle.height, "40px", "Content's width is set correct");
			strictEqual(pageWidget._initialContentStyle.width, "50px", "Content's width is set correct");
			strictEqual(pageWidget._initialContentStyle.minHeight, "60px", "Content's width is set correct");
			contentElement.style.marginTop = "120px";
			contentElement.style.marginBottom = "130px";
			contentElement.style.height = "140px";
			contentElement.style.width = "150px";
			contentElement.style.minHeight = "160px";
			pageWidget._restoreContentStyle();
			strictEqual(contentElement.style.marginTop, "20px", "Content's width is set correct");
			strictEqual(contentElement.style.marginBottom, "30px", "Content's width is set correct");
			strictEqual(contentElement.style.height, "40px", "Content's width is set correct");
			strictEqual(contentElement.style.width, "50px", "Content's width is set correct");
			strictEqual(contentElement.style.minHeight, "60px", "Content's width is set correct");


			pageElement = document.getElementById("second");

			pageWidget.element = pageElement;
			pageWidget._storeContentStyle();
			strictEqual(pageWidget._initialContentStyle.marginTop, undefined, "Content's width is set correct");
			strictEqual(pageWidget._initialContentStyle.marginBottom, undefined, "Content's width is set correct");
			strictEqual(pageWidget._initialContentStyle.height, undefined, "Content's width is set correct");
			strictEqual(pageWidget._initialContentStyle.width, undefined, "Content's width is set correct");
			strictEqual(pageWidget._initialContentStyle.minHeight, undefined, "Content's width is set correct");
			pageWidget._restoreContentStyle();
			// we test that method not throw exception
		});

		test("_setFooter", function () {
			var pageWidget = new Page(),
				pageElement = document.getElementById("second");

			pageWidget.element = pageElement;
			pageWidget._setFooter(pageElement, true);

			strictEqual(pageWidget.options.footer, true, "Option footer is set correct");
			strictEqual(pageElement.querySelector(".ui-footer").tagName, "FOOTER", "footer tag exists");
			strictEqual(pageElement.querySelector(".ui-footer").textContent, "", "footer tag is empty");

			pageWidget._setFooter(pageElement, false);

			strictEqual(pageWidget.options.footer, false, "Option footer is set correct");
			strictEqual(pageElement.querySelector(".ui-footer"), null, "footer tag doesn't exists");

			pageWidget._setFooter(pageElement, "Footer text");

			strictEqual(pageWidget.options.footer, "Footer text", "Option footer is set correct");
			strictEqual(pageElement.querySelector(".ui-footer").tagName, "FOOTER", "footer tag exists");
			strictEqual(pageElement.querySelector(".ui-footer").textContent, "Footer text", "footer tag contains text");
		});

		test("_setHeader", function () {
			var pageWidget = new Page(),
				pageElement = document.getElementById("second");

			pageWidget.element = pageElement;
			pageWidget._setHeader(pageElement, true);

			strictEqual(pageWidget.options.header, true, "Option header is set correct");
			strictEqual(pageElement.querySelector(".ui-header").tagName, "HEADER", "header tag exists");
			strictEqual(pageElement.querySelector(".ui-header").textContent, "", "header tag is empty");
			strictEqual(pageElement.querySelector(".ui-header"), pageWidget._ui.header, "_ui.header is set correct");

			pageWidget._setHeader(pageElement, false);

			strictEqual(pageWidget.options.header, false, "Option header is set correct");
			strictEqual(pageElement.querySelector(".ui-header"), null, "header tag doesn't exists");
			strictEqual(pageElement.querySelector(".ui-header"), pageWidget._ui.header, "_ui.header is set correct");

			pageWidget._setHeader(pageElement, "Header text");

			strictEqual(pageWidget.options.header, "Header text", "Option header is set correct");
			strictEqual(pageElement.querySelector(".ui-header").tagName, "HEADER", "header tag exists");
			strictEqual(pageElement.querySelector(".ui-header").textContent, "Header text", "header tag contains text");
			strictEqual(pageElement.querySelector(".ui-header"), pageWidget._ui.header, "_ui.header is set correct");
		});


		test("_setContent", function () {
			var pageWidget = new Page(),
				pageElement = document.getElementById("second");

			pageWidget.element = pageElement;
			pageWidget._ui.footer = pageWidget.element.querySelector(".ui-footer");
			pageWidget._ui.header = pageWidget.element.querySelector(".ui-header");
			pageWidget._setContent(pageElement, true);

			strictEqual(pageWidget.options.content, true, "Option content is set correct");
			strictEqual(pageElement.querySelector(".ui-content").tagName, "DIV", "content tag exists");
			strictEqual(pageElement.querySelector(".ui-content").textContent, "Second", "content tag is empty");

			pageWidget._setContent(pageElement, false);

			strictEqual(pageWidget.options.content, false, "Option content is set correct");
			strictEqual(pageElement.querySelector(".ui-content"), null, "content tag doesn't exists");

			pageWidget._setContent(pageElement, "Content text");

			strictEqual(pageWidget.options.content, "Content text", "Option content is set correct");
			strictEqual(pageElement.querySelector(".ui-content").tagName, "DIV", "content tag exists");
			strictEqual(pageElement.querySelector(".ui-content").textContent, "Content text", "content tag contains text");

			pageElement = document.getElementById("first");
			pageWidget = new Page();
			pageWidget.element = pageElement;

			pageWidget._ui.footer = pageWidget.element.querySelector(".ui-footer");
			pageWidget._ui.header = pageWidget.element.querySelector(".ui-header");
			pageWidget._setContent(pageElement, true);

			strictEqual(pageElement.querySelector(".ui-content").tagName, "DIV", "content tag exists");
			strictEqual(pageElement.querySelector(".ui-content").textContent.indexOf("Content") > -1, true, "content tag contains text");
		});

		test("_buildHeader", function () {
			var pageWidget = new Page(),
				firstPageElement = document.getElementById("first"),
				tagsPageElement = document.getElementById("tags"),
				dataPageElement = document.getElementById("data"),
				secondPageElement = document.getElementById("second");

			pageWidget._buildHeader(firstPageElement);

			strictEqual(pageWidget.options.header, true, "Option header is set correct");
			strictEqual(firstPageElement.querySelector(".ui-header").tagName, "DIV", "header tag exists");
			strictEqual(pageWidget._ui.header, firstPageElement.querySelector(".ui-header"), "header tag exists");
			strictEqual(firstPageElement.querySelector(".ui-header").textContent, "Header", "header tag is empty");

			pageWidget = new Page();
			pageWidget._buildHeader(tagsPageElement);

			strictEqual(pageWidget.options.header, true, "Option header is set correct");
			strictEqual(tagsPageElement.querySelector(".ui-header").tagName, "HEADER", "header tag exists");
			strictEqual(pageWidget._ui.header, tagsPageElement.querySelector(".ui-header"), "header tag exists");
			strictEqual(tagsPageElement.querySelector(".ui-header").textContent, "Header", "header tag is empty");

			pageWidget = new Page();
			pageWidget._buildHeader(dataPageElement);

			strictEqual(pageWidget.options.header, true, "Option header is set correct");
			strictEqual(dataPageElement.querySelector("[data-role='header']").tagName, "DIV", "header tag exists");
			strictEqual(pageWidget._ui.header, dataPageElement.querySelector("[data-role='header']"), "header tag exists");
			strictEqual(dataPageElement.querySelector("[data-role='header']").textContent, "Header", "header tag is empty");

			pageWidget = new Page();
			pageWidget._buildHeader(secondPageElement);

			strictEqual(pageWidget.options.header, false, "Option header is set correct");
			strictEqual(pageWidget._ui.header, secondPageElement.querySelector(".ui-header"), "header tag exists");
			strictEqual(secondPageElement.querySelector(".ui-header"), null, "header tag exists");

			pageWidget = new Page();
			pageWidget.options.header = false;
			pageWidget._buildHeader(secondPageElement);

			strictEqual(pageWidget.options.header, false, "Option header is set correct");
			strictEqual(pageWidget._ui.header, secondPageElement.querySelector(".ui-header"), "header tag exists");
			strictEqual(secondPageElement.querySelector(".ui-header"), null, "header tag exists");

			pageWidget = new Page();
			pageWidget.options.header = true;
			pageWidget._buildHeader(secondPageElement);

			strictEqual(pageWidget.options.header, true, "Option header is set correct");
			strictEqual(pageWidget._ui.header, secondPageElement.querySelector(".ui-header"), "header tag exists");
			strictEqual(secondPageElement.querySelector(".ui-header").textContent, "", "header tag is empty");

		});

		test("_buildFooter", function () {
			var pageWidget = new Page(),
				firstPageElement = document.getElementById("first"),
				tagsPageElement = document.getElementById("tags"),
				dataPageElement = document.getElementById("data"),
				secondPageElement = document.getElementById("second");

			pageWidget._buildFooter(firstPageElement);

			strictEqual(pageWidget.options.footer, true, "Option footer is set correct");
			strictEqual(firstPageElement.querySelector(".ui-footer").tagName, "DIV", "footer tag exists");
			strictEqual(pageWidget._ui.footer, firstPageElement.querySelector(".ui-footer"), "footer tag exists");
			strictEqual(firstPageElement.querySelector(".ui-footer").textContent, "Footer", "footer tag is empty");

			pageWidget = new Page();
			pageWidget._buildFooter(tagsPageElement);

			strictEqual(pageWidget.options.footer, true, "Option footer is set correct");
			strictEqual(tagsPageElement.querySelector(".ui-footer").tagName, "FOOTER", "footer tag exists");
			strictEqual(pageWidget._ui.footer, tagsPageElement.querySelector(".ui-footer"), "footer tag exists");
			strictEqual(tagsPageElement.querySelector(".ui-footer").textContent, "Footer", "footer tag is empty");

			pageWidget = new Page();
			pageWidget._buildFooter(dataPageElement);

			strictEqual(pageWidget.options.footer, true, "Option footer is set correct");
			strictEqual(dataPageElement.querySelector("[data-role='footer']").tagName, "DIV", "footer tag exists");
			strictEqual(pageWidget._ui.footer, dataPageElement.querySelector("[data-role='footer']"), "footer tag exists");
			strictEqual(dataPageElement.querySelector("[data-role='footer']").textContent, "Footer", "footer tag is empty");

			pageWidget = new Page();
			pageWidget._buildFooter(secondPageElement);

			strictEqual(pageWidget.options.footer, false, "Option footer is set correct");
			strictEqual(pageWidget._ui.footer, secondPageElement.querySelector(".ui-footer"), "footer tag exists");
			strictEqual(secondPageElement.querySelector(".ui-footer"), null, "footer tag exists");

			pageWidget = new Page();
			pageWidget.options.footer = false;
			pageWidget._buildFooter(secondPageElement);

			strictEqual(pageWidget.options.footer, false, "Option footer is set correct");
			strictEqual(pageWidget._ui.footer, secondPageElement.querySelector(".ui-footer"), "footer tag exists");
			strictEqual(secondPageElement.querySelector(".ui-footer"), null, "footer tag exists");

			pageWidget = new Page();
			pageWidget.options.footer = true;
			pageWidget._buildFooter(secondPageElement);

			strictEqual(pageWidget.options.footer, true, "Option footer is set correct");
			strictEqual(pageWidget._ui.footer, secondPageElement.querySelector(".ui-footer"), "footer tag exists");
			strictEqual(secondPageElement.querySelector(".ui-footer").textContent, "", "footer tag is empty");

		});

		test("_buildContent", function () {
			var pageWidget = new Page(),
				firstPageElement = document.getElementById("first"),
				tagsPageElement = document.getElementById("tags"),
				dataPageElement = document.getElementById("data"),
				secondPageElement = document.getElementById("second");

			pageWidget._buildContent(firstPageElement);

			strictEqual(pageWidget.options.content, true, "Option content is set correct");
			strictEqual(pageWidget._ui.content, firstPageElement.querySelector(".ui-content"), "content tag exists");
			strictEqual(secondPageElement.querySelector(".ui-content"), null, "content tag exists");

			pageWidget = new Page();
			pageWidget._buildContent(tagsPageElement);

			strictEqual(pageWidget.options.content, false, "Option content is set correct");
			strictEqual(pageWidget._ui.content, tagsPageElement.querySelector(".ui-content"), "content tag exists");

			pageWidget = new Page();
			pageWidget._buildContent(dataPageElement);

			strictEqual(pageWidget.options.content, true, "Option content is set correct");
			strictEqual(pageWidget._ui.content, dataPageElement.querySelector(".ui-content"), "content tag exists");
			strictEqual(dataPageElement.querySelector(".ui-content").textContent, "Content", "content tag is empty");

			pageWidget = new Page();
			pageWidget._buildContent(secondPageElement);

			strictEqual(pageWidget._ui.content, secondPageElement.querySelector(".ui-content"), "content tag exists");
			strictEqual(secondPageElement.querySelector(".ui-content"), null, "content tag exists");
			strictEqual(pageWidget.options.content, false, "Option content is set correct");

			pageWidget = new Page();
			pageWidget.options.content = false;
			pageWidget._buildContent(secondPageElement);

			strictEqual(pageWidget._ui.content, secondPageElement.querySelector(".ui-content"), "content tag exists");
			strictEqual(secondPageElement.querySelector(".ui-content"), null, "content tag exists");
			strictEqual(pageWidget.options.content, false, "Option content is set correct");

			pageWidget = new Page();
			pageWidget.options.content = true;
			pageWidget._buildContent(secondPageElement);

			strictEqual(pageWidget.options.content, true, "Option content is set correct");
			strictEqual(pageWidget._ui.content, secondPageElement.querySelector(".ui-content"), "content tag exists");
			strictEqual(pageWidget._ui.content, secondPageElement.querySelector(".ui-content"), "content tag exists");
			strictEqual(secondPageElement.querySelector(".ui-content").textContent, "Second", "content tag is empty");
		});

		test("_build", function () {
			var pageWidget = new Page(),
				firstPageElement = document.getElementById("first"),
				tagsPageElement = document.getElementById("tags"),
				dataPageElement = document.getElementById("data"),
				secondPageElement = document.getElementById("second");

			pageWidget._build(firstPageElement);

			strictEqual(firstPageElement.classList.contains("ui-page"), true, "Page has correct class");

			pageWidget = new Page();
			pageWidget._build(tagsPageElement);

			strictEqual(tagsPageElement.classList.contains("ui-page"), true, "Page has correct class");

			pageWidget = new Page();
			pageWidget._build(dataPageElement);

			strictEqual(dataPageElement.classList.contains("ui-page"), true, "Page has correct class");

			pageWidget = new Page();
			pageWidget._build(secondPageElement);

			strictEqual(secondPageElement.classList.contains("ui-page"), true, "Page has correct class");
		});

		test("setActive/isActive", function () {
			var pageWidget = new Page(),
				firstPageElement = document.getElementById("first");

			pageWidget.element = firstPageElement;
			pageWidget.setActive(true);

			strictEqual(firstPageElement.classList.contains("ui-page-active"), true, "Page has correct class");
			strictEqual(pageWidget.isActive(), true, "Page has correct class");

			pageWidget.setActive(false);

			strictEqual(firstPageElement.classList.contains("ui-page-active"), false, "Page has correct class");
			strictEqual(pageWidget.isActive(), false, "Page has correct class");
		});

		test("focus/blur", function () {
			var pageWidget = new Page(),
				firstPageElement = document.getElementById("first"),
				secondPageElement = document.getElementById("second");

			firstPageElement.classList.add("ui-page-active");
			pageWidget.element = firstPageElement;
			pageWidget.focus();

			strictEqual(document.activeElement && document.activeElement.id, "input", "Page has correct class");

			pageWidget.blur();

			strictEqual(document.activeElement, document.body, "Page has correct class");

			secondPageElement.classList.add("ui-page-active");
			pageWidget.element = secondPageElement;
			pageWidget.focus();

			strictEqual(document.activeElement && document.activeElement.id, "second", "Page has correct class");

			pageWidget.blur();

			strictEqual(document.activeElement, document.body, "Page has correct class");
		});

		test("_bindEvents", function () {
			var pageWidget = new Page(),
				firstPageElement = document.getElementById("first");

			pageWidget.element = firstPageElement;
			pageWidget._bindEvents();

			strictEqual(typeof pageWidget._contentFillAfterResizeCallback, "function", "Callback on resize is initialized");

			pageWidget = new Page();
			pageWidget.element = firstPageElement;

			pageWidget._contentFill = function (event) {
				strictEqual(this, pageWidget, "Calback on resize is called in widget scope");
				strictEqual(event.type, "resize", "Callback is called on resize event");
			};

			pageWidget._bindEvents();
			helpers.triggerEvent(window, "resize");
			// clear to eliminate duplicated events in other tests
			window.removeEventListener("resize", pageWidget._contentFillAfterResizeCallback, false);
		});

		test("onBeforeShow", 1, function () {
			var pageWidget = new Page(),
				firstPageElement = document.getElementById("first");

			pageWidget.element = firstPageElement;
			pageWidget.on("pagebeforeshow", function (event) {
				strictEqual(event.target, firstPageElement, "Callback is called on pagebeforeshow event");
			});
			pageWidget.onBeforeShow();
		});

		test("onBeforeHide", 1, function () {
			var pageWidget = new Page(),
				firstPageElement = document.getElementById("first");

			pageWidget.element = firstPageElement;
			pageWidget.on("pagebeforehide", function (event) {
				strictEqual(event.target, firstPageElement, "Callback is called on pagebeforehide event");
			});
			pageWidget.onBeforeHide();
		});

		test("onShow", function () {
			var pageWidget = new Page(),
				firstPageElement = document.getElementById("first");

			// this test is only for karma we have 5 assertions,
			// in qunit tauPerf is disabled and we will have only 2 assertions
			// qunit work on production version and require remove tauPerf code
			if (window.__karma__) {
				expect(3);
			} else {
				expect(1);
			}
			pageWidget.element = firstPageElement;
			pageWidget.on("pageshow", function (event) {
				strictEqual(event.target, firstPageElement, "Callback is called on pageshow event");
			});
			pageWidget.onShow();

			// this test is only for karma, in qunit tauPerf is disabled.
			if (window.__karma__) {
				helpers.stub(window, "tauPerf", {
					get: function () {
						ok(true, "TauPerf was run");
					}
				});

				pageWidget.onShow();

				helpers.restoreStub(window, "tauPerf");
			}
		});

		test("onHide", 1, function () {
			var pageWidget = new Page(),
				firstPageElement = document.getElementById("first");

			pageWidget.element = firstPageElement;
			pageWidget.on("pagehide", function (event) {
				strictEqual(event.target, firstPageElement, "Callback is called on pagehide event");
			});
			pageWidget.onHide();
		});

		test("_refresh", 2, function () {
			var pageWidget = new Page(),
				firstPageElement = document.getElementById("first"),
				contentElement = firstPageElement.querySelector(".ui-content");

			pageWidget.element = firstPageElement;
			pageWidget._initialContentStyle.marginTop = "20px";
			pageWidget._refresh();
			strictEqual(contentElement.style.marginTop, "20px", "Content's width is set correct");

			pageWidget._contentFill = function () {
				strictEqual(this, pageWidget, "Function called in widget scope");
			};

			pageWidget._refresh();
		});

		test("layout", 2, function () {
			var pageWidget = new Page(),
				firstPageElement = document.getElementById("first"),
				contentElement = firstPageElement.querySelector(".ui-content");

			pageWidget.element = firstPageElement;
			contentElement.style.marginTop = "20px";

			pageWidget.layout();
			strictEqual(pageWidget._initialContentStyle.marginTop, "20px", "Content's width is set correct");

			pageWidget._contentFill = function () {
				strictEqual(this, pageWidget, "Function called in widget scope");
			};

			pageWidget.layout();
		});

		test("_destroy", 3, function () {
			var pageWidget = new Page(),
				firstPageElement = document.getElementById("first");

			helpers.stub(engine, "destroyAllWidgets", function () {
				ok(true, "Destroy widgets was called");
			});
			pageWidget._destroy(firstPageElement);
			helpers.restoreStub(engine, "destroyAllWidgets");

			pageWidget = new Page();

			pageWidget._contentFill = function (event) {
				strictEqual(this, pageWidget, "Calback on resize is called in widget scope");
				strictEqual(event.type, "resize", "Callback is called on resize event");
			};

			pageWidget.element = firstPageElement;
			pageWidget._bindEvents();
			helpers.triggerEvent(window, "resize");
			pageWidget._destroy();
			helpers.triggerEvent(window, "resize");
		});

		test("createEmptyElement", function () {
			var pageElement = Page.createEmptyElement();

			strictEqual(pageElement.tagName, "DIV", "Create div element");
			strictEqual(pageElement.className, "ui-page", "add ui-page class to element");
		});

		test("constructor", function () {
			var pageWidget = new Page();

			strictEqual(pageWidget.options.header, undefined, "Option header is set correct");
			strictEqual(pageWidget.options.content, undefined, "Option content is set correct");
			strictEqual(pageWidget.options.footer, undefined, "Option footer is set correct");

			pageWidget._configure();

			strictEqual(pageWidget.options.header, null, "Option header is set correct");
			strictEqual(pageWidget.options.content, null, "Option content is set correct");
			strictEqual(pageWidget.options.footer, null, "Option footer is set correct");
		});

		test("_setAria", function () {
			var pageElement = document.getElementById("aria"),
				pageWidget = new Page(),
				ui = {
					header: pageElement.children[0],
					content: pageElement.children[1],
					footer: pageElement.children[2],
					title: pageElement.children[0].children[0]
				};

			pageWidget._ui = ui;
			pageWidget._setAria();
			equal(ui.header.getAttribute("role"), "header", "role is set on header");
			equal(ui.content.getAttribute("role"), "main", "role is set on content");
			equal(ui.footer.getAttribute("role"), "footer", "role is set on footer");
			equal(ui.title.getAttribute("role"), "heading", "role is set on title");
			equal(ui.title.getAttribute("aria-level"), 1, "aria-level is set on title");
			equal(ui.title.getAttribute("aria-label"), "title", "aria-label is set on title");
			// we test that method not throw exception
		});

		test("_setTitle", function () {
			ok(true, "Test disabled");
			/* test disabled
			var pageElement = document.getElementById("title-h1"),
				pageWidget = new Page(),
				ui = {
					header: pageElement.children[0]
				};

			pageWidget._ui = ui;
			pageWidget._setTitle(pageElement);
			equal(pageElement.dataset.title, "Header", "title was found");
			equal(ui.title, ui.header.children[0], "title was found");

			pageElement = document.getElementById("title-h6");
			pageWidget = new Page();
			ui = {
				header: pageElement.children[0]
			};

			pageWidget._ui = ui;
			pageWidget._setTitle(pageElement);
			equal(pageElement.dataset.title, "Header", "title was found");
			equal(ui.title, ui.header.children[0], "title was found");

			pageElement = document.getElementById("data-title");
			pageWidget = new Page();
			ui = {
				header: pageElement.children[0]
			};

			pageWidget._ui = ui;
			pageWidget._setTitle(pageElement);
			equal(pageElement.dataset.title, "title", "title was found");
			equal(ui.title, undefined, "title was not found");
			*/
		});


		test("_build", 3, function () {
			var pageWidget = new Page(),
				firstPageElement = document.getElementById("aria");

			pageWidget._setTitle = function (element) {
				equal(element, firstPageElement, "_setTitle was called with correct element");
			};
			pageWidget._setAria = function () {
				ok(true, "_setAria was called");
			};
			pageWidget._build(firstPageElement);

			strictEqual(firstPageElement.classList.contains("ui-page"), true, "Page has correct class");
		});

		test("_contentFill", function () {
			var pageWidget = new Page(),
				pageElement = document.getElementById("aria"),
				content = pageElement.children[1],
				ui = {
					header: pageElement.children[0],
					content: content,
					footer: pageElement.children[2],
					title: pageElement.children[0].children[0]
				};

			pageWidget._ui = ui;
			pageWidget.element = pageElement;
			pageWidget._contentFill();

			// ok(height === window.innerHeight - 67 - 100 ||
			// 	height === window.innerHeight - 68 - 100, "content height was set correct");
			notEqual(content.style.height.indexOf("px"), -1, "content height was set correct (px)");
		});

		test("createEmptyElement", function () {
			var pageElement = Page.createEmptyElement();

			strictEqual(pageElement.tagName, "DIV", "Create div element");
			strictEqual(pageElement.className, "ui-page", "add ui-page class to element");
		});
	}

	if (typeof define === "function") {
		define([
			"../../../../../../src/js/core/engine"
		], function (engine) {
			return runTests.bind(null, engine);
		});
	} else {
		runTests(tau.engine,
			tau.widget.core.Page,
			window.helpers);
	}
}());
