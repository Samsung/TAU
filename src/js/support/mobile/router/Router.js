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
 * #Router Support
 * Legacy router API support
 *
 * @class ns.router.Router
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/router/Router"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var router = ns.router.Router.getInstance();

			function defineActivePage(router) {
				Object.defineProperty(router, "activePage", {
					get: function () {
						return router.container.activePage;
					}
				});
			}

			if (router) {
				defineActivePage(router);
			} else {
				document.addEventListener("routerinit", function (event) {
					var router = event.detail;

					defineActivePage(router);
				});
			}

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
