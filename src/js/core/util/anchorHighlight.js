/*global window, define, ns */
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
 * #Anchor Highlight Utility
 *
 * Utility enables highlight on clickable components.
 * @class ns.util.anchorHighlight
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 * @author Konrad Lipner <k.lipner@samsung.com>
 */
(function (document, window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./selectors",
			"../util",
			"../event"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/* anchorHighlightController.js
			 To prevent performance regression when scrolling,
			 do not apply hover class in anchor.
			 Instead, this code checks scrolling for time threshold and
			 decide how to handle the color.
			 When scrolling with anchor, it checks flag and decide to highlight anchor.
			 While it helps to improve scroll performance,
			 it lowers responsiveness of the element for 50msec.
			 */

			/**
			 * Touch start x
			 * @property {number} startX
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			var startX = 0,
				/**
				 * Touch start y
				 * @property {number} startY
				 * @member ns.util.anchorHighlight
				 * @private
				 * @static
				 */
				startY = 0,
				/**
				 * Touch target element
				 * @property {HTMLElement} target
				 * @member ns.util.anchorHighlight
				 * @private
				 * @static
				 */
				classes = {
					/**
					 * Class used to mark element as active
					 * @property {string} [classes.ACTIVE_LI="ui-li-active"]
					 * @member ns.util.anchorHighlight
					 * @private
					 * @static
					 */
					ACTIVE_LI: "ui-li-active",
					/**
					 * Class used to mark button as active
					 * @property {string} [classes.ACTIVE_BTN="ui-btn-active"]
					 * @member ns.util.anchorHighlight
					 * @private
					 * @static
					 */
					ACTIVE_BTN: "ui-btn-active",
					/**
					 * Class used to mark button as inactive
					 * @property {string} [classes.INACTIVE_BTN="ui-btn-inactive"]
					 * @member ns.util.anchorHighlight
					 * @private
					 * @static
					 */
					INACTIVE_BTN: "ui-btn-inactive",
					/**
					 * Class used to select button
					 * @property {string} [classes.BUTTON="ui-btn"] btn
					 * @member ns.util.anchorHighlight
					 * @private
					 * @static
					 */
					BUTTON: "ui-btn",
					/**
					 * Class used to select button in header (old notation)
					 * @property {string} [classes.HEADER_BUTTON="ui-header-btn"] btn
					 * @member ns.util.anchorHighlight
					 * @private
					 * @static
					 */
					HEADER_BUTTON: "ui-header-btn",
					/**
					 * Class used to select anchor in sub-tab widget
					 * @property {string} [classes.SUBTAB_ANCHOR="ui-sub-tab-anchor"] anchor
					 * @member ns.util.anchorHighlight
					 * @private
					 * @static
					 */
					SUBTAB_ANCHOR: "ui-sub-tab-anchor",
					/**
					 * Class used to select navigation item
					 * @property {string} [classes.NAVIGATION_BUTTON="ui-navigation-item"] btn
					 * @member ns.util.anchorHighlight
					 * @private
					 * @static
					 */
					NAVIGATION_BUTTON: "ui-navigation-item"
				},
				events = {
					ACTIVE_LI: "anchorhighlightactiveli"
				},
				/**
				 * Alias for class {@link ns.util.selectors}
				 * @property {Object} selectors
				 * @member ns.util.anchorHighlight
				 * @private
				 * @static
				 */
				selectors = ns.util.selectors,
				/**
				 * Alias for class {@link ns.event}
				 * @property {Object} event
				 * @member ns.util.anchorHighlight
				 * @private
				 * @static
				 */
				eventUtil = ns.event,

				// cache function
				abs = Math.abs,

				/**
				 * Get closest li element
				 * @method detectLiElement
				 * @param {HTMLElement} target
				 * @return {HTMLElement}
				 * @member ns.util.anchorHighlight
				 * @private
				 * @static
				 */
				detectLiElement = function (target) {
					return selectors.getClosestByTag(target, "li");
				},

				anchorHighlight = {
					/**
					 * Object with default options
					 * @property {Object} options
					 * Threshold after which didScroll will be set
					 * @property {number} [options.scrollThreshold=10]
					 * Time to wait before adding activeClass
					 * @property {number} [options.addActiveClassDelay=50]
					 * Time to stay activeClass after touch end
					 * @property {number} [options.keepActiveClassDelay=100]
					 * @member ns.util.anchorHighlight
					 * @private
					 * @static
					 */
					options: {
						scrollThreshold: 10,
						addActiveClassDelay: 50,
						keepActiveClassDelay: 100
					},
					_startTime: 0,
					_startRemoveTime: 0,
					// inform that touch was ended
					_touchEnd: false,
					_liTarget: null,

					/**
					 * Touch button target element
					 * @property {HTMLElement} buttonTarget
					 * @member ns.util.anchorHighlight
					 * @private
					 * @static
					 */
					_target: null,
					/**
					 * Did page scrolled
					 * @property {boolean} didScroll
					 * @member ns.util.anchorHighlight
					 * @private
					 * @static
					 */
					_didScroll: false,
					_buttonTarget: null,
					// inform that animation of button's activation was ended
					_activeAnimationFinished: false,
					//cache function
					_requestAnimationFrame: ns.util.windowRequestAnimationFrame
				},

				// cache function
				slice = Array.prototype.slice;


			/**
			 * Get closest highlightable element
			 * @method detectHighlightTarget
			 * @param {HTMLElement} target
			 * @return {HTMLElement}
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function detectHighlightTarget(target) {
				return selectors.getClosestBySelector(target, "a, label");
			}

			/**
			 * Get closest button element
			 * @method detectBtnElement
			 * @param {HTMLElement} target
			 * @return {HTMLElement}
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function detectBtnElement(target) {
				return selectors.getClosestByClass(target, classes.BUTTON) ||
					selectors.getClosestByClass(target, classes.HEADER_BUTTON) ||
					selectors.getClosestByClass(target, classes.NAVIGATION_BUTTON) ||
					selectors.getClosestByClass(target, classes.SUBTAB_ANCHOR);
			}

			/**
			 * Clear active class on button
			 * @method clearBtnActiveClass
			 * @param {Event} event
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function clearBtnActiveClass(event) {
				var target = event.target,
					classList = target.classList;
				// if this is callback of activate animation and

				if (classList.contains(classes.ACTIVE_BTN) && !classList.contains(classes.INACTIVE_BTN)) {
					// set that animation was ended (used in touch end)
					anchorHighlight._activeAnimationFinished = true;

					// if touch end previously
					if (anchorHighlight._touchEnd || target !== anchorHighlight._buttonTarget) {
						// start inactivate animation
						classList.add(classes.INACTIVE_BTN);
					}
				} else {
					//when target of animationend event is child of active element instead of active element
					// itself
					if (!classList.contains(classes.ACTIVE_BTN) &&
						!classList.contains(classes.INACTIVE_BTN)) {
						target.parentNode.classList.remove(classes.ACTIVE_BTN);
						target.parentNode.classList.remove(classes.INACTIVE_BTN);
					}
					// this is callback for inactive animation end
					classList.remove(classes.INACTIVE_BTN);
					classList.remove(classes.ACTIVE_BTN);
				}
			}

			/**
			 * Add inactive class on touch end
			 * @method addButtonInactiveClass
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function addButtonInactiveClass() {
				if (anchorHighlight._buttonTarget) {
					anchorHighlight._buttonTarget.classList.add(classes.INACTIVE_BTN);
					anchorHighlight._buttonTarget.classList.remove(classes.ACTIVE_BTN);
				}
			}

			/**
			 * Add active class on touch end
			 * @method addButtonActiveClass
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function addButtonActiveClass() {
				anchorHighlight._buttonTarget.classList.add(classes.ACTIVE_BTN);
				anchorHighlight._activeAnimationFinished = false;
			}

			/**
			 * Clear classes on page or popup hide
			 * @method hideClear
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function hideClear() {
				var btnTarget = anchorHighlight._buttonTarget;

				if (btnTarget) {
					btnTarget.classList.remove(classes.ACTIVE_BTN);
					btnTarget.classList.remove(classes.INACTIVE_BTN);
				}
				if (anchorHighlight._target) {
					anchorHighlight._target.classList.remove(classes.ACTIVE_LI);
				}
			}

			/**
			 * Add active class to touched element
			 * @method addActiveClass
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function addActiveClass() {
				var btnTargetClassList,
					dTime;

				if (anchorHighlight._startTime) {
					dTime = Date.now() - anchorHighlight._startTime;

					if (dTime > anchorHighlight.options.addActiveClassDelay) {
						anchorHighlight._startTime = 0;
						anchorHighlight._buttonTarget = detectBtnElement(anchorHighlight._target);
						anchorHighlight._target = detectHighlightTarget(anchorHighlight._target);
						if (!anchorHighlight._didScroll) {
							anchorHighlight._liTarget = anchorHighlight._detectLiElement(anchorHighlight._target);
							if (!anchorHighlight._buttonTarget) {
								// add press effect to LI element
								if (anchorHighlight._liTarget) {
									anchorHighlight._liTarget.classList.add(classes.ACTIVE_LI);
									eventUtil.trigger(anchorHighlight._liTarget, events.ACTIVE_LI, {});
								}
							} else {
								// add press effect to button
								btnTargetClassList = anchorHighlight._buttonTarget.classList;
								btnTargetClassList.remove(classes.ACTIVE_BTN);
								btnTargetClassList.remove(classes.INACTIVE_BTN);
								anchorHighlight._requestAnimationFrame(addButtonActiveClass);
							}
						}
					} else {
						anchorHighlight._requestAnimationFrame(addActiveClass);
					}
				}
			}

			/**
			 * Get all active elements
			 * @method getActiveElements
			 * @return {Array}
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function getActiveElements() {
				return slice.call(document.getElementsByClassName(classes.ACTIVE_LI));
			}

			/**
			 * Remove active class from current active objects
			 * @method clearActiveClass
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function clearActiveClass() {
				var activeA = getActiveElements(),
					activeALength = activeA.length,
					i = 0;

				for (; i < activeALength; i++) {
					activeA[i].classList.remove(classes.ACTIVE_LI);
				}
			}

			/**
			 * Remove active class from active elements
			 * @method removeActiveClass
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function removeActiveClassLoop() {
				var dTime = Date.now() - anchorHighlight._startRemoveTime;

				if (dTime > anchorHighlight.options.keepActiveClassDelay) {
					// after touchend
					clearActiveClass();
				} else {
					anchorHighlight._requestAnimationFrame(removeActiveClassLoop);
				}
			}

			/**
			 * Function invoked during touch move (and mouse)
			 * @method touchmoveHandler
			 * @param {Event} event
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function touchmoveHandler(event) {
				var touch = event.touches[0],
					scrollThreshold = anchorHighlight.options.scrollThreshold;

				// if move looks like scroll
				if (!anchorHighlight._didScroll &&
					// if move is bigger then threshold
					(abs(touch.clientX - startX) > scrollThreshold ||
					abs(touch.clientY - startY) > scrollThreshold)) {
					anchorHighlight._startTime = 0;
					// we clear active classes
					anchorHighlight._requestAnimationFrame(clearActiveClass);
					anchorHighlight._didScroll = true;
				}
			}

			/**
			 * Function invoked after touch start (and mouse)
			 * @method touchstartHandler
			 * @param {Event} event
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function touchstartHandler(event) {
				var touches = event.touches,
					pointer = (!touches) ? event : // mouse event
						(touches.length === 1) ? touches[0] : null; // touch event

				if (pointer) {
					anchorHighlight._didScroll = false;
					startX = pointer.clientX;
					startY = pointer.clientY;
					anchorHighlight._target = event.target;
					anchorHighlight._startTime = Date.now();
					anchorHighlight._startRemoveTime = 0;
					anchorHighlight._requestAnimationFrame(addActiveClass);
					anchorHighlight._touchEnd = false;
				}
			}


			/**
			 * Function invoked after touch (and mouse)
			 * @method touchendHandler
			 * @param {Event} event
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function touchendHandler(event) {
				anchorHighlight._startRemoveTime = event.timeStamp;

				if (!event.touches || event.touches && event.touches.length === 0) {
					if (!anchorHighlight._didScroll) {
						anchorHighlight._startTime = 0;
						anchorHighlight._requestAnimationFrame(removeActiveClassLoop);
					}
					// if we finished activate animation then start inactive animation
					if (anchorHighlight._activeAnimationFinished) {
						anchorHighlight._requestAnimationFrame(addButtonInactiveClass);
					}
					anchorHighlight._didScroll = false;
					anchorHighlight._touchEnd = true;
				}
			}

			/**
			 * Function invoked after visibilitychange event
			 * @method checkPageVisibility
			 * @member ns.util.anchorHighlight
			 * @private
			 * @static
			 */
			function checkPageVisibility() {
				/* istanbul ignore if  */
				if (document.visibilityState === "hidden") {
					anchorHighlight._removeActiveClassLoop();
				}
			}

			ns.util.anchorHighlight = anchorHighlight;
			anchorHighlight.enable = enable;
			anchorHighlight.disable = disable;
			anchorHighlight._clearActiveClass = clearActiveClass;
			anchorHighlight._detectHighlightTarget = detectHighlightTarget;
			anchorHighlight._detectBtnElement = detectBtnElement;
			anchorHighlight._removeActiveClassLoop = removeActiveClassLoop;
			anchorHighlight._addButtonInactiveClass = addButtonInactiveClass;
			anchorHighlight._addButtonActiveClass = addButtonActiveClass;
			anchorHighlight._addActiveClass = addActiveClass;
			anchorHighlight._detectLiElement = detectLiElement;
			anchorHighlight._touchmoveHandler = touchmoveHandler;
			anchorHighlight._touchendHandler = touchendHandler;
			anchorHighlight._touchstartHandler = touchstartHandler;
			anchorHighlight._checkPageVisibility = checkPageVisibility;
			anchorHighlight._hideClear = hideClear;
			anchorHighlight._clearBtnActiveClass = clearBtnActiveClass;

			/**
			 * Bind events to document
			 * @method enable
			 * @member ns.util.anchorHighlight
			 * @static
			 */
			function enable() {
				document.addEventListener("touchstart", anchorHighlight._touchstartHandler, false);
				document.addEventListener("touchend", anchorHighlight._touchendHandler, false);
				document.addEventListener("touchmove", anchorHighlight._touchmoveHandler, false);
				// for TAU in browser
				document.addEventListener("mousedown", anchorHighlight._touchstartHandler, false);
				document.addEventListener("mouseup", anchorHighlight._touchendHandler, false);

				document.addEventListener("visibilitychange", anchorHighlight._checkPageVisibility, false);
				document.addEventListener("pagehide", anchorHighlight._hideClear, false);
				document.addEventListener("popuphide", anchorHighlight._hideClear, false);
				document.addEventListener("animationend", anchorHighlight._clearBtnActiveClass, false);
				document.addEventListener("animationEnd", anchorHighlight._clearBtnActiveClass, false);
				document.addEventListener("webkitAnimationEnd", anchorHighlight._clearBtnActiveClass,
					false);
			}

			/**
			 * Unbinds events from document.
			 * @method disable
			 * @member ns.util.anchorHighlight
			 * @static
			 */
			function disable() {
				document.removeEventListener("touchstart", anchorHighlight._touchstartHandler, false);
				document.removeEventListener("touchend", anchorHighlight._touchendHandler, false);
				document.removeEventListener("touchmove", anchorHighlight._touchmoveHandler, false);
				// for TAU in browser
				document.removeEventListener("mousedown", anchorHighlight._touchstartHandler, false);
				document.removeEventListener("mouseup", anchorHighlight._touchendHandler, false);

				document.removeEventListener("visibilitychange", anchorHighlight._checkPageVisibility,
					false);
				document.removeEventListener("pagehide", anchorHighlight._hideClear, false);
				document.removeEventListener("popuphide", anchorHighlight._hideClear, false);
				document.removeEventListener("animationend", anchorHighlight._clearBtnActiveClass, false);
				document.removeEventListener("animationEnd", anchorHighlight._clearBtnActiveClass, false);
				document.removeEventListener("webkitAnimationEnd", anchorHighlight._clearBtnActiveClass,
					false);
			}

			enable();

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.util.anchorHighlight;
		});
	//>>excludeEnd("tauBuildExclude");
}(document, window, ns));
