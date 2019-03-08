/*global window, ns, define */
/*jslint nomen: true, plusplus: true */
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
 * #Easing Utility
 * Utility calculates time function for animations.
 * @class ns.util.easing
 */

(function (ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../util"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			ns.util.easing = {
				/**
				 * Performs cubit out easing calculations based on time
				 * @method cubicOut
				 * @member ns.util.easing
				 * @param {number} currentTime
				 * @param {number} startValue
				 * @param {number} changeInValue
				 * @param {number} duration
				 * @return {number}
				 * @static
				 */
				cubicOut: function (currentTime, startValue, changeInValue, duration) {
					currentTime /= duration;
					currentTime--;
					return changeInValue * (currentTime * currentTime * currentTime + 1) + startValue;
				},

				/**
				 * Performs quad easing out calculations based on time
				 * @method easeOutQuad
				 * @member ns.util.easing
				 * @param {number} currentTime
				 * @param {number} startValue
				 * @param {number} changeInValue
				 * @param {number} duration
				 * @return {number}
				 * @static
				 */
				easeOutQuad: function (currentTime, startValue, changeInValue, duration) {
					return -changeInValue * (currentTime /= duration) * (currentTime - 2) + startValue;
				},

				/**
				 * Performs sine easing out calculations based on time
				 * The easing functions can be compared on: https://easings.net
				 * @method easeOutSine
				 * @member ns.util.easing
				 * @param {number} currentTime
				 * @param {number} startValue
				 * @param {number} changeInValue
				 * @param {number} duration
				 * @return {number}
				 * @static
				 */
				easeOutSine: function (currentTime, startValue, changeInValue, duration) {
					return changeInValue * Math.sin(currentTime / duration * (Math.PI / 2)) + startValue;
				},

				/**
				 * Performs out expo easing calculations based on time
				 * @method easeOutExpo
				 * @member ns.util.easing
				 * @param {number} currentTime
				 * @param {number} startValue
				 * @param {number} changeInValue
				 * @param {number} duration
				 * @return {number}
				 * @static
				 */
				easeOutExpo: function (currentTime, startValue, changeInValue, duration) {
					return (currentTime === duration) ?
						startValue + changeInValue :
						changeInValue * (-Math.pow(2, -10 * currentTime / duration) + 1) +
					startValue;
				},
				/**
				 * Performs out linear calculations based on time
				 * @method linear
				 * @member ns.util.easing
				 * @param {number} currentTime
				 * @param {number} startValue
				 * @param {number} changeInValue
				 * @param {number} duration
				 * @return {number}
				 * @static
				 */
				linear: function (currentTime, startValue, changeInValue, duration) {
					return startValue + changeInValue * currentTime / duration;
				}
			};
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.util.easing;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
