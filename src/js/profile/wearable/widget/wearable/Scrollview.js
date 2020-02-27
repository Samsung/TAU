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
 * ## Manual constructor
 *
 * To create the widget manually you can use APIs,
 *
 * ### Create scrollview by TAU API
 *
 *@example
 *   <div data-role="page" id="myPage">
 *   </div>
 *   <script>
 *       var page = tau.widget.Page(document.getElementById("myPage")),
 *       scrollview = tau.widget.Scrollview("myPage");
 *   </script>
 *
 * ## Options for Scrollview widget
 *
 * Options can be set using data-* attributes or by passing them to
 * the constructor.
 *
 * There is also a method **option** for changing them after widget
 * creation.
 *
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 */

(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/util/selectors",
			"../../../../core/util/scrolling",
			"../../../../core/event",
			"../../../../core/widget/core/scroller/effect/Bouncing",
			"../../../../core/util/DOM/manipulation",
			"../../../../core/widget/BaseWidget",
			"../wearable"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				/**
				 * Alias for {@link ns.engine}
				 * @property {Object} engine
				 * @member ns.widget.wearable.Scrollview
				 * @private
				 * @static
				 */
				utilsEvents = ns.event,
				engine = ns.engine,
				/**
				 * Alias for {@link ns.util}
				 * @property {Object} util
				 * @member ns.widget.wearable.Scrollview
				 * @private
				 * @static
				 */
				util = ns.util,
				scrolling = util.scrolling,
				/**
				 * Alias for {@link ns.util.DOM}
				 * @property {Object} doms
				 * @member ns.widget.wearable.Scrollview
				 * @private
				 * @static
				 */
				DOM = util.DOM,
				/**
				 * Alias for {@link ns.util.selectors}
				 * @property {Object} selectors
				 * @member ns.widget.wearable.Scrollview
				 * @private
				 * @static
				 */
				selectors = util.selectors,
				/**
				 * Alias for method {@link Math.abs}
				 * @property {Function} abs
				 * @memberof ns.widget.wearable.Scrollview
				 * @private
				 * @static
				 */
				abs = Math.abs,
				/**
				 * Alias for {@link ns.util.object}
				 * @property {Object} object
				 * @member ns.widget.wearable.Scrollview
				 * @private
				 * @static
				 */
				scrollBarType = {
					CIRCLE: "tizen-circular-scrollbar"
				},
				EffectBouncing = ns.widget.core.scroller.effect.Bouncing,
				BOUNCING_THRESHOLD = 20,
				SHOW_GO_TO_TOP_BUTTON_TIMEOUT = 800,
				Scrollview = function () {
					this.options = {
						bouncingEffect: true
					};
				},
				/**
				 * Dictionary for page related css class names
				 * @property {Object} classes
				 * @member ns.widget.core.Page
				 * @static
				 * @readonly
				 */
				classes = {
					uiHeader: "ui-header",
					uiContent: "ui-content",
					uiPageScroll: "ui-scroll-on",
					uiScroller: "ui-scroller"
				},
				prototype = new BaseWidget();

			prototype._build = function (element) {
				var pageScrollSelector = classes.uiPageScroll,
					children = [].slice.call(element.children),
					scroller,
					content,
					fragment;

				element.classList.add(pageScrollSelector);
				scroller = document.createElement("div");
				scroller.classList.add(classes.uiScroller);
				fragment = document.createDocumentFragment();

				children.forEach(function (value) {
					if (selectors.matchesSelector(value, ".ui-header:not(.ui-fixed), .ui-content, .ui-footer:not(.ui-fixed)")) {
						fragment.appendChild(value);
					}
				});

				if (element.children.length > 0 && element.children[0].classList.contains(classes.uiHeader)) {
					DOM.insertNodeAfter(element.children[0], scroller);
				} else {
					element.insertBefore(scroller, element.firstChild);
				}

				scroller.appendChild(fragment);

				if (ns.support.shape.circle) {
					if (scroller) {
						scroller.setAttribute(scrollBarType.CIRCLE, "");
					}
					content = element.querySelector("." + classes.uiContent);
					if (content) {
						content.setAttribute(scrollBarType.CIRCLE, "");
					}
				}

				this.scroller = scroller;

				return element;
			};

			prototype._setBouncingEffect = function (element, value) {
				var self = this,
					scroller = self.scroller;

				if (value) {
					ns.event.enableGesture(
						scroller,

						new ns.event.gesture.Drag({
							threshold: 30,
							delay: self.options.scrollDelay,
							blockVertical: self.orientation === EffectBouncing.Orientation.HORIZONTAL,
							blockHorizontal: self.orientation === EffectBouncing.Orientation.VERTICAL
						})
					);

					utilsEvents.on(scroller, "drag dragstart dragend", self);
				} else {
					ns.event.disableGesture(scroller);
					utilsEvents.off(scroller, "drag dragstart dragend", self);
				}
			};


			prototype._init = function () {
				var self = this,
					scroller = self.scroller;

				self.maxScrollX = 0;
				self.maxScrollY = 0;
				if (scroller) {
					self.maxScrollX = scroller.scrollWidth;
					self.maxScrollY = scroller.scrollHeight;
				}
				self.bouncingEffect = new EffectBouncing(self.element, {
					maxScrollX: self.maxScrollX,
					maxScrollY: self.maxScrollY,
					orientation: "vertical-horizontal"
				});
				self._setBouncingEffect(self.element, self.options.bouncingEffect);
			};


			prototype._start = function () {
				var self = this;

				self.scrolled = false;
				self.dragging = true;
				self.scrollCanceled = false;
			};

			prototype._end = function () {
				if (this.dragging) {

					// bouncing effect
					if (this.bouncingEffect) {
						this.bouncingEffect.dragEnd();
					}

					this.dragging = false;
				}
			};

			prototype.showBouncingEffect = function (place) {
				var bouncingEffect = this.bouncingEffect;

				if (place === "end") {
					bouncingEffect.drag(0, -this.scroller.getBoundingClientRect().height);
				} else {
					bouncingEffect.drag(0, 0);
				}
			};

			prototype.hideBouncingEffect = function () {
				var bouncingEffect = this.bouncingEffect;

				if (bouncingEffect) {
					bouncingEffect.dragEnd();
				}
			};

			prototype._isEndOfScroll = function (currentY) {
				var self = this,
					scroller = self.scroller;

				if (scroller.scrollHeight > window.innerHeight && currentY + window.innerHeight == scroller.scrollHeight) {
					return true;
				}
				return false;
			}

			/* jshint -W086 */
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
				}
			};

			prototype._move = function (event) {
				var self = this,
					scroller = self.scroller,
					scrollPositionX,
					scrollPositionY,
					deltaY = event.detail.deltaY,
					deltaX = event.detail.deltaX,
					clientX = event.detail.pointer.clientX,
					clientY = event.detail.pointer.clientY,
					bouncingEffect = self.bouncingEffect;

				if (scrolling.isElement(scroller)) {
					// FIXME: implement getting left scroll position.
					scrollPositionX = 0;
					scrollPositionY = scrolling.getScrollPosition();
				} else {
					scrollPositionX = scroller.scrollLeft;
					scrollPositionY = scroller.scrollTop;
				}

				// Handle bouncing (End Effect).
				if (abs(deltaY) > BOUNCING_THRESHOLD) {
					if (deltaY > 0) {
						// show top bouncing.
						bouncingEffect.drag(clientX, scrollPositionY);
					} else if (deltaY < 0) {
						// show bottom bouncing.
						bouncingEffect.drag(clientX, -(scrollPositionY + window.innerHeight));
					}
				} else if (abs(deltaX) > BOUNCING_THRESHOLD) {
					if (deltaX > 0) {
						// show left bouncing.
						bouncingEffect.drag(scrollPositionX, clientY);
					} else {
						// show right bouncing.
						bouncingEffect.drag(-(scrollPositionX + window.innerWidth), clientY);
					}
				}

				if (self._isEndOfScroll(scrollPositionY)) {
					if (!self.requestToShowGoToTopButton) {
						self.requestToShowGoToTopButton = setTimeout(function () {
							utilsEvents.trigger(scroller, "showGoToTopButton");
							self.requestToShowGoToTopButton = null;
						}, SHOW_GO_TO_TOP_BUTTON_TIMEOUT);
					}
				} else {
					utilsEvents.trigger(scroller, "hideGoToTopButton");
					if (self.requestToShowGoToTopButton) {
						clearTimeout(self.requestToShowGoToTopButton);
						self.requestToShowGoToTopButton = null;
					}
				}
			};

			Scrollview.prototype = prototype;
			ns.widget.wearable.Scrollview = Scrollview;

			engine.defineWidget(
				"Scrollview",
				"",
				[],
				Scrollview
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Scrollview;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
