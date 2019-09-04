/*global define, ns, document, window */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*jslint nomen: true, plusplus: true */
/**
 * #Index Scrollbar
 * Shows an index scroll bar with indices, usually for the list.
 *
 * The index scroll bar widget shows on the screen a scrollbar with indices,
 * and fires a select event when the index characters are clicked.
 * The following table describes the supported index scroll bar APIs.
 *
 * ## Manual constructor
 * For manual creation of widget you can use constructor of widget from **tau** namespace:
 *
 *        @example
 *        var indexscrollbarElement = document.getElementById('indexscrollbar'),
 *            indexscrollbar = tau.widget.IndexScrollbar(IndexScrollbar, {index: "A,B,C"});
 *
 * Constructor has one require parameter **element** which are base **HTMLElement** to create widget.
 * We recommend get this element by method *document.getElementById*. Second parameter is **options**
 * and it is a object with options for widget.
 *
 * To add an IndexScrollbar widget to the application, use the following code:
 *
 *      @example
 *      <div id="foo" class="ui-indexscrollbar" data-index="A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z"></div>
 *      <script>
 *          (function() {
 *              var elem = document.getElementById("foo");
 *              tau.widget.IndexScrollbar(elem);
 *              elem.addEventListener("select", function( event ) {
 *                  var index = event.detail.index;
 *                  console.log(index);
 *              });
 *          }());
 *      </script>
 *
 * The index value can be retrieved by accessing event.detail.index property.
 *
 * In the following example, the list scrolls to the position of the list item defined using
 * the li-divider class, selected by the index scroll bar:
 *
 *      @example
 *         <div id="pageIndexScrollbar" class="ui-page">
 *             <header class="ui-header">
 *                 <h2 class="ui-title">IndexScrollbar</h2>
 *             </header>
 *             <section class="ui-content">
 *                 <div style="overflow-y:scroll;">
 *                     <div id="indexscrollbar1"
 *                          class="ui-indexscrollbar"
 *                          data-index="A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z">
 *                     </div>
 *                     <ul class="ui-listview" id="list1">
 *                         <li class="li-divider">A</li>
 *                         <li>Anton</li>
 *                         <li>Arabella</li>
 *                         <li>Art</li>
 *                         <li class="li-divider">B</li>
 *                         <li>Barry</li>
 *                         <li>Bibi</li>
 *                         <li>Billy</li>
 *                         <li>Bob</li>
 *                         <li class="li-divider">D</li>
 *                         <li>Daisy</li>
 *                         <li>Derek</li>
 *                         <li>Desmond</li>
 *                     </ul>
 *                 </div>
 *             </section>
 *             <script>
 *                 (function () {
 *                     var page = document.getElementById("pageIndexScrollbar");
 *                     page.addEventListener("pagecreate", function () {
 *                         var elem = document.getElementById("indexscrollbar1"), // Index scroll bar element
 *                                 elList = document.getElementById("list1"), // List element
 *                                 elDividers = elList.getElementsByClassName("li-divider"), // List items (dividers)
 *                                 elScroller = elList.parentElement, // List's parent item (overflow-y:scroll)
 *                                 dividers = {}, // Collection of list dividers
 *                                 indices = [], // List of index
 *                                 elDivider,
 *                                 i, idx;
 *
 *                         // For all list dividers
 *                         for (i = 0; i < elDividers.length; i++) {
 *                             // Add the list divider elements to the collection
 *                             elDivider = elDividers[i];
 *                             // li element having the li-divider class
 *                             idx = elDivider.innerText;
 *                             // Get a text (index value)
 *                             dividers[idx] = elDivider;
 *                             // Remember the element
 *
 *                             // Add the index to the index list
 *                             indices.push(idx);
 *                         }
 *
 *                         // Change the data-index attribute to the indexscrollbar element
 *                         // before initializing IndexScrollbar widget
 *                         elem.setAttribute("data-index", indices.join(","));
 *
 *                         // Create index scroll bar
 *                         tau.IndexScrollbar(elem);
 *
 *                         // Bind the select callback
 *                         elem.addEventListener("select", function (ev) {
 *                             var elDivider,
 *                                     idx = ev.detail.index;
 *                             elDivider = dividers[idx];
 *                             if (elDivider) {
 *                                 // Scroll to the li-divider element
 *                                 elScroller.scrollTop = elDivider.offsetTop - elScroller.offsetTop;
 *                             }
 *                         });
 *                     });
 *                 }());
 *             </script>
 *         </div>
 *
 * The following example uses the supplementScroll argument, which shows a level 2 index scroll bar.
 * The application code must contain a level 2 index array for each level 1 index character.
 * The example shows a way to analyze list items and create a dictionary (secondIndex) for level 1
 * indices for the index scroll bar, and a dictionary (keyItem) for moving list items at runtime:
 *
 *      @example
 *         <div id="indexscrollbar2" class="ui-indexscrollbar"
 *              data-index="A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z">
 *         </div>
 *         <ul class="ui-listview" id="iBar2_list2">
 *             <li>Anton</li>
 *             <li>Arabella</li>
 *             <li>Art</li>
 *             <li>Barry</li>
 *             <li>Bibi</li>
 *             <li>Billy</li>
 *             <li>Bob</li>
 *             <li>Carry</li>
 *             <li>Cibi</li>
 *             <li>Daisy</li>
 *             <li>Derek</li>
 *             <li>Desmond</li>
 *         </ul>
 *
 *         <script>
 *             (function () {
 *                 var page = document.getElementById("pageIndexScrollbar2"),
 *                         isb,
 *                         index = [],
 *                         supIndex = {},
 *                         elIndex = {};
 *                 page.addEventListener("pageshow", function () {
 *                     var elisb = document.getElementById("indexscrollbar2"),
 *                             elList = document.getElementById("iBar2_list2"), // List element
 *                             elItems = elList.children,
 *                             elScroller = elList.parentElement, // Scroller (overflow-y:hidden)
 *                             indexData = getIndexData(
 *                                     {
 *                                         array: elItems,
 *                                         getTextValue: function (array, i) {
 *                                             return array[i].innerText;
 *                                         }
 *                                     });
 *
 *                     function getIndexData(options) {
 *                         var array = options.array,
 *                                 getTextValue = options.getTextValue,
 *                                 item,
 *                                 text,
 *                                 firstIndex = [],
 *                                 secondIndex = {},
 *                                 keyItem = {},
 *                                 c1 = null,
 *                                 c2 = null,
 *                                 i;
 *
 *                         for (i = 0; i < array.length; i++) {
 *                             item = array[i];
 *                             text = getTextValue(array, i);
 *                             if (text.length > 0) {
 *                                 if (!c1 || c1 !== text[0]) {
 *                                     // New c1
 *                                     c1 = text[0];
 *                                     firstIndex.push(c1);
 *                                     keyItem[c1] = item;
 *                                     secondIndex[c1] = [];
 *                                     c2 = text[1];
 *                                     if (c2) {
 *                                         secondIndex[c1].push(c2);
 *                                     }
 *                                     else {
 *                                         c2 = '';
 *                                     }
 *                                     keyItem[c1 + c2] = item;
 *                                 }
 *                                 else {
 *                                     // Existing c1
 *                                     if (c2 !== text[1]) {
 *                                         c2 = text[1];
 *                                         secondIndex[c1].push(c2);
 *                                         keyItem[c1 + c2] = item;
 *                                     }
 *                                 }
 *                             }
 *                         }
 *                         return {
 *                             firstIndex: firstIndex,
 *                             secondIndex: secondIndex,
 *                             keyItem: keyItem
 *                         };
 *                     }
 *
 *                     // Update the data-index attribute to the indexscrollbar element, with the index list above
 *                     elisb.setAttribute("data-index", indexData.firstIndex);
 *                     // Create IndexScrollbar
 *                     isb = new tau.IndexScrollbar(elisb, {
 *                         index: indexData.firstIndex,
 *                         supplementaryIndex: function (firstIndex) {
 *                             return indexData.secondIndex[firstIndex];
 *                         }
 *                     });
 *                     // Bind the select callback
 *                     elisb.addEventListener("select", function (ev) {
 *                         var el,
 *                             index = ev.detail.index;
 *                         el = indexData.keyItem[index];
 *                         if (el) {
 *                             // Scroll to the li-divider element
 *                             elScroller.scrollTop = el.offsetTop - elScroller.offsetTop;
 *                         }
 *                     });
 *                 });
 *                 page.addEventListener("pagehide", function () {
 *                     console.log('isb2:destroy');
 *                     isb.destroy();
 *                     index.length = 0;
 *                     supIndex = {};
 *                     elIndex = {};
 *                 });
 *             }());
 *         </script>
 *
 * ##Options for widget
 *
 * Options for widget can be defined as _data-..._ attributes or give as parameter in constructor.
 *
 * You can change option for widget using method **option**.
 *
 * ##Methods
 *
 * To call method on widget you can use tau API:
 *
 * First API is from tau namespace:
 *
 *        @example
 *        var indexscrollbarElement = document.getElementById('indexscrollbar'),
 *            indexscrollbar = tau.widget.IndexScrollbar(indexscrollbarElement);
 *
 *        indexscrollbar.methodName(methodArgument1, methodArgument2, ...);
 *
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 * @class ns.widget.core.IndexScrollbar
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../engine",
			"../../../event",
			"../../../event/vmouse",
			"../../../util/object",
			"../../../util/selectors",
			"../../../util/DOM/css",
			"../indexscrollbar",
			"./IndexBar",
			"./IndexIndicator",
			"../../BaseWidget",
			"../Page"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var IndexScrollbar = function () {
					var self = this;// Support calling without 'new' keyword

					self.indicator = null;
					self.indexBar1 = null;	// First IndexBar. Always shown.
					self.indexBar2 = null;	// 2-depth IndexBar. shown if needed.

					self._ui = {};

					self.index = null;
					self.touchAreaOffsetLeft = 0;
					self.indexElements = null;
					self.selectEventTriggerTimeoutId = null;
					self.ulMarginTop = 0;

					self.eventHandlers = {};

				},
				BaseWidget = ns.widget.BaseWidget,
				/**
				 * Alias for class {@link ns.event}
				 * @property {Object} events
				 * @member ns.widget.core.IndexScrollbar
				 * @private
				 * @static
				 */
				events = ns.event,
				selectors = ns.util.selectors,
				/**
				 * Alias for class {@link ns.util.object}
				 * @property {Object} utilsObject
				 * @member ns.widget.core.IndexScrollbar
				 * @private
				 * @static
				 */
				utilsObject = ns.util.object,
				/**
				 * Alias for class ns.util.DOM
				 * @property {ns.util.DOM} doms
				 * @member ns.widget.wearable.IndexScrollbar
				 * @private
				 * @static
				 */
				doms = ns.util.DOM,

				IndexBar = ns.widget.core.indexscrollbar.IndexBar,
				IndexIndicator = ns.widget.core.indexscrollbar.IndexIndicator,
				Page = ns.widget.core.Page,
				pageSelector = ns.engine.getWidgetDefinition("Page").selector,
				EventType = {
					/**
					 * Event triggered after select index by user
					 * @event select
					 * @member ns.widget.core.IndexScrollbar
					 */
					SELECT: "select"
				},

				POINTER_START = "vmousedown",
				POINTER_MOVE = "vmousemove",
				POINTER_END = "vmouseup",

				pointerIsPressed = false,
				prototype = new BaseWidget();

			IndexScrollbar.prototype = prototype;

			utilsObject.merge(prototype, {
				widgetName: "IndexScrollbar",
				widgetClass: "ui-indexscrollbar",

				_configure: function () {
					/**
					 * All possible widget options
					 * @property {Object} options
					 * @property {string} [options.moreChar="*"] more character
					 * @property {string} [options.selectedClass="ui-state-selected"] disabled class name
					 * @property {string} [options.delimiter=","] delimiter in index
					 * @property {string|Array} [options.index=["A","B","C","D","E","F","G","H","I",
					 * "J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","1"]]
					 * String with list of letters separate be delimiter or array of letters
					 * @property {boolean} [options.maxIndexLen=0]
					 * @property {boolean} [options.indexHeight=41]
					 * @property {boolean} [options.keepSelectEventDelay=50]
					 * @property {?boolean} [options.container=null]
					 * @property {?boolean} [options.supplementaryIndex=null]
					 * @property {number} [options.supplementaryIndexMargin=1]
					 * @member ns.widget.core.IndexScrollbar
					 */
					this.options = {
						moreChar: "*",
						indexScrollbarClass: "ui-indexscrollbar",
						selectedClass: "ui-state-selected",
						indicatorClass: "ui-indexscrollbar-indicator",
						delimiter: ",",
						index: [
							"A", "B", "C", "D", "E", "F", "G", "H",
							"I", "J", "K", "L", "M", "N", "O", "P", "Q",
							"R", "S", "T", "U", "V", "W", "X", "Y", "Z", "1"
						],
						maxIndexLen: 0,
						indexHeight: 41,
						keepSelectEventDelay: 50,
						container: null,
						supplementaryIndex: null,
						supplementaryIndexMargin: 1,
						moreCharLineHeight: 9,
						verticalCenter: true,
						indicatorAlignTo: "container"
					};
				},

				/**
				 * This method builds widget.
				 * @method _build
				 * @protected
				 * @param {HTMLElement} element
				 * @return {HTMLElement}
				 * @member ns.widget.core.IndexScrollbar
				 */
				_build: function (element) {
					return element;
				},

				/**
				 * This method inits widget.
				 * @method _init
				 * @protected
				 * @param {HTMLElement} element
				 * @return {HTMLElement}
				 * @member ns.widget.core.IndexScrollbar
				 */
				_init: function (element) {
					var self = this,
						options = self.options;

					element.classList.add(options.indexScrollbarClass);

					self._ui.page = selectors.getClosestBySelector(element, pageSelector);
					self._setIndex(element, options.index);
					self._setMaxIndexLen(element, options.maxIndexLen);
					self._setInitialLayout(); // This is needed for creating sub objects
					self._createSubObjects();

					self._updateLayout();

					// Mark as extended
					self._extended(true);
					return element;
				},

				/**
				 * This method refreshes widget.
				 * @method _refresh
				 * @protected
				 * @return {HTMLElement}
				 * @member ns.widget.core.IndexScrollbar
				 */
				_refresh: function () {
					var self = this;

					if (self._isExtended()) {
						self._unbindEvent();
						self.indicator.hide();
						self._extended(false);
					}

					self._setIndex(self.element, self.options.index);
					self._updateLayout();
					self.indexBar1.options.index = self.options.index;
					self.indexBar1.refresh();
					self.indicator.fitToContainer();
					self._bindEvents();
					self._extended(true);
				},

				/**
				 * This method destroys widget.
				 * @method _destroy
				 * @protected
				 * @member ns.widget.core.IndexScrollbar
				 */
				_destroy: function () {
					var self = this;

					if (self.isBound()) {
						self._unbindEvent();
						self._extended(false);
						self._destroySubObjects();
						self.indicator = null;
						self.index = null;
						self.eventHandlers = {};
					}
				},

				/**
				 * This method creates indexBar1 and indicator in the indexScrollbar
				 * @method _createSubObjects
				 * @protected
				 * @member ns.widget.core.IndexScrollbar
				 */
				_createSubObjects: function () {
					var self = this,
						options = self.options,
						element = self.element;
					// indexBar1

					self.indexBar1 = new IndexBar(document.createElement("UL"), {
						container: element,
						offsetLeft: 0,
						index: options.index,
						verticalCenter: options.verticalCenter,
						indexHeight: options.indexHeight,
						maxIndexLen: options.maxIndexLen,
						paddingBottom: options.paddingBottom,
						moreCharLineHeight: options.moreCharLineHeight
					});

					// indexBar2
					if (typeof options.supplementaryIndex === "function") {
						self.indexBar2 = new IndexBar(document.createElement("UL"), {
							container: element,
							offsetLeft: -element.clientWidth - options.supplementaryIndexMargin,
							index: [],	// empty index
							indexHeight: options.indexHeight,
							ulClass: "ui-indexscrollbar-supplementary"
						});
						self.indexBar2.hide();
					}

					// indicator
					self.indicator = new IndexIndicator(document.createElement("DIV"), {
						container: self._getContainer(),
						referenceElement: self.element,
						className: options.indicatorClass,
						alignTo: options.indicatorAlignTo
					});

				},

				/**
				 * This method destroys sub-elements: index bars and indicator.
				 * @method _destroySubObjects
				 * @protected
				 * @member ns.widget.core.IndexScrollbar
				 */
				_destroySubObjects: function () {
					var subObjs = {
							iBar1: this.indexBar1,
							iBar2: this.indexBar2,
							indicator: this.indicator
						},
						subObj,
						el,
						i;

					for (i in subObjs) {
						if (subObjs.hasOwnProperty(i)) {
							subObj = subObjs[i];
							if (subObj) {
								el = subObj.element;
								subObj.destroy();
								el.parentNode.removeChild(el);
							}
						}
					}
				},

				/**
				 * This method sets initial layout.
				 * @method _setInitialLayout
				 * @protected
				 * @member ns.widget.core.IndexScrollbar
				 */
				_setInitialLayout: function () {
					var indexScrollbar = this.element,
						container = this._getContainer(),
						containerPosition = window.getComputedStyle(container).position,
						indexScrollbarStyle = indexScrollbar.style;

					// Set the indexScrollbar's position, if needed
					if (containerPosition !== "absolute" && containerPosition !== "relative") {
						indexScrollbarStyle.top = container.offsetTop + "px";
						indexScrollbarStyle.height = container.offsetHeight + "px";
					}
				},

				/**
				 * This method calculates maximum index length.
				 * @method _setMaxIndexLen
				 * @protected
				 * @param {HTMLElement} element
				 * @param {number} value
				 * @member ns.widget.core.IndexScrollbar
				 */
				_setMaxIndexLen: function (element, value) {
					var self = this,
						options = self.options,
						container = self._getContainer(),
						containerHeight = container.offsetHeight;

					if (value <= 0) {
						value = Math.floor(containerHeight / options.indexHeight);
					}
					if (value > 0 && value % 2 === 0) {
						value -= 1;	// Ensure odd number
					}
					options.maxIndexLen = value;
				},

				/**
				 * This method updates layout.
				 * @method _updateLayout
				 * @protected
				 * @member ns.widget.core.IndexScrollbar
				 */
				_updateLayout: function () {
					var self = this;

					self._setInitialLayout();
					self._draw();

					self.touchAreaOffsetLeft = self.element.offsetLeft - 10;
				},

				/**
				 * This method draws additional sub-elements
				 * @method _draw
				 * @protected
				 * @member ns.widget.core.IndexScrollbar
				 */
				_draw: function () {
					this.indexBar1.show();
					return this;
				},

				/**
				 * This method removes indicator.
				 * @method _removeIndicator
				 * @protected
				 * @member ns.widget.core.IndexScrollbar
				 */
				_removeIndicator: function () {
					var indicator = this.indicator,
						parentElem = indicator.element.parentNode;

					parentElem.removeChild(indicator.element);
					indicator.destroy();
					this.indicator = null;
				},

				/**
				 * This method returns the receiver of event by position.
				 * @method _getEventReceiverByPosition
				 * @param {number} posX The position relative to the left edge of the document.
				 * @return {?ns.widget.core.indexscrollbar.IndexBar} Receiver of event
				 * @protected
				 * @member ns.widget.core.IndexScrollbar
				 */
				_getEventReceiverByPosition: function (posX) {
					var windowWidth = window.innerWidth,
						elementWidth = this.element.clientWidth,
						receiver;

					if (this.options.supplementaryIndex) {
						if (windowWidth - elementWidth <= posX && posX <= windowWidth) {
							receiver = this.indexBar1;
						} else {
							receiver = this.indexBar2;
						}
					} else {
						receiver = this.indexBar1;
					}
					return receiver;
				},

				/**
				 * This method updates indicator.
				 * It sets new value of indicator and triggers event "select".
				 * @method _updateIndicatorAndTriggerEvent
				 * @param {number} val The value of indicator
				 * @protected
				 * @member ns.widget.core.IndexScrollbar
				 */
				_updateIndicatorAndTriggerEvent: function (val) {
					this.indicator.setValue(val);
					this.indicator.show();
					if (this.selectEventTriggerTimeoutId) {
						window.clearTimeout(this.selectEventTriggerTimeoutId);
					}
					this.selectEventTriggerTimeoutId = window.setTimeout(function () {
						this.trigger(EventType.SELECT, {index: val});
						this.selectEventTriggerTimeoutId = null;
					}.bind(this), this.options.keepSelectEventDelay);
				},

				/**
				 * This method is executed on event "touchstart"
				 * @method _onTouchStartHandler
				 * @param {Event} event Event
				 * @protected
				 * @member ns.widget.core.IndexScrollbar
				 */
				_onTouchStartHandler: function (event) {
					var touches = event.touches || event._originalEvent && event._originalEvent.touches,
						pos = null,
						// At touchstart, only indexBar1 is shown.
						iBar1 = null,
						idx = 0,
						val = 0;

					pointerIsPressed = true;

					if (touches && (touches.length > 1)) {
						event.preventDefault();
						event.stopPropagation();
						return;
					}
					pos = this._getPositionFromEvent(event);
					// At touchstart, only indexBar1 is shown.
					iBar1 = this.indexBar1;
					idx = iBar1.getIndexByPosition(pos.y);
					val = iBar1.getValueByIndex(idx);

					iBar1.select(idx);	// highlight selected value

					document.addEventListener(POINTER_MOVE, this.eventHandlers.touchMove);
					document.addEventListener(POINTER_END, this.eventHandlers.touchEnd);
					document.addEventListener("touchcancel", this.eventHandlers.touchEnd);

					this._updateIndicatorAndTriggerEvent(val);
				},

				/**
				 * This method is executed on event "touchmove"
				 * @method _onTouchMoveHandler
				 * @param {Event} event Event
				 * @protected
				 * @member ns.widget.core.IndexScrollbar
				 */
				_onTouchMoveHandler: function (event) {
					var touches = event._originalEvent && event._originalEvent.touches,
						pos = null,
						iBar1 = null,
						iBar2 = null,
						idx,
						iBar,
						val;

					if (touches && (touches.length > 1) || !pointerIsPressed) {
						events.preventDefault(event);
						events.stopPropagation(event);
						return;
					}

					pos = this._getPositionFromEvent(event);
					iBar1 = this.indexBar1;
					iBar2 = this.indexBar2;

					// Check event receiver: iBar1 or iBar2
					iBar = this._getEventReceiverByPosition(pos.x);
					if (iBar === iBar2) {
						iBar2.options.index = this.options.supplementaryIndex(iBar1.getValueByIndex(iBar1.selectedIndex));
						iBar2.refresh();
					}

					// get index and value from iBar1 or iBar2
					idx = iBar.getIndexByPosition(pos.y);
					val = iBar.getValueByIndex(idx);
					if (iBar === iBar2) {
						// Update val to make a concatenated string for indexIndicator
						val = iBar1.getValueByIndex(iBar1.selectedIndex) + val;
					} else if (iBar2 && !iBar2.isShown()) {
						// iBar1 is selected.
						// Set iBar2's paddingTop, only when the iBar2 isn't shown
						iBar2.setPaddingTop(iBar1.getOffsetTopByIndex(iBar1.selectedIndex));
					}

					// update iBars
					iBar.select(idx);	// highlight selected value
					iBar.show();
					if (iBar1 === iBar && iBar2) {
						iBar2.hide();
					}

					// update indicator
					this._updateIndicatorAndTriggerEvent(val);

					events.preventDefault(event);
					events.stopPropagation(event);
				},

				/**
				 * This method is executed on event "touchend"
				 * @method _onTouchEndHandler
				 * @param {Event} event Event
				 * @protected
				 * @member ns.widget.core.IndexScrollbar
				 */
				_onTouchEndHandler: function (event) {
					var self = this,
						touches = event._originalEvent && event._originalEvent.touches;

					if (touches && (touches.length === 0) || !touches) {
						pointerIsPressed = false;
					}
					self.indicator.hide();
					self.indexBar1.clearSelected();
					if (self.indexBar2) {
						self.indexBar2.clearSelected();
						self.indexBar2.hide();
					}

					document.removeEventListener(POINTER_MOVE, self.eventHandlers.touchMove);
					document.removeEventListener(POINTER_END, self.eventHandlers.touchEnd);
					document.removeEventListener("touchcancel", self.eventHandlers.touchEnd);
				},

				_bindOnPageShow: function () {
					var self = this;

					self.eventHandlers.onPageShow = self.refresh.bind(self);
					if (self._ui.page) {
						self._ui.page.addEventListener(Page.events.BEFORE_SHOW, self.eventHandlers.onPageShow, false);
					}
				},

				_unbindOnPageShow: function () {
					var self = this;

					if (self.eventHandlers.onPageShow && self._ui.page) {
						self._ui.page.removeEventListener(Page.events.BEFORE_SHOW, self.eventHandlers.onPageShow, false);
					}
				},

				/**
				 * This method binds events to widget.
				 * @method _bindEvents
				 * @protected
				 * @member ns.widget.core.IndexScrollbar
				 */
				_bindEvents: function () {
					var self = this;

					self._bindResizeEvent();
					self._bindEventToTriggerSelectEvent();
					self._bindOnPageShow();
				},

				/**
				 * This method unbinds events to widget.
				 * @method _unbindEvent
				 * @protected
				 * @member ns.widget.core.IndexScrollbar
				 */
				_unbindEvent: function () {
					var self = this;

					self._unbindResizeEvent();
					self._unbindEventToTriggerSelectEvent();
					self._unbindOnPageShow();
				},

				/**
				 * This method binds event "resize".
				 * @method _bindResizeEvent
				 * @protected
				 * @member ns.widget.core.IndexScrollbar
				 */
				_bindResizeEvent: function () {
					this.eventHandlers.onresize = function (/* ev */) {
						this.refresh();
					}.bind(this);

					window.addEventListener("resize", this.eventHandlers.onresize);
				},

				/**
				 * This method unbinds event "resize".
				 * @method _bindResizeEvent
				 * @protected
				 * @member ns.widget.core.IndexScrollbar
				 */
				_unbindResizeEvent: function () {
					if (this.eventHandlers.onresize) {
						window.removeEventListener("resize", this.eventHandlers.onresize);
					}
				},

				/**
				 * This method binds touch events.
				 * @method _bindEventToTriggerSelectEvent
				 * @protected
				 * @member ns.widget.core.IndexScrollbar
				 */
				_bindEventToTriggerSelectEvent: function () {
					var self = this;

					self.eventHandlers.touchStart = self._onTouchStartHandler.bind(self);
					self.eventHandlers.touchEnd = self._onTouchEndHandler.bind(self);
					self.eventHandlers.touchMove = self._onTouchMoveHandler.bind(self);

					self.element.addEventListener(POINTER_START, self.eventHandlers.touchStart);
				},

				/**
				 * This method unbinds touch events.
				 * @method _unbindEventToTriggerSelectEvent
				 * @protected
				 * @member ns.widget.core.IndexScrollbar
				 */
				_unbindEventToTriggerSelectEvent: function () {
					var self = this;

					self.element.removeEventListener(POINTER_START, self.eventHandlers.touchStart);
				},

				/**
				 * This method sets or gets data from widget.
				 * @method _data
				 * @param {string|Object} key
				 * @param {*} val
				 * @return {*} Return value of data or widget's object
				 * @protected
				 * @member ns.widget.core.IndexScrollbar
				 */
				_data: function (key, val) {
					var el = this.element,
						d = el.__data,
						idx;

					if (!d) {
						d = el.__data = {};
					}
					if (typeof key === "object") {
						// Support data collection
						for (idx in key) {
							if (key.hasOwnProperty(idx)) {
								this._data(idx, key[idx]);
							}
						}
						return this;
					} else {
						if ("undefined" === typeof val) {	// Getter
							return d[key];
						} else {	// Setter
							d[key] = val;
							return this;
						}
					}
				},

				/**
				 * This method checks if element is valid element of widget IndexScrollbar.
				 * @method _isValidElement
				 * @param {HTMLElement} el
				 * @return {boolean} True, if element is valid.
				 * @protected
				 * @member ns.widget.core.IndexScrollbar
				 */
				_isValidElement: function (el) {
					return el.classList.contains(this.widgetClass);
				},

				/**
				 * This method checks if widget is extended.
				 * @method _isExtended
				 * @return {boolean} True, if element is extended.
				 * @protected
				 * @member ns.widget.core.IndexScrollbar
				 */
				_isExtended: function () {
					return !!this._data("extended");
				},

				/**
				 * This method sets value of "extended" to widget.
				 * @method _extended
				 * @param {boolean} flag Value for extended
				 * @protected
				 * @member ns.widget.core.IndexScrollbar
				 */
				_extended: function (flag) {
					this._data("extended", flag);
					return this;
				},

				/**
				 * This method gets indices prepared from parameter
				 * or index of widget.
				 * @method _setIndex
				 * @param {HTMLElement} element element
				 * @param {string} value Indices to prepared
				 * @protected
				 * @member ns.widget.core.IndexScrollbar
				 */
				_setIndex: function (element, value) {
					var options = this.options;

					if (typeof value === "string") {
						value = value.split(options.delimiter);	// delimiter
					}
					options.index = value;
				},

				/**
				 * This method gets offset of element.
				 * @method _getOffset
				 * @param {HTMLElement} el Element
				 * @return {Object} Offset with "top" and "left" properties
				 * @protected
				 * @member ns.widget.core.IndexScrollbar
				 */
				_getOffset: function (el) {
					var left = 0,
						top = 0;

					do {
						top += el.offsetTop;
						left += el.offsetLeft;
						el = el.offsetParent;
					} while (el);

					return {
						top: top,
						left: left
					};
				},

				/**
				 * This method returns container of widget.
				 * @method _getContainer
				 * @return {HTMLElement} Container
				 * @protected
				 * @member ns.widget.core.IndexScrollbar
				 */
				_getContainer: function () {
					var container = this.options.container,
						element = this.element,
						parentElement = element.parentNode,
						overflow;

					if (!container) {
						while (parentElement && parentElement !== document.body) {
							overflow = doms.getCSSProperty(parentElement, "overflow-y");
							if (overflow === "scroll" || (overflow === "auto" && parentElement.scrollHeight > parentElement.clientHeight)) {
								return parentElement;
							}
							parentElement = parentElement.parentNode;
						}
						container = element.parentNode;
					}

					return container || element.parentNode;
				},

				/**
				 * Returns position of event.
				 * @method _getPositionFromEvent
				 * @return {Object} Position of event with properties "x" and "y"
				 * @protected
				 * @param {Event} ev
				 * @member ns.widget.core.IndexScrollbar
				 */
				_getPositionFromEvent: function (ev) {
					return ev.type.search(/^touch/) !== -1 ?
						{x: ev.touches[0].clientX, y: ev.touches[0].clientY} :
						{x: ev.clientX, y: ev.clientY};
				},

				/**
				 * Adds event listener to element of widget.
				 * @method addEventListener
				 * @param {string} type Name of event
				 * @param {Function} listener Function to be executed
				 * @member ns.widget.core.IndexScrollbar
				 */
				addEventListener: function (type, listener) {
					this.element.addEventListener(type, listener);
				},

				/**
				 * Removes event listener from element of widget.
				 * @method removeEventListener
				 * @param {string} type Name of event
				 * @param {Function} listener Function to be removed
				 * @member ns.widget.core.IndexScrollbar
				 */
				removeEventListener: function (type, listener) {
					this.element.removeEventListener(type, listener);
				}

			});

			// definition
			ns.widget.core.IndexScrollbar = IndexScrollbar;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return IndexScrollbar;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
