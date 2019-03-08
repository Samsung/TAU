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
 *
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Framework Data Object
 * Object contains properties describing run time environment.
 * @class ns.frameworkData
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./core"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var slice = Array.prototype.slice,
				FRAMEWORK_WEBUI = "tizen-web-ui-fw",
				FRAMEWORK_TAU = "tau",
				IS_TAU_REGEXP = /(^|[\\\/])(tau(\.full|\.mvc)?(\.min)?\.js)$/,
				// Regexp detect framework js file
				LIB_FILENAME_REGEXP = /(^|[\\\/])(tau|tizen-web-ui-fw)(\.full|\.mvc|\.custom)?(\.min)?\.js$/,
				// Regexp detect framework css file
				CSS_FILENAME_REGEXP = /(^|[\\\/])(tau|tizen-web-ui-fw)(\.full|\.mvc|\.custom)?(\.min)?\.css$/,
				// Regexp detect correct theme name
				TIZEN_THEMES_REGEXP = /^(changeable|white|black|default)$/i,
				MINIFIED_REGEXP = /\.min\.js$/,
				frameworkData = {
					/**
					 * The name of framework
					 * @property {string} frameworkName="tizen-web-ui-fw"
					 * @member ns.frameworkData
					 * @static
					 */
					frameworkName: FRAMEWORK_WEBUI,
					/**
					 * The root directory of framework on current device
					 * @property {string} rootDir="/usr/share/tizen-web-ui-fw"
					 * @member ns.frameworkData
					 * @static
					 */
					rootDir: "/usr/share/" + FRAMEWORK_WEBUI,
					/**
					 * The version of framework
					 * @property {string} version="latest"
					 * @member ns.frameworkData
					 * @static
					 */
					version: "latest",
					/**
					 * The theme of framework
					 * @property {string} theme="default"
					 * @member ns.frameworkData
					 * @static
					 */
					theme: "default",
					/**
					 * Tells if the theme that is set was already loaded
					 * @property {boolean} themeLoaded=false
					 * @member ns.frameworkData
					 * @static
					 */
					themeLoaded: false,
					/**
					 * The default width of viewport in framework.
					 * @property {number} defaultViewportWidth=360
					 * @member ns.frameworkData
					 * @static
					 */
					defaultViewportWidth: 360,
					/**
					 * The type of width of viewport in framework.
					 * @property {string} viewportWidth="device-width"
					 * @member ns.frameworkData
					 * @static
					 */
					viewportWidth: "device-width",
					/**
					 * Determines whether the viewport should be scaled
					 * @property {boolean} isMinified=false
					 * @member ns.frameworkData
					 * @static
					 */
					viewportScale: false,
					/**
					 * The default font size in framework.
					 * @property {number} defaultFontSize=22
					 * @member ns.frameworkData
					 * @static
					 */
					defaultFontSize: 22,
					/**
					 * Determines whether the framework is minified
					 * @property {boolean} minified=false
					 * @member ns.frameworkData
					 * @static
					 */
					minified: false,
					/**
					 * Determines the capability of device
					 * @property {Object} deviceCapa
					 * @property {boolean} deviceCapa.inputKeyBack=true
					 * Determines whether the back key is supported.
					 * @property {boolean} deviceCapa.inputKeyMenu=true
					 *  Determines whether the menu key is supported.
					 * @member ns.frameworkData
					 * @static
					 */
					deviceCapa: {inputKeyBack: true, inputKeyMenu: true},
					/**
					 * Determines whether the framework is loaded in debug profile.
					 * @property {boolean} debug=false
					 * @member ns.frameworkData
					 * @static
					 */
					debug: false,
					/**
					 * The version of framework's package
					 * @property {string} pkgVersion="0.2.83"
					 * @member ns.frameworkData
					 * @static
					 */
					pkgVersion: "0.2.83",
					/**
					 * The prefix of data used in framework
					 * @property {string} dataPrefix="data-framework-"
					 * @member ns.frameworkData
					 * @static
					 */
					dataPrefix: "data-framework-",
					/**
					 * The profile of framework
					 * @property {string} profile=""
					 * @member ns.frameworkData
					 * @static
					 */
					profile: ""
				};

			/**
			 * Get data-* params from <script> tag, and set tizen.frameworkData.* values
			 * Returns true if proper <script> tag is found, or false if not.
			 * @method getParams
			 * @return {boolean} Returns true if proper <script> tag is found, or false if not.
			 * @member ns.frameworkData
			 * @static
			 */
			frameworkData.getParams = function () {
				var self = this,
					dataPrefix = self.dataPrefix,
					scriptElements = slice.call(document.querySelectorAll("script[src]")),
					cssElements = slice.call(document.styleSheets),
					themeLoaded = false,
					theme;

				/**
				 * Following cases should be covered here (by recognizing on-page css files).
				 * The final theme and themePath values are determined after going through all script elements
				 *
				 *
				 * none                                       -> theme: null
				 * <link href="theme.css" />                  -> theme: null
				 * <link href="default/theme.css" />          -> theme: null
				 * <link href="tau.css" />                    -> theme: null
				 * <link href="white/tau.min.css" />          -> theme: "white"
				 * <link href="other/path/black/tau.css" />   -> theme: "black"
				 * <link href="other/path/black/tau.css" />   -> theme: "black"
				 * <link href="other/path/black/other.css" /> -> theme: null
				 * <link href="other/path/black/other.css" data-theme-name="white" />     -> theme: "white"
				 * @method findThemeInLinks
				 * @param {CSSStyleSheet} styleSheet
				 */
				// @TODO write unit tests for covering those cases
				function findThemeInLinks(styleSheet) {
					var cssElement = styleSheet.ownerNode,
						dataThemeName = cssElement.getAttribute("data-theme-name"),
						// Attribute value is taken because href property gives different output
						href = cssElement.getAttribute("href"),
						hrefFragments = href && href.split("/"),
						hrefDirPart;

					// If we have the theme name defined we can use it right away
					// without thinking about the naming convention
					if (dataThemeName) {
						if (TIZEN_THEMES_REGEXP.test(dataThemeName)) {
							theme = dataThemeName;
						}
					} else if (href && CSS_FILENAME_REGEXP.test(href)) {
						// We try to find file matching library theme CSS
						// If we have the theme name defined we can use it right away
						// We can only determine the current theme using path based approach when the .css file
						// is located in at least one directory
						if (hrefFragments.length >= 2) {
							// When the second to last element matches known themes set the theme to that name
							hrefDirPart = hrefFragments.slice(-2)[0].match(TIZEN_THEMES_REGEXP);
							theme = hrefDirPart && hrefDirPart[0];
						}
					}

					// In case a theme was found (here or in a previous stylesheet) this will be true
					themeLoaded = themeLoaded || !!theme;
				}

				/**
				 * Sets framework data based on found framework library
				 * @param {HTMLElement} scriptElement
				 */
				// @TODO write unit cases
				function findFrameworkDataInScripts(scriptElement) {
					var src = scriptElement.getAttribute("src"),
						profileName = "",
						frameworkName,
						themePath,
						jsPath;

					// Check if checked file is a known framework
					// no need to check if src exists because of the query selector
					if (LIB_FILENAME_REGEXP.test(src)) {

						// Priority:
						// 1. theme loaded with css
						// 2. theme from attribute
						// 3. default theme
						theme = theme || scriptElement.getAttribute(dataPrefix + "theme") || self.theme;

						theme = theme.toLowerCase();

						if (IS_TAU_REGEXP.test(src)) {
							frameworkName = FRAMEWORK_TAU;
							// Get profile name.
							// Profile may be defined from framework script or
							// it can be assumed, that profile name is second up directory name
							// e.g. pathToLib/profileName/js/tau.js
							profileName = scriptElement.getAttribute(dataPrefix + "profile") || src.split("/").slice(-3)[0];
							themePath = "/" + profileName + "/theme/" + theme;

							// TAU framework library link
							jsPath = "/" + profileName + "/js";
						} else {
							// tizen-web-ui framework
							frameworkName = FRAMEWORK_WEBUI;
							themePath = "/latest/themes/" + theme;
							jsPath = "/latest/js";
						}

						self.rootDir = scriptElement.getAttribute(dataPrefix + "root") ||
							// remove from src path jsPath and "/" sign
							src.substring(0, src.lastIndexOf(frameworkName) - jsPath.length - 1) ||
							self.rootDir;

						self.themePath = self.rootDir + themePath;
						self.jsPath = self.rootDir + jsPath;
						self.version = scriptElement.getAttribute(dataPrefix + "version") || self.version;
						self.theme = theme;
						self.themeLoaded = themeLoaded;
						self.frameworkName = frameworkName;
						self.minified = src.search(MINIFIED_REGEXP) > -1;
						self.profile = profileName;
					}
				}

				cssElements.forEach(findThemeInLinks);
				scriptElements.forEach(findFrameworkDataInScripts);
			};

			ns.frameworkData = frameworkData;
			// self init
			ns.frameworkData.getParams();
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
