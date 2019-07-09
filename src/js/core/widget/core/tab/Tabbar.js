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
 * # Tab Bar Widget
 * The tabbar widget shows an unordered list of tabs on the screen wrapped
 * together in a single group.
 *
 * This widget can be placed in at top of page inside Tabs widget.
 *
 * ## Default selectors
 * In default elements matches to:
 *
 *  - HTML elements with data-role="tabbar"
 *  - HTML elements with class ui-tabbar
 *
 * ###HTML Examples
 *
 * ####Create simple tab bar in header
 *
 *        @example
 *        <div data-role="page">
 *            <div data-role="header">
 *                <div data-role="tabbar">
 *                    <ul>
 *                        <li><a data-icon="naviframe-edit">Tabbar1</a></li>
 *                        <li><a data-icon="naviframe-cancel">Tabbar2</a></li>
 *                        <li><a data-icon="naviframe-call">Tabbar3</a></li>
 *                    </ul>
 *                </div>
 *            </div>
 *            <div data-role="content">
 *                Content
 *            </div>
 *        </div>
 *
 * ####Create simple tab bar in footer
 *
 *        @example
 *        <div data-role="page">
 *            <div data-role="content">Content</div>
 *            <div data-role="footer">
 *                <div data-role="tabbar">
 *                    <ul>
 *                        <li><a data-icon="naviframe-edit">Tabbar1</a></li>
 *                        <li><a data-icon="naviframe-cancel">Tabbar2</a></li>
 *                        <li><a data-icon="naviframe-call">Tabbar3</a></li>
 *                    </ul>
 *                </div>
 *            </div>
 *        </div>
 *
 * ## Manual constructor
 * For manual creation of search bar widget you can use constructor of widget from
 * **tau** namespace:
 *
 *        @example
 *        <div data-role="page" id="tab-bar-page">
 *            <div data-role="header">
 *                <div id="ready-for-tab-bar">
 *                    <ul>
 *                        <li><a data-icon="naviframe-edit">Tabbar1</a></li>
 *                        <li><a data-icon="naviframe-cancel">Tabbar2</a></li>
 *                        <li><a data-icon="naviframe-call">Tabbar3</a></li>
 *                    </ul>
 *                </div>
 *            </div>
 *            <div data-role="content">Content</div>
 *      </div>
 *        <script>
 *            (function (document) {
 *				var pageElement = document.getElementById("tab-bar-page"),
 *					tabBarElement = document.getElementById("ready-for-tab-bar"),
 *					tabBar;
 *
 *				function createPageHandle() {
 *					tabBar = tau.widget.TabBar(tabBarElement);
 *				}
 *
 *				pageElement.addEventListener("pagecreate", createPageHandle);
 *			}(document));
 *        </script>
 *
 * Constructor has one require parameter **element** which are base
 * **HTMLElement** to create widget. We recommend get this element by method
 * *document.getElementById*. Second parameter is **options** and it is a object
 * with options for widget.
 *
 * If jQuery library is loaded, its method can be used:
 *
 *        @example
 *        <div data-role="page" id="tab-bar-page">
 *            <div data-role="header">
 *                <div id="ready-for-tab-bar">
 *                    <ul>
 *                        <li><a data-icon="naviframe-edit">Tabbar1</a></li>
 *                        <li><a data-icon="naviframe-cancel">Tabbar2</a></li>
 *                        <li><a data-icon="naviframe-call">Tabbar3</a></li>
 *                    </ul>
 *                </div>
 *            </div>
 *            <div data-role="content">Content</div>
 *        </div>
 *        <script>
 *            (function (document) {
 *				function createPageHandle() {
 *					$("#ready-for-tab-bar").tabbar();
 *				}
 *
 *				$("#tab-bar-page").on("pagecreate", createPageHandle);
 *			}(document));
 *        </script>
 *
 * jQuery Mobile constructor has one optional parameter is **options** and it is
 * a object with options for widget.
 *
 * ##Options for tab bar widget
 *
 * Options for widget can be defined as _data-..._ attributes or give as
 * parameter in constructor.
 *
 * You can change option for widget using method **option**.
 *
 * ##Methods
 *
 * To call method on widget you can use one of existing API:
 *
 * First API is from tau namespace:
 *
 *        @example
 *        <script>
 *        var tabBarElement = document.getElementById("tab-bar"),
 *            tabBar = tau.widget.TabBar(TabBarElement);
 *
 *        tabBar.methodName(methodArgument1, methodArgument2, ...);
 *        </script>
 *
 * Second API is jQuery Mobile API and for call _methodName_ you can use:
 *
 *        @example
 *        <script>
 *        $(".selector").tabbar("methodName", methodArgument1, methodArgument2, ...);
 *        </script>
 *
 * @class ns.widget.core.TabBar
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
			"../../../event/gesture/Drag",
			"../Scrollview",
			"../Tab",
			"../Page"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var Tab = ns.widget.core.Tab,
				TabPrototype = Tab.prototype,
				engine = ns.engine,
				Page = ns.widget.core.Page,
				domUtils = ns.util.DOM,

				TabBar = function () {
					var self = this;

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
					 * @member ns.widget.core.TabBar
					 */
					self.options = {
						active: 0,
						autoChange: true,
						autoPositionSet: true
					};
					self._marqueeOptions = {
						ellipsisEffect: "none",
						marqueeStyle: "scroll",
						iteration: "infinite",
						delay: 1000
					};
				},
				CLASS_PREFIX = "ui-tabbar",
				/**
				 * Object with class dictionary
				 * @property {Object} classes
				 * @static
				 * @member ns.widget.core.TabBar
				 * @readonly
				 */
				classes = {
					TABBAR: CLASS_PREFIX,
					TAB_ACTIVE: "ui-tab-active",
					TAB_NO_TEXT: "ui-tab-no-text",
					TITLE: "ui-title",
					TABS_WITH_TITLE: "ui-tabs-with-title",
					TABBAR_WITH_TITLE: CLASS_PREFIX + "-with-title",
					TABBAR_BEFORE_TITLE: CLASS_PREFIX + "-before-title",
					TABBAR_WITH_ICON: CLASS_PREFIX + "-with-icon",
					TABBAR_PORTRAIT: CLASS_PREFIX + "-portrait",
					TABBAR_LANDSCAPE: CLASS_PREFIX + "-landscape",
					TABBAR_TEXT: CLASS_PREFIX + "-text",
					TABBAR_STATIC: CLASS_PREFIX + "-static",
					ANCHOR: CLASS_PREFIX + "-anchor",
					INACTIVE_TOO_LONG_TEXT: CLASS_PREFIX + "-inactive-text-overflow"
				},
				events = ns.event,
				DEFAULT_NUMBER = {
					PORTRAIT_LIMIT_LENGTH: 3,
					PORTRAIT_DEVIDE_NUMBER: 3.7,
					LANDSCAPE_LIMIT_LENGTH: 4,
					LANDSCAPE_DEVIDE_NUMBER: 4.7,
					WITH_ICON_WITH_TITLE: 2,
					WITH_ICON_NO_TITLE: 4,
					DURATION: 250
				},
				prototype = new Tab();

			TabBar.prototype = prototype;
			TabBar.classes = classes;

			function findTitle(element) {
				var parentNode = element.parentNode,
					title;

				while (parentNode && !parentNode.classList.contains(Page.classes.uiPage)) {
					title = parentNode.querySelector("." + classes.TITLE);
					if (title) {
						return title;
					}
					parentNode = parentNode.parentNode;
				}
				return 0;
			}

			/**
			 * Configure widget options, detect active item based on classes
			 * @method _configure
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.core.TabBar
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
			 * Detect structure and add base classes for element
			 * @method _detectType
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.TabBar
			 */
			prototype._detectType = function (element) {
				var self = this,
					type = self._type,
					title = findTitle(element),
					link = element.querySelector("li a");

				if (title) {
					title.parentNode.classList.add(classes.TABS_WITH_TITLE);
					element.classList.add(classes.TABBAR_WITH_TITLE);
					type.withTitle = true;
				}
				if (element.nextElementSibling === title || element.nextElementSibling === title.parentNode) {
					element.classList.add(classes.TABBAR_BEFORE_TITLE);
				}
				if (link && link.hasAttribute("data-icon")) {
					element.classList.add(classes.TABBAR_WITH_ICON);
					type.withIcon = true;
				}
			};

			/**
			 * Build tabs and links, add classes, create span labels
			 * @method _buildTabsAndLinks
			 * @param {HTMLElement} element
			 * @return {boolean}
			 * @protected
			 * @member ns.widget.core.TabBar
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
					ns.warn("There is no tab element, TabBar wasn't build.");
					return false;
				}
				for (i = 0, linksLength = links.length; i < linksLength; i++) {
					link = links[i];
					text = link.firstChild;
					if (text) {
						innerText = document.createElement("span");
						innerText.classList.add(classes.TABBAR_TEXT);
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
			 * @member ns.widget.core.TabBar
			 */
			prototype._build = function (element) {
				var self = this;

				element.classList.add(classes.TABBAR);

				if (!self._buildTabsAndLinks(element)) {
					return null;
				}

				self._detectType(element);

				return element;
			};

			/**
			 * Method read current orientation and set state of widget for correct state;
			 * @param {HTMLElement} element
			 * @method _initOrientation
			 * @member ns.widget.core.TabBar
			 * @protected
			 */
			prototype._initOrientation = function (element) {
				var type = this._type,
					classList = element.classList;

				if (window.innerWidth < window.innerHeight) {
					classList.remove(classes.TABBAR_LANDSCAPE);
					classList.add(classes.TABBAR_PORTRAIT);
					type.orientation = "portrait";
				} else {
					classList.remove(classes.TABBAR_PORTRAIT);
					classList.add(classes.TABBAR_LANDSCAPE);
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
					isStatic = element.classList.contains(classes.TABBAR_STATIC);

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
			 * @member ns.widget.core.TabBar
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
			 * @member ns.widget.core.TabBar
			 */
			prototype._bindEvents = function () {
				var self = this,
					element = self.element,
					tabs = self._ui.tabs;

				events.enableGesture(
					element,
					new events.gesture.Drag()
				);
				events.on(element, "drag dragend", self, false);
				events.on(tabs, "vclick", self, false);
				window.addEventListener("resize", self, false);
			};

			/**
			 * Unbind events for widget
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.core.TabBar
			 */
			prototype._unBindEvents = function () {
				var self = this,
					element = self.element,
					tabs = self._ui.tabs;

				events.disableGesture(
					element,
					new events.gesture.Drag()
				);
				events.off(element, "drag dragend", self, false);
				events.off(tabs, "vclick", self, false);
				window.removeEventListener("resize", self, false);
			};

			/**
			 * Handle events
			 * @method handleEvent
			 * @param {Event} event
			 * @member ns.widget.core.TabBar
			 */
			prototype.handleEvent = function (event) {
				var self = this;

				switch (event.type) {
					case "drag":
						self._onDrag(event);
						break;
					case "dragend":
						self._onDragEnd(event);
						break;
					case "vclick":
						self._onClick(event);
						break;
					case "resize":
						self._init(self.element);
				}
			};

			/**
			 * translate tabbar element
			 * @method _translate
			 * @param {number} x position
			 * @param {number} duration of animation
			 * @protected
			 * @member ns.widget.core.TabBar
			 */
			prototype._translate = function (x, duration) {
				var self = this,
					element = this.element;

				if (duration) {
					domUtils.setPrefixedStyle(element, "transition", domUtils.getPrefixedValue("transform " + duration / 1000 + "s ease-out"));
				}

				domUtils.setPrefixedStyle(element, "transform", "translate3d(" + x + "px, 0px, 0px)");

				self._lastX = x;
			};

			/**
			 * click event handler
			 * @method _onClick
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.core.TabBar
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
			 * Drag event handler
			 * @method _onDrag
			 * @protected
			 * @param {Event} event
			 * @member ns.widget.core.TabBar
			 */
			prototype._onDrag = function (event) {
				var self = this,
					element = self.element;

				self._translate(
					Math.max(
						element.parentNode.offsetWidth - element.offsetWidth,
						Math.min(self._translatedX + event.detail.deltaX, 0)
					),
					0
				);
			};
			/**
			 * Dragend event handler
			 * @method _onDragEnd
			 * @protected
			 * @member ns.widget.core.TabBar
			 */
			prototype._onDragEnd = function () {
				var self = this;

				self._translatedX = self._lastX;
			};

			/**
			 * set the active tab
			 * @method _setActive
			 * @param {number} index
			 * @protected
			 * @member ns.widget.core.TabBar
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

				if (ui.links.length === 0) {
					return;
				}
				// disable previous link
				link = ui.links[options.active]
				link.classList.remove(classes.TAB_ACTIVE);
				text = link.querySelector("." + classes.TABBAR_TEXT);
				if (text) {
					marquee = ns.engine.getBinding(text);
					if (marquee) {
						marquee.reset();
						ns.engine.destroyWidget(text);
						link.classList.add(classes.INACTIVE_TOO_LONG_TEXT);
					}
				}

				// enable new link
				link = ui.links[index];
				link.classList.add(classes.TAB_ACTIVE);
				options.active = index;

				// enable Marquee widget on text content for active tab
				// if text content is longer then link
				text = link.querySelector("." + classes.TABBAR_TEXT);
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

				self._setTabbarPosition();
				TabPrototype._setActive.call(self, index);
			};

			/**
			 * set Tabbar position automatically
			 * @method _setTabbarPosition
			 * @protected
			 * @member ns.widget.core.TabBar
			 */
			prototype._setTabbarPosition = function () {
				var self = this,
					activeIndex = self.options.active,
					tabs = self._ui.tabs,
					tabBarRect = self.element.getBoundingClientRect(),
					parentElementWidth = self.element.parentElement.offsetWidth,
					previousElementLeftPos,
					transformX;

				if (tabBarRect.width >= parentElementWidth) {
					if (activeIndex <= 1) {
						self._translate(0, DEFAULT_NUMBER.DURATION);
					} else if (activeIndex >= (tabs.length - 2)) {
						// Show last element on the right edge.
						self._translate(parentElementWidth - tabBarRect.width, DEFAULT_NUMBER.DURATION);
					} else {
						previousElementLeftPos = tabs[activeIndex - 1].getBoundingClientRect().left;
						transformX = previousElementLeftPos - tabBarRect.left;

						if (tabBarRect.width - transformX >= parentElementWidth) {
							self._translate(-transformX, DEFAULT_NUMBER.DURATION);
						} else {
							// Rest of the elements too narrow to cover whole tabbar.
							// Set scroll to show last element on the right edge.
							self._translate(parentElementWidth - tabBarRect.width, DEFAULT_NUMBER.DURATION);
						}
					}
				}
			};
			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.core.TabBar
			 */
			prototype._destroy = function () {
				var self = this;

				self._unBindEvents();
				self._type = null;
				self._ui = null;
				self.options = null;
			};

			ns.widget.core.TabBar = TabBar;
			engine.defineWidget(
				"TabBar",
				"[data-role='tabbar'], ." + CLASS_PREFIX,
				[
					"setActive",
					"getActive"
				],
				TabBar
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.TabBar;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
