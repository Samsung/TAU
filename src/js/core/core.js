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
/* global window, define */
/* eslint-disable no-console */
/**
 * #Core namespace
 * Object contains main framework methods.
 * @class ns
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function (document, console) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(function () {
		//>>excludeEnd("tauBuildExclude");
		var idNumberCounter = 0,
			currentDate = +new Date(),
			slice = [].slice,
			rootNamespace = "",
			fileName = "",
			infoForLog = function (args) {
				var dateNow = new Date();

				args.unshift("[" + rootNamespace + "][" + dateNow.toLocaleString() + "]");
			},
			ns = window.ns || window.tau || {},
			nsConfig = window.nsConfig || window.tauConfig || {};

		ns.info = ns.info || {
			profile: "custom"
		};
		ns.tauPerf = ns.tauPerf || {};

		window.ns = ns;
		window.nsConfig = nsConfig;

		window.tau = ns;
		window.tauConfig = nsConfig;

		rootNamespace = nsConfig.rootNamespace;
		fileName = nsConfig.fileName;

		/**
		 * Return unique id
		 * @method getUniqueId
		 * @static
		 * @return {string}
		 * @member ns
		 */
		ns.getUniqueId = function () {
			return rootNamespace + "-" + ns.getNumberUniqueId() + "-" + currentDate;
		};

		/**
		 * Return unique id
		 * @method getNumberUniqueId
		 * @static
		 * @return {number}
		 * @member ns
		 */
		ns.getNumberUniqueId = function () {
			return idNumberCounter++;
		};

		/**
		 * logs supplied messages/arguments
		 * @method log
		 * @static
		 * @member ns
		 */
		ns.log = function () {
			var args = slice.call(arguments);

			infoForLog(args);
			if (console) {
				console.log.apply(console, args);
			}
		};

		/**
		 * logs supplied messages/arguments ad marks it as warning
		 * @method warn
		 * @static
		 * @member ns
		 */
		ns.warn = function () {
			var args = slice.call(arguments);

			infoForLog(args);
			if (console) {
				console.warn.apply(console, args);
			}
		};

		/**
		 * logs supplied messages/arguments and marks it as error
		 * @method error
		 * @static
		 * @member ns
		 */
		ns.error = function () {
			var args = slice.call(arguments);

			infoForLog(args);
			if (console) {
				console.error.apply(console, args);
			}
		};

		/**
		 * get from nsConfig
		 * @method getConfig
		 * @param {string} key
		 * @param {*} [defaultValue] value returned when config is not set
		 * @return {*}
		 * @static
		 * @member ns
		 */
		ns.getConfig = function (key, defaultValue) {
			return nsConfig[key] === undefined ? defaultValue : nsConfig[key];
		};

		/**
		 * set in nsConfig
		 * @method setConfig
		 * @param {string} key
		 * @param {*} value
		 * @param {boolean} [asDefault=false] value should be treated as default (doesn't overwrites
		 * the config[key] if it already exists)
		 * @static
		 * @member ns
		 */
		ns.setConfig = function (key, value, asDefault) {
			if (!asDefault || nsConfig[key] === undefined) {
				nsConfig[key] = value;
			}
		};

		/**
		 * Return path for framework script file.
		 * @method getFrameworkPath
		 * @return {?string}
		 * @member ns
		 */
		ns.getFrameworkPath = function () {
			var scripts = document.getElementsByTagName("script"),
				countScripts = scripts.length,
				i,
				url,
				arrayUrl,
				count;

			for (i = 0; i < countScripts; i++) {
				url = scripts[i].src;
				arrayUrl = url.split("/");
				count = arrayUrl.length;
				if (arrayUrl[count - 1] === fileName + ".js" ||
					arrayUrl[count - 1] === fileName + ".min.js") {
					return arrayUrl.slice(0, count - 1).join("/");
				}
			}
			return null;
		};

		//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		return ns;
	});
	//>>excludeEnd("tauBuildExclude");
}(window.document, window.console));
