/*global window, ns, define */
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
 * #Route Drawer
 * Support class for router to control drawer widget in profile Wearable.
 * @class ns.router.route.drawer
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function () {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../util/path",
			"../route",
			"../Router",
			"../../history",
			"../../widget/core/Drawer"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var CoreDrawer = ns.widget.core.Drawer,
				Router = ns.router.Router,
				path = ns.util.path,
				history = ns.history,
				engine = ns.engine,
				routeDrawer = {},
				drawerHashKey = "drawer=true",
				drawerHashKeyReg = /([&|\?]drawer=true)/;

			routeDrawer.orderNumber = 1000;
			/**
			 * Property containing default properties
			 * @property {Object} defaults
			 * @property {string} defaults.transition="none"
			 * @static
			 * @member ns.router.route.drawer
			 */
			routeDrawer.defaults = {
				transition: "none"
			};

			/**
			 * Property defining selector for filtering only drawer elements
			 * @property {string} filter
			 * @member ns.router.route.drawer
			 * @static
			 */
			routeDrawer.filter = "." + CoreDrawer.classes.drawer;


			/**
			 * Returns default route options used inside Router.
			 * But, drawer router has not options.
			 * @method option
			 * @static
			 * @member ns.router.route.drawer
			 * @return {null}
			 */
			routeDrawer.option = function () {
				return null;
			};

			/**
			 * This method opens the drawer.
			 * @method open
			 * @param {HTMLElement} drawerElement
			 * @member ns.router.route.drawer
			 */
			routeDrawer.open = function (drawerElement) {
				var drawer = engine.instanceWidget(drawerElement, "Drawer");

				drawer.open();
			};

			/**
			 * This method determines target drawer to open.
			 * @method find
			 * @param {string} absUrl Absolute path to opened drawer widget
			 * @member ns.router.route.drawer
			 * @return {?HTMLElement} drawerElement
			 */
			routeDrawer.find = function (absUrl) {
				var dataUrl = path.convertUrlToDataUrl(absUrl),
					activePage = Router.getInstance().getContainer().getActivePage(),
					drawer;

				drawer = activePage.element.querySelector("#" + dataUrl);

				return drawer;
			};

			/**
			 * This method parses HTML and runs scripts from parsed code.
			 * But, drawer router doesn't need to that.
			 * @method parse
			 * @member ns.router.route.drawer
			 */
			routeDrawer.parse = function () {
				return null;
			};

			/**
			 * This method sets active drawer and manages history.
			 * @method setActive
			 * @param {Object} activeDrawer
			 * @member ns.router.route.drawer
			 * @static
			 */
			routeDrawer.setActive = function (activeDrawer) {
				var url,
					pathLocation = path.getLocation(),
					documentUrl = pathLocation.replace(drawerHashKeyReg, "");

				this._activeDrawer = activeDrawer;

				if (activeDrawer) {
					url = path.addHashSearchParams(documentUrl, drawerHashKey);
					history.replace({}, "", url);
					this.active = true;
				} else if (pathLocation !== documentUrl) {
					history.back();
				}
			};

			/**
			 * This method handles hash change.
			 * @method onHashChange
			 * @param {string} url
			 * @param {Object} options
			 * @param {string} prev Previous url string
			 * @static
			 * @member ns.router.route.drawer
			 * @return {null}
			 */
			routeDrawer.onHashChange = function (url, options, prev) {
				var self = this,
					activeDrawer = self._activeDrawer,
					stateUrl = prev.stateUrl;

				if (activeDrawer && stateUrl.search(drawerHashKey) > 0 && url.search(drawerHashKey) < 0) {
					activeDrawer.close(options);
					this.active = false;
					return true;
				}
				return false;
			};

			ns.router.route.drawer = routeDrawer;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return routeDrawer;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}());
