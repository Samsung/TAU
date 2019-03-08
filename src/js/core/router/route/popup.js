/*global window, define, ns */
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
 * #Route Popup
 * Support class for router to control changing popups.
 * @class ns.router.route.popup
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../util/path",
			"../../util/DOM/attributes",
			"../../util/object",
			"../../widget/core/Popup",
			"../../history",
			"../Router",
			"../route"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var
				/**
				 * @property {Object} Popup Alias for {@link ns.widget.Popup}
				 * @member ns.router.route.popup
				 * @private
				 * @static
				 */
				Popup = ns.widget.core.Popup,
				util = ns.util,
				routePopup = {
					/**
					 * Object with default options
					 * @property {Object} defaults
					 * @property {string} [defaults.transition='none'] Sets the animation used during change
					 * of popup.
					 * @property {?HTMLElement} [defaults.container=null] Sets container of element.
					 * @property {boolean} [defaults.volatileRecord=true] Sets if the current history entry
					 * will be modified or a new one will be created.
					 * @member ns.router.route.popup
					 * @static
					 */
					defaults: {
						transition: "none",
						container: null,
						volatileRecord: true
					},
					/**
					 * Popup Element Selector
					 * @property {string} filter
					 * @member ns.router.route.popup
					 * @static
					 */
					filter: "." + Popup.classes.popup,
					/**
					 * Storage variable for active popup
					 * @property {?HTMLElement} activePopup
					 * @member ns.router.route.popup
					 * @static
					 */
					activePopup: null,
					/**
					 * Dictionary for popup related event types
					 * @property {Object} events
					 * @property {string} [events.POPUP_HIDE='popuphide']
					 * @member ns.router.route.popup
					 * @static
					 */
					events: {
						POPUP_HIDE: "popuphide"
					},

					/**
					 * Alias for {@link ns.util.path}
					 * @property {Object} path
					 * @member ns.router.route.popup
					 * @protected
					 * @static
					 */
					_path: ns.util.path,
					/**
					 * Alias for {@link ns.router.history}
					 * @property {Object} history
					 * @member ns.router.route.popup
					 * @protected
					 * @static
					 */
					_history: ns.history
				},
				/**
				 * Alias for {@link ns.engine}
				 * @property {Object} engine
				 * @member ns.router.route.popup
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * Alias for {@link ns.util.selectors}
				 * @property {Object} utilSelector
				 * @member ns.router.route.popup
				 * @private
				 * @static
				 */
				utilSelector = ns.util.selectors,
				/**
				 * Alias for {@link ns.util.DOM}
				 * @property {Object} DOM
				 * @member ns.router.route.popup
				 * @private
				 * @static
				 */
				DOM = ns.util.DOM,
				/**
				 * Alias for Object utils
				 * @method slice
				 * @member ns.router.route.popup
				 * @private
				 * @static
				 */
				object = ns.util.object,
				/**
				 * Popup's hash added to url
				 * @property {string} popupHashKey
				 * @member ns.router.route.popup
				 * @private
				 * @static
				 */
				popupHashKey = "popup=true",
				/**
				 * Regexp for popup's hash
				 * @property {RegExp} popupHashKeyReg
				 * @member ns.router.route.popup
				 * @private
				 * @static
				 */
				popupHashKeyReg = /([&|\?]popup=true)/;

			/**
			 * Tries to find a popup element matching id and filter (selector).
			 * Adds data url attribute to found page, sets page = null when nothing found.
			 * @method findPopupAndSetDataUrl
			 * @param {string} id
			 * @param {string} filter
			 * @return {HTMLElement}
			 * @member ns.router.route.popup
			 * @private
			 * @static
			 */
			function findPopupAndSetDataUrl(id, filter) {
				var popup,
					hashReg = /^#/;

				id = id.replace(hashReg, "");
				popup = document.getElementById(id);

				if (popup && utilSelector.matchesSelector(popup, filter)) {
					DOM.setNSData(popup, "url", "#" + id);
				} else {
					// if we matched any element, but it doesn't match our filter
					// reset page to null
					popup = null;
				}
				// probably there is a need for running onHashChange while going back to a history entry
				// without state, eg. manually entered #fragment. This may not be a problem on target device
				return popup;
			}

			routePopup.orderNumber = 100;
			/**
			 * This method returns default options for popup router.
			 * @method option
			 * @return {Object}
			 * @member ns.router.route.popup
			 * @static
			 */
			routePopup.option = function () {
				var defaults = object.merge({}, routePopup.defaults);

				defaults.transition = ns.getConfig("popupTransition", defaults.transition);
				return defaults;
			};

			/**
			 * This method sets active popup and manages history.
			 * @method setActive
			 * @param {?ns.widget.core.popup} activePopup
			 * @param {Object} options
			 * @member ns.router.route.popup
			 * @static
			 */
			routePopup.setActive = function (activePopup, options) {
				var url,
					pathLocation = routePopup._path.getLocation(),
					documentUrl = pathLocation.replace(popupHashKeyReg, "");

				this.activePopup = activePopup;

				if (activePopup) {
					// If popup is being opened, the new state is added to history.
					if (options && !options.fromHashChange && options.history) {
						url = routePopup._path.addHashSearchParams(documentUrl, popupHashKey);
						routePopup._history.replace(options, "", url);
						this.active = true;
					}
				} else if (pathLocation !== documentUrl) {
					// If popup is being closed, the history.back() is called
					// but only if url has special hash.
					// Url is changed after opening animation and in some cases,
					// the popup is closed before this animation and then the history.back
					// could cause undesirable change of page.
					this.active = false;
					routePopup._history.back();
				}
			};

			/**
			 * This method opens popup if no other popup is opened.
			 * It also changes history to show that popup is opened.
			 * If there is already active popup, it will be closed.
			 * @method open
			 * @param {HTMLElement|string} toPopup
			 * @param {Object} options
			 * @param {"page"|"popup"|"external"} [options.rel = 'popup'] Represents kind of link as
			 * 'page' or 'popup' or 'external' for linking to another domain.
			 * @param {string} [options.transition = 'none'] Sets the animation used during change of
			 * popup.
			 * @param {boolean} [options.reverse = false] Sets the direction of change.
			 * @param {boolean} [options.fromHashChange = false] Sets if will be changed after hashchange.
			 * @param {boolean} [options.showLoadMsg = true] Sets if message will be shown during loading.
			 * @param {number} [options.loadMsgDelay = 0] Sets delay time for the show message during
			 * loading.
			 * @param {boolean} [options.dataUrl] Sets if page has url attribute.
			 * @param {string} [options.container = null] Selector for container.
			 * @param {boolean} [options.volatileRecord=true] Sets if the current history entry will be
			 * modified or a new one will be created.
			 * @param {Event} event
			 * @member ns.router.route.popup
			 * @static
			 */
			routePopup.open = function (toPopup, options, event) {
				var self = this,
					popup,
					router = ns.router.Router.getInstance(),
					events = self.events,
					removePopup = function () {
						document.removeEventListener(events.POPUP_HIDE, removePopup, false);
						toPopup.parentNode.removeChild(toPopup);
						self.activePopup = null;
					},
					openPopup = function () {
						var positionTo = options["position-to"],
							touch;
						// add such option only if it exists

						if (positionTo) {
							options.positionTo = positionTo;
						}
						if (event) {
							touch = event.touches ? event.touches[0] : event;
							options.x = touch.clientX;
							options.y = touch.clientY;
						}

						document.removeEventListener(events.POPUP_HIDE, openPopup, false);
						popup = engine.instanceWidget(toPopup, "Popup", options);
						popup.open(options);
						self.activePopup = popup;
						self.active = popup.options.history;
					},
					activePage = router.container.getActivePage(),
					container;

				if (DOM.getNSData(toPopup, "external") === true) {
					container = options.container ?
						activePage.element.querySelector(options.container) : activePage.element;
					if (toPopup.parentNode !== container) {
						toPopup = util.importEvaluateAndAppendElement(toPopup, container);
					}
					document.addEventListener(routePopup.events.POPUP_HIDE, removePopup, false);
				}

				if (self.hasActive()) {
					document.addEventListener(events.POPUP_HIDE, openPopup, false);
					if (!self.close()) {
						openPopup();
					}
				} else {
					openPopup();
				}
			};

			/**
			 * This method closes active popup.
			 * @method close
			 * @param {ns.widget.core.Popup} [activePopup]
			 * @param {Object} options
			 * @param {string} [options.transition]
			 * @param {string} [options.ext= in ui-pre-in] options.ext
			 * @member ns.router.route.popup
			 * @protected
			 * @static
			 */
			routePopup.close = function (activePopup, options) {
				var popupOptions,
					pathLocation = routePopup._path.getLocation(),
					documentUrl = pathLocation.replace(popupHashKeyReg, "");

				options = options || {};

				if (activePopup && !(activePopup instanceof Popup)) {
					activePopup = engine.instanceWidget(activePopup, "Popup", options);
				}
				activePopup = activePopup || this.activePopup;

				// if popup is active
				if (activePopup) {
					popupOptions = activePopup.options;
					// we check if it changed the history
					if (popupOptions.history && pathLocation !== documentUrl) {
						// and then set new options for popup
						popupOptions.transition = options.transition || popupOptions.transition;
						popupOptions.ext = options.ext || popupOptions.ext;
						// unlock the router if it was locked
						if (!popupOptions.dismissible) {
							ns.router.Router.getInstance().unlock();
						}
						// and call history.back()
						routePopup._history.back();
					} else {
						// if popup did not change the history, we close it normally
						activePopup.close(options);
					}
					return true;
				}
				return false;
			};

			/**
			 * This method handles hash change.
			 * It closes opened popup.
			 * @method onHashChange
			 * @param {string} url
			 * @param {Object} options
			 * @return {boolean}
			 * @member ns.router.route.popup
			 * @static
			 */
			routePopup.onHashChange = function (url, options) {
				var activePopup = this.activePopup;

				if (activePopup) {
					activePopup.close(options);
					// Default routing setting cause to rewrite further window history
					// even if popup has been closed
					// To prevent this onHashChange after closing popup we need to change
					// disable volatile mode to allow pushing new history elements
					if (this.active) {
						this.active = false;
						return true;
					}
				}
				return false;
			};

			/**
			 * On open fail, currently never used
			 * @method onOpenFailed
			 * @member ns.router.route.popup
			 * @return {null}
			 * @static
			 */
			routePopup.onOpenFailed = function (/* options */) {
				return null;
			};

			/**
			 * This method finds popup by data-url.
			 * @method find
			 * @param {string} absUrl Absolute path to opened popup
			 * @return {HTMLElement} Element of popup
			 * @member ns.router.route.popup
			 */
			routePopup.find = function (absUrl) {
				var self = this,
					dataUrl = self._createDataUrl(absUrl),
					activePage = ns.router.Router.getInstance().getContainer().getActivePage(),
					popup;

				popup = activePage.element.querySelector("[data-url='" + dataUrl + "']" + self.filter);

				if (!popup && dataUrl && !routePopup._path.isPath(dataUrl)) {
					popup = findPopupAndSetDataUrl(dataUrl, self.filter);
				}

				return popup;
			};

			/**
			 * This method parses HTML and runs scripts from parsed code.
			 * Fetched external scripts if required.
			 * @method parse
			 * @param {string} html HTML code to parse
			 * @param {string} absUrl Absolute url for parsed popup
			 * @return {HTMLElement}
			 * @member ns.router.route.popup
			 */
			routePopup.parse = function (html, absUrl) {
				var self = this,
					popup,
					dataUrl = self._createDataUrl(absUrl);

				popup = html.querySelector(self.filter);

				if (popup) {
					// TODO tagging a popup with external to make sure that embedded popups aren't
					// removed by the various popup handling code is bad. Having popup handling code
					// in many places is bad. Solutions post 1.0
					DOM.setNSData(popup, "url", dataUrl);
					DOM.setNSData(popup, "external", true);
				}

				return popup;
			};

			/**
			 * Convert url to data-url
			 * @method _createDataUrl
			 * @param {string} absoluteUrl
			 * @return {string}
			 * @member ns.router.route.popup
			 * @protected
			 * @static
			 */
			routePopup._createDataUrl = function (absoluteUrl) {
				return routePopup._path.convertUrlToDataUrl(absoluteUrl);
			};

			/**
			 * Return true if active popup exists.
			 * @method hasActive
			 * @return {boolean}
			 * @member ns.router.route.popup
			 * @static
			 */
			routePopup.hasActive = function () {
				return this.active;
			};

			/**
			 * Returns active popup.
			 * @method getActive
			 * @return {?ns.widget.core.Popup}
			 * @member ns.router.route.popup
			 * @static
			 */
			routePopup.getActive = function () {
				return this.activePopup;
			};

			/**
			 * Returns element of active popup.
			 * @method getActiveElement
			 * @return {HTMLElement}
			 * @member ns.router.route.popup
			 * @static
			 */
			routePopup.getActiveElement = function () {
				var active = this.getActive();

				return active && active.element;
			};

			ns.router.route.popup = routePopup;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return routePopup;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
