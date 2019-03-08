/*global window, ns, define */
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
 * #Touch events
 * Reimplementation of jQuery Mobile virtual mouse events.
 * @class ns.event.touch
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/event" // fetch namespace
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var touch = ns.event.touch || {},
				events = ns.event,
				TAP = {
					TAB_HOLD_THRESHOLD: 750
				},
				EVENT_TYPE = {
					TAP: "tap",
					TAP_HOLD: "taphold"
				};

			events.on(document, "mousedown touchstart mouseup touchend click", touch, true);

			touch.handleEvent = function (event) {
				var self = this;

				switch (event.type) {
					case "mousedown":
					case "touschstart":
						self._onMousedown(event);
						break;
					case "click":
						self._onClick(event);
						break;
					case "mouseup":
					case "touchend":
						self._onMouseup(event);
						break;
				}
			};

			touch._onMousedown = function (event) {
				var self = this,
					target = event.target;

				self._target = target;
				self._timeId = setTimeout(function () {
					events.trigger(target, EVENT_TYPE.TAP_HOLD);
				}, TAP.TAB_HOLD_THRESHOLD);
			};

			touch._onClick = function (event) {
				var self = this,
					target = event.target;

				clearTimeout(self._timeId);
				if (self._target === target) {
					events.trigger(target, EVENT_TYPE.TAP);
				}
			};

			touch._onMouseup = function () {
				clearTimeout(this._timeId);
			};
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.event.touch;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));