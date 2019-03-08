/*global window, ns, define */
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
 * #jQuery Mobile mapping namespace
 * Object maps all methods enabling jQuery Mobile API.
 * @class ns.jqm
 */
(function (ns, window) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../core/core",
			"../core/engine"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var eventType = ns.engine.eventType;

			ns.jqm = {
				/**
				 * jQuery object
				 * @property {Object} jQuery
				 * @member ns.jqm
				 */
				jQuery: ns.getConfig("jQuery") || window.jQuery
			};

			/**
			 * Initialize framework in the same way as it is done in jQueryMobile
			 */
			function init() {
				// Tell the world that JQM is ready to serve Tau
				ns.event.trigger(document, "mobileinit");
			}

			/**
			 * Removes events listeners on framework destroy.
			 */
			function destroy() {
				document.removeEventListener(eventType.INIT, init, false);
				document.removeEventListener(eventType.DESTROY, destroy, false);
			}

			document.addEventListener(eventType.INIT, init, false);
			document.addEventListener(eventType.DESTROY, destroy, false);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.jqm;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns, window));
