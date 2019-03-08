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
 * # Gesture Plugin: drag
 * Plugin enables drag event.
 *
 * @class ns.event.gesture.Drag
 */
(function (ns, window, tizen) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define([
		"../gesture",
		"./utils",
		"./Detector",
		"../../util/object"
	],
		function () {
		//>>excludeEnd("tauBuildExclude");

		/**
			 * Local alias for {@link ns.event.gesture}
			 * @property {Object}
			 * @member ns.event.gesture.Drag
			 * @private
			 * @static
			 */
			var gesture = ns.event.gesture,
			/**
				 * Local alias for {@link ns.event.gesture.Detector}
				 * @property {Object}
				 * @member ns.event.gesture.Drag
				 * @private
				 * @static
				 */
				gestureUtils = gesture.utils,

				Detector = gesture.Detector,
			/**
				 * Alias for method {@link ns.util.object.merge}
				 * @property {Function} merge
				 * @member ns.event.gesture.Drag
				 * @private
				 * @static
				 */
				merge = ns.util.object.merge,

				eventNames = {
					start: "dragstart",
					drag: "drag",
					end: "dragend",
					cancel: "dragcancel",
					prepare: "dragprepare"
				},

			// TODO UA test will move to support.
				isTizenWebkit2Browser = !!window.navigator.userAgent.match(/tizen/i) && (function () {
					var result = true,
						version;

					if (tizen && tizen.systeminfo && tizen.systeminfo.getCapability) {
						try {
							version = tizen.systeminfo.getCapability("http://tizen.org/feature/platform.version");
							return version < "3.0";
						} catch (error) {
							ns.error("Error name: " + error.name + ", message: " + error.message);
						}
					}
					return result;
				})(),

				isChromeBrowser = window.navigator.userAgent.indexOf("Chrome") > -1,

				RESULTS = gesture.Result,

				Drag = Detector.plugin.create({

				/**
					 * Gesture name
					 * @property {string} [name="drag"]
					 * @member ns.event.gesture.Drag
					 */
					name: "drag",

				/**
					 * Gesture Index
					 * @property {number} [index=500]
					 * @member ns.event.gesture.Drag
					 */
					index: 500,

				/**
					 * Default values for drag gesture
					 * @property {Object} defaults
					 * @property {boolean} [defaults.blockHorizontal=false]
					 * @property {boolean} [defaults.blockVertical=false]
					 * @property {number} [defaults.threshold=20]
					 * @property {number} [defaults.delay=0]
					 * @member ns.event.gesture.Drag
					 */
					defaults: {
						blockHorizontal: false,
						blockVertical: false,
						threshold: 20,
						delay: 0
					},

				/**
					 * Triggered
					 * @property {boolean} [isTriggered=false]
					 * @member ns.event.gesture.Drag
					 */
					isTriggered: false,

				/**
					 * Handler for drag gesture
					 * @method handler
					 * @param {Event} gestureEvent gesture event
					 * @param {Object} sender event's sender
					 * @param {Object} options options
					 * @return {number}
					 * @member ns.event.gesture.Drag
					 */
					handler: function (gestureEvent, sender, options) {
						var newGestureEvent,
							threshold = options.threshold,
							result = RESULTS.PENDING,
							direction = gestureEvent.direction;

						if (!this.isTriggered && gestureEvent.eventType === gesture.Event.MOVE) {
							if (Math.abs(gestureEvent.deltaX) < threshold && Math.abs(gestureEvent.deltaY) < threshold) {
							// Branching statement for specifying Tizen 2.X and Tizen 3.0
								if (isChromeBrowser) {
									gestureEvent.preventDefault();
								}
								return RESULTS.PENDING;
							}

							if (options.delay && gestureEvent.deltaTime < options.delay) {
								if (!isTizenWebkit2Browser) {
									gestureEvent.preventDefault();
								}
								return RESULTS.PENDING;
							}

							if (options.blockHorizontal && gestureUtils.isHorizontal(gestureEvent.direction) ||
								options.blockVertical && gestureUtils.isVertical(gestureEvent.direction)) {
								return RESULTS.FINISHED;
							}

							this.fixedStartPointX = 0;
							this.fixedStartPointY = 0;
							if (gestureUtils.isHorizontal(gestureEvent.direction)) {
								this.fixedStartPointX = (gestureEvent.deltaX < 0 ? 1 : -1) * threshold;
							} else {
								this.fixedStartPointY = (gestureEvent.deltaY < 0 ? 1 : -1) * threshold;
							}
						}

						if (options.blockHorizontal) {
							direction = gestureEvent.deltaY < 0 ? gesture.Direction.UP : gesture.Direction.DOWN;
						}

						if (options.blockVertical) {
							direction = gestureEvent.deltaX < 0 ? gesture.Direction.LEFT : gesture.Direction.RIGHT;
						}

						newGestureEvent = merge({}, gestureEvent, {
							deltaX: gestureEvent.deltaX + this.fixedStartPointX,
							deltaY: gestureEvent.deltaY + this.fixedStartPointY,
							estimatedDeltaX: gestureEvent.estimatedDeltaX + this.fixedStartPointX,
							estimatedDeltaY: gestureEvent.estimatedDeltaY + this.fixedStartPointY,

							direction: direction
						});

						switch (newGestureEvent.eventType) {
							case gesture.Event.START:
								this.isTriggered = false;
								if (sender.sendEvent(eventNames.prepare, newGestureEvent) === false) {
									result = RESULTS.FINISHED;
								}
								break;
							case gesture.Event.MOVE:
								if (!this.isTriggered && sender.sendEvent(eventNames.start, newGestureEvent) === false) {
									newGestureEvent.preventDefault();
								}
								result = sender.sendEvent(eventNames.drag, newGestureEvent) ? RESULTS.RUNNING : RESULTS.FINISHED;
								if (result === false) {
									newGestureEvent.preventDefault();
								}
								this.isTriggered = true;
								break;

							case gesture.Event.BLOCKED:
							case gesture.Event.END:
								result = RESULTS.FINISHED;
								if (this.isTriggered) {
									if (sender.sendEvent(eventNames.end, newGestureEvent) === false) {
										newGestureEvent.preventDefault();
									}
									this.isTriggered = false;
								}
								break;

							case gesture.Event.CANCEL:
								result = RESULTS.FINISHED;
								if (this.isTriggered) {
									if (sender.sendEvent(eventNames.cancel, newGestureEvent) === false) {
										newGestureEvent.preventDefault();
									}
									this.isTriggered = false;
								}
								break;
						}

						return result;
					}
				});

			ns.event.gesture.Drag = Drag;
		//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);

			return Drag;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns, window, window.tizen));
