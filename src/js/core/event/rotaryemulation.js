/*global window, ns, define */
/*
 * Copyright (c) 2013 - 2014 Samsung Electronics Co., Ltd
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
/*jslint nomen: true*/
/**
 * #Event pinch
 * Object supports pinch event.
 * @class ns.event.pinch
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../event"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var rotaryemulation = {
					enabled: true,
					bind: function () {
						document.addEventListener("mousewheel", handleEvent, true);
					},
					unbind: function () {
						document.removeEventListener("mousewheel", handleEvent, true);
					}
				},
				utilsEvents = ns.event;

			/**
			 * Handle touch move event. Triggers rotaryemulation event if occurs
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.event.rotaryemulation
			 */
			function handleEvent(event) {
				var direction = "CCW";

				if (event.deltaY > 0) {
					direction = "CW";
				}

				utilsEvents.trigger(event.target, "rotarydetent", {
					direction: direction
				});
			}

			// Init rotaryemulation event
			rotaryemulation.bind();

			ns.event.pinch = rotaryemulation;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.event.pinch;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));

