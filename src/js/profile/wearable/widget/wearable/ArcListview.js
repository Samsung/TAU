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
 *
 */
/*global window, define, ns, Math*/
/**
 * #ArcListview Widget
 *
 * @class ns.widget.wearable.ArcListview
 * @since 3.0
 * @extends ns.widget.wearable.Listview
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/event",
			"../../../../core/util/array",
			"../../../../core/util/easing",
			"../../../../core/util/selectors",
			"../../../../core/widget/core/Listview",
			"../../../../core/widget/core/Page",
			"../../../../core/widget/core/scroller/effect/Bouncing",
			"../../../../core/widget/core/Popup",
			// fetch namespace
			"../wearable"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var nsWidget = ns.widget,
				Listview = nsWidget.core.Listview,
				Page = nsWidget.core.Page,
				Popup = nsWidget.core.Popup,
				eventUtils = ns.event,
				slice = [].slice,
				// constants
				ELLIPSIS_A = 333,
				ELLIPSIS_B = 180,
				SCREEN_HEIGHT = 360,
				SCROLL_DURATION = 400,
				MAX_SCROLL_DURATION = 1500,
				MOMENTUM_VALUE = 15,
				MOMENTUM_MAX_VALUE = 400,
				// in ms
				TOUCH_MOVE_TIME_THRESHOLD = 140,
				// in px
				TOUCH_MOVE_Y_THRESHOLD = 10,
				// time of animation in skip animation mode, this is one animation frame and animation is
				// invisible
				ONE_FRAME_TIME = 40,
				// half of screen height - center element height (112)
				BOTTOM_MARGIN = (window.innerHeight - 112) / 2,
				/**
				 * Alias for class {@link ns.engine}
				 * @property {Object} engine
				 * @memberof ns.widget.wearable.ArcListview
				 * @protected
				 * @static
				 */
				engine = ns.engine,
				/**
				 * Alias for class {@link ns.util}
				 * @property {Object} util
				 * @memberof ns.widget.wearable.ArcListview
				 * @protected
				 * @static
				 */
				util = ns.util,
				/**
				 * Alias for class {@link ns.util.selectors}
				 * @property {Object} selectorsUtil
				 * @memberof ns.widget.wearable.ArcListview
				 * @protected
				 * @static
				 */
				selectorsUtil = util.selectors,
				/**
				 * Alias for class {@link ns.util.easing.easeOutSine}
				 * @property {Object} timingFunction
				 * @memberof ns.widget.wearable.ArcListview
				 * @protected
				 * @static
				 */
				timingFunction = util.easing.easeOutSine,
				/**
				 * Alias for method {@link Math.round}
				 * @property {Function} round
				 * @memberof ns.widget.wearable.ArcListview
				 * @protected
				 * @static
				 */
				round = Math.round,
				/**
				 * Alias for method {@link Math.min}
				 * @property {Function} min
				 * @memberof ns.widget.wearable.ArcListview
				 * @protected
				 * @static
				 */
				min = Math.min,
				/**
				 * Alias for method {@link Math.max}
				 * @property {Function} max
				 * @memberof ns.widget.wearable.ArcListview
				 * @protected
				 * @static
				 */
				max = Math.max,
				/**
				 * Alias for method {@link Math.sqrt}
				 * @property {Function} sqrt
				 * @memberof ns.widget.wearable.ArcListview
				 * @protected
				 * @static
				 */
				sqrt = Math.sqrt,
				/**
				 * Alias for method {@link Math.abs}
				 * @property {Function} sqrt
				 * @memberof ns.widget.wearable.ArcListview
				 * @protected
				 * @static
				 */
				abs = Math.abs,
				/**
				 * Alias for method {@link ns.util.array}
				 * @property {Object} arrayUtil
				 * @memberof ns.widget.wearable.ArcListview
				 * @protected
				 * @static
				 */
				arrayUtil = ns.util.array,
				/**
				 * Alias for class ArcListview
				 * @method ArcListview
				 * @memberof ns.widget.wearable.ArcListview
				 * @protected
				 * @static
				 */
				ArcListview = function () {
					var self = this;

					/**
					 * Object with default options
					 * @property {Object} options
					 * @property {number} [options.ellipsisA] a parameter of ellipsis equation
					 * @property {number} [options.ellipsisB] b parameter of ellipsis equation
					 * @property {number} [options.selectedIndex=0] index current selected item begins from 0
					 * @property {number} [options.bouncingTimeout=1000] time when bound effect will be hidden
					 * @memberof ns.widget.wearable.ArcListview
					 */
					self.options = {
						// selected index
						selectedIndex: 0,
						ellipsisA: ELLIPSIS_A,
						ellipsisB: ELLIPSIS_B,
						bouncingTimeout: 1000,
						visibleItems: 3,
						listItemUpdater: null,
						dataLength: 0
					};
					// items table on start is empty
					self._items = [];
					self._lastId = -1;
					// the end of scroll animation
					self._scrollAnimationEnd = true;
					// carousel of five elements
					self._carousel = {
						items: []
					};
					self._initializeState();

					self._renderCallback = self._render.bind(this);
					self._halfItemsCount = null;
					self._rendering = false;
					self._lastRenderRequest = 0;
					self._carouselIndex = 0;
					self._disabledByPopup = false;
					self._previousIndex = null;
					/**
					 * Cache for widget UI HTMLElements
					 * @property {Object} _ui
					 * @property {HTMLElement} _ui.selection element for indication of current selected item
					 * @memberof ns.widget.wearable.ArcListview
					 * @protected
					 */
					self._ui = {
						selection: null,
						scroller: null,
						arcListviewCarousel: null,
						arcListviewSelection: null,
						// ensures correct behaviour of radio buttons once
						// item goes out of the screen (is removed from carousel)
						dummyElement: null
					};
				},

				WIDGET_CLASS = "ui-arc-listview",
				/**
				 * CSS Classes using in widget
				 */
				classes = {
					WIDGET: WIDGET_CLASS,
					PREFIX: WIDGET_CLASS + "-",
					SELECTION: WIDGET_CLASS + "-selection",
					SELECTION_SHOW: WIDGET_CLASS + "-selection-show",
					CAROUSEL: WIDGET_CLASS + "-carousel",
					CAROUSEL_ITEM: WIDGET_CLASS + "-carousel-item",
					CAROUSEL_ITEM_SEPARATOR: WIDGET_CLASS + "-carousel-item-separator",
					GROUP_INDEX: "ui-li-group-index",
					DIVIDER: "ui-listview-divider",
					FORCE_RELATIVE: "ui-force-relative-li-children",
					LISTVIEW: "ui-listview",
					SELECTED: "ui-arc-listview-selected",
					HIDDEN_CAROUSEL_ITEM: WIDGET_CLASS + "-carousel-item-hidden",
					DUMMY_ELEMENT: WIDGET_CLASS + "-dummy-element"
				},
				events = {
					CHANGE: "change"
				},
				selectors = {
					PAGE: "." + Page.classes.uiPage,
					POPUP: ".ui-popup",
					SCROLLER: ".ui-scroller",
					ITEMS: "." + WIDGET_CLASS + " > li",
					TEXT_INPUT: "input[type='text']" +
								", input[type='number']" +
								", input[type='password']" +
								", input[type='email']" +
								", input[type='url']" +
								", input[type='tel']" +
								", input[type='search']"
				},

				prototype = new Listview(),

				didScroll = false,
				averageVelocity = 0,
				sumTime = 0,
				sumDistance = 0,
				momentum = 0,
				startTouchTime = 0,
				lastTouchTime = 0,
				factorsX = [],

				lastTouchY = 0,
				deltaTouchY = 0,
				deltaSumTouchY = 0,

				// virtual list parameters
				NUMBER_ITEMS_TO_ADD = 20,
				LOAD_THRESHOLD = 10;

			/**
			 * Create item object
			 * @return {Object}
			 */
			ArcListview.createItem = function () {
				return {
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
				};
			};

			function copyRect(rect) {
				return {
					bottom: rect.bottom,
					height: rect.height,
					left: rect.left,
					right: rect.right,
					top: rect.top,
					width: rect.width
				};
			}

			/**
			 * Pre calculation of factors for Y axis
			 * @param {number} a factor X axis for ellipsis (see VI guide)
			 * @param {number} b factor Y axis for ellipsis (see VI guide)
			 * @memberof ns.widget.wearable.ArcListview
			 * @protected
			 */
			ArcListview.calcFactors = function (a, b) {
				var i;

				for (i = 0; i <= b; i++) {
					factorsX[i] = sqrt(a * a * (1 - i * i / b / b)) / a;
				}

				return factorsX;
			};

			/**
			 * Initialize state
			 * @protected
			 */
			prototype._initializeState = function () {
				/**
				 * Object with state of scroll animation
				 * @property {Object} _state
				 * @property {number} _state.startTime time of scroll animation start
				 * @property {number} _state.duration duration time of scroll animation
				 * @property {number} _state.progress current progress of scroll animation
				 * @property {Object} _state.scroll scroll state and animation objectives
				 * @property {number} _state.currentIndex current index of selected item
				 * @property {number} _state.toIndex item index as target for scroll end
				 * @property {Array} _state.items array of list items
				 * @property {Array} _state.separators array of items treated as separators
				 * @memberof ns.widget.wearable.ArcListview
				 * @protected
				 */
				this._state = {
					startTime: Date.now(),
					duration: 0,
					progress: 0,
					scroll: {
						current: 10,
						from: null,
						to: null
					},
					currentIndex: 0,
					toIndex: 0,
					items: [],
					separators: []
				};
			};

			function prepareParentStyle(parentElement, parentRect) {
				var parentStyle = parentElement.style;

				parentStyle.height = parentRect.height + "px";
				parentStyle.position = "relative";
			}

			/**
			 * Set state for animation
			 * @protected
			 */
			prototype._setAnimatedItems = function () {
				var self = this,
					items = self._items,
					itemElement = items[0],
					item = null,
					rect = null,
					parentRect = null,
					diffY = null,
					scroller = self._ui.scroller,
					state = self._state,
					parentElement,
					parentClassList;

				if (itemElement) {
					parentElement = self.element;
					parentClassList = parentElement.classList;

					// set parent size
					parentRect = parentElement.getBoundingClientRect();
					prepareParentStyle(parentElement, parentRect);

					parentClassList.add(classes.FORCE_RELATIVE);

					arrayUtil.forEach(items, function (itemElement, i) {
						// add items to state
						if (i >= 0 && !state.items[i] && itemElement !== undefined) {
							rect = copyRect(itemElement.getBoundingClientRect());
							item = ArcListview.createItem();
							if (itemElement.classList.contains(classes.GROUP_INDEX) || itemElement.classList.contains(classes.DIVIDER)) {
								state.separators.push({
									itemElement: item,
									insertBefore: i - state.separators.length
								});
							} else {
								state.items.push(item);
								item.id = ++self._lastId;
							}

							item.element = itemElement;
							item.y = round(rect.top + rect.height / 2 + scroller.scrollTop);
							item.height = rect.height;
							item.rect = rect;
							if (diffY === null) {
								diffY = rect.top - parentRect.top;
							}
						}
					});

					parentClassList.remove(classes.FORCE_RELATIVE);

					arrayUtil.forEach(items, function (item) {
						if (item.parentElement === parentElement) {
							parentElement.removeChild(item);
						}
					});
				}
			};

			/**
			 * Update scale
			 * @param {number} currentScroll
			 * @protected
			 */
			prototype._updateScale = function (currentScroll) {
				var self = this,
					state = self._state,
					items = state.items,
					toScale = 0,
					y;

				arrayUtil.forEach(items, function (item) {
					if (item !== null) {
						y = item.y;
						if (item.id < state.currentIndex) {
							y -= item.height / 4;
						}
						if (item.id > state.currentIndex) {
							y += item.height / 4;
						}
						toScale = self._getScaleByY(y - SCREEN_HEIGHT / 2 - currentScroll);
						if (item.current.scale !== toScale) {
							item.from = item.from || {};
							item.from.scale = item.current.scale;

							item.to = item.to || {};
							item.to.scale = toScale;
						} else {
							item.to = null;
						}
					}
				});
			};

			function calcItem(item) {
				if (item !== null && item.to !== null) {
					item.current.scale = item.to.scale;
					item.repaint = true;
				}
			}

			/**
			 * Returns separator object if exists before item at given index
			 * @param {number} index index of element
			 * @protected
			 */
			prototype._getSeparatorBeforeListItem = function (index) {
				var self = this,
					state = self._state,
					separators = state.separators,
					i = 0,
					length = separators.length;

				for (; i < length; i++) {
					if (separators[i].insertBefore === index) {
						return separators[i];
					}
					if (separators[i].insertBefore > index) {
						return null;
					}
				}

				return null;
			}

			/**
			 * Calculate state
			 * @protected
			 */
			prototype._calc = function () {
				var self = this,
					state = self._state,
					currentTime = Date.now(),
					startTime = state.startTime,
					deltaTime = currentTime - startTime,
					scroll = state.scroll,
					pageWidget = null;

				if (deltaTime >= state.duration) {
					self._scrollAnimationEnd = true;
					deltaTime = state.duration;
				}

				state.progress = (state.duration !== 0) ? deltaTime / state.duration : 1;

				// scroll
				if (scroll.to !== null) {
					scroll.current = timingFunction(
						state.progress,
						scroll.from,
						scroll.to - scroll.from,
						1
					);
					if (self._scrollAnimationEnd) {
						// _scrollAnimationEnd can be set by TouchStart event to stop scroll.
						// Show selection if scroll finishes.
						if (deltaTime >= state.duration) {
							self.trigger(events.CHANGE, {
								"selected": state.currentIndex
							});
							eventUtils.trigger(state.items[state.currentIndex].element, "selected");
						}
						state.toIndex = state.currentIndex;

						// set last scroll position when current page is hidden
						pageWidget = ns.engine.getBinding(self._ui.page, "Page");
						pageWidget.setLastScrollPosition(-1 * scroll.current || 0);

						scroll.to = null;
						scroll.from = null;
					}
				}
				self._updateScale(-1 * scroll.current);

				// calculate items
				arrayUtil.forEach(state.items, calcItem);
			};

			prototype._setBouncingTimeout = function () {
				var self = this;

				// hide after timeout
				setTimeout(function () {
					self._bouncingEffect.dragEnd();
				}, self.options.bouncingTimeout);
			};

			/**
			 * Draw one item
			 * @param {Object} item
			 * @param {number} index
			 * @protected
			 */
			prototype._drawItem = function (item, index) {
				var self = this,
					carousel = self._carousel,
					middleItemIndex = self._halfItemsCount + 1,
					carouselItem,
					carouselElement,
					itemElement,
					carouselSeparator,
					upperSeparator,
					lowerSeparator,
					separatorElement,
					nextCarouselItem,
					nextCarouselSeparatorElement,
					itemStyle,
					currentIndex = self._carouselIndex;

				if (item !== null) {
					itemElement = item.element;
					upperSeparator = self._getSeparatorBeforeListItem(index);
					lowerSeparator = self._getSeparatorBeforeListItem(index + 1);

					if (item.repaint) {
						itemStyle = itemElement.style;
						if (index - currentIndex < middleItemIndex &&
							index - currentIndex > -middleItemIndex) {
							carouselItem = carousel.items[index - currentIndex + middleItemIndex - 1];
							if (carouselItem) {
								carouselElement = carouselItem.carouselElement;
								carouselSeparator = carouselItem.carouselSeparator;
								if (itemElement.parentElement !== carouselElement) {
									carouselElement.appendChild(itemElement);
									self._wrapTextContent(itemElement);
								}

								if (upperSeparator) {
									separatorElement = upperSeparator.itemElement.element;
									while (carouselSeparator.firstChild) {
										carouselSeparator.removeChild(carouselSeparator.firstChild);
									}
									carouselSeparator.appendChild(separatorElement);
								} else if (carouselSeparator.firstChild) {
									carouselSeparator.removeChild(carouselSeparator.firstChild);
								}

								nextCarouselItem = carousel.items[index - currentIndex + middleItemIndex];
								if (nextCarouselItem) {
									nextCarouselSeparatorElement = nextCarouselItem.carouselSeparator;
									if (lowerSeparator) {
										while (nextCarouselSeparatorElement.firstChild) {
											nextCarouselSeparatorElement.removeChild(nextCarouselSeparatorElement.firstChild);
										}
										nextCarouselSeparatorElement.appendChild(lowerSeparator.itemElement.element);
										self._wrapTextContent(itemElement);
									} else if (nextCarouselSeparatorElement.firstChild) {
										nextCarouselSeparatorElement.removeChild(nextCarouselSeparatorElement.firstChild);
									}
								}
							}
						}

						itemStyle.transform = "translateY(-50%) scale3d(" + item.current.scale + "," + item.current.scale + "," + item.current.scale + ")";
						itemStyle.opacity = item.current.scale * 1.15;
						item.repaint = false;
					} else {
						if (itemElement.parentNode !== null && item.current.scale < 0.01) {
							self._ui.dummyElement.appendChild(itemElement);
						}
					}
				}
			};

			/**
			 * Draw widget
			 * @method _draw
			 * @protected
			 * @memberof ns.widget.wearable.ArcListview
			 */
			prototype._draw = function () {
				var self = this,
					state = self._state,
					items = state.items,
					length = items.length,
					i;

				// change carousel item per 2 items
				if (Math.abs(self._carouselIndex - state.currentIndex) >= 2) {
					self._carouselIndex = state.currentIndex;
				}

				// draw items
				for (i = 0; i < length; i++) {
					self._drawItem(items[i], i);
				}
				self._carouselUpdate(state.currentIndex);

				// scroller update
				self._ui.scroller.scrollTop = -1 * state.scroll.current;
			};

			/**
			 * Update positions of items
			 * @param {number} currentIndex
			 * @protected
			 */
			prototype._carouselUpdate = function (currentIndex) {
				var self = this,
					carousel = self._carousel,
					state = self._state,
					halfItemsCount = self._halfItemsCount,
					item,
					len,
					i,
					index,
					separatorTop,
					carouselItemElement,
					carouselItemUpperSeparatorElement,
					top;

				if (self._previousIndex !== currentIndex) {
					ns.event.trigger(self.element, "currentindexchange", {"index": currentIndex});
					self._previousIndex = currentIndex;
				}

				// change carousel item per 2 items
				if (Math.abs(self._carouselIndex - currentIndex) >= 2) {
					self._carouselIndex = currentIndex;
				}

				for (i = -halfItemsCount, len = halfItemsCount; i <= len; i++) {
					index = self._carouselIndex + i;
					item = state.items[index];
					carouselItemElement = carousel.items[i + halfItemsCount].carouselElement;
					carouselItemUpperSeparatorElement = carousel.items[i + halfItemsCount].carouselSeparator;

					if (item !== undefined) {
						top = (state.scroll.current + item.y - item.height / 2);
						separatorTop = (carouselItemUpperSeparatorElement.childElementCount) ? top - (item.height + carouselItemUpperSeparatorElement.offsetHeight) / 2 : 0;
					} else {
						top = 0;
						separatorTop = 0;
					}

					carouselItemElement.style.transform = "translateY(" + top + "px)";
					carouselItemUpperSeparatorElement.style.transform = "translateY(" + separatorTop + "px)";

					// hide unused carousel items
					if (carouselItemElement.firstElementChild === null) {
						carouselItemElement.classList.add(classes.HIDDEN_CAROUSEL_ITEM);
					} else {
						carouselItemElement.classList.remove(classes.HIDDEN_CAROUSEL_ITEM);
					}
				}
			};

			/**
			 * Render widget
			 * @method _render
			 * @protected
			 * @memberof ns.widget.wearable.ArcListview
			 */
			prototype._render = function () {
				var self = this,
					state = self._state;

				self._calc();
				self._draw();

				if (!self._scrollAnimationEnd && self._items.length > 0) {
					state.currentIndex = self._findItemIndexByY(
						-1 * (state.scroll.current - SCREEN_HEIGHT / 2 + 1));
					util.requestAnimationFrame(self._renderCallback);
				} else {
					self._rendering = false;
				}
			};

			/**
			 * Methods return index of item after divider
			 * @method findItemIndexByDivider
			 * @param {HTMLElement} dividerElement
			 * @memberof ns.widget.wearable.ArcListview
			 */
			prototype.findItemIndexByDivider = function (dividerElement) {
				var result = this._state.separators.filter(function (item) {
					return item.itemElement.element === dividerElement;
				});

				return result.length ? result[0].insertBefore : -1;
			}

			prototype._requestRender = function () {
				var self = this;

				if (!self._rendering) {
					self._rendering = true;
					util.requestAnimationFrame(self._renderCallback);
				}
				self._lastRenderRequest = Date.now();
			};

			/**
			 * Find closer item for given "y" position
			 * @method _findItemIndexByY
			 * @param {number} y
			 * @return {number}
			 * @protected
			 * @memberof ns.widget.wearable.ArcListview
			 */
			prototype._findItemIndexByY = function (y) {
				var items = this._state.items,
					len = items.length,
					minY,
					maxY,
					prev,
					current,
					next,
					loop = true,
					diffY,
					tempIndex;

				if (len > 0) {
					minY = items[0].y;
					maxY = items[len - 1].y;
				} else {
					// widget has no items
					return -1;
				}

				diffY = maxY - minY;
				tempIndex = diffY !== 0 ? round((y - minY) / (diffY) * len) : 0;
				tempIndex = min(len - 1, max(0, tempIndex));

				while (loop) {
					prev = abs((items[tempIndex - 1]) ? y - items[tempIndex - 1].y : Infinity);
					current = abs(y - items[tempIndex].y);
					next = abs((items[tempIndex + 1]) ? y - items[tempIndex + 1].y : -Infinity);

					if (prev < current) {
						tempIndex--;
					} else if (next < current) {
						tempIndex++;
					} else {
						loop = false;
					}
				}

				return tempIndex;
			};

			/**
			 * Refresh method
			 * @method _refresh
			 * @memberof ns.widget.wearable.ArcListview
			 * @protected
			 */
			prototype._refresh = function () {
				var self = this,
					state = self._state,
					currentTime = Date.now(),
					deltaTime = currentTime - lastTouchTime,
					items = state.items,
					currentItem,
					toY,
					scroll = state.scroll;

				sumTime += -1 * deltaTime;
				sumDistance += deltaTouchY;
				averageVelocity = sumDistance / sumTime;
				self._halfItemsCount = Math.ceil((parseInt(self.options.visibleItems, 10) + 2) / 2);

				if (items.length > 0 && momentum !== 0) {
					momentum *= averageVelocity;
					// momentum value has to be limited to defined max value
					momentum = max(min(momentum, MOMENTUM_MAX_VALUE), -MOMENTUM_MAX_VALUE);

					toY = -1 * (scroll.current - momentum - SCREEN_HEIGHT / 2 + 1);

					// snap to closer item
					currentItem = self._findItemIndexByY(toY);
					toY = items[currentItem].y;

					state.currentIndex = currentItem;
					scroll.from = scroll.current;
					scroll.to = -1 * (toY - SCREEN_HEIGHT / 2 + 1);

					// if average velocity is rising then duration should be longer,
					// but no longer then MAX_SCROLL_DURATION
					// the averageVelocity is strongly dependent to device,
					// eg. for emulator is between 8-30 so this value should be
					// divided by 4 for more convenient use
					state.duration = min(SCROLL_DURATION * max(Math.abs(averageVelocity) / 4, 1), MAX_SCROLL_DURATION);
				}

				if (self._scrollAnimationEnd) {
					state.startTime = Date.now();
					self._scrollAnimationEnd = false;
					self._requestRender();
				}
			};

			/**
			 * Simulate scroll
			 * @protected
			 */
			prototype._scroll = function () {
				var self = this;

				momentum = (momentum === undefined) ? 0 : momentum;

				self._refresh();
				self._requestRender();
			};

			/**
			 * Calculate scale for given Y position
			 * @param {number} y
			 * @return {number}
			 * @protected
			 */
			prototype._getScaleByY = function (y) {
				var self = this,
					roundY = round(y);

				if (roundY > self.options.ellipsisB || roundY < -self.options.ellipsisB) {
					return 0;
				} else {
					return factorsX[abs(roundY)];
				}
			};

			/**
			 * Redraw list after roll down/up
			 * @method _roll
			 * @param {number} duration Time of rolling
			 * @memberof ns.widget.wearable.ArcListview
			 * @protected
			 */
			prototype._roll = function (duration) {
				var self = this,
					state = self._state,
					scroll = state.scroll;

				if (state.items.length === 0) {
					return;
				}

				// increase scroll duration according to length of items
				// one item more increase duration +25%
				// scroll duration is set to 0 when animations are disabled
				state.duration = duration !== undefined ? duration :
					SCROLL_DURATION * (1 + (abs(state.currentIndex - state.toIndex) - 1) / 4);

				// start scroll animation from current scroll position
				scroll.from = scroll.current;
				scroll.to = -1 * (state.items[state.toIndex].y - SCREEN_HEIGHT / 2 + 1);

				// if scroll animation is ended then animation start
				if (self._scrollAnimationEnd) {
					state.startTime = Date.now();
					self._scrollAnimationEnd = false;
					self._requestRender();
				}
			};

			/**
			 * Add new item to listview
			 * @method addItem
			 * @param {string} content text content for new list item
			 * @param {number} [index] item index on list, default last item
			 * @param {HTMLElement} [liElement=null] new list item
			 * @memberof ns.widget.wearable.ArcListview
			 */
			prototype.addItem = function (content, index, liElement) {
				var li = liElement || document.createElement("li"),
					self = this,
					lastItem,
					prevItem;

				// append new li elements to widget element
				if (typeof self.options.listItemUpdater === "function") {
					self.options.listItemUpdater(li, index);
				} else {
					li.innerHTML = "<a href=\"\">" + content + "</a>";
				}
				self.element.appendChild(li);

				// find new li elements attached to widget element
				self._addItemsFromElement();
				// move li elements to widget cache
				self._setAnimatedItems();

				// set new item position on list;
				if (self._state.items.length > 1) {
					lastItem = self._state.items[self._state.items.length - 1];
					prevItem = self._state.items[self._state.items.length - 2];

					lastItem.y = prevItem.y + prevItem.height;
					lastItem.rect.bottom = prevItem.rect.bottom + prevItem.rect.height;
					lastItem.rect.top = prevItem.rect.top + prevItem.rect.height;
				}

				self._setMaxScrollY();
				self._bouncingEffect._maxValue = self._maxScrollY;

				// refresh widget view
				self.refresh();
			}

			/**
			 * Change to next item
			 * @method _rollDown
			 * @memberof ns.widget.wearable.ArcListview
			 * @protected
			 */
			prototype._rollDown = function () {
				var self = this,
					state = self._state,
					bouncingEffect = self._bouncingEffect;

				self.trigger(events.CHANGE, {
					"unselected": state.currentIndex
				});

				if (state.toIndex < state.items.length - 1) {
					state.toIndex++;
					// hide end effect
					bouncingEffect.dragEnd();
				} else {
					// show bottom end effect
					bouncingEffect.drag(0, -self._maxScrollY);
					// hide after timeout
					self._setBouncingTimeout();
				}

				self._roll();
			};

			/**
			 * Change to prev item
			 * @method _rollUp
			 * @memberof ns.widget.wearable.ArcListview
			 * @protected
			 */
			prototype._rollUp = function () {
				var self = this,
					state = self._state,
					bouncingEffect = self._bouncingEffect;

				self.trigger(events.CHANGE, {
					"unselected": state.currentIndex
				});


				if (state.toIndex > 0) {
					state.toIndex--;
					// hide end effect
					bouncingEffect.dragEnd();
				} else {
					// show top end effect
					bouncingEffect.drag(0, 0);
					// hide after timeout
					self._setBouncingTimeout();
				}

				self._roll();
			};

			/**
			 * Callback for rotary event
			 * @param {Event} event
			 * @protected
			 */
			prototype._onRotary = function (event) {
				var self = this;

				self._scrollAnimationEnd = true;
				if (event.detail.direction === "CW") {
					self._rollDown();
				} else {
					self._rollUp();
				}
			};

			/**
			 * Scroll list to index
			 * @method scrollToPosition
			 * @param {number} index
			 * @param {boolean} skipAnimation
			 * @public
			 * @return {boolean} True if the list was scrolled, false - otherwise.
			 * @member ns.widget.wearable.SnapListview
			 */
			prototype.scrollToPosition = function (index, skipAnimation) {
				var self = this,
					state = self._state;

				self.trigger(events.CHANGE, {
					"unselected": state.currentIndex
				});

				state.toIndex = index;

				if (this.options.listItemUpdater) {  // virtual list
					if (state.toIndex > self.options.dataLength - 1) {
						state.toIndex = self.options.dataLength - 1;
					}
				} else { // normal list
					if (state.toIndex > state.items.length - 1) {
						state.toIndex = state.items.length - 1;
					}
				}

				if (state.toIndex < 0) {
					state.toIndex = 0;
				}

				if (skipAnimation) {
					self._roll(ONE_FRAME_TIME);
				} else {
					self._roll();
				}
			};

			/**
			 * Get selected index
			 * @method getSelectedIndex
			 * @return {number} index
			 * @public
			 * @member ns.widget.wearable.SnapListview
			 */
			prototype.getSelectedIndex = function () {
				return this._state.currentIndex;
			};

			/**
			 * Handler for event touch start
			 * @method _onTouchStart
			 * @param {Event} event
			 * @memberof ns.widget.wearable.ArcListview
			 * @protected
			 */
			prototype._onTouchStart = function (event) {
				var self = this,
					touch = event.changedTouches[0],
					state = self._state;

				deltaTouchY = 0;
				lastTouchY = touch.clientY;
				startTouchTime = Date.now();
				deltaSumTouchY = 0;
				lastTouchTime = startTouchTime;
				averageVelocity = 0;
				sumTime = 0;
				sumDistance = 0;
				momentum = 0;
				self._scrollAnimationEnd = true;
				didScroll = false;

				self._carouselUpdate(state.currentIndex);
			};

			/**
			 * Handler for event touch move
			 * @method _onTouchMove
			 * @param {Event} event
			 * @memberof ns.widget.wearable.ArcListview
			 * @protected
			 */
			prototype._onTouchMove = function (event) {
				var self = this,
					state = self._state,
					touch = event.changedTouches[0],
					deltaTouchTime,
					scroll = state.scroll,
					current = scroll.current,
					bouncingEffect = self._bouncingEffect;

				if (self._items.length === 0) {
					return;
				}

				// time
				lastTouchTime = Date.now();
				deltaTouchTime = lastTouchTime - startTouchTime;

				// move
				deltaTouchY = touch.clientY - lastTouchY;
				current += deltaTouchY;
				deltaSumTouchY += deltaTouchY;

				if (didScroll === false &&
					(deltaTouchTime > TOUCH_MOVE_TIME_THRESHOLD || abs(deltaSumTouchY) > TOUCH_MOVE_Y_THRESHOLD)) {
					didScroll = true;
					self.trigger(events.CHANGE, {
						"unselected": state.currentIndex
					});
				}

				if (didScroll) {
					lastTouchY = touch.clientY;
					// set current to correct range
					if (current > 0) {
						current = 0;
						// enable top end effect
						bouncingEffect.drag(0, 0);
						self._setBouncingTimeout();
					} else if (current < -self._maxScrollY) {
						current = -self._maxScrollY;
						// enable bottom end effect
						bouncingEffect.drag(0, current);
						self._setBouncingTimeout();
					} else {
						// hide end effect
						bouncingEffect.dragEnd();
					}
					scroll.current = current;

					state.currentIndex = self._findItemIndexByY(-1 * (current - SCREEN_HEIGHT / 2 + 1));
					self._carouselUpdate(state.currentIndex);

					momentum = 0;
					self._scroll();
					lastTouchTime = Date.now();
				}
			};

			/**
			 * Handler for event touch end
			 * @method _onTouchEnd
			 * @param {Event} event
			 * @memberof ns.widget.wearable.ArcListview
			 * @protected
			 */
			prototype._onTouchEnd = function (event) {
				var touch = event.changedTouches[0],
					self = this,
					state = self._state,
					scroll = state.scroll,
					bouncingEffect = self._bouncingEffect;

				if (didScroll) {
					deltaTouchY = touch.clientY - lastTouchY;
					lastTouchY = touch.clientY;
					scroll.current += deltaTouchY;
					if (scroll.current > 0) {
						scroll.current = 0;
					}

					state.currentIndex = self._findItemIndexByY(-1 * (scroll.current - SCREEN_HEIGHT / 2 + 1));
					self._carouselUpdate(state.currentIndex);

					momentum = MOMENTUM_VALUE;
					self._scrollAnimationEnd = true;
					self._scroll();
					lastTouchTime = 0;

					// bouncing effect
					if (bouncingEffect) {
						bouncingEffect.dragEnd();
					}
				} else {
					self._roll();
				}
			};

			function showHighlight(arcListviewSelection, selectedElement) {
				arcListviewSelection.style.height = selectedElement.getBoundingClientRect().height + "px";
				arcListviewSelection.classList.add(classes.SELECTION_SHOW);
			}

			prototype._removeHighlight = function () {
				var selection =	this._ui.arcListviewSelection;

				selection.classList.remove(classes.SELECTION_SHOW);
			}

			prototype._wrapTextContent = function (element) {
				var child = element.firstChild,
					TEXT_NODE_TYPE = document.TEXT_NODE,
					wrapper;

				if (!element.querySelector(".ui-arc-listview-text-content")) {
					while (child) {
						if (child.classList && child.classList.contains("ui-arc-listview-text-content") ||
							child.textContent.trim() === "") {
							child = child.nextSibling;
							continue;
						} else if (child.firstChild !== null) {
							if (this._wrapTextContent(child)) {
								return true;
							}
						} else if (child.nodeType === TEXT_NODE_TYPE) {
							wrapper = document.createElement("div");
							wrapper.className = "ui-arc-listview-text-content ui-marquee";
							child.parentNode.replaceChild(wrapper, child);
							wrapper.appendChild(child);
							return true;
						}
						child = child.nextSibling;
					}
				}
				return false;
			}

			/**
			 * Handler for event select
			 * @method _selectItem
			 * @param {number} selectedIndex
			 * @memberof ns.widget.wearable.ArcListview
			 * @protected
			 */
			prototype._selectItem = function (selectedIndex) {
				var ui = this._ui,
					state = this._state,
					selectedElement = state.items[selectedIndex].element,
					marqueeDiv = selectedElement.querySelector(".ui-arc-listview-text-content"),
					marqueeWidget = null;

				// Start marquee.
				if (marqueeDiv) {
					marqueeDiv.style.width = "100%";
					marqueeDiv.classList.add("ui-marquee");
					marqueeWidget = ns.engine.getBinding(marqueeDiv);
					if (!marqueeWidget) {
						marqueeWidget = ns.widget.Marquee(marqueeDiv, {
							marqueeStyle: "endToEnd",
							iteration: 1,
							delay: "300"
						});
					} else {
						marqueeWidget.start();
					}
				}

				if (selectedElement.classList.contains(classes.SELECTED)) {
					showHighlight(ui.arcListviewSelection, selectedElement);
				} else {
					selectedElement.addEventListener("transitionend", this, true);
					selectedElement.addEventListener("webkitTransitionEnd", this, true);
					selectedElement.classList.add(classes.SELECTED);
				}
			};

			/**
			 * Handler for change event
			 * @method _onChange
			 * @param {Event} event
			 * @memberof ns.widget.wearable.ArcListview
			 * @protected
			 */
			prototype._onChange = function (event) {
				var selectedIndex = event.detail.selected,
					unselectedIndex = event.detail.unselected,
					classList = this._ui.arcListviewSelection.classList,
					selectedElement = null,
					marqueeDiv = null,
					marqueeWidget = null;

				if (!event.defaultPrevented && this._state.items.length > 0) {
					if (selectedIndex !== undefined) {
						this._selectItem(selectedIndex);
					} else {
						classList.remove(classes.SELECTION_SHOW);
						selectedElement = this._state.items[unselectedIndex].element,
						selectedElement.removeEventListener("transitionend", this, true);
						selectedElement.removeEventListener("webkitTransitionEnd", this, true);
						selectedElement.classList.remove(classes.SELECTED);

						// Stop marquee.
						marqueeDiv = selectedElement.querySelector(".ui-arc-listview-text-content");
						if (marqueeDiv) {
							marqueeWidget = ns.engine.getBinding(marqueeDiv);
							if (marqueeWidget) {
								marqueeWidget.stop();
								marqueeWidget.reset();
							}
						}
					}
				}
			};

			/**
			 * Handler for transitionend event of active element
			 * @method _onSelectedElementTransitionEnd
			 * @memberof ns.widget.wearable.ArcListview
			 * @protected
			 */
			prototype._onSelectedElementTransitionEnd = function () {
				var self = this,
					selectionElement = self._ui.arcListviewSelection,
					items = self._state.items,
					index = self._state.currentIndex,
					activeElement = items[index].element;

				showHighlight(selectionElement, activeElement);
			}

			/**
			 * Handler for click event
			 * @method _onClick
			 * @param {Event} event
			 * @memberof ns.widget.wearable.ArcListview
			 * @protected
			 */
			prototype._onClick = function (event) {
				var self = this,
					target = event.target,
					state = self._state,
					li = selectorsUtil.getClosestByTag(target, "li"),
					toIndex = state.items.map(function (item) {
						return item.element;
					}).indexOf(li);

				if (toIndex > -1 && toIndex !== state.currentIndex) {
					self.trigger(events.CHANGE, {
						"unselected": state.currentIndex
					});

					if (toIndex < state.items.length) {
						state.toIndex = toIndex;
					}
				}
				// Do scroll regardless of 'toIndex' value. This will center content relative
				// to clicked position.
				self._roll();
			};

			prototype._onPageInit = function () {
				this._init();
			};

			/**
			 * Handler for popupbeforeshow event
			 * @method _onPopupShow
			 * @param {Event} event
			 * @memberof ns.widget.wearable.ArcListview
			 * @protected
			 */
			prototype._onPopupShow = function (event) {
				var self = this,
					popup = event.target;

				if (!popup.classList.contains(Popup.classes.toastSmall)) {
					self.disableList();
					self._disabledByPopup = true;
				}
			};


			/**
			 * Handler for popupbeforehide event
			 * @method _onPopupHide
			 * @memberof ns.widget.wearable.ArcListview
			 * @protected
			 */
			prototype._onPopupHide = function () {
				var self = this;

				if (self._disabledByPopup) {
					self.enableList();
				}
			}

			prototype._buildArcListviewElement = function (parentElement, cssClass, options) {
				// find or add element for current list element
				var arcListviewElement = parentElement.querySelector(cssClass);

				if (!arcListviewElement) {
					arcListviewElement = document.createElement("div");
					arcListviewElement.classList.add(cssClass);
					if (options && options.insertBefore) {
						parentElement.insertBefore(arcListviewElement, parentElement.firstElementChild);
					} else {
						parentElement.appendChild(arcListviewElement);
					}
				}
				return arcListviewElement;
			};

			function buildArcListviewCarousel(carousel, count) {
				// create carousel
				var arcListviewCarousel = document.createElement("div"),
					carouselElement,
					carouselSeparator,
					fragment = document.createDocumentFragment(),
					i = 0;

				arcListviewCarousel.classList.add(classes.CAROUSEL, classes.PREFIX + count);
				for (; i < count + 4; i++) {
					carouselElement = document.createElement("ul");
					carouselElement.classList.add(classes.CAROUSEL_ITEM);
					carouselElement.classList.add(classes.LISTVIEW);
					carouselSeparator = document.createElement("ul");
					carouselSeparator.classList.add(classes.CAROUSEL_ITEM);
					carouselSeparator.classList.add(classes.CAROUSEL_ITEM_SEPARATOR);
					carouselSeparator.classList.add(classes.LISTVIEW);
					carousel.items[i] = {
						carouselSeparator: carouselSeparator,
						carouselElement: carouselElement
					};
					fragment.appendChild(carouselSeparator);
					fragment.appendChild(carouselElement);
				}
				arcListviewCarousel.appendChild(fragment);
				return arcListviewCarousel;
			}

			/**
			 * Widget build method
			 * @method _build
			 * @param {HTMLElement} element
			 * @memberof ns.widget.wearable.ArcListview
			 * @protected
			 */
			prototype._build = function (element) {
				if (engine.getBinding(element, "Listview")) {
					return null;
				}
				if (engine.getBinding(element, "SnapListview")) {
					ns.warn("Can't create Listview on SnapListview element");
					return null;
				}

				return element;
			};

			prototype._getItemsFromElement = function () {
				var self = this;

				// find list elements with including group indexes
				self._items = slice.call(self._ui.page.querySelectorAll(selectors.ITEMS)) || [];
			}

			prototype._addItemsFromElement = function () {
				var self = this;

				// find list elements with including group indexes
				self._items = self._items.concat(slice.call(self._ui.page.querySelectorAll(selectors.ITEMS)));
			}

			prototype._createTextInputs = function () {
				arrayUtil.forEach(this._items, function (item) {
					var textInputEl = selectorsUtil.getChildrenBySelector(item, selectors.TEXT_INPUT)[0];

					if (textInputEl) {
						ns.widget.TextInput(textInputEl);
					}
				});
			}

			/**
			 * Return all dividers (category names in items' list)
			 * @method getDividers
			 * @memberof ns.widget.wearable.ArcListview
			 */
			prototype.getDividers = function () {
				return this._items
					.filter(function (elem) {
						return elem.classList.contains(classes.DIVIDER);
					});
			}

			/**
			 * Widget init method
			 * @method _init
			 * @memberof ns.widget.wearable.ArcListview
			 * @protected
			 */
			prototype._init = function () {
				var self = this,
					element = self.element,
					options = self.options,
					page,
					scroller,
					ui = self._ui,
					carousel = self._carousel,
					visibleItemsCount = parseInt(self.options.visibleItems, 10);

				// find outer parent elements
				page = selectorsUtil.getClosestBySelector(element, selectors.PAGE);
				ui.page = page;

				scroller = selectorsUtil.getClosestBySelector(element, selectors.SCROLLER);


				if (scroller) {
					// disable tau rotaryScroller the widget has own support for rotary event
					ns.util.rotaryScrolling && ns.util.rotaryScrolling.lock();

					element.classList.add(WIDGET_CLASS, classes.PREFIX + visibleItemsCount);

					self._getItemsFromElement();
					self._createTextInputs();

					ui.arcListviewSelection = self._buildArcListviewElement(
						scroller, classes.SELECTION, {
							insertBefore: true
						});
					ui.arcListviewCarousel = buildArcListviewCarousel(carousel, visibleItemsCount);
					ui.dummyElement = self._buildArcListviewElement(page, classes.DUMMY_ELEMENT);

					// append carousel outside scroller element
					scroller.parentElement.appendChild(ui.arcListviewCarousel);
					ui.arcListviewCarousel.addEventListener("vclick", self, true);

					// cache HTML elements
					ui.scroller = scroller;

					ArcListview.calcFactors(options.ellipsisA, options.ellipsisB);

					// init items;
					self._setAnimatedItems();
					self._scrollAnimationEnd = true;
					momentum = 1;
					self._refresh();
					self._scroll();
					self._initBouncingEffect();
				}
			};

			prototype._onCurrentIndexChange = function (event) {
				var currentIndex = event.detail.index,
					self = this;

				// support for virtual list
				if (self.options.listItemUpdater) {
					if (currentIndex + LOAD_THRESHOLD > self._items.length) {
						self._loadItems(NUMBER_ITEMS_TO_ADD);
					}
				}
			};

			/**
			 * Event handler for widget
			 * @param {Event} event
			 * @method handleEvent
			 * @memberof ns.widget.wearable.ArcListview
			 * @protected
			 */
			prototype.handleEvent = function (event) {
				var self = this,
					page = self._ui.page;

				if (event.type === "pageinit") {
					self._onPageInit(event);
				} else if (event.type === "pageshow") {
					self._selectItem(self._state.currentIndex);
				} else if (event.type === "pagehide") {
					self._removeHighlight();
				} else if (page && page.classList.contains("ui-page-active")) {
					// disable events on non active page
					switch (event.type) {
						case "touchmove" :
							self._onTouchMove(event);
							break;
						case "rotarydetent" :
							self._onRotary(event);
							break;
						case "touchstart" :
							self._onTouchStart(event);
							break;
						case "touchend" :
							self._onTouchEnd(event);
							break;
						case "change" :
							self._onChange(event);
							break;
						case "vclick" :
							self._onClick(event);
							break;
						case "popupbeforehide":
							self._onPopupHide();
							break;
						case "popupbeforeshow":
							self._onPopupShow(event);
							break;
						case "currentindexchange" :
							self._onCurrentIndexChange(event);
							break;
						case "transitionend":
						case "webkitTransitionEnd":
							self._onSelectedElementTransitionEnd();
							break;
					}
				}
			};

			/**
			 * Bind event listeners to widget instance
			 * @method _bindEvents
			 * @memberof ns.widget.wearable.ArcListview
			 * @protected
			 */
			prototype._bindEvents = function () {
				var self = this,
					element = self.element,
					page = self._ui.page;

				page.addEventListener("touchstart", self, true);
				page.addEventListener("touchmove", self, true);
				page.addEventListener("touchend", self, true);
				page.addEventListener("pageinit", self, true);
				page.addEventListener("pageshow", self, true);
				page.addEventListener("pagehide", self, true);
				page.addEventListener("popupbeforeshow", self, true);
				page.addEventListener("popupbeforehide", self, true);
				if (self._ui.arcListviewCarousel) {
					self._ui.arcListviewCarousel.addEventListener("vclick", self, true);
				}
				document.addEventListener("rotarydetent", self, true);
				element.addEventListener("change", self, true);
				element.addEventListener("currentindexchange", self, true);
			};

			/**
			 * Binds methods unbound by disableList method
			 * @method enableList
			 * @memberof ns.widget.wearable.ArcListview
			 * @protected
			 */
			prototype.enableList = function () {
				var self = this,
					page = self._ui.page;

				page.addEventListener("touchstart", self, true);
				page.addEventListener("touchmove", self, true);
				page.addEventListener("touchend", self, true);
				if (self._ui.arcListviewCarousel) {
					self._ui.arcListviewCarousel.addEventListener("vclick", self, true);
				}
				document.addEventListener("rotarydetent", self, true);
			}

			/**
			 * Unbind events that can be possibly triggered by the user
			 * Can be handy while we want to bind these event to the other list
			 * opened in the popup.
			 * @method disableList
			 * @memberof ns.widget.wearable.ArcListview
			 * @protected
			 */
			prototype.disableList = function () {
				var self = this,
					page = self._ui.page;

				page.removeEventListener("touchstart", self, true);
				page.removeEventListener("touchmove", self, true);
				page.removeEventListener("touchend", self, true);
				self._ui.arcListviewCarousel.removeEventListener("vclick", self, true);
				document.removeEventListener("rotarydetent", self, true);
			}

			/**
			 * Remove event listeners from widget instance
			 * @method _unbindEvents
			 * @memberof ns.widget.wearable.ArcListview
			 * @protected
			 */
			prototype._unbindEvents = function () {
				var self = this,
					element = self.element,
					page = self._ui.page;

				page.removeEventListener("touchstart", self, true);
				page.removeEventListener("touchmove", self, true);
				page.removeEventListener("touchend", self, true);
				page.removeEventListener("pageinit", self, true);
				page.removeEventListener("pageshow", self, true);
				page.removeEventListener("pagehide", self, true);
				page.removeEventListener("popupbeforeshow", self, true);
				page.removeEventListener("popupbeforehide", self, true);
				if (self._ui.arcListviewCarousel) {
					self._ui.arcListviewCarousel.removeEventListener("vclick", self, true);
				}
				document.removeEventListener("rotarydetent", self, true);
				element.removeEventListener("change", self, true);
				element.removeEventListener("currentindexchange", self, true);
			};

			prototype._loadItems = function (count) {
				var len = this._items.length,
					i = 0;

				for (i = 0; i < count; i++) {
					this.addItem("", i + len);
				}
			}

			/**
			 * Virtual listview feature for update items from data
			 */
			prototype.setListItemUpdater = function (updateFunction) {
				var self = this,
					elementHeight = 0;

				self.options.listItemUpdater = updateFunction;
				self._loadItems(NUMBER_ITEMS_TO_ADD);

				// set widget element height to show progress bar;
				if (self._state.items.length > 0) {
					elementHeight = self.options.dataLength * self._state.items.reduce(function (before, item) {
						return before + item.rect.height;
					}, 0) / self._state.items.length;
				}
				prepareParentStyle(self.element, {
					height: elementHeight
				});
			};

			prototype._updateListItem = function (element, index) {
				element.setAttribute("data-index", index);
				this.options.listItemUpdater(element, index);
			};

			/**
			 * Destroy widget instance
			 * @method _destroy
			 * @memberof ns.widget.wearable.ArcListview
			 * @protected
			 */
			prototype._destroy = function () {
				var self = this,
					ui = self._ui,
					arcListviewSelection = ui.arcListviewSelection,
					arcListviewCarousel = ui.arcListviewCarousel,
					dummyElement = ui.dummyElement,
					marqueeDiv = null,
					marqueeWidget = null;

				self._unbindEvents();
				self._items = [];

				// Destroy marquee.
				self._state.items.forEach(function (item) {
					marqueeDiv = item.element.querySelector(".ui-arc-listview-text-content");
					if (marqueeDiv) {
						marqueeWidget = ns.engine.getBinding(marqueeDiv);
						if (marqueeWidget) {
							marqueeWidget.destroy();
						}
					}
				});
				self._state.items = [];

				// remove added elements
				if (arcListviewSelection && arcListviewSelection.parentElement) {
					arcListviewSelection.parentElement.removeChild(arcListviewSelection);
				}
				if (arcListviewCarousel && arcListviewCarousel.parentElement) {
					arcListviewCarousel.parentElement.removeChild(arcListviewCarousel);
				}
				if (dummyElement && dummyElement.parentElement) {
					dummyElement.parentElement.removeChild(dummyElement);
				}
			};

			prototype._setMaxScrollY = function () {
				var self = this;

				if (self._state.items.length) {
					self._maxScrollY = self._state.items[self._state.items.length - 1].rect.bottom - BOTTOM_MARGIN;
				} else {
					self._maxScrollY = self.element.getBoundingClientRect().bottom - BOTTOM_MARGIN;
				}
			}

			prototype._initBouncingEffect = function () {
				var self = this;

				self._setMaxScrollY();
				self._bouncingEffect = new ns.widget.core.scroller.effect.Bouncing(self._ui.page, {
					maxScrollX: 0,
					maxScrollY: self._maxScrollY,
					orientation: "vertical"
				});
			};

			ArcListview.prototype = prototype;
			ns.widget.wearable.ArcListview = ArcListview;
			ArcListview.classes = classes;

			engine.defineWidget(
				"ArcListview",
				"." + WIDGET_CLASS,
				[],
				ArcListview,
				"wearable"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ArcListview;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
