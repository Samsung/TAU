/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*global window, define, ns */
/**
 * # List View
 * List view component is used to display, for example, navigation data,
 * results, and data entries, in a list format.
 *
 * ## Default selectors
 * All elements which have a data-role [data-role="listview"] or class .ui-listview
 * will become Listview widgets. It is recommended to use UL, LI tags for list creation
 *
 * ###HTML examples
 *
 * ####Create a page widget using the data-role attribute
 *
 *      @example
 *      <ul data-role="listview">
 *          <li>
 *              ...some item
 *          </li>
 *      </ul>
 *
 * #### Create a listview widget using css classes
 *
 *      @example
 *      <ul class="ui-listview">
 *          <li>
 *            ...some item
 *          </li>
 *      </ul>
 *
 * ### Manual constructor
 *
 * These examples show how to create a Listview widget by hand using
 * JavaScript code
 *
 * #### Created using TAU api
 *
 *      @example
 *      <ul class="ui-listview ui-colored-list" id="list">
 *          <li class="ui-li-flex">
 *               <span class="ui-li-area ui-li-area-a">
 *                   <span class="ui-li-text">
 *                        <span>1 text...</span>
 *                   </span>
 *               </span>
 *           </li>
 *      </ul>
 *
 *      <script type="text/javascript">
 *          var listview = tau.widget.Listview(document.getElementById("list"));
 *      </script>
 *
 * #### Create reorder list with TAU api
 *
 *      @example
 *      <a class="ui-btn" id="dragButton">DRAG</a>
 *      <ul class="ui-listview ui-colored-list" id="reorder">
 *          <li class="ui-li-flex">
 *              <span>1 text...</span>
 *          </li>
 *          <li class="ui-li-flex">
 *              <span>2 text...</span>
 *          </li>
 *      </ul>
 *
 *      <script type="text/javascript">
 *        var listview = tau.widget.Listview(document.getElementById("reorder"));
 *        var dragButton = document.getElementById("dragButton");
 *
 *        tau.event.on(dragButton, "click", function(){
 *            listview.toggleDragMode();
 *        });
 *      </script>
 *
 * ## Options for Listview widget
 *
 * Options can be set by using data-* attributes or by passing them
 * to the constructor.
 *
 * There is also a method **option** for changing them after widget
 * creation.
 *
 * @class ns.widget.mobile.Listview
 * @component-selector .ui-listview, [data-role]="listview"
 * @extends ns.widget.core.Listview
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @since 2.0
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/util",
			"../../../core/util/selectors",
			"../../../core/util/object",
			"../../../core/event",
			"../../../core/event/gesture/Instance",
			"../../../core/event/gesture/Drag",
			"../../../core/engine",
			"../../../core/widget/core/Page",
			"./Popup",
			"./Scrollview",
			"../../../core/widget/core/Listview",
			"../widget",
			"./BaseWidgetMobile",
			"../../../core/widget/BaseKeyboardSupport"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var Page = ns.widget.core.Page,
				Popup = ns.widget.mobile.Popup,
				Scrollview = ns.widget.mobile.Scrollview,
				CoreListview = ns.widget.core.Listview,
				CoreListviewProto = CoreListview.prototype,
				BaseKeyboardSupport = ns.widget.core.BaseKeyboardSupport,
				utils = ns.util,
				objectUtils = utils.object,
				selectorUtils = utils.selectors,
				eventUtils = ns.event,
				now = Date.now,
				colorDefinitionRegex = new RegExp("[^0-9\-\.:,]+", "gi"),
				min = Math.min,
				max = Math.max,
				round = Math.round,
				ceil = Math.ceil,
				slice = [].slice,
				utilsEvents = ns.event,
				isNumber = utils.isNumber,
				colorTmp = [0, 0, 0, 0],
				MAX_IDLE_TIME = 3 * 1000, //3s
				direction = {
					PREV: -1,
					HOLD: 0,
					NEXT: 1
				},
				Listview = function () {
					var self = this,
						/**
						 * @property {Object} options
						 * @property {boolean} options.coloredBackground=false enables/disables colored background
						 */
						options = {
							coloredBackground: false,
							colorRestOfTheScreenBellow: true,
							colorRestOfTheScreenAbove: true,
							firstColorStep: 0,
							lastColorStep: 0,
							multipleSelection: false
						};

					CoreListview.call(self);
					BaseKeyboardSupport.call(self);

					// merge options from prototype
					self.options = (!self.options) ?
						options :
						objectUtils.fastMerge(self.options, options);

					// async function (requestAnimationFrame)
					self._async = utils.requestAnimationFrame;
					// rendering context
					self._context = null;
					// canvas elements style
					self._canvasStyle = null;
					// detected parent scrollable element
					self._scrollableContainer = null;
					// detected parent page element
					self._pageContainer = null;
					// detected parent popup element
					self._popupContainer = null;
					// drawCallback
					self._drawCallback = null;
					// scrollCallback
					self._scrollCallback = null;
					// _backgroundRenderCallback
					self._backgroundRenderCallback = null;
					// flag for async timers
					self._running = false;
					// flag for drawing
					self._redraw = false;
					// starting default color for gradient background
					self._colorBase = [250, 250, 250, 1];
					// color modifier for each background gradient step
					self._colorStep = [0, 0, 0, -0.04];
					// _lastChange
					self._lastChange = 0;
					// arrays of neighbor colored listview related to parent
					self._siblingListsBellow = [];
					self._siblingListsAbove = [];

					initializeGlobalsForDrag(self);
				},
				WIDGET_SELECTOR = "[data-role='listview'], .ui-listview",
				/**
				 * @property {Object} classes
				 * @property {string} classes.BACKGROUND_LAYER
				 * @property {string} classes.GRADIENT_BACKGROUND_DISABLED
				 * @member ns.widget.mobile.Listview
				 * @static
				 * @readonly
				 */
				classes = {
					/**
					 * Set background for listview widget
					 * @style ui-listview-background
					 * @member ns.widget.mobile.Listview
					 */
					"BACKGROUND_LAYER": "ui-listview-background",
					/**
					 * Set background as disable for listview widget
					 * @style ui-listview-background-disabled
					 * @member ns.widget.mobile.Listview
					 */
					"GRADIENT_BACKGROUND_DISABLED": "ui-listview-background-disabled",
					/**
					 * Set index for group in listview widget
					 * @style ui-group-index
					 * @member ns.widget.mobile.Listview
					 */
					"GROUP_INDEX": "ui-group-index",
					/**
					 * Set listview to show in popup widget
					 * @style ui-popup-listview
					 * @member ns.widget.mobile.Listview
					 */
					"POPUP_LISTVIEW": "ui-popup-listview",
					/**
					 * Set drag as active for listview widget
					 * @style ui-drag-active
					 * @member ns.widget.mobile.Listview
					 */
					"DRAG_ACTIVE": "ui-drag-active",
					/**
					 * Set expandable widget. Expandable component allows you to expand or collapse content when tapped.
					 * @style ui-expandable
					 * @member ns.widget.mobile.Listview
					 */
					"EXPANDABLE": "ui-expandable",
					/**
					 * Set element as listview item
					 * @style ui-listview-item
					 * @member ns.widget.mobile.Listview
					 */
					"ITEM": "ui-listview-item",
					/**
					 * Set element as active listview item
					 * @style ui-listview-item-active
					 * @member ns.widget.mobile.Listview
					 */
					"ITEM_ACTIVE": "ui-listview-item-active",
					/**
					 * Set list item selected
					 * @style ui-li-selected
					 * @member ns.widget.mobile.Listview
					 */
					"ITEM_SELECTED": "ui-li-selected",
					/**
					 * Set helper for listview widget
					 * @style ui-listview-helper
					 * @member ns.widget.mobile.Listview
					 */
					"HELPER": "ui-listview-helper",
					/**
					 * Create holder element to help reordering
					 * @style ui-listview-holder
					 * @member ns.widget.mobile.Listview
					 */
					"HOLDER": "ui-listview-holder",
					"SNAPSHOT": "snapshot",
					/**
					 * Create handler for listview widget
					 * @style ui-listview-handler
					 * @member ns.widget.mobile.Listview
					 */
					"HANDLER": "ui-listview-handler",
					"DRAG_MODE": "dragMode",
					"ACTIVATE_HANDLERS": "activateHandlers",
					"CANCEL_ANIMATION": "cancelAnimation",
					"DEACTIVATE_HANDLERS": "deactivateHandlers",
					"FOCUS": "ui-listview-focus",
					"ITEMFOCUS": "ui-listview-item-focus"
				},

				/**
				 * @property {Object} events
				 * @property {string} events.BACKGROUND_RENDER
				 * @member ns.widget.mobile.Listview
				 * @static
				 * @readonly
				 */
				events = {
					"BACKGROUND_RENDER": "event-listview-background-render"
				},
				engine = ns.engine,
				prototype = new CoreListview();

			/**
			 * Set globals for drag functionality, constructor helper
			 * @method initializeGlobalsForDrag
			 * @param {Object} self
			 * @member ns.widget.mobile.Listview
			 * @private
			 */
			function initializeGlobalsForDrag(self) {
				self._topOffset = window.innerHeight;
				self._previousVisibleElement = null;
				self._canvasWidth = 0;
				self._canvasHeight = 0;

				self._dragMode = false;
				self.originalListPosition = 0;
				self.indexDraggingElement = 0;

				self._ui = {
					helper: {},
					holder: {}
				};

				self._snapshotItems = [];
				self._liElements = [];
				self.topValue = 0;
				self.isScrolling = null;
				self._reorderElements = [];
			}

			/**
			 * Modifies input color array (rgba) by a specified
			 * modifier color array (rgba)
			 * @method modifyColor
			 * @param {Array} color input array of color values (rgba)
			 * @param {Array} modifier array of color values (rgba)
			 * @member ns.widget.mobile.Listview
			 * @return {number} Return opacity of color
			 * @private
			 */
			function modifyColor(color, modifier) {
				color[0] += modifier[0];
				color[1] += modifier[1];
				color[2] += modifier[2];
				color[3] += modifier[3];

				color[0] = min(max(0, color[0]), 255);
				color[1] = min(max(0, color[1]), 255);
				color[2] = min(max(0, color[2]), 255);
				color[3] = min(max(0, color[3]), 1);

				return color[3];
			}

			/**
			 * Copies values from one color array (rgba) to other
			 * @method copyColor
			 * @param {Array} inc color array (rgba)
			 * @param {Array} out color array (rgba)
			 * @member ns.widget.mobile.Listview
			 * @private
			 */
			function copyColor(inc, out) {
				out[0] = inc[0];
				out[1] = inc[1];
				out[2] = inc[2];
				out[3] = inc[3];
			}

			/**
			 * Returns number from specified value (mixed) or
			 * 0 if no param is not a number
			 * @method toNumber
			 * @param {mixed} val
			 * @return {number}
			 * @member ns.widget.mobile.Listview
			 * @private
			 */
			function toNumber(val) {
				var res = parseFloat(val);

				// fast NaN check
				if (res === res) {
					return res;
				}

				return 0;
			}

			Listview.classes = objectUtils.fastMerge(classes, CoreListview.classes);
			Listview.events = events;

			function changeLiSelection(checkbox) {
				var liElement = selectorUtils.getClosestByTag(checkbox, "li");

				if (liElement) {
					if (checkbox.checked) {
						liElement.classList.add(classes.ITEM_SELECTED);
					} else {
						liElement.classList.remove(classes.ITEM_SELECTED);
					}
				}
			}

			function onChangeSelection(event) {
				var target = event.target;

				if (target.tagName === "INPUT" && target.type === "checkbox") {
					changeLiSelection(target);
				}
			}

			/**
			 * Enables / disables multiple selection on listview
			 * @method _setMultipleSelection
			 * @param {HTMLElement} element Main element of widget
			 * @param {boolean} enabled option value
			 * @member ns.widget.mobile.Listview
			 * @protected
			 */
			prototype._setMultipleSelection = function (element, enabled) {
				if (enabled) {
					element.addEventListener("change", onChangeSelection, true);
				} else {
					element.removeEventListener("change", onChangeSelection, true);
				}
				this.options.multipleSelection = enabled;
			};

			prototype._setFirstColorStep = function (element, value) {
				value = parseInt(value, 10);
				this.options.firstColorStep = value;

				return true;
			}

			/**
			 * Enables / disables colored background
			 * @method _setColoredBackground
			 * @param {HTMLElement} element Main element of widget
			 * @param {boolean} value option value
			 * @member ns.widget.mobile.Listview
			 * @protected
			 */
			prototype._setColoredBackground = function (element, value) {
				element.classList.toggle(classes.GRADIENT_BACKGROUND_DISABLED, !value);
				this.options.coloredBackground = value;
			};

			prototype._addCanvas = function (element) {
				var canvas = document.createElement("canvas"),
					context = canvas.getContext("2d");

				canvas.classList.add(classes.BACKGROUND_LAYER);
				element.insertBefore(canvas, element.firstElementChild);
				this._context = context;

				return canvas;
			}

			/**
			 * Builds widget
			 * @method _build
			 * @param {HTMLElement} element Main element of widget
			 * @member ns.widget.mobile.Listview
			 * @return {HTMLElement}
			 * @protected
			 */
			prototype._build = function (element) {
				var self = this,
					newElement = CoreListviewProto._build.call(self, element),
					isChildListview = element &&
						selectorUtils.getClosestByClass(element.parentElement, "ui-listview");

				self._isChildListview = isChildListview;

				if (!isChildListview) {
					self._addCanvas(newElement);
				}

				return newElement;
			};

			prototype._getCanvas = function () {
				var self = this,
					canvas;

				// If reference to canvas has been changed.
				// Developer can remove canvas from list, eg. by element.innerHTML = "<li>item</li>"
				if (self._context) {
					canvas = self._context.canvas;
				}
				if (!canvas || !canvas.parentElement) {
					canvas = self.element.querySelector("." + classes.BACKGROUND_LAYER);
					if (!canvas) {
						canvas = self._addCanvas(self.element);
					}
					self._context = canvas.getContext("2d");
				}

				return canvas;
			}

			/**
			 * Init colors used to draw colored bars
			 * @method _prepareColors
			 * @member ns.widget.mobile.Listview
			 * @protected
			 * */
			prototype._prepareColors = function () {
				var self = this,
					canvas = self._getCanvas(),
					computedAfter,
					colorCSSDefinition,
					baseColor,
					modifierColor,
					colors;

				if (canvas) {
					computedAfter = window.getComputedStyle(canvas, ":before");
					colorCSSDefinition = computedAfter.getPropertyValue("content");

					if (colorCSSDefinition.length > 0) {
						colorCSSDefinition = colorCSSDefinition.replace(colorDefinitionRegex, "");
						colors = colorCSSDefinition.split("::");
						if (colors.length === 2) {
							baseColor = colors[0].split(",").filter(isNumber).map(toNumber);
							modifierColor = colors[1].split(",").filter(isNumber).map(toNumber);
							if (baseColor.length > 0) {
								copyColor(baseColor, self._colorBase);
							}
							if (modifierColor.length > 0) {
								copyColor(modifierColor, self._colorStep);
							}
						}
					}
				}
			};

			/**
			 * Refresh background canvas
			 * @method _refreshBackgroundCanvas
			 * @param {HTMLElement} container
			 * @param {HTMLElement} element
			 * @member ns.widget.mobile.Listview
			 * @protected
			 */
			prototype._refreshBackgroundCanvas = function (container, element) {
				var self = this,
					canvas = self._getCanvas(),
					canvasStyle,
					rect,
					// canvasHeight of canvas element
					canvasHeight,
					// canvasWidth of canvas element
					canvasWidth;

				if (canvas) {
					canvasStyle = canvas.style;
					rect = element.getBoundingClientRect();
					canvasHeight = 0;
					canvasWidth = rect.width;

					// calculate canvasHeight of canvas
					if (container) {
						canvasHeight = container.getBoundingClientRect().height;
					}

					canvasHeight = Math.max(rect.height, canvasHeight) + self._topOffset;

					// limit canvas for better performance
					canvasHeight = Math.min(canvasHeight, 4 * window.innerHeight);
					self._canvasHeight = canvasHeight;
					self._canvasWidth = canvasWidth;

					// init canvas
					canvas.setAttribute("width", canvasWidth);
					canvas.setAttribute("height", canvasHeight);
					canvasStyle.width = canvasWidth + "px";
					canvasStyle.height = canvasHeight + "px";
				}
			};

			/**
			 * Find and store all possible containers which may contains the listview
			 * @method _findContainers
			 * @param {HTMLElement} element widget element
			 * @member ns.widget.mobile.Listview
			 * @protected
			 */
			prototype._findContainers = function (element) {
				var self = this;

				self._pageContainer = selectorUtils.getClosestByClass(element, Page.classes.uiPage);
				self._popupContainer = selectorUtils.getClosestByClass(element, Popup.classes.popup);
				self._scrollableContainer = selectorUtils.getClosestByClass(element, Scrollview.classes.clip) ||
					selectorUtils.getClosestByTag(element, "section");
			};

			/**
			 * Method checks if listview contains in popup then add specific class
			 * @method _checkClosestPopup
			 * @member ns.widget.mobile.Listview
			 * @protected
			 */
			prototype._checkClosestPopup = function () {
				var self = this,
					popupContainer = self._popupContainer,
					popupContent;

				if (popupContainer) {
					popupContainer.classList.add(classes.POPUP_LISTVIEW);
					popupContent = popupContainer.querySelector("." + Popup.classes.content);
					if (popupContent) {
						self._scrollableContainer = popupContent;
					}
				}
			};

			/**
			 * Refreshes colored list in widget background,
			 * @method _refreshColoredBackground
			 * @member ns.widget.mobile.Listview
			 * @protected
			 */
			prototype._refreshColoredBackground = function () {
				var self = this,
					element = self.element,
					canvas;

				// if listview contains in popup then add specific class
				self._checkClosestPopup();

				self._redraw = true;
				self._lastChange = Date.now();
				self._previousVisibleElement = null;

				self._prepareColors();
				self._refreshBackgroundCanvas(self._scrollableContainer, element);

				canvas = self._getCanvas();
				if (canvas) {
					if (element.firstElementChild &&
						element.firstElementChild.tagName.toLowerCase() !== "canvas") {
						element.insertBefore(canvas, element.firstElementChild);
					} else if (!(element.firstElementChild instanceof HTMLElement)) {
						element.appendChild(canvas);
					}
					if (typeof self._frameCallback === "function") {
						self._frameCallback();
					}
				}
			};

			/**
			 * Refreshes widget, critical to call after changes (ex. in background color)
			 * @method _refresh
			 * @member ns.widget.mobile.Listview
			 * @protected
			 */
			prototype._refresh = function () {
				var self = this,
					element = self.element,
					popupContainer = selectorUtils.getClosestByClass(element, Popup.classes.popup);

				self._findContainers(element);

				if (self.options.coloredBackground) {
					self._refreshColoredBackground();
				} else if (popupContainer) {
					// if listview contains in popup then remove specific class
					popupContainer.classList.remove(classes.POPUP_LISTVIEW);
					self._popupContainer = popupContainer;
				}
			};

			/**
			 * Initializes widget and async timers
			 * @method _init
			 * @param {HTMLElement} element
			 * @member ns.widget.mobile.Listview
			 * @protected
			 */
			prototype._init = function (element) {
				var self = this,
					context = self._context,
					canvas,
					foundSelf = false,
					siblingLists,
					childrenLists;

				self.options.firstColorStep = parseInt(self.options.firstColorStep, 10);

				if (!self._isChildListview) {
					if (!context) {
						canvas = element.querySelector("." + classes.BACKGROUND_LAYER);
						if (canvas) {
							context = canvas.getContext("2d");
						}
					} else {
						canvas = context.canvas;
					}

					if (context) {
						self._canvasStyle = canvas.style;
						self._frameCallback = self._handleFrame.bind(self);

						self.refresh();
					}
				}

				// check other sibling colored lists
				siblingLists = [].slice.call(self.element.parentElement.querySelectorAll(WIDGET_SELECTOR));
				childrenLists = [].slice.call(self.element.querySelectorAll(WIDGET_SELECTOR));
				// remove itself listview from list and above listview elements
				self._siblingListsBellow = siblingLists.filter(function (listviewElement) {
					// filter children
					if (childrenLists.indexOf(listviewElement) > -1) {
						return false;
					}
					if (foundSelf) {
						return true;
					}
					foundSelf = listviewElement === self.element;

					return false;
				});
				foundSelf = false;
				self._siblingListsAbove = siblingLists.filter(function (listviewElement) {
					// filter children
					if (childrenLists.indexOf(listviewElement) > -1) {
						return false;
					}
					if (foundSelf || listviewElement === self.element) {
						foundSelf = true;
						return false;
					}
					return true;
				});

				if (self._siblingListsBellow.length > 0) {
					// disable coloring the test of space below current listview
					self.options.colorRestOfTheScreenBellow = false;
				}
				if (self._siblingListsAbove.length > 0) {
					self.options.colorRestOfTheScreenAbove = false;
				}

				self._setMultipleSelection(self.element, self.options.multipleSelection);
			};

			/**
			 * Handles scroll event data
			 * @method _handleScroll
			 * @member ns.widget.mobile.Listview
			 * @protected
			 */
			prototype._handleScroll = function () {
				var self = this;

				self._lastChange = now();

				if (!self._running) {
					self._running = true;
					self._async(self._frameCallback);
				}
			};

			/**
			 * Handles touch start event
			 * Used to disable scroll event listener on reorder
			 * @method _handleTouchStart
			 * @member ns.widget.mobile.Listview
			 * @param {Event} event Event
			 * @protected
			 */
			prototype._handleTouchStart = function (event) {
				var self = this,
					scrollableContainer = self._scrollableContainer;

				if (self._dragMode && event.srcElement.classList.contains(classes.HANDLER)) {
					eventUtils.off(scrollableContainer, "scroll", self._reorderCallback);
				}
			};

			/**
			 * Handles touch end event
			 * Used to re-enable scroll event listener when reorder ends
			 * @method _handleTouchEnd
			 * @member ns.widget.mobile.Listview
			 * @param {Event} event Event
			 * @protected
			 */
			prototype._handleTouchEnd = function (event) {
				var self = this,
					scrollableContainer = self._scrollableContainer;

				if (self._dragMode && event.srcElement.classList.contains(classes.HANDLER)) {
					eventUtils.on(scrollableContainer, "scroll", self._reorderCallback);
				}
			};

			/**
			 * Handles scroll and scroll end
			 * This method re-enables canvas on listview and removes backgrounds
			 * added on reorder
			 * It also adds timeout that is triggered on scroll end
			 * @method _handleReorderScroll
			 * @member ns.widget.mobile.Listview
			 * @protected
			 */
			prototype._handleReorderScroll = function () {
				var self = this,
					reorderElements = self._reorderElements,
					liElement,
					liElements;

				self._setColoredBackground(self.element, true);

				liElements = slice.call(self.element.querySelectorAll("li"));

				while (reorderElements.length > 0) {
					liElement = reorderElements.pop();
					if (liElements[liElement]) {
						liElements[liElement].style.backgroundColor = "";
					}
				}

				window.clearTimeout(self.isScrolling);

				self.isScrolling = setTimeout(function () {
					self._setReorderBackground();
				}, 70);
			};

			/**
			 * Refresh event wrapper
			 * @method _backgroundRender
			 * @protected
			 * @member ns.widget.mobile.Listview
			 */
			prototype._backgroundRender = function () {
				this.refresh();
			};

			/**
			 * Handler for "select-all" event. This event is triggering by AppBar widget
			 * when checkbox "All" is changing state
			 * @method _selectAll
			 * @protected
			 * @member ns.widget.mobile.Listview
			 */
			prototype._selectAll = function (event) {
				var checkboxes = [].slice.call(this.element.querySelectorAll("input[type='checkbox']"));

				checkboxes.forEach(function (checkbox) {
					var checked = event.detail.checked;

					checkbox.checked = checked;
					if (checked) {
						checkbox.setAttribute("checked", "checked");
					} else {
						checkbox.removeAttribute("checked");
					}
					changeLiSelection(checkbox);
				});
			};

			/**
			 * Calculate element height as difference between top of current element and top of next element
			 * @param {HTMLElement} nextVisibleLiElement
			 * @param {Object} rectangle
			 * @return {number}
			 */
			function calculateElementHeight(nextVisibleLiElement, rectangle) {
				// we need round to eliminate empty spaces between bars
				if (nextVisibleLiElement) {
					return round(nextVisibleLiElement.getBoundingClientRect().top - rectangle.top);
				}
				return round(rectangle.height);
			}

			/**
			 * Handles frame computations and drawing (if necessary)
			 * @method _handleFrame
			 * @member ns.widget.mobile.Listview
			 * @protected
			 */
			prototype._handleFrame = function () {
				var self = this,
					element = self.element,
					// get all li liElements
					liElements = slice.call(element.querySelectorAll("li")),
					nextVisibleLiElement,
					// scrollable container, connected with scrollview
					scrollableContainer = self._scrollableContainer,
					scrollTop = scrollableContainer ? scrollableContainer.scrollTop : 0,
					scrollableContainerRect = null,
					scrollableContainerTop = 0,
					// top of element to calculate offset top
					top = element.getBoundingClientRect().top,
					previousVisibleElement = self._previousVisibleElement,
					topOffset = self._topOffset,
					rectangle,
					currentVisibleLiElement = getNextVisible(liElements),
					liOffsetTop,
					height;

				if (scrollableContainer) {
					scrollableContainerRect = scrollableContainer.getBoundingClientRect();
					scrollableContainerTop = scrollableContainerRect.top;
				}

				// Reset first color step if listview is above top edge of scroll container
				if (scrollableContainerRect && top < scrollableContainerTop) {
					if (self.options.firstColorStep !== 0) {
						self.options.firstColorStep = 0;
						self._redraw = true;
					}
				}

				while (currentVisibleLiElement) {
					// store size of current element
					rectangle = getElementRectangle(currentVisibleLiElement);
					liOffsetTop = rectangle.top - top ;
					// get next element to calculate difference
					nextVisibleLiElement = getNextVisible(liElements);
					height = calculateElementHeight(nextVisibleLiElement, rectangle);
					if (liOffsetTop + height - (scrollableContainerTop - top - scrollTop) >= scrollTop) {
						if (currentVisibleLiElement !== previousVisibleElement && self._context) {
							self._previousVisibleElement = currentVisibleLiElement;
							self._context.canvas.style.transform = "translateY(" + (liOffsetTop - topOffset) + "px)";
							self._redraw = true;
						}
						currentVisibleLiElement = null;
					} else {
						// go to next element
						currentVisibleLiElement = nextVisibleLiElement;
					}
				}

				if (self._redraw && self._context) {
					self._handleDraw();
				}
				if (self._running && self._context) {
					self._async(self._frameCallback);
				}
				if (now() - self._lastChange >= MAX_IDLE_TIME) {
					self._running = false;
				}
			};

			/**
			 * Get next visible element from list
			 * @param {HTMLElement} liElements
			 * @return {HTMLElement}
			 */
			function getNextVisible(liElements) {
				var next = liElements.shift();

				while (next) {
					if (next.offsetHeight) {
						return next;
					}
					next = liElements.shift();
				}

				return null;
			}

			/**
			 * Calculate rectangle and create new object which is not read-only
			 * @param {HTMLElement} element
			 * @return {{top: (number|*), height: (number|*), left, width}}
			 */
			function getElementRectangle(element) {
				var rectangle = element.getBoundingClientRect();

				return {
					top: rectangle.top,
					height: rectangle.height,
					left: rectangle.left,
					width: rectangle.width
				};
			}

			/**
			 * Draw bar on canvas
			 * @param {CanvasRenderingContext2D} context
			 * @param {Object} rectangle
			 */
			function drawRectangle(context, rectangle) {
				// set color
				context.fillStyle = "rgba(" + colorTmp[0] + "," + colorTmp[1] + "," + colorTmp[2] + "," + colorTmp[3] + ")";
				// first element is bigger by offset, to show color on scroll in up direction
				context.fillRect(rectangle.left, rectangle.top, rectangle.width, rectangle.height);
			}

			/**
			 * Init color variable and clear canvas
			 * @method _prepareCanvas
			 * @member ns.widget.mobile.Listview
			 * @protected
			 */
			prototype._prepareCanvas = function () {
				var self = this,
					i;

				// prepare first color
				copyColor(self._colorBase, colorTmp);

				// modify first color refer to option "firstColorStep"
				for (i = 0; i < self.options.firstColorStep; i++) {
					modifyColor(colorTmp, self._colorStep);
				}
				self.options.lastColorStep = self.options.firstColorStep;

				// clear canvas
				self._context.clearRect(0, 0, self._canvasWidth, self._canvasHeight);
			};

			function adjustRectangle(rectangle, topOffset, listLeft, previousTop) {
				rectangle.height += topOffset;
				rectangle.left -= listLeft;
				rectangle.top = previousTop;
				return rectangle;
			}

			/**
			 * Draw backgrounds on LI elements
			 * @method _drawLiElements
			 * @member ns.widget.mobile.Listview
			 * @return {Object}
			 * @protected
			 */
			prototype._drawLiElements = function () {
				var self = this,
					element = self.element,
					elements = slice.call(element.querySelectorAll("li")),
					firstElement = elements[0],
					firstElementRect,
					visibleLiElement = getNextVisible(elements),
					nextVisibleLiElement,
					context = self._context,
					step = self._colorStep,
					rectangleList = element.getBoundingClientRect(),
					listLeft = rectangleList.left,
					// get scroll top
					scrollableContainer = self._scrollableContainer,
					scrollableContainerTop = (scrollableContainer) ?
						scrollableContainer.getBoundingClientRect().top : 0,
					// store dimensions of li
					rectangle = null,
					// top on each last element
					previousBottom = 0,
					// top offset of widget
					topOffset = self._topOffset,
					changeColor,
					backgroundRectangles = [],
					firstItem = null,
					firstRectangle = null,
					onceClearUpperPartOfCanvas = false;

				if (firstElement) {
					firstElementRect = firstElement.getBoundingClientRect();
					if (firstElementRect.top + firstElementRect.height >= scrollableContainerTop) {
						onceClearUpperPartOfCanvas = true;
					}
				}

				while (visibleLiElement) {
					// if li element is group index, the color of next element wont change
					changeColor = (!visibleLiElement.classList.contains(classes.GROUP_INDEX) &&
						!visibleLiElement.classList.contains(classes.EXPANDABLE));
					//calculate size of li element
					rectangle = getElementRectangle(visibleLiElement);
					nextVisibleLiElement = getNextVisible(elements);
					rectangle.height = calculateElementHeight(nextVisibleLiElement, rectangle);
					//check if next element is group index, if yes then change its color
					if (!changeColor && nextVisibleLiElement &&
						(nextVisibleLiElement.classList.contains(classes.GROUP_INDEX) ||
						nextVisibleLiElement.classList.contains(classes.EXPANDABLE))) {
						changeColor = true;
					}
					// check that element is visible (can be partially visible)
					if (ceil(rectangle.top + rectangle.height) >= scrollableContainerTop) {
						// adjust height for first element
						rectangle = adjustRectangle(rectangle, topOffset, listLeft, previousBottom);
						topOffset = 0;
						backgroundRectangles.push({
							rectangle: rectangle,
							changeColor: changeColor
						})
						previousBottom += rectangle.height;
					}
					// get visibleLiElement element
					visibleLiElement = nextVisibleLiElement;
				}

				//Remove color buffer above first element if list is not coloring rest of the screen
				firstItem = backgroundRectangles[0];
				if (firstItem) {
					firstRectangle = firstItem.rectangle;
					if (!self.options.colorRestOfTheScreenAbove || onceClearUpperPartOfCanvas) {
						// clear area above list and shrink the rectangle to cover only ont
						self._context.clearRect(firstRectangle.left, firstRectangle.top, firstRectangle.width, firstRectangle.height);
						firstRectangle.top += self._topOffset;
						firstRectangle.height -= self._topOffset;
					}
				}


				backgroundRectangles.forEach(function (bgRect) {
					drawRectangle(context, bgRect.rectangle)
					if (bgRect.changeColor) {
						modifyColor(colorTmp, step);
						self.options.lastColorStep++;
					}
				});

				return rectangle;
			};

			/**
			 * Draw rest of empty space
			 * @method _drawEndOfList
			 * @param {Object} rectangle
			 * @param {CanvasRenderingContext2D} context
			 * @protected
			 */
			prototype._drawEndOfList = function (rectangle, context) {
				var canvasRect;

				// fill rest of canvas by color of next item
				if (rectangle !== null) {
					canvasRect = context.canvas.getBoundingClientRect();
					if (rectangle.height + rectangle.top < canvasRect.height) {
						rectangle.top += rectangle.height;
						rectangle.height = canvasRect.height - rectangle.top;
						drawRectangle(context, rectangle);
					}
				}
			};

			/**
			 * Handles drawing of step-gradient background
			 * @method _handleDraw
			 * @member ns.widget.mobile.Listview
			 * @protected
			 */
			prototype._handleDraw = function () {
				var self = this,
					// store dimensions of li
					rectangle,
					nextListview;

				self._prepareCanvas();
				rectangle = self._drawLiElements();
				if (self.options.colorRestOfTheScreenBellow) {
					self._drawEndOfList(rectangle, self._context);
				}
				// change first color of next listviews
				self._siblingListsBellow.forEach(function (listviewElement) {
					nextListview = ns.engine.getBinding(listviewElement);
					if (nextListview) {
						nextListview.option("firstColorStep", self.options.lastColorStep);
					}
				});

				self._redraw = false;
			};

			prototype._focusItem = function (event) {
				var target = event.detail.element,
					liElement = selectorUtils.getClosestByTag(target, "li");

				if (ns.getConfig("keyboardSupport") && (target.tagName === "A")) {
					liElement.classList.add(classes.ITEMFOCUS);
				}
			};

			prototype._blurItem = function (event) {
				var target = event.detail.element,
					liElement = selectorUtils.getClosestByTag(target, "li");

				if (ns.getConfig("keyboardSupport") && (target.tagName === "A")) {
					liElement.classList.remove(classes.ITEMFOCUS);
				}
			};

			prototype._focus = function (element) {
				if (ns.getConfig("keyboardSupport")) {
					element.classList.add(classes.FOCUS);
				}
			}

			prototype._blur = function (element) {
				if (ns.getConfig("keyboardSupport")) {
					element.classList.remove(classes.FOCUS);
				}
			}

			/**
			 * Bounds to events
			 * @method _bindEvents
			 * @member ns.widget.mobile.Listview
			 * @protected
			 */
			prototype._bindEvents = function () {
				var self = this,
					scrollableContainer = self._scrollableContainer,
					pageContainer = self._pageContainer,
					popupContainer = self._popupContainer;

				self._bindEventMouse();

				if (!self._isChildListview) {
					if (scrollableContainer) {
						self._scrollableContainer = scrollableContainer;
						self._scrollCallback = self._handleScroll.bind(self);
						self._reorderCallback = self._handleReorderScroll.bind(self);
						self._touchStartCallback = self._handleTouchStart.bind(self);
						self._touchEndCallback = self._handleTouchEnd.bind(self);
						eventUtils.on(scrollableContainer, "touchstart", self._scrollCallback);
						eventUtils.on(scrollableContainer, "touchmove", self._scrollCallback);
						eventUtils.on(scrollableContainer, "touchstart", self._touchStartCallback);
						eventUtils.on(scrollableContainer, "touchend", self._touchEndCallback);
						eventUtils.on(scrollableContainer, "scroll", self._scrollCallback);
					}

					self._backgroundRenderCallback = self._backgroundRender.bind(self);
					self._selectAllCallback = self._selectAll.bind(self);
					self.on("expand collapse", self._backgroundRenderCallback, false);
					// support rotation
					eventUtils.on(window, "resize", self._backgroundRenderCallback, false);

					if (pageContainer) {
						eventUtils.on(pageContainer, Page.events.BEFORE_SHOW, self._backgroundRenderCallback);
						eventUtils.on(pageContainer, "select-all", self._selectAllCallback, true);
					}
					if (popupContainer) {
						eventUtils.on(popupContainer, Popup.events.transition_start, self._backgroundRenderCallback);
					}

					utilsEvents.on(self.element, "animationend webkitAnimationEnd", self, true);
					utilsEvents.on(self.element, "taufocus", self._focusItem, true);
					utilsEvents.on(self.element, "taublur", self._blurItem, true);
				}
			};

			/**
			 * Destroys widget
			 * @method _destroy
			 * @param {HTMLElement} element
			 * @member ns.widget.mobile.Listview
			 * @protected
			 */
			prototype._destroy = function (element) {
				var self = this;

				//phantom hack
				if (element) {
					utilsEvents.off(element, "animationend webkitAnimationEnd", self, true);
					utilsEvents.off(element, "focus", self._focus, true);
					utilsEvents.off(element, "blur", self._blur, true);
				}

				if (self._context) {
					if (self._context.canvas.parentElement) {
						self._context.canvas.parentElement.removeChild(self._context.canvas);
					}
					self._context = null;
				}

				if (self._scrollCallback) {
					if (self._scrollableContainer) {
						eventUtils.off(self._scrollableContainer, "touchstart", self._scrollCallback);
						eventUtils.off(self._scrollableContainer, "touchmove", self._scrollCallback);
						eventUtils.off(self._scrollableContainer, "scroll", self._scrollCallback);
						eventUtils.off(self._scrollableContainer, "touchstart", this._touchStartCallback);
						eventUtils.off(self._scrollableContainer, "touchend", this._touchEndCallback);
						self._scrollableContainer = null;
					}
					self._scrollCallback = null;
				}

				if (self._backgroundRenderCallback) {
					self.off("expand collapse", self._backgroundRenderCallback, false);
					eventUtils.off(window, "resize", self._backgroundRenderCallback, false);
					if (element) {
						eventUtils.off(element, events.BACKGROUND_RENDER, self._backgroundRenderCallback);
					}
					if (self._pageContainer) {
						eventUtils.off(self._pageContainer, Page.events.BEFORE_SHOW, self._backgroundRenderCallback);
						eventUtils.off(self._pageContainer, "select-all", self._selectAllCallback, true);
						self._pageContainer = null;
					}
					if (self._popupContainer) {
						self._popupContainer.classList.remove(classes.POPUP_LISTVIEW);
						eventUtils.off(self._popupContainer, Popup.events.transition_start, self._backgroundRenderCallback);
						self._popupContainer = null;
					}
					self._backgroundRenderCallback = null;
				}

			};

			/**
			 * Create holder element to help reordering
			 * @method _createHolder
			 * @protected
			 * @member ns.widget.mobile.Listview
			 */
			prototype._createHolder = function () {
				var holder = document.createElement("li"),
					classList = holder.classList;

				classList.add(classes.ITEM);
				classList.add(classes.HOLDER);

				return holder;
			};

			/**
			 * set direction when moving
			 * Based on the previous position defined as moveTop,
			 * the new direction is set
			 * @method _setDirection
			 * @protected
			 * @param {number} moveY new position
			 * @param {number} moveTop previous position
			 * @member ns.widget.mobile.Listview
			 */
			prototype._setDirection = function (moveY, moveTop) {
				var self = this;

				if (moveY < moveTop) {
					self._direction = direction.PREV;
				} else if (moveY === moveTop) {
					self._direction = direction.HOLD;
				} else {
					self._direction = direction.NEXT;
				}
			};

			/**
			 * Relocate elements when "move down" event occur
			 *
			 * New position is calculated for holder element and for items
			 * After setting the new position for item, holder change position in DOM
			 * If we move the pointer for a great length then few items at once should
			 * change location
			 *
			 * When going down we need to go over item for 70% (30% to bottom)
			 * @method _changeLocationDown
			 * @protected
			 * @param {number} range new position for cursor
			 * @param {HTMLElement} holder temporary replacement element
			 * @param {Object} helper is a dragging element
			 * @param {number} length number of items
			 * @member ns.widget.mobile.Listview
			 */
			prototype._changeLocationDown = function (range, holder, helper, length) {
				var item,
					index = 1,
					self = this,
					element = self.element;

				range = range + helper.height;

				//skip first element, as it is canvas with gradient
				for (; index < length; index++) {
					item = element.children[index];
					//to not go over same element and when cursor is over the item for 70%
					if ((helper.element !== item && holder !== item) &&
						range > (self._snapshotItems[index - 1] + item.offsetHeight * 70 / 100) &&
						//item top should be bigger then holder top when going down
						(self._snapshotItems[index - 1] > holder.offsetTop + 15)) {

						//set new top for the moved item, this will consider different height of the elements
						self._snapshotItems[index - 1] = self._snapshotItems[index - 2] + item.offsetHeight;
						self._appendLiStylesToElement(item, self._snapshotItems[index - 2]);
						self._appendLiStylesToElement(holder, self._snapshotItems[index - 1]);
						element.insertBefore(holder, element.children[index].nextSibling);
					}
				}
			};

			/**
			 * Relocate elements when "move up" event occur
			 *
			 * New position is calculated for holder element and for items
			 * After setting the new position for item, holder change position in DOM
			 * If we move the pointer for a great length then few items at once should
			 * change location
			 *
			 * When going up we need to go over item for 30% (70% to bottom)
			 * @method _changeLocationUp
			 * @protected
			 * @param {number} range new position for cursor
			 * @param {HTMLElement} holder temporary replacement element
			 * @param {Object} helper is a dragging element
			 * @param {number} length number of items
			 * @member ns.widget.mobile.Listview
			 */
			prototype._changeLocationUp = function (range, holder, helper, length) {
				var item,
					self = this,
					index = length - 1,
					element = self.element;

				for (; index > 0; index--) {
					item = element.children[index];
					//to not go over same element
					if ((helper.element !== item && holder !== item) &&
						//when cursor is over the item for 70%
						range < (self._snapshotItems[index - 1] + (item.offsetHeight * 30 / 100)) &&
						//item top should be smaller then holder top when going up
						self._snapshotItems[index - 1] + item.offsetHeight < holder.offsetTop + holder.offsetHeight - 15) {

						//set new top for the moved item, this will consider different height of the elements
						self._snapshotItems[index] = self._snapshotItems[index - 1] + holder.offsetHeight;
						element.insertBefore(holder, element.children[index]);
						self._appendLiStylesToElement(holder, self._snapshotItems[index - 1]);
						self._appendLiStylesToElement(item, self._snapshotItems[index]);
					}
				}
			};

			/**
			 * Method for drag prepare event
			 * @method _prepare
			 * @protected
			 * @member ns.widget.mobile.Listview
			 */
			prototype._prepare = function () {
				var self = this,
					element = self.element,
					parentElement = element.parentElement;

				//it means that dragend was not called and handler was just clicked
				if (!element.classList.contains(classes.SNAPSHOT)) {
					self._recalculateTop();
					//save before dragging, the position for original list
					self.originalListPosition = parentElement.getBoundingClientRect().top - 55;
					element.classList.add(classes.SNAPSHOT);
					//change scrollTop as we use absolute and top positions now
					parentElement.scrollTop = -self.originalListPosition;
				}
			};

			/**
			 * Method for dragstart event
			 *
			 * Prepare holder element to replace the drag item
			 * Drag item is represented as helper and it is replaced
			 * by holder because we change the location of helper with top
			 * @method _start
			 * @protected
			 * @param {Event} event Event
			 * @member ns.widget.mobile.Listview
			 */
			prototype._start = function (event) {
				var self = this,
					top,
					holder,
					element = self.element,
					helper = self._ui.helper,
					helperElement = event.detail.srcEvent.srcElement.parentElement,
					helperElementComputed = window.getComputedStyle(helperElement, null),
					helperStyle = helperElement.style;

				top = parseInt(helperElementComputed.getPropertyValue("top"), 10);

				helperElement.classList.add(classes.HELPER);
				holder = self._createHolder();
				holder.style.height = parseFloat(helperElementComputed.getPropertyValue("height")) + "px";
				holder.style.top = helperElement.style.top;

				element.insertBefore(holder, helperElement);
				element.appendChild(helperElement);

				self._appendLiStylesToElement(helperElement, top);

				helper.element = helperElement;
				helper.style = helperStyle;
				helper.height = parseFloat(helperElementComputed.getPropertyValue("height")) || 0;
				helper.startY = event.detail.estimatedY - 55 - helper.height / 2;
				helper.position = {
					startTop: top,
					moveTop: helper.startY,
					startIndex: [].indexOf.call(element.children, holder)
				};

				self._ui.holder = holder;
				helper.element = helperElement;
				self._ui.helper = helper;

				self.topValue = event.detail.estimatedY;
				helper.move = 0;
			};


			/**
			 * callback when drag event
			 * @method _move
			 * @protected
			 * @param {Event} event Event
			 * @member ns.widget.mobile.Listview
			 */
			prototype._move = function (event) {
				var moveY,
					self = this,
					headerHeight,
					ui = self._ui,
					helper = ui.helper,
					holder = ui.holder,
					element = self.element,
					position = helper.position,
					helperElement = helper.element,
					length = element.childElementCount - 1,
					headerElement = document.querySelector(".ui-page-active .ui-header");

				headerHeight = (headerElement) ? headerElement.offsetHeight : 0;
				//move element only in Y axis
				moveY = event.detail.estimatedY - headerHeight - helper.height / 2 +
					-self.originalListPosition;
				self._appendLiStylesToElement(helperElement, moveY);

				self._setDirection(moveY, position.moveTop);
				helperElement.classList.add("ui-listview-item-moved");
				position.moveTop = moveY;

				if (self._direction > 0) {
					self._changeLocationDown(moveY, holder, helper, length);
				} else if (self._direction < 0) {
					self._changeLocationUp(moveY, holder, helper, length);
				}
			};

			/**
			 * Method for dragend event
			 *
			 * Replace holder with the draggable item
			 * @method _end
			 * @protected
			 * @member ns.widget.mobile.Listview
			 */
			prototype._end = function () {
				var self = this,
					element = self.element,
					helper = self._ui.helper,
					holder = self._ui.holder,
					helperElement = helper.element;

				helperElement.classList.remove("ui-listview-item-moved");
				helperElement.classList.remove(classes.HELPER);
				self._appendLiStylesToElement(helperElement, holder.offsetTop);

				element.insertBefore(helperElement, holder);
				element.removeChild(holder);
				self._ui.helper = {};

				self._removeTopOffsets();
				element.classList.remove(classes.SNAPSHOT);

				//change scrollTop as we use absolute and top positions now
				element.parentElement.parentElement.scrollTop = -self.originalListPosition;
				//refresh cache
				self._liElements = slice.call(element.querySelectorAll("li"));
				self.trigger("scroll");
			};

			/**
			 * Method for setting item background on reorder
			 * Ir disables canvas and manually sets background of visible items
			 * It disables canvas on
			 * @method _setReorderBackground
			 * @protected
			 * @member ns.widget.mobile.GridView
			 */
			prototype._setReorderBackground = function () {
				var self = this,
					reorderElements = self._reorderElements,
					element = self.element,
					liElementRect,
					headerElement,
					headerHeight,
					liElements = slice.call(element.querySelectorAll("li")),
					opacity = 100,
					i,
					nextColor;

				headerElement = document.querySelector(".ui-page-active .ui-header");
				headerHeight = (headerElement) ? headerElement.offsetHeight : 0;

				self._setColoredBackground(element, false);
				reorderElements.length = 0;

				for (i = 0; i < liElements.length; i++) {
					liElementRect = liElements[i].getBoundingClientRect();
					if ((liElementRect.bottom >= headerHeight) &&
						(liElementRect.top <= (window.innerHeight || document.documentElement.clientHeight))) {
						reorderElements.push(i);
						nextColor = "rgba(250, 250, 250, " + (opacity / 100) + ")";
						liElements[i].style.backgroundColor = nextColor;
						opacity -= 4;
					}
				}
				if (reorderElements[reorderElements.length - 1] < liElements.length - 1) {
					reorderElements.push(reorderElements[reorderElements.length - 1] + 1);
					liElements[reorderElements[reorderElements.length - 1]].style.backgroundColor = nextColor;
				}
				if (reorderElements[0] > 0) {
					reorderElements.unshift(reorderElements[0] - 1);
					liElements[reorderElements[0]].style.backgroundColor = "white";
				}
			};

			/**
			 * Method for click event
			 *
			 * Because "prepare drag" is run every time when we press handler
			 * we need to use "click" to revert changes done by "prepare drag"
			 * Click is not called if we start drag
			 * @method _click
			 * @protected
			 * @member ns.widget.mobile.Listview
			 */
			prototype._click = function () {
				var self = this;

				self._removeTopOffsets();
				self.element.classList.remove(classes.SNAPSHOT);

				//change scrollTop as we use absolute and top positions now
				self.element.parentElement.parentElement.scrollTop = -self.originalListPosition;
			};

			/**
			 * Method for animationEnd event
			 *
			 * Controls the behavior for 2 animations:
			 * -sliding from right to left
			 * -sliding from left to right
			 * @method _animationEnd
			 * @protected
			 * @param {Event} event Event
			 * @member ns.widget.mobile.Listview
			 */
			prototype._animationEnd = function (event) {
				var self = this,
					listContainer = event.target.parentElement.parentElement,
					listContainerClasses = listContainer.classList;

				if (listContainerClasses.contains(classes.ACTIVATE_HANDLERS)) {
					listContainerClasses.remove(classes.ACTIVATE_HANDLERS);

					//disable animation, so it will not run when reorder
					listContainerClasses.add(classes.CANCEL_ANIMATION);
				} else if (listContainerClasses.contains(classes.DEACTIVATE_HANDLERS)) {
					//remove handlers after animation end
					self._removeHandlers();
					listContainerClasses.remove(classes.DEACTIVATE_HANDLERS);
					listContainerClasses.remove(classes.DRAG_MODE);
				}
				event.stopImmediatePropagation();
				event.preventDefault();
			};

			/**
			 * Handle events
			 * @method handleEvent
			 * @public
			 * @param {Event} event Event
			 * @member ns.widget.mobile.Listview
			 */
			prototype.handleEvent = function (event) {
				var self = this,
					srcElement = (event.detail && event.detail.srcEvent &&
						event.detail.srcEvent.srcElement) || event.srcElement;

				if (srcElement.classList.contains(classes.HANDLER)) {
					switch (event.type) {
						case "click":
							self._click(event);
							event.preventDefault();
							break;
						case "dragprepare":
							self._prepare(event);
							break;
						case "dragstart":
							self._start(event);
							event.preventDefault();
							break;
						case "drag":
							self._move(event);
							break;
						case "dragend":
							self._end(event);
							break;
						case "animationend":
						case "webkitAnimationEnd":
							self._animationEnd(event);
							break;
					}
				}
			};

			/**
			 * add handlers for list elements
			 * @method _appendHandlers
			 * @protected
			 * @member ns.widget.mobile.Listview
			 */
			prototype._appendHandlers = function () {
				var i = 0,
					self = this,
					handler,
					liElement,
					liElements = self._liElements,
					length = liElements.length;

				for (; i < length; i++) {
					liElement = liElements[i];
					handler = document.createElement("div");
					handler.classList.add(classes.HANDLER);
					liElement.appendChild(handler);
				}
			};

			/**
			 * remove handlers from list elements
			 * @method _removeHandlers
			 * @protected
			 * @member ns.widget.mobile.Listview
			 */
			prototype._removeHandlers = function () {
				var i = 0,
					self = this,
					handler,
					liElement,
					liElements = self._liElements,
					length = liElements.length;

				for (; i < length; i++) {
					liElement = liElements[i];
					handler = liElement.querySelector("." + classes.HANDLER);
					liElement.removeChild(handler);
				}
			};

			/**
			 * add new tops
			 * @method _recalculateTop
			 * @protected
			 * @member ns.widget.mobile.Listview
			 */
			prototype._recalculateTop = function () {
				var i = 0,
					self = this,
					offsetTop,
					liElement,
					liElements = self._liElements,
					length = liElements.length;

				for (; i < length; i++) {
					liElement = liElements[i];
					offsetTop = liElement.offsetTop;
					self._snapshotItems.push(offsetTop);
					self._appendLiStylesToElement(liElements[i], self._snapshotItems[i]);
				}
			};

			/**
			 * remove top offsets when going back to standard list mode
			 * @method _removeTopOffsets
			 * @protected
			 * @member ns.widget.mobile.Listview
			 */
			prototype._removeTopOffsets = function () {
				var i = 0,
					self = this,
					liElements = self._liElements,
					length = liElements.length;

				for (; i < length; i++) {
					liElements[i].style.top = "";
				}
			};

			/**
			 * adds top style to the elements
			 * @method _appendLiStylesToElement
			 * @protected
			 * @param {HTMLElement} element
			 * @param {number} Y distance form top
			 * @member ns.widget.mobile.Listview
			 */
			prototype._appendLiStylesToElement = function (element, Y) {
				element.style.top = Y + "px";
			};

			/**
			 * switch list in drag mode, add draggable handlers
			 * @method toggleDragMode
			 * @public
			 * @member ns.widget.mobile.Listview
			 */
			prototype.toggleDragMode = function () {
				var self = this,
					element = self.element,
					scrollableContainer = self._scrollableContainer;

				self._dragMode = !self._dragMode;

				if (self._dragMode) {
					element.classList.add(classes.DRAG_MODE);
					self._liElements = slice.call(element.querySelectorAll("li"));
					self._appendHandlers();
					element.classList.add(classes.ACTIVATE_HANDLERS);

					utilsEvents.on(element, "click drag dragstart dragend dragcancel dragprepare", self, true);
					eventUtils.on(scrollableContainer, "scroll", self._reorderCallback);
					self.trigger("scroll");
					//support drag
					utilsEvents.enableGesture(
						element,
						new utilsEvents.gesture.Drag({
							blockVertical: false
						})
					);
				} else {
					element.classList.remove(classes.CANCEL_ANIMATION);
					element.classList.add(classes.DEACTIVATE_HANDLERS);

					utilsEvents.off(element, "click drag dragstart dragend dragcancel dragprepare", self, true);
					utilsEvents.disableGesture(element);
				}
			};

			Listview.prototype = prototype;
			ns.widget.mobile.Listview = Listview;
			engine.defineWidget(
				"Listview",
				WIDGET_SELECTOR,
				[],
				Listview,
				"mobile",
				true,
				true,
				HTMLUListElement
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Listview;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
