/* global document, tau, define, module, test, strictEqual, asyncTest, window, ok, Promise, start */
(function () {
	"use strict";
	function runTests(engine, selectors, Page, Listview, helpers, ns) {

		ns = ns || window.ns;

		function initHTML() {
			return new Promise(function (resolve) {
				var HTML = helpers.loadHTMLFromFile("/base/tests/js/profile/mobile/widget/mobile/Listview/test-data/sample.html"),
					parent = document.getElementById("qunit-fixture") || helpers.initFixture();

				parent.innerHTML = HTML;
				helpers.loadTAUStyle(document, "mobile", function () {
					resolve();
				});
			});
		}

		module("mobile/widget/mobile/Listview", {
			setup: initHTML
		});

		test("constructor", function () {
			var listviewWidget = new Listview();

			ok(listviewWidget instanceof Listview, "Proper instance created");

			listviewWidget.destroy();
			strictEqual(listviewWidget._context, null, "Context destroyed");
		});

		test("building", function () {
			var listview = engine.instanceWidget(document.getElementById("mobile-listview-1"), "mobile.Listview"),
				listviewEl = listview.element,
				canvas = listviewEl.querySelector("canvas");

			ok(canvas, "Canvas background created");
			ok(canvas.classList && canvas.classList.contains(Listview.classes.BACKGROUND_LAYER), "Proper class for canvas created");
			strictEqual(canvas, listview._context.canvas, "Saved context is of the created canvas");
		});

		function Context2DMock(canvas) {
			this.canvas = canvas;
			this.fillStyle = "#000000";

			this._clearCalledNum = 0;
			this._firstFillRectCalledNum = 0;
			this._fillRectCalledNum = 0;
		}

		Context2DMock.prototype.clearRect = function () {
			if (this._fillRectCalledNum > 0 && this._firstFillRectCalledNum === 0) {
				this._firstFillRectCalledNum = this._fillRectCalledNum;
			}
			this._clearCalledNum++;
		};

		Context2DMock.prototype.fillRect = function () {
			this._fillRectCalledNum++;
		};

		function mockListview(listviewInstance) {
			listviewInstance._context = new Context2DMock(listviewInstance._context.canvas);
			listviewInstance._async = function (callback) {
				setTimeout(callback, 1000 / 60);
			};

			return listviewInstance._context;
		}

		asyncTest("scroll", function (assert) {
			var pageElement = document.getElementById("mobile-listview-page-1"),
				pageWidget = engine.instanceWidget(pageElement, "Page"),
				listview,
				mockedContext;

			pageWidget.layout(true);
			pageWidget.setActive(true);
			listview = engine.instanceWidget(pageElement.querySelector("." + Listview.classes.LISTVIEW), "mobile.Listview");
			engine.createWidgets(pageElement);
			mockedContext = mockListview(listview);

			listview.refresh();

			setTimeout(function () {
				assert.ok(listview._scrollableContainer, "Scrollable container found");
				listview._scrollableContainer.scrollTop = 100;
				listview.refresh();
				setTimeout(function () {
					assert.ok(mockedContext._clearCalledNum, "Async calls were run");
					assert.ok(mockedContext._fillRectCalledNum, "Background rectes were drawn multiple times");
					/**
					 * Test assertion has disabled because of is too dependent to test engine platform,
					 * This test needs refactoring
					 */
					//assert.equal(mockedContext._firstFillRectCalledNum, 25, "correct count of background rects drawn");
					assert.ok(parseFloat(listview._context.canvas.style.transform.replace(/[^0-9\.]+/gi, "")), "Canvas position translated according to scroll");
					start();
				}, 1000);
			}, 1000);
		});

		test("_setColoredBackground", function (assert) {
			var element = document.createElement("div"),
				disabledGradientClass = Listview.classes.GRADIENT_BACKGROUND_DISABLED,
				listview;

			if (!window.navigator.userAgent.match("PhantomJS")) {
				/**
				 * Test has been disabled in current version of PhantomJS because of classList.toggle is not full supported
				 */

				assert.equal(element.classList.contains(disabledGradientClass), false,
					"New HTML element has not class " + disabledGradientClass);

				listview = new Listview(element);

				listview._setColoredBackground(element, true);
				assert.equal(element.classList.contains(disabledGradientClass), false, "Element has not class " + disabledGradientClass);
				assert.equal(listview.options.coloredBackground, true, "Listview widget option 'coloredBackground' has been set on true");

				listview._setColoredBackground(element, false);
				assert.equal(element.classList.contains(disabledGradientClass), true, "Element has not class " + disabledGradientClass);
				assert.equal(listview.options.coloredBackground, false, "Listview widget option 'coloredBackground' has been set on false");
			} else {
				assert.ok(true, "Test has been disabled in current version of PhantomJS because of classList.toggle is not full supported ");
			}
		});

		test("_refresh", function (assert) {
			var element = document.createElement("div"),
				popupContainer = document.createElement("div"),
				listview;

			popupContainer.classList.add(Listview.classes.POPUP_LISTVIEW);

			listview = new Listview(element);
			assert.ok(!!listview, "Listview exists");

			helpers.stub(listview, "_refreshColoredBackground", function () {
				assert.ok(true, "method: _refreshColoredBackground was called");
			});
			helpers.stub(listview, "_findContainers", function () {
				assert.ok(true, "method: _findContainers was called");
			});

			/**
			 * Case 1;
			 * Colored background is enabled
			 */
			listview.options.coloredBackground = true;
			// + 1 assertion
			listview.refresh();

			/**
			 * Case 2;
			 * Colored background is disabled
			 */
			listview.options.coloredBackground = false;
			// should not new assertion
			listview.refresh();

			/**
			 * Case 3;
			 * Colored background is disabled
			 * and Listview contains in popup
			 */
			helpers.stub(selectors, "getClosestByClass", function () {
				assert.ok(true, "method: .getClosestByClass was called");
				return popupContainer;
			});

			listview.options.coloredBackground = false;
			// should not new assertion
			listview.refresh();
			ok(!popupContainer.classList.contains(Listview.classes.POPUP_LISTVIEW),
				"Popup container has not class: " + Listview.classes.POPUP_LISTVIEW);

			// Remove stubs
			helpers.restoreStub(listview, "_refreshColoredBackground");
			helpers.restoreStub(selectors, "_findContainers");
			helpers.restoreStub(selectors, "getClosestByClass");
		});

		test("_refreshColoredBackground", function (assert) {
			var element = document.createElement("div"),
				canvas = null,
				listview;

			listview = new Listview(element);

			assert.ok(!!listview, "Listview exists");
			assert.equal(typeof listview._refreshColoredBackground, "function", "Method exists");

			helpers.stub(listview, "_checkClosestPopup", function () {
				assert.ok(true, "method: ._checkClosestPopup was called");
			});
			helpers.stub(listview, "_prepareColors", function () {
				assert.ok(true, "method: ._prepareColors was called");
			});
			helpers.stub(listview, "_refreshBackgroundCanvas", function (container, element) {
				assert.ok(true, "method: ._refreshBackgroundCanvas was called");
				assert.ok(container instanceof HTMLElement, "first argument is instance of HTMLElement");
				assert.ok(element instanceof HTMLElement, "second argument is instance of HTMLElement");
			});
			helpers.stub(listview, "_frameCallback", function () {
				assert.ok(true, "method: ._frameCallback was called");
			});

			// set properties to check
			listview._redraw = false;
			listview._lastChange = 0;
			listview.element = element;
			listview._scrollableContainer = document.createElement("div");

			canvas = document.createElement("canvas");
			listview.element.appendChild(canvas);
			// call tested method
			listview._refreshColoredBackground();

			// Check property
			assert.ok(listview._redraw, "Listview property: _redraw has changed on true");
			assert.ok(listview._lastChange, "Listview property: _lastChange has changed");

			listview._context = {};
			listview._context.canvas = canvas;
			listview.element.removeChild(listview.element.firstElementChild);
			// call tested method
			listview._refreshColoredBackground();
			assert.ok(listview.element.firstElementChild.tagName.toLowerCase() === "canvas", "bring back canvas successfully");

			// Remove stubs
			helpers.restoreStub(listview, "_checkClosestPopup");
			helpers.restoreStub(listview, "_prepareColors");
			helpers.restoreStub(listview, "_refreshBackgroundCanvas");
			helpers.restoreStub(listview, "_frameCallback");
		});

		test("_findContainers", function (assert) {
			var element = document.getElementById("mobile-listview-1"),
				listview;

			listview = new Listview();
			assert.ok(!!listview, "Listview exists");
			assert.equal(typeof listview._findContainers, "function", "Method exists");

			listview._findContainers(element);
			assert.equal(
				listview._pageContainer,
				document.getElementById("mobile-listview-page-1"),
				"Page container found properly"
			);
			assert.equal(
				listview._popupContainer,
				null,
				"Popup content not found, it is properly"
			);
		});

		test("_refreshBackgroundCanvas", function (assert) {
			var element = document.getElementById("mobile-listview-1"),
				container = document.getElementById("mobile-listview-content-1"),
				canvas = document.createElement("canvas"),
				listview;

			listview = new Listview();
			assert.ok(!!listview, "Listview exists");
			assert.equal(typeof listview._refreshBackgroundCanvas, "function", "Method exists");

			listview.element = element;

			listview._context = {
				canvas: canvas
			};

			/**
			 * Case 1: container not exists
			 */
			element.style.height = "200px";
			element.style.width = "100px";
			listview._topOffset = 0;
			helpers.stub(element, "getBoundingClientRect", function () {
				assert.ok(true, "element.getBoundingClientRect() was called");
				return {
					width: 100,
					height: 200
				};
			});

			listview._refreshBackgroundCanvas(null, element);

			assert.equal(listview._canvasWidth, 100, "Property _canvasWidth has properly value 100");
			assert.equal(listview._canvasHeight, 200, "Property _canvasHeight has properly value 200");
			assert.equal(canvas.style.width, "100px", "Property canvas.style.width has properly value 100px");
			assert.equal(canvas.style.height, "200px", "Property canvas.style.height has properly value 200px");

			helpers.restoreStub(element, "getBoundingClientRect");

			/**
			 * Case 2: container exists and widget has top offset
			 */
			element.style.height = "300px";
			element.style.width = "150px";
			container.style.height = "200";
			listview._topOffset = 100;
			helpers.stub(element, "getBoundingClientRect", function () {
				assert.ok(true, "element.getBoundingClientRect() was called");
				return {
					width: 150,
					height: 300
				};
			});

			listview._refreshBackgroundCanvas(container, element);

			assert.equal(listview._canvasWidth, 150, "Property _canvasWidth has properly value 150");
			assert.equal(listview._canvasHeight, 400, "Property _canvasHeight has properly value 300");
			assert.equal(canvas.style.width, "150px", "Property canvas.style.width has properly value 150px");
			assert.equal(canvas.style.height, "400px", "Property canvas.style.height has properly value 300px");

			helpers.restoreStub(element, "getBoundingClientRect");
		});

		test("_checkClosestPopup", function (assert) {
			var listview,
				scrollableContent = document.createElement("div");

			/**
			 * Case 1: popup has content
			 */
			listview = new Listview();
			assert.ok(!!listview, "Listview exists");
			assert.equal(typeof listview._checkClosestPopup, "function", "Method exists");

			listview._popupContainer = document.getElementById("popup-with-listview-1");
			listview._checkClosestPopup();

			assert.ok(
				listview._popupContainer.classList.contains(Listview.classes.POPUP_LISTVIEW),
				"Popup which contains listview has class ui-popup-listview"
			);
			assert.equal(
				listview._scrollableContainer,
				document.getElementById("popup-content"),
				"Scrollable container for listview has been replaced by popup content"
			);

			/**
			 * Case 2: popup has not content
			 */
			listview = new Listview();

			listview._popupContainer = document.getElementById("popup-with-listview-2");
			listview._scrollableContainer = scrollableContent;
			listview._checkClosestPopup();

			assert.ok(
				listview._popupContainer.classList.contains(Listview.classes.POPUP_LISTVIEW),
				"Popup which contains listview has class ui-popup-listview"
			);
			assert.equal(
				listview._scrollableContainer,
				scrollableContent,
				"Scrollable container for listview has not changed"
			);
		});

		test("_createHolder", function (assert) {
			var element = document.getElementById("mobile-listview-1"),
				holderElement,
				listview;

			listview = new Listview(element);
			holderElement = listview._createHolder();

			assert.ok(
				holderElement.classList.contains(Listview.classes.ITEM),
				"Holder element contains class ITEM"
			);

			assert.ok(
				holderElement.classList.contains(Listview.classes.HOLDER),
				"Holder element contains class HOLDER"
			);
		});

		test("_setDirection", function (assert) {
			var element = document.getElementById("mobile-listview-1"),
				listview;

			listview = new Listview(element);

			listview._setDirection(0, 1);

			assert.equal(
				listview._direction,
				-1,
				"Listview direction is PREV"
			);

			listview._setDirection(1, 1);

			assert.equal(
				listview._direction,
				0,
				"Listview direction is HOLD"
			);

			listview._setDirection(1, 0);

			assert.equal(
				listview._direction,
				1,
				"Listview direction is NEXT"
			);
		});

		test("_start", function (assert) {
			var element = document.getElementById("mobile-listview-1"),
				container = document.getElementById("mobile-listview-content-1"),
				listview,
				stubEvent,
				liElements,
				helperStub;

			listview = new Listview();
			listview.element = element;

			liElements = element.getElementsByTagName("li");

			helperStub = document.createElement("li");
			container.appendChild(helperStub);
			listview._ui.helper.element = helperStub;

			stubEvent = {
				detail: {
					srcEvent: {
						srcElement: {
							parentElement: liElements[0]
						}
					}
				}
			};

			listview._start(stubEvent);

			assert.ok(
				listview._ui.helper.element.classList.contains(Listview.classes.HELPER),
				"Helper element has HELPER class"
			);
		});

		test("_move", function (assert) {
			var element = document.getElementById("mobile-listview-1"),
				container = document.getElementById("mobile-listview-content-1"),
				listview,
				stubEvent,
				helperStub;

			listview = new Listview();
			listview.element = element;

			helperStub = document.createElement("li");
			container.appendChild(helperStub);
			listview._ui.helper.element = helperStub;

			stubEvent = {
				detail: {
					srcEvent: {
						srcElement: {}
					}
				}
			};

			helpers.stub(listview, "_appendLiStylesToElement", function () {
				assert.ok(true, "Method: _appendLiStylesToElement was called.");
			});

			listview._ui.helper.position = {
				startTop: 0,
				moveTop: 0,
				startIndex: 0
			};

			listview._move(stubEvent);

			helpers.restoreStub(listview, "_appendLiStylesToElement");
		});

		test("_destroy", function (assert) {
			var element = document.getElementById("mobile-listview-1"),
				listview;

			listview = new Listview(element);
			listview._scrollCallback = {};
			listview._scrollableContainer = {};
			listview._pageContainer = {};
			listview._popupContainer = {};
			listview.tempUl = {};
			listview._destroy(element);

			assert.ok(!engine.getBinding("mobile.Listview", element), "Listview widget method _destroy was called.");
			assert.equal(listview._scrollableContainer, null, "Listview scrollable container is set to null.");
		});

		test("_end", function (assert) {
			var element = document.getElementById("mobile-listview-1"),
				container = document.getElementById("mobile-listview-content-1"),
				listview,
				helperStub,
				liElements;

			listview = new Listview();
			listview.element = element;

			liElements = element.getElementsByTagName("li");
			helperStub = document.createElement("li");

			container.appendChild(helperStub);

			listview._ui.holder = liElements[0];
			listview._ui.helper.element = helperStub;

			listview._end();

			assert.ok(Object.keys(listview._ui.helper).length === 0 && listview._ui.helper.constructor === Object, "Listview helper is empty.");
		});

		test("_animationend", function (assert) {
			var element = document.getElementById("mobile-listview-1"),
				listview,
				eventStub,
				elementClasses = element.classList;

			eventStub = {
				target: {
					parentElement: {
						parentElement: element
					}
				},
				stopImmediatePropagation: function(){},
				preventDefault: function(){}
			};

			listview = new Listview();
			listview.element = element;

			elementClasses.add(Listview.classes.ACTIVATE_HANDLERS);
			listview._animationEnd(eventStub);
			assert.equal(elementClasses.contains(Listview.classes.ACTIVATE_HANDLERS), false,
				"Listview scrollable container is set to null.");
			assert.equal(elementClasses.contains(Listview.classes.CANCEL_ANIMATION), true,
				"Listview scrollable container is set to null.");
			elementClasses.remove(Listview.classes.CANCEL_ANIMATION);

			elementClasses.add(Listview.classes.DEACTIVATE_HANDLERS);
			elementClasses.add(Listview.classes.DRAG_MODE);
			listview._animationEnd(eventStub);
			assert.equal(elementClasses.contains(Listview.classes.DEACTIVATE_HANDLERS), false,
				"Listview scrollable container is set to null.");
			assert.equal(elementClasses.contains(Listview.classes.DRAG_MODE), false,
				"Listview scrollable container is set to null.");
		});

		test("_hadleTouchStart", function (assert) {
			var element = document.getElementById("mobile-listview-1"),
				listview,
				handlerStub,
				eventStub;

			handlerStub = document.createElement("div");
			handlerStub.classList.add(Listview.classes.HANDLER);
			element.appendChild(handlerStub);

			eventStub = {
				srcElement: handlerStub
			};

			listview = new Listview();
			listview.element = element;

			helpers.stub(ns.event, "off", function () {
				assert.ok(true, "Method: eventUtils.off was called.");
			});

			listview._dragMode = true;
			listview._handleTouchStart(eventStub);

			assert.ok(true, "handleTouchStart method was called.");
			helpers.restoreStub(ns.event, "off");
		});

		test("_hadleTouchEnd", function (assert) {
			var element = document.getElementById("mobile-listview-1"),
				listview,
				handlerStub,
				eventStub;

			handlerStub = document.createElement("div");
			handlerStub.classList.add(Listview.classes.HANDLER);
			element.appendChild(handlerStub);

			eventStub = {
				srcElement: handlerStub
			};

			listview = new Listview();
			listview.element = element;

			helpers.stub(ns.event, "on", function () {
				assert.ok(true, "Method: eventUtils.on was called.");
			});

			listview._dragMode = true;
			listview._handleTouchEnd(eventStub);

			assert.ok(true, "handleTouchEnd method was called.");
			helpers.restoreStub(ns.event, "on");
		});

		test("_handleReorderScroll", function (assert) {
			var element = document.getElementById("mobile-listview-1"),
				listview,
				liElements,
				reorderElementsStub;

			liElements = [].slice.call(element.querySelectorAll("li"));
			reorderElementsStub = [1, 999];

			listview = new Listview();
			listview.element = element;
			listview._reorderElements = reorderElementsStub;

			listview._handleReorderScroll();

			assert.ok(true, "_handleReorderScroll method was called.");
			assert.equal(liElements[1].style.backgroundColor, "", "Background on element listview element is empty.");
		});

		test("_setReorderBackground", function (assert) {
			var element = document.getElementById("mobile-listview-1"),
				listview,
				liElements;

			listview = new Listview();
			listview.element = element;

			listview._setReorderBackground();
			assert.ok(true, "_setReorderBackground method was called.");

			liElements = [].slice.call(element.querySelectorAll("li"));

			assert.equal(liElements[0].style.backgroundColor, "rgb(250, 250, 250)", "First element has proper background color.");
		});

		test("_appendHandlers", function (assert) {
			var element = document.getElementById("mobile-listview-1"),
				listview,
				liElements;

			liElements = [].slice.call(element.querySelectorAll("li"));

			listview = new Listview();
			listview.element = element;
			listview._liElements = liElements;

			listview._appendHandlers();

			assert.ok(true, "_appendHandlers method was called.");
			assert.ok(listview._liElements[liElements.length - 1].lastChild.classList.contains(Listview.classes.HANDLER), "Listview element containst HANDLER class.");

		});

		test("_removeHandlers", function (assert) {
			var element = document.getElementById("mobile-listview-1"),
				liElements,
				listview;

			listview = new Listview();
			listview.element = element;

			liElements = [].slice.call(element.querySelectorAll("li"));

			listview._liElements = liElements;

			listview._appendHandlers();
			listview._removeHandlers();

			assert.ok(!listview._liElements[0].querySelector("." + Listview.classes.HANDLER), "Handler was removed from listview item.");
		});

		test("_changeLocationDown", function (assert) {
			var element = document.getElementById("mobile-listview-1"),
				container = document.getElementById("mobile-listview-content-1"),
				listview,
				range,
				liElements,
				length,
				holder,
				helperStub;

			range = 123;
			length = 4;

			liElements = [].slice.call(element.querySelectorAll("li"));
			helperStub = document.createElement("li");

			container.appendChild(helperStub);

			listview = new Listview();
			listview.element = element;
			listview._liElements = liElements;

			holder = listview._createHolder();

			listview._ui.helper.element = helperStub;
			listview._recalculateTop();
			listview._snapshotItems[0] = 50;

			listview._changeLocationDown(range, holder, listview._ui.helper, length);

			assert.ok(true, "_changeLocationDown method was called.");
		});

		test("_changeLocationUp", function (assert) {
			var element = document.getElementById("mobile-listview-1"),
				container = document.getElementById("mobile-listview-content-1"),
				listview,
				range,
				liElements,
				length,
				helperStub;

			range = 123;
			length = 2;

			liElements = element.getElementsByTagName("li");
			helperStub = document.createElement("li");

			container.appendChild(helperStub);

			listview = new Listview();
			listview.element = element;

			listview._ui.holder = liElements[0];
			listview._ui.helper.element = helperStub;

			listview._changeLocationUp(range, listview._ui.holder, listview._ui.helper, length);

			assert.ok(true, "_changeLocationUp method was called.");
		});

		test("_prepare", function (assert) {
			var element = document.getElementById("mobile-listview-1"),
				listview;

			assert.ok(!element.classList.contains(Listview.classes.SNAPSHOT), "Listview doesn't have SNAPSHOT class.");

			listview = new Listview();
			listview.element = element;

			listview._prepare();

			assert.ok(true, "_prepare method was called.");
			assert.ok(element.classList.contains(Listview.classes.SNAPSHOT), "Listview has SNAPSHOT class.");

		});

		test("_recalculateTop", function (assert) {
			var element = document.getElementById("mobile-listview-1"),
				liElements,
				listview;

			liElements = [].slice.call(element.querySelectorAll("li"));

			listview = new Listview();
			listview.element = element;
			listview._liElements = liElements;

			listview._recalculateTop();

			assert.equal(listview._liElements.length, listview._snapshotItems.length, "Offset values were created for each element.");
			assert.equal(listview._liElements[0].style.top, listview._snapshotItems[0] + "px", "Top value was successfully added to element.");
		});

		test("_click", function (assert) {
			var element = document.getElementById("mobile-listview-1"),
				listview;

			element.classList.add(Listview.classes.SNAPSHOT);
			listview = new Listview();
			listview.element = element;

			listview._click();

			assert.ok(true, "_click method was called.");
			assert.ok(!listview.element.classList.contains(Listview.classes.SNAPSHOT), "Listview doesn't contain SNAPSHOT class.");
		});

		test("toggleDragMode", function (assert) {
			var element = document.getElementById("mobile-listview-1"),
				scrollableContainer = document.getElementById("mobile-listview-page-1"),
				length,
				listview;

			length = [].slice.call(element.querySelectorAll("li")).length;

			listview = new Listview();
			listview.element = element;

			listview._scrollableContainer = scrollableContainer;

			listview.toggleDragMode();
			assert.ok(listview.element.classList.contains("dragMode"), "Listview contains class dragMode.");
			assert.equal(listview._liElements.length, length, "liElements were properly created.");

			listview.toggleDragMode();
			assert.ok(listview.element.classList.contains("deactivateHandlers"), "Listview contains class deactivateHandlers.");
			assert.ok(!listview.element.classList.contains("cancelAnimation"), "Listview doesn't contain cancelAnimation class.");
		});

		test("_handleEvent", function (assert) {
			var element = document.getElementById("mobile-listview-1"),
				listview,
				elementStub,
				eventStub;

			elementStub = document.createElement("div");
			elementStub.classList.add(Listview.classes.HANDLER);

			listview = new Listview();
			listview.element = element;


			eventStub = {
				type: "click",
				srcElement: elementStub,
				detail: {
					srcEvent: {
						srcElement: elementStub
					}
				},
				preventDefault: function () {
				}
			};

			helpers.stub(listview, "_click", function () {
				assert.ok(true, "Method: _click was called.");
			});
			listview.handleEvent(eventStub);
			helpers.restoreStub(listview, "_click");

			eventStub.type = "dragprepare";
			helpers.stub(listview, "_prepare", function () {
				assert.ok(true, "Method: _prepare was called.");
			});
			listview.handleEvent(eventStub);
			helpers.restoreStub(listview, "_prepare");

			eventStub.type = "dragstart";
			helpers.stub(listview, "_start", function () {
				assert.ok(true, "Method: _prepare was called.");
			});
			listview.handleEvent(eventStub);
			helpers.restoreStub(listview, "_start");

			eventStub.type = "drag";
			helpers.stub(listview, "_move", function () {
				assert.ok(true, "Method: _prepare was called.");
			});
			listview.handleEvent(eventStub);
			helpers.restoreStub(listview, "_move");

			eventStub.type = "dragend";
			helpers.stub(listview, "_end", function () {
				assert.ok(true, "Method: _prepare was called.");
			});
			listview.handleEvent(eventStub);
			helpers.restoreStub(listview, "_end");
		});
	}


	if (typeof define === "function") {
		define([
			"../../../../../../../src/js/core/engine",
			"../../../../../../../src/js/core/util/selectors",
			"../../../../../../../src/js/core/widget/core/Page"
		], function (engine, selectors, Page) {
			return runTests.bind(null, engine, selectors, Page);
		});
	} else {
		runTests(
			tau.engine,
			tau.util.selectors,
			tau.widget.core.Page,
			tau.widget.mobile.Listview,
			window.helpers,
			tau
		);
	}
}());
