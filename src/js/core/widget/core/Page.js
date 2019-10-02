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
/*jslint nomen: true */
/**
 * # Page Widget
 * Page is main element of application's structure.
 *
 * ## Default selectors
 * In the Tizen Web UI framework the application page structure is based on a header, content and footer elements:
 *
 * - **The header** is placed at the top, and displays the page title and optionally buttons.
 * - **The content** is the section below the header, showing the main content of the page.
 * - **The footer** is a bottom part of page which can display for example buttons
 *
 * The following table describes the specific information for each section.
 *
 * <table>
 *     <tr>
 *         <th>Section</th>
 *         <th>Class</th>
 *         <th>Mandatory</th>
 *         <th>Description</th>
 *     </tr>
 *     <tr>
 *         <td rowspan="2">Page</td>
 *         <td>ui-page</td>
 *         <td>Yes</td>
 *         <td>Defines the element as a page.
 *
 * The page widget is used to manage a single item in a page-based architecture.
 *
 * A page is composed of header (optional), content (mandatory), and footer (optional) elements.</td>
 *      </tr>
 *      <tr>
 *          <td>ui-page-active</td>
 *          <td>No</td>
 *          <td>If an application has a static start page, insert the ui-page-active class in the page element to
 *          speed up the application launch. The start page with the ui-page-active class can be displayed before
 *          the framework is fully loaded.
 *
 *          If this class is not used, the framework inserts the class automatically to the first page of the
 *          application.
 *
 *          However, this has a slowing effect on the application launch, because the page is displayed only after
 *          *the* framework is fully loaded.</td>
 *      </tr>
 *      <tr>
 *          <td>Header</td>
 *          <td>ui-header</td>
 *          <td>No</td>
 *          <td>Defines the element as a header.</td>
 *      </tr>
 *      <tr>
 *          <td>Content</td>
 *          <td>ui-content</td>
 *          <td>Yes</td>
 *          <td>Defines the element as content.</td>
 *      </tr>
 *      <tr>
 *          <td>Footer</td>
 *          <td>ui-footer</td>
 *          <td>No</td>
 *          <td>Defines the element as a footer.
 *
 * The footer section is mostly used to include option buttons.</td>
 *      </tr>
 *  </table>
 *
 * All elements with class=ui-page will be become page widgets
 *
 *      @example
 *         <!--Page layout-->
 *         <div class="ui-page ui-page-active">
 *             <header class="ui-header"></header>
 *             <div class="ui-content"></div>
 *             <footer class="ui-footer"></footer>
 *         </div>
 *
 *         <!--Page layout with more button in header-->
 *         <div class="ui-page ui-page-active">
 *             <header class="ui-header ui-has-more">
 *                 <h2 class="ui-title">Call menu</h2>
 *                 <button type="button" class="ui-more ui-icon-overflow">More Options</button>
 *             </header>
 *             <div class="ui-content">Content message</div>
 *             <footer class="ui-footer">
 *                 <button type="button" class="ui-btn">Footer Button</button>
 *             </footer>
 *         </div>
 *
 * ## Manual constructor
 * For manual creation of page widget you can use constructor of widget from **tau** namespace:
 *
 *        @example
 *        var pageElement = document.getElementById("page"),
 *            page = tau.widget.Page(buttonElement);
 *
 * Constructor has one require parameter **element** which are base **HTMLElement** to create widget.
 * We recommend get
 * this element by method *document.getElementById*.
 *
 * ## Multi-page Layout
 *
 * You can implement a template containing multiple page containers in the application index.html file.
 *
 * In the multi-page layout, the main page is defined with the ui-page-active class.
 * If no page has the ui-page-active
 * class, the framework automatically sets up the first page in the source order
 * as the main page. You can improve the
 * launch performance by explicitly defining the main page to be displayed first.
 * If the application has to wait for
 * the framework to set up the main page, the page is displayed with some delay
 * only after the framework is fully
 * loaded.
 *
 * You can link to internal pages by referring to the ID of the page. For example, to link to the page with an ID
 * of
 * two, the link element needs the href="#two" attribute in the code, as in the following example.
 *
 *      @example
 *         <!--Main page-->
 *         <div id="one" class="ui-page ui-page-active">
 *             <header class="ui-header"></header>
 *             <div class="ui-content"></div>
 *             <footer class="ui-footer"></footer>
 *         </div>
 *
 *         <!--Secondary page-->
 *         <div id="two" class="ui-page">
 *             <header class="ui-header"></header>
 *             <div class="ui-content"></div>
 *             <footer class="ui-footer"></footer>
 *         </div>
 *
 * To find the currently active page, use the ui-page-active class.
 *
 * ## Changing Pages
 * ### Go to page in JavaScript
 * To change page use method *tau.changePage*
 *
 *      @example
 *      tau.changePage("page-two");
 *
 * ### Back in JavaScript
 * To back to previous page use method *tau.back*
 *
 *      @example
 *      tau.back();
 *
 * ## Transitions
 *
 * When changing the active page, you can use a page transition.
 *
 * Tizen Web UI Framework does not apply transitions by default. To set a custom transition effect,
 * you must add the
 * data-transition attribute to a link:
 *
 *      @example
 *      <a href="index.html" data-transition="slideup">I\'ll slide up</a>
 *
 * To set a default custom transition effect for all pages, use the pageTransition property:
 *
 *      @example
 *      tau.defaults.pageTransition = "slideup";
 *
 * ### Transitions list
 *
 *  - **none** no transition.
 *  - **slideup** Makes the content of the next page slide up, appearing to conceal the content of the previous page.
 *
 * ## Handling Page Events
 *
 * With page widget we have connected many of events.
 *
 * To handle page events, use the following code:
 *
 *      @example
 *        <div id="page" class="ui-page">
 *             <header class="ui-header"></header>
 *             <div class="ui-content"></div>
 *         </div>
 *
 *         <script>
 *             var page = document.getElementById("page");
 *             page.addEventListener("Event", function(event) {
 *                 // Your code
 *             });
 *         </script>
 *
 * To bind an event callback on the Back key, use the following code:
 *
 * Full list of available events is in [events list section](#events-list).
 *
 * To bind an event callback on the Back key, use the following code:
 *
 *      @example
 *         <script>
 *             window.addEventListener("tizenhwkey", function (event) {
 *                 if (event.keyName == "back") {
 *                     // Call window.history.back() to go to previous browser window
 *                     // Call tizen.application.getCurrentApplication().exit() to exit application
 *                     // Add script to add another behavior
 *                 }
 *             });
 *         </script>
 *
 *
 * ## Methods
 *
 * To call method on widget you can use tau API:
 *
 *        @example
 *        var pageElement = document.getElementById("page"),
 *            page = tau.widget.Page(buttonElement);
 *
 *        page.methodName(methodArgument1, methodArgument2, ...);
 *
 * @class ns.widget.core.Page
 * @extends ns.widget.BaseWidget
 * @component-selector .ui-page
 * @component-type container-component
 * @component-constraint 'popup', 'drawer', 'header', 'bottom-button'
 * @component-attachable false
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../util/selectors",
			"../../util/array",
			"../../util/DOM/attributes",
			"../../util/DOM/css",
			"../BaseWidget",
			"../core",
			"../BaseKeyboardSupport"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * Alias for {@link ns.widget.BaseWidget}
			 * @property {Object} BaseWidget
			 * @member ns.widget.core.Page
			 * @private
			 * @static
			 */
			var BaseWidget = ns.widget.BaseWidget,
				/**
				 * Alias for {@link ns.util}
				 * @property {Object} util
				 * @member ns.widget.core.Page
				 * @private
				 * @static
				 */
				util = ns.util,
				utilsDOM = util.DOM,
				/**
				 * Alias for {@link ns.util.selectors}
				 * @property {Object} utilSelectors
				 * @member ns.widget.core.Page
				 * @private
				 * @static
				 */
				utilSelectors = util.selectors,
				/**
				 * Alias for {@link ns.engine}
				 * @property {Object} engine
				 * @member ns.widget.core.Page
				 * @private
				 * @static
				 */
				engine = ns.engine,
				BaseKeyboardSupport = ns.widget.core.BaseKeyboardSupport,
				arrayUtil = ns.util.array,

				Page = function (element, options) {
					var self = this;

					BaseKeyboardSupport.call(self);

					/**
					 * Callback on resize
					 * @property {?Function} _contentFillAfterResizeCallback
					 * @private
					 * @member ns.widget.core.Page
					 */
					self._contentFillAfterResizeCallback = null;
					self._initialContentStyle = {};
					self._lastScrollPosition = 0;
					/**
					 * Options for widget.
					 * @property {Object} options
					 * @member ns.widget.core.Page
					 */
					self.options = options || {};

					self._contentStyleAttributes = ["height", "width", "minHeight", "marginTop", "marginBottom"];

					self._ui = {};
				},
				/**
				 * Dictionary for page related event types
				 * @property {Object} EventType
				 * @member ns.widget.core.Page
				 * @static
				 */
				EventType = {
					/**
					 * Triggered on the page we are transitioning to,
					 * after the transition animation has completed.
					 * @event pageshow
					 * @member ns.widget.core.Page
					 */
					SHOW: "pageshow",
					/**
					 * Triggered on the page we are transitioning away from,
					 * after the transition animation has completed.
					 * @event pagehide
					 * @member ns.widget.core.Page
					 */
					HIDE: "pagehide",
					/**
					 * Triggered when the page has been created in the DOM
					 * (for example, through Ajax) but before all widgets
					 * have had an opportunity to enhance the contained markup.
					 * @event pagecreate
					 * @member ns.widget.core.Page
					 */
					CREATE: "pagecreate",
					/**
					 * Triggered when the page is being initialized,
					 * before most plugin auto-initialization occurs.
					 * @event pagebeforecreate
					 * @member ns.widget.core.Page
					 */
					BEFORE_CREATE: "pagebeforecreate",
					/**
					 * Triggered on the page we are transitioning to,
					 * before the actual transition animation is kicked off.
					 * @event pagebeforeshow
					 * @member ns.widget.core.Page
					 */
					BEFORE_SHOW: "pagebeforeshow",
					/**
					 * Triggered on the page we are transitioning away from,
					 * before the actual transition animation is kicked off.
					 * @event pagebeforehide
					 * @member ns.widget.core.Page
					 */
					BEFORE_HIDE: "pagebeforehide"
				},
				/**
				 * Dictionary for page related css class names
				 * @property {Object} classes
				 * @member ns.widget.core.Page
				 * @static
				 * @readonly
				 */
				classes = {
					uiPage: "ui-page",
					/**
					 * Indicates active page
					 * @style ui-page-active
					 * @member ns.widget.core.Page
					 */
					uiPageActive: "ui-page-active",
					uiSection: "ui-section",
					uiHeader: "ui-header",
					uiMore: "ui-more",
					uiHeaderOnlyMoreButton: "ui-header-has-only-more-button",
					uiFooter: "ui-footer",
					uiContent: "ui-content",
					uiTitle: "ui-title",
					uiPageScroll: "ui-scroll-on",
					uiScroller: "ui-scroller",
					uiContentUnderPopup: "ui-content-under-popup"
				},
				HEADER_SELECTOR = "header,[data-role='header'],." + classes.uiHeader,
				FOOTER_SELECTOR = "footer,[data-role='footer'],." + classes.uiFooter,
				//ui-indexscrollbar is needed as widget ads html markup at the
				//same level as content, other wise page content is build on
				//indexscrollbar element
				CONTENT_SELECTOR = "[data-role='content'],." + classes.uiContent,
				ONLY_CHILD_MORE_BUTTON_SELECTOR = "." + classes.uiMore + ":first-child:last-child",
				prototype = new BaseWidget();

			Page.classes = classes;
			Page.events = EventType;

			/**
			 * Configure default options for widget
			 * @method _configure
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._configure = function () {
				var options = this.options;
				/**
				 * Object with default options
				 * @property {Object} options
				 * @property {boolean|string|null} [options.header=false] Sets content of header.
				 * @property {boolean|string|null} [options.footer=false] Sets content of footer.
				 * @property {boolean} [options.autoBuildWidgets=false] Automatically build widgets inside page.
				 * @property {string} [options.content=null] Sets content of popup.
				 * @member ns.widget.core.Page
				 * @static
				 */

				options.header = null;
				options.footer = null;
				options.content = null;
				options.enablePageScroll = ns.getConfig("enablePageScroll");
				options.autoBuildWidgets = ns.getConfig("autoBuildOnPageChange");
				this.options = options;
			};

			/**
			 * Setup size of element to 100% of screen
			 * @method _contentFill
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._contentFill = function () {
				var self = this,
					element = self.element,
					screenWidth = window.innerWidth,
					screenHeight = window.innerHeight,
					elementStyle = element.style,
					ui = self._ui,
					content = ui.content,
					contentStyle,
					header = ui.header,
					top = 0,
					bottom = 0,
					footer = ui.footer;

				elementStyle.width = screenWidth + "px";
				elementStyle.height = screenHeight + "px";

				if (content && !element.classList.contains("ui-page-flex")) {
					contentStyle = content.style;
					//>>excludeStart("tauDebug", pragmas.tauDebug);
					ns.log("Page (contentFill) on ", self.id, " styles was recalculated");
					//>>excludeEnd("tauDebug");

					if (header) {
						top = utilsDOM.getElementHeight(header);
					}

					if (footer) {
						bottom = footer.getBoundingClientRect().height;
						contentStyle.marginBottom = bottom + "px";
						contentStyle.paddingBottom = (-bottom) + "px";
					}

					if (!self.options.enablePageScroll) {
						contentStyle.height = (screenHeight - top - bottom) + "px";
					}
				}

				if (self.options.model) {
					self._fillContentsFromModel();
				}
			};

			prototype._fillContentsFromModel = function () {
				var self = this,
					model = self.options.model || {},
					data = model;

				Object.keys(data).forEach(function (key) {
					[].slice.call(self.element.querySelectorAll("[data-bind='" + key + "']"))
						.forEach(function (elem) {
							elem.textContent = data[key];
						});
				});
			}

			prototype._storeContentStyle = function () {
				var self = this,
					initialContentStyle = self._initialContentStyle,
					contentStyleAttributes = self._contentStyleAttributes,
					content = self.element.querySelector("." + classes.uiContent),
					contentStyle = content ? content.style : {};

				contentStyleAttributes.forEach(function (name) {
					initialContentStyle[name] = contentStyle[name];
				});
			};

			/**
			 * Restore saved styles for content.
			 * Called on refresh or hide.
			 * @protected
			 */
			prototype._restoreContentStyle = function () {
				var self = this,
					initialContentStyle = self._initialContentStyle,
					contentStyleAttributes = self._contentStyleAttributes,
					content = self.element.querySelector("." + classes.uiContent),
					contentStyle = content ? content.style : {};

				contentStyleAttributes.forEach(function (name) {
					contentStyle[name] = initialContentStyle[name];
				});
			};

			/**
			 * Setter for footer option
			 * @method _setFooter
			 * @param {HTMLElement} element
			 * @param {string} value
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._setFooter = function (element, value) {
				var self = this,
					ui = self._ui,
					footer = ui.footer;

				// footer element if footer does not exist and value is true or string
				if (!footer && value) {
					footer = document.createElement("footer");
					element.appendChild(footer);
					ui.footer = footer;
				}
				if (footer) {
					// remove child if footer does not exist and value is set to false
					if (value === false) {
						element.removeChild(footer);
						ui.footer = null;
					} else {
						// if options is set to true, to string or not is set
						// add class
						footer.classList.add(classes.uiFooter);
						// if is string fill content by string value
						if (typeof value === "string") {
							ui.footer.textContent = value;
						}
					}
					// and remember options
					self.options.footer = value;
				}
			};

			/**
			 * Setter for header option
			 * @method _setHeader
			 * @param {HTMLElement} element
			 * @param {string} value
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._setHeader = function (element, value) {
				var self = this,
					ui = self._ui,
					header = ui.header;

				// header element if header does not exist and value is true or string
				if (!header && value) {
					header = document.createElement("header");
					element.appendChild(header);
					ui.header = header;
				}
				if (header) {
					// remove child if header does not exist and value is set to false
					if (value === false) {
						element.removeChild(header);
						ui.header = null;
					} else {
						// if options is set to true, to string or not is set
						// add class
						header.classList.add(classes.uiHeader);
						// if is string fill content by string value
						if (typeof value === "string") {
							ui.header.textContent = value;
						}

						if (ns.support && ns.support.shape && ns.support.shape.circle) {
							// patch for backward compability - if header has only more button
							// (it was common for rectangle devices) header should be marked
							// and take no place at all.
							if (header.querySelector(ONLY_CHILD_MORE_BUTTON_SELECTOR) && header.textContent.trim() === "") {
								header.classList.add(classes.uiHeaderOnlyMoreButton);
							}
						}
					}
					// and remember options
					self.options.header = value;
				}
			};

			/**
			 * Setter for content option
			 * @method _setContent
			 * @param {HTMLElement} element
			 * @param {string} value
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._setContent = function (element, value) {
				var self = this,
					ui = self._ui,
					content = ui.content,
					child = element.firstChild,
					next;

				if (!content && value) {
					content = document.createElement("div");
					while (child) {
						next = child.nextSibling;
						if (child !== ui.footer && child !== ui.header) {
							content.appendChild(child);
						}
						child = next;
					}
					element.insertBefore(content, ui.footer);
					ui.content = content;
				}
				if (content) {
					// remove child if content exist and value is set to false
					if (value === false) {
						element.removeChild(content);
						ui.content = null;
					} else {
						// if options is set to true, to string or not is set
						// add class
						content.classList.add(classes.uiContent);
						// if is string fill content by string value
						if (typeof value === "string") {
							content.textContent = value;
						}
					}
					// and remember options
					self.options.content = value;
				}
			};

			/**
			 * Method creates empty page header. It also checks for additional
			 * content to be added in header.
			 * @method _buildHeader
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._buildHeader = function (element) {
				var self = this;

				self._ui.header = utilSelectors.getChildrenBySelector(element, HEADER_SELECTOR)[0] || null;
				if (self.options.header === undefined) {
					self.options.header = !!self._ui.header;
				}
				self._setHeader(element, self.options.header);
			};

			/**
			 * Method creates empty page footer.
			 * @method _buildFooter
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._buildFooter = function (element) {
				var self = this;

				self._ui.footer = utilSelectors.getChildrenBySelector(element, FOOTER_SELECTOR)[0] || null;
				if (self.options.footer === undefined) {
					self.options.footer = !!self._ui.footer;
				}
				self._setFooter(element, self.options.footer);
			};

			/**
			 * Method creates empty page content.
			 * @method _buildContent
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._buildContent = function (element) {
				var self = this;

				self._ui.content = utilSelectors.getChildrenBySelector(element, CONTENT_SELECTOR)[0] || null;
				if (self.options.content === undefined) {
					self.options.content = !!self._ui.content;
				}
				self._setContent(element, self.options.content);
			};


			/**
			 * Set ARIA attributes on page structure
			 * @method _setAria
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._setAria = function () {
				var self = this,
					ui = self._ui,
					content = ui.content,
					header = ui.header,
					footer = ui.footer,
					title = ui.title;

				if (content) {
					content.setAttribute("role", "main");
				}

				if (header) {
					header.setAttribute("role", "header");
				}

				if (footer) {
					footer.setAttribute("role", "footer");
				}

				if (title) {
					title.setAttribute("role", "heading");
					title.setAttribute("aria-level", 1);
					title.setAttribute("aria-label", "title");
				}
			};

			/**
			 * Find title of page
			 * @param {HTMLElement} element
			 * @method _setTitle
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._setTitle = function (element) {
				var self = this,
					dataPageTitle = utilsDOM.getNSData(element, "title"),
					header = self._ui.header,
					pageTitle = dataPageTitle,
					titleElements,
					mainTitleElement;

				if (header) {
					titleElements = utilSelectors.getChildrenBySelector(header, "h1, h2, h3, h4, h5, h6");

					mainTitleElement = titleElements[0];

					if (!pageTitle && mainTitleElement) {
						pageTitle = mainTitleElement.innerText;
						self._ui.title = mainTitleElement;
					}

					if (!dataPageTitle && pageTitle) {
						utilsDOM.setNSData(element, "title", pageTitle);
					}

					arrayUtil.forEach(titleElements, function (titleElement) {
						titleElement.classList.add(classes.uiTitle)
					});
				}
			};

			/**
			 * Build page
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._build = function (element) {
				var self = this;

				element.classList.add(classes.uiPage);
				self._buildHeader(element);
				self._buildFooter(element);
				self._buildContent(element);
				self._setTitle(element);
				self._setAria();

				//it means that we are in wearable profile and we want to make a scrollview on page element (not content)
				if (self.options.enablePageScroll === true && !element.querySelector("." + classes.uiScroller)) {
					engine.instanceWidget(element, "Scrollview");
				}
				return element;
			};


			/**
			 * This method sets page active or inactive.
			 *
			 *    @example
			 *    <div id="myPage"></div>
			 *    <script type="text/javascript">
			 *      var page = tau.widget.Page(document.getElementById("myPage"));
			 *      page.setActive(true);
			 *    </script>
			 *
			 * @method setActive
			 * @param {boolean} [value=true] If true, then page will be active. Otherwise, page will be inactive.
			 * @member ns.widget.core.Page
			 */
			prototype.setActive = function (value) {
				var elementClassList = this.element.classList;

				if (value || value === undefined) {
					this.focus();
					elementClassList.add(classes.uiPageActive);
				} else {
					this.blur();
					elementClassList.remove(classes.uiPageActive);
				}
			};

			/**
			 * Return current status of page.
			 * @method isActive
			 * @member ns.widget.core.Page
			 * @instance
			 */
			prototype.isActive = function () {
				return this.element.classList.contains(classes.uiPageActive);
			};

			/**
			 * Sets the focus to page
			 * @method focus
			 * @member ns.widget.core.Page
			 */
			prototype.focus = function () {
				var element = this.element,
					focusable = element.querySelector("[autofocus]") || element;

				focusable.focus();
			};

			/**
			 * Removes focus from page and all descendants
			 * @method blur
			 * @member ns.widget.core.Page
			 */
			prototype.blur = function () {
				var element = this.element,
					focusable = document.activeElement || element;

				focusable.blur();
			};

			/**
			 * Bind events to widget
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._bindEvents = function () {
				var self = this;

				self._contentFillAfterResizeCallback = self._contentFill.bind(self);
				window.addEventListener("resize", self._contentFillAfterResizeCallback, false);
			};

			/**
			 * Refresh widget structure
			 * @method _refresh
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._refresh = function () {
				this._restoreContentStyle();
				this._contentFill();
			};

			/**
			 * Layouting page structure
			 * @method layout
			 * @internal
			 * @member ns.widget.core.Page
			 */
			prototype.layout = function () {
				this._storeContentStyle();
				this._contentFill();
			};

			/**
			 * This method triggers BEFORE_SHOW event.
			 * @method onBeforeShow
			 * @internal
			 * @member ns.widget.core.Page
			 */
			prototype.onBeforeShow = function () {
				var self = this,
					scroller = self.getScroller();;

				if (scroller) {
					scroller.scrollTop = self._lastScrollPosition || 0;
				}

				if (typeof self.enableKeyboardSupport === "function") {
					self.enableKeyboardSupport();
					// add keyboard events
					self._bindEventKey();
				}
				self.trigger(EventType.BEFORE_SHOW);
			};

			/**
			 * This method triggers SHOW event.
			 * @method onShow
			 * @internal
			 * @member ns.widget.core.Page
			 */
			prototype.onShow = function () {
				//>>excludeStart("tauPerformance", pragmas.tauPerformance);
				if (window.tauPerf) {
					window.tauPerf.get("framework", "Trigger: pageshow");
				}
				//>>excludeEnd("tauPerformance");
				this.trigger(EventType.SHOW);
			};

			/**
			 * This method triggers BEFORE_HIDE event.
			 * @method onBeforeHide
			 * @internal
			 * @member ns.widget.core.Page
			 */
			prototype.onBeforeHide = function () {
				var self = this,
					scroller = self.getScroller();

				if (scroller) {
					self._lastScrollPosition = scroller.scrollTop;
				}

				if (typeof self.disableKeyboardSupport === "function") {
					self.disableKeyboardSupport();
					// remove keyboard events
					self._destroyEventKey();
				}
				self.trigger(EventType.BEFORE_HIDE);
			};

			/**
			 * This method triggers HIDE event.
			 * @method onHide
			 * @internal
			 * @member ns.widget.core.Page
			 */
			prototype.onHide = function () {
				this._restoreContentStyle();
				this.trigger(EventType.HIDE);
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Page
			 */
			prototype._destroy = function (element) {
				var self = this;

				element = element || self.element;
				//>>excludeStart("tauDebug", pragmas.tauDebug);
				ns.log("Called _destroy in ns.widget.core.Page");
				//>>excludeEnd("tauDebug");

				window.removeEventListener("resize", self._contentFillAfterResizeCallback, false);
				// destroy widgets on children
				engine.destroyAllWidgets(element, true);

				self._contentFillAfterResizeCallback = null;
			};

			/**
			 * Return scroller
			 * @method getScroller
			 * @member ns.widget.core.Page
			 */
			prototype.getScroller = function () {
				var element = this.element,
					scroller = element.querySelector("." + classes.uiScroller);

				return scroller || element.querySelector("." + classes.uiContent) || element;
			};

			Page.prototype = prototype;

			Page.createEmptyElement = function () {
				var div = document.createElement("div");

				div.classList.add(classes.uiPage);
				return div;
			};

			engine.defineWidget(
				"Page",
				"[data-role=page],.ui-page",
				[
					"focus",
					"blur",
					"setActive"
				],
				Page,
				// for register in jQuery Mobile space
				"mobile"
			);

			ns.widget.core.Page = Page;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			// exports only for tests
			return Page;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
/**
 * #Footer
 *
 * ## Creating footer
 *
 *    @example template
 *      <footer class="ui-footer"></footer>
 *
 * @class ns.widget.core.Footer
 * @component-selector .ui-page > footer, .ui-page .ui-footer
 * @component-type layout-component
 * @extends ns.widget.BaseWidget
 *
 */

/**
 * #Header
 *
 *    @example template
 *      <header class="ui-header"><h2 class="ui-title">Header</h2></header>
 *
 * @class ns.widget.core.Header
 * @component-selector .ui-page > header, .ui-page > .ui-header
 * @component-type layout-component
 * @extends ns.widget.BaseWidget
 */
/**
 * Button for menu with icon in header
 * @style ui-more
 * @selector .ui-btn
 * @member ns.widget.core.Header
 * @wearable
 * @since 2.3.1
 */
/**
 * Icon style for menu button
 * @style ui-icon-detail
 * @selector .ui-btn.ui-more
 * @member ns.widget.core.Header
 * @wearable
 * @since 2.3.1
 */
/**
 * Icon style for menu button
 * @style ui-icon-overflow
 * @selector .ui-btn.ui-more
 * @member ns.widget.core.Header
 * @wearable
 * @since 2.3.1
 */
/**
 * Icon style for menu button
 * @style ui-icon-selectall
 * @selector .ui-btn.ui-more
 * @member ns.widget.core.Header
 * @wearable
 * @since 2.3.1
 */

/**
 * #Content
 *
 *    @example template
 *      <div class="ui-content"></div>
 *
 * @class ns.widget.core.Content
 * @component-selector .ui-content
 * @component-type container-component
 * @component-constraint 'bottom-button', 'checkbox', 'listview', 'processing', 'closet-tau-circle-progress', 'radio', 'toggleswitch', 'text', 'closet-image', 'sectionchanger'
 * @extends ns.widget.BaseWidget
 */
/**
 * Defines the buttons inside column width as 100% of the screen
 * @style ui-grid-col-1
 * @selector div:not(.ui-grid-col-1):not(.ui-grid-col-2):not(.ui-grid-col-3):not(.ui-grid-row)
 * @member ns.widget.core.Content
 * @wearable
 * @since 2.3.1
 */
/**
 * Defines the buttons inside column width as 50% of the screen
 * @style ui-grid-col-2
 * @selector div:not(.ui-grid-col-1):not(.ui-grid-col-2):not(.ui-grid-col-3):not(.ui-grid-row)
 * @member ns.widget.core.Content
 * @wearable
 * @since 2.3.1
 */
/**
 * Defines the buttons inside column width as 50% of the screen
 * @style ui-grid-col-3
 * @selector div:not(.ui-grid-col-1):not(.ui-grid-col-2):not(.ui-grid-col-3):not(.ui-grid-row)
 * @member ns.widget.core.Content
 * @wearable
 * @since 2.3.1
 */
/**
 * Arranges the buttons inside in a row
 * @style ui-grid-row
 * @selector div:not(.ui-grid-col-1):not(.ui-grid-col-2):not(.ui-grid-col-3):not(.ui-grid-row)
 * @member ns.widget.core.Content
 * @wearable
 * @since 2.3.1
 */
