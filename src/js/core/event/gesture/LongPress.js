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
 * #Gesture Plugin: longPress
 * Plugin enables long press event.
 *
 * @class ns.event.gesture.LongPress
 */
(function (ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define([
		"../gesture",
		"./Detector"
	],
		function () {
		//>>excludeEnd("tauBuildExclude");

		/**
			 * Local alias for {@link ns.event.gesture}
			 * @property {Object}
			 * @member ns.event.gesture.LongPress
			 * @private
			 * @static
			 */
			var gesture = ns.event.gesture,
			/**
				 * Local alias for {@link ns.event.gesture.Detector}
				 * @property {Object}
				 * @member ns.event.gesture.LongPress
				 * @private
				 * @static
				 */
				Detector = gesture.Detector,

				LongPress = Detector.plugin.create({
				/**
					 * Gesture name
					 * @property {string} [name="longpress"]
					 * @member ns.event.gesture.LongPress
					 */
					name: "longpress",

				/**
					 * Gesture Index
					 * @property {number} [index=200]
					 * @member ns.event.gesture.LongPress
					 */
					index: 600,

				/**
					 * Default values for longPress gesture
					 * @property {Object} defaults
					 * @property {number} [defaults.timeThreshold=400]
					 * @property {number} [defaults.longPressDistanceThreshold=15]
					 * @property {boolean} [defaults.preventClick]
					 * @member ns.event.gesture.LongPress
					 */
					defaults: {
						longPressTimeThreshold: 750,
						longPressDistanceThreshold: 20,
						preventClick: true
					},

				/**
					 * IsTriggered
					 * @property {boolean} [isTriggered=false]
					 * @member ns.event.gesture.LongPress
					 */
					isTriggered: false,

				/**
					 * longPressTimeOutId
					 * @property {number} [longPressTimeOutId=0]
					 * @member ns.event.gesture.LongPress
					 */
					longPressTimeOutId: 0,

				/**
					 * Handler for longPress gesture
					 * @method handler
					 * @param {Event} gestureEvent gesture event
					 * @param {Object} sender event's sender
					 * @param {Object} options options
					 * @return {number}
					 * @member ns.event.gesture.LongPress
					 */
					handler: function (gestureEvent, sender, options) {
						var result = gesture.Result.PENDING;

						switch (gestureEvent.eventType) {
							case gesture.Event.START:
								this.isTriggered = false;
								this.longPressTimeOutId = setTimeout(function () {
									this.isTriggered = true;
									sender.sendEvent(this.name, gestureEvent);
								}.bind(this), options.longPressTimeThreshold);
								break;

							case gesture.Event.MOVE:
								if (gestureEvent.distance > options.longPressDistanceThreshold && !this.isTriggered) {
									clearTimeout(this.longPressTimeOutId);
									result = gesture.Result.FINISHED;
								}
								break;

							case gesture.Event.END:
								if (!this.isTriggered) {
									clearTimeout(this.longPressTimeOutId);
								} else if (options.preventClick) {
									gestureEvent.preventDefault();
								}
								result = gesture.Result.FINISHED;
								break;
						}
						return result;
					}
				});

			gesture.LongPress = LongPress;

		//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return LongPress;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
