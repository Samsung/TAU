/*global window, ns, define, Event, console */
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
 * # Swipe List
 * Shows a list where you can swipe horizontally through a list item to perform a specific task.
 *
 * The swipe list widget shows on the screen a list where you can swipe horizontally through a list item to activate a specific feature or perform a specific task. For example, you can swipe a contact in a contact list to call them or to open a message editor in order to write them a message.
 *
 * The following table describes the supported swipe list options.
 *
 *      @example
 *         <div class="ui-content">
 *             <!--List items that can be swiped-->
 *             <ul class="ui-listview ui-swipelist-list">
 *                 <li>Andrew</li>
 *                 <li>Bill</li>
 *                 <li>Christina</li>
 *                 <li>Daniel</li>
 *                 <li>Edward</li>
 *                 <li>Peter</li>
 *                 <li>Sam</li>
 *                 <li>Tom</li>
 *             </ul>
 *             <!--Swipe actions-->
 *             <div class="ui-swipelist">
 *                 <div class="ui-swipelist-left">
 *                     <div class="ui-swipelist-icon"></div>
 *                     <div class="ui-swipelist-text">Calling</div>
 *                 </div>
 *                 <div class="ui-swipelist-right">
 *                     <div class="ui-swipelist-icon"></div>
 *                     <div class="ui-swipelist-text">Message</div>
 *                 </div>
 *             </div>
 *         </div>
 *         <script>
 *             (function () {
 *                 var page = document.getElementById("swipelist"),
 *                         listElement = page.getElementsByClassName("ui-swipelist-list", "ul")[0],
 *                         swipeList;
 *                 page.addEventListener("pageshow", function () {
 *                     // Make swipe list object
 *                     var options = {
 *                         left: true,
 *                         right: true
 *                     };
 *                     swipeList = new tau.widget.SwipeList(listElement, options);
 *                 });
 *                 page.addEventListener("pagehide", function () {
 *                     // Release object
 *                     swipeList.destroy();
 *                 });
 *             })();
 *         </script>
 * @class ns.widget.wearable.SwipeList
 * @since 2.2
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/event",
			"../../../../core/event/gesture/Drag",
			"../../../../core/event/gesture/Swipe",
			"../../../../core/util/selectors",
			"../../../../core/util/DOM",
			"../../../../core/widget/BaseWidget",
			"../../../../core/widget/core/Page",
			"../wearable"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var gesture = ns.event.gesture,
				utilsEvents = ns.event,
				engine = ns.engine,
				dom = ns.util.DOM,
				selectors = ns.util.selectors,

				eventType = {
					/**
					 * Triggered when a left-to-right swipe is completed.
					 * @event swipelist.left
					 * @member ns.widget.wearable.SwipeList
					 */
					LEFT: "swipelist.left",
					/**
					 * Triggered when a right-to-left swipe is completed.
					 * @event swipelist.right
					 * @member ns.widget.wearable.SwipeList
					 */
					RIGHT: "swipelist.right"
				},

				SwipeList = function () {
					/**
					 * SwipeList's container.
					 * @property {?HTMLElement} [container=null]
					 * @member ns.widget.wearable.SwipeList
					 */
					this.container = null;

					/**
					 * SwipeList's element.
					 * @property {?HTMLElement} [swipeElement=null]
					 * @member ns.widget.wearable.SwipeList
					 */
					this.swipeElement = null;
					/**
					 * Left element of widget.
					 * @property {?HTMLElement} [swipeLeftElement=null]
					 * @member ns.widget.wearable.SwipeList
					 */
					this.swipeLeftElement = null;
					/**
					 * Right element of widget.
					 * @property {?HTMLElement} [swipeRightElement=null]
					 * @member ns.widget.wearable.SwipeList
					 */
					this.swipeRightElement = null;

					/**
					 * Style of SwipeList's element.
					 * @property {?Object} [swipeElementStyle=null]
					 * @member ns.widget.wearable.SwipeList
					 */
					this.swipeElementStyle = null;
					/**
					 * Style of left element of widget.
					 * @property {?Object} [swipeLeftElementStyle=null]
					 * @member ns.widget.wearable.SwipeList
					 */
					this.swipeLeftElementStyle = null;
					/**
					 * Style of right element of widget.
					 * @property {?Object} [swipeRightElementStyle=null]
					 * @member ns.widget.wearable.SwipeList
					 */
					this.swipeRightElementStyle = null;

					/**
					 * Active element of widget.
					 * @property {?HTMLElement} [activeElement=null]
					 * @member ns.widget.wearable.SwipeList
					 */
					this.activeElement = null;
					/**
					 * Target of swipe event.
					 * @property {?HTMLElement} [activeTarget=null]
					 * @member ns.widget.wearable.SwipeList
					 */
					this.activeTarget = null;

					/**
					 * Function calls on destroying.
					 * @property {?Function} [resetLayoutCallback=null]
					 * @member ns.widget.wearable.SwipeList
					 */
					this.resetLayoutCallback = null;
					this.options = {};

					this._interval = 0;

					this._cancelled = false;
					this._dragging = false;
					this._animating = false;

				},
				prototype = new ns.widget.BaseWidget(),

				blockEvent = function (event) {
					event.preventDefault();
				};

			prototype._configure = function () {

				/**
				 * Options for widget
				 * @property {Object} options
				 * @property {boolean} [options.left=false] Set to true to allow swiping from left to right.
				 * @property {boolean} [options.right=false] Set to true to allow swiping from right to left.
				 * @property {number} [options.threshold=10] Define the threshold (in pixels) for the minimum swipe movement which allows the swipe action to appear.
				 * @property {number} [options.animationThreshold=150] Define the threshold (in pixels) for the minimum swipe movement that allows a swipe animation (with a color change) to be shown. The animation threshold is usually the threshold for the next operation after the swipe.
				 * @property {number} [options.animationDuration=200] Define the swipe list animation duration. Do not change the default value, since it has been defined to show a complete color change.
				 * @property {number} [options.animationInterval=8] Define the swipe list animation interval. The animation is called with the requestAnimationFrame() method once every 1/60 seconds. The interval determines how many coordinates the animation proceeds between each call. The animation ends when the coordinates reach the value defined as animationDuration. This option basically allows you to control the speed of the animation.
				 * @property {string} [options.ltrStartColor=""] Define the start color for the left-to-right swipe.
				 * @property {string} [options.ltrEndColor=""] Define the end color for the left-to-right swipe.
				 * @property {string} [options.rtlStartColor=""] Define the start color for the right-to-left swipe.
				 * @property {string} [options.rtlEndColor=""] Define the end color for the right-to-left swipe.
				 * @property {?HTMLElement} [options.container=null] Define container of widget.
				 * @property {string} [options.swipeTarget="li"] Selector for swipe list
				 * @property {string} [options.swipeElement=".ui-swipelist"] Selector for swipe list container
				 * @property {string} [options.swipeLeftElement=".ui-swipelist-left"] Selector for swipe left container
				 * @property {string} [options.swipeRightElement=".ui-swipelist-right"] Selector for swipe right container
				 * @member ns.widget.wearable.SwipeList
				 */
				this.options = {
					threshold: 10,
					animationThreshold: 150,
					animationDuration: 200,
					animationInterval: 8,

					container: null,

					swipeTarget: "li",
					swipeElement: ".ui-swipelist",
					swipeLeftElement: ".ui-swipelist-left",
					swipeRightElement: ".ui-swipelist-right",

					ltrStartColor: "",
					ltrEndColor: "",
					rtlStartColor: "",
					rtlEndColor: ""
				};
			};

			prototype._init = function (element) {
				var page = selectors.getClosestBySelector(element, "." + ns.widget.core.Page.classes.uiPage),
					options = this.options,
					swipeLeftElementBg,
					swipeRightElementBg,
					rgbStringRgExp = /rgb\(([0-9]+), ([0-9]+), ([0-9]+)\)/g;

				if (options.container) {
					this.container = page.querySelector(options.container);
				} else {
					this.container = element.parentNode;
				}

				this.scrollableElement = selectors.getScrollableParent(element);
				if (!this.scrollableElement) {
					this.scrollableElement = this.container;
				}
				this.swipeElement = page.querySelector(options.swipeElement);
				this.swipeLeftElement = options.swipeLeftElement ? page.querySelector(options.swipeLeftElement) : undefined;
				this.swipeRightElement = options.swipeRightElement ? page.querySelector(options.swipeRightElement) : undefined;

				if (this.swipeElement) {
					this.swipeElementStyle = this.swipeElement.style;
					this.swipeElementStyle.display = "none";
					this.swipeElementStyle.background = "transparent";
					this.swipeElementStyle.width = this.scrollableElement.offsetWidth + "px";
					this.swipeElementStyle.height = this.scrollableElement.offsetHeight + "px";
				}

				if (this.swipeLeftElement) {
					this.swipeLeftElementStyle = this.swipeLeftElement.style;
					this.swipeLeftElementStyle.display = "none";
					// Get background-color value for swipe left element
					swipeLeftElementBg = this.swipeLeftElement ? dom.getCSSProperty(this.swipeLeftElement, "background-image").match(rgbStringRgExp) : undefined;
				}

				if (this.swipeRightElement) {
					this.swipeRightElementStyle = this.swipeRightElement.style;
					this.swipeRightElementStyle.display = "none";
					// Get background-color value for swipe right element
					swipeRightElementBg = this.swipeRightElement ? dom.getCSSProperty(this.swipeRightElement, "background-image").match(rgbStringRgExp) : undefined;
				}

				//>>excludeStart("tauDebug", pragmas.tauDebug);
				if (!swipeLeftElementBg && !swipeRightElementBg) {
					ns.error("swipeLeftElement and swipeRightElement must have background style in tau.css! (ex. .ui-swipe-left { background: -webkit-linear-gradient(left, <startColor> 0%, <endColor> 0%);})");
				}
				//>>excludeEnd("tauDebug");

				// Set start/end color: If user set color as option, that color will be used. If not, css based color of swipe will be used.
				if (swipeLeftElementBg) {
					options.ltrStartColor = options.ltrStartColor || swipeLeftElementBg[0];
					options.ltrEndColor = options.ltrEndColor || swipeLeftElementBg[1];
				}
				if (swipeRightElementBg) {
					options.rtlStartColor = options.rtlStartColor || swipeRightElementBg[0];
					options.rtlEndColor = options.rtlEndColor || swipeRightElementBg[1];
				}
				this.resetLayoutCallback = null;
				if (this.swipeElement.parentNode !== this.container) {
					this.resetLayoutCallback = (function (parent, nextSibling, element) {
						return function () {
							try {
								if (nextSibling) {
									parent.insertBefore(element, nextSibling);
								} else {
									parent.appendChild(element);
								}
							} catch (e) {
								element.parentNode.removeChild(element);
							}
						};
					}(this.swipeElement.parentNode, this.swipeElement.nextElementSibling, this.swipeElement));
					this.container.appendChild(this.swipeElement);
				}
			};

			prototype._reset = function () {
				this.container.style.position = "";

				this.swipeElementStyle.display = "";
				this.swipeElementStyle.background = "";
				this.swipeElementStyle.width = "";
				this.swipeElementStyle.height = "";

				this.swipeLeftElementStyle.display = "";
				this.swipeLeftElementStyle.background = "";

				this.swipeRightElementStyle.display = "";
				this.swipeRightElementStyle.background = "";

				if (this.resetLayoutCallback) {
					this.resetLayoutCallback();
				}
				this._unbindEvents();
			};

			prototype._bindEvents = function () {

				ns.event.enableGesture(
					this.element,

					new gesture.Drag({
						threshold: this.options.threshold,
						blockVertical: true
					}),

					new gesture.Swipe({
						orientation: gesture.Orientation.HORIZONTAL
					})
				);

				utilsEvents.on(this.element, "drag dragstart dragend dragcancel swipe", this);
				utilsEvents.on(document, "scroll touchcancel", this);
				utilsEvents.on(this.swipeElement, "touchstart touchmove touchend", blockEvent, false);
			};

			prototype._unbindEvents = function () {
				utilsEvents.off(this.element, "drag dragstart dragend dragcancel swipe", this);
				utilsEvents.off(document, "scroll touchcancel", this);
				utilsEvents.off(this.swipeElement, "touchstart touchmove touchend", blockEvent, false);

				ns.event.disableGesture(this.element);
			};

			prototype.handleEvent = function (event) {
				switch (event.type) {
					case "dragstart":
						this._start(event);
						break;
					case "drag":
						this._move(event);
						break;
					case "dragend":
						this._end(event);
						break;
					case "swipe":
						this._swipe(event);
						break;
					case "dragcancel":
					case "scroll":
						this._cancel();
						break;
				}
			};

			prototype._translate = function (activeElementStyle, translateX, anim) {
				var deltaX = translateX / window.innerWidth * 100,
					self = this,
					fromColor,
					toColor,
					prefix;

				if (this.swipeLeftElement && translateX >= 0) {
					// left
					fromColor = self.options.ltrStartColor;
					toColor = self.options.ltrEndColor;
					prefix = "left";
				} else if (this.swipeRightElement && translateX < 0) {
					fromColor = self.options.rtlStartColor;
					toColor = self.options.rtlEndColor;
					prefix = "right";
					deltaX = Math.abs(deltaX);
				}

				(function animate() {
					activeElementStyle.background = "-webkit-linear-gradient(" + prefix + ", " + fromColor + " 0%, " + toColor + " " + deltaX + "%)";
					if (anim && deltaX < self.options.animationDuration) {
						self._animating = true;
						deltaX += self.options.animationInterval;
						window.webkitRequestAnimationFrame(animate);
					} else if (anim && deltaX >= self.options.animationDuration) {
						self._animating = false;
						self._transitionEnd();
					}
				}());
			};

			prototype._findSwipeTarget = function (element) {
				var selector = this.options.swipeTarget;

				while (element && element.webkitMatchesSelector && !element.webkitMatchesSelector(selector)) {
					element = element.parentNode;
				}
				return element;
			};

			prototype._fireEvent = function (eventName, detail) {
				var target = this.activeTarget || this.listElement;

				utilsEvents.trigger(target, eventName, detail);
			};

			prototype._start = function (e) {
				var gesture = e.detail,
					width,
					height,
					top;

				this._dragging = false;
				this._cancelled = false;

				this.activeTarget = this._findSwipeTarget(gesture.srcEvent.target);

				if (this.activeTarget) {

					width = this.activeTarget.offsetWidth;
					height = this.activeTarget.offsetHeight;
					top = this.activeTarget.offsetTop - this.scrollableElement.scrollTop;

					if (this.swipeLeftElementStyle) {
						this.swipeLeftElementStyle.width = width + "px";
						this.swipeLeftElementStyle.height = height + "px";
						this.swipeLeftElementStyle.top = top + "px";
					}
					if (this.swipeRightElementStyle) {
						this.swipeRightElementStyle.width = width + "px";
						this.swipeRightElementStyle.height = height + "px";
						this.swipeRightElementStyle.top = top + "px";
					}

					this._dragging = true;
				}
			};

			prototype._move = function (e) {
				var gestureInfo = e.detail,
					translateX = gestureInfo.estimatedDeltaX,
					activeElementStyle;

				if (!this._dragging || this._cancelled) {
					return;
				}

				if (this.swipeLeftElement && (gestureInfo.direction === gesture.Direction.RIGHT) && translateX >= 0) {
					if (this.swipeRightElementStyle) {
						this.swipeRightElementStyle.display = "none";
					}
					this.activeElement = this.swipeLeftElement;
					activeElementStyle = this.swipeLeftElementStyle;

				} else if (this.swipeRightElement && (gestureInfo.direction === gesture.Direction.LEFT) && translateX < 0) {
					if (this.swipeLeftElementStyle) {
						this.swipeLeftElementStyle.display = "none";
					}
					this.activeElement = this.swipeRightElement;
					activeElementStyle = this.swipeRightElementStyle;
				}

				if (!activeElementStyle) {
					return;
				}

				activeElementStyle.display = "block";
				this.swipeElementStyle.display = "block"; // wrapper element

				this._translate(activeElementStyle, translateX, false);
			};

			prototype._end = function (e) {
				var gesture = e.detail;

				if (!this._dragging || this._cancelled) {
					return;
				}

				if (this.swipeLeftElement && (gesture.estimatedDeltaX > this.options.animationThreshold)) {
					this._fire(eventType.LEFT, e);
				} else if (this.swipeRightElement && (gesture.estimatedDeltaX < -this.options.animationThreshold)) {
					this._fire(eventType.RIGHT, e);
				} else {
					this._hide();
				}

				this._dragging = false;
			};

			prototype._swipe = function (e) {
				var gestureInfo = e.detail;

				if (!this._dragging || this._cancelled) {
					return;
				}

				if (this.swipeLeftElement && (gestureInfo.direction === gesture.Direction.RIGHT)) {
					this._fire(eventType.LEFT, e);
				} else if (this.swipeRightElement && (gestureInfo.direction === gesture.Direction.LEFT)) {
					this._fire(eventType.RIGHT, e);
				} else {
					this._hide();
				}

				this._dragging = false;
			};

			prototype._fire = function (type, e) {
				var gesture = e.detail;

				if (type === eventType.LEFT) {
					this._translate(this.swipeLeftElementStyle, gesture.estimatedDeltaX, true);
				} else if (type === eventType.RIGHT) {
					this._translate(this.swipeRightElementStyle, gesture.estimatedDeltaX, true);
				}
			};

			prototype._transitionEnd = function () {
				this._hide();

				if (this.activeElement === this.swipeLeftElement) {
					this._fireEvent(eventType.LEFT);
				} else if (this.activeElement === this.swipeRightElement) {
					this._fireEvent(eventType.RIGHT);
				}
			};

			prototype._cancel = function () {
				this._dragging = false;
				this._cancelled = true;
				this._hide();
			};

			prototype._hide = function () {
				if (this.swipeElementStyle) {
					this.swipeElementStyle.display = "none";
				}

				if (this.activeElement) {
					this.activeElement.style.display = "none";
				}
			};

			prototype._destroy = function () {
				this._reset();

				this.element = null;
				this.container = null;
				this.swipeElement = null;
				this.swipeLeftElement = null;
				this.swipeRightElement = null;

				this.swipeElementStyle = null;
				this.swipeLeftElementStyle = null;
				this.swipeRightElementStyle = null;

				this.activeElement = null;
				this.activeTarget = null;

				this.startX = null;
				this.options = null;
				this.gesture = null;

				this._cancelled = null;
				this._dragging = null;
				this._animating = null;
			};

			SwipeList.prototype = prototype;

			ns.widget.wearable.SwipeList = SwipeList;

			engine.defineWidget(
				"SwipeList",
				".ui-swipe",
				[],
				SwipeList
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
