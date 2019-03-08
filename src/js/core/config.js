/*global window, define, ns*/
/*jslint bitwise: true */
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
/*
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function () {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./core"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			// Default configuration properties
			ns.setConfig("rootDir", ns.getFrameworkPath(), true);
			ns.setConfig("version", "", true);
			ns.setConfig("allowCrossDomainPages", false, true);
			ns.setConfig("domCache", false, true);
			// .. other possible options
			ns.setConfig("autoBuildOnPageChange", true, true);
			ns.setConfig("autoInitializePage", true, true);
			ns.setConfig("dynamicBaseEnabled", true, true);
			ns.setConfig("pageTransition", "none", true);
			ns.setConfig("popupTransition", "none", true);
			ns.setConfig("popupFullSize", false, true);
			ns.setConfig("scrollEndEffectArea", "content", true);
			ns.setConfig("enablePopupScroll", false, true);
			// ns.setConfig('container', document.body); // for defining application container
			// same as above, but for wearable version
			ns.setConfig("pageContainer", document.body, true);
			ns.setConfig("findProfileFile", false, true);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}());
