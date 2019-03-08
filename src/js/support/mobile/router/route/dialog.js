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
/**
 * #Route Page
 * Support class for router to control changing pages in profile Wearable.
 * @class ns.router.route.page
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (document) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/util/DOM/attributes",
			"../../../../core/util/path",
			"../../../../core/util/selectors",
			"../../../../core/util/object",
			"../../widget/Dialog",
			"../../../../core/router/route",
			"../../../../core/history"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var util = ns.util,
				path = util.path,
				DOM = util.DOM,
				object = util.object,
				utilSelector = util.selectors,
				history = ns.history,
				engine = ns.engine,
				baseElement,
				routeDialog = {},
				head;

			/**
			 * Tries to find a page element matching id and filter (selector).
			 * Adds data url attribute to found page, sets page = null when nothing found
			 * @method findPageAndSetDataUrl
			 * @param {string} dataUrl DataUrl of searching element
			 * @param {string} filter Query selector for searching page
			 * @return {?HTMLElement}
			 * @private
			 * @static
			 * @member ns.router.route.page
			 */
			function findDialogAndSetDataUrl(dataUrl, filter) {
				var id = path.stripQueryParams(dataUrl).replace("#", ""),
					dialog = document.getElementById(id);

				if (dialog && utilSelector.matchesSelector(dialog, filter)) {
					if (dataUrl === id) {
						DOM.setNSData(dialog, "url", "#" + id);
					} else {
						DOM.setNSData(dialog, "url", dataUrl);
					}

				} else {
					// if we matched any element, but it doesn't match our filter
					// reset page to null
					dialog = null;
				}
				// @TODO ... else
				// probably there is a need for running onHashChange while going back to a history entry
				// without state, eg. manually entered #fragment. This may not be a problem on target device
				return dialog;
			}

			/**
			 * Property containing default properties
			 * @property {Object} defaults
			 * @property {string} defaults.transition="none"
			 * @static
			 * @member ns.router.route.page
			 */
			routeDialog.defaults = {
				transition: "none"
			};

			/**
			 * Property defining selector for filtering only page elements
			 * @property {string} filter
			 * @member ns.router.route.page
			 * @static
			 */
			routeDialog.filter = engine.getWidgetDefinition("Dialog").selector;

			/**
			 * Returns default route options used inside Router.
			 * @method option
			 * @static
			 * @member ns.router.route.page
			 * @return {Object} default route options
			 */
			routeDialog.option = function () {
				var defaults = object.merge({}, routeDialog.defaults);

				defaults.transition = ns.getConfig("pageTransition", defaults.transition);
				return defaults;
			};

			routeDialog.init = function () {
				var pages = [].slice.call(document.querySelectorAll(this.filter));

				pages.forEach(function (page) {
					if (!DOM.getNSData(page, "url")) {
						DOM.setNSData(page, "url", (page.id && "#" + page.id) || location.pathname + location.search);
					}
				});
			};

			/**
			 * This method changes page. It sets history and opens page passed as a parameter.
			 * @method open
			 * @param {HTMLElement|string} toPage The page which will be opened.
			 * @param {Object} [options]
			 * @param {boolean} [options.fromHashChange] Sets if call was made on hash change.
			 * @param {string} [options.dataUrl] Sets if page has url attribute.
			 * @member ns.router.route.page
			 */
			routeDialog.open = function (toPage, options) {
				var pageTitle = document.title,
					url,
					state = {},
					router = ns.router.Router.getInstance();

				if (toPage === router.getRoute("page").getFirstElement() && !options.dataUrl) {
					url = path.documentUrl.hrefNoHash;
				} else {
					url = DOM.getNSData(toPage, "url");
				}

				pageTitle = DOM.getNSData(toPage, "title") || utilSelector.getChildrenBySelector(toPage, ".ui-header > .ui-title").textContent || pageTitle;
				if (!DOM.getNSData(toPage, "title")) {
					DOM.setNSData(toPage, "title", pageTitle);
				}

				if (url && !options.fromHashChange) {
					if (!path.isPath(url) && url.indexOf("#") < 0) {
						url = path.makeUrlAbsolute("#" + url, path.documentUrl.hrefNoHash);
					}

					state = object.merge(
						{},
						options,
						{
							url: url
						}
					);

					history.replace(state, pageTitle, url);
				}

				// write base element
				this._setBase(url);

				//set page title
				document.title = pageTitle;

				options.widget = "Dialog";

				this.activeDialog = engine.instanceWidget(toPage, options.widget);

				this.getContainer().change(toPage, options);
			};

			/**
			 * This method determines target page to open.
			 * @method find
			 * @param {string} absUrl Absolute path to opened page
			 * @member ns.router.route.page
			 * @return {?HTMLElement} Element of page to open.
			 */
			routeDialog.find = function (absUrl) {
				var self = this,
					router = ns.router.Router.getInstance(),
					dataUrl = self._createDataUrl(absUrl),
					firstPageElement = router.getFirstPage(),
					pageContainer = router.getContainer(),
					page,
					selector = "[data-url='" + dataUrl + "']",
					filterRegexp = /,/gm;

				if (/#/.test(absUrl) && path.isPath(dataUrl)) {
					return null;
				}

				// Check to see if the page already exists in the DOM.
				// NOTE do _not_ use the :jqmData pseudo selector because parenthesis
				//      are a valid url char and it breaks on the first occurrence
				// prepare selector for new page
				selector += self.filter.replace(filterRegexp, ",[data-url='" + dataUrl + "']");
				page = pageContainer.element.querySelector(selector);

				// If we failed to find the page, check to see if the url is a
				// reference to an embedded page. If so, it may have been dynamically
				// injected by a developer, in which case it would be lacking a
				// data-url attribute and in need of enhancement.
				if (!page && dataUrl && !path.isPath(dataUrl)) {
					//Remove search data
					page = findDialogAndSetDataUrl(dataUrl, self.filter);
				}

				// If we failed to find a page in the DOM, check the URL to see if it
				// refers to the first page in the application. Also check to make sure
				// our cached-first-page is actually in the DOM. Some user deployed
				// apps are pruning the first page from the DOM for various reasons.
				// We check for this case here because we don't want a first-page with
				// an id falling through to the non-existent embedded page error case.
				if (!page &&
					firstPageElement &&
					firstPageElement.parentNode &&
					path.isFirstPageUrl(dataUrl, firstPageElement)) {
					page = firstPageElement;
				}

				return page;
			};

			/**
			 * This method handles hash change.
			 * It closes opened popup.
			 * @method onHashChange
			 * @return {boolean}
			 * @member ns.router.route.popup
			 * @static
			 */
			routeDialog.onHashChange = function () {
				return false;
			};

			/**
			 * This method parses HTML and runs scripts from parsed code.
			 * Fetched external scripts if required.
			 * Sets document base to parsed document absolute path.
			 * @method parse
			 * @param {string} html HTML code to parse
			 * @param {string} absUrl Absolute url for parsed page
			 * @member ns.router.route.page
			 * @return {?HTMLElement} Element of page in parsed document.
			 */
			routeDialog.parse = function (html, absUrl) {
				var self = this,
					page,
					dataUrl = self._createDataUrl(absUrl);

				// write base element
				// @TODO shouldn't base be set if a page was found?
				self._setBase(absUrl);

				// Finding matching page inside created element
				page = html.querySelector(self.filter);

				// If a page exists...
				if (page) {
					// TODO tagging a page with external to make sure that embedded pages aren't
					// removed by the various page handling code is bad. Having page handling code
					// in many places is bad. Solutions post 1.0
					DOM.setNSData(page, "url", dataUrl);
					DOM.setNSData(page, "external", true);
				}
				return page;
			};

			/**
			 * This method creates data url from absolute url given as argument.
			 * @method _createDataUrl
			 * @param {string} absoluteUrl
			 * @protected
			 * @static
			 * @member ns.router.route.page
			 * @return {string}
			 */
			routeDialog._createDataUrl = function (absoluteUrl) {
				return path.convertUrlToDataUrl(absoluteUrl, true);
			};

			/**
			 * On open fail, currently never used
			 * @method onOpenFailed
			 * @member ns.router.route.page
			 */
			routeDialog.onOpenFailed = function (/* options */) {
				this._setBase(path.parseLocation().hrefNoSearch);
			};

			/**
			 * This method returns base element from document head.
			 * If no base element is found, one is created based on current location.
			 * @method _getBaseElement
			 * @protected
			 * @static
			 * @member ns.router.route.page
			 * @return {HTMLElement}
			 */
			routeDialog._getBaseElement = function () {
				// Fetch document head if never cached before
				if (!head) {
					head = document.querySelector("head");
				}
				// Find base element
				if (!baseElement) {
					baseElement = document.querySelector("base");
					if (!baseElement) {
						baseElement = document.createElement("base");
						baseElement.href = path.documentBase.hrefNoHash;
						head.appendChild(baseElement);
					}
				}
				return baseElement;
			};

			/**
			 * Sets document base to url given as argument
			 * @method _setBase
			 * @param {string} url
			 * @protected
			 * @member ns.router.route.page
			 */
			routeDialog._setBase = function (url) {
				var base = this._getBaseElement(),
					baseHref = base.href;

				if (path.isPath(url)) {
					url = path.makeUrlAbsolute(url, path.documentBase);
					if (path.parseUrl(baseHref).hrefNoSearch !== path.parseUrl(url).hrefNoSearch) {
						base.href = url;
						path.documentBase = path.parseUrl(path.makeUrlAbsolute(url, path.documentUrl.href));
					}
				}
			};

			/**
			 * Returns container of pages
			 * @method getContainer
			 * @return {?ns.widget.wearable.Page}
			 * @member ns.router.route.page
			 * @static
			 */
			routeDialog.getContainer = function () {
				return ns.router.Router.getInstance().getContainer();
			};

			/**
			 * Returns active page.
			 * @method getActive
			 * @return {?ns.widget.wearable.Page}
			 * @member ns.router.route.page
			 * @static
			 */
			routeDialog.getActive = function () {
				return this.getContainer().getActivePage();
			};

			/**
			 * Returns element of active page.
			 * @method getActiveElement
			 * @return {HTMLElement}
			 * @member ns.router.route.page
			 * @static
			 */
			routeDialog.getActiveElement = function () {
				return this.getActive().element;
			};
			ns.router.route.dialog = routeDialog;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return routeDialog;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document));
