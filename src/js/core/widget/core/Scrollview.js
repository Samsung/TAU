/*global window, define, ns*/
/*jslint nomen: true */
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
/**
 * # ScrollView Widget
 * Widgets allows for creating scrollable panes, lists, etc.
 *
 * ## Default selectors
 * All elements with _data-role=content attribute or _.ui-scrollview
 * css class will be changed to ScrollView widgets, unless they specify
 * _data-scroll=none attribute.
 *
 * ### HTML Examples
 *
 * #### Data attribute
 *
 *        @example
 *        <div data-role="page">
 *            <div data-role="content"><!-- this will become scrollview //-->
 *                content data
 *            </div>
 *        </div>
 *
 * #### CSS Class
 *
 *        @example
 *        <div data-role="page">
 *            <div class="ui-content"><!-- this will become scrollview //-->
 *                content data
 *            </div>
 *        </div>
 *
 * ## Manual constructor
 *
 * To create the widget manually you can use 2 different APIs, the TAU
 * API or jQuery API.
 *
 * ### Create scrollview by TAU API
 *
 *        @example
 *        <div data-role="page" id="myPage">
 *            <div data-role="content">
 *                page content
 *            </div>
 *        </div>
 *        <script>
 *            var page = tau.widget.Page(document.getElementById("myPage")),
 *                scrollview = tau.widget.Scrollview(page.ui.content);
 *        </script>
 *
 * ### Create scrollview using jQuery API
 *
 *        @example
 *        <div data-role="page" id="myPage">
 *            <div data-role="content">
 *                page content
 *            </div>
 *        </div>
 *        <script>
 *            $("#myPage > div[data-role='content']").scrollview();
 *        </script>
 *
 * ## Options for Scrollview widget
 *
 * Options can be set using data-* attributes or by passing them to
 * the constructor.
 *
 * There is also a method **option** for changing them after widget
 * creation.
 *
 * jQuery mobile format is also supported.
 *
 * ## Scroll
 *
 * This options specifies of a content element should become Scrollview
 * widget.
 *
 * You can change this by all available methods for changing options.
 *
 * ### By data-scroll attribute
 *
 *        @example
 *        <div data-role="page">
 *            <div data-role="content" data-scroll="none">
 *                content
 *            </div>
 *        </div>
 *
 * ### By config passed to constructor
 *
 *        @example
 *        <div class="myPageClass" data-role="page">
 *            <div data-role="content">
 *                content
 *            </div>
 *        </div>
 *        <script>
 *            var contentElement = document.querySelector(".myPageClass > div[data-role=content]");
 *            tau.widget.Scrollview(contentElement, {
 *				"scroll": false
 *			});
 *        </script>
 *
 * ### By using jQuery API
 *
 *        @example
 *        <div class="myPageClass" data-role="page">
 *            <div data-role="content">
 *                content
 *            </div>
 *        </div>
 *        <script>
 *            $(".myPageClass > div[data-role='content']").scrollview({
 *				"scroll": false
 *			});
 *        </script>
 *
 * ## ScrollJumps
 *
 * Scroll jumps are small buttons which allow the user to quickly
 * scroll to top or left
 *
 * You can change this by all available methods for changing options.
 *
 * ### By data-scroll-jump
 *
 *        @example
 *        <div data-role="page">
 *            <div data-role="content" data-scroll-jump="true">
 *                content
 *            </div>
 *        </div>
 *
 * ### By config passed to constructor
 *
 *        @example
 *        <div class="myPageClass" data-role="page">
 *            <div data-role="content">
 *                content
 *            </div>
 *        </div>
 *        <script>
 *            var contentElement = document.querySelector(".myPageClass > div[data-role=content]");
 *            tau.widget.Scrollview(contentElement, {
 *				"scrollJump": true
 *			});
 *        </script>
 *
 * ### By using jQuery API
 *
 *        @example
 *        <div class="myPageClass" data-role="page">
 *            <div data-role="content">
 *                content
 *            </div>
 *        </div>
 *        <script>
 *            $(".myPageClass > div[data-role='content']").scrollview({
 *				"scrollJump": true
 *			});
 *        </script>
 *
 * ## Methods
 *
 * Page methods can be called trough 2 APIs: TAU API and jQuery API
 * (jQuery mobile-like API)
 *
 * @class ns.widget.core.Scrollview
 * @extends ns.widget.BaseWidget
 *
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Grzegorz Osimowicz <g.osimowicz@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 * @author Junhyeon Lee <juneh.lee@samsung.com>
 */
