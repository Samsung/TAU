/*global window, ns, define */
/*jslint plusplus: true, nomen: true */
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
 * #jQuery Mobile mapping colors
 * Object maps color support object from TAU namespace to
 * jQuery Mobile namespace.
 * @class ns.jqm.colors
 */
(function (document) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./namespace",
			"../core/engine",
			"../core/util/colors"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var eventType = ns.engine.eventType,
				$ = ns.jqm.jQuery,
				colors = {
					/**
					 * Initializes colors util in jQueryMobile namespace
					 */
					init: function () {
						if ($) {
							$.mobile.tizen.clrlib = colors;
						}
					},

					/**
					 * Destroys colors util in jQueryMobile namespace
					 */
					destroy: function () {
						document.removeEventListener(eventType.INIT, colors.init, false);
						document.removeEventListener(eventType.DESTROY, colors.destroy, false);
						if ($) {
							delete $.mobile.tizen.clrlib;
						}
						window.ns = null;
						$ = null;
						eventType = null;
						colors = null;
					}
				};

			// Listen when framework is ready
			document.addEventListener(eventType.INIT, colors.init, false);
			document.addEventListener(eventType.DESTROY, colors.destroy, false);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document));
