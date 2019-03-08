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
 * #Route CircularIndexScrollbar
 * Support class for router to control circularindexscrollbar widget in profile Wearable.
 * @class ns.router.route.circularindexscrollbar
 * @author Junyoung Park <jy-.park@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/util/DOM/attributes",
			"../../../../core/util/path",
			"../../../../core/util/selectors",
			"../../../../core/util/object",
			"../../../../core/router/route",
			"../../../../core/history",
			"../../widget/wearable/CircularIndexScrollbar"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var util = ns.util,
				path = util.path,
				history = ns.router.history,
				routeCircularIndexScrollbar = {},
				circularindexscrollbarHashKey = "circularindexscrollbar=true",
				circularindexscrollbarHashKeyReg = /([&|\?]circularindexscrollbar=true)/,
				INDEXSCROLLBAR_SELECTOR = ".ui-circularindexscrollbar";

			routeCircularIndexScrollbar.orderNumber = 2000;
			/**
			 * Property defining selector for filtering only circularIndexScrollbar elements
			 * @property {string} filter
			 * @member ns.router.route.circularindexscrollbar
			 * @static
			 */
			routeCircularIndexScrollbar.filter = INDEXSCROLLBAR_SELECTOR;

			/**
			 * Returns default route options used inside Router.
			 * But, circularindexscrollbar router has not options.
			 * @method option
			 * @static
			 * @member ns.router.route.circularindexscrollbar
			 * @return {null}
			 */
			routeCircularIndexScrollbar.option = function () {
				return null;
			};

			/**
			 * This method opens the circularindexscrollbar.
			 * @method open
			 * @return {null}
			 * @member ns.router.route.circularindexscrollbar
			 */
			routeCircularIndexScrollbar.open = function () {
				return null;
			};

			/**
			 * This method determines target circularIndexScrollbar to open.
			 * @method find
			 * @param {string} absUrl Absolute path to opened circularIndexScrollbar widget
			 * @member ns.router.route.circularindexscrollbar
			 * @return {?HTMLElement} circularIndexScrollbarElement
			 */
			routeCircularIndexScrollbar.find = function (absUrl) {
				var dataUrl = path.convertUrlToDataUrl(absUrl),
					activePage = ns.router.Router.getInstance().getContainer().getActivePage(),
					circularIndexScrollbar;

				circularIndexScrollbar = activePage.element.querySelector("#" + dataUrl);

				return circularIndexScrollbar;
			};

			/**
			 * This method parses HTML and runs scripts from parsed code.
			 * But, circularIndexScrollbar router doesn't need to that.
			 * @method parse
			 * @member ns.router.route.circularindexscrollbar
			 * @return {?HTMLElement} Element of page in parsed document.
			 */
			routeCircularIndexScrollbar.parse = function () {
				return null;
			};

			/**
			 * This method sets active circularIndexScrollbar and manages history.
			 * @method setActive
			 * @param {Object} activeWidget
			 * @member ns.router.route.circularindexscrollbar
			 * @static
			 */
			routeCircularIndexScrollbar.setActive = function (activeWidget) {
				var url,
					pathLocation = path.getLocation(),
					documentUrl = pathLocation.replace(circularindexscrollbarHashKeyReg, "");

				this._activeWidget = activeWidget;

				if (activeWidget) {
					url = path.addHashSearchParams(documentUrl, circularindexscrollbarHashKey);
					history.replace({}, "", url);
				} else if (pathLocation !== documentUrl) {
					history.back();
				}
				this.active = true;
			};

			/**
			 * This method handles hash change.
			 * @method onHashChange
			 * @param {string} url
			 * @param {Object} options
			 * @param {Object} prev
			 * @static
			 * @member ns.router.route.circularindexscrollbar
			 * @return {null}
			 */
			routeCircularIndexScrollbar.onHashChange = function (url, options, prev) {
				var self = this,
					activeWidget = self._activeWidget,
					stateUrl = prev.stateUrl;

				if (activeWidget && stateUrl.search(circularindexscrollbarHashKey) > 0 && url.search(circularindexscrollbarHashKey) < 0) {
					activeWidget.hide(options);
					self.active = false;
					return true;
				}
				return null;
			};

			ns.router.route.circularindexscrollbar = routeCircularIndexScrollbar;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return routeCircularIndexScrollbar;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
