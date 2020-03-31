/*global ns, define */
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
 * #Gesture.Manager class
 * Main class controls all gestures.
 * @class ns.event.gesture.Manager
 */
(function (ns, window, document) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define([
		"../gesture",
		"./Detector",
		"./utils",
		"../../util/object"
	],
	function () {
		//>>excludeEnd("tauBuildExclude");

		/**
		 * Local alias for {@link ns.event.gesture}
		 * @property {Object}
		 * @member ns.event.gesture.Manager
		 * @private
		 * @static
		 */
		var gesture = ns.event.gesture,

			gestureUtils = gesture.utils,

			utilObject = ns.util.object,

			instance = null,

			touchCheck = /touch/,

			Manager = function () {
				var self = this;

				self.instances = [];
				self.gestureDetectors = [];
				self.runningDetectors = [];
				self.detectorRequestedBlock = null;

				self.unregisterBlockList = [];

				self.gestureEvents = {};
				self.velocity = null;

				self._isReadyDetecting = false;
				self._blockMouseEvent = false;
				self.touchSupport = "ontouchstart" in window;
			};

		function sortInstances(a, b) {
			if (a.index < b.index) {
				return -1;
			} else if (a.index > b.index) {
				return 1;
			}
			return 0;
		}

		Manager.prototype = {
			/**
			 * Bind start events
			 * @method _bindStartEvents
			 * @param {ns.event.gesture.Instance} _instance gesture instance
			 * @member ns.event.gesture.Manager
			 * @protected
			 */
			_bindStartEvents: function (_instance) {
				var element = _instance.getElement();

				if (this.touchSupport) {
					element.addEventListener("touchstart", this, {passive: false});
				} else {
					element.addEventListener("mousedown", this, false);
				}
			},

			/**
			 * Bind move, end and cancel events
			 * @method _bindEvents
			 * @member ns.event.gesture.Manager
			 * @protected
			 */
			_bindEvents: function () {
				var self = this;

				if (self.touchSupport) {
					document.addEventListener("touchmove", self, {passive: false});
					document.addEventListener("touchend", self, {passive: false});
					document.addEventListener("touchcancel", self, {passive: false});
				} else {
					document.addEventListener("mousemove", self);
					document.addEventListener("mouseup", self);
				}
			},

			/**
			 * Unbind start events
			 * @method _unbindStartEvents
			 * @param {ns.event.gesture.Instance} _instance gesture instance
			 * @member ns.event.gesture.Manager
			 * @protected
			 */
			_unbindStartEvents: function (_instance) {
				var element = _instance.getElement();

				if (this.touchSupport) {
					element.removeEventListener("touchstart", this, {passive: false});
				} else {
					element.removeEventListener("mousedown", this, false);
				}
			},

			/**
			 * Unbind move, end and cancel events
			 * @method _bindEvents
			 * @member ns.event.gesture.Manager
			 * @protected
			 */
			_unbindEvents: function () {
				var self = this;

				if (self.touchSupport) {
					document.removeEventListener("touchmove", self, {passive: false});
					document.removeEventListener("touchend", self, {passive: false});
					document.removeEventListener("touchcancel", self, {passive: false});
				} else {
					document.removeEventListener("mousemove", self, false);
					document.removeEventListener("mouseup", self, false);
				}
			},

			/**
			 * Detect that event should be processed by handleEvent
			 * @param {Event} event Input event object
			 * @return {null|string}
			 * @member ns.event.gesture.Manager
			 * @protected
			 */
			_detectEventType: function (event) {
				var eventType = event.type;

				if (eventType.match(touchCheck)) {
					this._blockMouseEvent = true;
				} else {
					if (this._blockMouseEvent || event.which !== 1) {
						return null;
					}
				}
				return eventType;
			},

			/**
			 * Handle event
			 * @method handleEvent
			 * @param {Event} event
			 * @member ns.event.gesture.Manager
			 * @protected
			 */
			handleEvent: function (event) {
				var self = this,
					eventType = self._detectEventType(event);

				switch (eventType) {
					case "mousedown":
					case "touchstart":
						self._start(event);
						break;
					case "mousemove":
					case "touchmove":
						self._move(event);
						break;
					case "mouseup":
					case "touchend":
						self._end(event);
						break;
					case "touchcancel":
						self._cancel(event);
						break;
				}
			},

			/**
			 * Handler for gesture start
			 * @method _start
			 * @param {Event} event
			 * @member ns.event.gesture.Manager
			 * @protected
			 */
			_start: function (event) {
				var self = this,
					element = event.currentTarget,
					startEvent = {},
					detectors = [];

				if (!self._isReadyDetecting) {
					self._resetDetecting();
					self._bindEvents();

					startEvent = self._createDefaultEventData(gesture.Event.START, event);

					self.gestureEvents = {
						start: startEvent,
						last: startEvent
					};

					self.velocity = {
						event: startEvent,
						x: 0,
						y: 0
					};

					startEvent = utilObject.fastMerge(startEvent,
						self._createGestureEvent(gesture.Event.START, event));
					self._isReadyDetecting = true;
				}

				self.instances.forEach(function (_instance) {
					if (_instance.getElement() === element) {
						detectors = detectors.concat(_instance.getGestureDetectors());
					}
				}, self);

				detectors.sort(sortInstances);

				self.gestureDetectors = self.gestureDetectors.concat(detectors);

				self._detect(detectors, startEvent);
			},

			/**
			 * Handler for gesture move
			 * @method _move
			 * @param {Event} event
			 * @member ns.event.gesture.Manager
			 * @protected
			 */
			_move: function (event) {
				var newEvent,
					self = this;

				if (self._isReadyDetecting) {
					newEvent = self._createGestureEvent(gesture.Event.MOVE, event);
					self._detect(self.gestureDetectors, newEvent);
					self.gestureEvents.last = newEvent;
				}
			},

			/**
			 * Handler for gesture end
			 * @method _end
			 * @param {Event} event
			 * @member ns.event.gesture.Manager
			 * @protected
			 */
			_end: function (event) {
				var self = this,
					newEvent = utilObject.merge(
						{},
						self.gestureEvents.last,
						self._createDefaultEventData(gesture.Event.END, event)
					);

				if (newEvent.pointers.length === 0) {
					self._detect(self.gestureDetectors, newEvent);

					self.unregisterBlockList.forEach(function (_instance) {
						this.unregister(_instance);
					}, self);

					self._resetDetecting();
					self._blockMouseEvent = false;
				}
			},

			/**
			 * Handler for gesture cancel
			 * @method _cancel
			 * @param {Event} event
			 * @member ns.event.gesture.Manager
			 * @protected
			 */
			_cancel: function (event) {
				var self = this;

				event = utilObject.merge(
					{},
					self.gestureEvents.last,
					self._createDefaultEventData(gesture.Event.CANCEL, event)
				);

				self._detect(self.gestureDetectors, event);

				self.unregisterBlockList.forEach(function (_instance) {
					this.unregister(_instance);
				}, self);

				self._resetDetecting();
				self._blockMouseEvent = false;
			},

			/**
			 * Detect gesture
			 * @method _detect
			 * @param {Array} detectors
			 * @param {Event} event
			 * @member ns.event.gesture.Manager
			 * @protected
			 */
			_detect: function (detectors, event) {
				var self = this,
					finishedDetectors = [];

				detectors.forEach(function (detector) {
					var result;

					if (!self.detectorRequestedBlock) {
						result = detector.detect(event);
						if ((result & gesture.Result.RUNNING) &&
								self.runningDetectors.indexOf(detector) < 0) {
							self.runningDetectors.push(detector);
						}
						if (result & gesture.Result.FINISHED) {
							finishedDetectors.push(detector);
						}
						if (result & gesture.Result.BLOCK) {
							self.detectorRequestedBlock = detector;
						}
					}
				});

				// remove finished detectors.
				finishedDetectors.forEach(function (detector) {
					var idx = self.gestureDetectors.indexOf(detector);

					if (idx > -1) {
						self.gestureDetectors.splice(idx, 1);
					}
					idx = self.runningDetectors.indexOf(detector);
					if (idx > -1) {
						self.runningDetectors.splice(idx, 1);
					}
				});

				// remove all detectors except the detector that return block result
				if (self.detectorRequestedBlock) {
					// send to cancel event.
					self.runningDetectors.forEach(function (detector) {
						var cancelEvent = utilObject.fastMerge({}, event);

						cancelEvent.eventType = gesture.Event.BLOCKED;
						detector.detect(cancelEvent);
					});
					self.runningDetectors.length = 0;
					self.gestureDetectors.length = 0;
					if (finishedDetectors.indexOf(self.detectorRequestedBlock) < 0) {
						self.gestureDetectors.push(self.detectorRequestedBlock);
					}
				}
			},

			/**
			 * Reset of gesture manager detector
			 * @method _resetDetecting
			 * @member ns.event.gesture.Manager
			 * @protected
			 */
			_resetDetecting: function () {
				var self = this;

				self._isReadyDetecting = false;

				self.gestureDetectors.length = 0;
				self.runningDetectors.length = 0;
				self.detectorRequestedBlock = null;

				self.gestureEvents = {};
				self.velocity = null;

				self._unbindEvents();
			},

			/**
			 * Create default event data
			 * @method _createDefaultEventData
			 * @param {string} type event type
			 * @param {Event} event source event
			 * @return {Object} default event data
			 * @return {string} return.eventType
			 * @return {number} return.timeStamp
			 * @return {Touch} return.pointer
			 * @return {TouchList} return.pointers
			 * @return {Event} return.srcEvent
			 * @return {Function} return.preventDefault
			 * @return {Function} return.stopPropagation
			 * @member ns.event.gesture.Manager
			 * @protected
			 */
			_createDefaultEventData: function (type, event) {
				var pointers = event.touches;

				if (!pointers) {
					if (event.type === "mouseup") {
						pointers = [];
					} else {
						event.identifier = 1;
						pointers = [event];
					}
				}

				return {
					eventType: type,
					timeStamp: Date.now(),
					pointer: pointers[0],
					pointers: pointers,

					srcEvent: event,
					preventDefault: event.preventDefault.bind(event),
					stopPropagation: event.stopPropagation.bind(event)
				};
			},

			/**
			 * Create gesture event
			 * @method _createGestureEvent
			 * @param {string} type event type
			 * @param {Event} event source event
			 * @return {Object} gesture event consist from Event class and additional properties
			 * @return {number} return.deltaTime
			 * @return {number} return.deltaX
			 * @return {number} return.deltaY
			 * @return {number} return.velocityX
			 * @return {number} return.velocityY
			 * @return {number} return.estimatedX
			 * @return {number} return.estimatedY
			 * @return {number} return.estimatedDeltaX
			 * @return {number} return.estimatedDeltaY
			 * @return {number} return.distance
			 * @return {number} return.angle
			 * @return {number} return.direction
			 * @return {number} return.scale
			 * @return {number} return.rotation (deg)
			 * @return {Event} return.startEvent
			 * @return {Event} return.lastEvent
			 * @member ns.event.gesture.Manager
			 * @protected
			 */
			_createGestureEvent: function (type, event) {
				var self = this,
					defaultEvent = self._createDefaultEventData(type, event),
					startEvent = self.gestureEvents.start,
					lastEvent = self.gestureEvents.last,
					velocity = self.velocity,
					velocityEvent = velocity.event,
					delta = {
						time: defaultEvent.timeStamp - startEvent.timeStamp,
						x: defaultEvent.pointer.clientX - startEvent.pointer.clientX,
						y: defaultEvent.pointer.clientY - startEvent.pointer.clientY
					},
					deltaFromLast = {
						x: defaultEvent.pointer.clientX - lastEvent.pointer.clientX,
						y: defaultEvent.pointer.clientY - lastEvent.pointer.clientY
					},
					/* pause time threshold.util. tune the number to up if it is slow */
					timeDifference = gesture.defaults.estimatedPointerTimeDifference,
					estimated;

				// reset start event for multi touch
				if (startEvent && defaultEvent.pointers.length !== startEvent.pointers.length) {
					startEvent.pointers = Array.prototype.slice.call(defaultEvent.pointers);
				}

				if (defaultEvent.timeStamp - velocityEvent.timeStamp >
						gesture.defaults.updateVelocityInterval) {
					utilObject.fastMerge(velocity, gestureUtils.getVelocity(
						defaultEvent.timeStamp - velocityEvent.timeStamp,
						defaultEvent.pointer.clientX - velocityEvent.pointer.clientX,
						defaultEvent.pointer.clientY - velocityEvent.pointer.clientY
					));
					velocity.event = defaultEvent;
				}

				estimated = {
					x: Math.round(defaultEvent.pointer.clientX +
							(timeDifference * velocity.x * (deltaFromLast.x < 0 ? -1 : 1))),
					y: Math.round(defaultEvent.pointer.clientY +
							(timeDifference * velocity.y * (deltaFromLast.y < 0 ? -1 : 1)))
				};

				// Prevent that point goes back even though direction is not changed.
				if ((deltaFromLast.x < 0 && estimated.x > lastEvent.estimatedX) ||
						(deltaFromLast.x > 0 && estimated.x < lastEvent.estimatedX)) {
					estimated.x = lastEvent.estimatedX;
				}

				if ((deltaFromLast.y < 0 && estimated.y > lastEvent.estimatedY) ||
						(deltaFromLast.y > 0 && estimated.y < lastEvent.estimatedY)) {
					estimated.y = lastEvent.estimatedY;
				}

				utilObject.fastMerge(defaultEvent, {
					deltaTime: delta.time,
					deltaX: delta.x,
					deltaY: delta.y,

					velocityX: velocity.x,
					velocityY: velocity.y,

					estimatedX: estimated.x,
					estimatedY: estimated.y,
					estimatedDeltaX: estimated.x - startEvent.pointer.clientX,
					estimatedDeltaY: estimated.y - startEvent.pointer.clientY,

					distance: gestureUtils.getDistance(startEvent.pointer, defaultEvent.pointer),

					angle: gestureUtils.getAngle(startEvent.pointer, defaultEvent.pointer),

					direction: gestureUtils.getDirection(startEvent.pointer, defaultEvent.pointer),

					scale: gestureUtils.getScale(startEvent.pointers, defaultEvent.pointers),
					rotation: gestureUtils.getRotation(startEvent.pointers, defaultEvent.pointers),

					startEvent: startEvent,
					lastEvent: lastEvent
				});

				return defaultEvent;
			},

			/**
			 * Register instance of gesture
			 * @method register
			 * @param {ns.event.gesture.Instance} instance gesture instance
			 * @member ns.event.gesture.Manager
			 */
			register: function (instance) {
				var self = this,
					idx = self.instances.indexOf(instance);

				if (idx < 0) {
					self.instances.push(instance);
					self._bindStartEvents(instance);
				}
			},

			/**
			 * Unregister instance of gesture
			 * @method unregister
			 * @param {ns.event.gesture.Instance} instance gesture instance
			 * @member ns.event.gesture.Manager
			 */
			unregister: function (instance) {
				var idx,
					self = this;

				if (self.gestureDetectors.length) {
					self.unregisterBlockList.push(instance);
				} else {
					idx = self.instances.indexOf(instance);
					if (idx > -1) {
						self.instances.splice(idx, 1);
						self._unbindStartEvents(instance);
					}

					if (!self.instances.length) {
						self._destroy();
					}
				}
			},

			/**
			 * Destroy instance of Manager
			 * @method _destroy
			 * @member ns.event.gesture.Manager
			 * @protected
			 */
			_destroy: function () {
				var self = this;

				self._resetDetecting();
				self.instances.length = 0;
				self.unregisterBlockList.length = 0;
				self._blockMouseEvent = false;
				instance = null;
			}

		};

		Manager.getInstance = function () {
			if (!instance) {
				instance = new Manager();
			}
			return instance;
		};

		gesture.Manager = Manager;
		//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		return Manager;
	}
	);
	//>>excludeEnd("tauBuildExclude");
}(ns, window, window.document));
