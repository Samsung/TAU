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
/*global window, ns, define*/
/*
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function () {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../core/core"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			// Default configuration properties for mobile
			ns.setConfig("autoBuildOnPageChange", true, true);
			ns.setConfig("loader", false, true);
			ns.setConfig("pageContainerBody", true, true);
			ns.setConfig("popupTransition", "slideup", true);
			ns.setConfig("pageTransition", "none", true);
			ns.setConfig("enablePageScroll", false, true);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}());
