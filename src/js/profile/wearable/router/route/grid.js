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
/*global window, define, ns */
/**
 * #Route grid
 * Support class for router to control grid widget in profile Wearable.
 * @class ns.router.route.grid
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function () {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/router/route",
			"../../../../core/history"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var history = ns.history,
				routeGrid = {
					orderNumber: 1000,
					filter: ".ui-grid",

					/**
					 * Returns default route options used inside Router.
					 * But, grid router has not options.
					 * @method option
					 * @static
					 * @member ns.router.route.grid
					 * @return {null}
					 */
					option: function () {
						return null;
					},

					open: function (toPage, options) {
						history.replace({
							url: options.url,
							rel: options.rel
						},
							options.url,
							options.title
						);
					},

					onHashChange: function () {
						return null;
					},

					find: function () {
						return null;
					}
				};

			ns.router.route.grid = routeGrid;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return routeGrid;
		}
	);
//>>excludeEnd("tauBuildExclude");
}());
