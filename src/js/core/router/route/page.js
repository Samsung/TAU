/*global window, ns, define, ns */
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
 * #Route Page
 * Support class for router to control changing pages.
 * @class ns.router.route.page
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 */
(function (document) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../util/DOM/attributes",
			"../../util/path",
			"../../util/selectors",
			"../../util/object",
			"../../widget/core/Page",
			"../route",
			"../../history"
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
				routePage = {},
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
			function findPageAndSetDataUrl(dataUrl, filter) {
				var id = path.stripQueryParams(dataUrl).replace("#", ""),
					page = document.getElementById(id);

				if (page && utilSelector.matchesSelector(page, filter)) {
					if (dataUrl === id) {
						DOM.setNSData(page, "url", "#" + id);
					} else {
						DOM.setNSData(page, "url", dataUrl);
					}

				} else {
					// if we matched any element, but it doesn't match our filter
					// reset page to null
					page = null;
				}
				return page;
			}

			routePage.orderNumber = 1;
			/**
			 * Property containing default properties
			 * @property {Object} defaults
			 * @property {string} defaults.transition="none"
			 * @static
			 * @member ns.router.route.page
			 */
			routePage.defaults = {
				transition: "none"
			};

			/**
			 * Property defining selector without spaces for filtering only page elements.
			 * @property {string} filter
			 * @member ns.router.route.page
			 * @static
			 */
			routePage.filter = engine.getWidgetDefinition("Page").selector.replace(/(\s*)/g, "");

			/**
			 * Property contains first page element
			 * @property {?HTMLElement} firstPage
			 * @member ns.router.route.page
			 * @static
			 */
			routePage.firstPage = null;

			/**
			 * Property contains href of original Base element if exists
			 * @property {string} _originalBaseHref
			 * @member ns.router.route.page
			 * @static
			 */
			routePage._originalBaseHref = "";

			/**
			 * Property contains start URI
			 * @property {string} _originalLocation
			 * @member ns.router.route.page
			 * @static
			 */
			routePage._originalLocationHref = "";

			/**
			 * Returns default route options used inside Router.
			 * @method option
			 * @static
			 * @member ns.router.route.page
			 * @return {Object} default route options
			 */
			routePage.option = function () {
				var defaults = object.merge({}, routePage.defaults);

				defaults.transition = ns.getConfig("pageTransition", defaults.transition);
				return defaults;
			};

			routePage.init = function () {
				var pages = [].slice.call(document.querySelectorAll(this.filter));

				pages.forEach(function (page) {
					if (!DOM.getNSData(page, "url")) {
						DOM.setNSData(page, "url",
							(page.id && "#" + page.id) || location.pathname + location.search);
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
			routePage.open = function (toPage, options) {
				var pageTitle = document.title,
					url,
					state;

				if (toPage === this.getFirstElement() && !options.dataUrl) {
					url = path.documentUrl.hrefNoHash;
				} else {
					url = DOM.getNSData(toPage, "url");
				}

				// if no url is set, apply the address of chosen page to data-url attribute
				// and use it as url, as this is needed for history state
				if (!url && options.href) {
					url = options.href;
					DOM.setNSData(toPage, "url", url);
				}

				pageTitle = DOM.getNSData(toPage, "title") ||
					utilSelector.getChildrenBySelector(toPage, ".ui-header > .ui-title").textContent ||
					pageTitle;
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

					if (options.volatileRecord) {
						history.enableVolatileMode();
					}
					history.replace(state, pageTitle, url);

					history.disableVolatileMode();
				}

				// write base element
				this._setBase(url);

				//set page title
				document.title = pageTitle;
				this.active = true;
				this.getContainer().change(toPage, options);

			};

			/**
			 * This method determines target page to open.
			 * @method find
			 * @param {string} absUrl Absolute path to opened page
			 * @member ns.router.route.page
			 * @return {?HTMLElement} Element of page to open.
			 */
			routePage.find = function (absUrl) {
				var self = this,
					router = ns.router.Router.getInstance(),
					dataUrl = self._createDataUrl(absUrl),
					initialContent = self.getFirstElement(),
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
					page = findPageAndSetDataUrl(dataUrl, self.filter);
				}

				// If we failed to find a page in the DOM, check the URL to see if it
				// refers to the first page in the application. Also check to make sure
				// our cached-first-page is actually in the DOM. Some user deployed
				// apps are pruning the first page from the DOM for various reasons.
				// We check for this case here because we don't want a first-page with
				// an id falling through to the non-existent embedded page error case.
				if (!page &&
					path.isFirstPageUrl(dataUrl, self.getFirstElement()) &&
					initialContent) {
					page = initialContent;
				}

				return page;
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
			routePage.parse = function (html, absUrl) {
				var self = this,
					page,
					dataUrl = self._createDataUrl(absUrl);

				// write base element
				self._setBase(absUrl);

				// Finding matching page inside created element
				page = html.querySelector(self.filter);

				// If a page exists...
				if (page) {
					DOM.setNSData(page, "url", dataUrl);
					DOM.setNSData(page, "external", true);
				}
				return page;
			};

			/**
			 * This method handles hash change, **currently does nothing**.
			 * @method onHashChange
			 * @static
			 * @member ns.router.route.page
			 * @return {null}
			 */
			routePage.onHashChange = function (/* url, options */) {
				return null;
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
			routePage._createDataUrl = function (absoluteUrl) {
				return path.convertUrlToDataUrl(absoluteUrl, true);
			};

			/**
			 * On open fail, currently never used
			 * @method onOpenFailed
			 * @member ns.router.route.page
			 */
			routePage.onOpenFailed = function (/* options */) {
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
			routePage._getBaseElement = function () {
				// Fetch document head if never cached before
				if (!head) {
					head = document.querySelector("head");
				}
				// Find base element
				if (!baseElement) {
					baseElement = document.querySelector("base");
					if (baseElement) {
						this._originalBaseHref = baseElement.href;
						this._originalLocationHref = path.documentUrl.hrefNoHash;
					} else {
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
			routePage._setBase = function (url) {
				var base = this._getBaseElement(),
					baseHref = base.href,
					rel = "";

				if (this._originalBaseHref) { // update url refering to exists base
					if (this._originalLocationHref !== path.parseUrl(url).hrefNoSearch) {
						rel = path.parseUrl(url).hrefNoSearch.replace(this._originalLocationHref, "");
						path.documentBase = path.parseUrl(path.makeUrlAbsolute(rel, path.documentBase.href));
					} else {
						url = this._originalBaseHref;
					}
				}
				if (path.isPath(url)) { // set base
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
			 * @return {?ns.widget.core.Page}
			 * @member ns.router.route.page
			 * @static
			 */
			routePage.getContainer = function () {
				return ns.router.Router.getInstance().getContainer();
			};

			/**
			 * Returns active page.
			 * @method getActive
			 * @return {?ns.widget.core.Page}
			 * @member ns.router.route.page
			 * @static
			 */
			routePage.getActive = function () {
				return this.getContainer().getActivePage();
			};

			/**
			 * Returns element of active page.
			 * @method getActiveElement
			 * @return {HTMLElement}
			 * @member ns.router.route.page
			 * @static
			 */
			routePage.getActiveElement = function () {
				return this.getActive().element;
			};

			/**
			 * Method returns ths first page.
			 * @method getFirstElement
			 * @return {HTMLElement} the first page
			 * @member ns.router.route.page
			 */
			routePage.getFirstElement = function () {
				return this.firstPage;
			};

			/**
			 * Method sets ths first page.
			 * @method setFirstElement
			 * @param {HTMLElement} firstPage the first page
			 * @member ns.router.route.page
			 */
			routePage.setFirstElement = function (firstPage) {
				this.firstPage = firstPage;
			};

			ns.router.route.page = routePage;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return routePage;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document));
