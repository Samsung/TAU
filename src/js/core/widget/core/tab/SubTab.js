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
/*jslint nomen: true, plusplus: true */
/**
 * # Sub Tab Widget
 * The subTab widget shows an unordered list of tabs on the screen wrapped
 * together in a single group.
 *
 * This widget can be placed in at top of page inside Tabs widget.
 *
 * ## Default selectors
 * In default elements matches to:
 *
 *  - HTML elements with class ui-sub-tab
 *
 * ##Methods
 *
 * To call method on widget you can use one of existing API:
 *
 * First API is from tau namespace:
 *
 *        @example
 *        <script>
 *        var subTabElement = document.getElementById("sub-tab"),
 *            subTab = tau.widget.SubTab(SubTabElement);
 *
 *        subTab.methodName(methodArgument1, methodArgument2, ...);
 *        </script>
 *
 * Second API is jQuery Mobile API and for call _methodName_ you can use:
 *
 *        @example
 *        <script>
 *        $(".selector").subTab("methodName", methodArgument1, methodArgument2, ...);
 *        </script>
 *
 * @class ns.widget.core.SubTab
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../BaseWidget",
			"../../../engine",
			"../../../util/selectors",
			"../../../util/grid",
			"../../../util/DOM",
			"../../../util/DOM/attributes",
			"../../../util/DOM/css",
			"../../../event/vmouse",
			"../../../event",
			"../../../event/gesture/Instance",
			"../Scrollview",
			"../Tab",
			"../Page",
			"../../BaseKeyboardSupport"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var Tab = ns.widget.core.Tab,
				TabPrototype = Tab.prototype,
				engine = ns.engine,
				domUtils = ns.util.DOM,
				BaseKeyboardSupport = ns.widget.core.BaseKeyboardSupport,

				SubTab = function () {
					var self = this;

					BaseKeyboardSupport.call(this);

					self._type = {
						orientation: "portrait",
						withIcon: false,
						withTitle: false,
						static: false
					};
					self._ui = {
						tabs: [],
						links: []
					};
					/**
					 * Object with default options
					 * @property {Object} options
					 * @property {string} [options.active="0"] Number of activated tab.
					 * @property {string} [options.autoChange=true] Defined if widget should set
					 * @member ns.widget.core.SubTab
					 */
					self.options = {
						active: 0,
						autoChange: true,
						autoPositionSet: true
					};
					self._marqueeOptions = {
						ellipsisEffect: "none",
						marqueeStyle: "endToEnd",
						iteration: "infinite",
						delay: 1000
					};
					self._actualActiveTab = null;
				},
				CLASS_PREFIX = "ui-sub-tab",
				/**
				 * Object with class dictionary
				 * @property {Object} classes
				 * @static
				 * @member ns.widget.core.SubTab
				 * @readonly
				 */
				classes = {
					SUBTAB: CLASS_PREFIX,
					TAB_ACTIVE: "ui-tab-active",
					TAB_NO_TEXT: "ui-tab-no-text",
					TITLE: "ui-title",
					SUBTAB_PORTRAIT: CLASS_PREFIX + "-portrait",
					SUBTAB_LANDSCAPE: CLASS_PREFIX + "-landscape",
					SUBTAB_TEXT: CLASS_PREFIX + "-text",
					SUBTAB_STATIC: CLASS_PREFIX + "-static",
					ANCHOR: CLASS_PREFIX + "-anchor",
					INACTIVE_TOO_LONG_TEXT: CLASS_PREFIX + "-inactive-text-overflow"
				},
				events = ns.event,
				prototype = new Tab();

			SubTab.prototype = prototype;
			SubTab.classes = classes;
			SubTab.selector = "." + CLASS_PREFIX +
				",[data-role='tabbar'],.ui-tabbar"; // deprecated selector

			/**
			 * Configure widget options, detect active item based on classes
			 * @method _configure
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.core.SubTab
			 */
			prototype._configure = function (element) {
				var links = element.querySelectorAll("li a"),
					activeIndex = -1;

				[].forEach.call(links, function (linkElement, index) {
					if (linkElement.classList.contains(classes.TAB_ACTIVE)) {
						activeIndex = index;
					}
				});
				if (activeIndex > -1) {
					this.options.active = activeIndex;
				}
			};

			/**
			 * Build tabs and links, add classes, create span labels
			 * @method _buildTabsAndLinks
			 * @param {HTMLElement} element
			 * @return {boolean}
			 * @protected
			 * @member ns.widget.core.SubTab
			 */
			prototype._buildTabsAndLinks = function (element) {
				var self = this,
					ui = self._ui,
					tabs = element.querySelectorAll("li"),
					links = element.querySelectorAll("li a"),
					innerText,
					i,
					linksLength,
					link,
					text,
					textRealWidth,
					visibleTextWidth,
					prevTextOverflowVal;

				if (links.length === 0) {
					links = element.querySelectorAll("li div");
				}
				if (links.length === 0) {
					ns.warn("There is no tab element, SubTab wasn't build.");
					return false;
				}
				for (i = 0, linksLength = links.length; i < linksLength; i++) {
					link = links[i];
					text = link.firstChild;
					if (text) {
						innerText = document.createElement("span");
						innerText.classList.add(classes.SUBTAB_TEXT);
						innerText.appendChild(link.firstChild);
						link.appendChild(innerText);

						prevTextOverflowVal = innerText.style.overflowX;
						visibleTextWidth = innerText.getBoundingClientRect().width;
						innerText.style.overflowX = "visible";
						textRealWidth = innerText.getBoundingClientRect().width;
						innerText.style.overflowX = prevTextOverflowVal;

						if (textRealWidth > visibleTextWidth) {
							link.classList.add(classes.INACTIVE_TOO_LONG_TEXT);
						}

					} else {
						link.classList.add(classes.TAB_NO_TEXT);
					}
					link.classList.add(classes.ANCHOR);
				}
				ui.links = links;
				ui.tabs = tabs;
				return true;
			};

			/**
			 * Build method
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement|null}
			 * @protected
			 * @member ns.widget.core.SubTab
			 */
			prototype._build = function (element) {
				var self = this;

				element.classList.add(classes.SUBTAB);

				if (!self._buildTabsAndLinks(element)) {
					return null;
				}

				return element;
			};

			/**
			 * Method read current orientation and set state of widget for correct state;
			 * @param {HTMLElement} element
			 * @method _initOrientation
			 * @member ns.widget.core.SubTab
			 * @protected
			 */
			prototype._initOrientation = function (element) {
				var type = this._type,
					classList = element.classList;

				if (window.innerWidth < window.innerHeight) {
					classList.remove(classes.SUBTAB_LANDSCAPE);
					classList.add(classes.SUBTAB_PORTRAIT);
					type.orientation = "portrait";
				} else {
					classList.remove(classes.SUBTAB_PORTRAIT);
					classList.add(classes.SUBTAB_LANDSCAPE);
					type.orientation = "landscape";
				}
			};

			/**
			 * Method init all width of elements and update state of widget.
			 * @param {HTMLElement} element
			 * @method _initStaticAndWidths
			 * @private
			 */
			prototype._initStaticAndWidths = function (element) {
				var self = this,
					isStatic,
					tabs = self._ui.tabs,
					offsetWidth = element.getBoundingClientRect().width,
					length = tabs.length,
					wholeWidth = 0,
					elementWidth,
					i;

				// check that element is visible
				if (offsetWidth) {
					// get from class
					isStatic = element.classList.contains(classes.SUBTAB_STATIC);

					// check if we have enough elements to make the list dynamic again
					if (!isStatic && tabs[0]) {
						elementWidth = domUtils.getElementWidth(tabs[0]);
						// check NaN
						if (elementWidth === elementWidth && (elementWidth * length < offsetWidth)) {
							isStatic = true;
						}
					}

					self._type.static = isStatic;

					for (i = 0; i < length; i++) {
						// make the elements "fit"
						if (isStatic) {
							elementWidth = parseInt(offsetWidth / length, 10) || 0;
							tabs[i].style.width = elementWidth + "px";
						} else {
							// just get each element with for scroll support
							elementWidth = domUtils.getElementWidth(tabs[i]);
						}
						wholeWidth += elementWidth;
					}

					self._wholeWidth = wholeWidth;
				}
			};

			/**
			 * Init method
			 * @method _init
			 * @param {HTMLElement} element
			 * @member ns.widget.core.SubTab
			 * @protected
			 */
			prototype._init = function (element) {
				var self = this;

				self._initOrientation(element);
				self._initStaticAndWidths(element);

				self._translatedX = 0;
				self._lastX = 0;

				self._setActive(self.options.active);

				return element;
			};

			/**
			 * Bind events for widget
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.core.SubTab
			 */
			prototype._bindEvents = function () {
				var self = this,
					tabs = self._ui.tabs;

				events.on(tabs, "vclick", self, false);
				window.addEventListener("resize", self, false);
			};

			/**
			 * Unbind events for widget
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.core.SubTab
			 */
			prototype._unBindEvents = function () {
				var self = this,
					tabs = self._ui.tabs;

				events.off(tabs, "vclick", self, false);
				window.removeEventListener("resize", self, false);
			};

			/**
			 * Handle events
			 * @method handleEvent
			 * @param {Event} event
			 * @member ns.widget.core.SubTab
			 */
			prototype.handleEvent = function (event) {
				var self = this;

				switch (event.type) {
					case "vclick":
						self._onClick(event);
						break;
					case "resize":
						self._init(self.element);
				}
			};

			/**
			 * click event handler
			 * @method _onClick
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.core.SubTab
			 */
			prototype._onClick = function (event) {
				var self = this,
					ui = self._ui,
					options = self.options,
					selectTab = event.currentTarget.querySelector("A"),
					index,
					i,
					tabLength;

				for (i = 0, tabLength = ui.links.length; i < tabLength; i++) {
					if (ui.links[i] === selectTab) {
						index = i;
						break;
					}
					index = 0;
				}

				if (options.autoChange) {
					self._setActive(index);
				}
			};

			/**
			 * set the active tab
			 * @method _setActive
			 * @param {number} index
			 * @protected
			 * @member ns.widget.core.SubTab
			 */
			prototype._setActive = function (index) {
				var self = this,
					options = self.options,
					ui = self._ui,
					link,
					text,
					marquee,
					prevStyleValue,
					textWidth,
					allTextWidth;

				if (ui.links.length === 0 || index === self._actualActiveTab) {
					return;
				}
				// disable previous link
				link = ui.links[options.active]
				link.classList.remove(classes.TAB_ACTIVE);
				text = link.querySelector("." + classes.SUBTAB_TEXT);
				if (text) {
					marquee = ns.engine.getBinding(text);
					if (marquee) {
						marquee.reset();
						ns.engine.destroyWidget(text);
						link.classList.add(classes.INACTIVE_TOO_LONG_TEXT);
					}
				}

				// if keyboard support
				if (self.isKeyboardSupport === true) {
					ui.links[index].focus();
				}

				// enable new link
				link = ui.links[index];
				link.classList.add(classes.TAB_ACTIVE);
				options.active = index;

				// enable Marquee widget on text content for active tab
				// if text content is longer then link
				text = link.querySelector("." + classes.SUBTAB_TEXT);
				if (text) {
					prevStyleValue = text.style.overflowX;
					textWidth = text.getBoundingClientRect().width;
					text.style.overflowX = "visible";
					allTextWidth = text.getBoundingClientRect().width;
					text.style.overflowX = prevStyleValue;

					if (allTextWidth > textWidth) {
						link.classList.remove(classes.INACTIVE_TOO_LONG_TEXT);
						ns.widget.Marquee(text, self._marqueeOptions);
					}
				}

				TabPrototype._setActive.call(self, index);
				self._actualActiveTab = index;
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.core.SubTab
			 */
			prototype._destroy = function () {
				var self = this;

				self._unBindEvents();
				self._type = null;
				self._ui = null;
				self.options = null;
			};

			ns.widget.core.SubTab = SubTab;
			engine.defineWidget(
				"SubTab",
				SubTab.selector,
				[
					"setActive",
					"getActive"
				],
				SubTab
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.SubTab;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
