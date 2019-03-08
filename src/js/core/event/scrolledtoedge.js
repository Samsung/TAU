/*global window, define, ns */
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
 * #Event scrolledtoedge
 * Namespace to support scrolledtoedge event
 * @class ns.event.scrolledtoedge
 */
/**
 * Event scrolledtoedge
 * @event scrolledtoedge
 * @member ns.event.scrolledtoedge
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../event" // fetch namespace
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var eventUtils = ns.event,

				onScroll = function (ev) {
					var target = ev.target,
						edgeReached = false,
						result = {
							left: false,
							right: false,
							top: false,
							bottom: false
						};

					if (target.scrollHeight > target.clientHeight) {
						if (target.scrollTop === 0) {
							edgeReached = true;
							result.top = true;
						} else if (target.scrollTop === target.scrollHeight - target.clientHeight) {
							edgeReached = true;
							result.bottom = true;
						}
					}
					if (target.scrollWidth > target.clientWidth) {
						if (target.scrollLeft === 0) {
							edgeReached = true;
							result.left = true;
						} else if (target.scrollLeft === target.scrollWidth - target.clientWidth) {
							edgeReached = true;
							result.right = true;
						}
					}
					// trigger event
					if (edgeReached) {
						eventUtils.trigger(target, "scrolledtoedge", result);
					}
				},

				scrolledToEdge = {
					enable: function () {
						window.addEventListener("scroll", onScroll, true);
					},

					disable: function () {
						window.removeEventListener("scroll", onScroll, true);
					}
				};

			ns.event.scrolledtoedge = scrolledToEdge;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.event.scrolledtoedge;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
