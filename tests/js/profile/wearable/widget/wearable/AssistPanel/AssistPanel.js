/* global QUnit, define, tau */
(function () {
	"use strict";
	function runTests(AssistPanel, helpers) {

		function initHTML() {
			return new Promise(function (resolve) {
				var HTML = helpers.loadHTMLFromFile("/base/tests/js/profile/wearable/widget/wearable/AssistPanel/test-data/sample.html"),
					parent = document.getElementById("qunit-fixture") || helpers.initFixture();

				parent.innerHTML = HTML;
				helpers.loadTAUStyle(document, "wearable", function () {
					resolve();
				});
			});
		}

		function clearHTML() {
			helpers.removeTAUStyle(document);
		}

		QUnit.module("profile/wearable/widget/wearable/AssistPanel", {
			setup: initHTML,
			teardown: clearHTML
		});

		/**
		 * @type unit
		 */
		QUnit.test("constructor", 2, function (assert) {
			var assistPanel;

			// tested method
			assistPanel = new AssistPanel();

			// assertions
			assert.deepEqual(assistPanel._callbacks, {
				onClick: null
			});
			assert.ok(AssistPanel.prototype instanceof tau.widget.core.Drawer, "AssistPanel inherited from Drawer");
		});

		/**
		 * @type unit
		 */
		QUnit.test("_configure", 3, function (assert) {
			var assistPanel = new AssistPanel();

			// tested method
			assistPanel._configure();

			// assertions
			assert.equal(assistPanel.options.width, 0, "options 'width' equal '0'");
			assert.equal(assistPanel.options.position, "down", "options 'position' equal 'down'");
			assert.equal(assistPanel.options.overlay, false, "options 'overlay' is false");
		});

		/**
		 * @type unit
		 */
		QUnit.test("_addIndicator", 4, function (assert) {
			var assistPanel = new AssistPanel(),
				element = document.createElement("div");

			// tested method
			assistPanel._addIndicator(element);

			// assertions
			assert.ok(assistPanel._ui.indicator instanceof HTMLElement, "element indicator exists in `_ui` object");
			assert.equal(assistPanel._ui.indicator.tagName, "DIV", "indicator element has proper html tag name");
			assert.ok(assistPanel._ui.indicator.classList.contains("ui-assist-panel-indicator"), "indicator has class 'ui-assist-panel-indicator'");
			assert.equal(element.firstChild, assistPanel._ui.indicator, "indicator has been added to given parent element");
		});

		/**
		 * @type unit
		 */
		QUnit.test("_build (options.overlay:false)", 6, function (assert) {
			var assistPanel = new AssistPanel(),
				element = document.createElement("div"),
				result;

			// perpare stubs
			helpers.stub(tau.widget.core.Drawer.prototype, "_build", function (element) {
				assert.ok(true, "_build on iherited widget was called");
				assert.ok(!!element, "_build method has provided element");
				return true;
			});
			assistPanel._addIndicator = function (parentElement) {
				assert.ok(true, "called _addIndicator");
				assert.equal(parentElement, assistPanel._ui.targetElement, "_addIndicator method has provided parent element");
			};
			assistPanel._ui = assistPanel._ui || {};
			assistPanel._ui.targetElement = document.createElement("div");
			assistPanel._ui.drawerOverlay = document.createElement("div");
			assistPanel.options = assistPanel.options || {};
			assistPanel.options.overlay = false;

			// tested method
			result = assistPanel._build(element);

			// assertions
			assert.equal(result, element, "result of _build method is the same object as provided element");
			assert.ok(!assistPanel._ui.drawerOverlay.classList.contains("ui-assist-panel-overlay"), "overlay element doesn't have class 'ui-assist-panel-overlay'");

			// restore stubs
			helpers.restoreStub(tau.widget.core.Drawer.prototype, "_build");
		});

		/**
		 * @type unit
		 */
		QUnit.test("_build (options.overlay:true)", 6, function (assert) {
			var assistPanel = new AssistPanel(),
				element = document.createElement("div"),
				result;

			// perpare stubs
			helpers.stub(tau.widget.core.Drawer.prototype, "_build", function (element) {
				assert.ok(true, "_build on iherited widget was called");
				assert.ok(!!element, "_build method has provided element");
				return true;
			});
			assistPanel._addIndicator = function (parentElement) {
				assert.ok(true, "called _addIndicator");
				assert.equal(parentElement, assistPanel._ui.targetElement, "_addIndicator method has provided parent element");
			};
			assistPanel._ui = assistPanel._ui || {};
			assistPanel._ui.targetElement = document.createElement("div");
			assistPanel._ui.drawerOverlay = document.createElement("div");
			assistPanel.options = assistPanel.options || {};
			assistPanel.options.overlay = true;

			// tested method
			result = assistPanel._build(element);

			// assertions
			assert.equal(result, element, "result of _build method is the same object as provided element");
			assert.ok(assistPanel._ui.drawerOverlay.classList.contains("ui-assist-panel-overlay"), "overlay element doesn't have class 'ui-assist-panel-overlay'");

			// restore stubs
			helpers.restoreStub(tau.widget.core.Drawer.prototype, "_build");
		});

		/**
		 * @type unit
		 */
		QUnit.test("_onSwipe (event has direction down)", 3, function (assert) {
			var assistPanel = new AssistPanel(),
				event = {
					detail: {
						direction: "down"
					}
				};

			// perpare stubs
			helpers.stub(tau.widget.core.Drawer.prototype, "_onSwipe", function (event) {
				assert.ok(true, "_onSwipe on iherited widget was called");
				assert.ok(!!event, "_onSwipe method has provided event object");
				return true;
			});
			assistPanel.close = function () {
				assert.ok(true, "called close method");
			};

			// tested method
			assistPanel._onSwipe(event);

			// restore stubs
			helpers.restoreStub(tau.widget.core.Drawer.prototype, "_onSwipe");
		});

		/**
		 * @type unit
		 */
		QUnit.test("_onSwipe (event has not direction down)", 2, function (assert) {
			var assistPanel = new AssistPanel(),
				event = {
					detail: {
						direction: "any"
					}
				};

			// perpare stubs
			helpers.stub(tau.widget.core.Drawer.prototype, "_onSwipe", function (event) {
				assert.ok(true, "_onSwipe on iherited widget was called");
				assert.ok(!!event, "_onSwipe method has provided event object");
				return true;
			});
			assistPanel.close = function () {
				assert.ok(false, "close method cannot be called when direction is different than 'down'");
			};

			// tested method
			assistPanel._onSwipe(event);

			// restore stubs
			helpers.restoreStub(tau.widget.core.Drawer.prototype, "_onSwipe");
		});

		/**
		 * @type unit
		 */
		QUnit.test("_bindEvents", 2, function (assert) {
			var assistPanel = new AssistPanel(),
				onClick = function () {
					// noop
				};

			// perpare stubs
			helpers.stub(tau.widget.core.Drawer.prototype, "_bindEvents", function () {
				assert.ok(true, "_bindEvents on iherited widget was called");
				return true;
			});
			assistPanel._ui.indicator = document.createElement("div");
			assistPanel._callbacks.onClick = onClick;

			// tested method
			assistPanel._bindEvents();

			assert.notEqual(assistPanel._callbacks.onClick, onClick, "new onClick handler has been added");

			// restore stubs
			helpers.restoreStub(tau.widget.core.Drawer.prototype, "_bindEvents");
		});

		/**
		 * @type unit
		 */
		QUnit.test("_unbindEvents", 2, function (assert) {
			var assistPanel = new AssistPanel(),
				onClick = function () {
					// noop
				};

			// perpare stubs
			assistPanel._callbacks.onClick = onClick;
			assistPanel._ui = {
				indicator: {
					removeEventListener: function (eventName, callback) {
						assert.equal(eventName, "vclick", "removeEventListener has been called");
						assert.equal(callback, onClick, "rmoved properly event handler");
					}
				}
			}

			// tested method
			assistPanel._unbindEvents();
		});

		/**
		 * @type unit
		 */
		QUnit.test("_destroy", 2, function (assert) {
			var assistPanel;

			// perpare stubs
			helpers.stub(tau.widget.core.Drawer.prototype, "_destroy", function () {
				assert.ok(true, "_destroy on iherited widget was called");
				return true;
			});
			// create widget instance
			assistPanel = new AssistPanel();

			assistPanel._unbindEvents = function () {
				assert.ok(true, "called _unbindEvents");
			};

			// tested method
			assistPanel._destroy();

			// restore stubs
			helpers.restoreStub(tau.widget.core.Drawer.prototype, "_destroy");
		});

	}
	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.widget.wearable.AssistPanel,
			window.helpers,
			tau);
	}
}());
