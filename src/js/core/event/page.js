/*global window, ns, define, ns */
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
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../event" // fetch namespace
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var eventUtils = ns.event,
				pagebeforechange = {
					trigger: function (element, options) {
						eventUtils.trigger(element, "orientationchange", {"options": options});
					},
					properties: ["options"]
				};

			ns.event.page = {
				pagebeforechange: pagebeforechange
			};

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.event.page;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
