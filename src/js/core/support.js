/*global window, ns, define*/
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
/**
 * #Support
 * Namespace with helpers function connected with browser properties
 * @class ns.support
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (window, document) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./core"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			/* $.mobile.media method: pass a CSS media type or query and get a bool return
			 note: this feature relies on actual media query support for media queries, though types will
			  work most anywhere
			 examples:
			 $.mobile.media('screen') // tests for screen media type
			 $.mobile.media('screen and (min-width: 480px)') // tests for screen media type with window
			  width > 480px
			 $.mobile.media('\@media screen and (-webkit-min-device-pixel-ratio: 2)') // tests for webkit
			  2x pixel ratio (iPhone 4)
			 */
			// TODO: use window.matchMedia once at least one UA implements it
			var cacheMedia = {},
				testDiv = document.createElement("div"),
				fakeBody = document.createElement("body"),
				fakeBodyStyle = fakeBody.style,
				html = document.getElementsByTagName("html")[0],
				style,
				vendors = ["Webkit", "Moz", "O"],
				webos = window.palmGetResource, //only used to rule out scrollTop
				opera = window.opera,
				operamini = window.operamini && ({}).toString.call(window.operamini) === "[object OperaMini]",
				blackBerry,
				testDivStyle = testDiv.style,
				ieVersion;

			testDiv.id = "jquery-mediatest";
			fakeBody.appendChild(testDiv);

			/**
			 * Method checks \@media "query" support
			 * @method media
			 * @param {string} query
			 * @return {boolean}
			 * @static
			 * @member ns.support
			 */
			function media(query) {
				var styleBlock = document.createElement("style"),
					cssrule = "@media " + query + " { #jquery-mediatest { position:absolute; } }";

				if (query.cacheMedia === undefined) {
					//must set type for IE!
					styleBlock.type = "text/css";

					if (styleBlock.styleSheet) {
						styleBlock.styleSheet.cssText = cssrule;
					} else {
						styleBlock.appendChild(document.createTextNode(cssrule));
					}

					if (html.firstChild) {
						html.insertBefore(fakeBody, html.firstChild);
					} else {
						html.appendChild(fakeBody);
					}
					html.insertBefore(styleBlock, fakeBody);
					style = window.getComputedStyle(testDiv);
					cacheMedia[query] = (style.position === "absolute");
					styleBlock.parentNode.removeChild(styleBlock);
					fakeBody.parentNode.removeChild(fakeBody);
				}
				return cacheMedia[query];
			}

			function validStyle(prop, value, checkVend) {
				var div = document.createElement("div"),
					uc = function (txt) {
						return txt.charAt(0).toUpperCase() + txt.substr(1);
					},
					vendPref = function (vend) {
						return "-" + vend.charAt(0).toLowerCase() + vend.substr(1) + "-";
					},
					returnValue,
					checkStyle = function (vend) {
						var vendProp = vendPref(vend) + prop + ": " + value + ";",
							ucVend = uc(vend),
							propStyle = ucVend + uc(prop);

						div.setAttribute("style", vendProp);

						if (div.style[propStyle]) {
							returnValue = true;
						}
					},
					checkVendors = checkVend ? [checkVend] : vendors,
					checkVendorsLength = checkVendors.length,
					i;

				for (i = 0; i < checkVendorsLength; i++) {
					checkStyle(checkVendors[i]);
				}
				return !!returnValue;
			}

			/**
			 *
			 * @param {string} prop
			 * @return {boolean}
			 */
			function propExists(prop) {
				var ucProp = prop.charAt(0).toUpperCase() + prop.substr(1),
					props = (prop + " " + vendors.join(ucProp + " ") + ucProp).split(" "),
					key;

				for (key = 0; key < props.length; key++) {
					if (props.hasOwnProperty(key) && fakeBodyStyle[props[key]] !== undefined) {
						return true;
					}
				}
				return false;
			}

			function transform3dTest() {
				var prop = "transform-3d";

				return validStyle("perspective", "10px", "moz") || media("(-" + vendors.join("-" + prop + "),(-") + "-" + prop + "),(" + prop + ")");
			}

			blackBerry = window.blackberry && !propExists("-webkit-transform");

			function baseTagTest() {
				var fauxBase = location.protocol + "//" + location.host + location.pathname + "ui-dir/",
					head = document.head,
					base = head.querySelector("base"),
					fauxEle = null,
					hadBase = false,
					href = "",
					link,
					rebase;

				if (base) {
					href = base.getAttribute("href");
					base.setAttribute("href", fauxBase);
					hadBase = true;
				} else {
					base = fauxEle = document.createElement("base");
					base.setAttribute("href", fauxBase);
					head.appendChild(base);
				}

				link = document.createElement("a");
				link.href = "testurl";
				if (fakeBody.firstChild) {
					fakeBody.insertBefore(link, fakeBody.firstChild);
				} else {
					fakeBody.appendChild(link);
				}
				rebase = link.href;
				base.href = href || location.pathname;

				if (fauxEle) {
					head.removeChild(fauxEle);
				}

				// Restore previous base href if base had existed
				if (hadBase) {
					base.setAttribute("href", href);
				}

				// Tell jQuery not to append <base> in build mode
				if (location.hash === "#build") {
					return false;
				}

				return rebase.indexOf(fauxBase) === 0;
			}

			function cssPointerEventsTest() {
				var element = document.createElement("x"),
					documentElement = document.documentElement,
					getComputedStyle = window.getComputedStyle,
					supports,
					elementStyle = element.style;

				if (elementStyle.pointerEvents === undefined) {
					return false;
				}

				elementStyle.pointerEvents = "x";
				documentElement.appendChild(element);
				supports = getComputedStyle && getComputedStyle(element, "").pointerEvents === "auto";
				documentElement.removeChild(element);
				return !!supports;
			}

			function boundingRect() {
				var div = document.createElement("div");

				return div.getBoundingClientRect !== undefined;
			}

			ieVersion = (function getIEVersion() {
				var v = 3,
					div = document.createElement("div"),
					a = div.all || [];

				do {
					div.innerHTML = "<!--[if gt IE " + (++v) + "]><br><![endif]-->";
				} while (a[0]);
				return v;
			})();

			ns.support = {
				media: media,
				/**
				 * Informs browser support transition
				 * @property {boolean} cssTransitions
				 * @member ns.support
				 * @static
				 */
				cssTransitions: (window.WebKitTransitionEvent !== undefined || validStyle("transition", "height 100ms linear")) && !opera,
				/**
				 * Informs browser support history.pushStare method
				 * @property {boolean} pushState
				 * @member ns.support
				 * @static
				 */
				pushState: window.history.pushState && window.history.replaceState && true,
				/**
				 * Informs browser support media query "only all"
				 * @property {boolean} mediaquery
				 * @member ns.support
				 * @static
				 */
				mediaquery: media("only all"),
				/**
				 * Informs browser support content property on element
				 * @property {boolean} cssPseudoElement
				 * @member ns.support
				 * @static
				 */
				cssPseudoElement: !!propExists("content"),
				/**
				 * Informs browser support overflowScrolling property on element
				 * @property {boolean} touchOverflow
				 * @member ns.support
				 * @static
				 */
				touchOverflow: !!propExists("overflowScrolling"),
				/**
				 * Informs browser support CSS 3D transitions
				 * @property {boolean} cssTransform3d
				 * @member ns.support
				 * @static
				 */
				cssTransform3d: transform3dTest(),
				/**
				 * Informs browser support boxShadow property on element
				 * @property {boolean} boxShadow
				 * @member ns.support
				 * @static
				 */
				boxShadow: !!propExists("boxShadow") && !blackBerry,
				/**
				 * Informs browser support scrollTop property
				 * @property {boolean} scrollTop
				 * @member ns.support
				 * @static
				 */
				scrollTop: ((window.pageXOffset || document.documentElement.scrollTop || fakeBody.scrollTop) !== undefined && !webos && !operamini) ? true : false,
				/**
				 * Informs browser support dynamic change base tag
				 * @property {boolean} dynamicBaseTag
				 * @member ns.support
				 * @static
				 */
				dynamicBaseTag: baseTagTest(),
				/**
				 * Informs browser support CSS pointer events
				 * @property {boolean} cssPointerEvents
				 * @member ns.support
				 * @static
				 */
				cssPointerEvents: cssPointerEventsTest(),
				/**
				 * Prefix for animations
				 * @property ("-webkit-"|"-moz-"|"-o-"|""} cssAnimationPrefix
				 * @member ns.support
				 * @static
				 */
				cssAnimationPrefix: testDivStyle.hasOwnProperty("webkitAnimation") ? "-webkit-" :
					testDivStyle.hasOwnProperty("mozAnimation") ? "-moz-" :
						testDivStyle.hasOwnProperty("oAnimation") ? "-o-" : "",
				/**
				 * Informs browser support getBoundingClientRect
				 * @property {boolean} boundingRect
				 * @member ns.support
				 * @static
				 */
				boundingRect: boundingRect(),
				/**
				 * Object with browser information
				 * @property (Object} browser
				 * @property {boolean} browser.ie detects Internet Explorer
				 * @member ns.support
				 * @static
				 */
				browser: {
					ie: ieVersion > 4
				},
				/**
				 * Informs that browser pass all tests for run framework
				 * @method gradeA
				 * @member ns.support
				 * @static
				 * @return {boolean}
				 */
				gradeA: function () {
					return ((this.mediaquery || (this.browser.ie && ieVersion >= 7)) &&
					(this.boundingRect || ((window.jQuery && window.jQuery.fn && window.jQuery.fn.jquery.match(/1\.[0-7+]\.[0-9+]?/)) !== null)));
				},
				/**
				 * Informs browser support touch events
				 * @property {boolean} touch
				 * @member ns.support
				 * @static
				 */
				touch: document.ontouchend !== undefined,
				/**
				 * Informs browser support orientation property
				 * @property {boolean} orientation
				 * @member ns.support
				 * @static
				 */
				orientation: window.orientation !== undefined && window.onorientationchange !== undefined
			};
			testDiv = null;
			fakeBody = null;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.support;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document));
