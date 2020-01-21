/*global window, define, ns */
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
/*jslint nomen: true, white: true, plusplus: true*/
/**
 * #Virtual list
 * Shows a list view for large amounts of data.
 *
 * @class ns.widget.core.VirtualListview
 * @extends ns.core.BaseWidget
 * @since 2.0
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../util",
			"../../util/selectors",
			"../../util/scrolling",
			"../../event",
			"../BaseWidget",
			"../core"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * @property {Object} Widget Alias for {@link ns.widget.BaseWidget}
			 * @member ns.widget.core.VirtualListview
			 * @private
			 * @static
			 */
			var BaseWidget = ns.widget.BaseWidget,
				// Constants definition
				/**
				 * Defines index of scroll `{@link ns.widget.core.VirtualListview#_scroll}.direction`
				 * @property {number} SCROLL_NONE
				 * to retrieve if user is not scrolling
				 * @private
				 * @static
				 * @member ns.widget.core.VirtualListview
				 */
				SCROLL_NONE = -1,
				/**
				 * Defines index of scroll `{@link ns.widget.core.VirtualListview#_scroll}.direction`
				 * @property {number} SCROLL_UP
				 * to retrieve if user is scrolling up
				 * @private
				 * @static
				 * @member ns.widget.core.VirtualListview
				 */
				SCROLL_UP = 0,
				/**
				 * Defines index of scroll {@link ns.widget.core.VirtualListview#_scroll}
				 * @property {number} SCROLL_DOWN
				 * to retrieve if user is scrolling down
				 * @private
				 * @static
				 * @member ns.widget.core.VirtualListview
				 */
				SCROLL_DOWN = 1,
				/**
				 * Defines index of scroll {@link ns.widget.core.VirtualListview#_scroll}
				 * @property {number} SCROLL_LEFT
				 * to retrieve if user is scrolling left
				 * @private
				 * @static
				 * @member ns.widget.core.VirtualListview
				 */
				SCROLL_LEFT = 2,
				/**
				 * Defines index of scroll `{@link ns.widget.core.VirtualListview#_scroll}.direction`
				 * @property {number} SCROLL_RIGHT
				 * to retrieve if user is scrolling right
				 * @private
				 * @static
				 * @member ns.widget.core.VirtualListview
				 */
				SCROLL_RIGHT = 3,

				/**
				 * Defines vertical scrolling orientation. It's default orientation.
				 * @property {string} VERTICAL
				 * @private
				 * @static
				 */
				VERTICAL = "y",
				/**
				 * Defines horizontal scrolling orientation.
				 * @property {string} HORIZONTAL
				 * @private
				 * @static
				 */
				HORIZONTAL = "x",
				/**
				 * Determines that scroll event should not be taken into account if scroll event occurs.
				 * @property {boolean} blockEvent
				 * @private
				 * @static
				 */
				blockEvent = false,
				/**
				 * Handle window timeout ID.
				 * @property {number} timeoutHandler
				 * @private
				 * @static
				 */

				/**
				 * Alias for ns.util
				 * @property {Object} util
				 * @private
				 * @static
				 */
				util = ns.util,

				/**
				 * Alias for ns.util.requestAnimationFrame
				 * @property {Function} requestFrame
				 * @private
				 * @static
				 */
				requestFrame = util.requestAnimationFrame,

				selectors = util.selectors,

				utilEvent = ns.event,

				utilScrolling = ns.util.scrolling,

				filter = [].filter,

				/**
				 * Local constructor function
				 * @method VirtualListview
				 * @private
				 * @member ns.widget.core.VirtualListview
				 */
				VirtualListview = function () {
					var self = this;
					/**
					 * VirtualListview widget's properties associated with
					 * @property {Object} ui
					 * User Interface
					 * @property {?HTMLElement} [ui.scrollview=null] Scroll element
					 * @property {?HTMLElement} [ui.spacer=null] HTML element which makes scrollbar proper
					 * size
					 * @property {number} [ui.itemSize=0] Size of list element in pixels. If scrolling is
					 * vertically it's item width in other case it"s height of item element
					 * @member ns.widget.core.VirtualListview
					 */

					self._ui = {
						scrollview: null,
						spacer: null,
						itemSize: 0
					};

					/**
					 * Holds information about scrolling state
					 * @property {Object} _scroll
					 * @property {Array} [_scroll.direction=[0,0,0,0]] Holds current direction of scrolling.
					 * Indexes suit to following order: [up, left, down, right]
					 * @property {number} [_scroll.lastPositionX=0] Last scroll position from top in pixels.
					 * @property {number} [_scroll.lastPositionY=0] Last scroll position from left in pixels.
					 * @property {number} [_scroll.lastJumpX=0] Difference between last and current
					 * position of horizontal scroll.
					 * @property {number} [_scroll.lastJumpY=0] Difference between last and current
					 * position of vertical scroll.
					 * @property {number} [_scroll.clipWidth=0] Width of clip - visible area for user.
					 * @property {number} [_scroll.clipHeight=0] Height of clip - visible area for user.
					 * @member ns.widget.core.VirtualListview
					 */
					self._scroll = {
						direction: [0, 0, 0, 0],
						dir: SCROLL_NONE,
						lastPositionX: 0,
						lastPositionY: 0,
						lastJumpX: 0,
						lastJumpY: 0,
						clipWidth: 0,
						clipHeight: 0
					};

					/**
					 * Name of widget
					 * @property {string} name
					 * @member ns.widget.core.VirtualListview
					 * @static
					 */
					self.name = "VirtualListview";

					/**
					 * Current zero-based index of data set.
					 * @property {number} _currentIndex
					 * @member ns.widget.core.VirtualListview
					 * @protected
					 */
					self._currentIndex = 0;

					/**
					 * VirtualListview widget options.
					 * @property {Object} options
					 * @property {number} [options.bufferSize=100] Number of items of result set. The default
					 * value is 100.
					 * As the value gets higher, the loading time increases while the system performance
					 * improves. So you need to pick a value that provides the best performance
					 * without excessive loading time. It's recommended to set bufferSize at least 3 times
					 * bigger than number
					 * of visible elements.
					 * @property {number} [options.dataLength=0] Total number of items.
					 * @property {string} [options.orientation=VERTICAL] Scrolling orientation. Default
					 * VERTICAL scrolling enabled.
					 * @property {Object} options.listItemUpdater Holds reference to method which modifies
					 * list item, depended
					 * at specified index from database. **Method should be overridden by developer using
					 * {@link ns.widget.core.VirtualListview#setListItemUpdater} method.** or defined as a
					 * config
					 * object. Method takes two parameters:
					 *  -  element {HTMLElement} List item to be modified
					 *  -  index {number} Index of data set
					 * @member ns.widget.core.VirtualListview
					 */
					self.options = {
						bufferSize: 100,
						dataLength: 0,
						orientation: VERTICAL,
						listItemUpdater: null,
						scrollElement: null,
						optimizedScrolling: false
					};

					/**
					 * Binding for scroll event listener.
					 * @method _scrollEventBound
					 * @member ns.widget.core.VirtualListview
					 * @protected
					 */
					self._scrollEventBound = null;

					/**
					 * Render function
					 * @method _render
					 * @protected
					 * @member ns.widget.core.VirtualListview
					 */
					self._render = render.bind(null, this);

					/**
					 * Render command list
					 * @property {Array.<*>} _renderList
					 * @member ns.widget.core.VirtualListview
					 * @protected
					 */
					self._renderList = [];

					/**
					 * Element size cache
					 * @property {Array.<number>} _sizeMap
					 * @member ns.widget.core.VirtualListview
					 * @protected
					 */
					self._sizeMap = [];

					/**
					 * DocumentFragment buffer for DOM offscreen manipulations
					 * @property {DocumentFragment} _domBuffer
					 * @member ns.widget.core.VirtualListview
					 * @protected
					 */
					self._domBuffer = document.createDocumentFragment();

					/**
					 * Time for last cleared cache data
					 * @property {number} _lastRenderClearTimestamp
					 * @member ns.widget.core.VirtualListview
					 * @protected
					 */
					self._lastRenderClearTimestamp = 0;

					/**
					 * Time to lease for clearing render caches
					 * @property {number} _lastRenderClearTTL
					 * @member ns.widget.core.VirtualListview
					 * @protected
					 */
					self._lastRenderClearTTL = 10000;

					/**
					 * Average list item size cache
					 * @property {number} _avgListItemSize
					 * @member ns.widget.core.VirtualListview
					 * @protected
					 */
					self._avgListItemSize = -1;

					return self;
				},

				// Cached prototype for better minification
				prototype = new BaseWidget();

			/**
			 * Dictionary object containing commonly used widget classes
			 * @property {Object} classes
			 * @static
			 * @readonly
			 * @member ns.widget.core.VirtualListview
			 */
			VirtualListview.classes = {
				/**
				* Container for virtual list widget
				* @style ui-virtual-list-container
				* @member ns.widget.core.VirtualListview
				*/
				uiVirtualListContainer: "ui-virtual-list-container",
				/**
				* Prepare spacer - element which makes scrollBar proper size
				* @style ui-virtual-list-spacer
				* @member ns.widget.core.VirtualListview
				*/
				spacer: "ui-virtual-list-spacer"
			};

			/**
			 * Main render function
			 * @method render
			 * @member ns.widget.core.VirtualListview
			 * @param {ns.widget.core.VirtualListview} vList Reference to VirtualListview object
			 * @param {DOMHighResTimeStamp} timestamp The current time of the animation
			 * @private
			 * @static
			 */
			function render(vList, timestamp) {
				var ops = vList._renderList,
					i = 0,
					l = ops.length;

				for (; i < l; i += 4) {
					if (ops[i] === "propset") {
						ops[i + 1][ops[i + 2]] = ops[i + 3];
					}
				}

				if (l === 0 && timestamp - vList._lastRenderClearTimestamp > vList._lastRenderClearTTL) {
					vList._lastRenderClearTimestamp = timestamp;
					// clear
					vList._sizeMap.length = 0;
					vList._avgListItemSize = -1;
				}

				ops.length = 0;
			}

			/**
			 * Updates scroll information about position, direction and jump size.
			 * @method _updateScrollInfo
			 * @param {ns.widget.core.VirtualListview} self VirtualListview widget reference
			 * @param {Event} [event] scroll event object.
			 * @member ns.widget.core.VirtualListview
			 * @private
			 * @static
			 */
			function _updateScrollInfo(self, event) {
				var scrollInfo = self._scroll,
					scrollDir = SCROLL_NONE,
					scrollViewElement = self._ui.scrollview,
					scrollLastPositionX = scrollInfo.lastPositionX,
					scrollLastPositionY = scrollInfo.lastPositionY,
					scrollviewPosX = scrollViewElement.scrollLeft,
					scrollviewPosY = (event && event.detail && event.detail.scrollTop) ||
						scrollViewElement.scrollTop;

				self._refreshScrollbar();

				//Scrolling UP
				if (scrollviewPosY < scrollLastPositionY) {
					scrollDir = SCROLL_UP;
				}

				//Scrolling RIGHT
				if (scrollviewPosX < scrollLastPositionX) {
					scrollDir = SCROLL_RIGHT;
				}

				//Scrolling DOWN
				if (scrollviewPosY > scrollLastPositionY) {
					scrollDir = SCROLL_DOWN;
				}

				//Scrolling LEFT
				if (scrollviewPosX > scrollLastPositionX) {
					scrollDir = SCROLL_LEFT;
				}

				scrollInfo.lastJumpY = Math.abs(scrollviewPosY - scrollLastPositionY);
				scrollInfo.lastJumpX = Math.abs(scrollviewPosX - scrollLastPositionX);
				scrollInfo.lastPositionX = scrollviewPosX;
				scrollInfo.lastPositionY = scrollviewPosY;
				scrollInfo.dir = scrollDir;
				scrollInfo.clipHeight = scrollViewElement.clientHeight;
				scrollInfo.clipWidth = scrollViewElement.clientWidth;
			}

			/**
			 * Computes list element size according to scrolling orientation
			 * @method _computeElementSize
			 * @param {HTMLElement} element Element whose size should be computed
			 * @param {string} orientation Scrolling orientation
			 * @return {number} Size of element in pixels
			 * @member ns.widget.core.VirtualListview
			 * @private
			 * @static
			 */
			function _computeElementSize(element, orientation) {
				return parseInt((orientation === VERTICAL) ? element.clientHeight : element.clientWidth, 10);
			}

			/**
			 * Scrolls and manipulates DOM element to destination index. Element at destination
			 * index is the first visible element on the screen. Destination index can
			 * be different from Virtual List's current index, because current index points
			 * to first element in the buffer.
			 * @member ns.widget.core.VirtualListview
			 * @param {ns.widget.core.VirtualListview} self VirtualListview widget reference
			 * @param {number} toIndex Destination index.
			 * @method _orderElementsByIndex
			 * @private
			 * @static
			 */
			function _orderElementsByIndex(self, toIndex) {
				var element = self.element,
					options = self.options,
					scrollInfo = self._scroll,
					scrollClipSize,
					dataLength = options.dataLength,
					indexCorrection,
					bufferedElements,
					avgListItemSize = self._avgListItemSize,
					bufferSize = options.bufferSize,
					i,
					offset,
					index,
					isLastBuffer = false,
					children = filter.call(element.children, isListItem);

				//Get size of scroll clip depended on scroll direction
				scrollClipSize = options.orientation === VERTICAL ? scrollInfo.clipHeight :
					scrollInfo.clipWidth;

				//Compute average list item size
				if (avgListItemSize === -1) {
					self._avgListItemSize = avgListItemSize =
						_computeElementSize(element, options.orientation) / bufferSize;
				}

				//Compute average number of elements in each buffer (before and after clip)
				bufferedElements = Math.floor((bufferSize -
					Math.floor(scrollClipSize / avgListItemSize)) / 2);

				if (toIndex - bufferedElements <= 0) {
					index = 0;
				} else {
					index = toIndex - bufferedElements;
				}

				if (index + bufferSize >= dataLength) {
					index = dataLength - bufferSize;
					if (index < 0) {
						index = 0;
					}
					isLastBuffer = true;
				}
				indexCorrection = toIndex - index;

				self._loadData(index);
				blockEvent = true;
				offset = index * avgListItemSize;
				if (options.orientation === VERTICAL) {
					if (isLastBuffer) {
						offset = self._ui.spacer.clientHeight;
					}
					self._addToRenderList("propset", element.style, "margin-top", offset + "px");
				} else {
					if (isLastBuffer) {
						offset = self._ui.spacer.clientWidth;
					}
					self._addToRenderList("propset", element.style, "margin-left", offset + "px");
				}

				for (i = 0; i < indexCorrection; i += 1) {
					offset += _computeElementSize(children[i], options.orientation);
				}

				if (options.orientation === VERTICAL) {
					//MOBILE: self._ui.scrollview.element.scrollTop = offset;
					if (utilScrolling.isElement(self._ui.scrollview)) {
						utilScrolling.scrollTo(offset);
					} else {
						self._ui.scrollview.scrollTop = offset;
					}
				} else {
					//MOBILE: self._ui.scrollview.element.scrollLeft = offset;
					self._ui.scrollview.scrollLeft = offset;
				}
				blockEvent = false;
				self._currentIndex = index;
			}

			function getFirstElementChild(element) {
				var firstLiElement = element.firstElementChild;

				while (firstLiElement) {
					if (firstLiElement.tagName === "LI") {
						return firstLiElement;
					}
					firstLiElement = firstLiElement.nextElementSibling;
				}
				return null;
			}

			/**
			 * Loads element range into internal list item buffer. Elements are taken off one end of the
			 * children list,
			 *  placed on the other end (i.e.: first is taken and appended ath the end when scrolling
			 *  down)
			 *  and their contents get reloaded. Content reload is delegated to an external function
			 *  (_updateListItem).
			 * Depending on the direction, elements are
			 * @param {VirtualList} self
			 * @param {HTMLElement} element parent widget (the list view) of the (re)loaded element range
			 * @param {HTMLElement} domBuffer an off-document element for temporary storage of processed
			 * elements
			 * @param {Function} sizeGetter a function calculating element size
			 * @param {number} loadIndex element index to start loading at
			 * @param {number} indexDirection -1 when indices decrease with each loaded element, +1
			 * otherwise
			 * @param {number} elementsToLoad loaded element count
			 * @return {number} number of pixels the positions of the widgets in the list moved.
			 *  Repositioning the widget by this amount (along the scroll axis) is needed for the
			 *  remaining children
			 *  elements not to move, relative to the viewport.
			 * @private
			 */
			function _loadListElementRange(self, element, domBuffer, sizeGetter, loadIndex,
				indexDirection, elementsToLoad) {
				var temporaryElement,
					children = filter.call(element.children, isListItem),
					jump = 0,
					i;

				if (indexDirection > 0) {
					for (i = elementsToLoad; i > 0; i--) {
						temporaryElement = children.shift();

						// move to offscreen buffer
						domBuffer.appendChild(temporaryElement);

						//Updates list item using template
						self._updateListItem(temporaryElement, loadIndex);

						// move back to document
						element.appendChild(temporaryElement);

						jump += sizeGetter(temporaryElement, loadIndex++);
					}
					self._currentIndex += elementsToLoad;
				} else {
					for (i = elementsToLoad; i > 0; i--) {
						temporaryElement = children.shift();

						// move to offscreen buffer
						domBuffer.appendChild(temporaryElement);

						//Updates list item using template
						self._updateListItem(temporaryElement, loadIndex);

						element.insertBefore(temporaryElement, getFirstElementChild(element));
						jump -= sizeGetter(temporaryElement, loadIndex--);
					}
					self._currentIndex -= elementsToLoad;
				}
				return jump;
			}

			/**
			 * For a given element style, positioning direction, set the top/left position to
			 *  elementPosition* adjusted by |jump|. In case the resulting position is outside the bounds
			 *  defined by valid index ranges (0..dataLength-1), clamp the position to tha boundary.
			 * @param {VirtualList} self
			 * @param {number} dataLength max valid index
			 * @param {Object} elementStyle style of the element repositioned
			 * @param {number} scrollDir one of the BaseWidget.SCROLL_*
			 * @param {number} jump amount of pixels the repositioned element should be moved
			 * @param {number} elementPositionTop current elementTop
			 * @param {number} elementPositionLeft current elementLeft
			 * @private
			 */
			function _setElementStylePosition(self, dataLength, elementStyle, scrollDir, jump,
				elementPositionTop, elementPositionLeft) {
				var scrolledVertically = (scrollDir & 2) === 0,
					scrolledHorizontally = (scrollDir & 2) === 1,
					newPosition,
					currentIndex = self._currentIndex;

				if (scrolledVertically) {
					newPosition = elementPositionTop + jump;

					if (currentIndex <= 0) {
						self._currentIndex = currentIndex = 0;
						newPosition = 0;
					}

					if (currentIndex >= (dataLength - 1)) {
						newPosition = self._ui.spacer.clientHeight;
					}

					if (newPosition < 0) {
						newPosition = 0;
					}

					self._addToRenderList("propset", elementStyle, "margin-top", newPosition + "px");
				}

				if (scrolledHorizontally) {
					newPosition = elementPositionLeft + jump;

					if (currentIndex <= 0) {
						self._currentIndex = currentIndex = 0;
						newPosition = 0;
					}

					if (currentIndex >= (dataLength - 1)) {
						newPosition = self._ui.spacer.clientWidth;
					}

					if (newPosition < 0) {
						newPosition = 0;
					}

					self._addToRenderList("propset", elementStyle, "margin-left", newPosition + "px");
				}
			}

			/**
			 * Sums numeric properties of an array of objects
			 * @method sumProperty
			 * @member ns.widget.core.VirtualListview
			 * @param {Array.<Object>} elements An array of objects
			 * @param {string} property The property name
			 * @return {number}
			 * @private
			 * @static
			 */
			function sumProperty(elements, property) {
				var result = 0,
					i = elements.length;

				while (--i >= 0) {
					result += elements[i][property];
				}

				return result;
			}

			function isListItem(element) {
				return element.tagName === "LI";
			}

			/**
			 *
			 * @param {Array} sizeMap
			 * @param {boolean} horizontal
			 * @param {HTMLElement} element
			 * @param {number} index
			 * @return {*}
			 * @private
			 */
			function _getElementSize(sizeMap, horizontal, element, index) {
				if (sizeMap[index] === undefined) {
					sizeMap[index] = horizontal ? element.clientWidth : element.clientHeight;
				}
				return sizeMap[index];
			}

			/**
			 * Orders elements. Controls resultset visibility and does DOM manipulation. This
			 * method is used during normal scrolling.
			 * @method _orderElements
			 * @param {ns.widget.core.VirtualListview} self VirtualListview widget reference
			 * @member ns.widget.core.VirtualListview
			 * @private
			 * @static
			 */
			function _orderElements(self) {
				var element = self.element,
					scrollInfo = self._scroll,
					options = self.options,
					elementStyle = element.style,
					//Current index of data, first element of resultset
					currentIndex = self._currentIndex,
					//Number of items in resultset
					bufferSize = parseInt(options.bufferSize, 10),
					//Total number of items
					dataLength = options.dataLength,
					//Array of scroll direction
					scrollDir = scrollInfo.dir,
					scrollLastPositionY = scrollInfo.lastPositionY,
					scrollLastPositionX = scrollInfo.lastPositionX,
					elementPositionTop = parseInt(elementStyle.marginTop, 10) || 0,
					elementPositionLeft = parseInt(elementStyle.marginLeft, 10) || 0,
					elementsToLoad,
					bufferToLoad,
					elementsLeftToLoad = 0,
					domBuffer = self._domBuffer,
					avgListItemSize = self._avgListItemSize,
					resultsetSize = sumProperty(
						filter.call(element.children, isListItem),
						options.orientation === VERTICAL ? "clientHeight" : "clientWidth"
					),
					sizeMap = self._sizeMap,
					jump = 0,
					hiddenPart = 0,
					indexDirection,
					loadIndex;

				if (avgListItemSize === -1) {
					//Compute average list item size
					self._avgListItemSize = avgListItemSize =
						_computeElementSize(element, options.orientation) / bufferSize;
				}

				switch (scrollDir) {
					case SCROLL_NONE:
						break;
					case SCROLL_DOWN:
						hiddenPart = scrollLastPositionY - elementPositionTop;
						elementsLeftToLoad = dataLength - currentIndex - bufferSize;
						break;
					case SCROLL_UP:
						hiddenPart = (elementPositionTop + resultsetSize) -
							(scrollLastPositionY + scrollInfo.clipHeight);
						elementsLeftToLoad = currentIndex;
						break;
					case SCROLL_RIGHT:
						hiddenPart = scrollLastPositionX - elementPositionLeft;
						elementsLeftToLoad = dataLength - currentIndex - bufferSize;
						break;
					case SCROLL_LEFT:
						hiddenPart = (elementPositionLeft + resultsetSize) -
							(scrollLastPositionX - scrollInfo.clipWidth);
						elementsLeftToLoad = currentIndex;
						break;
				}

				//manipulate DOM only, when at least 1/2 of result set is hidden
				//NOTE: Result Set should be at least 2x bigger then clip size
				if (hiddenPart > 0 && (resultsetSize / hiddenPart) <= 2) {
					//Left half of hidden elements still hidden/cached
					elementsToLoad = ((hiddenPart / avgListItemSize) -
						// |0 = floor the value
						((bufferSize - scrollInfo.clipHeight / avgListItemSize) / 5) | 0) | 0;
					elementsToLoad = Math.min(elementsLeftToLoad, elementsToLoad);
					bufferToLoad = (elementsToLoad / bufferSize) | 0;
					elementsToLoad = elementsToLoad % bufferSize;

					if (scrollDir === SCROLL_DOWN || scrollDir === SCROLL_RIGHT) {
						indexDirection = 1;
					} else {
						indexDirection = -1;
					}

					// Scrolling more then buffer
					if (bufferToLoad > 0) {
						// Load data to buffer according to jumped index
						self._loadData(currentIndex + indexDirection * bufferToLoad * bufferSize);

						// Refresh current index after buffer jump
						currentIndex = self._currentIndex;

						jump += indexDirection * bufferToLoad * bufferSize * avgListItemSize;
					}

					loadIndex = currentIndex + (indexDirection > 0 ? bufferSize : -1);
					// Note: currentIndex is not valid after this call.
					jump += _loadListElementRange(self, element, domBuffer,
						_getElementSize.bind(null, sizeMap, scrollDir & 2),
						loadIndex, indexDirection, elementsToLoad);

					_setElementStylePosition(self, dataLength, elementStyle, scrollDir, jump,
						elementPositionTop, elementPositionLeft);
				}
			}

			/**
			 * Check if scrolling position is changed and updates list if it needed.
			 * @method _updateList
			 * @param {ns.widget.core.VirtualListview} self VirtualListview widget reference
			 * @param {Event} event scroll event triggering this update
			 * @member ns.widget.core.VirtualListview
			 * @private
			 * @static
			 */
			function _updateList(self, event) {
				var _scroll = self._scroll;

				_updateScrollInfo(self, event);
				if (_scroll.lastJumpY > 0 || _scroll.lastJumpX > 0 && !blockEvent) {
					_orderElements(self);
					utilEvent.trigger(self.element, "vlistupdate");
				}
			}

			/**
			 * Updates list item using user defined listItemUpdater function.
			 * @method _updateListItem
			 * @param {HTMLElement} element List element to update
			 * @param {number} index Data row index
			 * @member ns.widget.core.VirtualListview
			 * @protected
			 */
			prototype._updateListItem = function (element, index) {
				this.options.listItemUpdater(element, index);
			};

			prototype._setupScrollview = function (element, orientation) {
				var scrollview = selectors.getClosestByClass(element, "ui-scroller") || element.parentElement,
					scrollviewStyle;
				//Get scrollview instance

				scrollviewStyle = scrollview.style;

				if (orientation === HORIZONTAL) {
					scrollviewStyle.overflowX = "scroll";
					scrollviewStyle.overflowY = "hidden";
				} else {
					scrollviewStyle.overflowX = "hidden";
					scrollviewStyle.overflowY = "scroll";
				}

				return scrollview;
			};

			prototype._getScrollView = function (options, element) {
				var scrollview = null;

				if (options.scrollElement) {
					if (typeof options.scrollElement === "string") {
						scrollview = selectors.getClosestBySelector(element, "." + options.scrollElement);
					} else {
						scrollview = options.scrollElement;
					}
				}

				if (!scrollview) {
					scrollview = this._setupScrollview(element, options.orientation);
				}

				return scrollview;
			};

			/**
			 * Build widget structure
			 * @method _build
			 * @param {HTMLElement} element Widget's element
			 * @return {HTMLElement} Element on which built is widget
			 * @member ns.widget.core.VirtualListview
			 * @protected
			 */
			prototype._build = function (element) {
				var self = this,
					ui = self._ui,
					classes = VirtualListview.classes,
					options = self.options,
					scrollview,
					spacer = document.createElement("div"),
					spacerStyle,
					orientation;

				//Prepare element
				element.style.position = "relative";
				element.classList.add(classes.uiVirtualListContainer);

				//Set orientation, default vertical scrolling is allowed
				orientation = options.orientation.toLowerCase() === HORIZONTAL ? HORIZONTAL : VERTICAL;

				scrollview = self._getScrollView(options, element);

				// Prepare spacer (element which makes scrollBar proper size)
				spacer.classList.add(classes.spacer);

				spacerStyle = spacer.style;
				spacerStyle.display = "block";
				spacerStyle.position = "static";

				if (orientation === HORIZONTAL) {
					spacerStyle.float = "left";
				}

				scrollview.appendChild(spacer);

				// Assign variables to members
				ui.spacer = spacer;
				ui.scrollview = scrollview;
				options.orientation = orientation;

				return element;
			};

			/**
			 * Initialize widget on an element.
			 * @method _init
			 * @param {HTMLElement} element Widget's element
			 * @member ns.widget.core.VirtualListview
			 * @protected
			 */
			prototype._init = function (element) {
				var self = this,
					ui = self._ui,
					options = self.options,
					scrollview = ui.scrollview || self._getScrollView(options, element),
					elementRect,
					scrollviewRect;

				if (options.dataLength < options.bufferSize) {
					options.bufferSize = options.dataLength;
				}

				if (options.bufferSize < 1) {
					options.bufferSize = 1;
				}

				elementRect = element.getBoundingClientRect();
				scrollviewRect = scrollview.getBoundingClientRect();
				// Assign variables to members
				self._initTopPosition = elementRect.top - scrollviewRect.top;
				self._initLeftPosition = elementRect.left - scrollviewRect.left;

				scrollview.classList.add("ui-has-virtual-list");

				ui.spacer = ui.spacer || scrollview.querySelector("." + VirtualListview.classes.spacer);
				ui.scrollview = scrollview;

				options.orientation = options.orientation.toLowerCase() === HORIZONTAL ? HORIZONTAL : VERTICAL;

				if (options.optimizedScrolling) {
					utilScrolling.enable(scrollview, options.orientation);
					utilScrolling.enableScrollBar();
				}

				// disable tau rotaryScroller the widget has own support for rotary event
				ns.util.rotaryScrolling && ns.util.rotaryScrolling.lock();
			};

			/**
			 * Builds Virtual List structure
			 * @method _buildList
			 * @member ns.widget.core.VirtualListview
			 * @protected
			 */
			prototype._buildList = function () {
				var self = this,
					listItem,
					list = self.element,
					options = self.options,
					childElementType = (list.tagName === "UL" ||
						list.tagName === "OL" ||
						list.tagName === "TAU-VIRTUALLISTVIEW") ? "li" : "div",
					numberOfItems = options.bufferSize,
					documentFragment = self._domBuffer,
					orientation = options.orientation,
					i;

				for (i = 0; i < numberOfItems; ++i) {
					listItem = document.createElement(childElementType);

					if (orientation === HORIZONTAL) {
						// NOTE: after rebuild this condition check possible duplication from _init method
						listItem.style.float = "left";
					}

					self._updateListItem(listItem, i);
					documentFragment.appendChild(listItem);
				}

				list.appendChild(documentFragment);
				this._refresh();
			};

			/**
			 * Refresh list
			 * @method _refresh
			 * @member ns.widget.core.VirtualListview
			 * @protected
			 */
			prototype._refresh = function () {
				//Set default value of variable create
				this._refreshScrollbar();
			};

			/**
			 * Loads data from specified index to result set.
			 * @method _loadData
			 * @param {number} index Index of first row
			 * @member ns.widget.core.VirtualListview
			 * @protected
			 */
			prototype._loadData = function (index) {
				var self = this,
					child = self.element.firstElementChild;

				if (self._currentIndex !== index) {
					self._currentIndex = index;
					do {
						self._updateListItem(child, index);
						++index;
						child = child.nextElementSibling;
					} while (child);
				}
			};

			/**
			 * Sets proper scrollbar size: height (vertical), width (horizontal)
			 * @method _refreshScrollbar
			 * @member ns.widget.core.VirtualListview
			 * @protected
			 */
			prototype._refreshScrollbar = function () {
				var self = this,
					currentIndex = self._currentIndex,
					element = self.element,
					options = self.options,
					ui = self._ui,
					spacerStyle = ui.spacer.style,
					bufferSizePx,
					listSize;

				if (options.orientation === VERTICAL) {
					//Note: element.clientHeight is variable
					bufferSizePx = parseFloat(element.clientHeight) || 0;
					listSize = bufferSizePx / options.bufferSize * (options.dataLength - currentIndex);

					if (options.optimizedScrolling) {
						utilScrolling.setMaxScroll(listSize);
					} else {
						self._addToRenderList("propset", spacerStyle, "height", (listSize - bufferSizePx) +
							"px");
					}
				} else {
					//Note: element.clientWidth is variable
					bufferSizePx = parseFloat(element.clientWidth) || 0;
					listSize = bufferSizePx / options.bufferSize * options.dataLength;

					if (options.optimizedScrolling) {
						utilScrolling.setMaxScroll(listSize);
					} else {
						self._addToRenderList("propset", spacerStyle, "width", (bufferSizePx /
							options.bufferSize * (options.dataLength - 1) - 4 / 3 * bufferSizePx) + "px");
					}

				}
			};

			/**
			 * Binds VirtualListview events
			 * @method _bindEvents
			 * @member ns.widget.core.VirtualListview
			 * @protected
			 */
			prototype._addToRenderList = function () {
				var self = this,
					renderList = self._renderList;

				renderList.push.apply(renderList, arguments);
				requestFrame(self._render);

				//MOBILE: parent_bindEvents.call(self, self.element);
			};

			/**
			 * Binds VirtualListview events
			 * @method _bindEvents
			 * @member ns.widget.core.VirtualListview
			 * @protected
			 */
			prototype._bindEvents = function () {
				var scrollEventBound = _updateList.bind(null, this),
					//MOBILE: scrollviewClip = self._ui.scrollview && self._ui.scrollview.element;
					scrollviewClip = this._ui.scrollview;

				if (scrollviewClip) {
					scrollviewClip.addEventListener("scroll", scrollEventBound, false);
					this._scrollEventBound = scrollEventBound;
				}

				//MOBILE: parent_bindEvents.call(self, self.element);
			};

			/**
			 * Cleans widget's resources
			 * @method _destroy
			 * @member ns.widget.core.VirtualListview
			 * @protected
			 */
			prototype._destroy = function () {
				var self = this,
					scrollView = self._ui.scrollview,
					uiSpacer = self._ui.spacer,
					element = self.element,
					elementStyle = element.style;

				// Restore start position
				elementStyle.position = "static";
				if (self.options.orientation === VERTICAL) {
					elementStyle.top = "auto";
				} else {
					elementStyle.left = "auto";
				}

				if (scrollView) {
					utilScrolling.disable(scrollView);
					scrollView.removeEventListener("scroll", self._scrollEventBound, false);
				}

				//Remove spacer element
				if (uiSpacer.parentNode) {
					uiSpacer.parentNode.removeChild(uiSpacer);
				}

				//Remove li elements.
				while (element.firstElementChild) {
					element.removeChild(element.firstElementChild);
				}
			};

			/**
			 * This method scrolls list to defined position in pixels.
			 * @method scrollTo
			 * @param {number} position Scroll position expressed in pixels.
			 * @member ns.widget.core.VirtualListview
			 */
			prototype.scrollTo = function (position) {
				var self = this;

				if (utilScrolling.isElement(self._ui.scrollview)) {
					utilScrolling.scrollTo(position);
				} else {
					self._ui.scrollview.scrollTop = position;
				}
			};

			/**
			 * This method scrolls list to defined index.
			 * @method scrollToIndex
			 * @param {number} index Scroll Destination index.
			 * @member ns.widget.core.VirtualListview
			 */
			prototype.scrollToIndex = function (index) {
				if (index < 0) {
					index = 0;
				}
				if (index >= this.options.dataLength) {
					index = this.options.dataLength - 1;
				}
				_updateScrollInfo(this);
				_orderElementsByIndex(this, index);
			};

			/**
			 * This method builds widget and trigger event "draw".
			 * @method draw
			 * @member ns.widget.core.VirtualListview
			 */
			prototype.draw = function () {
				this._buildList();
				this.trigger("draw");
			};

			/**
			 * This method sets list item updater function.
			 * To learn how to create list item updater function please
			 * visit Virtual List User Guide.
			 * @method setListItemUpdater
			 * @param {Object} updateFunction Function reference.
			 * @member ns.widget.core.VirtualListview
			 */
			prototype.setListItemUpdater = function (updateFunction) {
				this.options.listItemUpdater = updateFunction;
			};

			// Assign prototype
			VirtualListview.prototype = prototype;
			ns.widget.core.VirtualListview = VirtualListview;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return VirtualListview;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
