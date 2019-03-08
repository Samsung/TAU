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
 * #jQuery Mobile mapping support
 * Object maps support object from TAU namespace to jQuery Mobile namespace.
 * @class ns.jqm.support
 */
(function (window, document) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./namespace",
			"../core/engine",
			"../core/util/object"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var support = ns.support,
				$ = ns.jqm.jQuery,
				object = ns.util.object,
				eventType = ns.engine.eventType,
				jqmSupport = {
					/**
					 * Touch support flag
					 * @property {boolean} touch
					 * @member ns.jqm.support
					 */
					touch: document.ontouchend !== undefined,
					/**
					 * Enables support in jQM after TAU init
					 * @method init
					 * @member ns.jqm.support
					 */
					init: function () {
						var router = ns.router.Router.getInstance();

						if ($) {
							ns.support = object.merge($.support, support);
							$.mobile = $.mobile || {};
							$.mobile.support = $.mobile.support || {};
							$.mobile.support.touch = support.touch;
							$.mobile.base = support.dynamicBaseTag && {
								element: router.resetBase === undefined ? ns.error.bind(null, "router PageExternal is not loaded") : router.resetBase(),
								set: router.setBase === undefined ? ns.error.bind(null, "router PageExternal is not loaded") : router.setBase.bind(router),
								reset: router.resetBase === undefined ? ns.error.bind(null, "router PageExternal is not loaded") : router.resetBase.bind(router)
							};
							$.mobile.gradeA = ns.support.gradeA.bind(ns.support);
							$.mobile.browser = ns.support.browser;
						}
					},
					/**
					 * Removes events listeners on framework destroy
					 */
					destroy: function () {
						document.removeEventListener(eventType.INIT, jqmSupport.init, false);
						document.removeEventListener(eventType.DESTROY, jqmSupport.destroy, false);
					}
				};

			// Listen when framework is ready
			document.addEventListener(eventType.INIT, jqmSupport.init, false);
			document.addEventListener(eventType.DESTROY, jqmSupport.destroy, false);

			ns.jqm.support = jqmSupport;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.jqm.support;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document));
