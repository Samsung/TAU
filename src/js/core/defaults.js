/*global define, ns */
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
 * #Defaults settings object
 *
 * This module is deprecated, please use tau.setConfig and tau.getConfig functions or tauConfig
 * object.
 *
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 * @author junhyeonLee <juneh.lee@samsung.com>
 * @author heeju Joo <heeju.joo@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author hagun.kim <hagun.kim@samsung.com>
 * @class ns.defaults
 * @since 2.0
 * @deprecated 3.0
 */
(function () {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./core",
			"./config"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var defaults = {};

			/**
			 * Helper function to define property on object defaults
			 * @param {string} name Property name to define
			 */
			function defineProperty(name) {
				Object.defineProperty(ns.defaults, name, {
					get: function () {
						ns.warn("tau.defaults are deprecated from Tizen 3.0, please use tau.getConfig.");
						return ns.getConfig(name);
					},
					set: function (value) {
						ns.warn("tau.defaults are deprecated from Tizen 3.0, please use tau.setConfig.");
						return ns.setConfig(name, value);
					}
				});
			}

			ns.defaults = defaults;

			/**
			 * @property {boolean} autoInitializePage=true
			 * @member ns.defaults
			 * @static
			 */
			defineProperty("autoInitializePage");
			/**
			 * @property {boolean} dynamicBaseEnabled=true
			 * @member ns.defaults
			 * @static
			 */
			defineProperty("dynamicBaseEnabled");
			/**
			 * @property {string} pageTransition="none"
			 * @member ns.defaults
			 * @static
			 */
			defineProperty("pageTransition");
			/**
			 * @property {string} popupTransition="none"
			 * @member ns.defaults
			 * @static
			 */
			defineProperty("popupTransition");
			/**
			 * @property {boolean} popupFullSize=false
			 * @member ns.defaults
			 * @static
			 */
			defineProperty("popupFullSize");
			/**
			 * @property {boolean} enablePageScroll=false
			 * @member ns.defaults
			 * @static
			 */
			defineProperty("enablePageScroll");
			/**
			 * @property {boolean} goToTopButton=false
			 * @member ns.defaults
			 * @static
			 */
			defineProperty("goToTopButton");
			/**
			 * @property {string} scrollEndEffectArea="content
			 * @member ns.defaults
			 * @static
			 */
			defineProperty("scrollEndEffectArea");
			/**
			 * @property {boolean} enablePopupScroll=false
			 * @member ns.defaults
			 * @static
			 */
			defineProperty("enablePopupScroll");

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return defaults;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}());