/**
 * Triggered when scrolling operation starts
 * @event scrollstart
 * @member ns.widget.core.Scrollview
 */
/**
 * Triggered when scroll is being updated
 * @event scrollupdate
 * @member ns.widget.core.Scrollview
 */
/**
 * Triggered when scrolling stops
 * @event scrollstop
 * @member ns.widget.core.Scrollview
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../event",
			"../../util",
			"../../util/easing",
			"../../util/DOM/css",
			"../../util/DOM/attributes",
			"../../util/selectors",
			"../../event/orientationchange",
			"../../event/vmouse",
			"../../widget/core/Page",
			"../core", // fetch namespace
			"../BaseWidget",
			"./Page"
			// @todo coreButton
			//"./Button"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				util = ns.util,
				easingUtils = ns.util.easing,
				eventUtils = ns.event,
				DOMUtils = ns.util.DOM,
				selectors = ns.util.selectors,
				currentTransition = null,
				Page = ns.widget.core.Page,
				pageClass = Page.classes.uiPage,
				pageActiveClass = Page.classes.uiPageActive,
				pageEvents = Page.events,
				Scrollview = function () {
					var self = this,
						ui;
					/**
					 * @property {Object} _scrollState Scrollview internal state object
					 * @property {Function} _scrollState.currentTransition Instance transition function
					 * @readonly
					 */

					self._scrollState = {
						currentTransition: null
					};
					/**
					 * @property {number} scrollDuration The time length of the scroll animation
					 * @member ns.widget.core.Scrollview
					 */
					self.scrollDuration = 300;
					self.scrollviewSetHeight = false;
					/**
					 * Scrollview options
					 * @property {Object} options
					 * @property {string} [options.scroll='y'] Scroll direction
					 * @property {boolean} [options.scrollJump=false] Scroll jump buttons flag
					 * @member ns.widget.core.Scrollview
					 */
					self.options = {
						scroll: "y",
						scrollJump: false,
						scrollIndicator: false
					};
					/**
					 * Dictionary for holding internal DOM elements
					 * @property {Object} ui
					 * @property {HTMLElement} ui.view The main view element
					 * @property {HTMLElement} ui.page The main page element
					 * @property {HTMLElement} ui.jumpHorizontalButton Jump left button
					 * @property {HTMLElement} ui.jumpVerticalButton Jump top button
					 * @member ns.widget.core.Scrollview
					 * @readonly
					 */
					ui = self._ui || {};
					ui.view = null;
					ui.page = null;
					ui.jumpHorizontalButton = null;
					ui.jumpVerticalButton = null;
					ui.overflowTop = null;
					ui.overflowBottom = null;
					self._ui = ui;
					/**
					 * Dictionary for holding internal listeners
					 * @property {Object} _callbacks
					 * @property {Function} _callbacks.repositionJumps Refresh jumps listener
					 * @property {Function} _callbacks.jumpTop Top jump button click callback
					 * @property {Function} _callbacks.jumpLeft Left jump button click callback
					 * @member ns.widget.core.Scrollview
					 * @protected
					 * @readonly
					 */
					self._callbacks = {
						repositionJumps: null,
						jumpTop: null,
						jumpBottom: null
					};

					self._timers = {
						scrollIndicatorHide: null
					};
				},
				/**
				 * Dictionary for scrollview css classes
				 * @property {Object} classes
				 * @property {string} [classes.view='ui-scrollview-view'] View main class
				 * @property {string} [classes.clip='ui-scrollview-clip'] Clip main class
				 * @property {string} [classes.jumpTop='ui-scroll-jump-top-bg'] Jump top button background
				 * @property {string} [classes.jumpLeft='ui-scroll-jump-left-bg'] Jump bottom button background
				 * @member ns.widget.core.Scrollview
				 * @static
				 * @readonly
				 */
				classes = {
					view: "ui-scrollview-view",
					clip: "ui-scrollview-clip",
					jumpTop: "ui-scroll-jump-top-bg",
					jumpLeft: "ui-scroll-jump-left-bg",
					indicatorTop: "ui-overflow-indicator-top",
					indicatorBottom: "ui-overflow-indicator-bottom",
					indicatorTopShown: "ui-scrollindicator-top",
					indicatorBottomShown: "ui-scrollindicator-bottom",
					indicatorLeftShown: "ui-scrollindicator-left",
					indicatorRightShown: "ui-scrollindicator-right"
				};

			// Changes static position to relative
			// @param {HTMLElement} view
			function makePositioned(view) {
				if (DOMUtils.getCSSProperty(view, "position") === "static") {
					view.style.position = "relative";
				} else {
					view.style.position = "absolute";
				}
			}

			// Translation animation loop
			// @param {Object} state Scrollview instance state
			// @param {HTMLElement} element
			// @param {number} startTime
			// @param {number} startX
			// @param {number} startY
			// @param {number} translateX
			// @param {number} translateY
			// @param {number} endX
			// @param {number} endY
			// @param {number} duration
			function translateTransition(state, element, startTime, startX, startY, translateX, translateY, endX, endY, duration) {
				var timestamp = (new Date()).getTime() - startTime,
					newX = parseInt(easingUtils.cubicOut(timestamp, startX, translateX, duration), 10),
					newY = parseInt(easingUtils.cubicOut(timestamp, startY, translateY, duration), 10);

				if (element.scrollLeft !== endX) {
					element.scrollLeft = newX;
				}
				if (element.scrollTop !== endY) {
					element.scrollTop = newY;
				}

				if ((newX !== endX || newY !== endY) &&
					(newX >= 0 && newY >= 0) &&
					state.currentTransition) {
					util.requestAnimationFrame(state.currentTransition);
				} else {
					state.currentTransition = null;
				}
			}

			// Translates scroll position directly or with an animation
			// if duration is specified
			// @param {Object} state Scrollview instance state
			// @param {HTMLElement} element
			// @param {number} x
			// @param {number} y
			// @param {number=} [duration]
			function translate(state, element, x, y, duration) {
				if (duration) {
					state.currentTransition = translateTransition.bind(
						null,
						state,
						element,
						(new Date()).getTime(),
						element.scrollLeft,
						element.scrollTop,
						x,
						y,
						element.scrollLeft + x,
						element.scrollTop + y,
						duration
					);
					util.requestAnimationFrame(state.currentTransition);
				} else {
					if (x) {
						element.scrollLeft = element.scrollLeft + x;
					}
					if (y) {
						element.scrollTop = element.scrollTop + y;
					}
				}
			}

			// Refresh jumpTop jumpLeft buttons
			// @param {ns.widget.core.Scrollview} self
			function repositionJumps(self) {
				var ui = self._ui,
					horizontalJumpButton = ui.jumpHorizontalButton,
					verticalJumpButton = ui.jumpVerticalButton,
					offsets = horizontalJumpButton || verticalJumpButton ? DOMUtils.getElementOffset(self.element) : null; // don't calc when not used

				if (horizontalJumpButton) {
					horizontalJumpButton.style.left = offsets.left + "px";
				}

				if (verticalJumpButton) {
					verticalJumpButton.style.top = offsets.top + "px";
				}
			}

			Scrollview.classes = classes;

			Scrollview.prototype = new BaseWidget();

			/**
			 * Builds the widget
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @method _build
			 * @protected
			 * @member ns.widget.core.Scrollview
			 */
			Scrollview.prototype._build = function (element) {
				//@TODO wrap element's content with external function
				var self = this,
					ui = self._ui,
					view = selectors.getChildrenByClass(element, classes.view)[0] || document.createElement("div"),
					node,
					child = element.firstChild,
					options = self.options,
					direction = options.scroll,
					jumpButton,
					jumpBackground;

				view.className = classes.view;

				while (child) {
					node = child;
					child = child.nextSibling;
					if (view !== node) {
						view.appendChild(node);
					}
				}

				if (view.parentNode !== element) {
					element.appendChild(view);
				}

				// setting view style
				makePositioned(view);

				element.classList.add(classes.clip);

				// Adding ui-content class for the proper styling with CE
				element.classList.add("ui-content");

				self._setClipOverflowStyle(element);

				if (options.scrollJump) {
					if (direction.indexOf("x") > -1) {
						jumpBackground = document.createElement("div");
						jumpBackground.className = classes.jumpLeft;
						jumpButton = document.createElement("div");

						jumpBackground.appendChild(jumpButton);
						element.appendChild(jumpBackground);
						engine.instanceWidget(
							jumpButton,
							"Button",
							{
								"icon": "scrollleft",
								"style": "box"
							}
						);
						ui.jumpHorizontalButton = jumpBackground;
					}

					if (direction.indexOf("y") > -1) {
						jumpBackground = document.createElement("div");
						jumpBackground.className = classes.jumpTop;
						jumpButton = document.createElement("div");

						jumpBackground.appendChild(jumpButton);
						element.appendChild(jumpBackground);
						engine.instanceWidget(
							jumpButton,
							"Button",
							{
								"icon": "scrolltop",
								"style": "box"
							}
						);
						ui.jumpVerticalButton = jumpBackground;
					}
				}

				ui.view = view;

				// add scroll indicators
				if (options.scrollIndicator) {
					self._addOverflowIndicator(element);
				}

				return element;
			};

			/**
			 * Sets overflow property for clip element accordingly to scrolling direction
			 * @method _setClipOverflowHidden
			 * @protected
			 * @member ns.widget.core.Scrollview
			 */
			Scrollview.prototype._setClipOverflowStyle = function (element) {
				var self = this,
					direction = self.options.scroll,
					clipStyle;

				element = element || self.element;
				clipStyle = element.style;

				switch (direction) {
					case "x":
						clipStyle.overflowX = "scroll";
						break;
					case "xy":
						clipStyle.overflow = "scroll";
						break;
					default:
						clipStyle.overflowY = "auto";
						break;
				}
			}

			/**
			 * Sets overflow hidden style for clip element
			 * @method _setClipOverflowHidden
			 * @protected
			 * @member ns.widget.core.Scrollview
			 */
			Scrollview.prototype._setClipOverflowHidden = function (element) {
				var self = this,
					direction = self.options.scroll,
					clipStyle;

				element = element || self.element;
				clipStyle = element.style;

				switch (direction) {
					case "x":
						clipStyle.overflowX = "hidden";
						break;
					case "xy":
						clipStyle.overflow = "hidden";
						break;
					default:
						clipStyle.overflowY = "hidden";
						break;
				}
			}

			/**
			 * Inits widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Scrollview
			 */
			Scrollview.prototype._init = function (element) {
				var ui = this._ui,
					page = ui.page;

				if (!ui.view) {
					ui.view = selectors.getChildrenByClass(element, classes.view)[0];
				}

				if (!page) {
					page = selectors.getClosestByClass(element, pageClass);
					if (page) {
						ui.page = page;
						if (page.classList.contains(pageActiveClass) && this.options.scrollJump) {
							repositionJumps(this);
						}
					}
				}
			};

			/**
			 * Adds overflow indicators
			 * @param {HTMLElement} clip
			 * @method _addOverflowIndicator
			 * @protected
			 * @member ns.widget.core.Scrollview
			 */
			Scrollview.prototype._addOverflowIndicator = function (clip) {
				var ui = this._ui,
					indicatorTop = document.createElement("div"),
					indicatorBottom = document.createElement("div");

				indicatorTop.className = classes.indicatorTop;
				indicatorBottom.className = classes.indicatorBottom;

				clip.appendChild(indicatorTop);
				clip.appendChild(indicatorBottom);

				ui.overflowTop = indicatorTop;
				ui.overflowBottom = indicatorBottom;
			};

			/**
			 * Clear classes and styles of indicators
			 * @param {HTMLElement} element
			 * @method _clearIndicator
			 * @protected
			 * @member ns.widget.core.Scrollview
			 */
			Scrollview.prototype._clearIndicator = function (element) {
				var clipClasses = element.classList,
					topIndicator = selectors.getChildrenByClass(element, classes.indicatorTop)[0],
					bottomIndicator = selectors.getChildrenByClass(element, classes.indicatorBottom)[0];

				clipClasses.remove(classes.indicatorTopShown);
				clipClasses.remove(classes.indicatorBottomShown);
				clipClasses.remove(classes.indicatorRightShown);
				clipClasses.remove(classes.indicatorLeftShown);
				topIndicator.style = "";
				bottomIndicator.style = "";
			}

			/**
			 * Set top and bottom indicators
			 * @param {HTMLElement} clip
			 * @param {Object} options
			 * @method _setTopAndBottomIndicators
			 * @protected
			 * @member ns.widget.core.Scrollview
			 */
			Scrollview.prototype._setTopAndBottomIndicators = function (clip, options) {
				var self = this,
					topIndicator = self._ui.overflowTop,
					bottomIndicator = self._ui.overflowBottom,
					style;

				// set top indicator
				if (topIndicator) {
					style = topIndicator.style;
					style.width = options.width + "px";
					style.top = options.clipTop + "px";
					style.backgroundColor = options.color;
				}
				if (bottomIndicator) {
					// set bottom indicator
					style = bottomIndicator.style;
					style.width = options.width + "px";
					style.top = options.clipTop + options.clipHeight - DOMUtils.getElementHeight(bottomIndicator) + "px";
					style.backgroundColor = options.color;
				}
			};

			/**
			 * Show scroll indicators.
			 * @method _showScrollIndicator
			 * @protected
			 * @member ns.widget.core.Scrollview
			 */
			Scrollview.prototype._showScrollIndicator = function () {
				var self = this,
					clip = self.element,
					view = self._ui.view,
					scrollTop = clip.scrollTop,
					clipHeight = DOMUtils.getElementHeight(clip),
					clipOffset = DOMUtils.getElementOffset(clip),
					viewHeight = DOMUtils.getElementHeight(view),
					viewWidth = DOMUtils.getElementWidth(view),
					viewOffset = DOMUtils.getElementOffset(view);

				self._clearIndicator(clip);

				switch (self.options.scroll) {
					case "x":
					case "xy":
						// @todo
						break;
					default:
						self._setTopAndBottomIndicators(clip, {
							clipTop: clipOffset.top,
							clipHeight: clipHeight,
							width: viewWidth,
							color: window.getComputedStyle(clip).backgroundColor
						});
						if (viewOffset.top - scrollTop < clipOffset.top) {
							// the top is not visible
							clip.classList.add(classes.indicatorTopShown);
						}
						if (viewOffset.top - scrollTop + viewHeight > clipOffset.top + clipHeight) {
							// the bottom is not visible
							clip.classList.add(classes.indicatorBottomShown);
						}
				}
			};

			/**
			 * Hide scroll indicators.
			 * @method _hideScrollIndicator
			 * @protected
			 * @member ns.widget.core.Scrollview
			 */
			Scrollview.prototype._hideScrollIndicator = function () {
				var self = this,
					timers = self._timers,
					timer = timers.scrollIndicatorHide;

				if (timer) {
					window.clearTimeout(timer);
				}
				timers.scrollIndicatorHide = window.setTimeout(function () {
					self._clearIndicator(self.element);
				}, 1500);
			};

			/**
			 * Scrolls to specified position
			 *
			 * This method give possibility to scroll on Scrollview widget form JS interface of widget.
			 *
			 * <mobile>
			 * On mobile profile you can use method in jQuery style.
			 * </mobile>
			 *
			 * If duration is set then scroll will be animated in given time period.
			 *
			 * <wearable>
			 * On wearable profile Scrollview widget isn't build automatically. Before using method scrollTo, you need
			 * create widget on content of page.
			 * </wearable>
			 * ### Example usage with TAU API
			 *
			 *		@example mobile wearable
			 *		<div class="myPageClass" data-role="page">
			 *			<div data-role="content" data-scroll="y">
			 *				content
			 *			</div>
			 *		</div>
			 *		<script>
			 *			var scrollview = tau.widget.Scrollview(document.querySelector(".myPageClass > div[data-role=content]"));
			 *			scrollview.scrollTo(0, 200, 1000); // scroll to 200px vertical with 1s animation
			 *		</script>
			 *
			 * ### Example usage with jQuery API
			 *
			 *		@example mobile
			 *		<div class="myPageClass" data-role="page">
			 *			<div data-role="content" data-scroll="y">
			 *				content
			 *			</div>
			 *		</div>
			 *		<script>
			 *			var element = $(".myPageClass > div[data-role=content]"));
			 *			element.scrollview();
			 *			element.scrollview("scrollTo", 0, 200, 1000); // scroll to 200px vertical with 1s animation
			 *		</script>
			 *
			 * @param {number} x
			 * @param {number} y
			 * @param {number=} [duration]
			 * @method scrollTo
			 * @member ns.widget.core.Scrollview
			 */
			Scrollview.prototype.scrollTo = function (x, y, duration) {
				var element = this.element;

				this.translateTo(x - element.scrollLeft, y - element.scrollTop, duration);
			};

			/**
			 * Translates the scroll to specified position
			 *
			 * ### Example usage with TAU API
			 *
			 *        @example
			 *        <div class="myPageClass" data-role="page">
			 *            <div data-role="content" data-scroll="y">
			 *                content
			 *            </div>
			 *        </div>
			 *        <script>
			 *            var scrollview = tau.widget.Scrollview(document.querySelector(".myPageClass > div[data-role=content]"));
			 *            scrollview.translateTo(0, 200, 1000); // scroll forward 200px in vertical direction with 1s animation
			 *        </script>
			 *
			 * ### Example usage with jQuery API
			 *
			 *        @example
			 *        <div class="myPageClass" data-role="page">
			 *            <div data-role="content" data-scroll="y">
			 *                content
			 *            </div>
			 *        </div>
			 *        <script>
			 *            var element = $(".myPageClass > div[data-role=content]"));
			 *            element.scrollview();
			 *            element.scrollview("translateTo", 0, 200, 1000); // scroll forward 200px in vertical direction with 1s animation
			 *        </script>
			 *
			 * @param {number} x
			 * @param {number} y
			 * @param {number=} [duration]
			 * @method translateTo
			 * @member ns.widget.core.Scrollview
			 */
			Scrollview.prototype.translateTo = function (x, y, duration) {
				translate(this._scrollState, this.element, x, y, duration);
			};

			/**
			 * Ensures that specified element is visible in the
			 * clip area
			 *
			 * ### Example usage with TAU API
			 *
			 *        @example
			 *        <div class="myPageClass" data-role="page">
			 *            <div data-role="content" data-scroll="y">
			 *                content
			 *                <div class="testElementClass">some data</div>
			 *            </div>
			 *        </div>
			 *        <script>
			 *            var scrollview = tau.widget.Scrollview(document.querySelector(".myPageClass > div[data-role=content]")),
			 *                testElement = document.querySelector(".testElementClass");
			 *            scrollview.ensureElementIsVisible(testElement);
			 *        </script>
			 *
			 * ### Example usage with jQuery API
			 *
			 *        @example
			 *        <div class="myPageClass" data-role="page">
			 *            <div data-role="content" data-scroll="y">
			 *                content
			 *                <div class="testElementClass">some data</div>
			 *            </div>
			 *        </div>
			 *        <script>
			 *            var element = $(".myPageClass > div[data-role=content]")),
			 *                testElement = $(".testElementClass");
			 *            element.scrollview();
			 *            element.scrollview("ensureElementIsVisible", testElement);
			 *        </script>
			 *
			 * @param {HTMLElement} element
			 * @method ensureElementIsVisible
			 * @member ns.widget.core.Scrollview
			 */
			Scrollview.prototype.ensureElementIsVisible = function (element) {
				var clip = this.element,
					clipHeight = DOMUtils.getElementHeight(clip),
					clipWidth = DOMUtils.getElementWidth(clip),
					clipTop = 0,
					clipBottom = clipHeight,
					elementHeight = DOMUtils.getElementHeight(element),
					elementWidth = DOMUtils.getElementWidth(element),
					elementTop = 0,
					elementBottom,
					elementFits = clipHeight >= elementHeight && clipWidth >= elementWidth,
					anchor,
					anchorPositionX,
					anchorPositionY,
					parent,
					findPositionAnchor = function (input) {
						var id = input.getAttribute("id"),
							tagName = input.tagName.toLowerCase();

						if (id && ["input", "textarea", "button"].indexOf(tagName) > -1) {
							return input.parentNode.querySelector("label[for=" + id + "]");
						}

						return null;
					},
					_true = true;

				parent = element.parentNode;
				while (parent && parent !== clip) {
					elementTop += parent.offsetTop;
					//elementLeft += parent.offsetLeft;
					parent = parent.parentNode;
				}
				elementBottom = elementTop + elementHeight;
				//elementRight = elementLeft + elementWidth;

				/* C1) element fits in view is inside clip area
				 * C2) element visible only at top; eg. partly visible textarea
				 * C3) element visible only at bottom
				 * C4) element fits in view but its visible only at top
				 * C5) element fits in view but its visible only at bottom
				 */
				switch (_true) {
					case elementFits && clipTop < elementTop && clipBottom > elementBottom:
					case clipTop < elementTop && elementTop < clipBottom && clipBottom < elementBottom:
					case clipTop > elementTop && clipBottom > elementBottom:
						// (1) pass, element position is ok
						// (2, 3) pass, we cant do anything, if we move the scroll the user could lost view of
						// something he scrolled to
						break;
					case elementFits && clipTop < elementTop && clipBottom < elementBottom:
					case elementFits && clipTop > elementTop && clipBottom > elementBottom:
					case elementFits: // element fits in view but is not visible
						this.centerToElement(element);
						break;
					default: // element is not visible
						anchor = findPositionAnchor(element);
						if (!anchor) {
							anchor = element;
						}
						anchorPositionX = anchor.offsetLeft + DOMUtils.getCSSProperty(anchor, "margin-left", 0, "integer");
						anchorPositionY = anchor.offsetTop + DOMUtils.getCSSProperty(anchor, "margin-top", 0, "integer");
						parent = anchor.parentNode;
						while (parent && parent !== clip) {
							anchorPositionX += parent.offsetLeft;
							anchorPositionY += parent.offsetTop;
							parent = parent.parentNode;
						}
						this.scrollTo(anchorPositionX, anchorPositionY, this.scrollDuration);
						break;
				}
			};

			/**
			 * Centers specified element in the clip area
			 *
			 * ### Example usage with TAU API
			 *
			 *        @example
			 *        <div class="myPageClass" data-role="page">
			 *            <div data-role="content" data-scroll="y">
			 *                content
			 *                <div class="testElementClass">some data</div>
			 *            </div>
			 *        </div>
			 *        <script>
			 *            var scrollview = tau.widget.Scrollview(document.querySelector(".myPageClass > div[data-role=content]")),
			 *                testElement = document.querySelector(".testElementClass");
			 *            scrollview.centerToElement(testElement);
			 *        </script>
			 *
			 * ### Example usage with jQuery API
			 *
			 *        @example
			 *        <div class="myPageClass" data-role="page">
			 *            <div data-role="content" data-scroll="y">
			 *                content
			 *                <div class="testElementClass">some data</div>
			 *            </div>
			 *        </div>
			 *        <script>
			 *            var element = $(".myPageClass > div[data-role=content]")),
			 *                testElement = $(".testElementClass");
			 *            element.scrollview();
			 *            element.scrollview("centerToElement", testElement);
			 *        </script>
			 *
			 * @param {HTMLElement} element
			 * @method centerToElement
			 * @member ns.widget.core.Scrollview
			 */
			Scrollview.prototype.centerToElement = function (element) {
				var clip = this.element,
					deltaX = parseInt(DOMUtils.getElementWidth(clip) / 2 - DOMUtils.getElementWidth(element) / 2, 10),
					deltaY = parseInt(DOMUtils.getElementHeight(clip) / 2 - DOMUtils.getElementHeight(element) / 2, 10),
					elementPositionX = element.offsetLeft,
					elementPositionY = element.offsetTop,
					parent = element.parentNode;

				while (parent && parent !== clip) {
					elementPositionX += parent.offsetLeft + DOMUtils.getCSSProperty(parent, "margin-left", 0, "integer");
					elementPositionY += parent.offsetTop + DOMUtils.getCSSProperty(parent, "margin-top", 0, "integer");
					parent = parent.parentNode;
				}
				this.scrollTo(elementPositionX - deltaX, elementPositionY - deltaY, this.scrollDuration);
			};

			/**
			 * Returns scroll current position
			 *
			 *        @example
			 *        <div class="myPageClass" data-role="page">
			 *            <div data-role="content" data-scroll="y">
			 *                content
			 *            </div>
			 *        </div>
			 *        <script>
			 *            var scrollview = tau.widget.Scrollview(document.querySelector(".myPageClass > div[data-role=content]")),
			 *                currentPosition = scrollview.getScrollPosition();
			 *        </script>
			 *
			 * ### Example usage with jQuery API
			 *
			 *        @example
			 *        <div class="myPageClass" data-role="page">
			 *            <div data-role="content" data-scroll="y">
			 *                content
			 *            </div>
			 *        </div>
			 *        <script>
			 *            var element = $(".myPageClass > div[data-role=content]")),
			 *                position;
			 *            element.scrollview();
			 *            position = element.scrollview("getScrollPosition");
			 *        </script>
			 *
			 * @return {Object}
			 * @method getScrollPosition
			 * @member ns.widget.core.Scrollview
			 */
			Scrollview.prototype.getScrollPosition = function () {
				var element = this.element;

				return {
					"x": element.scrollLeft,
					"y": element.scrollTop
				};
			};

			/**
			 * Binds scrollview events
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Scrollview
			 */
			Scrollview.prototype._bindEvents = function (element) {
				var scrollTimer = null,
					notifyScrolled = function () {
						eventUtils.trigger(element, "scrollstop");
						window.clearTimeout(scrollTimer);
						scrollTimer = null;
					},
					self = this,
					//FIXME there should be some other way to get parent container
					ui = self._ui,
					page = ui.page,
					jumpTop = ui.jumpVerticalButton,
					jumpLeft = ui.jumpHorizontalButton,
					repositionJumpsCallback,
					jumpTopCallback,
					jumpLeftCallback,
					callbacks = self._callbacks,
					scrollDirection = self.options.scroll;

				if (page) {
					if (self.options.scrollJump) {
						repositionJumpsCallback = repositionJumps.bind(null, self);
						jumpTopCallback = function () {
							self.scrollTo(element.scrollLeft, 0, 250);
						};
						jumpLeftCallback = function () {
							self.scrollTo(0, element.scrollTop, 250);
						};
						page.addEventListener(pageEvents.SHOW, repositionJumpsCallback, false);
						if (jumpTop) {
							jumpTop.firstChild.addEventListener("vclick", jumpTopCallback, false);
						}
						if (jumpLeft) {
							jumpLeft.firstChild.addEventListener("vclick", jumpLeftCallback, false);
						}

						callbacks.repositionJumps = repositionJumpsCallback;
						callbacks.jumpTop = jumpTopCallback;
						callbacks.jumpLeft = jumpLeftCallback;
					}

					element.addEventListener("scroll", function () {
						if (scrollTimer) {
							window.clearTimeout(scrollTimer);
						} else {
							eventUtils.trigger(element, "scrollstart");
						}

						if (scrollDirection === "y" &&
							(element.scrollTop === 0 || element.scrollTop + element.clientHeight === element.scrollHeight)) {
							eventUtils.trigger(element, "scrollboundary", {
								direction: (element.scrollTop === 0) ? "top" : "bottom"
							});
						} else if (scrollDirection === "x" &&
							(element.scrollLeft === 0 || element.scrollLeft + element.clientWidth === element.scrollWidth)) {
							eventUtils.trigger(element, "scrollboundary", {
								direction: (element.scrollLeft === 0) ? "left" : "right"
							});
						}

						scrollTimer = window.setTimeout(notifyScrolled, 100);
						eventUtils.trigger(element, "scrollupdate");
					}, false);

					document.addEventListener("vmousedown", function () {
						if (currentTransition) {
							currentTransition = null;
						}
					}, false);

					if (self.options.scrollIndicator) {
						callbacks.scrollUpdate = self._showScrollIndicator.bind(self);
						element.addEventListener("scrollupdate", callbacks.scrollUpdate, false);
						callbacks.scrollStop = self._hideScrollIndicator.bind(self);
						element.addEventListener("scrollstop", callbacks.scrollStop, false);
					}

				}
			};

			Scrollview.prototype._destroy = function () {
				var self = this,
					element = self.element,
					ui = self._ui,
					page = ui.page,
					scrollJump = this.options.scrollJump,
					jumpTop = ui.jumpVerticalButton,
					jumpLeft = ui.jumpHorizontalButton,
					callbacks = self._callbacks,
					repositionJumpsCallback = callbacks.repositionJumps,
					jumpTopCallback = callbacks.jumpTop,
					jumpLeftCallback = callbacks.jumpLeft;

				if (scrollJump) {
					if (page && repositionJumpsCallback) {
						page.removeEventListener(pageEvents.SHOW, repositionJumpsCallback, false);
					}
					if (jumpTop && jumpTopCallback) {
						jumpTop.firstChild.removeEventListener("vclick", jumpTopCallback, false);
					}
					if (jumpLeft && jumpLeftCallback) {
						jumpLeft.firstChild.removeEventListener("vclick", jumpLeftCallback, false);
					}
				}

				if (self.options.scrollIndicator) {
					element.removeEventListener("scrollupdate", callbacks.scrollUpdate, false);
				}

				if (self._timers.scrollIndicatorHide) {
					window.clearTimeout(self._timers.scrollIndicatorHide);
				}

			};

			/**
			 * Enables scrollview action
			 * @method enableScrolling
			 * @public
			 * @member ns.widget.core.Scrollview
			 */
			Scrollview.prototype.enableScrolling = function () {
				this._setClipOverflowStyle();
			}

			/**
			 * Disables scrollview action
			 * @method disableScrolling
			 * @public
			 * @member ns.widget.core.Scrollview
			 */
			Scrollview.prototype.disableScrolling = function () {
				this._setClipOverflowHidden();
			}

			ns.widget.core.Scrollview = Scrollview;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Scrollview;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
