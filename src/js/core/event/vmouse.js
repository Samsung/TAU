/*global CustomEvent, define, window, ns */
/*jslint plusplus: true, nomen: true, bitwise: true */
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
 * #Virtual Mouse Events
 * Reimplementation of jQuery Mobile virtual mouse events.
 *
 * ##Purpose
 * It will let for users to register callbacks to the standard events like bellow,
 * without knowing if device support touch or mouse events
 * @class ns.event.vmouse
 */
/**
 * Triggered after mouse-down or touch-started.
 * @event vmousedown
 * @member ns.event.vmouse
 */
/**
 * Triggered when mouse-click or touch-end when touch-move didn't occur
 * @event vclick
 * @member ns.event.vmouse
 */
/**
 * Triggered when mouse-up or touch-end
 * @event vmouseup
 * @member ns.event.vmouse
 */
/**
 * Triggered when mouse-move or touch-move
 * @event vmousemove
 * @member ns.event.vmouse
 */
/**
 * Triggered when mouse-over or touch-start if went over coordinates
 * @event vmouseover
 * @member ns.event.vmouse
 */
/**
 * Triggered when mouse-out or touch-end
 * @event vmouseout
 * @member ns.event.vmouse
 */
/**
 * Triggered when mouse-cancel or touch-cancel and when scroll occur during touchmove
 * @event vmousecancel
 * @member ns.event.vmouse
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../event"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * Object with default options
			 * @property {Object} vmouse
			 * @member ns.event.vmouse
			 * @static
			 * @private
			 **/
			var vmouse,
				/**
				 * @property {Object} eventProps Contains the properties which are copied from the original
				 * event to custom v-events
				 * @member ns.event.vmouse
				 * @static
				 * @private
				 **/
				eventProps,
				/**
				 * Indicates if the browser support touch events
				 * @property {boolean} touchSupport
				 * @member ns.event.vmouse
				 * @static
				 **/
				touchSupport = window.hasOwnProperty("ontouchstart"),
				/**
				 * @property {boolean} didScroll The flag tell us if the scroll event was triggered
				 * @member ns.event.vmouse
				 * @static
				 * @private
				 **/
				didScroll,
				/** @property {HTMLElement} lastOver holds reference to last element that touch was over
				 * @member ns.event.vmouse
				 * @private
				 */
				lastOver = null,
				/**
				 * @property {number} [startX=0] Initial data for touchstart event
				 * @member ns.event.vmouse
				 * @static
				 * @private
				 **/
				startX = 0,
				/**
				 * @property {number} [startY=0] Initial data for touchstart event
				 * @member ns.event.vmouse
				 * @private
				 * @static
				 **/
				startY = 0,
				touchEventProps = ["clientX", "clientY", "pageX", "pageY", "screenX", "screenY"],
				KEY_CODES = {
					enter: 13
				};

			/**
			 * Extends objects with other objects
			 * @method copyProps
			 * @param {Object} from Sets the original event
			 * @param {Object} to Sets the new event
			 * @param {Object} properties Sets the special properties for position
			 * @param {Object} propertiesNames Describe parameters which will be copied from Original to
			 * event
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function copyProps(from, to, properties, propertiesNames) {
				var i,
					length,
					descriptor,
					property;

				for (i = 0, length = propertiesNames.length; i < length; ++i) {
					property = propertiesNames[i];
					if (isNaN(properties[property]) === false || isNaN(from[property]) === false) {
						descriptor = Object.getOwnPropertyDescriptor(to, property);
						if (property !== "detail" && (!descriptor || descriptor.writable)) {
							to[property] = properties[property] || from[property];
						}
					}
				}
			}

			/**
			 * Create custom event
			 * @method createEvent
			 * @param {string} newType gives a name for the new Type of event
			 * @param {Event} original Event which trigger the new event
			 * @param {Object} properties Sets the special properties for position
			 * @return {Event}
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function createEvent(newType, original, properties) {
				var evt = new CustomEvent(newType, {
						"bubbles": original.bubbles,
						"cancelable": original.cancelable,
						"detail": original.detail
					}),
					originalType = original.type,
					changeTouches,
					touch,
					j = 0,
					len,
					prop;

				copyProps(original, evt, properties, eventProps);
				evt._originalEvent = original;

				if (originalType.indexOf("touch") !== -1) {
					originalType = original.touches;
					changeTouches = original.changedTouches;

					if (originalType && originalType.length) {
						touch = originalType[0];
					} else {
						touch = (changeTouches && changeTouches.length) ? changeTouches[0] : null;
					}

					if (touch) {
						for (len = touchEventProps.length; j < len; j++) {
							prop = touchEventProps[j];
							evt[prop] = touch[prop];
						}
					}
				}

				return evt;
			}

			/**
			 * Dispatch Events
			 * @method fireEvent
			 * @param {string} eventName event name
			 * @param {Event} evt original event
			 * @param {Object} [properties] Sets the special properties for position
			 * @return {boolean}
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function fireEvent(eventName, evt, properties) {
				return evt.target.dispatchEvent(createEvent(eventName, evt, properties || {}));
			}

			eventProps = [
				"currentTarget",
				"detail",
				"button",
				"buttons",
				"clientX",
				"clientY",
				"offsetX",
				"offsetY",
				"pageX",
				"pageY",
				"screenX",
				"screenY",
				"toElement",
				"which"
			];

			vmouse = {
				/**
				 * Sets the distance of pixels after which the scroll event will be successful
				 * @property {number} [eventDistanceThreshold=10]
				 * @member ns.event.vmouse
				 * @static
				 */
				eventDistanceThreshold: 10,

				touchSupport: touchSupport
			};

			/**
			 * Handle click down
			 * @method handleDown
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleDown(evt) {
				fireEvent("vmousedown", evt);
			}

			/**
			 * Prepare position of event for keyboard events.
			 * @method preparePositionForClick
			 * @param {Event} event
			 * @return {?Object} options
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function preparePositionForClick(event) {
				var x = event.clientX,
					y = event.clientY;
				// event comes from keyboard

				if (!x && !y) {
					return preparePositionForEvent(event);
				}
				return null;
			}

			/**
			 * Handle click
			 * @method handleClick
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleClick(evt) {
				fireEvent("vclick", evt, preparePositionForClick(evt));
			}

			/**
			 * Handle click up
			 * @method handleUp
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleUp(evt) {
				fireEvent("vmouseup", evt);
			}

			/**
			 * Handle click move
			 * @method handleMove
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleMove(evt) {
				fireEvent("vmousemove", evt);
			}

			/**
			 * Handle click over
			 * @method handleOver
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleOver(evt) {
				fireEvent("vmouseover", evt);
			}

			/**
			 * Handle click out
			 * @method handleOut
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleOut(evt) {
				fireEvent("vmouseout", evt);
			}

			/**
			 * Handle touch start
			 * @method handleTouchStart
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleTouchStart(evt) {
				var touches = evt.touches,
					firstTouch;

				//if touches are registered and we have only one touch
				if (touches && touches.length === 1) {
					didScroll = false;
					firstTouch = touches[0];
					startX = firstTouch.pageX;
					startY = firstTouch.pageY;

					// Check if we have touched something on our page
					// @TODO refactor for multi touch
					/*
					 over = document.elementFromPoint(startX, startY);
					 if (over) {
					 lastOver = over;
					 fireEvent("vmouseover", evt);
					 }
					 */
					fireEvent("vmousedown", evt);
				}

			}

			/**
			 * Handle touch end
			 * @method handleTouchEnd
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleTouchEnd(evt) {
				var touches = evt.touches;

				if (touches && touches.length === 0) {
					fireEvent("vmouseup", evt);
					fireEvent("vmouseout", evt);
					// Reset flag for last over element
					lastOver = null;
				}
			}

			/**
			 * Handle touch move
			 * @method handleTouchMove
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleTouchMove(evt) {
				var over,
					firstTouch = evt.touches && evt.touches[0],
					didCancel = didScroll,
					//sets the threshold, based on which we consider if it was the touch-move event
					moveThreshold = vmouse.eventDistanceThreshold;

				/**
				 * Ignore the touch which has identifier other than 0.
				 * Only first touch has control others are ignored.
				 * Patch for webkit behavior where touchmove event
				 * is triggered between touchend events
				 * if there is multi touch.
				 */

				if ((firstTouch === undefined) || firstTouch.identifier > 0) {
					//evt.preventDefault(); // cant preventDefault passive events!!!
					evt.stopPropagation();
					return;
				}

				didScroll = didScroll ||
					//check in both axes X,Y if the touch-move event occur
					(Math.abs(firstTouch.pageX - startX) > moveThreshold ||
					Math.abs(firstTouch.pageY - startY) > moveThreshold);

				// detect over event
				// for compatibility with mouseover because "touchenter" fires only once
				// @TODO Handle many touches
				over = document.elementFromPoint(firstTouch.pageX, firstTouch.pageY);
				if (over && lastOver !== over) {
					lastOver = over;
					fireEvent("vmouseover", evt);
				}

				//if didScroll occur and wasn't canceled then trigger touchend otherwise just touchmove
				if (didScroll && !didCancel) {
					fireEvent("vmousecancel", evt);
					lastOver = null;
				}
				fireEvent("vmousemove", evt);
			}

			/**
			 * Handle Scroll
			 * @method handleScroll
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleScroll(evt) {
				if (!didScroll) {
					fireEvent("vmousecancel", evt);
				}
				didScroll = true;
			}

			/**
			 * Handle touch cancel
			 * @method handleTouchCancel
			 * @param {Event} evt
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleTouchCancel(evt) {

				fireEvent("vmousecancel", evt);
				lastOver = null;
			}

			/**
			 * Prepare position of event for keyboard events.
			 * @method preparePositionForEvent
			 * @param {Event} event
			 * @return {Object} properties
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function preparePositionForEvent(event) {
				var targetRect = event.target && event.target.getBoundingClientRect(),
					properties = {};

				if (targetRect) {
					properties = {
						"clientX": targetRect.left + targetRect.width / 2,
						"clientY": targetRect.top + targetRect.height / 2,
						"which": 1
					};
				}
				return properties;
			}

			/**
			 * Handle key up
			 * @method handleKeyUp
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleKeyUp(event) {
				var properties;

				if (event.keyCode === KEY_CODES.enter) {
					properties = preparePositionForEvent(event);
					fireEvent("vmouseup", event, properties);
					fireEvent("vclick", event, properties);
				}
			}

			/**
			 * Handle key down
			 * @method handleKeyDown
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.event.vmouse
			 */
			function handleKeyDown(event) {
				if (event.keyCode === KEY_CODES.enter) {
					fireEvent("vmousedown", event, preparePositionForEvent(event));
				}
			}

			/**
			 * Binds events common to mouse and touch to support virtual mouse.
			 * @method bindCommonEvents
			 * @static
			 * @member ns.event.vmouse
			 */
			vmouse.bindCommonEvents = function () {
				document.addEventListener("keyup", handleKeyUp, true);
				document.addEventListener("keydown", handleKeyDown, true);
				document.addEventListener("scroll", handleScroll, true);
				document.addEventListener("click", handleClick, true);
			};

			// @TODO delete touchSupport flag and attach touch and mouse listeners,
			// @TODO check if v-events are not duplicated if so then called only once

			/**
			 * Binds touch events to support virtual mouse.
			 * @method bindTouch
			 * @static
			 * @member ns.event.vmouse
			 */
			vmouse.bindTouch = function () {
				document.addEventListener("touchstart", handleTouchStart, true);
				document.addEventListener("touchend", handleTouchEnd, true);
				document.addEventListener("touchmove", handleTouchMove, true);
				document.addEventListener("touchcancel", handleTouchCancel, true);
			};

			/**
			 * Binds mouse events to support virtual mouse.
			 * @method bindMouse
			 * @static
			 * @member ns.event.vmouse
			 */
			vmouse.bindMouse = function () {
				document.addEventListener("mousedown", handleDown, true);
				document.addEventListener("mouseup", handleUp, true);
				document.addEventListener("mousemove", handleMove, true);
				document.addEventListener("mouseover", handleOver, true);
				document.addEventListener("mouseout", handleOut, true);
			};

			/**
			 * Unbinds touch events to support virtual mouse.
			 * @method unbindTouch
			 * @static
			 * @member ns.event.vmouse
			 */
			vmouse.unbindTouch = function () {
				document.removeEventListener("touchstart", handleTouchStart, true);
				document.removeEventListener("touchend", handleTouchEnd, true);
				document.removeEventListener("touchmove", handleTouchMove, true);

				document.removeEventListener("touchcancel", handleTouchCancel, true);

				document.removeEventListener("click", handleClick, true);
			};

			/**
			 * Unbinds mouse events to support virtual mouse.
			 * @method unbindMouse
			 * @static
			 * @member ns.event.vmouse
			 */
			vmouse.unbindMouse = function () {
				document.removeEventListener("mousedown", handleDown, true);

				document.removeEventListener("mouseup", handleUp, true);
				document.removeEventListener("mousemove", handleMove, true);
				document.removeEventListener("mouseover", handleOver, true);
				document.removeEventListener("mouseout", handleOut, true);

				document.removeEventListener("keyup", handleKeyUp, true);
				document.removeEventListener("keydown", handleKeyDown, true);
				document.removeEventListener("scroll", handleScroll, true);
				document.removeEventListener("click", handleClick, true);
			};

			ns.event.vmouse = vmouse;

			if (touchSupport) {
				vmouse.bindTouch();
			} else {
				vmouse.bindMouse();
			}
			vmouse.bindCommonEvents();

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.event.vmouse;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
