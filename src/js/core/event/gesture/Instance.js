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
(function (ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define([
		"../gesture",
		"./Manager",
		"./Detector",
		"../../event",
		"../../util/object"
	],
		function () {
		//>>excludeEnd("tauBuildExclude");
		/**
			 * Local alias for {@link ns.event.gesture}
			 * @property {Object}
			 * @member ns.event.gesture.Instance
			 * @private
			 * @static
			 */
			var gesture = ns.event.gesture,
			/**
				 * Local alias for {@link ns.event.gesture.Detector}
				 * @property {Object}
				 * @member ns.event.gesture.Instance
				 * @private
				 * @static
				 */
				Detector = gesture.Detector,
			/**
				 * Local alias for {@link ns.event.gesture.Manager}
				 * @property {Object}
				 * @member ns.event.gesture.Instance
				 * @private
				 * @static
				 */
				Manager = gesture.Manager,
			/**
				 * Local alias for {@link ns.event}
				 * @property {Object}
				 * @member ns.event.gesture.Instance
				 * @private
				 * @static
				 */
				events = ns.event,
			/**
				 * Alias for method {@link ns.util.object.merge}
				 * @property {Function} merge
				 * @member ns.event.gesture.Instance
				 * @private
				 * @static
				 */
				merge = ns.util.object.merge,

			/**
				 * #Gesture.Instance class
				 * Creates instance of gesture manager on element.
				 * @param {HTMLElement} element
				 * @param {Object} options
				 * @class ns.event.gesture.Instance
				 */
				Instance = function (element, options) {
					this.element = element;
					this.eventDetectors = [];
					this.options = merge({}, gesture.defaults, options);

					this.gestureManager = Manager.getInstance();
					this.eventSender = merge({}, Detector.Sender, {
						sendEvent: this.trigger.bind(this)
					});
				};

			Instance.prototype = {
			/**
				 * Set options
				 * @method setOptions
				 * @param {Object} options options
				 * @return {ns.event.gesture.Instance}
				 * @member ns.event.gesture.Instance
				 */
				setOptions: function (options) {
					merge(this.options, options);
					return this;
				},

			/**
				 * Add detector
				 * @method addDetector
				 * @param {Object} detectorStrategy strategy
				 * @return {ns.event.gesture.Instance}
				 * @member ns.event.gesture.Instance
				 */
				addDetector: function (detectorStrategy) {
					var detector = new Detector(detectorStrategy, this.eventSender),
						alreadyHasDetector = !!this.eventDetectors.length;

					this.eventDetectors.push(detector);

					if (!!this.eventDetectors.length && !alreadyHasDetector) {
						this.gestureManager.register(this);
					}

					return this;
				},

			/**
				 * Remove detector
				 * @method removeDetector
				 * @param {Object} detectorStrategy strategy
				 * @return {ns.event.gesture.Instance}
				 * @member ns.event.gesture.Instance
				 */
				removeDetector: function (detectorStrategy) {
					var idx = this.eventDetectors.indexOf(detectorStrategy);

					if (idx > -1) {
						this.eventDetectors.splice(idx, 1);
					}

					if (!this.eventDetectors.length) {
						this.gestureManager.unregister(this);
					}

					return this;
				},

			/**
				 * Triggers the gesture event
				 * @method trigger
				 * @param {string} gestureName gestureName name
				 * @param {Object} eventInfo data provided to event object
				 * @member ns.event.gesture.Instance
				 */
				trigger: function (gestureName, eventInfo) {
					return events.trigger(this.element, gestureName, eventInfo, false);
				},

			/**
				 * Get HTML element assigned to gesture event instance
				 * @method getElement
				 * @member ns.event.gesture.Instance
				 */
				getElement: function () {
					return this.element;
				},

			/**
				 * Get gesture event detectors assigned to instance
				 * @method getGestureDetectors
				 * @member ns.event.gesture.Instance
				 */
				getGestureDetectors: function () {
					return this.eventDetectors;
				},

			/**
				 * Destroy instance
				 * @method destroy
				 * @member ns.event.gesture.Instance
				 */
				destroy: function () {
					this.element = null;
					this.eventHandlers = {};
					this.gestureManager = null;
					this.eventSender = null;
					this.eventDetectors.length = 0;
				}
			};

			gesture.Instance = Instance;

		//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Instance;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns));
