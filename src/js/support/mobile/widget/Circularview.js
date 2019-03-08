/*global window, ns, define, ns */
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
 * #Circular View Widget
 * The circular view widget shows a special scroll box which can be scroll in circle.
 *
 * @class ns.widget.mobile.Circularview
 * @extend ns.widget.mobile.BaseWidgetMobile
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/event",
			"../../../core/event/vmouse",
			"../../../core/util/easing",
			"../../../core/util/DOM/css",
			"../../../core/util/selectors",
			"../../../profile/mobile/widget/mobile",
			"../../../profile/mobile/widget/mobile/BaseWidgetMobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var CircularView = function () {
					this.options = {
						"fps": 60,
						"scrollDuration": 2000,
						"moveThreshold": 10,
						"moveIntervalThreshold": 150,
						"startEventName": "scrollstart",
						"updateEventName": "scrollupdate",
						"stopEventName": "scrollstop",
						"eventType": ns.event.vmouse.touchSupport ? "touch" : "mouse",
						"delaydedClickSelector": "a, .ui-btn",
						"delayedClickEnabled": false,
						"list": "> *"
					};
					this._callbacks = {};
					this._view = null;
					this._list = null;
					this._items = null;
					this._listItems = null;
					this._moving = false;
					this._lastMouseX = 0;
					this._lastStepX = 0;
					this._transformation = null;
					this._itemWidth = 0;
					this._width = 0;
					this._lastGapSize = 0;

					this._positionX = 0;
					this._positionXOffset = 0;

					this._centerTo = true;
				},
				slice = [].slice,
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				domUtils = ns.util.DOM,
				selectors = ns.util.selectors,
				util = ns.util,
				eventUtils = ns.event,
				engine = ns.engine,
				easingUtils = ns.util.easing,
				dragEvents = {
					"mouse": {
						"start": "mousedown",
						"move": "mousemove",
						"end": "mouseup"
					},
					"touch": {
						"start": "touchstart",
						"move": "touchmove",
						"end": "touchend"
					}
				};

			CircularView.prototype = new BaseWidget();

			function applyLeftItems(circularview, gapSizeDiff) {
				var list = circularview._list,
					items = list.children,
					lastIndex = items.length - 1,
					i;

				for (i = 0; i < gapSizeDiff; i++) {
					list.insertBefore(items[lastIndex], items[0])
					;
				}
			}

			function applyRightItems(circularview, gapSizeDiff) {
				var list = circularview._list,
					items = list.children,
					i;

				for (i = 0; i < gapSizeDiff; i++) {
					list.appendChild(items[0]);
				}
			}

			function updateView(circularview) {
				var viewStyle = circularview._view.style,
					positionX = circularview._positionX,
					positionXOffset = -circularview._positionXOffset,
					lastStepX = circularview._lastStepX,
					translate,
					gapSize = Math.floor((positionX - positionXOffset) / circularview._itemWidth),
					itemWidth = circularview._itemWidth,
					translateX = positionX + positionXOffset - (itemWidth * gapSize),
					gapSizeDiff = Math.abs(gapSize - circularview._lastGapSize);

				if (circularview._centerTo) {
					if (gapSize > 0) { // show more on left side
						applyLeftItems(circularview, gapSizeDiff);
					} else { // show more on right side
						applyRightItems(circularview, gapSizeDiff);
					}
				} else {
					if (gapSizeDiff) {
						if (lastStepX > 0) { // show more on left side
							applyLeftItems(circularview, gapSizeDiff);
						} else { // show more on right side
							applyRightItems(circularview, gapSizeDiff);
						}
					}
				}
				translate = "translate3d(" + translateX + "px, 0px, 0px)";
				viewStyle.transform =
					viewStyle.webkitTransform =
						viewStyle.mozTransform =
							viewStyle.msTransform =
								viewStyle.oTransform = translate;
				circularview._lastGapSize = gapSize;
			}

			function moveTo(circularview, startTime, changeX, endX, duration) {
				var isCentring = circularview._centerTo,
					elapsed = +new Date() - startTime, // timestamp passed to requestAnimationFrame callback is not stable so we create our own
					timestamp = elapsed > duration ? duration : elapsed,
					easingVal = easingUtils.easeOutQuad(timestamp, 0, 1, duration),
					newPositionX = isCentring ? changeX * easingVal : changeX * (1 - easingVal),
					transformation = circularview._transformation,
					options = circularview.options,
					element = circularview.element;

				eventUtils.trigger(element, options.updateEventName);

				if (!duration || +new Date() > startTime + duration) {
					circularview._positionX = isCentring ? endX : circularview._positionX;
					updateView(circularview);
					transformation = null;
					circularview._centerTo = false;
					eventUtils.trigger(element, options.stopEventName);
				} else if (newPositionX !== endX && isNaN(newPositionX) === false && transformation !== null) { // used isNaN to prevent jslint error, hope that closure will change this to val === val for speedup
					circularview._positionX = isCentring ? newPositionX : circularview._positionX + newPositionX;
					updateView(circularview);
					util.requestAnimationFrame.call(window, transformation);
				} else {
					circularview._positionX = isCentring ? newPositionX : circularview._positionX + newPositionX;
					updateView(circularview);
					circularview._transformation = null;
					circularview._centerTo = false;
					eventUtils.trigger(element, options.stopEventName);
				}

			}

			function handleDragStart(circularview, event) {
				var lastMouseX = event.clientX,
					options = circularview.options,
					element = circularview.element;

				//event.preventDefault();
				//event.stopPropagation();

				if (circularview._moving === true || circularview._transformation !== null) {
					eventUtils.trigger(element, options.stopEventName);
				}

				circularview._moving = true;
				circularview._transformation = null;

				if (circularview.options.eventType === "touch") {
					lastMouseX = event.touches[0].clientX;
				}
				circularview._lastMouseX = lastMouseX;

				eventUtils.trigger(element, options.startEventName);
			}

			function handleDragMove(circularview, event) {
				var stepX = 0,
					mouseX = event.clientX;

				circularview._lastMoveTime = Date.now();

				if (circularview.options.eventType === "touch") {
					mouseX = event.touches[0].clientX;
				}

				if (circularview._moving) {
					stepX = mouseX - circularview._lastMouseX;
					if (stepX !== 0) {
						circularview._positionX += stepX;
						util.requestAnimationFrame.call(window, updateView.bind(null, circularview));
					}
					circularview._lastMouseX = mouseX;
					circularview._lastStepX = stepX;
				}
			}

			function handleDragEnd(circularview) {
				var lastStepX = circularview._lastStepX,
					lastMoveTime = circularview._lastMoveTime,
					position = circularview.getScrollPosition(),
					momentum = lastStepX,
					doScroll = lastMoveTime && (Date.now() - lastMoveTime) <= circularview.options.moveIntervalThreshold;

				circularview._moving = false;

				if (doScroll) {
					circularview._transformation = moveTo.bind(
						null,
						circularview,
						+new Date(),
						momentum,
						position.x + momentum,
						circularview.options.scrollDuration
					);
					util.requestAnimationFrame.call(window, circularview._transformation);
				} else {
					circularview._transformation = null;
					eventUtils.trigger(circularview.element, circularview.options.stopEventName);
				}
			}

			function applyViewItems(circularview) {
				var i,
					items = circularview._listItems,
					itemsLength = items.length,
					fragment = document.createDocumentFragment();

				for (i = 0; i < itemsLength; ++i) {
					fragment.appendChild(items[i]);
				}
				circularview._list.appendChild(fragment);
				updateView(circularview);
			}

			CircularView.classes = {
				"clip": "ui-scrollview-clip",
				"view": "ui-scrollview-view",
				"listCurrent": "current"
			};

			CircularView.prototype._build = function (element) {
				var view = document.createElement("div"),
					list = document.createElement("ul"),
					viewStyle = view.style,
					classes = CircularView.classes,
					sourceListSelector = this.options.list,
					sourceRefNodeIsElement = sourceListSelector.charAt(0) === ">",
					sourceRefNode = sourceRefNodeIsElement ? element : document;

				if (sourceRefNodeIsElement) {
					sourceListSelector = sourceListSelector.replace(/^>\s*/, "");
				}

				// rewrite source to our list
				slice.call(sourceRefNode.querySelectorAll(sourceListSelector)).forEach(function (item) {
					list.appendChild(item);
				});

				element.classList.add(classes.clip);
				view.classList.add(classes.view);

				viewStyle.overflow = "hidden";

				view.appendChild(list);
				element.innerHTML = "";
				element.appendChild(view);

				if (domUtils.getCSSProperty(element, "position") === "static") {
					element.style.position = "relative";
				}

				return element;
			};

			CircularView.prototype._init = function (element) {
				var self = this,
					classes = CircularView.classes,
					view = selectors.getChildrenByClass(element, classes.view)[0],
					list = selectors.getChildrenByTag(view, "ul")[0],
					listItems = [];

				self._list = list;
				// add to array by copy not through children reference
				slice.call(list.children).forEach(function (child) {
					listItems.push(child);
				});
				self._items = listItems;
				self._view = view;

				self._refresh();
			};

			CircularView.prototype._bindEvents = function (element) {
				var self = this,
					callbacks = self._callbacks,
					eventType = self.options.eventType;

				callbacks.dragstart = handleDragStart.bind(null, this);
				callbacks.dragmove = handleDragMove.bind(null, this);
				callbacks.dragend = handleDragEnd.bind(null, this);

				element.addEventListener(dragEvents[eventType].start, callbacks.dragstart, false);
				element.addEventListener(dragEvents[eventType].move, callbacks.dragmove, false);
				element.addEventListener(dragEvents[eventType].end, callbacks.dragend, false);
			};

			CircularView.prototype.getScrollPosition = function () {
				return {
					"x": -this._positionX,
					"y": 0 // compatibility
				};
			};

			CircularView.prototype.scrollTo = function (x, y, duration) {
				var self = this,
					position = self.getScrollPosition(),
					stepX = Math.round(x), // we have to be sure that integers are supplied so we do Math.round on input
					time = +new Date();

				self._transformation = moveTo.bind(
					null,
					this,
					time,
					stepX - (-position.x),
					stepX,
					duration
				);
				util.requestAnimationFrame.call(window, self._transformation);
			};

			CircularView.prototype.centerTo = function (selector, duration) {
				var self = this,
					searched = self._view.querySelector(selector),
					sibling = null,
					siblings = 0,
					itemWidth = self._itemWidth,
					// We need to add a half of element to make it on the center, and
					// additionally one more element due to positionXOffset which have
					// exactly one item width - this is why here we have itemWidth
					// multiplication by 1.5
					center = parseInt(self._width / 2 + (itemWidth * 1.5), 10);

				if (searched) {
					self._centerTo = true;
					sibling = searched.previousSibling;
					while (sibling) {
						++siblings;
						sibling = sibling.previousSibling;
					}
					self.scrollTo(-((siblings * itemWidth) - center), 0, duration);
				}
			};

			CircularView.prototype.reflow = function () {
				var self = this,
					position = this.getScrollPosition();

				self._refresh();
				self.scrollTo(position.x, position.y, self.options.scrollDuration);
			};

			CircularView.prototype.add = function (item) {
				this._items.push(item);
			};

			CircularView.prototype._refresh = function () {
				var self = this,
					element = self.element,
					width = domUtils.getElementWidth(element),
					items = self._items,
					firstItem = items[0],
					filledList = [],
					viewStyle = self._view.style,
					itemWidth,
					itemHeight,
					itemsPerView,
					list = self._list,
					fill,
					fills,
					i,
					len;

				list.innerHTML = "";
				if (!firstItem) {
					return;
				}
				list.appendChild(firstItem);
				itemWidth = domUtils.getElementWidth(items[0]);
				itemHeight = domUtils.getElementHeight(items[0]);

				list.removeChild(firstItem);

				itemsPerView = parseInt(width / itemWidth, 10);

				// fill list
				for (fill = 0, fills = Math.ceil(itemsPerView / items.length) + 1; fill < fills; ++fill) {
					for (i = 0, len = items.length; i < len; ++i) {
						filledList.push(items[i].cloneNode(true));
					}
				}
				filledList.unshift(filledList.pop());

				viewStyle.height = itemHeight + "px";
				viewStyle.width = itemWidth * filledList.length + "px";

				self._listItems = filledList;
				self._itemWidth = itemWidth;
				self._width = width;
				self._itemsPerView = itemsPerView;
				self._positionXOffset = itemWidth;

				applyViewItems(self);
			};

			CircularView.prototype._destroy = function () {
				var self = this,
					element = self.element,
					callbacks = self._callbacks,
					eventType = self.options.eventType;

				if (element) {
					element.removeEventListener(dragEvents[eventType].start, callbacks.dragstart, false);
					element.removeEventListener(dragEvents[eventType].move, callbacks.dragmove, false);
					element.removeEventListener(dragEvents[eventType].end, callbacks.dragend, false);
				}
			};

			// definition
			ns.widget.mobile.Circularview = CircularView;
			engine.defineWidget(
				"Circularview",
				"[data-role='circularview'], .ui-circularview", //@TODO ???
				[
					"getScrollPosition",
					"scrollTo",
					"centerTo",
					"reflow",
					"add"
				],
				CircularView,
				"mobile"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Circularview;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
