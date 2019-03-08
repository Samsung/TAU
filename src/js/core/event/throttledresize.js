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
/*global window, ns, define */
/**
 * #Event throttledresize
 * Object supports throttledresize event.
 * @class ns.event.throttledresize
 */
/**
 * Event throttledresize
 * @event throttledresize
 * @member ns.event.throttledresize
 */
(function (window) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../event"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var throttledresize = {
					/**
					 * State of event support
					 * @property {boolean} [enabled=true]
					 * @static
					 * @member ns.event.throttledresize
					 */
					enabled: ns.getConfig("enableThrottleResize", true),
					/**
					 * Timeout of triggering event.
					 * @property {number} [ttl=250]
					 * @static
					 * @member ns.event.throttledresize
					 */
					ttl: 250
				},
				timerID,
				eventUtils = ns.event,
				resizeHandler = function () {
					if (timerID) {
						window.clearTimeout(timerID);
					}
					timerID = window.setTimeout(function () {
						eventUtils.trigger(window, "throttledresize");
					}, throttledresize.ttl);
				},
				/**
				 * Enables event support
				 * @method enable
				 * @static
				 * @member ns.event.throttledresize
				 */
				enable = function () {
					if (!throttledresize.enabled) {
						throttledresize.enabled = true;
					}
					window.addEventListener("resize", resizeHandler, true);
				},

				unbind = function () {
					throttledresize.enabled = false;
					window.removeEventListener("resize", resizeHandler, true);
				};

			if (throttledresize.enabled) {
				enable();
			}

			throttledresize.enable = enable;
			throttledresize.unbind = unbind;

			ns.event.throttledresize = throttledresize;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.event.throttledresize;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window));
