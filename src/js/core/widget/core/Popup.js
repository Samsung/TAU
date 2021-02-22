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
 * #Popup
 * Popup component supports 2 pop-ups: the position-to-window pop-up (like a system pop-up), and the context pop-up.
 *
 * @since 2.0
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 * @class ns.widget.core.Popup
 * @component-selector .ui-popup, [data-role]="popup"
 * @extends ns.widget.core.BaseWidget
 */
(function () {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../event",
			"../../util/object",
			"../../util/deferred",
			"../../util/selectors",
			"../../router/Router",
			"../BaseWidget",
			"../core",
			"../BaseKeyboardSupport"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * Alias for {@link ns.widget.BaseWidget}
			 * @property {Function} BaseWidget
			 * @member ns.widget.core.Popup
			 * @private
			 */
			var BaseWidget = ns.widget.BaseWidget,
				/**
				 * Alias for class ns.engine
				 * @property {ns.engine} engine
				 * @member ns.widget.core.Popup
				 * @private
				 */
				engine = ns.engine,
				/**
				 * Alias for class ns.util.object
				 * @property {Object} objectUtils
				 * @member ns.widget.core.Popup
				 * @private
				 */
				objectUtils = ns.util.object,
				/**
				 * Alias for class ns.util.deferred
				 * @property {Object} UtilDeferred
				 * @member ns.widget.core.Popup
				 * @private
				 */
				UtilDeferred = ns.util.deferred,
				/**
				 * Alias for class ns.util.selectors
				 * @property {Object} utilSelector
				 * @member ns.widget.core.Popup
				 * @private
				 */
				utilSelector = ns.util.selectors,
				/**
				 * Alias for class ns.event
				 * @property {Object} eventUtils
				 * @member ns.widget.core.Popup
				 * @private
				 */
				eventUtils = ns.event,
				/**
				 * Alias for Router, loose requirement
				 * @property {ns.router.Router} Router
				 * @member ns.widget.core.Popup
				 * @private
				 */
				Router = ns.router && ns.router.Router,

				/**
				 * Alias for BaseKeyBoard Support
				 * @property {ns.widget.core.BaseKeyboardSupport} BaseKeyboardSupport
				 * @member ns.widget.core.Popup
				 * @private
				 */
				BaseKeyboardSupport = ns.widget.core.BaseKeyboardSupport,

				/**
				 * Alias for class ns.widget.core.Page
				 * @property {ns.router.Router} Router
				 * @member ns.widget.core.Popup
				 * @private
				 */
				Page = ns.widget.core.Page,

				POPUP_SELECTOR = "[data-role='popup'], .ui-popup",

				/**
				 * Object with default options
				 * @property {Object} defaults
				 * @property {string} [options.transition="none"] Sets the default transition for the popup.
				 * @property {string} [options.positionTo="window"] Sets the element relative to which the popup will be centered.
				 * @property {boolean} [options.dismissible=true] Sets whether to close popup when a popup is open to support the back button.
				 * @property {boolean} [options.overlay=true] Sets whether to show overlay when a popup is open.
				 * @property {boolean|string} [options.header=false] Sets content of header.
				 * @property {boolean|string} [options.footer=false] Sets content of footer.
				 * @property {string} [options.content=null] Sets content of popup.
				 * @property {string} [options.overlayClass=""] Sets the custom class for the popup background, which covers the entire window.
				 * @property {string} [options.closeLinkSelector="a[data-rel='back']"] Sets selector for close buttons in popup.
				 * @property {boolean} [options.history=true] Sets whether to alter the url when a popup is open to support the back button.
				 * @member ns.widget.core.Popup
				 * @static
				 */
				defaults = {
					transition: "none",
					dismissible: true,
					overlay: true,
					header: false,
					footer: false,
					content: null,
					overlayClass: "",
					closeLinkSelector: "[data-rel='back']",
					history: null,
					closeAfter: null
				},
				states = {
					DURING_OPENING: 0,
					OPENED: 1,
					DURING_CLOSING: 2,
					CLOSED: 3
				},
				CLASSES_PREFIX = "ui-popup",
				/**
				 * Dictionary for popup related css class names
				 * @property {Object} classes
				 * @member ns.widget.core.Popup
				 * @static
				 */
				/**
				 * Toast style of popup with graphic
				 * @style ui-popup-toast-graphic
				 * @member ns.widget.core.Popup
				 * @wearable
				 */
				classes = {
				/**
				 * Style for normal popup widget
				 * @style ui-popup
				 * @member ns.widget.core.Popup
				 * @wearable
				 */
					popup: CLASSES_PREFIX,
				/**
				 * Set style for active popup widget
				 * @style ui-popup-active
				 * @member ns.widget.core.Popup
				 * @wearable
				 */
					active: CLASSES_PREFIX + "-active",
				/**
				 * Set style for overlay popup widget
				 * @style ui-popup-overlay
				 * @member ns.widget.core.Popup
				 * @wearable
				 */
					overlay: CLASSES_PREFIX + "-overlay",
				/**
				 * Set header for popup widget
				 * @style ui-popup-header
				 * @member ns.widget.core.Popup
				 * @wearable
				 */
					header: CLASSES_PREFIX + "-header",
				/**
				 * Set footer for popup widget
				 * @style ui-popup-footer
				 * @member ns.widget.core.Popup
				 * @wearable
				 */
					footer: CLASSES_PREFIX + "-footer",
				/**
				 * Set content for popup widget
				 * @style ui-popup-content
				 * @member ns.widget.core.Popup
				 * @wearable
				 */
					content: CLASSES_PREFIX + "-content",
				/**
				 * Style for wrapper of popup widget
				 * @style ui-popup-wrapper
				 * @member ns.widget.core.Popup
				 * @wearable
				 */
					wrapper: CLASSES_PREFIX + "-wrapper",
				/**
				 * Toast style of popup
				 * @style ui-popup-toast
				 * @member ns.widget.core.Popup
				 * @wearable
				 */
					toast: CLASSES_PREFIX + "-toast",
				/**
				 * Small toast style of popup
				 * @style ui-popup-toast-small
				 * @member ns.widget.core.Popup
				 * @wearable
				 */
					toastSmall: CLASSES_PREFIX + "-toast-small",
					build: "ui-build",
					overlayShown: CLASSES_PREFIX + "-overlay-shown"
				},
				/**
				 * Dictionary for popup related selectors
				 * @property {Object} selectors
				 * @member ns.widget.core.Popup
				 * @static
				 */
				selectors = {
					header: "." + classes.header,
					content: "." + classes.content,
					footer: "." + classes.footer
				},
				EVENTS_PREFIX = "popup",
				/**
				 * Dictionary for popup related events
				 * @property {Object} events
				 * @member ns.widget.core.Popup
				 * @static
				 */
				events = {
					/**
					 * Triggered when the popup has been created in the DOM (via ajax or other) but before all widgets have had an opportunity to enhance the contained markup.
					 * @event popupshow
					 * @member ns.widget.core.Popup
					 */
					show: EVENTS_PREFIX + "show",
					/**
					 * Triggered on the popup after the transition animation has completed.
					 * @event popuphide
					 * @member ns.widget.core.Popup
					 */
					hide: EVENTS_PREFIX + "hide",
					/**
					 * Triggered on the popup we are transitioning to, before the actual transition animation is kicked off.
					 * @event popupbeforeshow
					 * @member ns.widget.core.Popup
					 */
					/* eslint-disable camelcase */
					// we can't change this in this moment because this is part of API
					before_show: EVENTS_PREFIX + "beforeshow",
					/**
					 * Triggered on the popup we are transitioning to, before the actual transition animation is kicked off, animation has started.
					 * @event popuptransitionstart
					 * @member ns.widget.core.Popup
					 */
					transition_start: EVENTS_PREFIX + "transitionstart",
					/**
					 * Triggered on the popup we are transitioning away from, before the actual transition animation is kicked off.
					 * @event popupbeforehide
					 * @member ns.widget.core.Popup
					 */
					before_hide: EVENTS_PREFIX + "beforehide"
					/* eslint-enable camelcase */
				},

				Popup = function () {
					var self = this,
						ui = {};

					self.selectors = selectors;
					self.options = objectUtils.merge({}, Popup.defaults);
					self.storedOptions = null;
					/**
					 * Popup state flag
					 * @property {0|1|2|3} [state=null]
					 * @member ns.widget.core.Popup
					 * @private
					 */
					self.state = states.CLOSED;

					ui.overlay = null;
					ui.header = null;
					ui.footer = null;
					ui.content = null;
					ui.container = null;
					ui.wrapper = null;
					self._ui = ui;

					// event callbacks
					self._callbacks = {};
				},

				prototype = new BaseWidget();

			Popup.classes = classes;
			Popup.events = events;
			Popup.defaults = defaults;
			Popup.selector = POPUP_SELECTOR;

			/**
			 * Build the content of popup
			 * @method _buildContent
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._buildContent = function (element) {
				var self = this,
					ui = self._ui,
					selectors = self.selectors,
					options = self.options,
					content = ui.content || element.querySelector(selectors.content),
					footer = ui.footer || element.querySelector(selectors.footer),
					elementChildren = [].slice.call(element.childNodes),
					elementChildrenLength = elementChildren.length,
					i,
					node;

				if (!content) {
					content = document.createElement("div");
					content.className = classes.content;
					for (i = 0; i < elementChildrenLength; ++i) {
						node = elementChildren[i];
						if (node !== ui.footer && node !== ui.header) {
							content.appendChild(node);
						}
					}
					if (typeof options.content === "string") {
						content.innerHTML = options.content;
					}
					element.insertBefore(content, footer);
				}
				content.classList.add(classes.content);
				ui.content = content;
			};

			/**
			 * Build the header of popup
			 * @method _buildHeader
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._buildHeader = function (element) {
				var self = this,
					ui = self._ui,
					options = self.options,
					selectors = self.selectors,
					content = ui.content || element.querySelector(selectors.content),
					header = ui.header || element.querySelector(selectors.header);

				if (!header && options.header !== false) {
					header = document.createElement("div");
					header.className = classes.header;
					if (typeof options.header !== "boolean") {
						header.innerHTML = options.header;
					}
					element.insertBefore(header, content);
				}
				if (header) {
					header.classList.add(classes.header);
				}
				ui.header = header;
			};

			/**
			 * Set the header of popup.
			 * This function is called by function "option" when the option "header" is set.
			 * @method _setHeader
			 * @param {HTMLElement} element
			 * @param {boolean|string} value
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._setHeader = function (element, value) {
				var self = this,
					ui = self._ui,
					header = ui.header;

				if (header) {
					header.parentNode.removeChild(header);
					ui.header = null;
				}
				self.options.header = value;
				self._buildHeader(ui.container);
			};

			/**
			 * Build the footer of popup
			 * @method _buildFooter
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._buildFooter = function (element) {
				var self = this,
					ui = self._ui,
					options = self.options,
					footer = ui.footer || element.querySelector(self.selectors.footer);

				if (!footer && options.footer !== false) {
					footer = document.createElement("div");
					footer.className = classes.footer;
					if (typeof options.footer !== "boolean") {
						footer.innerHTML = options.footer;
					}
					element.appendChild(footer);
				}
				if (footer) {
					footer.classList.add(classes.footer);
				}
				ui.footer = footer;
			};

			/**
			 * Set the footer of popup.
			 * This function is called by function "option" when the option "footer" is set.
			 * @method _setFooter
			 * @param {HTMLElement} element
			 * @param {boolean|string} value
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._setFooter = function (element, value) {
				var self = this,
					ui = self._ui,
					footer = ui.footer;

				if (footer) {
					footer.parentNode.removeChild(footer);
					ui.footer = null;
				}
				self.options.footer = value;
				self._buildFooter(ui.container);
			};

			/**
			 * Build structure of Popup widget
			 * @method _build
			 * @param {HTMLElement} element of popup
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.Popup
			 */
			prototype._build = function (element) {
				var self = this,
					ui = self._ui,
					wrapper,
					child = element.firstChild,
					elementClassList = element.classList;

				// set class for element
				elementClassList.add(classes.popup);

				if (elementClassList.contains(classes.toastSmall)) {
					elementClassList.add(classes.toast);
				}

				// create wrapper
				wrapper = document.createElement("div");
				wrapper.classList.add(classes.wrapper);
				ui.wrapper = wrapper;
				ui.container = wrapper;
				// move all children to wrapper
				while (child) {
					wrapper.appendChild(child);
					child = element.firstChild;
				}
				// add wrapper and arrow to popup element
				element.appendChild(wrapper);

				// build header, footer and content
				self._buildHeader(ui.container);
				self._buildFooter(ui.container);
				self._buildContent(ui.container);

				// set overlay
				self._setOverlay(element, self.options.overlay);

				return element;
			};

			/**
			 * Set overlay
			 * @method _setOverlay
			 * @param {HTMLElement} element
			 * @param {boolean} enable
			 * @protected
			 * @member ns.widget.Popup
			 */
			prototype._setOverlay = function (element, enable) {
				var self = this,
					overlayClass = self.options.overlayClass,
					ui = self._ui,
					overlay = ui.overlay;

				// if this popup is not connected with slider,
				// we create overlay, which is invisible when
				// the value of option overlay is false
				/// @TODO: get class from widget
				if (!element.classList.contains("ui-slider-popup") && !element.classList.contains(classes.toast)) {
					// create overlay
					if (!overlay) {
						overlay = document.createElement("div");

						if (element.parentNode) {
							element.parentNode.insertBefore(overlay, element);
						} else {
							ns.warn("Popup is creating on element outside DOM");
						}

						ui.overlay = overlay;
					}
					overlay.className = classes.overlay + (overlayClass ? " " + overlayClass : "");
					if (enable) {
						overlay.style.opacity = "";
					} else {
						// if option is set on "false", the overlay is not visible
						overlay.style.opacity = 0;
					}
				}
			};

			/**
			 * Returns the state of the popup
			 * @method _isActive
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._isActive = function () {
				var state = this.state;

				return state === states.DURING_OPENING || state === states.OPENED;
			};

			/**
			 * Returns true if popup is already opened and visible
			 * @method _isActive
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._isOpened = function () {
				return this.state === states.OPENED;
			};

			/**
			 * Init widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._init = function (element) {
				var self = this,
					selectors = self.selectors,
					ui = self._ui,
					options = self.options,
					elementClassList = self.element.classList;

				ui.header = ui.header || element.querySelector(selectors.header);
				ui.footer = ui.footer || element.querySelector(selectors.footer);
				ui.content = ui.content || element.querySelector(selectors.content);
				ui.wrapper = ui.wrapper || element.querySelector("." + classes.wrapper);
				ui.container = ui.wrapper || element;

				ui.page = utilSelector.getClosestByClass(element, Page.classes.uiPage) || window;
				ui.pageContent = (typeof ui.page.querySelector === "function") ?
					ui.page.querySelector("." + Page.classes.uiContent) : null;

				if (elementClassList.contains(classes.toast)) {
					options.closeAfter = options.closeAfter || 2000;
				}
				// if option history is not set in constructor or in HTML
				if (options.history === null) {
					// for toast we set false for other true
					options.history = !elementClassList.contains(classes.toast);
				}
			};

			/**
			 * Set the state of the popup
			 * @method _setActive
			 * @param {boolean} active
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._setActive = function (active) {
				var self = this,
					activeClass = classes.active,
					elementClassList = self.element.classList,
					route = Router && Router.getInstance().getRoute("popup"),
					options,
					ui = self._ui;

				// NOTE: popup's options object is stored in window.history at the router module,
				// and this window.history can't store DOM element object.
				options = objectUtils.merge({}, self.options, {positionTo: null, link: null});

				// set state of popup and add proper class
				if (active) {
					// set global variable
					if (route) {
						route.setActive(self, options);
					}
					// add proper class
					elementClassList.add(activeClass);
					// set state of popup 	358
					self.state = states.OPENED;
				} else {
					// no popup is opened, so set global variable on "null"
					if (route) {
						route.setActive(null, options);
					}
					// remove proper class
					elementClassList.remove(activeClass);
					// set state of popup
					self.state = states.CLOSED;
				}

				if (ui.content.scrollHeight > ui.content.clientHeight) {
					ui.footer && ui.footer.classList.add("bottomDivider");
				}
			};

			/**
			 * Scroll event
			 * @method _onScroll
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._onScroll = function () {
				var self = this,
					ui = self._ui,
					content = ui.content,
					header = ui.header,
					footer = ui.footer;

				if (content.scrollTop === 0) {
					header && header.classList.remove("topDivider");
					footer && footer.classList.add("bottomDivider");
				} else if (content.scrollHeight - content.clientHeight === content.scrollTop) {
					header && header.classList.add("topDivider");
					footer && footer.classList.remove("bottomDivider");
				} else {
					header && header.classList.add("topDivider");
					footer && footer.classList.add("bottomDivider");
				}
			}

			/**
			 * Bind events
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._bindEvents = function () {
				var self = this;

				eventUtils.on(self._ui.page, "pagebeforehide", self, false);
				eventUtils.on(window, "resize", self, false);
				eventUtils.on(document, "vclick", self, false);
				eventUtils.on(self._ui.content, "scroll", self, false);
			};


			/**
			 * Unbind events
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._unbindEvents = function () {
				var self = this;

				eventUtils.off(self._ui.page, "pagebeforehide", self, false);
				eventUtils.off(window, "resize", self, false);
				eventUtils.off(document, "vclick", self, false);
				eventUtils.off(self._ui.content, "scroll", self, false);
			};

			/**
			 * Layouting popup structure
			 * @method layout
			 * @member ns.widget.core.Popup
			 */
			prototype._layout = function () {
			};

			/**
			 * Open the popup
			 * @method open
			 * @param {Object=} [options]
			 * @param {string=} [options.transition] options.transition
			 * @member ns.widget.core.Popup
			 */
			prototype.open = function (options) {
				var self = this,
					newOptions,
					onClose = self.close.bind(self);


				if (!self._isActive()) {
					/*
					 * Some passed options on open need to be kept until popup closing.
					 * For example, transition parameter should be kept for closing animation.
					 * On the other hand, fromHashChange or x, y parameter should be removed.
					 * We store options and restore them on popup closing.
					 */
					self._storeOpenOptions(options);

					newOptions = objectUtils.merge(self.options, options);
					if (!newOptions.dismissible) {
						ns.router.Router.getInstance().lock();
					}


					if (newOptions.closeAfter > 0) {
						if (self.element.classList.contains(classes.toast)) {
							newOptions.transition = "fade";
						}
						self._show(newOptions);

						self._closeTimeout = window.setTimeout(onClose, newOptions.closeAfter);
					} else {
						self._show(newOptions);
					}
				}
			};


			/**
			 * Close the popup
			 * @method close
			 * @param {Object=} [options]
			 * @param {string=} [options.transition]
			 * @member ns.widget.core.Popup
			 */
			prototype.close = function (options) {
				var self = this,
					newOptions = objectUtils.merge(self.options, options);

				if (self._isActive()) {
					clearTimeout(self._closeTimeout);
					if (!newOptions.dismissible) {
						ns.router.Router.getInstance().unlock();
					}
					self._hide(newOptions);
				}
			};

			/**
			 * Store Open options.
			 * @method _storeOpenOptions
			 * @param {Object} options
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._storeOpenOptions = function (options) {
				var self = this,
					oldOptions = self.options,
					storedOptions = {},
					key;

				for (key in options) {
					if (options.hasOwnProperty(key)) {
						storedOptions[key] = oldOptions[key];
					}
				}

				self.storedOptions = storedOptions;
			};

			/**
			 * Restore Open options and remove some unnecessary ones.
			 * @method _storeOpenOptions
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._restoreOpenOptions = function () {
				var self = this,
					options = self.options,
					propertiesToRemove = ["x", "y", "fromHashChange"];

				// we restore opening values of all options
				options = objectUtils.merge(options, self.storedOptions);
				// and remove all values which should not be stored
				objectUtils.removeProperties(options, propertiesToRemove);
			};

			/**
			 * Show popup.
			 * @method _show
			 * @param {Object} options
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._show = function (options) {
				var self = this,
					transitionOptions = objectUtils.merge({}, options),
					overlay = self._ui.overlay,
					pageContent = self._ui.pageContent;

				// set layout
				self._layout(self.element);

				// change state of popup
				self.state = states.DURING_OPENING;
				// set transition
				transitionOptions.ext = " in ";

				self.trigger(events.before_show);
				// show overlay
				if (overlay && self.options.overlay) {
					overlay.classList.toggle(classes.overlayShown, true);
				}

				// disable page pointer events
				if (pageContent) {
					pageContent.classList.toggle(Page.classes.uiContentUnderPopup, true);
				}

				// start opening animation
				self._transition(transitionOptions, self._onShow.bind(self));

				// animation has started
				self.trigger(events.transition_start);
			};

			/**
			 * Show popup
			 * @method _onShow
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._onShow = function () {
				var self = this;

				self._setActive(true);
				if (self.isKeyboardSupport) {
					self.disableFocusableElements(this._ui.page);
					self.enableDisabledFocusableElements(this.element);
					BaseKeyboardSupport.focusElement(this.element);
				}
				self.trigger(events.show);
			};

			/**
			 * Hide popup
			 * @method _hide
			 * @param {Object} options
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._hide = function (options) {
				var self = this,
					isOpened = self._isOpened(),
					callbacks = self._callbacks,
					pageContent = self._ui.pageContent;

				// change state of popup
				self.state = states.DURING_CLOSING;

				self.trigger(events.before_hide);

				// enable page pointer events
				if (pageContent) {
					pageContent.classList.toggle(Page.classes.uiContentUnderPopup, false);
				}

				if (isOpened) {
					// popup is opened, so we start closing animation
					options.ext = " out ";
					self._transition(options, self._onHide.bind(self));
				} else {
					// popup is active, but not opened yet (DURING_OPENING), so
					// we stop opening animation
					if (callbacks.transitionDeferred) {
						callbacks.transitionDeferred.reject();
					}
					if (callbacks.animationEnd) {
						callbacks.animationEnd();
					}
					// and set popup as inactive
					self._onHide();
				}
			};

			/**
			 * Hide popup
			 * @method _onHide
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._onHide = function () {
				var self = this,
					overlay = self._ui.overlay;

				self._setActive(false);

				if (self.isKeyboardSupport) {
					self.enableDisabledFocusableElements(this._ui.page);
				}

				if (overlay) {
					overlay.classList.toggle(classes.overlayShown, false);
				}
				self._restoreOpenOptions();
				self.trigger(events.hide);
			};

			/**
			 * Handle events
			 * @method handleEvent
			 * @param {Event} event
			 * @member ns.widget.core.Popup
			 */
			prototype.handleEvent = function (event) {
				var self = this,
					router = ns.router.Router.getInstance();

				switch (event.type) {
					case "pagebeforehide":
						// we need close active popup if exists
						router.close(null, {transition: "none", rel: "popup"});
						break;
					case "resize":
						self._onResize(event);
						break;
					case "vclick":
						if (event.target === self._ui.overlay) {
							self._onClickOverlay(event);
						}
						break;
					case "scroll":
						self._onScroll(event);
						break;
				}
			};

			/**
			 * Refresh structure
			 * @method _refresh
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._refresh = function () {
				var self = this;

				self._setOverlay(self.element, self.options.overlay);
			};

			/**
			 * Callback function fires after clicking on overlay.
			 * @method _onClickOverlay
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._onClickOverlay = function (event) {
				var options = this.options;

				event.preventDefault();
				event.stopPropagation();

				if (options.dismissible) {
					ns.router.Router.getInstance().close(null, {rel: "popup"});
				}
			};

			/**
			 * Callback function fires on resizing
			 * @method _onResize
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._onResize = function () {
				if (this._isOpened()) {
					this._refresh();
				}
			};

			function clearAnimation(self, transitionClass, deferred) {
				var element = self.element,
					elementClassList = element.classList,
					overlay = self._ui.overlay,
					animationEndCallback = self._callbacks.animationEnd;

				// remove callbacks on animation events
				element.removeEventListener("animationend", animationEndCallback, false);
				element.removeEventListener("webkitAnimationEnd", animationEndCallback, false);
				element.removeEventListener("mozAnimationEnd", animationEndCallback, false);
				element.removeEventListener("oAnimationEnd", animationEndCallback, false);
				element.removeEventListener("msAnimationEnd", animationEndCallback, false);

				// clear classes
				transitionClass.split(" ").forEach(function (currentClass) {
					currentClass = currentClass.trim();
					if (currentClass.length > 0) {
						elementClassList.remove(currentClass);
						if (overlay) {
							overlay.classList.remove(currentClass);
						}
					}
				});
				if (deferred.state() === "pending") {
					// we resolve only pending (not rejected) deferred
					deferred.resolve();
				}
			}

			function setTransitionDeferred(self, resolve) {
				var deferred = new UtilDeferred();

				deferred.then(function () {
					if (deferred === self._callbacks.transitionDeferred) {
						resolve();
					}
				});

				self._callbacks.transitionDeferred = deferred;
				return deferred;
			}

			/**
			 * Animate popup opening/closing
			 * @method _transition
			 * @protected
			 * @param {Object} [options]
			 * @param {string=} [options.transition]
			 * @param {string=} [options.ext]
			 * @param {?Function} [resolve]
			 * @member ns.widget.core.Popup
			 */
			prototype._transition = function (options, resolve) {
				var self = this,
					transition = options.transition || self.options.transition || "none",
					transitionClass = transition + options.ext,
					element = self.element,
					elementClassList = element.classList,
					overlayClassList,
					deferred,
					animationEndCallback;

				if (self._ui.overlay) {
					overlayClassList = self._ui.overlay.classList;
				}

				deferred = setTransitionDeferred(self, resolve);

				if (transition !== "none") {
					// set animationEnd callback
					animationEndCallback = clearAnimation.bind(null, self, transitionClass, deferred);
					self._callbacks.animationEnd = animationEndCallback;

					// add animation callbacks
					element.addEventListener("animationend", animationEndCallback, false);
					element.addEventListener("webkitAnimationEnd", animationEndCallback, false);
					element.addEventListener("mozAnimationEnd", animationEndCallback, false);
					element.addEventListener("oAnimationEnd", animationEndCallback, false);
					element.addEventListener("msAnimationEnd", animationEndCallback, false);
					// add transition classes
					transitionClass.split(" ").forEach(function (currentClass) {
						currentClass = currentClass.trim();
						if (currentClass.length > 0) {
							elementClassList.add(currentClass);

							if (overlayClassList) {
								overlayClassList.add(currentClass);
							}

						}
					});
				} else {
					if (!ns.getConfig("noAsync", false)) {
						window.setTimeout(deferred.resolve, 0);
					} else {
						deferred.resolve();
					}
				}
				return deferred;
			};

			/**
			 * Destroy popup
			 * @method _destroy
			 * @protected
			 * @member ns.widget.core.Popup
			 */
			prototype._destroy = function () {
				var self = this,
					element = self.element,
					ui = self._ui,
					wrapper = ui.wrapper,
					child;

				if (wrapper) {
					// restore all children from wrapper
					child = wrapper.firstChild;
					while (child) {
						element.appendChild(child);
						child = wrapper.firstChild;
					}

					if (wrapper.parentNode) {
						wrapper.parentNode.removeChild(wrapper);
					}
				}

				self._unbindEvents(element);
				self._setOverlay(element, false);

				ui.wrapper = null;
			};

			Popup.prototype = prototype;

			ns.widget.core.Popup = Popup;

			engine.defineWidget(
				"Popup",
				POPUP_SELECTOR,
				[
					"open",
					"close",
					"reposition"
				],
				Popup,
				"core"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Popup;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}());
