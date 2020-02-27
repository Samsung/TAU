/* global QUnit, ns, define, tau, Promise, expect, start */
(function () {
	"use strict";
	function runTests(ArcListview, helpers) {
		function initHTML() {
			return new Promise(function (resolve) {
				var HTML = helpers.loadHTMLFromFile("/base/tests/js/profile/wearable/widget/wearable/ArcListview/test-data/sample.html"),
					parent = document.getElementById("qunit-fixture") || helpers.initFixture();

				parent.innerHTML = HTML;
				helpers.loadTAUStyle(document, "wearable", function () {
					resolve();
				});
			});
		}

		function nop() {
			// nop method;
		}
		function clearHTML() {
			helpers.removeTAUStyle(document);
		}

		QUnit.module("profile/wearable/widget/wearable/ArcListview", {
			setup: initHTML,
			teardown: clearHTML
		});

		QUnit.test("constructor", function (assert) {
			var arclistWidget = new ArcListview();

			assert.deepEqual(arclistWidget._ui, {
				scroller: null,
				selection: null,
				arcListviewCarousel: null,
				arcListviewSelection: null,
				dummyElement: null,
				header: null
			}, "_ui was correct initialized");

			assert.deepEqual(arclistWidget.options, {
				bouncingTimeout: 1000,
				visibleItems: 3,
				ellipsisA: 333,
				ellipsisB: 180,
				selectedIndex: 0,
				dataLength: 0,
				listItemUpdater: null,
				focusedTitle: true
			}, "options was correct initialized");
		});

		QUnit.test("createItem", function (assert) {
			assert.deepEqual(ArcListview.createItem(), {
				element: null,
				id: 0,
				y: 0,
				rect: null,
				current: {
					scale: -1
				},
				from: null,
				to: null,
				repaint: false
			}, "createItem return correct object");
		});

		QUnit.test("calcFactors", function (assert) {
			var factors = ArcListview.calcFactors(333, 180);

			assert.equal(factors.length, 181, "calcFactors return correct array");
			assert.equal(factors[0], 1, "calcFactors return correct value at 0");
			assert.equal(factors[factors.length - 1], 0, "calcFactors return correct value at last position");
		});

		QUnit.test("getSelectedIndex", function (assert) {
			var ArclistWidget = new ArcListview();

			expect(1);

			ArclistWidget._state.currentIndex = 3;

			assert.equal(ArclistWidget.getSelectedIndex(), 3, "getSelectedIndex return correct value.");
		});

		QUnit.test("scrollToPosition", function (assert) {
			var ArclistWidget = new ArcListview();

			expect(12);

			ArclistWidget._state.items.length = 3;
			ArclistWidget._state.currentIndex = 4;

			ArclistWidget.trigger = function (name, data) {
				assert.equal(name, "change", "Triggered event change");
				assert.equal(data.unselected, 4, "Triggered event with correct data");
			};

			ArclistWidget._roll = function () {
				assert.ok(true, "_roll was called");
			};

			ArclistWidget.scrollToPosition(1);

			assert.equal(ArclistWidget._state.toIndex, 1, "scrollToPosition change to index.");

			ArclistWidget.scrollToPosition(20);

			assert.equal(ArclistWidget._state.toIndex, 2, "scrollToPosition change to index.");

			ArclistWidget.scrollToPosition(-2);

			assert.equal(ArclistWidget._state.toIndex, 0, "scrollToPosition change to index.");
		});

		QUnit.test("_updateScale", function (assert) {
			var listWidget = new ArcListview(),
				element = document.getElementById("arc-list");

			expect(1);
			listWidget.element = element;
			listWidget._state.currentIndex = 2;
			listWidget._state.items = [].map.call(element.querySelectorAll("li"), function (liElement, index) {
				return {
					y: index * 100,
					height: 100,
					current: {
						scale: 0
					},
					id: index
				};
			});
			listWidget._updateScale(100);

			assert.deepEqual(listWidget._state.items, [
				{
					"current": {
						"scale": 0
					},
					"height": 100,
					"id": 0,
					"to": null,
					"y": 0
				},
				{
					"current": {
						"scale": 0
					},
					"height": 100,
					"id": 1,
					"to": null,
					"y": 100
				},
				{
					"current": {
						"scale": 0
					},
					"from": {
						"scale": 0
					},
					"height": 100,
					"id": 2,
					"to": {
						"scale": 0.8958064164776166
					},
					"y": 200
				},
				{
					"current": {
						"scale": 0
					},
					"from": {
						"scale": 0
					},
					"height": 100,
					"id": 3,
					"to": {
						"scale": 0.9682458365518543
					},
					"y": 300
				},
				{
					"current": {
						"scale": 0
					},
					"from": {
						"scale": 0
					},
					"height": 100,
					"id": 4,
					"to": {
						"scale": 0.5925202502139317
					},
					"y": 400
				},
				{
					"current": {
						"scale": 0
					},
					"height": 100,
					"id": 5,
					"to": null,
					"y": 500
				},
				{
					"current": {
						"scale": 0
					},
					"height": 100,
					"id": 6,
					"to": null,
					"y": 600
				},
				{
					"current": {
						"scale": 0
					},
					"height": 100,
					"id": 7,
					"to": null,
					"y": 700
				},
				{
					"current": {
						"scale": 0
					},
					"height": 100,
					"id": 8,
					"to": null,
					"y": 800
				}
			], "_state.items are correctly updated");
		});

		QUnit.test("_drawItem", function (assert) {
			var listWidget = new ArcListview(),
				element = document.getElementById("arc-list"),
				appendChild = function () {
					assert.ok("append child was called");
				},
				querySelector = function () {
					assert.ok("find text content");
				},
				item = {
					element: {
						style: {},
						querySelector: querySelector
					},
					current: {
						scale: 1
					},
					repaint: true
				};

			expect(5);
			listWidget.element = element;
			listWidget._state.currentIndex = 2;
			listWidget._ui.dummyElement = {
				appendChild: appendChild
			};
			listWidget._carousel = {
				items: [{
					carouselElement: {
						appendChild: appendChild
					},
					carouselSeparator: {
						style: {},
						firstChild: null
					}
				}]
			};

			listWidget._drawItem(item, 0);
			assert.deepEqual(item,
				{
					"current": {
						"scale": 1
					},
					"element": {
						"style": {
							"opacity": 1.15,
							"transform": "translateY(-50%) scale3d(1,1,1)"
						},
						"querySelector": querySelector
					},
					"repaint": false
				}, "_state.items are correctly updated");

			item.repaint = false;
			item.current.scale = 0;
			listWidget._drawItem(item, 0);

			assert.deepEqual(item,
				{
					"current": {
						"scale": 0
					},
					"element": {
						"style": {
							"opacity": 1.15,
							"transform": "translateY(-50%) scale3d(1,1,1)"
						},
						"querySelector": querySelector
					},
					"repaint": false
				}, "_state.items are correctly updated");
		});

		QUnit.test("_selectItem", function (assert) {
			var listWidget = new ArcListview(),
				element = document.getElementById("arc-list"),
				pageElement = document.getElementById("arc-list-page"),
				liElement = element.querySelector("li"),
				height = liElement.getBoundingClientRect().height + "px";

			expect(3);
			listWidget._ui.arcListviewSelection = element;
			listWidget._ui.page = pageElement;
			listWidget._state = {
				items: [{
					element: liElement
				}],
				currentIndex: 0
			};

			listWidget._selectItem(0);

			helpers.triggerEvent(liElement, "transitionend");

			assert.ok(element.classList.contains("ui-arc-listview-selection-show"), "list selection element is active");
			assert.ok(parseInt(element.style.height, 10), parseInt(height, 10), "list selection element has proper height");
			assert.ok(liElement.classList.contains("ui-arc-listview-selected"), "list selection element is active");
		});

		QUnit.test("_init", function (assert) {
			var listWidget = new ArcListview(),
				element = document.getElementById("arc-list"),
				pageElement = document.getElementById("arc-list-page"),
				testStub = function () {
					assert.ok("Called function from flow");
				};

			expect(6);

			helpers.stub(ArcListview, "calcFactors", function (a, b) {
				assert.equal(a, listWidget.options.ellipsisA, "a was correct assign");
				assert.equal(b, listWidget.options.ellipsisB, "b was correct assign");
			});

			listWidget.element = element;
			listWidget._setAnimatedItems = testStub;
			listWidget._refresh = testStub;
			listWidget._scroll = testStub;
			listWidget._ui.page = pageElement;

			listWidget._init();

			assert.equal(element.classList.contains("ui-arc-listview"), true, "class ui-arc-listview is added ");

			helpers.restoreStub(ArcListview, "calcFactors");
		});

		QUnit.asyncTest("handleEvent", function (assert) {
			var listWidget = new ArcListview(),
				element = document.getElementById("arc-list"),
				testStub = function () {
					assert.ok("Called event callback function");
				};

			expect(6);
			listWidget.element = element;
			listWidget._ui.page = element.parentElement.parentElement.parentElement;
			listWidget._onTouchMove = testStub;
			listWidget._onRotary = testStub;
			listWidget._onTouchStart = testStub;
			listWidget._onTouchEnd = testStub;
			listWidget._onChange = testStub;
			listWidget._onClick = testStub;
			listWidget._selectItem = testStub;
			listWidget._items = [
				{}
			];

			listWidget.handleEvent({
				type: "touchmove"
			});
			listWidget.handleEvent({
				type: "rotarydetent"
			});
			listWidget.handleEvent({
				type: "touchstart"
			});
			listWidget.handleEvent({
				type: "touchend"
			});
			listWidget.handleEvent({
				type: "change"
			});
			listWidget.handleEvent({
				type: "vclick"
			});
			listWidget.handleEvent({
				type: "click"
			});
			setTimeout(start, 100);
		});

		QUnit.test("_bindEvents", function (assert) {
			var listWidget = new ArcListview(),
				element = document.getElementById("arc-list"),
				page = element.parentElement.parentElement.parentElement,
				arcListviewCarousel = element.parentElement;

			listWidget.element = element;
			listWidget._ui.page = page;
			listWidget._ui.arcListviewCarousel = arcListviewCarousel;
			listWidget._bindEvents();

			if (ns.util.scrolling) {
				ns.util.scrolling.disable();
			}
			expect(6);

			listWidget.handleEvent = function (_event) {
				assert.ok(_event, "Event was catched");
			};

			helpers.triggerEvent(page, "touchstart", {}, true, true, {touches: [{clientX: 0}]});
			helpers.triggerEvent(page, "touchmove", {}, true, true, {touches: [{clientX: 0}]});
			helpers.triggerEvent(page, "touchend", {}, true, true, {touches: [{clientX: 0}]});
			helpers.triggerEvent(arcListviewCarousel, "vclick");
			helpers.triggerEvent(document, "rotarydetent");
			helpers.triggerEvent(element, "change");

			listWidget._unbindEvents();

		});

		QUnit.test("_unbindEvents", function (assert) {
			var listWidget = new ArcListview(),
				element = document.getElementById("arc-list"),
				page = element.parentElement.parentElement.parentElement,
				arcListviewCarousel = element.parentElement;

			listWidget.element = element;
			listWidget._ui.page = page;
			listWidget._ui.arcListviewCarousel = arcListviewCarousel;
			listWidget._bindEvents();
			listWidget._unbindEvents();

			expect(0);

			listWidget.handleEvent = function (_event) {
				assert.ok(_event);
			};

			helpers.triggerEvent(page, "touchstart", {}, true, true, {touches: [{clientX: 0}]});
			helpers.triggerEvent(page, "touchmove", {}, true, true, {touches: [{clientX: 0}]});
			helpers.triggerEvent(page, "touchend", {}, true, true, {touches: [{clientX: 0}]});
			helpers.triggerEvent(arcListviewCarousel, "vclick");
			helpers.triggerEvent(document, "rotarydetent");
			helpers.triggerEvent(element, "change");
			helpers.triggerEvent(page, "pageshow");
		});

		QUnit.test("_build", function (assert) {
			var ArclistWidget = new ArcListview(),
				element = document.getElementById("arc-list"),
				element2 = document.getElementById("arc-list-2");

			expect(1);

			if (ns.util.scrolling) {
				ns.util.scrolling.disable();
			}

			helpers.stub(ns, "warn", function (info) {
				assert.equal(info, "Can't create Listview on SnapListview element", "info is correct");
			});

			ArclistWidget._build(element);

			helpers.stub(ns.engine, "getBinding", function (element, name) {
				return name === "SnapListview";
			});

			ArclistWidget._build(element2);

			helpers.restoreStub(ns, "warn");
			helpers.restoreStub(ns.engine, "getBinding");
		});

		QUnit.test("getSelectedIndex", function (assert) {
			var ArclistWidget = new ArcListview();

			expect(1);

			ArclistWidget._state.currentIndex = 3;

			assert.equal(ArclistWidget.getSelectedIndex(), 3, "getSelectedIndex return correct value.");
		});

		QUnit.test("scrollToPosition", function (assert) {
			var ArclistWidget = new ArcListview();

			expect(12);

			ArclistWidget._state.items.length = 3;
			ArclistWidget._state.currentIndex = 4;

			ArclistWidget.trigger = function (name, data) {
				assert.equal(name, "change", "Triggered event change");
				assert.equal(data.unselected, 4, "Triggered event with correct data");
			};

			ArclistWidget._roll = function () {
				assert.ok(true, "_roll was called");
			};

			ArclistWidget.scrollToPosition(1);

			assert.equal(ArclistWidget._state.toIndex, 1, "scrollToPosition change to index.");

			ArclistWidget.scrollToPosition(20);

			assert.equal(ArclistWidget._state.toIndex, 2, "scrollToPosition change to index.");

			ArclistWidget.scrollToPosition(-2);

			assert.equal(ArclistWidget._state.toIndex, 0, "scrollToPosition change to index.");
		});

		QUnit.test("_setBouncingTimeout", 2, function (assert) {
			var arclistWidget = new ArcListview();

			arclistWidget._bouncingEffect = {
				dragEnd: function () {
					assert.ok(true, "dragEnd was called");
				}
			};

			helpers.stub(window, "setTimeout", function (callback, timeout) {
				callback();
				assert.equal(timeout, 1000, "timeout is correct");
			});

			arclistWidget._setBouncingTimeout();
			helpers.restoreStub(window, "setTimeout");
		});

		QUnit.test("_carouselUpdate", function (assert) {
			var arclistWidget = new ArcListview();

			arclistWidget.element = document.createElement("ul");
			arclistWidget._state = {
				items: [
					{y: 2, height: 10},
					{y: 12, height: 10},
					{y: 22, height: 10}
				],
				scroll: {
					current: 5
				},
				selectors: []
			};
			arclistWidget._carousel = {
				items: [
					{carouselElement: {style: {}, "classList": {
						"add": nop,
						"remove": nop
					}}, carouselSeparator: {style: {}}},
					{carouselElement: {style: {}, "classList": {
						"add": nop,
						"remove": nop
					}}, carouselSeparator: {style: {}}},
					{carouselElement: {style: {}, "classList": {
						"add": nop,
						"remove": nop
					}}, carouselSeparator: {style: {}}},
					{carouselElement: {style: {}, "classList": {
						"add": nop,
						"remove": nop
					}}, carouselSeparator: {style: {}}},
					{carouselElement: {style: {}, "classList": {
						"add": nop,
						"remove": nop
					}}, carouselSeparator: {style: {}}}
				]
			};
			arclistWidget._carouselUpdate(2);
			assert.deepEqual(arclistWidget._carousel, {
				"items": [
					{
						"carouselElement": {
							"style": {
								"transform": "translateY(22px)"
							},
							"classList": {
								"add": nop,
								"remove": nop
							}
						},
						"carouselSeparator": {
							"style": {
								"transform": "translateY(0px)"
							}
						}
					},
					{
						"carouselElement": {
							"style": {
							},
							"classList": {
								"add": nop,
								"remove": nop
							}
						},
						"carouselSeparator": {
							"style": {

							}
						}
					},
					{
						"carouselElement": {
							"style": {
							},
							"classList": {
								"add": nop,
								"remove": nop
							}
						},
						"carouselSeparator": {
							"style": {

							}
						}
					},
					{
						"carouselElement": {
							"style": {
							},
							"classList": {
								"add": nop,
								"remove": nop
							}
						},
						"carouselSeparator": {
							"style": {

							}
						}
					},
					{
						"carouselElement": {
							"style": {
							},
							"classList": {
								"add": nop,
								"remove": nop
							}
						},
						"carouselSeparator": {
							"style": {

							}
						}
					}
				]
			}, "arclistWidget._carousel is updated correctly");
		});

		QUnit.test("_render", 6, function (assert) {
			var arclistWidget = new ArcListview();

			arclistWidget._state = {
				scroll: {
					current: 100
				}
			};
			arclistWidget._scrollAnimationEnd = false;
			arclistWidget._items = [{id: 0}];

			arclistWidget._calc = function () {
				assert.ok(true, "_calc was called");
			};
			arclistWidget._draw = function () {
				assert.ok(true, "_draw was called");
			};
			arclistWidget._findItemIndexByY = function (y) {
				assert.equal(y, 79, "y is correct");
				return 5;
			};

			helpers.stub(tau.util, "requestAnimationFrame", function (callback) {
				assert.ok(true, "requestAnimationFrame");
				assert.equal(typeof callback, "function", "callback for requestAnimationFrame was given");
			});

			// tested method
			arclistWidget._render();

			helpers.restoreStub(tau.util, "requestAnimationFrame");
			assert.equal(arclistWidget._state.currentIndex, 5, "_state.currentIndex is updated");

		});

		QUnit.test("_findItemIndexByY", function (assert) {
			var arclistWidget = new ArcListview();

			arclistWidget._state = {
				items: [
					{y: 10},
					{y: 20},
					{y: 30},
					{y: 40}
				]
			};
			assert.equal(arclistWidget._findItemIndexByY(10), 0, "_findItemIndexByY(10) return correct" +
				" value");
			assert.equal(arclistWidget._findItemIndexByY(21), 1, "_findItemIndexByY(21) return correct" +
				" value");
			assert.equal(arclistWidget._findItemIndexByY(32), 2, "_findItemIndexByY(32) return correct" +
				" value");
			assert.equal(arclistWidget._findItemIndexByY(42), 3, "_findItemIndexByY(42) return correct" +
				" value");
		});

		QUnit.test("_scroll", function (assert) {
			var arclistWidget = new ArcListview();

			arclistWidget._refresh = function () {
				assert.ok(true, "_refresh was called");
			};

			arclistWidget._requestRender = function () {
				assert.ok(true, "_requestRender was called");
			};

			arclistWidget._scroll();
		});

		QUnit.test("_roll", 4, function (assert) {
			var arclistWidget = new ArcListview();

			// prepare widget state
			arclistWidget._state = {
				scroll: {
					current: 5
				},
				items: [
					{
						y: 3
					}
				],
				toIndex: 0
			};
			arclistWidget._scrollAnimationEnd = true;
			arclistWidget._requestRender = function () {
				assert.ok(true, "_requestRender was called");
			};

			// tested method
			arclistWidget._roll(2000);

			// check state
			assert.equal(arclistWidget._state.duration, 2000, "_state.duration is 2000");
			assert.ok(arclistWidget._state.startTime, "_state.startTime is set");
			assert.deepEqual(arclistWidget._state.scroll, {
				"current": 5,
				"from": 5,
				"to": 176
			}, "arclistWidget._state.scroll is correct");

		});

		QUnit.test("_rollDown", 12, function (assert) {
			var arclistWidget = new ArcListview();

			arclistWidget.trigger = function (name, details) {
				assert.equal(name, "change", "event name is change");
				assert.deepEqual(details, {
					unselected: 9
				}, "");
			};
			arclistWidget._setBouncingTimeout = function () {
				assert.ok(true, "_setBouncingTimeout was called");
			};
			arclistWidget._roll = function () {
				assert.ok(true, "_roll was called");
			};
			arclistWidget._state = {
				items: new Array(5),
				toIndex: 3,
				currentIndex: 9
			};
			arclistWidget._maxScrollY = 200;
			arclistWidget._bouncingEffect = {
				dragEnd: function () {
					assert.ok(true, "_bouncingEffect.dragEnd was called");
				},
				drag: function (x, y) {
					assert.equal(x, 0, "drag, x=0");
					assert.equal(y, -200, "drag, y=-200");
				}
			};
			arclistWidget._rollDown();
			assert.equal(arclistWidget._state.toIndex, 4, "_state.toIndex is 4");
			arclistWidget._rollDown();
			assert.equal(arclistWidget._state.toIndex, 4, "_state.toIndex is 4");
		});


		QUnit.test("_rollUp", function (assert) {
			var arclistWidget = new ArcListview();

			arclistWidget.trigger = function (name, details) {
				assert.equal(name, "change", "event name is change");
				assert.deepEqual(details, {
					unselected: 9
				}, "details is correct");
			};
			arclistWidget._setBouncingTimeout = function () {
				assert.ok(true, "_setBouncingTimeout was called");
			};
			arclistWidget._roll = function () {
				assert.ok(true, "_roll was called");
			};
			arclistWidget._overscrollTop = function () {
				assert.ok(true, "_overscrollTop was called");
			};
			arclistWidget._state = {
				items: new Array(5),
				toIndex: 1,
				currentIndex: 9
			};
			arclistWidget._maxScrollY = 200;
			arclistWidget._bouncingEffect = {
				dragEnd: function () {
					assert.ok(true, "_bouncingEffect.dragEnd was called");
				},
				drag: function (x, y) {
					assert.equal(x, 0, "drag, x=0");
					assert.equal(y, 0, "drag, y=0");
				}
			};
			arclistWidget._rollUp();
			assert.equal(arclistWidget._state.toIndex, 0, "_state.toIndex is correct");
			arclistWidget._rollUp();
			assert.equal(arclistWidget._state.toIndex, 0, "_state.toIndex is correct");
		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.widget.wearable.ArcListview,
			window.helpers);
	}
}());
