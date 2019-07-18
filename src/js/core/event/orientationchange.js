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
/**
 * #Event orientationchange
 * Namespace to support orientationchange event
 * @class ns.event.orientationchange
 */
/**
 * Event orientationchange
 * @event orientationchange
 * @member ns.event.orientationchange
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../engine",
			"../event" // fetch namespace
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var body = document.body,
				eventUtils = ns.event,
				eventType = ns.engine.eventType,
				orientationchange = {
					/**
					 * Window alias
					 * @property {Window} window
					 * @member ns.event.orientationchange
					 * @static
					 * @protected
					 */
					_window: window,
					/**
					 * Informs about support orientation change event.
					 * @property {boolean} supported
					 * @member ns.event.orientationchange
					 */
					supported: (window.orientation !== undefined) && (window.onorientationchange !== undefined),
					/**
					 * List of properties copied to event details object
					 * @property {Array} properties
					 * @member ns.event.orientationchange
					 * @static
					 */
					properties: ["orientation"],

					/**
					 * Chosen orientation
					 * @property {Window} [orientation=portrait]
					 * @member ns.event.orientationchange
					 * @protected
					 * @static
					 */
					_orientation: "portrait"
				},
				detectOrientationByDimensions = function (omitCustomEvent) {
					var win = orientationchange._window,
						width = win.innerWidth,
						height = win.innerHeight;

					if (win.screen) {
						width = win.screen.availWidth;
						height = win.screen.availHeight;
					}

					if (width > height) {
						orientationchange._orientation = "landscape";
					} else {
						orientationchange._orientation = "portrait";
					}

					if (!omitCustomEvent) {
						eventUtils.trigger(window, "orientationchange", {"orientation": orientationchange._orientation});
					}
				},
				checkReportedOrientation = function () {
					if (orientationchange._window.orientation) {
						switch (orientationchange._window.orientation) {
							case 90:
							case -90:
								orientationchange._orientation = "portrait";
								break;
							default:
								orientationchange._orientation = "landscape";
								break;
						}
					} else {
						detectOrientationByDimensions(true);
					}
				},
				matchMediaHandler = function (mediaQueryList, omitEvent) {
					if (mediaQueryList.matches) {
						orientationchange._orientation = "portrait";
					} else {
						orientationchange._orientation = "landscape";
					}

					if (!omitEvent) { // this was added explicit for testing
						eventUtils.trigger(window, "orientationchange", {"orientation": orientationchange._orientation});
					}
				},
				portraitMatchMediaQueryList = null;

			/**
			* Returns current orientation.
			* @method getOrientation
			* @return {"landscape"|"portrait"}
			* @member ns.event.orientationchange
			* @static
			*/
			orientationchange.getOrientation = function () {
				return orientationchange._orientation;
			};

			/**
			* Triggers event orientationchange on element
			* @method trigger
			* @param {HTMLElement} element
			* @member ns.event.orientationchange
			* @static
			*/
			orientationchange.trigger = function (element) {
				eventUtils.trigger(element, "orientationchange", {"orientation": orientationchange._orientation});
			};

			/**
			* Unbinds events
			* @member ns.event.orientationchange
			* @static
			*/
			orientationchange.unbind = function () {
				window.removeEventListener("orientationchange", checkReportedOrientation, false);
				document.removeEventListener("throttledresize", detectOrientationByDimensions, true);
				document.removeEventListener(eventType.DESTROY, orientationchange.unbind, false);
			};

			/**
			* Performs orientation detection
			* @member ns.event.orientationchange
			* @static
			*/
			orientationchange.detect = function () {
				if (orientationchange.supported) {
					window.addEventListener("orientationchange", checkReportedOrientation, false);
					checkReportedOrientation();
					// try media queries
				} else {
					if (orientationchange._window.matchMedia) {
						portraitMatchMediaQueryList = orientationchange._window.matchMedia("(orientation: portrait)");
						if (portraitMatchMediaQueryList.matches) {
							orientationchange._orientation = "portrait";
						} else {
							orientationchange._orientation = "landscape";
						}
						portraitMatchMediaQueryList.addListener(matchMediaHandler);
					} else {
						document.addEventListener("throttledresize", detectOrientationByDimensions, true);
						detectOrientationByDimensions();
					}
				}
			};

			document.addEventListener(eventType.DESTROY, orientationchange.unbind, false);

			orientationchange.detect();

			ns.event.orientationchange = orientationchange;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.event.orientationchange;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
