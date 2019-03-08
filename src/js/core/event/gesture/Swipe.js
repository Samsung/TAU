/*global ns, window, define */
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
 * #Gesture Plugin: swipe
 * Plugin enables swipe event.
 *
 * @class ns.event.gesture.Swipe
 */
(function (ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define([
		"../gesture",
		"./Detector",
		"./utils"
	],
		function () {
		//>>excludeEnd("tauBuildExclude");

			var gesture = ns.event.gesture,
				Result = gesture.Result,
				Detector = gesture.Detector,
				Swipe = Detector.plugin.create({
				/**
					 * Gesture name
					 * @property {string} [name="swipe"]
					 * @member ns.event.gesture.Swipe
					 */
					name: "swipe",

				/**
					 * Gesture Index
					 * @property {number} [index=400]
					 * @member ns.event.gesture.Swipe
					 */
					index: 400,

				/**
					 * Default values for swipe gesture
					 * @property {Object} defaults
					 * @property {number} [defaults.timeThreshold=400]
					 * @property {number} [defaults.velocity=0.6]
					 * @property {ns.event.gesture.HORIZONTAL|ns.event.gesture.VERTICAL} [defaults.orientation=ns.event.gesture.HORIZONTAL]
					 * @member ns.event.gesture.Swipe
					 */
					defaults: {
						timeThreshold: 400,
						velocity: 0.6,
						orientation: gesture.Orientation.HORIZONTAL
					},

				/**
					 * Handler for swipe gesture
					 * @method handler
					 * @param {Event} gestureEvent gesture event
					 * @param {Object} sender event's sender
					 * @param {Object} options options
					 * @return {number}
					 * @member ns.event.gesture.Swipe
					 */
					handler: function (gestureEvent, sender, options) {
						var result = Result.PENDING,
							velocity = options.velocity;

						if (gestureEvent.eventType === gesture.Event.END) {
							if ((gestureEvent.deltaTime > options.timeThreshold) ||
								(options.orientation !== gesture.utils.getOrientation(gestureEvent.direction))) {
								result = Result.FINISHED;
							} else if (gestureEvent.velocityX > velocity || gestureEvent.velocityY > velocity) {
								sender.sendEvent(this.name, gestureEvent);
								result = Result.FINISHED | Result.BLOCK;
							}
						}

						return result;
					}
				});

			gesture.Swipe = Swipe;

		//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);

			return Swipe;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
