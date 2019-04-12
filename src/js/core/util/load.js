/*global window, ns, define, XMLHttpRequest, ns */
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
 * #Load Utility
 * Object contains function to load external resources.
 * @class ns.util.load
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart('tauBuildExclude', pragmas.tauBuildExclude);
	define(
		[
			"../util"
		],
		function () {
			//>>excludeEnd('tauBuildExclude');

			/**
			 * Local alias for document HEAD element
			 * @property {HTMLHeadElement} head
			 * @static
			 * @private
			 * @member ns.util.load
			 */
			var head = document.head,
				/**
				 * Local alias for document styleSheets element
				 * @property {HTMLStyleElement} styleSheets
				 * @static
				 * @private
				 * @member ns.util.load
				 */
				styleSheets = document.styleSheets,
				/**
				 * Local alias for ns.util.DOM
				 * @property {Object} utilsDOM Alias for {@link ns.util.DOM}
				 * @member ns.util.load
				 * @static
				 * @private
				 */
				utilDOM = ns.util.DOM,
				getNSData = utilDOM.getNSData,
				setNSData = utilDOM.setNSData,
				load = ns.util.load || {},
				/**
				 * Regular expression for extracting path to the image
				 * @property {RegExp} IMAGE_PATH_REGEXP
				 * @static
				 * @private
				 * @member ns.util.load
				 */
				IMAGE_PATH_REGEXP = /url\((\.\/)?images/gm,
				/**
				 * Regular expression for extracting path to the css
				 * @property {RegExp} CSS_FILE_REGEXP
				 * @static
				 * @private
				 * @member ns.util.load
				 */
				CSS_FILE_REGEXP = /[^/]+\.css$/;

			/**
			 * Load file
			 * (synchronous loading)
			 * @method loadFileSync
			 * @param {string} scriptPath
			 * @param {?Function} successCB
			 * @param {?Function} errorCB
			 * @static
			 * @private
			 * @member ns.util.load
			 */
			function loadFileSync(scriptPath, successCB, errorCB) {
				var xhrObj = new XMLHttpRequest();

				// open and send a synchronous request
				xhrObj.open("GET", scriptPath, false);
				xhrObj.send();
				// add the returned content to a newly created script tag
				if (xhrObj.status === 200 || xhrObj.status === 0) {
					if (typeof successCB === "function") {
						successCB(xhrObj, xhrObj.status);
					}
				} else {
					if (typeof errorCB === "function") {
						errorCB(xhrObj, xhrObj.status, new Error(xhrObj.statusText));
					}
				}
			}

			/**
			 * Load JSON file
			 * (asynchronous loading)
			 * @method loadJSON
			 * @param {string} scriptPath
			 * @param {?Function} successCB
			 * @param {?Function} errorCB
			 * @static
			 * @member ns.util.load
			 */
			function loadJSON(scriptPath, successCB, errorCB) {
				var xhrObj = new XMLHttpRequest(),
					responseJSON,
					onsuccess = function () {
						if (xhrObj.status === 200) {
							if (typeof successCB === "function") {
								try {
									responseJSON = JSON.parse(xhrObj.responseText);
									successCB(responseJSON, xhrObj.status);
								} catch (err) {
									errorCB(xhrObj, xhrObj.status, new Error(err));
								}
							}
						} else {
							if (typeof errorCB === "function") {
								errorCB(xhrObj, xhrObj.status, new Error(xhrObj.statusText));
							}
						}
					},
					onreadystatechange = function () {
						if (xhrObj.status === 4) {
							onsuccess();
						}
					};

				// open and send a synchronous request
				xhrObj.open("GET", scriptPath, true);
				xhrObj.onreadystatechange = onreadystatechange;
				xhrObj.onload = onsuccess;
				xhrObj.onerror = function (err) {
					errorCB(xhrObj, xhrObj.status, new Error(err));
				};
				xhrObj.send();
			}

			/**
			 * Callback function on javascript load success
			 * @method scriptSyncSuccess
			 * @private
			 * @static
			 * @param {?Function} successCB
			 * @param {?Function} xhrObj
			 * @param {?string} status
			 * @member ns.util.load
			 */
			function scriptSyncSuccess(successCB, xhrObj, status) {
				var script = document.createElement("script");

				script.type = "text/javascript";
				script.text = xhrObj.responseText;
				document.body.appendChild(script);
				if (typeof successCB === "function") {
					successCB(xhrObj, status);
				}
			}


			/**
			 * Add script to document
			 * (synchronous loading)
			 * @method scriptSync
			 * @param {string} scriptPath
			 * @param {?Function} successCB
			 * @param {?Function} errorCB
			 * @static
			 * @member ns.util.load
			 */
			function scriptSync(scriptPath, successCB, errorCB) {
				loadFileSync(scriptPath, scriptSyncSuccess.bind(null, successCB), errorCB);
			}

			/**
			 * Callback function on css load success
			 * @method cssSyncSuccess
			 * @param {string} cssPath
			 * @param {?Function} successCB
			 * @param {?Function} xhrObj
			 * @member ns.util.load
			 * @static
			 * @private
			 */
			function cssSyncSuccess(cssPath, successCB, xhrObj) {
				var css = document.createElement("style");

				css.type = "text/css";
				css.textContent = xhrObj.responseText.replace(
					IMAGE_PATH_REGEXP,
					"url(" + cssPath.replace(CSS_FILE_REGEXP, "images")
				);
				if (typeof successCB === "function") {
					successCB(css);
				}
			}

			/**
			 * Add css to document
			 * (synchronous loading)
			 * @method cssSync
			 * @param {string} cssPath
			 * @param {?Function} successCB
			 * @param {?Function} errorCB
			 * @static
			 * @private
			 * @member ns.util.load
			 */
			function cssSync(cssPath, successCB, errorCB) {
				loadFileSync(cssPath, cssSyncSuccess.bind(null, cssPath, successCB), errorCB);
			}

			/**
			 * Add element to head tag
			 * @method addElementToHead
			 * @param {HTMLElement} element
			 * @param {boolean} [asFirstChildElement=false]
			 * @member ns.util.load
			 * @static
			 */
			function addElementToHead(element, asFirstChildElement) {
				var firstElement;

				if (head) {
					if (asFirstChildElement) {
						firstElement = head.firstElementChild;
						if (firstElement) {
							head.insertBefore(element, firstElement);
							return;
						}
					}
					head.appendChild(element);
				}
			}

			/**
			 * Create HTML link element with href
			 * @method makeLink
			 * @param {string} href
			 * @return {HTMLLinkElement}
			 * @member ns.util.load
			 * @static
			 */
			function makeLink(href) {
				var cssLink = document.createElement("link");

				cssLink.setAttribute("rel", "stylesheet");
				cssLink.setAttribute("href", href);
				cssLink.setAttribute("name", "tizen-theme");
				return cssLink;
			}

			/**
			 * Adds the given node to document head or replaces given 'replaceElement'.
			 * Additionally adds 'name' and 'theme-name' attribute
			 * @param {HTMLElement} node Element to be placed as theme link
			 * @param {string} themeName Theme name passed to the element
			 * @param {HTMLElement} [replaceElement=null] If replaceElement is given it gets replaced by node
			 */
			function addNodeAsTheme(node, themeName, replaceElement) {
				setNSData(node, "name", "tizen-theme");
				setNSData(node, "theme-name", themeName);

				if (replaceElement) {
					replaceElement.parentNode.replaceChild(node, replaceElement);
				} else {
					addElementToHead(node, true);
				}
			}

			/**
			 * Add css link element to head if not exists
			 * @method themeCSS
			 * @param {string} path
			 * @param {string} themeName
			 * @param {boolean} [embed=false] Embeds the CSS content to the document
			 * @member ns.util.load
			 * @static
			 */
			function themeCSS(path, themeName, embed) {
				var i,
					styleSheetsLength = styleSheets.length,
					ownerNode,
					previousElement = null,
					linkElement;
				// Find css link or style elements

				for (i = 0; i < styleSheetsLength; i++) {
					ownerNode = styleSheets[i].ownerNode;

					// We try to find a style / link node that matches current style or is linked to
					// the proper theme. We cannot use ownerNode.href because this returns the absolute path
					if (getNSData(ownerNode, "name") === "tizen-theme" || ownerNode.getAttribute("href") === path) {
						if (getNSData(ownerNode, "theme-name") === themeName) {
							// Nothing to change
							return;
						}
						previousElement = ownerNode;
						break;
					}
				}

				if (embed) {
					// Load and replace old styles or append new styles
					cssSync(path, function onSuccess(styleElement) {
						addNodeAsTheme(styleElement, themeName, previousElement);
					}, function onFailure(xhrObj, xhrStatus) {
						ns.warn("There was a problem when loading '" + themeName + "', status: " + xhrStatus);
					});
				} else {
					linkElement = makeLink(path);
					addNodeAsTheme(linkElement, themeName, previousElement);
				}
			}

			/**
			 * In debug mode add time to url to disable cache
			 * @property {string} cacheBust
			 * @member ns.util.load
			 * @static
			 */
			load.cacheBust = (document.location.href.match(/debug=true/)) ? "?cacheBust=" + (new Date()).getTime() : "";
			// the binding a local methods with the namespace
			load.scriptSync = scriptSync;
			load.addElementToHead = addElementToHead;
			load.makeLink = makeLink;
			load.themeCSS = themeCSS;
			load.JSON = loadJSON;

			ns.util.load = load;
			//>>excludeStart('tauBuildExclude', pragmas.tauBuildExclude);
			return ns.util.load;
		}
	);
	//>>excludeEnd('tauBuildExclude');
}(window.document, ns));
