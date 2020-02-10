/*global ns, window, define */
/*jslint nomen: true */
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
 * #Gesture Utilities
 * Contains helper function to gesture support.
 * @class ns.event.gesture.utils
 */
(function (ns, math) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define([
		"../gesture"
	],
		function () {
		//>>excludeEnd("tauBuildExclude");

		/**
			 * Local alias for {@link ns.event.gesture}
			 * @property {Object}
			 * @member ns.event.gesture.utils
			 * @private
			 * @static
			 */
			var gesture = ns.event.gesture;

			gesture.utils = {

			/**
				 * Get center from array of touches
				 * @method getCenter
				 * @param {Event[]} touches description
				 * @member ns.event.gesture.utils
				 * @return {Object} position
				 * @return {number} return.clientX position X
				 * @return {number} return.clientY position Y
				 */
				getCenter: function (touches) {
					var valuesX = [],
						valuesY = [];

					[].forEach.call(touches, function (touch) {
					// I prefer clientX because it ignore the scrolling position
						valuesX.push(!isNaN(touch.clientX) ? touch.clientX : touch.pageX);
						valuesY.push(!isNaN(touch.clientY) ? touch.clientY : touch.pageY);
					});

					return {
						clientX: (math.min.apply(math, valuesX) + math.max.apply(math, valuesX)) / 2,
						clientY: (math.min.apply(math, valuesY) + math.max.apply(math, valuesY)) / 2
					};
				},

			/**
				 * Get velocity
				 * @method getVelocity
				 * @param {number} deltaTime Delta of time
				 * @param {number} deltaX Position change on x axis
				 * @param {number} deltaY Position change on y axis
				 * @return {Object} velocity
				 * @return {number} return.x velocity on X axis
				 * @return {number} return.y velocity on Y axis
				 * @member ns.event.gesture.utils
				 */
				getVelocity: function (deltaTime, deltaX, deltaY) {
					return {
						x: math.abs(deltaX / deltaTime) || 0,
						y: math.abs(deltaY / deltaTime) || 0
					};
				},

			/**
				 * Get angel between position of two touches
				 * @method getAngle
				 * @param {Event} touch1 first touch
				 * @param {Event} touch2 second touch
				 * @return {number} angel (deg)
				 * @member ns.event.gesture.utils
				 */
				getAngle: function (touch1, touch2) {
					var y = touch2.clientY - touch1.clientY,
						x = touch2.clientX - touch1.clientX;

					return math.atan2(y, x) * 180 / math.PI;
				},

			/**
				 * Get direction indicated by position of two touches
				 * @method getDirection
				 * @param {Event} touch1 first touch
				 * @param {Event} touch2 second touch
				 * @return {ns.event.gesture.Direction.LEFT|ns.event.gesture.Direction.RIGHT|ns.event.gesture.Direction.UP|ns.event.gesture.Direction.DOWN}
				 * @member ns.event.gesture.utils
				 */
				getDirection: function (touch1, touch2) {
					var x = math.abs(touch1.clientX - touch2.clientX),
						y = math.abs(touch1.clientY - touch2.clientY);

					if (x >= y) {
						return touch1.clientX - touch2.clientX > 0 ? gesture.Direction.LEFT : gesture.Direction.RIGHT;
					}
					return touch1.clientY - touch2.clientY > 0 ? gesture.Direction.UP : gesture.Direction.DOWN;
				},

			/**
				 * Get distance indicated by position of two touches
				 * @method getDistance
				 * @param {Event} touch1 first touch
				 * @param {Event} touch2 second touch
				 * @return {number} distance
				 * @member ns.event.gesture.utils
				 */
				getDistance: function (touch1, touch2) {
					var x = touch2.clientX - touch1.clientX,
						y = touch2.clientY - touch1.clientY;

					return math.sqrt((x * x) + (y * y));
				},

			/**
				 * Get scale indicated by position of the first and the last touch
				 * @method getScale
				 * @param {Event} start start touch
				 * @param {Event} end end touch
				 * @return {number} scale
				 * @member ns.event.gesture.utils
				 */
				getScale: function (start, end) {
				// need two fingers...
					if (start.length >= 2 && end.length >= 2) {
						return this.getDistance(end[0], end[1]) / this.getDistance(start[0], start[1]);
					}
					return 1;
				},

			/**
				 * Get value of rotation indicated by position
				 * of the first and the last touch
				 * @method getRotation
				 * @param {Event} start start touch
				 * @param {Event} end end touch
				 * @return {number} angle (deg)
				 * @member ns.event.gesture.utils
				 */
				getRotation: function (start, end) {
				// need two fingers
					if (start.length >= 2 && end.length >= 2) {
						return this.getAngle(end[1], end[0]) -
							this.getAngle(start[1], start[0]);
					}
					return 0;
				},

			/**
				 * Check if the direction is vertical
				 * @method isVertical
				 * @param {ns.event.gesture.Direction.LEFT|ns.event.gesture.Direction.RIGHT|ns.event.gesture.Direction.UP|ns.event.gesture.Direction.DOWN} direction start touch
				 * @return {boolean}
				 * @member ns.event.gesture.utils
				 */
				isVertical: function (direction) {
					return direction === gesture.Direction.UP || direction === gesture.Direction.DOWN;
				},

			/**
				 * Check if the direction is horizontal
				 * @method isHorizontal
				 * @param {ns.event.gesture.Direction.LEFT|ns.event.gesture.Direction.RIGHT|ns.event.gesture.Direction.UP|ns.event.gesture.Direction.DOWN} direction start touch
				 * @return {boolean}
				 * @member ns.event.gesture.utils
				 */
				isHorizontal: function (direction) {
					return direction === gesture.Direction.LEFT || direction === gesture.Direction.RIGHT;
				},

			/**
				 * Check if the direction is horizontal
				 * @method getOrientation
				 * @param {ns.event.gesture.Direction.LEFT|ns.event.gesture.Direction.RIGHT|ns.event.gesture.Direction.UP|ns.event.gesture.Direction.DOWN} direction
				 * @return {boolean}
				 * @member ns.event.gesture.utils
				 */
				getOrientation: function (direction) {
					return this.isVertical(direction) ? gesture.Orientation.VERTICAL : gesture.Orientation.HORIZONTAL;
				}
			};
		//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns, window.Math));
