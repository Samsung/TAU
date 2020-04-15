/*global ns, define, ns */
/*jslint nomen: true */
/*
 * Copyright (c) 2020 Samsung Electronics Co., Ltd
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
 * #Route Main Tab
 * Support class for router to control changing pages.
 * @class ns.router.route.mainTab
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function () {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../util/object",
			"../route",
			"../../history",
			"./page"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var routeMainTab,
				object = ns.util.object,
				defaults = {
					volatileRecord: true,
					orderNumber: 2
				},
				pageRule = ns.router.route.page,
				prototype = pageRule,
				_option = pageRule.option,
				MainTabRoute = function () {
				};

			MainTabRoute.prototype = prototype;

			routeMainTab = new MainTabRoute();

			routeMainTab.option = function () {
				return object.merge({}, _option.call(pageRule), defaults);
			};
			ns.router.route.maintab = routeMainTab;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return routeMainTab;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}());
