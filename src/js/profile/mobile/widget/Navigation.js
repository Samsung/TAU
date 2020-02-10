/*global window, define, ns */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * # Navigation
 * Navigation component is used inside the header to navigate back and forth according to the navigational history array,
 * which is created by the application. By clicking a horizontally-listed element on the navigation bar,
 * the user can move to the target page.
 *
 * By clicking horizontally listed element on the Navigation Bar,
 *  a page is possible to navigate to the target page.
 *
 * ##Default selector
 * You can make the navigation widget as data-role="navigation".
 * To use *NAV* tag is recommended for semantic understanding.
 *
 * ####  Create Navigation Bar using data-role
 *
 * 		@example
 *		<div data-role="page" id="pageId">
 *			<div data-role="header" data-position="fixed">
 *				<h1>title</h1>
 *				<nav data-role="navigation" id="navigation"></nav>
 *			</div>
 *			<div data-role="content"></div>
 *		</div>
 *
 * ##HTML Examples
 *
 * ####How to use Navigation Bar in your code
 *
 * This component is made to support navigational
 * indication on panel change mainly. So Navigation Bar is
 * not only hard to be used alone, but also not efficient with solo usage.
 *
 * The essential function of navigation bar is to add navigational item
 * according to the given element's id. And this component also
 * provides navigational changes on the click of each item.
 *
 *
 * To create a navigation bar, navigation bar needs to be defined in
 * your HTMl with 'data-role="navigation"' or 'class="ui-navigation"'.
 *
 * 		@example
 *		<div data-role="page" id="navigation-bar">
 *			<!-- declare navigation in header -->
 *			<div data-role="header" data-position="fixed">
 *				<h1>Navigation Bar</h1>
 *				<nav data-role="navigation" id="navigation"></nav>
 *			</div>
 *
 *			<!-- you can put several panels to move -->
 *			<div data-role="content">
 *			</div>
 *		</div>
 *
 * @since 2.3
 * @class ns.widget.mobile.Navigation
 * @component-selector .ui-navigation, [data-role]="navigation"
 * @extends ns.widget.BaseWidget
 * @author Junhyeon Lee <juneh.lee@samsung.com>
 * @author Maciej Moczulski <m.moczulsku@samsung.com>
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 * @author Heeju Joo <heeju.joo@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Koeun Choi <koeun.choi@samsung.com>
 * @author Piort Karny <p.karny@samsung.com>
 * @author Krzysztof Antonszek <k.antonszek@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/event",
			"../../../core/engine",
			"../../../core/util/selectors",
			"./BaseWidgetMobile",
			"../../../core/widget/BaseKeyboardSupport"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				BaseKeyboardSupport = ns.widget.core.BaseKeyboardSupport,
				engine = ns.engine,
				events = ns.event,
				selectors = ns.util.selectors,
				Navigation = function () {
					var self = this;

					BaseKeyboardSupport.call(this);
					self._clickBound = null;
					self._ui = {};
					self._navigationStack = [];
				},

				attributes = {
					POSITION: "data-position"
				},
				/**
				 * Dictionary object containing commonly used widget classes
				 * @property {Object} classes
				 * @static
				 * @member ns.widget.mobile.Navigation
				 */
				classes = {
					/**
					 * Standard navigation widget
					 * @style ui-navigation
					 * @member ns.widget.mobile.Navigation
					 */
					NAVIGATION: "ui-navigation",
					/**
					 * Set a container with navigation widget
					 * @style ui-navigation-container
					 * @member ns.widget.mobile.Navigation
					 */
					NAVIGATION_CONTAINER: "ui-navigation-container",
					/**
					 * Set an item of navigation widget
					 * @style ui-navigation-item
					 * @member ns.widget.mobile.Navigation
					 */
					NAVIGATION_ITEM: "ui-navigation-item",
					/**
					 * Set navigation widget as active
					 * @style ui-navigation-active
					 * @member ns.widget.mobile.Navigation
					 */
					NAVIGATION_ACTIVE: "ui-navigation-active",
					/**
					 * Hide navigation widget
					 * @style ui-navigation-hide
					 * @member ns.widget.mobile.Navigation
					 */
					NAVIGATION_HIDE: "ui-navigator-hide",
					/**
					 * Set item to back in navigation widget
					 * @style ui-navigation-hide
					 * @member ns.widget.mobile.Navigation
					 */
					NAVIGATION_BACK: "ui-navigator-back",
					/**
					 * Hide item back in navigation widget
					 * @style ui-navigation-hide
					 * @member ns.widget.mobile.Navigation
					 */
					NAVIGATION_BACK_HIDE: "ui-navigator-back-hide",
					/**
					 * Set active animation in navigation widget
					 * @style ui-navigation-hide
					 * @member ns.widget.mobile.Navigation
					 */
					NAVIGATION_ACTIVE_ANIMATION: "ui-navigator-active-animation"
				},
				prototype = new BaseWidget();

			Navigation.prototype = prototype;
			Navigation.classes = classes;
			Navigation.attributes = attributes;

			/**
			 * Navigation navigateTrigger function
			 * @method navigateTrigger
			 * @private
			 * @static
			 * @param {event} event
			 * @member ns.widget.mobile.Navigation
			 */
			function onClick(event) {
				var self = this,
					target = selectors.getClosestByClass(event.target, classes.NAVIGATION_ITEM),
					position = target && parseInt(target.getAttribute(attributes.POSITION), 10),
					stack = self._navigationStack,
					id = stack[position],
					toRemoveLength = stack.length - 1 - position;

				if (target) {
					setTimeout(function () {
						if (!target.classList.contains(classes.NAVIGATION_ACTIVE) && stack[stack.length - 1] !== id) {
							self.pop(toRemoveLength);
							self.trigger("navigate", {
								id: id,
								//element Id to move
								position: position
							});
						}
					}, 0);
				}
			}

			/**
			 * Build structure of Navigation widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Navigation
			 */
			prototype._build = function (element) {
				var container;

				element.classList.add(classes.NAVIGATION);
				container = document.createElement("ul");
				container.classList.add(classes.NAVIGATION_CONTAINER);

				this._ui.container = container;

				element.appendChild(container);
				return element;
			};

			/**
			 * Bind events of Navigation widget
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Navigation
			 */
			prototype._bindEvents = function (element) {
				var self = this;

				self._clickBound = onClick.bind(self);
				element.addEventListener("vclick", self._clickBound, false);
			};


			/**
			 * Initiate creating navigation bar in old version way
			 * @method create
			 * @public
			 * @deprecated
			 * @member ns.widget.mobile.Navigation
			 */
			prototype.create = function () {
				ns.warn("Create method is deprecated because with 'create' method," +
				"it is hard to meet the newly changed Navigation function. " +
				"To handle Navigation Bar, please utilize 'push' method with " +
				"and 'panelChanger' component, instead.");
			};

			/**
			 * Remove navigation bar item or items
			 * @param {number} count
			 * @method pop
			 * @member ns.widget.mobile.Navigation
			 */
			prototype.pop = function (count) {
				var self = this,
					container = self._ui.container,
					stack = self._navigationStack,
					lastChild = container.lastChild,
					lastChildClassList = lastChild && lastChild.classList,
					previousLastChildClassList = lastChild && lastChild.previousElementSibling && lastChild.previousElementSibling.classList;

				if (count === undefined) {
					count = 1;
				}

				if (lastChildClassList) {
					lastChildClassList.add(classes.NAVIGATION_HIDE);
					if (previousLastChildClassList) {
						previousLastChildClassList.add(classes.NAVIGATION_BACK);
						previousLastChildClassList.add(classes.NAVIGATION_ACTIVE);
						events.one(lastChild, "animationend, webkitAnimationEnd", function () {
							container.removeChild(container.lastChild);
							lastChildClassList.remove(classes.NAVIGATION_BACK);
							if (count > 1) {
								self.pop(count - 1);
							}
						});
					}
					stack.pop();
				}
			};

			/**
			 * Add navigation bar item only one at a time
			 * @method push
			 * @param {string} id
			 * @member ns.widget.mobile.Navigation
			 */
			prototype.push = function (id) {
				var self = this,
					element = self.element,
					stack = self._navigationStack,
					container = self._ui.container,
					itemLength = container.childElementCount,
					lastChild = container.lastElementChild,
					lastChildClassList = lastChild && lastChild.classList,
					listClassList = null,
					list,
					arrow,
					text;

				stack.push(id);
				if (itemLength > 0) {
					lastChildClassList.add(classes.NAVIGATION_BACK_HIDE);
					events.one(lastChild, "animationend webkitAnimationEnd", function () {
						//both animation end events should trigger right after push but often only one triggered
						//and second triggered after using pop method and thus removed unintentionally useful classes
						if (lastChild !== self._ui.container.lastElementChild) {
							lastChildClassList.remove(classes.NAVIGATION_BACK_HIDE);
							lastChildClassList.remove(classes.NAVIGATION_ACTIVE);
						}
					});
				}

				list = document.createElement("li");
				list.setAttribute(attributes.POSITION, itemLength);
				listClassList = list.classList;
				listClassList.add(classes.NAVIGATION_ITEM);

				if (itemLength > 0) {
					arrow = document.createElement("span");
					arrow.classList.add("ui-arrow");
					list.appendChild(arrow);
				}

				text = document.createElement("a");
				text.classList.add("ui-text");
				text.setAttribute("href", "#" + id);
				text.innerHTML = id;
				list.appendChild(text);

				listClassList.add(classes.NAVIGATION_ACTIVE);
				listClassList.add(classes.NAVIGATION_ACTIVE_ANIMATION);
				events.one(list, "animationend webkitAnimationEnd", function () {
					listClassList.remove(classes.NAVIGATION_ACTIVE_ANIMATION);
				});

				container.appendChild(list);
				if (container.offsetWidth > element.offsetWidth) {
					element.scrollLeft = container.offsetWidth - element.offsetWidth;
				}
			};

			/**
			 * Destroy Navigation widget
			 * @method _destroy
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.Navigation
			 */
			prototype._destroy = function (element) {
				var self = this;

				element.removeEventListener("vclick", self._clickBound, false);
				element.removeChild(self._ui.container);
				self._clickBound = null;
				self._ui = null;
				self._navigationStack = null;
			};

			BaseKeyboardSupport.registerActiveSelector(".ui-navigation .ui-text");

			ns.widget.mobile.Navigation = Navigation;
			engine.defineWidget(
				"Navigation",
				"[data-role='navigation'], .ui-navigation",
				[
					"push",
					"pop",
					"create"
				],
				Navigation,
				"mobile"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Navigation;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
