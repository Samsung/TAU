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
/*global window, define, ns */
/**
 * # SnapListview Widget
 * Shows a snap list view.
 * It detects center-positioned list item when scroll end. When scroll event started, SnapListview trigger *scrollstart* event, and scroll event ended, it trigger *scrollend* event.
 * When scroll ended and it attach class to detected item.
 *
 * ## Default selectors
 *
 * Default selector for snap listview widget is class *ui-snap-listview*.
 *
 * To add a list widget to the application, use the following code:
 *
 * ### List with basic items
 *
 * You can add a basic list widget as follows:
 *
 *      @example
 *         <ul class="ui-listview ui-snap-listview">
 *             <li>1line</li>
 *             <li>2line</li>
 *             <li>3line</li>
 *             <li>4line</li>
 *             <li>5line</li>
 *         </ul>
 *
 * ## JavaScript API
 *
 * There is no JavaScript API.
 *
 * @author Heeju Joo <heeju.joo@samsung.com>
 * @class ns.widget.wearable.SnapListview
 * @component-selector .ui-snap-listview
 * @extends ns.widget.BaseWidget
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/event",
			"../../../../core/util/DOM",
			"../../../../core/util/selectors",
			"../../../../core/util/scrolling",
			"../../../../core/util/array",
			"../../../../core/widget/BaseWidget",
			"../wearable"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				/**
				 * Alias for class ns.engine
				 * @property {ns.engine} engine
				 * @member ns.widget.wearable.SnapListview
				 * @private
				 */
				engine = ns.engine,
				/**
				 * Alias for class ns.event
				 * @property {ns.event} utilEvent
				 * @member ns.widget.wearable.SnapListview
				 * @private
				 */
				utilEvent = ns.event,
				/**
				 * Alias for class ns.util.DOM
				 * @property {ns.util.DOM} doms
				 * @member ns.widget.wearable.SnapListview
				 * @private
				 */
				util = ns.util,
				doms = util.DOM,
				/**
				 * Alias for class ns.util.selectors
				 * @property {ns.util.selectors} utilSelector
				 * @member ns.widget.wearable.SnapListview
				 * @private
				 */
				utilSelector = util.selectors,
				scrolling = util.scrolling,

				/**
				 * Triggered when scroll will be started
				 * @event scrollstart
				 * @member ns.widget.wearable.SnapListview
				 */
				/**
				 * Triggered when scroll will be ended
				 * @event scrollend
				 * @member ns.widget.wearable.SnapListview
				 */
				/**
				 * Triggered when selected element
				 * @event selected
				 * @member ns.widget.wearable.SnapListview
				 */
				eventType = {
					SCROLL_START: "scrollstart",
					SCROLL_END: "scrollend",
					SELECTED: "selected"
				},
				utilArray = ns.util.array,
				SnapListview = function () {
					var self = this;

					self._ui = {
						page: null,
						scrollableParent: {
							element: null,
							height: 0
						},
						childItems: {}
					};

					/**
					 * Object with default options
					 * @property {Object} options
					 * @property {string} [options.selector=li:not(.ui-listview-divider)]
					 * @property {string} [options.animate=none]
					 * @property {Object} [options.scale]
					 * @property {Object} [options.scale.from=0.67]
					 * @property {Object} [options.scale.to=1]
					 * @property {Object} [options.opacity]
					 * @property {Object} [options.opacity.from=0.7]
					 * @property {Object} [options.opacity.to=1]
					 * @memberof ns.widget.wearable.ArcListview
					 */
					self.options = {
						selector: "li:not(.ui-listview-divider)",
						animate: "none",
						scale: {
							from: 0.67,
							to: 1
						},
						opacity: {
							from: 0.7,
							to: 1
						}
					};

					self._listItems = [];
					self._callbacks = {};
					self._scrollEndTimeoutId = null;
					self._isScrollStarted = false;
					self._selectedIndex = null;
					self._currentIndex = null;
					self._enabled = true;
					self._isTouched = false;
					self._isScrollToPosition = false;
					self._scrollEventCount = 0;
					self._marginTop = 0;
					self._headerHeight = 0;
				},

				prototype = new BaseWidget(),

				/**
				* Standard snap listview widget
				* @style ui-snap-listview
				* @member ns.widget.wearable.SnapListview
				*/
				CLASSES_PREFIX = "ui-snap-listview",

				classes = {
					/**
					* Set container for snap listview widget
					* @style ui-snap-container
					* @member ns.widget.wearable.SnapListview
					*/
					SNAP_CONTAINER: "ui-snap-container",
					/**
					* Set snap listview widget as disabled
					* @style ui-snap-disabled
					* @member ns.widget.wearable.SnapListview
					*/
					SNAP_DISABLED: "ui-snap-disabled",
					SNAP_LISTVIEW: CLASSES_PREFIX,
					/**
					* Set snap listview widget as selected
					* @style ui-snap-listview-selected
					* @member ns.widget.wearable.SnapListview
					*/
					SNAP_LISTVIEW_SELECTED: CLASSES_PREFIX + "-selected",
					/**
					* Set item for snap listview widget
					* @style ui-snap-listview-item
					* @member ns.widget.wearable.SnapListview
					*/
					SNAP_LISTVIEW_ITEM: CLASSES_PREFIX + "-item"
				},

				// time threshold for detect scroll end
				SCROLL_END_TIME_THRESHOLD = 150;

			SnapListview.classes = classes;
			SnapListview.animationTimer = null;

			/**
			 * Class representing one item in list
			 * @param {HTMLElement} element list element
			 * @param {number} visibleOffset top offset of list
			 * @class ns.widget.wearable.SnapListview.ListItem
			 */
			SnapListview.ListItem = function (element, visibleOffset) {
				var offsetTop,
					height;

				element.classList.add(classes.SNAP_LISTVIEW_ITEM);
				offsetTop = element.offsetTop;
				height = element.offsetHeight;

				this.element = element;
				this.rate = -1;

				this.coord = {
					top: offsetTop,
					height: height
				};

				this.position = {
					begin: offsetTop - visibleOffset,
					start: offsetTop - visibleOffset + height,
					stop: offsetTop,
					end: offsetTop + height
				};
			};

			SnapListview.ListItem.prototype = {
				/**
				 * Class represent one item in list
				 * @method animate
				 * @param {number} offset
				 * @param {Function} callback
				 * @memberof ns.widget.wearable.SnapListview.ListItem
				 */
				animate: function (offset, callback) {
					var element = this.element,
						p = this.position,
						begin = p.begin,
						end = p.end,
						start = p.start,
						stop = p.stop,
						rate;

					if (offset >= start && offset <= stop) {
						rate = Math.min(1, Math.abs((offset - start) / (stop - start)));
					} else if ((offset > begin && offset < start) || (offset < end && offset > stop)) {
						rate = 0;
					} else {
						rate = -1;
					}

					if (this.rate !== rate) {
						callback(element, rate);
						this.rate = rate;
					}
				}
			};

			function removeSelectedClass(self) {
				var selectedIndex = self._selectedIndex;

				if (selectedIndex !== null) {
					self._listItems[selectedIndex].element.classList.remove(classes.SNAP_LISTVIEW_SELECTED);
					self._selectedIndex = null;
				}
			}

			/**
			 * Check if element of list item is displayed
			 * @param {Object} listItem
			 * @return {boolean}
			 * @private
			 */
			function isListItemDisplayed(listItem) {
				return listItem.element.style.display !== "none";
			}

			function setSelection(self) {
				var ui = self._ui,
					listItems = self._listItems,
					scrollableParent = ui.scrollableParent,
					scrollableParentHeight = scrollableParent.height || ui.page.offsetHeight,
					scrollCenter = scrolling.getScrollPosition() + scrollableParentHeight / 2,
					listItemLength = listItems.length,
					tempListItem,
					tempListItemCoord,
					i,
					previousSelectedIndex = self._selectedIndex,
					selectedIndex;

				for (i = 0; i < listItemLength; i++) {
					tempListItem = listItems[i];
					tempListItemCoord = tempListItem.coord;

					// element has to be displayed to be able to be selected
					if (isListItemDisplayed(tempListItem) &&
						(tempListItemCoord.top < scrollCenter) &&
						(tempListItemCoord.top + tempListItemCoord.height >= scrollCenter)) {
						selectedIndex = i;
						break;
					}
				}
				if (selectedIndex !== previousSelectedIndex && selectedIndex !== undefined) {
					removeSelectedClass(self);
					if (self._selectTimeout) {
						clearTimeout(self._selectTimeout);
					}
					self._selectTimeout = setTimeout(function () {
						var element = self._listItems && self._listItems[selectedIndex].element;

						if (element) {
							self._selectedIndex = selectedIndex;
							element.classList.add(classes.SNAP_LISTVIEW_SELECTED);
							utilEvent.trigger(element, eventType.SELECTED);
						}
					}, 300);
				}
			}

			/**
			 * Animate list items
			 * @method _listItemAnimate
			 * @protected
			 * @member ns.widget.wearable.SnapListview
			 */
			prototype._listItemAnimate = function (scrollValue) {
				var self = this,
					anim = self.options.animate,
					animateCallback = self._callbacks[anim];

				if (animateCallback) {
					utilArray.forEach(self._listItems, function (item) {
						item.animate(scrollValue, animateCallback);
					});
				}
			};

			function scrollEndCallback(self) {
				self._isScrollStarted = false;
				// trigger "scrollend" event
				utilEvent.trigger(self.element, eventType.SCROLL_END);

				setSelection(self);
			}

			function scrollHandler(self, event) {
				var callbacks = self._callbacks,
					scrollEndCallback = callbacks.scrollEnd;

				if (!self._isScrollStarted) {
					self._isScrollStarted = true;
					utilEvent.trigger(self.element, eventType.SCROLL_START);
					self._scrollEventCount = 0;
				}

				self._scrollEventCount++;

				if (self._scrollEventCount > 2 || self._isTouched === true) {
					removeSelectedClass(self);
				}

				if (event && event.detail) {
					self._listItemAnimate(event.detail.scrollTop);
				}

				// scrollend handler can be run only when all touches are released.
				if (self._isTouched === false) {
					window.clearTimeout(self._scrollEndTimeoutId);
					self._scrollEndTimeoutId = window.setTimeout(scrollEndCallback, SCROLL_END_TIME_THRESHOLD);
				}
			}

			function onTouchStart(self) {
				self._isTouched = true;
			}

			function onTouchEnd(self) {
				self._isTouched = false;
			}

			function onRotary(self) {
				self._isTouched = false;
			}

			function getScrollableParent(element) {
				var overflow;

				while (element && element !== document.body) {
					if (scrolling.isElement(element)) {
						return element;
					}
					overflow = doms.getCSSProperty(element, "overflow-y");
					if (overflow === "scroll" || (overflow === "auto" && element.scrollHeight > element.clientHeight)) {
						return element;
					}
					element = element.parentNode;
				}

				return null;
			}

			/**
			 * Init snaplistview
			 * @method _initSnapListview
			 * @param {HTMLElement} listview
			 * @protected
			 * @member ns.widget.wearable.SnapListview
			 */
			prototype._initSnapListview = function (listview) {
				var self = this,
					ui = self._ui,
					scroller,
					visibleOffset,
					elementHeight,
					scrollMargin,
					listItem;

				// finding page  and scroller
				ui.page = utilSelector.getClosestByClass(listview, "ui-page") || document.body;

				scroller = getScrollableParent(listview) ||
					ui.page.querySelector(".ui-scroller") ||
					ui.page;
				if (scroller) {
					scroller.classList.add(classes.SNAP_CONTAINER);
					ui.scrollableParent.element = scroller;

					visibleOffset = scroller.clientHeight;
					ui.scrollableParent.height = visibleOffset;

					listItem = listview.querySelector(self.options.selector);
					if (!listItem) {
						return scroller;
					}

					if (!scrolling.isElement(scroller)) {
						scrolling.enable(scroller, "y");
					}

					elementHeight = (listItem) ? listItem.getBoundingClientRect().height : 0;

					scrollMargin = listview.getBoundingClientRect().top -
						scroller.getBoundingClientRect().top - elementHeight / 2;

					scrolling.setMaxScroll(scroller.firstElementChild.getBoundingClientRect()
						.height + scrollMargin);
					scrolling.setSnapSize(self._listItems.map(function (item) {
						return {
							position: item.coord.top,
							length: item.coord.height
						};
					}));
				}
				return scroller;
			};

			prototype._refreshSnapListview = function (listview) {
				var self = this,
					ui = self._ui,
					options = self.options,
					listItems = [],
					scroller = ui.scrollableParent.element,
					visibleOffset,
					contentElement,
					header;

				if (!scroller) {
					scroller = self._initSnapListview(listview);
				}
				visibleOffset = ui.scrollableParent.height || ui.page.offsetHeight;

				contentElement = scroller.querySelector(".ui-content");
				if (contentElement) {
					self._marginTop = parseInt(window.getComputedStyle(contentElement).marginTop, 10);
				}

				header = ui.page.querySelector(".ui-header");
				self._headerHeight = (header) ? header.offsetHeight : 0;

				// init information about widget
				self._selectedIndex = null;

				// init items on each element
				utilArray.forEach(listview.querySelectorAll(options.selector), function (element, index) {
					listItems.push(new SnapListview.ListItem(element, visibleOffset));
					// searching existing selected element
					if (element.classList.contains(classes.SNAP_LISTVIEW_SELECTED)) {
						self._selectedIndex = index;
						self._currentIndex = index;
					}
				});

				if (listItems.length == 0) {
					return;
				}

				scrolling.setSnapSize(listItems.map(function (item) {
					return {
						position: item.coord.top,
						length: item.coord.height
					};
				}));

				self._listItems = listItems;
				self._listItemAnimate(scrolling.getScrollPosition());
			};

			/**
			 * Build widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.wearable.SnapListview
			 * return {HTMLElement}
			 */
			prototype._build = function (element) {
				var classList = element.classList;

				// build only if not exist listview on this element
				if (!engine.getBinding(element, "Listview")) {
					if (!classList.contains(classes.SNAP_LISTVIEW)) {
						classList.add(classes.SNAP_LISTVIEW);
					}
					// return element to continue flow
					return element;
				} else {
					// in another case display warning
					ns.warn("Can't create SnapListview on Listview element");
					// return element to stop flow
					return null;
				}
			};

			/**
			 * Init SnapListview
			 * @method _init
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.wearable.SnapListview
			 */
			prototype._init = function (element) {
				var self = this,
					options = this.options,
					scaleForm = options.scale.from,
					scaleTo = options.scale.to,
					opacityForm = options.opacity.from,
					opacityTo = options.opacity.to;

				self._callbacks = {
					scroll: scrollHandler.bind(null, self),
					scrollEnd: scrollEndCallback.bind(null, self),
					scale: function (listItemElement, rate) {
						var scale,
							opacity;

						if (rate < 0) {
							listItemElement.style.webkitTransform = "";
							listItemElement.style.opacity = "";
							return;
						}

						rate = rate > 0.5 ? 1 - rate : rate;

						scale = scaleForm + ((scaleTo - scaleForm) * rate * 2);
						opacity = opacityForm + ((opacityTo - opacityForm) * rate * 2);

						listItemElement.style.webkitTransform = "scale3d(" + scale + "," + scale + "," + scale + ")";
						listItemElement.style.opacity = opacity;
					}
				};

				self._refreshSnapListview(element);
				setSelection(self);

				return element;
			};

			/**
			 * Refresh structure.
			 * This function has to be called every time when the structure of list changed,
			 * eg. the visibility of item on list was changed by setting value of 'display' property
			 *
			 * @method _refresh
			 * @protected
			 * @member ns.widget.wearable.SnapListview
			 */
			prototype._refresh = function () {
				var self = this,
					element = self.element;

				self._refreshSnapListview(element);
				setSelection(self);

				return null;
			};

			/**
			 * Bind events
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.wearable.SnapListview
			 */
			prototype._bindEvents = function () {
				var self = this,
					element = self.element,
					scrollableElement = self._ui.scrollableParent.element;

				self._callbacks.touchstart = onTouchStart.bind(null, self);
				self._callbacks.touchend = onTouchEnd.bind(null, self);
				self._callbacks.vclick = vClickHandler.bind(null, self);
				self._callbacks.rotary = onRotary.bind(null, self);

				if (scrollableElement) {
					utilEvent.on(scrollableElement, "scroll", this._callbacks.scroll, false);
				}
				element.addEventListener("touchstart", self._callbacks.touchstart, false);
				element.addEventListener("touchend", self._callbacks.touchend, false);
				element.addEventListener("vclick", self._callbacks.vclick, false);
				window.addEventListener("rotarydetent", self._callbacks.rotary, false);
			};

			/**
			 * Unbind events
			 * @method _unbindEvents
			 * @protected
			 * @member ns.widget.wearable.SnapListview
			 */
			prototype._unbindEvents = function () {
				var self = this,
					element = self.element,
					scrollableElement = self._ui.scrollableParent.element;

				if (scrollableElement) {
					utilEvent.off(scrollableElement, "scroll", this._callbacks.scroll, false);
				}
				element.removeEventListener("touchstart", self._callbacks.touchstart, false);
				element.removeEventListener("touchend", self._callbacks.touchend, false);
				element.removeEventListener("vclick", self._callbacks.vclick, false);
				window.removeEventListener("rotarydetent", self._callbacks.rotary, false);
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.wearable.SnapListview
			 */
			prototype._destroy = function () {
				var self = this,
					scroller;

				self._unbindEvents();

				scroller = getScrollableParent(self.element);
				if (scroller && !self._isScrollToPosition) {
					scroller.scrollTop = 0;
				}

				self._ui = null;
				self._callbacks = null;
				self._listItems = null;
				self._isScrollStarted = null;
				self._isScrollToPosition = null;

				if (self._scrollEndTimeoutId) {
					window.clearTimeout(self._scrollEndTimeoutId);
				}
				self._scrollEndTimeoutId = null;
				self._selectedIndex = null;
				self._currentIndex = null;
				self._headerHeight = null;

				scrolling.disable();

				return null;
			};

			/**
			 * Enable widget
			 * @method _enable
			 * @protected
			 * @member ns.widget.wearable.SnapListview
			 */
			prototype._enable = function () {
				var self = this,
					scrollableParent = self._ui.scrollableParent.element || self._ui.page;

				scrollableParent.classList.remove(classes.SNAP_DISABLED);
				if (!self._enabled) {
					self._enabled = true;
					self._refresh();
				}
			};

			/**
			 * Disable widget
			 * @method _disable
			 * @protected
			 * @member ns.widget.wearable.SnapListview
			 */
			prototype._disable = function () {
				var self = this,
					scrollableParent = self._ui.scrollableParent.element;

				scrollableParent.classList.add(classes.SNAP_DISABLED);
				self._enabled = false;
			};

			/**
			 * Get selectedIndex
			 * @method getSelectedIndex
			 * @return {number} index
			 * @public
			 * @member ns.widget.wearable.SnapListview
			 */
			prototype.getSelectedIndex = function () {
				return this._selectedIndex;
			};

			function vClickHandler(self, e) {
				var listItems = self._listItems,
					selectedIndex = self._selectedIndex,
					targetListItem,
					targetIndex;

				targetListItem = getSnapListItem(e.target, self.element);

				if (targetListItem && targetListItem.classList.contains(classes.SNAP_LISTVIEW_SELECTED)) {
					return;
				}

				targetIndex = getIndexOfSnapListItem(targetListItem, listItems);

				utilEvent.preventDefault(e);
				utilEvent.stopPropagation(e);

				if (targetIndex > -1 && selectedIndex !== null) {
					if (targetIndex < selectedIndex) {
						utilEvent.trigger(window, "rotarydetent", {direction: "CCW"}, true);
					} else if (targetIndex > selectedIndex) {
						utilEvent.trigger(window, "rotarydetent", {direction: "CW"}, true);
					}
				}
			}

			function getIndexOfSnapListItem(targetListItem, targetList) {
				var length = targetList.length,
					i;

				for (i = 0; i < length; i++) {
					if (targetList[i].element === targetListItem) {
						return i;
					}
				}
				return -1;
			}

			function getSnapListItem(target, listElement) {
				var current = target;

				while (current.parentNode && current !== listElement) {
					if (current.classList.contains(classes.SNAP_LISTVIEW_ITEM)) {
						return current;
					}
					current = current.parentNode;
				}
				return undefined;
			}

			/**
			 * Scroll SnapList by index
			 * @method scrollToPosition
			 * @param {number} index
			 * @param {boolean} skipAnimation
			 * @public
			 * @return {boolean} True if the list was scrolled, false - otherwise.
			 * @member ns.widget.wearable.SnapListview
			 */
			prototype.scrollToPosition = function (index, skipAnimation) {
				return this._scrollToPosition(index, skipAnimation);
			};

			/**
			 * Scroll SnapList by index
			 * @method _scrollToPosition
			 * @param {number} index
			 * @param {boolean} skipAnimation
			 * @param {Function} callback
			 * @protected
			 * @member ns.widget.wearable.SnapListview
			 */
			prototype._scrollToPosition = function (index, skipAnimation, callback) {
				var self = this,
					ui = self._ui,
					enabled = self._enabled,
					listItems = self._listItems,
					scrollableParent = ui.scrollableParent,
					listItemLength = listItems.length,
					listItem = listItems[index],
					dest;

				// if list is disabled or selected index is out of range, or item on selected index
				// is not displayed, this function returns false
				if (!enabled || index < 0 || index >= listItemLength || self._currentIndex === index ||
					!isListItemDisplayed(listItem)) {
					return false;
				}

				self._currentIndex = index;
				self._isScrollToPosition = true;

				removeSelectedClass(self);

				dest = scrolling.getScrollPositionByIndex(index);

				// FIXME: If you scroll to the last index, the position
				// may be slightly affected by the height of header. We
				// need to find the correct solution.
				if (index == listItemLength - 1) {
					dest -= self._headerHeight;
				}

				if (skipAnimation) {
					scrollableParent.element.scrollTop = dest;
				} else {
					scrollAnimation(scrollableParent.element, -scrollableParent.element.firstElementChild.getBoundingClientRect().top, dest, 450, callback);
				}

				// sync scroll position and index with scroller
				scrolling.scrollToIndex(index, dest);

				return true;
			};

			function cubicBezier(x1, y1, x2, y2) {
				return function (t) {
					var rp = 1 - t,
						rp3 = 3 * rp,
						p2 = t * t,
						p3 = p2 * t,
						a1 = rp3 * t * rp,
						a2 = rp3 * p2;

					return a1 * y1 + a2 * y2 + p3;
				};
			}

			function scrollAnimation(element, from, to, duration, callback) {
				var easeOut = cubicBezier(0.25, 0.46, 0.45, 1),
					startTime = 0,
					currentTime = 0,
					progress = 0,
					easeProgress = 0,
					distance = to - from,
					animationTimer = SnapListview.animationTimer;

				startTime = window.performance.now();
				if (animationTimer !== null) {
					window.cancelAnimationFrame(animationTimer);
				}
				animationTimer = window.requestAnimationFrame(function animation() {
					var gap;

					currentTime = window.performance.now();
					progress = (currentTime - startTime) / duration;
					easeProgress = easeOut(progress);
					gap = distance * easeProgress;
					element.scrollTop = from + gap;
					if (progress <= 1 && progress >= 0) {
						animationTimer = window.requestAnimationFrame(animation);
					} else {
						animationTimer = null;
						if (callback && typeof callback === "function") {
							callback();
						}
					}
				});
			}

			SnapListview.prototype = prototype;
			ns.widget.wearable.SnapListview = SnapListview;

			engine.defineWidget(
				"SnapListview",
				".ui-snap-listview",
				[],
				SnapListview,
				"wearable"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return SnapListview;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
