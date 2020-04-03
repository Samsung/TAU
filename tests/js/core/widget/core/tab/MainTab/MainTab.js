/* global test, ok, equal, define, tau */
(function () {
	"use strict";
	function runTests(MainTab, helpers, ns) {

		ns = ns || window.ns;

		function initHTML() {
			var HTML = helpers.loadHTMLFromFile("/base/tests/js/core/widget/core/tab/MainTab/test-data/sample.html"),
				parent = document.getElementById("qunit-fixture") || helpers.initFixture();

			parent.innerHTML = HTML;
		}

		module("core/widget/core/tab/MainTab", {
			setup: initHTML
		});

		test("constructor", 3, function (assert) {
			var element = document.getElementById("main-tab-normal");

			helpers.checkWidgetBuild("MainTab", element, ns);

			assert.ok(element.classList.contains("ui-main-tab"), "MainTab has ui-main-tab class");
		});

		test("constructor - fail building", 2, function (assert) {
			var element = document.getElementById("main-tab-no-tabs");

			helpers.checkWidgetBuild("MainTab", element, ns, true);

			assert.ok(element.classList.contains("ui-main-tab"), "MainTab has ui-main-tab class");
		});

		test("_configure", 1, function (assert) {
			var element = document.getElementById("main-tab-normal"),
				widget = new MainTab();

			widget._configure(element);

			assert.equal(widget.options.active, 0, "Option active should be set to 0");

		});

		test("_detectType", 12, function (assert) {
			var element = document.getElementById("main-tab-with-title"),
				tabbarTitle = element.previousElementSibling,
				widget = new MainTab();

			widget._detectType(element);

			assert.equal(widget._type.withTitle, true, "Type is correct set for title");
			assert.equal(widget._type.withIcon, true, "Type is correct set for icons");

			assert.ok(tabbarTitle.parentNode.classList.contains("ui-tabs-with-title"), "Tabs has class ui-tabs-with-title");
			assert.ok(element.classList.contains("ui-main-tab-with-title"), "Element has class ui-main-tab-with-title");
			assert.ok(!element.classList.contains("ui-main-tab-before-title"), "Element has class ui-main-tab-before-title");
			assert.ok(element.classList.contains("ui-main-tab-with-icon"), "Element has class ui-main-tab-with-icon");

			element = document.getElementById("main-tab-before-title");
			tabbarTitle = element.nextElementSibling;

			widget._detectType(element);

			assert.equal(widget._type.withTitle, true, "Type is correct set for title");
			assert.equal(widget._type.withIcon, true, "Type is correct set for icons");

			assert.ok(tabbarTitle.parentNode.classList.contains("ui-tabs-with-title"), "Tabs has class ui-tabs-with-title");
			assert.ok(element.classList.contains("ui-main-tab-with-title"), "Element has class ui-main-tab-with-title");
			assert.ok(element.classList.contains("ui-main-tab-before-title"), "Element has class ui-main-tab-before-title");
			assert.ok(element.classList.contains("ui-main-tab-with-icon"), "Element has class ui-main-tab-with-icon");
		});

		test("_buildTabsAndLinks", 8, function (assert) {
			var element = document.getElementById("main-tab-with-title"),
				widget = new MainTab();

			assert.equal(widget._buildTabsAndLinks(element), true, "Build links was finished with true");

			assert.ok(widget._ui.links[0].classList.contains("ui-main-tab-anchor"), "Link 0 has anchor class.");
			assert.ok(widget._ui.links[1].classList.contains("ui-main-tab-anchor"), "Link 1 has anchor class.");
			assert.ok(widget._ui.links[1].classList.contains("ui-tab-no-text"), "Link 1 has no-text class.");

			assert.equal(widget._ui.links[0].firstChild.tagName, "SPAN", "Link 0 has span child.");

			assert.ok(widget._ui.tabs.length, "Tabs are correct detected");
			assert.ok(widget._ui.links.length, "Links are correct detected");

			element = document.getElementById("main-tab-no-tabs");

			assert.equal(widget._buildTabsAndLinks(element), false, "Build links was finished with false on no links");
		});

		test("_initOrientation", 3, function (assert) {
			var element = document.getElementById("main-tab-with-title"),
				widget = new MainTab();

			widget._initOrientation(element);

			if (window.innerWidth < window.innerHeight) {
				assert.ok(element.classList.contains("ui-main-tab-portrait"), "Class portrait was set.");
				assert.ok(!element.classList.contains("ui-main-tab-landscape"), "Class landscape was set.");
				assert.equal(widget._type.orientation, "portrait", "Type was set as portrait.");
			} else {
				assert.ok(!element.classList.contains("ui-main-tab-portrait"), "Class portrait was set.");
				assert.ok(element.classList.contains("ui-main-tab-landscape"), "Class landscape was set.");
				assert.equal(widget._type.orientation, "landscape", "Type was set as landscape.");
			}
		});

		test("_initStaticAndWidths", 1, function (assert) {
			var element = document.getElementById("main-tab-with-title"),
				tabElements = element.querySelectorAll("li"),
				widget = new MainTab();

			widget._ui = {
				tabs: tabElements
			};

			widget._build(element);
			widget._initStaticAndWidths(element);

			assert.equal(widget._type.static, true, "Type was set as static.");
		});

		test("_init", 6, function (assert) {
			var element = document.getElementById("main-tab-with-title"),
				widget = new MainTab();

			widget._initOrientation = function (_element) {
				assert.equal(_element, element, "Passed element to function _initOrientation");
			};
			widget._initStaticAndWidths = function (_element) {
				assert.equal(_element, element, "Passed element to function _initStaticAndWidths");
			};
			widget._setActive = function (activeIndex) {
				assert.equal(activeIndex, 0, "Passed 0 as index to function _setActive");
			};

			assert.equal(widget._init(element), element, "_init return element");

			assert.equal(widget._translatedX, 0, "Set _translatedX as 0");
			assert.equal(widget._lastX, 0, "Set _lastX as 0");
		});

	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.widget.core.MainTab,
			window.helpers,
			tau);
	}

}());
