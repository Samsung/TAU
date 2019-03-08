/*global window, ns, define */
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
 * # Swipe Widget
 * Widget adds swiped covers to element.
 *
 * ## Default selectors
 * All elements which have a class _.ui-swipe_ or an attribute _data-role=swipe_
 * will become a Swipe widget.
 *
 * ### HTML examples
 *
 * #### Create a swipe widget using the data-role attribute with one covered item
 *
 *        @example
 *        <div id="swipe" data-role="swipe">
 *            <div data-role="swipe-item-cover">
 *                Cover - swipe to open
 *            </div>
 *            <div data-role="swipe-item">
 *                <div data-role="button" data-inline="true">First item</div>
 *            </div>
 *        </div>
 *
 * #### Create swipe widget using the class
 *
 *        @example
 *        <div id="swipe" class="ui-swipe">
 *            <div data-role="swipe-item-cover">
 *                Cover - swipe to open
 *            </div>
 *            <div data-role="swipe-item">
 *                <div data-role="button" data-inline="true">First item</div>
 *            </div>
 *        </div>
 *
 * ## Manual constructor
 * For manual creation of swipe widget you can use constructor of widget:
 *
 *        @example
 *        <div id="swipe">
 *            <div data-role="swipe-item-cover">
 *                Cover - swipe to open
 *            </div>
 *            <div data-role="swipe-item">
 *                <div data-role="button" data-inline="true">First item</div>
 *            </div>
 *        </div>
 *
 *        <script>
 *            var swipeElement = document.getElementById("swipe"),
 *                swipe = tau.widget.Swipe(swipeElement);
 *        </script>
 *
 *  If jQuery library is loaded, its method can be used:
 *
 *        @example
 *        <div id="swipe">
 *            <div data-role="swipe-item-cover">
 *                Cover - swipe to open
 *            </div>
 *            <div data-role="swipe-item">
 *                <div data-role="button" data-inline="true">First item</div>
 *            </div>
 *        </div>
 *
 *        <script>
 *            var swipe = $("#swipe").swipe();
 *        </script>
 *
 * ## Methods
 *
 * To call method on widget you can use one of existing API:
 *
 * First API is from tau namespace:
 *
 *        @example
 *        var swipeElement = document.getElementById("swipe"),
 *            swipe = tau.widget.Swipe(swipeElement);
 *
 *        swipe.methodName(methodArgument1, methodArgument2, ...);
 *
 * Second API is jQuery Mobile API and for call _methodName_ you can use:
 *
 *        @example
 *        $(".selector").swipe("methodName", methodArgument1, methodArgument2, ...);
 *
 *
 * ## Opening swipe
 * There are three ways to open swipe widget.
 *
 * ### Opening by swiping
 *
 * To uncover items of widget, you can swipe over an element.
 *
 *        @example
 *        <div id="swipe" data-role="swipe">
 *            <div data-role="swipe-item-cover">
 *                Cover - swipe to open
 *            </div>
 *            <div data-role="swipe-item">
 *                <div data-role="button" data-inline="true">First item</div>
 *            </div>
 *        </div>
 *
 * ### Opening manually by using method "open"
 *
 * To uncover items of widget,the method "open" can be used.
 *
 *        @example
 *        <div id="swipe" data-role="swipe">
 *            <div data-role="swipe-item-cover">
 *                Cover - swipe to open
 *            </div>
 *            <div data-role="swipe-item">
 *                <div data-role="button" data-inline="true">First item</div>
 *            </div>
 *        </div>
 *
 *        <script>
 *            var swipeWidget = tau.widget.Swipe(document.getElementById("swipe"));
 *            swipeWidget.open();
 *        <script>
 *
 * If jQuery is loaded:
 *
 *        @example
 *        <div id="swipe" data-role="swipe">
 *            <div data-role="swipe-item-cover">
 *                Cover - swipe to open
 *            </div>
 *            <div data-role="swipe-item">
 *                <div data-role="button" data-inline="true">First item</div>
 *            </div>
 *        </div>
 *
 *        <script>
 *            $("#swipe").swipe("open");
 *        <script>
 *
 *
 * @class ns.widget.mobile.Swipe
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/event",
			"../../../core/util/anim/Animation",
			"../../../profile/mobile/widget/mobile/BaseWidgetMobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var Swipe = function () {
					var self = this;

					/**
					 * Object with default options
					 * @property {Object} options
					 * @property {?string} [options.theme=null] Sets the color
					 * scheme for the swipe contents.
					 * @member ns.widget.mobile.Swipe
					 */
					self.options = {
						theme: null
					};
					self._isOpen = false;
					self.moveAnimation = null;
					self.opacityAnimation = null;
				},
				/**
				 * Alias for {@link ns.widget.BaseWidget}
				 * @property {Object} Widget
				 * @member ns.widget.mobile.Swipe
				 * @private
				 * @static
				 */
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				 * Alias for class ns.engine
				 * @property {ns.engine} engine
				 * @member ns.widget.mobile.Swipe
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * Alias for class ns.event
				 * @property {Object} events
				 * @member ns.widget.mobile.Swipe
				 * @private
				 */
				events = ns.event,
				Animation = ns.util.anim.Animation,
				slice = [].slice,
				prototype,
				classPrefix = "ui-swipe",
				classes = {
					uiBodyPrefix: "ui-body-",
					uiSwipe: classPrefix,
					uiSwipeItem: classPrefix + "-item",
					uiSwipeItemCover: classPrefix + "-item-cover",
					uiSwipeItemCoverInner: classPrefix + "-item-cover-inner"
				},
				selectorRoleSwipe = "[data-role='swipe']",
				selectorRoleSwipeItemCover = "[data-role='swipe-item-cover']" +
					", ." + classes.uiSwipeItemCover,
				selectorRoleSwipeItem = "[data-role='swipe-item']" +
					", ." + classes.uiSwipeItem,
				classUiBtn = ".ui-btn",
				swipeLeftEvent = "swipeleft",
				swipeRightEvent = "swiperight";

			Swipe.prototype = new BaseWidget();

			prototype = Swipe.prototype;

			/**
			 * Dictionary for swipe related css class names
			 * @property {Object} classes
			 * @member ns.widget.mobile.Swipe
			 * @static
			 * @readonly
			 */
			prototype.classes = classes;

			/**
			 * This method cleans up DOM modification made during building process.
			 * It is called during refreshing and destroying.
			 * @method cleanupDom
			 * @param {ns.widget.mobile.Swipe} self Widget
			 * @param {HTMLElement} element Element of widget
			 * @private
			 * @static
			 * @member ns.widget.mobile.Swipe
			 */
			function cleanupDom(self, element) {
				var covers,
					item,
					itemHasThemeClass,
					defaultCoverTheme = classes.uiBodyPrefix + self.options.theme,
					coverTheme = defaultCoverTheme,
					wrapper,
					selfUi = self._ui;

				if (selfUi) {
					covers = selfUi.covers;
					item = selfUi.item;

					element.classList.remove(classes.uiSwipe);
					item.classList.remove(classes.uiSwipeItem);

					itemHasThemeClass = element.className.match(/ui\-body\-[a-z]|ui\-bar\-[a-z]/);
					if (itemHasThemeClass) {
						coverTheme = itemHasThemeClass[0];
					}

					covers.forEach(function (cover) {
						var coverClassList = cover.classList;

						coverClassList.remove(classes.uiSwipeItemCover);
						coverClassList.remove(coverTheme);

						wrapper = cover.querySelector("." + classes.uiSwipeItemCoverInner);
						while (wrapper.firstChild) {
							cover.appendChild(wrapper.firstChild);
						}
						wrapper.parentNode.removeChild(wrapper);
					});
				}
			}

			/**
			 * This is callback for the animation which is triggered
			 * when cover is moved or opacity is changed.
			 * @method handleAnimationEnd
			 * @param {ns.util.anim.Animation} animation Animation
			 * @param {HTMLElement} element Element of widget
			 * @private
			 * @static
			 * @member ns.widget.mobile.Swipe
			 */
			function handleAnimationEnd(animation, element) {
				var to = animation.options.to;

				if (to.opacity !== undefined) {
					//@TODO implement "preserve" option in ns.util.anim.Animation
					element.style.opacity = animation.options.to.opacity;
					animation.destroy();
				}
				if (to.left !== undefined) {
					//@TODO implement "preserve" option in ns.util.anim.Animation
					element.style.left = animation.options.to.left;
					animation.destroy();
					events.trigger(element, "swipeanimationend");
				}
			}

			/**
			 * This is callback for the animation which is triggered
			 * when cover is moved or opacity is changed.
			 * @method animateCover
			 * @param {ns.widget.mobile.Swipe} self Widget
			 * @param {HTMLElement} cover Cover element
			 * @param {number} leftPercentage Percentage of opening
			 * @param {HTMLElement} item Item of widget
			 * @private
			 * @static
			 * @member ns.widget.mobile.Swipe
			 */
			function animateCover(self, cover, leftPercentage, item) {
				var coverStyle = cover.style,
					itemStyle = item.style,
					moveAnimation,
					opacityAnimation,
					swipeWidget;

				slice.call(self.element.parentNode.querySelectorAll(selectorRoleSwipe)).forEach(function (swipe) {
					swipeWidget = engine.instanceWidget(swipe, "Swipe");
					if (self !== swipeWidget && swipeWidget.opened()) {
						swipeWidget.close();
					}
				});

				self._isOpen = leftPercentage === 110;

				//To pass tests the animation can be triggered only once.
				//Then I need to have a reference to previous animations,
				//in order to destroy it when new animations appear
				if (self.moveAnimation) {
					self.moveAnimation.destroy();
					self.opacityAnimation.destroy();
				}

				//animations change the left value to uncover/ cover item element
				moveAnimation = new Animation({
					element: cover,
					duration: "400ms",
					from: {
						"left": coverStyle.left
					},
					to: {
						"left": leftPercentage + "%"
					},
					onEnd: handleAnimationEnd
				});
				self.moveAnimation = moveAnimation;
				moveAnimation.play();

				//animations change item opacity in order to show items under cover
				opacityAnimation = new Animation({
					element: item,
					duration: "400ms",
					from: {
						"opacity": itemStyle.opacity
					},
					to: {
						"opacity": (self.opened()) ? "1" : "0"
					},
					onEnd: handleAnimationEnd
				});
				self.opacityAnimation = opacityAnimation;
				opacityAnimation.play();
			}

			/**
			 * This method sets up widget's element.
			 * It is called during building and refreshing process.
			 * @method refresh
			 * @param {ns.widget.mobile.Swipe} self Widget
			 * @param {HTMLElement} element Element of widget
			 * @private
			 * @static
			 * @member ns.widget.mobile.Swipe
			 */
			function refresh(self, element) {
				var defaultCoverTheme = "",
					covers = null,
					coverTheme = "",
					item = null,
					itemHasThemeClass = null,
					ui = null;

				cleanupDom(self, element);

				defaultCoverTheme = classes.uiBodyPrefix + self.options.theme;
				covers = slice.call(element.querySelectorAll(selectorRoleSwipeItemCover));
				coverTheme = defaultCoverTheme;
				item = element.querySelector(selectorRoleSwipeItem);
				itemHasThemeClass = element.className.match(/ui\-body\-[a-z]|ui\-bar\-[a-z]/);
				ui = self._ui || {};

				/*
				 * @todo good support multicovers
				 */
				ui.covers = covers;
				ui.item = item;
				self._ui = ui;

				element.classList.add(classes.uiSwipe);
				item.classList.add(classes.uiSwipeItem);

				covers.forEach(function (cover) {
					var span,
						coverClassList = cover.classList;

					if (itemHasThemeClass) {
						coverTheme = itemHasThemeClass[0];
					}

					coverClassList.add(classes.uiSwipeItemCover);
					coverClassList.add(coverTheme);

					if (!cover.querySelector("." + classes.uiSwipeItemCoverInner)) {
						span = document.createElement("span");
						span.classList.add(classes.uiSwipeItemCoverInner);
						while (cover.firstChild) {
							span.appendChild(cover.firstChild);
						}
						cover.appendChild(span);
					}
				});
			}

			/**
			 * This method builds structure of swipe widget.
			 * @method _build
			 * @param {HTMLElement} element Element of widget
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.Swipe
			 */
			prototype._build = function (element) {
				refresh(this, element);
				return element;
			};

			/**
			 * This method inits structure of swipe widget.
			 * @method _init
			 * @param {HTMLElement} element Element of widget
			 * @protected
			 * @member ns.widget.mobile.Swipe
			 */
			prototype._init = function (element) {
				/* @TODO what is swipeSelectors? */
				var swipeSelectors = {};
				/* @TODO end */

				this._ui = this._ui || {
					covers: slice.call(element.querySelectorAll(selectorRoleSwipeItemCover)),
					item: element.querySelector(swipeSelectors.swipeItem)
				};
			};

			/**
			 * This method binds events to widget.
			 * @method addEvents
			 * @param {ns.widget.mobile.Swipe} self Widget
			 * @private
			 * @static
			 * @member ns.widget.mobile.Swipe
			 */
			function addEvents(self) {
				var ui = self._ui,
					covers = ui.covers,
					item = ui.item,
					buttonSelector = engine.getWidgetDefinition("Button").selector;

				/*
				 * @todo good support multicovers
				 */

				covers.forEach(function (cover) {
					cover.swipeAnimateLeft = animateCover.bind(null, self, cover, 0, item);
					cover.swipeAnimateRight = animateCover.bind(null, self, cover, 110, item);

					item.addEventListener(swipeLeftEvent, cover.swipeAnimateLeft, false);
					cover.addEventListener(swipeRightEvent, cover.swipeAnimateRight, false);

					[].forEach.call(item.querySelectorAll(buttonSelector), function (button) {
						button.addEventListener("vclick", cover.swipeAnimateLeft, false);
					});
				});
			}

			/**
			 * This method unbinds events to widget.
			 * @method removeEvents
			 * @param {ns.widget.mobile.Swipe} self Widget
			 * @private
			 * @static
			 * @member ns.widget.mobile.Swipe
			 */
			function removeEvents(self) {
				var selfUI = self._ui,
					covers = selfUI.covers,
					item = selfUI.item;

				/*
				 * @todo good support multicovers
				 */

				covers.forEach(function (cover) {
					item.removeEventListener(swipeLeftEvent, cover.swipeAnimateLeft, false);
					cover.removeEventListener(swipeRightEvent, cover.swipeAnimateRight, false);

					slice.call(item.querySelectorAll(classUiBtn)).forEach(function (button) {
						button.removeEventListener("vclick", cover.swipeAnimateLeft, false);
					});
				});
			}

			/**
			 * This method binds events to widget.
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.mobile.Swipe
			 */
			prototype._bindEvents = function () {
				addEvents(this);
			};

			/**
			 * This method refreshes swipe widget.
			 *
			 * It re-builds the whole widget.
			 *
			 *        @example
			 *        <div id="swipe" data-role="swipe">
			 *            <div data-role="swipe-item-cover">
			 *                Swipe
			 *            </div>
			 *            <div data-role="swipe-item">
			 *                <div data-role="button" data-inline="true">First item</div>
			 *                <div data-role="button" data-inline="true">Second item</div>
			 *            </div>
			 *        </div>
			 *
			 *        <script>
			 *            var swipeWidget = tau.widget.Swipe(document.getElementById("swipe"));
			 *            swipeWidget.refresh();
			 *        <script>
			 *
			 * If jQuery is loaded:
			 *
			 *        @example
			 *        <div  id="swipe" data-role="swipe">
			 *            <div data-role="swipe-item-cover">
			 *                Swipe
			 *            </div>
			 *            <div data-role="swipe-item">
			 *                <div data-role="button" data-inline="true">First item</div>
			 *                <div data-role="button" data-inline="true">Second item</div>
			 *            </div>
			 *        </div>
			 *
			 *        <script>
			 *            $("#swipe").swipe("refresh");
			 *        </script>
			 *
			 * @method refresh
			 * @member ns.widget.mobile.Swipe
			 */
			/**
			 * This method refreshes widget.
			 * @method _refresh
			 * @protected
			 * @member ns.widget.mobile.Swipe
			 */
			prototype._refresh = function () {
				refresh(this, this.element);
			};

			/**
			 * Removes the swipe functionality completely.
			 *
			 * This will return the element back to its pre-init state.
			 *
			 *        @example
			 *        <div id="swipe" data-role="swipe">
			 *            <div data-role="swipe-item-cover">
			 *                Swipe
			 *            </div>
			 *            <div data-role="swipe-item">
			 *                <div data-role="button" data-inline="true">First item</div>
			 *                <div data-role="button" data-inline="true">Second item</div>
			 *            </div>
			 *        </div>
			 *
			 *        <script>
			 *            var swipeWidget = tau.widget.Swipe(document.getElementById("swipe"));
			 *            swipeWidget.destroy();
			 *        <script>
			 *
			 * If jQuery is loaded:
			 *
			 *        @example
			 *        <div  id="swipe" data-role="swipe">
			 *            <div data-role="swipe-item-cover">
			 *                Swipe
			 *            </div>
			 *            <div data-role="swipe-item">
			 *                <div data-role="button" data-inline="true">First item</div>
			 *                <div data-role="button" data-inline="true">Second item</div>
			 *            </div>
			 *        </div>
			 *
			 *        <script>
			 *            $("#swipe").swipe("destroy");
			 *        </script>
			 *
			 * @method destroy
			 * @member ns.widget.mobile.Swipe
			 */
			/**
			 * This method destroys widget.
			 * @method _destroy
			 * @protected
			 * @member ns.widget.mobile.Swipe
			 */
			prototype._destroy = function () {
				var self = this;

				removeEvents(self);
				cleanupDom(self, self.element);
			};

			/**
			 * This method runs opening animations.
			 *
			 *        @example
			 *        <div id="swipe" data-role="swipe">
			 *            <div data-role="swipe-item-cover">
			 *                Swipe
			 *            </div>
			 *            <div data-role="swipe-item">
			 *                <div data-role="button" data-inline="true">First item</div>
			 *                <div data-role="button" data-inline="true">Second item</div>
			 *            </div>
			 *        </div>
			 *
			 *        <script>
			 *            var swipeWidget = tau.widget.Swipe(document.getElementById("swipe"));
			 *            swipeWidget.open();
			 *        <script>
			 *
			 * If jQuery is loaded:
			 *
			 *        @example
			 *        <div  id="swipe" data-role="swipe">
			 *            <div data-role="swipe-item-cover">
			 *                Swipe
			 *            </div>
			 *            <div data-role="swipe-item">
			 *                <div data-role="button" data-inline="true">First item</div>
			 *                <div data-role="button" data-inline="true">Second item</div>
			 *            </div>
			 *        </div>
			 *
			 *        <script>
			 *            $("#swipe").swipe("open");
			 *        </script>
			 *
			 * @method open
			 * @member ns.widget.mobile.Swipe
			 */
			prototype.open = function () {
				var self = this,
					ui = self._ui;

				ui.covers.forEach(function (cover) {
					animateCover(self, cover, 110, ui.item);
				});
			};

			/**
			 * This method checks if swipe element is opened.
			 *
			 *        @example
			 *        <div id="swipe" data-role="swipe">
			 *            <div data-role="swipe-item-cover">
			 *                Swipe
			 *            </div>
			 *            <div data-role="swipe-item">
			 *                <div data-role="button" data-inline="true">First item</div>
			 *                <div data-role="button" data-inline="true">Second item</div>
			 *            </div>
			 *        </div>
			 *
			 *        <script>
			 *            var swipeWidget = tau.widget.Swipe(document.getElementById("swipe"));
			 *                isOpened = swipeWidget.opened();
			 *        <script>
			 *
			 * If jQuery is loaded:
			 *
			 *        @example
			 *        <div  id="swipe" data-role="swipe">
			 *            <div data-role="swipe-item-cover">
			 *                Swipe
			 *            </div>
			 *            <div data-role="swipe-item">
			 *                <div data-role="button" data-inline="true">First item</div>
			 *                <div data-role="button" data-inline="true">Second item</div>
			 *            </div>
			 *        </div>
			 *
			 *        <script>
			 *            var isOpened = $("#swipe").swipe("opened");
			 *        </script>
			 *
			 * @method opened
			 * @return {boolean} True, if swipe element is opened.
			 * Otherwise, it returns false.
			 * @member ns.widget.mobile.Swipe
			 */
			prototype.opened = function () {
				return this._isOpen;
			};

			/**
			 * This method runs closing animations.
			 *
			 *        @example
			 *        <div id="swipe" data-role="swipe">
			 *            <div data-role="swipe-item-cover">
			 *                Swipe
			 *            </div>
			 *            <div data-role="swipe-item">
			 *                <div data-role="button" data-inline="true">First item</div>
			 *                <div data-role="button" data-inline="true">Second item</div>
			 *            </div>
			 *        </div>
			 *
			 *        <script>
			 *            var swipeWidget = tau.widget.Swipe(document.getElementById("swipe"));
			 *            swipeWidget.close();
			 *        <script>
			 *
			 * If jQuery is loaded:
			 *
			 *        @example
			 *        <div  id="swipe" data-role="swipe">
			 *            <div data-role="swipe-item-cover">
			 *                Swipe
			 *            </div>
			 *            <div data-role="swipe-item">
			 *                <div data-role="button" data-inline="true">First item</div>
			 *                <div data-role="button" data-inline="true">Second item</div>
			 *            </div>
			 *        </div>
			 *
			 *        <script>
			 *            $("#swipe").swipe("close");
			 *        </script>
			 *
			 * @method close
			 * @member ns.widget.mobile.Swipe
			 */
			prototype.close = function () {
				var self = this,
					ui = self._ui;

				ui.covers.forEach(function (cover) {
					animateCover(self, cover, 0, ui.item);
				});
			};


			/**
			 * This method changes state of swipe on enabled and removes CSS classes connected with state.
			 *
			 *        @example
			 *        <div id="swipe" data-role="swipe">
			 *            <div data-role="swipe-item-cover">
			 *                Swipe
			 *            </div>
			 *            <div data-role="swipe-item">
			 *                <div data-role="button" data-inline="true">First item</div>
			 *                <div data-role="button" data-inline="true">Second item</div>
			 *            </div>
			 *        </div>
			 *
			 *        <script>
			 *            var swipeWidget = tau.widget.Swipe(document.getElementById("swipe"));
			 *            swipeWidget.enable();
			 *        </script>
			 *
			 * If jQuery is loaded:
			 *
			 *        @example
			 *        <div id="swipe" data-role="swipe">
			 *            <div data-role="swipe-item-cover">
			 *                Swipe
			 *            </div>
			 *            <div data-role="swipe-item">
			 *                <div data-role="button" data-inline="true">First item</div>
			 *                <div data-role="button" data-inline="true">Second item</div>
			 *            </div>
			 *        </div>
			 *
			 *        <script>
			 *            $("#swipe").swipe("enable");
			 *        </script>
			 *
			 * @method enable
			 * @chainable
			 * @member ns.widget.mobile.Swipe
			 */

			/**
			 * This method changes state of swipe on disabled and adds CSS classes connected with state.
			 *
			 *        @example
			 *        <div id="swipe" data-role="swipe">
			 *            <div data-role="swipe-item-cover">
			 *                Swipe
			 *            </div>
			 *            <div data-role="swipe-item">
			 *                <div data-role="button" data-inline="true">First item</div>
			 *                <div data-role="button" data-inline="true">Second item</div>
			 *            </div>
			 *        </div>
			 *
			 *        <script>
			 *            var swipeWidget = tau.widget.Swipe(document.getElementById("swipe"));
			 *            swipeWidget.disable();
			 *        </script>
			 *
			 * If jQuery is loaded:
			 *
			 *        @example
			 *        <div id="swipe" data-role="swipe">
			 *            <div data-role="swipe-item-cover">
			 *                Swipe
			 *            </div>
			 *            <div data-role="swipe-item">
			 *                <div data-role="button" data-inline="true">First item</div>
			 *                <div data-role="button" data-inline="true">Second item</div>
			 *            </div>
			 *        </div>
			 *
			 *        <script>
			 *            $("#swipe").swipe("disable");
			 *        </script>
			 *
			 * @method disable
			 * @chainable
			 * @member ns.widget.mobile.Swipe
			 */

			/**
			 * The function "value" is not supported in this widget.
			 *
			 * @method value
			 * @chainable
			 * @member ns.widget.mobile.Swipe
			 */

			/**
			 * Get/Set options of the widget.
			 *
			 * This method can work in many context.
			 *
			 * If first argument is type of object them, method set values for options given in object. Keys of object are names of options and values from object are values to set.
			 *
			 * If you give only one string argument then method return value for given option.
			 *
			 * If you give two arguments and first argument will be a string then second argument will be intemperate as value to set.
			 *
			 *        @example
			 *        <div id="swipe" data-role="swipe">
			 *            <div data-role="swipe-item-cover">
			 *                Swipe
			 *            </div>
			 *            <div data-role="swipe-item">
			 *                <div data-role="button" data-inline="true">First item</div>
			 *                <div data-role="button" data-inline="true">Second item</div>
			 *            </div>
			 *        </div>
			 *
			 *        <script>
			 *            var swipeWidget = tau.widget.Swipe(document.getElementById("swipe")),
			 *                optionValue;
			 *
			 *            optionValue = swipeWidget.option("theme"); // read value of option theme
			 *            swipeWidget.option("theme", "a") // set value
			 *        </script>
			 *
			 * If jQuery is loaded:
			 *
			 *        @example
			 *        <div id="swipe" data-role="swipe">
			 *            <div data-role="swipe-item-cover">
			 *                Swipe
			 *            </div>
			 *            <div data-role="swipe-item">
			 *                <div data-role="button" data-inline="true">First item</div>
			 *                <div data-role="button" data-inline="true">Second item</div>
			 *            </div>
			 *        </div>
			 *
			 *        <script>
			 *            optionValue = $("#swipe").swipe("option", "theme");
			 *            $("#swipe").swipe("option", "theme", "a");
			 *        </script>
			 *
			 * @method option
			 * @param {string|Object} [name] name of option
			 * @param {*} value value to set
			 * @member ns.widget.mobile.Swipe
			 * @return {*} return value of option or undefined if method is called in setter context
			 */

			/**
			 * Trigger an event on widget's element.
			 *
			 *        @example
			 *        <div id="swipe" data-role="swipe">
			 *            <div data-role="swipe-item-cover">
			 *                Swipe
			 *            </div>
			 *            <div data-role="swipe-item">
			 *                <div data-role="button" data-inline="true">First item</div>
			 *                <div data-role="button" data-inline="true">Second item</div>
			 *            </div>
			 *        </div>
			 *
			 *        <script>
			 *            var swipeWidget = tau.widget.Swipe(document.getElementById("swipe"));
			 *            swipeWidget.trigger("eventName");
			 *        </script>
			 *
			 * If jQuery is loaded:
			 *
			 *        @example
			 *        <div id="swipe" data-role="swipe">
			 *            <div data-role="swipe-item-cover">
			 *                Swipe
			 *            </div>
			 *            <div data-role="swipe-item">
			 *                <div data-role="button" data-inline="true">First item</div>
			 *                <div data-role="button" data-inline="true">Second item</div>
			 *            </div>
			 *        </div>
			 *
			 *        <script>
			 *            $("#swipe").swipe("trigger", "eventName");
			 *        </script>
			 *
			 * @method trigger
			 * @param {string} eventName the name of event to trigger
			 * @param {?*} [data] additional object to be carried with the event
			 * @param {boolean} [bubbles=true] indicating whether the event bubbles up through the DOM or not
			 * @param {boolean} [cancelable=true] indicating whether the event is cancelable
			 * @return {boolean} false, if any callback invoked preventDefault on event object
			 * @member ns.widget.mobile.Swipe
			 */

			/**
			 * Add event listener to widget's element.
			 *
			 *        @example
			 *        <div id="swipe" data-role="swipe">
			 *            <div data-role="swipe-item-cover">
			 *                Swipe
			 *            </div>
			 *            <div data-role="swipe-item">
			 *                <div data-role="button" data-inline="true">First item</div>
			 *                <div data-role="button" data-inline="true">Second item</div>
			 *            </div>
			 *        </div>
			 *
			 *        <script>
			 *            var swipeWidget = tau.widget.Swipe(document.getElementById("swipe")),
			 *                callback = function () {
			 *					console.log("event fires");
			 *				});
			 *
			 *            swipeWidget.on("eventName", callback);
			 *        </script>
			 *
			 * If jQuery is loaded:
			 *
			 *        @example
			 *        <div id="swipe" data-role="swipe">
			 *            <div data-role="swipe-item-cover">
			 *                Swipe
			 *            </div>
			 *            <div data-role="swipe-item">
			 *                <div data-role="button" data-inline="true">First item</div>
			 *                <div data-role="button" data-inline="true">Second item</div>
			 *            </div>
			 *        </div>
			 *
			 *        <script>
			 *            var callback = function () {
			 *					console.log("event fires");
			 *				});
			 *
			 *            $("#swipe").swipe("on", "eventName", callback);
			 *        </script>
			 *
			 * @method on
			 * @param {string} eventName the name of event
			 * @param {Function} listener function call after event will be trigger
			 * @param {boolean} [useCapture=false] useCapture param to addEventListener
			 * @member ns.widget.mobile.Swipe
			 */

			/**
			 * Remove event listener to widget's element.
			 *
			 *        @example
			 *        <div id="swipe" data-role="swipe">
			 *            <div data-role="swipe-item-cover">
			 *                Swipe
			 *            </div>
			 *            <div data-role="swipe-item">
			 *                <div data-role="button" data-inline="true">First item</div>
			 *                <div data-role="button" data-inline="true">Second item</div>
			 *            </div>
			 *        </div>
			 *
			 *        <script>
			 *            var swipeWidget = tau.widget.Swipe(document.getElementById("swipe")),
			 *                callback = function () {
			 *					console.log("event fires");
			 *				});
			 *
			 *            // add callback on event "eventName"
			 *            swipeWidget.on("eventName", callback);
			 *            // ...
			 *            // remove callback on event "eventName"
			 *            swipeWidget.off("eventName", callback);
			 *        </script>
			 *
			 * If jQuery is loaded:
			 *
			 *        @example
			 *        <div id="swipe" data-role="swipe">
			 *            <div data-role="swipe-item-cover">
			 *                Swipe
			 *            </div>
			 *            <div data-role="swipe-item">
			 *                <div data-role="button" data-inline="true">First item</div>
			 *                <div data-role="button" data-inline="true">Second item</div>
			 *            </div>
			 *        </div>
			 *
			 *        <script>
			 *            // add callback on event "eventName"
			 *            $("#swipe").swipe("on", "eventName", callback);
			 *            // ...
			 *            // remove callback on event "eventName"
			 *            $("#swipe").swipe("off", "eventName", callback);
			 *        </script>
			 *
			 * @method off
			 * @param {string} eventName the name of event
			 * @param {Function} listener function call after event will be trigger
			 * @param {boolean} [useCapture=false] useCapture param to addEventListener
			 * @member ns.widget.mobile.Swipe
			 */

			ns.widget.mobile.Swipe = Swipe;
			engine.defineWidget(
				"Swipe",
				selectorRoleSwipe + ", .ui-swipe",
				["open", "opened", "close"],
				Swipe,
				"tizen"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Swipe;
		}
	);
//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
