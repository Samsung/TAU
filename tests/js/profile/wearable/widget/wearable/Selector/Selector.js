/*global QUnit, define, expect, tau*/
QUnit.config.reorder = false;

(function () {
	"use strict";
	function runTests(Selector, helpers) {
		function initHTML() {
			return new Promise(function (resolve) {
				var HTML = helpers.loadHTMLFromFile("/base/tests/js/profile/wearable/widget/wearable/Selector/test-data/sample.html"),
					parent = document.getElementById("qunit-fixture") || helpers.initFixture();

				parent.innerHTML = HTML;
				helpers.loadTAUStyle(document, "wearable", function () {
					resolve();
				});
			});
		}

		QUnit.module("profile/wearable/widget/wearable/Selector", {
			setup: initHTML
		});

		QUnit.test("_configure", 9, function (assert) {
			var selector = new Selector();

			selector._configure();

			assert.equal(selector.options.itemSelector, ".ui-item", "itemSelector is '.ui-item'");
			assert.equal(selector.options.indicatorSelector, ".ui-selector-indicator", "indicatorSelector is '.ui-selector-indicator'");
			assert.equal(selector.options.indicatorTextSelector, ".ui-selector-indicator-text", "indicatorTextSelector is '.ui-selector-indicator-text'");
			assert.equal(selector.options.indicatorArrowSelector, ".ui-selector-indicator-arrow", "indicatorArrowSelector is '.ui-selector-indicator-arrow'");
			assert.equal(selector.options.itemDegree, 30, "itemDegree is 30");
			assert.equal(selector.options.itemRadius, -1, "itemRadius is -1");
			assert.equal(selector.options.maxItemNumber, 11, "maxItemNumber is 11");
			assert.equal(selector.options.indicatorAutoControl, true, "indicatorAutoControl is true");
			assert.equal(selector.options.emptyStateText, "Selector is empty", "emptyStateText is 'Selector is empty'");
		});

		QUnit.test("_buildIndicator", function () {
			expect(0);
		});

		QUnit.test("_build", 2, function (assert) {
			var selector = new Selector(),
				element = document.getElementById("selector");

			selector.element = element;
			selector._configure();
			selector._build(element);
			selector._init(element);

			assert.equal(selector._ui.items.length, 33, "item length is 33");
			assert.equal(selector._ui.layers.length, 3, "layer length is 3");
		});

		QUnit.test("_init", 2, function (assert) {
			var selector = new Selector(),
				element = document.getElementById("selector");

			selector.element = element;
			selector._configure();
			selector._build(element);
			selector._init(element);

			assert.equal(selector._activeItemIndex, 0, "activeItemIndex is 0");
			assert.equal(selector._activeLayerIndex, 0, "activeLayerIndex is 0");
		});

		QUnit.test("_initItems", function () {
			expect(0);
		});

		QUnit.test("_animateReorderedItems", function () {
			expect(0);
		});

		QUnit.test("_addIconRemove", 1, function (assert) {
			var selector = new Selector(),
				element = document.getElementById("selector"),
				activeItem = null;

			selector._configure();
			selector._build(element);

			activeItem = selector._getActiveItem();

			assert.equal(selector._activeItemIndex, 0, "activeItemIndex is 0");
		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.widget.wearable.Selector,
			window.helpers);
	}
}());
