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
 *
 */
/* global ns, define, CustomEvent */
/**
 * #Events
 *
 * The Tizen Advanced UI (TAU) framework provides events optimized for the Tizen
 * Web application. The following table displays the events provided by the TAU
 * framework.
 * @class ns.event
 */
(function (window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./core",
			"./util/array"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * Checks if specified variable is a array or not
			 * @method isArray
			 * @return {boolean}
			 * @member ns.event
			 * @private
			 * @static
			 */
			var instances = [],
				isArray = Array.isArray,
				isArrayLike = ns.util.array.isArrayLike,
				/**
				 * @property {RegExp} SPLIT_BY_SPACES_REGEXP
				 */
				SPLIT_BY_SPACES_REGEXP = /\s+/g,

				/**
				 * Returns trimmed value
				 * @method trim
				 * @param {string} value
				 * @return {string} trimmed string
				 * @static
				 * @private
				 * @member ns.event
				 */
				trim = function (value) {
					return value.trim();
				},

				/**
				 * Split string to array
				 * @method getEventsListeners
				 * @param {string|Array|Object} names string with one name of event, many names of events
				 * divided by spaces, array with names of widgets or object in which keys are names of
				 * events and values are callbacks
				 * @param {Function} globalListener
				 * @return {Array}
				 * @static
				 * @private
				 * @member ns.event
				 */
				getEventsListeners = function (names, globalListener) {
					var name,
						result = [],
						i;

					if (typeof names === "string") {
						names = names.split(SPLIT_BY_SPACES_REGEXP).map(trim);
					}

					if (isArray(names)) {
						for (i = 0; i < names.length; i++) {
							result.push({type: names[i], callback: globalListener});
						}
					} else {
						for (name in names) {
							if (names.hasOwnProperty(name)) {
								result.push({type: name, callback: names[name]});
							}
						}
					}
					return result;
				};

			/**
			 * Find instance by element
			 * @method findInstance
			 * @param {HTMLElement} element
			 * @return {ns.event.gesture.Instance}
			 * @member ns.event
			 * @static
			 * @private
			 */
			function findInstance(element) {
				var instance;

				instances.forEach(function (item) {
					if (item.element === element) {
						instance = item.instance;
					}
				});
				return instance;
			}

			/**
			 * Remove instance from instances by element
			 * @method removeInstance
			 * @param {HTMLElement} element
			 * @member ns.event
			 * @static
			 * @private
			 */
			function removeInstance(element) {
				instances.forEach(function (item, key) {
					if (item.element === element) {
						instances.splice(key, 1);
					}
				});
			}


			ns.event = {

				/**
				 * Triggers custom event fastOn element
				 * The return value is false, if at least one of the event
				 * handlers which handled this event, called preventDefault.
				 * Otherwise it returns true.
				 * @method trigger
				 * @param {HTMLElement|HTMLDocument} element
				 * @param {string} type
				 * @param {?*} [data=null]
				 * @param {boolean=} [bubbles=true]
				 * @param {boolean=} [cancelable=true]
				 * @return {boolean}
				 * @member ns.event
				 * @static
				 */
				trigger: function (element, type, data, bubbles, cancelable) {
					var evt = new CustomEvent(type, {
						"detail": data,
						//allow event to bubble up, required if we want to allow to listen fastOn document etc
						bubbles: typeof bubbles === "boolean" ? bubbles : true,
						cancelable: typeof cancelable === "boolean" ? cancelable : true
					});
					//>>excludeStart("tauDebug", pragmas.tauDebug);

					ns.log("triggered event " + type + " on:", element.tagName + "#" +
						(element.id || "--no--id--"));
					//>>excludeEnd("tauDebug");
					return element.dispatchEvent(evt);
				},

				/**
				 * Prevent default on original event
				 * @method preventDefault
				 * @param {Event} event
				 * @member ns.event
				 * @static
				 */
				preventDefault: function (event) {
					var originalEvent = event._originalEvent;
					// @todo this.isPropagationStopped = returnTrue;

					if (originalEvent && originalEvent.preventDefault) {
						originalEvent.preventDefault();
					}
					event.preventDefault();
				},

				/**
				 * Stop event propagation
				 * @method stopPropagation
				 * @param {Event} event
				 * @member ns.event
				 * @static
				 */
				stopPropagation: function (event) {
					var originalEvent = event._originalEvent;
					// @todo this.isPropagationStopped = returnTrue;

					if (originalEvent && originalEvent.stopPropagation) {
						originalEvent.stopPropagation();
					}
					event.stopPropagation();
				},

				/**
				 * Stop event propagation immediately
				 * @method stopImmediatePropagation
				 * @param {Event} event
				 * @member ns.event
				 * @static
				 */
				stopImmediatePropagation: function (event) {
					var originalEvent = event._originalEvent;
					// @todo this.isPropagationStopped = returnTrue;

					if (originalEvent && originalEvent.stopImmediatePropagation) {
						originalEvent.stopImmediatePropagation();
					}
					event.stopImmediatePropagation();
				},

				/**
				 * Return document relative cords for event
				 * @method documentRelativeCoordsFromEvent
				 * @param {Event} event
				 * @return {Object}
				 * @return {number} return.x
				 * @return {number} return.y
				 * @member ns.event
				 * @static
				 */
				documentRelativeCoordsFromEvent: function (event) {
					var _event = event ? event : window.event,
						client = {
							x: _event.clientX,
							y: _event.clientY
						},
						page = {
							x: _event.pageX,
							y: _event.pageY
						},
						posX = 0,
						posY = 0,
						touch0,
						body = document.body,
						documentElement = document.documentElement;

					if (event.type.match(/^touch/)) {
						touch0 = _event.targetTouches[0] || _event.originalEvent.targetTouches[0];
						page = {
							x: touch0.pageX,
							y: touch0.pageY
						};
						client = {
							x: touch0.clientX,
							y: touch0.clientY
						};
					}

					if (page.x || page.y) {
						posX = page.x;
						posY = page.y;
					} else if (client.x || client.y) {
						posX = client.x + body.scrollLeft + documentElement.scrollLeft;
						posY = client.y + body.scrollTop + documentElement.scrollTop;
					}

					return {x: posX, y: posY};
				},

				/**
				 * Return target relative cords for event
				 * @method targetRelativeCoordsFromEvent
				 * @param {Event} event
				 * @return {Object}
				 * @return {number} return.x
				 * @return {number} return.y
				 * @member ns.event
				 * @static
				 */
				targetRelativeCoordsFromEvent: function (event) {
					var target = event.target,
						cords = {
							x: event.offsetX,
							y: event.offsetY
						};

					if (cords.x === undefined || isNaN(cords.x) ||
						cords.y === undefined || isNaN(cords.y)) {
						cords = ns.event.documentRelativeCoordsFromEvent(event);
						cords.x -= target.offsetLeft;
						cords.y -= target.offsetTop;
					}

					return cords;
				},

				/**
				 * Add event listener to element
				 * @method fastOn
				 * @param {HTMLElement} element
				 * @param {string} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @member ns.event
				 * @static
				 */
				fastOn: function (element, type, listener, useCapture) {
					element.addEventListener(type, listener, useCapture || false);
				},

				/**
				 * Remove event listener to element
				 * @method fastOff
				 * @param {HTMLElement} element
				 * @param {string} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @member ns.event
				 * @static
				 */
				fastOff: function (element, type, listener, useCapture) {
					element.removeEventListener(type, listener, useCapture || false);
				},

				/**
				 * Add event listener to element with prefixes for all browsers
				 *
				 *	@example
				 * 		tau.event.prefixedFastOn(document, "animationEnd", function() {
				 *			console.log("animation ended");
				 *		});
				 *		// write "animation ended" on console on event "animationEnd", "webkitAnimationEnd", "mozAnimationEnd", "msAnimationEnd", "oAnimationEnd"
				 *
				 * @method fastPrefixedOn
				 * @param {HTMLElement} element
				 * @param {string} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @member ns.event
				 * @static
				 */
				prefixedFastOn: function (element, type, listener, useCapture) {
					var nameForPrefix = type.charAt(0).toLocaleUpperCase() + type.substring(1);

					element.addEventListener(type.toLowerCase(), listener, useCapture || false);
					element.addEventListener("webkit" + nameForPrefix, listener, useCapture || false);
					element.addEventListener("moz" + nameForPrefix, listener, useCapture || false);
					element.addEventListener("ms" + nameForPrefix, listener, useCapture || false);
					element.addEventListener("o" + nameForPrefix.toLowerCase(), listener, useCapture || false);
				},

				/**
				 * Remove event listener to element with prefixes for all browsers
				 *
				 *	@example
				 *		tau.event.prefixedFastOff(document, "animationEnd", functionName);
				 *		// remove listeners functionName on events "animationEnd", "webkitAnimationEnd", "mozAnimationEnd", "msAnimationEnd", "oAnimationEnd"
				 *
				 * @method fastPrefixedOff
				 * @param {HTMLElement} element
				 * @param {string} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @member ns.event
				 * @static
				 */
				prefixedFastOff: function (element, type, listener, useCapture) {
					var nameForPrefix = type.charAt(0).toLocaleUpperCase() + type.substring(1);

					element.removeEventListener(type.toLowerCase(), listener, useCapture || false);
					element.removeEventListener("webkit" + nameForPrefix, listener, useCapture || false);
					element.removeEventListener("moz" + nameForPrefix, listener, useCapture || false);
					element.removeEventListener("ms" + nameForPrefix, listener, useCapture || false);
					element.removeEventListener("o" + nameForPrefix.toLowerCase(), listener, useCapture || false);
				},

				/**
				 * Add event listener to element that can be added addEventListener
				 * @method on
				 * @param {HTMLElement|HTMLDocument|Window} element
				 * @param {string|Array|Object} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @member ns.event
				 * @static
				 */
				on: function (element, type, listener, useCapture) {
					var i,
						j,
						elementsLength,
						typesLength,
						elements,
						listeners;

					if (isArrayLike(element)) {
						elements = element;
					} else {
						elements = [element];
					}
					elementsLength = elements.length;
					listeners = getEventsListeners(type, listener);
					typesLength = listeners.length;
					for (i = 0; i < elementsLength; i++) {
						if (typeof elements[i].addEventListener === "function") {
							for (j = 0; j < typesLength; j++) {
								ns.event.fastOn(elements[i], listeners[j].type, listeners[j].callback, useCapture);
							}
						}
					}
				},

				/**
				 * Remove event listener to element
				 * @method off
				 * @param {HTMLElement|HTMLDocument|Window} element
				 * @param {string|Array|Object} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @member ns.event
				 * @static
				 */
				off: function (element, type, listener, useCapture) {
					var i,
						j,
						elementsLength,
						typesLength,
						elements,
						listeners;

					if (isArrayLike(element)) {
						elements = element;
					} else {
						elements = [element];
					}
					elementsLength = elements.length;
					listeners = getEventsListeners(type, listener);
					typesLength = listeners.length;
					for (i = 0; i < elementsLength; i++) {
						if (typeof elements[i].addEventListener === "function") {
							for (j = 0; j < typesLength; j++) {
								ns.event.fastOff(elements[i], listeners[j].type, listeners[j].callback, useCapture);
							}
						}
					}
				},

				/**
				 * Add event listener to element only for one trigger
				 * @method one
				 * @param {HTMLElement|HTMLDocument|window} element
				 * @param {string|Array|Object} type
				 * @param {Function} listener
				 * @param {boolean} [useCapture=false]
				 * @member ns.event
				 * @static
				 */
				one: function (element, type, listener, useCapture) {
					var arraySlice = [].slice,
						i,
						j,
						elementsLength,
						typesLength,
						elements,
						listeners,
						callbacks = [];

					if (isArrayLike(element)) {
						elements = arraySlice.call(element);
					} else {
						elements = [element];
					}
					elementsLength = elements.length;
					// pair type with listener
					listeners = getEventsListeners(type, listener);
					typesLength = listeners.length;
					// on each element
					for (i = 0; i < elementsLength; i++) {
						// if element has possibility of add listener
						if (typeof elements[i].addEventListener === "function") {
							callbacks[i] = [];
							// for each event type
							for (j = 0; j < typesLength; j++) {
								callbacks[i][j] = (function (i, j) {
									var args = arraySlice.call(arguments);

									ns.event.fastOff(elements[i], listeners[j].type, callbacks[i][j], useCapture);
									// remove the first argument of binding function
									args.shift();
									// remove the second argument of binding function
									args.shift();
									listeners[j].callback.apply(this, args);
								}).bind(null, i, j);
								ns.event.fastOn(elements[i], listeners[j].type, callbacks[i][j], useCapture);
							}
						}
					}
				},

				// disable is required because method has changing arguments
				/* eslint-disable jsdoc/check-param-names */

				/**
				 * Enable gesture handling on given HTML element or object
				 * @method enableGesture
				 * @param {HTMLElement} element
				 * @param {...Object} [gesture] Gesture object {@link ns.event.gesture}
				 * @member ns.event
				 */
				enableGesture: function (element) {
					var gestureInstance = findInstance(element),
						length = arguments.length,
						i = 1;

					if (!gestureInstance) {
						gestureInstance = new ns.event.gesture.Instance(element);
						instances.push({element: element, instance: gestureInstance});
					}

					for (; i < length; i++) {
						gestureInstance.addDetector(arguments[i]);
					}
				},

				/**
				 * Disable gesture handling from given HTML element or object
				 * @method disableGesture
				 * @param {HTMLElement} element
				 * @param {...Object} [gesture] Gesture object {@link ns.event.gesture}
				 * @member ns.event
				 */
				disableGesture: function (element) {
					var gestureInstance = findInstance(element),
						length = arguments.length,
						i = 1;

					if (!gestureInstance) {
						return;
					}

					if (length > 1) {
						gestureInstance.removeDetector(arguments[i]);
					} else {
						gestureInstance.destroy();
						removeInstance(element);
					}
				}

				/* eslint-disable jsdoc/check-param-names */
			};

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.event;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, ns));
