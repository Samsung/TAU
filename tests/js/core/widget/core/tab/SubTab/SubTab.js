/* global test, define, tau */
(function () {
	"use strict";
	function runTests(SubTab, helpers, ns) {

		ns = ns || window.ns;

		function initHTML() {
			var HTML = helpers.loadHTMLFromFile("/base/tests/js/core/widget/core/tab/SubTab/test-data/sample.html"),
				parent = document.getElementById("qunit-fixture") || helpers.initFixture();

			parent.innerHTML = HTML;
		}

		module("core/widget/core/tab/SubTab", {
			setup: initHTML
		});

		test("constructor", 3, function (assert) {
			var element = document.getElementById("sub-tab-normal");

			helpers.checkWidgetBuild("SubTab", element, ns);

			assert.ok(element.classList.contains("ui-sub-tab"), "SubTab has ui-sub-tab class");
		});

		test("constructor - fail building", 2, function (assert) {
			var element = document.getElementById("sub-tab-no-tabs");

			helpers.checkWidgetBuild("SubTab", element, ns, true);

			assert.ok(element.classList.contains("ui-sub-tab"), "SubTab has ui-sub-tab class");
		});

		test("_configure", 1, function (assert) {
			var element = document.getElementById("sub-tab-normal"),
				widget = new SubTab();

			widget._configure(element);

			assert.equal(widget.options.active, 0, "Option active should be set to 0");

		});

		test("_buildTabsAndLinks", 8, function (assert) {
			var element = document.getElementById("sub-tab-with-title"),
				widget = new SubTab();

			assert.equal(widget._buildTabsAndLinks(element), true, "Build links was finished with true");

			assert.ok(widget._ui.links[0].classList.contains("ui-sub-tab-anchor"), "Link 0 has anchor class.");
			assert.ok(widget._ui.links[1].classList.contains("ui-sub-tab-anchor"), "Link 1 has anchor class.");
			assert.ok(widget._ui.links[1].classList.contains("ui-tab-no-text"), "Link 1 has no-text class.");

			assert.equal(widget._ui.links[0].firstChild.tagName, "SPAN", "Link 0 has span child.");

			assert.ok(widget._ui.tabs.length, "Tabs are correct detected");
			assert.ok(widget._ui.links.length, "Links are correct detected");

			element = document.getElementById("sub-tab-no-tabs");

			assert.equal(widget._buildTabsAndLinks(element), false, "Build links was finished with false on no links");
		});

		test("_initOrientation", 3, function (assert) {
			var element = document.getElementById("sub-tab-with-title"),
				widget = new SubTab();

			widget._initOrientation(element);

			if (window.innerWidth < window.innerHeight) {
				assert.ok(element.classList.contains("ui-sub-tab-portrait"), "Class portrait was set.");
				assert.ok(!element.classList.contains("ui-sub-tab-landscape"), "Class landscape was set.");
				assert.equal(widget._type.orientation, "portrait", "Type was set as portrait.");
			} else {
				assert.ok(!element.classList.contains("ui-sub-tab-portrait"), "Class portrait was set.");
				assert.ok(element.classList.contains("ui-sub-tab-landscape"), "Class landscape was set.");
				assert.equal(widget._type.orientation, "landscape", "Type was set as landscape.");
			}
		});

		test("_initStaticAndWidths", 2, function (assert) {
			var element = document.getElementById("sub-tab-with-title"),
				tabElements = element.querySelectorAll("li"),
				widget = new SubTab();

			widget._ui = {
				tabs: tabElements
			};

			widget._build(element);
			widget._initStaticAndWidths(element);

			assert.equal(widget._type.static, true, "Type was set as static.");

			element = document.getElementById("sub-tab-before-title");
			tabElements = element.querySelectorAll("li");

			widget._ui = {
				tabs: tabElements
			};

			widget._build(element);
			widget._initStaticAndWidths(element);

			assert.equal(widget._type.static, false, "Type wasn't set as static.");
		});

		test("_init", 6, function (assert) {
			var element = document.getElementById("sub-tab-with-title"),
				widget = new SubTab();

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
		runTests(tau.widget.core.SubTab,
			window.helpers,
			tau);
	}

}());
