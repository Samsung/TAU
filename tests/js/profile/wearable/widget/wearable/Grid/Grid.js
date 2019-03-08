/* global QUnit, define, tau, Promise, expect */
(function () {
	"use strict";
	function runTests(Grid, helpers) {
		function initHTML() {
			return new Promise(function (resolve) {
				var HTML = helpers.loadHTMLFromFile("/base/tests/js/profile/wearable/widget/wearable/Grid/test-data/sample.html"),
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

		QUnit.module("profile/wearable/widget/wearable/Grid", {
			setup: initHTML,
			teardown: clearHTML
		});

		QUnit.test("constructor", function (assert) {
			var gridWidget = new Grid();

			assert.deepEqual(gridWidget._ui, {
				container: null
			}, "_ui was correctly initialized");

			assert.deepEqual(gridWidget.options, {
				mode: "3x3",
				scrollbar: true,
				lines: 3,
				orientation: "horizontal",
				shape: "circle"
			}, "options was correctly initialized");

			assert.equal(gridWidget._currentIndex, -1, "_currentIndex was initialized")
		});

		QUnit.test("handleEvent", function (assert) {
			var gridWidget = new Grid();

			gridWidget._onRotary = function (event) {
				assert.equal(typeof event, "object", "event is object");
				assert.equal(event.type, "rotarydetent", "event.type is 'rotarydetent'");
			};

			gridWidget._onClick = function (event) {
				assert.equal(typeof event, "object", "event is object");
				assert.equal(event.type, "click", "event.type is 'click'");
			};

			gridWidget._onHWKey = function (event) {
				assert.equal(typeof event, "object", "event is object");
				assert.equal(event.type, "tizenhwkey", "event.type is 'tizenhwkey'");
			};

			gridWidget._onPopState = function (event) {
				assert.equal(typeof event, "object", "event is object");
				assert.equal(event.type, "popstate", "event.type is 'popstate'");
			};

			gridWidget._onScroll = function (event) {
				assert.equal(event, undefined, "called without any parameter");
			};

			expect(9);

			gridWidget.handleEvent({
				type: "rotarydetent"
			});
			gridWidget.handleEvent({
				type: "click"
			});
			gridWidget.handleEvent({
				type: "tizenhwkey"
			});
			gridWidget.handleEvent({
				type: "scroll"
			});
			gridWidget.handleEvent({
				type: "mousemove"
			});
			gridWidget.handleEvent({
				type: "popstate"
			});
		});

		QUnit.test("_bindEvents", function (assert) {
			var gridWidget = new Grid(),
				element = document.getElementById("grid");

			gridWidget._ui = {
				container: element
			};

			gridWidget._bindEvents(element);
			gridWidget.element = element;

			expect(5);

			gridWidget.handleEvent = function (_event) {
				assert.ok(_event, "Event was catched");
			};

			helpers.triggerEvent(document, "rotarydetent");
			helpers.triggerEvent(window, "popstate");
			helpers.triggerEvent(element, "click");
			helpers.triggerEvent(window, "tizenhwkey");
			helpers.triggerEvent(element, "scroll");

			gridWidget._unbindEvents();
		});

		QUnit.test("_unbindEvents", function (assert) {
			var gridWidget = new Grid(),
				element = document.getElementById("grid");

			gridWidget._ui = {
				container: element
			};

			gridWidget._bindEvents(element);
			gridWidget.element = element;

			expect(5);

			gridWidget.handleEvent = function (_event) {
				assert.ok(_event, "Event was catched");
			};

			helpers.triggerEvent(document, "rotarydetent");
			helpers.triggerEvent(window, "popstate");
			helpers.triggerEvent(element, "click");
			helpers.triggerEvent(window, "tizenhwkey");
			helpers.triggerEvent(element, "scroll");

			gridWidget._unbindEvents();

			helpers.triggerEvent(document, "rotarydetent");
			helpers.triggerEvent(window, "popstate");
			helpers.triggerEvent(element, "click");
			helpers.triggerEvent(window, "tizenhwkey");
			helpers.triggerEvent(element, "scroll");
		});

		QUnit.test("_onScroll", function (assert) {
			var gridWidget = new Grid(),
				element = document.getElementById("grid");

			gridWidget._ui.container = element;
			gridWidget.trigger = function (eventName, eventDetails) {
				assert.equal(eventName, "change", "event is correct");
				assert.equal(eventDetails.active, 7, "eventDetails.active is correct");
			};

			gridWidget._findItemIndexByScroll = function (_element) {
				assert.equal(_element, element, "argument element is correct");
				return 7;
			};

			expect(3);

			gridWidget._onScroll();
		});

		QUnit.test("_build", function (assert) {
			var gridWidget = new Grid(),
				element = document.getElementById("grid");

			gridWidget._setScrollbar = function (_element, optionsScrollbar) {
				assert.equal(_element, element, "first argument is element");
				assert.equal(optionsScrollbar, true, "default options.scrollbar is true");
			};

			expect(4);

			assert.equal(gridWidget._build(element), element, "_build return element");
			assert.equal(element.parentElement.className, "ui-grid-container", "correct create container");
		});

		QUnit.test("_setScrollbar", function (assert) {
			var gridWidget = new Grid(),
				element = document.getElementById("grid");

			gridWidget._ui.container = element;

			expect(2);

			gridWidget._setScrollbar(null, true);
			assert.equal(element.getAttribute("tizen-circular-scrollbar"), "", "tizen-circular-scrollbar is set");
			gridWidget._setScrollbar(null, false);
			assert.equal(element.getAttribute("tizen-circular-scrollbar"), null, "tizen-circular-scrollbar is set");
		});

		QUnit.test("_getGridSize", function (assert) {
			var gridWidget = new Grid();

			gridWidget._items = new Array(7);
			gridWidget._setLines(3);

			assert.equal(gridWidget._getGridSize("3x3"), 517, "aaa");
			assert.equal(gridWidget._getGridSize("image"), 2520, "aaa");
			assert.equal(gridWidget._getGridSize("thumbnail"), 1799, "aaa");
			assert.equal(gridWidget._getGridSize(""), 360, "aaa");
		});

		QUnit.test("_onClick", function (assert) {
			var gridWidget = new Grid(),
				element = document.getElementById("grid");

			expect(6);

			gridWidget.element = element;
			gridWidget.options = {
				mode: "3x3"
			};
			gridWidget.mode = function (type) {
				assert.equal(typeof type, "string", "mode was called with scring argument");
			};

			gridWidget._findChildIndex = function (target) {
				assert.equal(target, element, "_findChildIndex was called with element");
				return -1;
			};

			gridWidget._onClick({
				target: element
			});
			assert.equal(gridWidget._currentIndex, -1, "self._currentIndex is changed");

			gridWidget.options = {
				mode: "image"
			};
			gridWidget._onClick({
				target: element
			});
			assert.equal(gridWidget._currentIndex, -1, "self._currentIndex is changed");
		});

		QUnit.test("_onPopState", function (assert) {
			var gridWidget = new Grid(),
				element = document.getElementById("grid"),
				event = {
					preventDefault: function () {
						assert.ok("called preventDefault");
					},
					stopImmediatePropagation: function () {
						assert.ok("called stopImmediatePropagation");
					}
				};

			expect(10);

			gridWidget._findItemIndexByScroll = function (target) {
				assert.equal(target, element, "_findItemIndexByScroll was called with element");
				return -1;
			};

			gridWidget._ui.container = element;
			gridWidget._items = [1, 1, 1];
			gridWidget.options = {
				mode: "image"
			};
			gridWidget.mode = function (type) {
				assert.equal(typeof type, "string", "mode was called with scring argument");
			};

			gridWidget._onPopState(event);
			assert.equal(gridWidget._currentIndex, -1, "self._currentIndex is changed");

			gridWidget.options = {
				mode: "thumbnail"
			};
			gridWidget._onPopState(event);
			assert.equal(gridWidget._currentIndex, -1, "self._currentIndex is changed");
		});

		QUnit.test("_onHWKey", function (assert) {
			var gridWidget = new Grid(),
				event = {
					keyName: "back"
				};

			expect(1);
			gridWidget._onPopState = function (_event) {
				assert.equal(_event, event, "_onPopState was called with argunet event");
			};

			gridWidget._onHWKey(event);
		});

		QUnit.test("_changeModeTo3x3", function (assert) {
			var gridWidget = new Grid(),
				element = document.getElementById("grid"),
				event = {
					keyName: "back"
				};

			expect(4);
			gridWidget.element = element;
			gridWidget._ui.container = element.parentElement;
			gridWidget._setOrientation(element, "horizontal");
			gridWidget._getGridSize = function (type) {
				assert.equal(type, "3x3", "_getGridSize was called with 3x3");
				return 123
			};

			gridWidget._changeModeTo3x3(event);

			assert.equal(element.className, "ui-grid-horizontal ui-grid-3x3", "_onPopState was called with argunet event");
			assert.equal(gridWidget.options.mode, "3x3", "options.mode is set to 3x3");
			assert.equal(element.style.width, "123px", "element.style.width is set to 3x3");
		});

		QUnit.test("_assembleItemsTo3x3", function (assert) {
			var gridWidget = new Grid(),
				element = document.getElementById("grid"),
				items = [
					{to: {}},
					{to: {}},
					{to: {}},
					{to: {}},
					{to: {}}
				];

			gridWidget._setLines(element, 3);
			gridWidget._ui.container = element.parentElement;
			gridWidget._setOrientation(element, "horizontal");
			gridWidget._assembleItemsTo3x3(items);
			assert.deepEqual(items, [
				{
					"to": {
						"position": {
							"left": 68.5,
							"top": -101
						},
						"scale": 0.3027
					}
				},
				{
					"to": {
						"position": {
							"left": 11,
							"top": 0
						},
						"scale": 0.3027
					}
				},
				{
					"to": {
						"position": {
							"left": 68.5,
							"top": 101
						},
						"scale": 0.3027
					}
				},
				{
					"to": {
						"position": {
							"left": 183.5,
							"top": -101
						},
						"scale": 0.3027
					}
				},
				{
					"to": {
						"position": {
							"left": 126,
							"top": 0
						},
						"scale": 0.3027
					}
				}
			], "_assembleItemsTo3x3");
		});

		QUnit.test("mode", function (assert) {
			var gridWidget = new Grid(),
				order = 0;

			expect(20);

			gridWidget.trigger = function (eventName, eventDetails) {
				assert.equal(eventName, "modechange", "event is correct");
				assert.equal(typeof eventDetails.mode, "string", "eventDetails.mode is string");
			};

			gridWidget._imageToGrid = function () {
				assert.ok("_imageToGrid was called");
				assert.equal(order, 3, "_imageToGrid was called in correct order");
				order++;
			};
			gridWidget._changeModeTo3x3 = function () {
				assert.ok("_changeModeTo3x3 was called");
				assert.equal(order, 1, "_imageToGrid was called in correct order");
				order++;
			};
			gridWidget._gridToImage = function () {
				assert.ok("_gridToImage was called");
				assert.equal(order, 0, "_gridToImage was called in correct order");
				order++;
			};
			gridWidget._thumbnailToImage = function () {
				assert.ok("_thumbnailToImage was called");
				assert.equal(order, 2, "_imageToGrid was called in correct order");
				order++;
			};
			gridWidget._imageToThumbnail = function () {
				assert.ok("_imageToThumbnail was called");
				assert.equal(order, 4, "_imageToThumbnail was called in correct order");
				order++;
			};

			gridWidget.mode("");
			gridWidget.mode("image");
			gridWidget.mode("3x3");
			gridWidget.mode("thumbnail");
			gridWidget.options.mode = "thumbnail";
			gridWidget.mode("image");
			gridWidget.options.mode = "image";
			gridWidget.mode("3x3");
			gridWidget.options.mode = "image";
			gridWidget.mode("thumbnail");
		});

		QUnit.test("_getItemSize", 5, function (assert) {
			var gridWidget = new Grid();

			assert.equal(gridWidget._getItemSize("3x3"), 113.97200000000001,
				"return correct item size (3x3)");
			assert.equal(gridWidget._getItemSize("image"), 360, "return correctly item size (image)");
			assert.equal(gridWidget._getItemSize("thumbnail"), 242,
				"return correctly item size (thumbnail)");
			assert.equal(gridWidget._getItemSize("h"), 0, "return correctly item size (wrong)");
			assert.equal(gridWidget._getItemSize(), 113.97200000000001,
				"return correctly item size (without argument)");
		});

		QUnit.test("_changeModeTo3x3", 5, function (assert) {
			var gridWidget = new Grid(),
				element = document.getElementById("grid");

			gridWidget.element = element;
			gridWidget._scrollSize = "width";
			gridWidget._getGridSize = function (mode) {
				assert.equal(mode, "3x3", "");
				return 100;
			};
			gridWidget._changeModeTo3x3();
			assert.equal(gridWidget.options.mode, "3x3", "options.mode is set");
			assert.ok(element.classList.contains("ui-grid-3x3"), "class ui-grid-3x3 is set");
			assert.ok(!element.classList.contains("ui-grid-image"), "class ui-grid-image is not set");
			assert.equal(element.style.width, "100px", "style width is set");
		});

		QUnit.test("_changeModeToThumbnail", 1, function (assert) {
			var gridWidget = new Grid(),
				element = document.getElementById("grid");

			gridWidget._currentIndex = 5;
			gridWidget.element = element;
			gridWidget._changeModeToThumbnail();
			assert.ok(element.classList.contains("ui-grid-thumbnail"), "class ui-grid-thumbnail is set");
		});

		QUnit.test("_updateSnapPointPositions", 3, function (assert) {
			var gridWidget = new Grid();

			gridWidget._snapPoints = [{style: {}}, {style: {}}, {style: {}}];
			gridWidget._scrollDimension = "left";
			gridWidget.options.mode = "3x3";
			gridWidget._updateSnapPointPositions();
			assert.deepEqual(gridWidget._snapPoints, [
				{
					"style": {
						"left": "65.486px"
					}
				},
				{
					"style": {
						"left": "65.486px"
					}
				},
				{
					"style": {
						"left": "65.486px"
					}
				}], "_snapPoints was updated");
			gridWidget.options.mode = "image";
			gridWidget._updateSnapPointPositions();
			assert.deepEqual(gridWidget._snapPoints, [
				{
					"style": {
						"left": "180px"
					}
				},
				{
					"style": {
						"left": "540px"
					}
				},
				{
					"style": {
						"left": "900px"
					}
				}], "thumbnail");
			gridWidget.options.mode = "thumbnail";
			gridWidget._updateSnapPointPositions();
			assert.deepEqual(gridWidget._snapPoints, [
				{
					"style": {
						"left": "180px"
					}
				},
				{
					"style": {
						"left": "422px"
					}
				},
				{
					"style": {
						"left": "664px"
					}
				}], "_snapPoints was updated");
		});

		QUnit.test("_setShape", 6, function (assert) {
			var gridWidget = new Grid(),
				element = document.getElementById("grid");

			gridWidget._ui.container = element.parentElement;
			gridWidget.options.lines = 2;
			gridWidget._setShape(element, "circle");
			assert.deepEqual(gridWidget._settings, {
				"marginLeft": 38,
				"marginRight": 140,
				"marginThumbnail": 26,
				"marginTop": -75,
				"scale": 0.3833,
				"scaleThumbnail": 0.6,
				"scaleThumbnailX": 0.6,
				"size": 146
			}, "_settings was changed");
			assert.ok(element.classList.contains("ui-grid-circle"), "class ui-grid-circle is correctly" +
				" set");
			assert.ok(!element.classList.contains("ui-grid-rectangle"), "class ui-grid-rectangle" +
				" is not set");
			gridWidget._setShape(element, "rectangle");
			assert.deepEqual(gridWidget._settings, {
				"marginLeft": 57,
				"marginRight": 230,
				"marginThumbnail": -8,
				"marginTop": -66,
				"scale": 0.325,
				"scaleThumbnail": 0.715,
				"scaleThumbnailX": 0.4722,
				"size": 130
			}, "_settings was changed");
			assert.ok(element.classList.contains("ui-grid-rectangle"), "class ui-grid-rectangle is set");
			assert.ok(!element.classList.contains("ui-grid-circle"), "class ui-grid-circle is not set");
		});

		QUnit.test("changeIndex", 7, function (assert) {
			var gridWidget = new Grid(),
				element = document.getElementById("grid"),
				container = {
					scrollLeft: 6
				};

			gridWidget._currentIndex = 5;
			gridWidget._ui = {
				container: container
			};
			gridWidget._scrollProperty = "scrollLeft";
			gridWidget.elemet = element;
			gridWidget._getGridScrollPosition = function () {
				assert.ok(1);
				return 6;
			};
			gridWidget._scrollTo = function (element, changeValue, duration, options) {
				assert.equal(element, container, "_scrollTo, element is correct");
				assert.equal(changeValue, 0, "_scrollTo, changeValue is correct");
				assert.equal(duration, 250, "_scrollTo, duration is correct");
				assert.deepEqual(options, {
					propertyName: "scrollLeft"
				}, "_scrollTo, options is correct");
			};
			assert.equal(gridWidget.changeIndex(5), gridWidget, "return this");
			assert.equal(gridWidget._currentIndex, 5, "correctly set _currentIndex");
		});

		QUnit.test("_setOrientation", 14, function (assert) {
			var gridWidget = new Grid(),
				element = document.getElementById("grid");

			gridWidget._ui.container = element.parentElement;
			gridWidget._setOrientation(element, "horizontal");
			assert.equal(gridWidget._scrollProperty, "scrollLeft", "correctly set _scrollProperty");
			assert.equal(gridWidget._scrollDimension, "left", "correctly set _scrollDimension");
			assert.equal(gridWidget._nonScrollDimension, "top", "correctly set _nonScrollDimension");
			assert.equal(gridWidget._scrollSize, "width", "correctly set _scrollSize");
			assert.equal(gridWidget.options.orientation, "horizontal", "correctly set options.orientation");
			assert.ok(element.classList.contains("ui-grid-horizontal"), "class ui-grid-horizontal is" +
				" set");
			assert.ok(element.parentElement.classList.contains("ui-grid-horizontal"), "class" +
				" ui-grid-horizontal is set on container");
			gridWidget._setOrientation(element, "vertical");
			assert.equal(gridWidget._scrollProperty, "scrollTop", "correctly set _scrollProperty");
			assert.equal(gridWidget._scrollDimension, "top", "correctly set _scrollDimension");
			assert.equal(gridWidget._nonScrollDimension, "left", "correctly set _nonScrollDimension");
			assert.equal(gridWidget._scrollSize, "height", "correctly set _scrollSize");
			assert.equal(gridWidget.options.orientation, "vertical", "correctly set options.orientation");
			assert.ok(element.classList.contains("ui-grid-vertical"), "class ui-grid-horizontal is" +
				" set");
			assert.ok(element.parentElement.classList.contains("ui-grid-vertical"), "class" +
				" ui-grid-vertical is set on container");
		});

		QUnit.test("_assembleItemsToImages", 2, function (assert) {
			var gridWidget = new Grid();

			gridWidget._getItemSize = function (mode) {
				assert.equal(mode, "image");
				return 20;
			};
			gridWidget._scrollDimension = "left";
			gridWidget._nonScrollDimension = "top";
			gridWidget._items = [{to: {}}, {to: {}}, {to: {}}];
			gridWidget._assembleItemsToImages();
			assert.deepEqual(gridWidget._items,
				[
					{
						"to": {
							"position": {
								"left": 0,
								"top": 0
							},
							"scale": 1
						}
					},
					{
						"to": {
							"position": {
								"left": 20,
								"top": 0
							},
							"scale": 1
						}
					},
					{
						"to": {
							"position": {
								"left": 40,
								"top": 0
							},
							"scale": 1
						}
					}
				], "correctly set _items");
		});

		QUnit.test("_getGridScrollPosition", 2, function (assert) {
			var gridWidget = new Grid();

			gridWidget._getItemSize = function (mode) {
				assert.equal(mode, "image", "_getItemSize, mode is correct");
				return 20;
			};
			gridWidget._currentIndex = 10;
			// 200 = 10 * 20  = _currentIndex * _getItemSize()
			assert.equal(gridWidget._getGridScrollPosition("image"), 200, "_getGridScrollPosition" +
				" returns correct value");
		});

		QUnit.test("_onRotary", 5, function (assert) {
			var gridWidget = new Grid(),
				element = document.getElementById("grid");

			gridWidget._ui = {
				container: element
			};
			gridWidget._scrollProperty = "scrollLeft";
			gridWidget._getItemSize = function (mode) {
				assert.equal(mode, undefined, "mode is not set");
				return 20;
			};
			gridWidget._scrollTo = function (_element, changeValue, duration, options) {
				assert.equal(_element, element, "_scrollTo, element");
				assert.equal(changeValue, 20, "_scrollTo, changeValue");
				assert.equal(duration, 250, "_scrollTo, duration");
				assert.deepEqual(options, {
					propertyName: "scrollLeft"
				}, "_scrollTo, options");
			};
			gridWidget._onRotary({
				detail: {
					direction: "CW"
				}
			});
		});

		QUnit.test("getIndex", function (assert) {
			var gridWidget = new Grid(),
				element = document.getElementById("grid");

			gridWidget._ui = {
				container: element
			};
			gridWidget._findItemIndexByScroll = function (_element) {
				assert.equal(_element, element, "element is set");
				return 20;
			};
			assert.equal(gridWidget.getIndex(), 20, "return correct value");
			assert.equal(gridWidget._currentIndex, 20, "set correct _currentIndex");
		});

		QUnit.test("_init", function (assert) {
			var gridWidget = new Grid(),
				element = document.getElementById("grid");

			gridWidget.element = element;
			gridWidget._setLines = function (_element, value) {
				assert.equal(_element, element, "element is set (_setLines)");
				assert.equal(value, 3, "value is set (_setLines)");
			};
			gridWidget._setShape = function (_element, value) {
				assert.equal(_element, element, "element is set (_setShape)");
				assert.equal(value, "circle", "value is set (_setShape)");
			};
			gridWidget._setOrientation = function (_element, value) {
				assert.equal(_element, element, "element is set (_setOrientation)");
				assert.equal(value, "horizontal", "value is set (_setOrientation)");
			};
			gridWidget._getItems = function () {
				assert.ok(true, "_getItems");
			};
			gridWidget._assembleItemsTo3x3 = function (items) {
				assert.deepEqual(items, [], "items is set");
			};
			gridWidget._transformItems = function () {
				assert.ok(true, "_transformItems");
			};
			gridWidget._createSnapPoints = function () {
				assert.ok(true, "_createSnapPoints");
			};
			gridWidget._updateSnapPointPositions = function () {
				assert.ok(true, "_updateSnapPointPositions");
			};
			gridWidget.mode = function (mode) {
				assert.equal(mode, "3x3", "mode is set");
			};
			gridWidget._init();
			assert.ok(element.classList.contains("ui-children-positioned"),
				"class ui-children-positioned is set");
		});

		QUnit.test("_scaleItemsToThumbnails", function (assert) {
			var gridWidget = new Grid(),
				element = document.getElementById("grid");

			gridWidget._currentIndex = 5;
			gridWidget.element = element;
			gridWidget._items = [{to: {}}, {to: {}}, {to: {}}];
			gridWidget._settings = {
				scaleThumbnail: 0.5,
				scaleThumbnailX: 0.3
			};
			gridWidget._scrollDimension = "a";
			gridWidget._nonScrollDimension = "b";
			gridWidget._scrollProperty = "left";
			gridWidget._ui = {
				container: {
					left: 100
				}
			};
			gridWidget._getItemSize = function (mode) {
				assert.equal(mode, "thumbnail", "mode is correct)");
				return 5;
			};
			gridWidget._scaleItemsToThumbnails();
			assert.deepEqual(gridWidget._items, [
				{
					"to": {
						"opacity": 0.75,
						"position": {
							"a": 0,
							"b": 0
						},
						"scale": 0.3
					}
				},
				{
					"to": {
						"opacity": 0.75,
						"position": {
							"a": 5,
							"b": 0
						},
						"scale": 0.3
					}
				},
				{
					"to": {
						"opacity": 0.75,
						"position": {
							"a": 10,
							"b": 0
						},
						"scale": 0.3
					}
				}
			], "_items are modified");
		});

		QUnit.test("_createSnapPoint", function (assert) {
			var gridWidget = new Grid();

			assert.equal(gridWidget._createSnapPoint().outerHTML, "<div class=\"snap-point\"></div>");
		});

		QUnit.test("_createSnapPoints", 4, function (assert) {
			var gridWidget = new Grid(),
				element = document.getElementById("grid");

			gridWidget._ui = {
				container: element
			};
			gridWidget._createSnapPoint = function () {
				assert.ok(true, "_createSnapPoint was called");
				return document.createElement("div");
			};
			gridWidget._items = [1, 2, 3];
			gridWidget._createSnapPoints();
			assert.equal(gridWidget._snapPoints.length, 3, "_snapPoints has 3 elements");
		});

		QUnit.test("_dispersionItems", 1, function (assert) {
			var gridWidget = new Grid(),
				element = document.getElementById("grid");

			gridWidget.element = element;
			gridWidget._settings = {
				scale: 1
			};
			gridWidget._items = [
				{
					position: {
						left: 1,
						top: 2
					}
				}, {
					position: {
						left: 3,
						top: 4
					}
				}, {
					position: {
						left: 5,
						top: 6
					}
				}
			];
			gridWidget._dispersionItems(1);
			assert.deepEqual(gridWidget._items, [
				{
					"position": {
						"left": 1,
						"top": 2
					},
					"to": {
						"position": {
							"left": -3.4000000000000004,
							"top": -2.4000000000000004
						},
						"scale": 1
					}
				},
				{
					"position": {
						"left": 3,
						"top": 4
					},
					"to": {
						"position": {
							"undefined": 0
						},
						"scale": 1
					}
				},
				{
					"position": {
						"left": 5,
						"top": 6
					},
					"to": {
						"position": {
							"left": 9.4,
							"top": 10.4
						},
						"scale": 1
					}
				}
			], "_items are modified");
		});

		QUnit.test("_transformItems", 2, function (assert) {
			var gridWidget = new Grid();

			gridWidget._items = [
				{element: {style: {}}, position: {left: 0, top: 1}, scale: 2, opacity: 3},
				{element: {style: {}}, position: {left: 0.1, top: 1.1}, scale: 2.1, opacity: 3.1},
				{element: {style: {}}, position: {left: 0.2, top: 1.2}, scale: 2.2, opacity: 3.2}
			];
			gridWidget._applyItemsTo = function (_items) {
				assert.equal(_items, gridWidget._items, "First argument is items");
			};

			gridWidget._transformItems();

			assert.deepEqual(gridWidget._items, [
				{
					"element": {
						"style": {
							"opacity": 3,
							"transform": "translate3d(0px, 1px, 0) scale(2)",
							"webkitTransform": "translate3d(0px, 1px, 0) scale(2)"
						}
					},
					"opacity": 3,
					"position": {
						"left": 0,
						"top": 1
					},
					"scale": 2
				},
				{
					"element": {
						"style": {
							"opacity": 3.1,
							"transform": "translate3d(0.1px, 1.1px, 0) scale(2.1)",
							"webkitTransform": "translate3d(0.1px, 1.1px, 0) scale(2.1)"
						}
					},
					"opacity": 3.1,
					"position": {
						"left": 0.1,
						"top": 1.1
					},
					"scale": 2.1
				},
				{
					"element": {
						"style": {
							"opacity": 3.2,
							"transform": "translate3d(0.2px, 1.2px, 0) scale(2.2)",
							"webkitTransform": "translate3d(0.2px, 1.2px, 0) scale(2.2)"
						}
					},
					"opacity": 3.2,
					"position": {
						"left": 0.2,
						"top": 1.2
					},
					"scale": 2.2
				}
			], "Items are transformed");
		});

		QUnit.test("_applyItemsTo", 1, function (assert) {
			var gridWidget = new Grid(),
				items = [
					{
						position: {},
						to: {
							position: {
								left: 0,
								top: 1
							},
							scale: 2,
							opacity: 3
						}
					},
					{
						position: {},
						to: {
							position: {
								left: 0.1,
								top: 1.1
							},
							scale: 2.1,
							opacity: 3.1
						}
					}
				];

			gridWidget._applyItemsTo(items);

			assert.deepEqual(items, [
				{
					"opacity": 3,
					"position": {
						"left": 0,
						"top": 1
					},
					"scale": 2,
					"to": {
						"opacity": 3,
						"position": {
							"left": 0,
							"top": 1
						},
						"scale": 2
					}
				},
				{
					"opacity": 3.1,
					"position": {
						"left": 0.1,
						"top": 1.1
					},
					"scale": 2.1,
					"to": {
						"opacity": 3.1,
						"position": {
							"left": 0.1,
							"top": 1.1
						},
						"scale": 2.1
					}
				}
			], "Items are transformed");
		});

		QUnit.test("_moveItemsToImages", 4, function (assert) {
			var gridWidget = new Grid();

			gridWidget._items = [
				{to: {}},
				{to: {}},
				{to: {}}
			];
			gridWidget._scrollDimension = "l";
			gridWidget._nonScrollDimension = "t";
			gridWidget._settings = {
				scaleThumbnail: 1
			};
			gridWidget._getItemSize = function (mode) {
				assert.equal(mode, "image", "mode is 'image'");
				return 2;
			};
			gridWidget._moveItemsToImages();
			assert.deepEqual(gridWidget._items, [
				{
					"to": {
						"opacity": 1,
						"position": {
							"l": 0,
							"t": 0
						},
						"scale": 1
					}
				},
				{
					"to": {
						"opacity": 1,
						"position": {
							"l": 2,
							"t": 0
						},
						"scale": 1
					}
				},
				{
					"to": {
						"opacity": 1,
						"position": {
							"l": 4,
							"t": 0
						},
						"scale": 1
					}
				}
			], "_items are correctly modified");
		});
	}

	if (typeof define === "function") {
		define(function () {
			return runTests;
		});
	} else {
		runTests(tau.widget.wearable.Grid,
			window.helpers);
	}
}());
