/*global window, ns, define, ns */
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
			"../event", // fetch namespace
			"./touch"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var pinch = {
					/**
					 * Minimal move delta to trigger event
					 * @property {number} [min=0.1]
					 * @static
					 * @member ns.event.pinch
					 */
					min: 0.1,
					/**
					 * Maximum move delta to trigger event
					 * @property {number} [max=3]
					 * @static
					 * @member ns.event.pinch
					 */
					max: 3,
					/**
					 * Threshold of event.
					 * @property {number} [threshold=0.01]
					 * @static
					 * @member ns.event.pinch
					 */
					threshold: 0.01,
					/**
					 * Interval of triggering event
					 * @property {number} [interval=50]
					 * @static
					 * @member ns.event.pinch
					 */
					interval: 50,
					/**
					 * State of event
					 * @property {boolean} [enabled=true]
					 * @static
					 * @member ns.event.pinch
					 */
					enabled: true,
					bind: function () {
						document.addEventListener("touchstart", handleTouchStart, true);
					},
					unbind: function () {
						document.removeEventListener("touchstart", handleTouchStart, true);
					}
				},
				pinchDetails = {
					origin: [],
					ratio: 1,
					processing: false,
					current: []
				},
				utilsEvents = ns.event,
				pinchMin,
				pinchMax,
				threshold,
				interval;


			/**
			 * Computes distance between two touch points
			 * @param {Object} points
			 * @return {number}
			 * @private
			 * @static
			 * @member ns.event.pinch
			 */
			function getDistance(points) {
				var x = points[0].x - points[1].x,
					y = points[0].y - points[1].y;

				return Math.sqrt(x * x + y * y);
			}

			/**
			 * Handle touch move event. Triggers pinch event if occurs
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.event.pinch
			 */
			function handleTouchMove(event) {
				var touchList = event.touches,
					ratio = pinchDetails.ratio,
					delta;

				if (!pinchDetails.processing && pinchDetails.origin) {
					pinchDetails.current = [
						{x: touchList[0].pageX, y: touchList[0].pageY},
						{x: touchList[1].pageX, y: touchList[1].pageY}
					];

					delta = Math.sqrt(getDistance(pinchDetails.current) / getDistance(pinchDetails.origin));

					ratio = ratio < pinchMin ? pinchMin : delta;
					ratio = ratio > pinchMax ? pinchMax : delta;

					if (Math.abs(ratio - pinchDetails.ratio) >= threshold) {
						utilsEvents.trigger(event.target, "pinch", pinchDetails);
						pinchDetails.ratio = ratio;

						if (interval) {
							pinchDetails.processing = true;
							setTimeout(function () {
								pinchDetails.processing = false;
							}, interval);
						}
					}
				}
			}


			/**
			 * Handle touch end, clean up
			 * @param {Event} event
			 * @member ns.event.pinch
			 * @private
			 * @static
			 */
			function handleTouchEnd(event) {
				utilsEvents.trigger(event.target, "pinchend", pinchDetails);

				pinchDetails.origin = undefined;
				pinchDetails.current = undefined;
				pinchDetails.ratio = 1;
				pinchDetails.processing = false;

				document.removeEventListener("touchmove", handleTouchMove, true);
				document.removeEventListener("touchend", handleTouchEnd, true);
			}

			/**
			 * Handle touch start, set up pinch tracking
			 * @param {Event} event
			 * @member ns.event.pinch
			 * @private
			 * @static
			 */
			function handleTouchStart(event) {
				var touchList = event.touches;

				// TODO: what if somebody add 3rd finger?? Should Pinch be stopped?
				if (touchList && touchList.length === 2) {

					//Update config
					pinchMin = pinch.min;
					pinchMax = pinch.max;
					threshold = pinch.threshold;
					interval = pinch.interval;

					pinchDetails.origin = [
						{x: touchList[0].pageX, y: touchList[0].pageY},
						{x: touchList[1].pageX, y: touchList[1].pageY}
					];

					// Trigger pinchstart event on target element
					utilsEvents.trigger(event.target, "pinchstart", pinchDetails);

					// Bind events
					document.addEventListener("touchmove", handleTouchMove, true);
					document.addEventListener("touchend", handleTouchEnd, true);
				}
			}


			// Init pinch event
			pinch.bind();

			ns.event.pinch = pinch;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.event.pinch;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));

