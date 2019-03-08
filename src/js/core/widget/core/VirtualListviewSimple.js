/*global window, define, ns, screen */
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
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../util/selectors",
			"../../util/scrolling",
			"../BaseWidget",
			"../../../core/support/tizen",
			"../core" // fetch namespace
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
				selectors = ns.util.selectors,
				// Scrolling util is responsible for support touches and calculate scrolling position after touch
				// In Virtual List we use scrolling in virtual model which is responsible for calculate touches, send event
				// but don't render scrolled element. For rendering is responsible only Virtual List
				utilScrolling = ns.util.scrolling,
				circularScreen = ns.support.shape.circle,

				SimpleVirtualList = function () {
					var self = this;

					self.options = {
						dataLength: 0,
						listItemUpdater: null,
						scrollElement: null,
						orientation: "vertical",
						snap: false,
						edgeEffect: circularScreen ? null : defaultEdgeEffect,
						infinite: false
					};
					self._ui = {
						edgeEffect: null,
						scrollview: null
					};
					self._scrollBegin = 0;
					self._elementsMap = [];
					self._itemSize = 0;
					self._numberOfItems = 5;
					self._edgeEffectGradientSize = 0;
				},
				abs = Math.abs,
				min = Math.min,
				floor = Math.floor,
				filter = Array.prototype.filter,
				prototype = new BaseWidget(),
				// Current color from changeable style
				// @TODO change to dynamic color
				EDGE_EFFECT_COLOR = "rgba(61, 185, 204, {1})",
				classes = {
					uiVirtualListContainer: "ui-virtual-list-container",
					edgeEffect: "ui-virtual-list-edge-effect"
				};

			SimpleVirtualList.classes = classes;

			/**
			 * Effect for edge scrolling on rectangular screens
			 * @param {number} positionDiff difference from edge to current scroll
			 * @param {string} orientation `vertical` or `horizontal`
			 * @param {string} edge `start` or `end` depending on orientation
			 * @param {number} rawPosition current scroll position
			 * @param {number} widgetInstance current widget instance
			 * @return {number}
			 */
			function defaultEdgeEffect(positionDiff, orientation, edge, rawPosition, widgetInstance) {
				var ui = widgetInstance._ui,
					edgeEffectElement = ui.edgeEffect || ui.scrollview.querySelector("." + classes.edgeEffect),
					edgeEffectStyle = edgeEffectElement.style,
					gradientSize = min(abs(positionDiff / 8) - 1, 10);

				if (orientation === "vertical") {
					edgeEffectStyle.top = (edge === "start") ? "0" : "auto";
					edgeEffectStyle.bottom = (edge === "start") ? "auto" : "0";
				} else {
					edgeEffectStyle.left = (edge === "start") ? "0" : "auto";
					edgeEffectStyle.right = (edge === "start") ? "auto" : "0";
				}

				// Saved reference to later avoid unnecessary style manipulations
				widgetInstance._edgeEffectGradientSize = gradientSize;

				edgeEffectStyle.boxShadow = "0 0 0 " + gradientSize + "px " + EDGE_EFFECT_COLOR.replace("{1}", 0.5) + "," +
					"0 0 0 " + (gradientSize * 2) + "px " + EDGE_EFFECT_COLOR.replace("{1}", 0.4) + "," +
					"0 0 0 " + (gradientSize * 3) + "px " + EDGE_EFFECT_COLOR.replace("{1}", 0.3) + "," +
					"0 0 0 " + (gradientSize * 4) + "px " + EDGE_EFFECT_COLOR.replace("{1}", 0.2) + "," +
					"0 0 0 " + (gradientSize * 5) + "px " + EDGE_EFFECT_COLOR.replace("{1}", 0.1) + "";

				return 0;
			}

			function setupScrollview(element) {
				return selectors.getClosestByClass(element, "ui-scroller") || element.parentElement;
			}

			function getScrollView(options, element) {
				var scrollview = null;

				if (options.scrollElement) {
					if (typeof options.scrollElement === "string") {
						scrollview = selectors.getClosestBySelector(element, "." + options.scrollElement);
					} else {
						scrollview = options.scrollElement;
					}
				}

				if (!scrollview) {
					scrollview = setupScrollview(element);
				}

				return scrollview;
			}

			prototype._build = function (element) {
				var self = this,
					ui = self._ui,
					classes = SimpleVirtualList.classes,
					options = self.options,
					scrollview,
					orientation;

				//Prepare element
				element.classList.add(classes.uiVirtualListContainer);

				//Set orientation, default vertical scrolling is allowed
				orientation = options.orientation.toLowerCase() === "horizontal" ? "horizontal" : "vertical";

				scrollview = getScrollView(options, element);

				ui.scrollview = scrollview;
				options.orientation = orientation;

				return element;
			};

			prototype._buildList = function () {
				var self = this,
					listItem,
					ui = self._ui,
					scrollviewWidget,
					options = self.options,
					scrollview = self._ui.scrollview,
					sizeProperty = options.orientation === "vertical" ? "height" : "width",
					list = self.element,
					childElementType = (list.tagName === "UL" || list.tagName === "OL") ? "li" : "div",
					numberOfItems = self._numberOfItems,
					content = selectors.getClosestBySelector(list, ".ui-content").getBoundingClientRect(),
					elementRect = null,
					i,
					scrollInitSize = [].reduce.call(scrollview.children, function (previousValue, currentNode) {
						return previousValue + currentNode.getBoundingClientRect()[sizeProperty];
					}, 0),
					circle = ns.support.shape.circle;

				scrollviewWidget = ns.engine.getBinding(selectors.getClosestBySelector(list,
					".ui-page"), "Scrollview");
				if (scrollviewWidget) {
					scrollviewWidget.option("bouncingEffect", false);
					self._scrollviewWidget = scrollviewWidget;
					options.edgeEffect = function (positionDiff, orientation, edge) {
						scrollviewWidget.showBouncingEffect(edge);
					};
				}

				if (options.dataLength < numberOfItems) {
					numberOfItems = options.dataLength;
				}

				for (i = 0; i < numberOfItems; ++i) {
					listItem = document.createElement(childElementType);
					self._updateListItem(listItem, i);
					list.appendChild(listItem);
					elementRect = self.element.getBoundingClientRect();
					if (elementRect[sizeProperty] < content[sizeProperty]) {
						numberOfItems++;
					}
				}

				if (options.snap && circle) {
					self._snapListviewWidget = ns.engine.instanceWidget(list, "SnapListview", options.snap);
				}

				elementRect = self.element.getBoundingClientRect();
				self._itemSize = numberOfItems > 0 ? Math.round(elementRect[sizeProperty] / numberOfItems) : 0;
				self._numberOfItems = numberOfItems;
				self._containerSize = content[sizeProperty];
				self._numberOfVisibleElements = Math.ceil(content[sizeProperty] / self._itemSize);

				utilScrolling.enable(scrollview, options.orientation === "horizontal" ? "x" : "y", true);
				if (options.infinite) {
					utilScrolling.setMaxScroll(null);
				} else {
					utilScrolling.enableScrollBar();
					if (scrollview.classList.contains("ui-scroller")) {
						utilScrolling.setMaxScroll((options.dataLength + 1) * self._itemSize + scrollInitSize);
					} else {
						utilScrolling.setMaxScroll(options.dataLength * self._itemSize);
					}
				}
				if (options.snap && circle) {
					utilScrolling.setSnapSize(self._itemSize);
				}

				// Add default edge effect
				// @TODO consider changing to :after and :before
				if (options.edgeEffect === defaultEdgeEffect) {
					ui.edgeEffect = document.createElement("div");
					ui.edgeEffect.classList.add(classes.edgeEffect, "orientation-" + options.orientation);

					ui.scrollview.appendChild(ui.edgeEffect);
				}

				utilScrolling.setBounceBack(true);
			};

			prototype._updateListItem = function (element, index) {
				element.setAttribute("data-index", index);
				this.options.listItemUpdater(element, index);
			};

			prototype._refresh = function () {
				var self = this;

				self._buildList();
				if (self._snapListviewWidget) {
					self._snapListviewWidget.refresh();
				}
				self.trigger("draw");
			};

			prototype.draw = function () {
				this.refresh();
			};

			prototype.scrollTo = function (position) {
				utilScrolling.scrollTo(-position);
			};

			prototype.scrollToIndex = function (index) {
				this.scrollTo(Math.floor(this._itemSize * index));
			};

			function filterElement(index, element) {
				return element.getAttribute("data-index") === "" + index;
			}

			function filterNextElement(nextIndex, element, index) {
				return index > nextIndex;
			}

			function filterFreeElements(map, element) {
				return map.indexOf(element) === -1;
			}

			function _updateList(self, event) {
				var list = self.element,
					itemSize = self._itemSize,
					options = self.options,
					beginProperty = options.orientation === "vertical" ? "scrollTop" : "scrollLeft",
					scrollBegin = event.detail && event.detail[beginProperty],
					ui = self._ui,
					scrollChildStyle = ui.scrollview.firstElementChild.style,
					fromIndex = 0,
					dataLength = options.dataLength,
					map = [],
					freeElements,
					numberOfItems = self._numberOfItems,
					i = 0,
					infinite = options.infinite,
					currentIndex = 0,
					listItem,
					correction = 0,
					scroll = {
						scrollTop: 0,
						scrollLeft: 0
					},
					inBoundsDiff = 0,
					nextElement,
					j = 0;

				if (options.edgeEffect) {
					if (!event.detail.inBounds) {
						inBoundsDiff = scrollBegin < 0 ? scrollBegin : (scrollBegin + self._containerSize) - (options.dataLength * self._itemSize);

						scrollBegin = scrollBegin - inBoundsDiff + options.edgeEffect(inBoundsDiff, // position diff
							options.orientation, // orientation
							(scrollBegin < 0) ? "start" : "end", // edge
							scrollBegin, // raw position
							self);

					} else if (self._edgeEffectGradientSize > 0) {
						// In some rare cases gradient in default edge effect may stay greater than 0
						// eg. fast flicking down and up without touchend
						(ui.edgeEffect || ui.scrollview.querySelector("." + classes.edgeEffect)).style.boxShadow = "none";
						self._edgeEffectGradientSize = 0;
					} else {
						if (self._scrollviewWidget) {
							self._scrollviewWidget.hideBouncingEffect();
						}
					}
				}

				if (scrollBegin !== undefined) {
					self._scrollBegin = scrollBegin;
					currentIndex = floor(scrollBegin / self._itemSize);
					if (currentIndex !== floor(self._scrollBeginPrev / self._itemSize) && currentIndex >= 0) {
						if (scrollBegin < self._itemSize) {
							fromIndex = 0;
							correction = 0;
						} else if (currentIndex > (dataLength - numberOfItems) && !infinite) {
							fromIndex = dataLength - numberOfItems;
							correction = itemSize * (currentIndex - fromIndex);
						} else {
							fromIndex = currentIndex - 1;
							correction = itemSize;
						}

						// Get elements which are currently presented
						for (i = fromIndex; i < fromIndex + numberOfItems; ++i) {
							map[i - fromIndex] = filter.call(list.children, filterElement.bind(null, i % dataLength))[0];
						}

						// Get elements that should be changed
						freeElements = filter.call(list.children, filterFreeElements.bind(null, map));

						for (i = fromIndex + numberOfItems - 1; i >= fromIndex; --i) {
							j = i % dataLength;
							if ((i >= 0 && i < dataLength) || infinite) {

								// if checked element is not presented
								if (!map[i - fromIndex]) {
									// get first free element
									listItem = freeElements.shift();
									map[i - fromIndex] = listItem;
									self._updateListItem(listItem, j);

									// Get the desired position for the element
									if (i - fromIndex === numberOfItems - 1 || (j < fromIndex && (scrollBegin > self._scrollBeginPrev))) {
										list.appendChild(listItem);
									} else {
										nextElement = map.filter(filterNextElement.bind(null, i - fromIndex))[0];
										if (!nextElement) {
											list.insertBefore(listItem, list.firstElementChild);
										} else {
											list.insertBefore(listItem, nextElement);
										}
									}
								}
							}
						}
						scroll[beginProperty] = correction + scrollBegin % self._itemSize;
					} else {
						// If we are somewhere in the middle of the list
						if (scrollBegin >= 0) {
							if (scrollBegin < self._itemSize) {
								scroll[beginProperty] = scrollBegin % itemSize;
							} else if (currentIndex > (dataLength - numberOfItems) && (!infinite)) {
								fromIndex = dataLength - numberOfItems;
								correction = itemSize * (currentIndex - fromIndex);
								scroll[beginProperty] = correction + scrollBegin % itemSize;
							} else {
								scroll[beginProperty] = itemSize + scrollBegin % itemSize;
							}
						} else {
							// In case we scroll to content before the list
							scroll[beginProperty] = scrollBegin;
						}
					}
					scrollChildStyle.webkitTransform = "translate(" + (-scroll.scrollLeft) + "px, " + (-scroll.scrollTop) + "px)";

					self._scrollBeginPrev = scrollBegin;
					if (self._snapListviewWidget) {
						self._snapListviewWidget.refresh();
					}
				}
			}

			prototype._bindEvents = function () {
				var scrollEventBound = _updateList.bind(null, this),
					scrollview = this._ui.scrollview;

				if (scrollview) {
					scrollview.addEventListener("scroll", scrollEventBound, false);
					this._scrollEventBound = scrollEventBound;
				}

			};

			prototype._destroy = function () {
				utilScrolling.disable();
			};

			prototype.setListItemUpdater = function (updateFunction) {
				this.options.listItemUpdater = updateFunction;
				this.refresh();
			};

			SimpleVirtualList.prototype = prototype;

			ns.engine.defineWidget(
				"VirtualListviewSimple",
				// empty selector because widget require manual build
				"",
				["draw", "setListItemUpdater", "scrollTo", "scrollToIndex"],
				SimpleVirtualList,
				"",
				true
			);
			ns.widget.core.VirtualListviewSimple = SimpleVirtualList;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return SimpleVirtualList;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
