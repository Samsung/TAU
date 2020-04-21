/*global window, define, ns, HTMLElement, Node */
/*
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */

(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../core/engine",
			"../../core/event",
			"../../core/util/object",
			"../../core/util/array",
			"../../core/util/string",
			"../../core/util/selectors",
			"../../core/util/DOM/css",
			"../../core/util/DOM/attributes",
			"./BaseWidget",
			"../../core/widget/core"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,
				DOM = ns.util.DOM,
				object = ns.util.object,
				utilArray = ns.util.array,
				eventUtils = ns.event,
				selectorUtils = ns.util.selectors,
				atan2 = Math.atan2,
				abs = Math.abs,
				PI = Math.PI,
				sqrt = Math.sqrt,
				slice = [].slice,
				// focus configuration
				SIDE_DISTANCE_LIMIT = 200,
				prototype = {
					_supportKeyboard: false
				},
				BaseKeyboardSupport = function () {
					var self = this,
						options = self.options || {};

					object.merge(self, prototype);
					// new options requires by keyboard support

					object.merge(options, {
						// "top"|"right"|"bottom"|"left"
						focusDirection: null,
						focusContext: null,
						focusContainerContext: false,
						focusUp: null,
						focusDown: null,
						focusLeft: null,
						focusRight: null,
						focusLock: false
					});

					// widget has keyboard support
					self.isKeyboardSupport = true;

					// prepare selector
					if (selectorsString === "") {
						prepareSelector();
					}
					self._onKeyupHandler = null;
					self._onClickHandler = null;
					self._onHWKeyHandler = null;
					// time of keydown event
					self.keydownEventTimeStart = null; // [ms]
					// flag for keydown event
					self.keydownEventRepeated = false;
				},
				classes = {
					focusDisabled: "ui-focus-disabled",
					focusEnabled: "ui-focus-enabled",
					focusDisabledByWidget: "ui-focus-disabled-by-widget",
					focus: "ui-focus"
				},
				KEY_CODES = {
					left: 37,
					up: 38,
					right: 39,
					down: 40,
					enter: 13,
					tab: 9,
					escape: 27
				},
				activeElement = null,
				EVENT_POSITION = {
					up: "up",
					down: "down",
					left: "left",
					right: "right"
				},
				selectorSuffix = ":not(." + classes.focusDisabled + ")" +
								":not(." + ns.widget.BaseWidget.classes.disable + ")",
				// define standard focus selectors
				// includeDisabled: false - disabled element will be not focusable
				// includeDisabled: true - disabled element will be focusable
				// count - number of defined selectors
				selectors = [{
					value: "a",
					includeDisabled: false,
					count: 1
				}, {
					value: "." + classes.focusEnabled,
					includeDisabled: false,
					count: 1
				}, {
					value: "[tabindex]",
					includeDisabled: false,
					count: 1
				}, {
					value: "[data-focus-lock=true]",
					includeDisabled: false,
					count: 1
				}
				],
				selectorsString = "",
				/**
				* @property {Array} Array containing number of registrations of each selector
				* @member ns.widget.tv.BaseKeyboardSupport
				* @private
				*/
				currentKeyboardWidget,
				lastMoveDirection,
				previousKeyboardWidgets = [],
				ANIMATION_MIN_TIME = 50;

			BaseKeyboardSupport.KEY_CODES = KEY_CODES;
			BaseKeyboardSupport.classes = classes;
			/**
			 * Get focused element.
			 * @method getFocusedLink
			 * @return {HTMLElement}
			 * @private
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			function getFocusedLink() {
				return document.querySelector(":focus") || document.activeElement;
			}

			/**
			 * Test if the key code is a cursor key code
			 * @method isCursorKey
			 * @param {number} key
			 * @return {boolean}
			 * @private
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			function isCursorKey(key) {
				return key === KEY_CODES.left ||
					key === KEY_CODES.right ||
					key === KEY_CODES.up ||
					key === KEY_CODES.down ||
					key === KEY_CODES.enter ||
					key === KEY_CODES.escape;
			}

			/**
			 * Finds all visible links.
			 * @method getFocusableElements
			 * @param {HTMLElement} widgetElement
			 * @param {boolean} visibleOnly select only visible elements
			 * @return {Array}
			 * @private
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			function getFocusableElements(widgetElement, visibleOnly) {
				var focusableElements = [];

				if (!widgetElement) {
					return [];
				}

				focusableElements = slice.call(widgetElement.querySelectorAll(selectorsString));

				if (!visibleOnly) {
					return focusableElements;
				}
				return focusableElements.filter(function (element) {
					return element.offsetWidth && window.getComputedStyle(element).visibility !== "hidden";
				});
			}

			prototype.preventFocusOnElement = function (element) {
				element.classList.add(classes.focusDisabled);
			}

			/**
			 * Method makes focusable element as disabled for focus selection
			 * @method disableFocusableElements
			 * @param {HTMLElement} element parent element for disabled elements
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype.disableFocusableElements = function (element) {
				this.getFocusableElements(element).forEach(function (focusableElement) {
					focusableElement.classList.add(classes.focusDisabled);
					// this class describe that focus on element was disabled by widget, not developer
					focusableElement.classList.add(classes.focusDisabledByWidget);
				});
			}

			/**
			 * Method enables previously disabled the focusable element
			 * @method enableDisabledFocusableElements
			 * @param {HTMLElement} element parent element for disabled elements
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype.enableDisabledFocusableElements = function (element) {
				var disabledFocusableElements;

				if (element) {
					disabledFocusableElements = element.querySelectorAll("." + classes.focusDisabledByWidget);

					slice.call(disabledFocusableElements).forEach(function (focusableElement) {
						focusableElement.classList.remove(classes.focusDisabled);
						// this class describe that focus on element was disabled by widget, not developer
						focusableElement.classList.remove(classes.focusDisabledByWidget);
					});
				}
			}

			/**
			 * Extracts element from offsetObject.
			 * @method mapToElement
			 * @param {Object} linkOffset
			 * @param {HTMLElement} linkOffset.element
			 * @return {HTMLElement}
			 * @private
			 * @static
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			function mapToElement(linkOffset) {
				return linkOffset.element;
			}

			/**
			 * Set string with selector
			 * @method prepareSelector
			 * @private
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			function prepareSelector() {
				var length = selectors.length;

				selectorsString = "";
				utilArray.forEach(selectors, function (object, index) {
					selectorsString += object.value;
					if (!object.includeDisabled) {
						selectorsString += selectorSuffix;
					}
					if (index < length - 1) {
						selectorsString += ",";
					}
				});
			}

			prototype.getActiveSelector = function () {
				return selectorsString;
			};

			BaseKeyboardSupport.copyFocusAttributes = function (widgetInstance, wrapper) {
				var options = widgetInstance.options;

				DOM.setNSDataAttributes(wrapper, {
					focusDirection: options.focusDirection,
					focusContext: options.focusContext,
					focusContainerContext: options.focusContainerContext,
					focusUp: options.focusUp,
					focusDown: options.focusDown,
					focusLeft: options.focusLeft,
					focusRight: options.focusRight
				}, true);
			};

			function getDistanceByCenter(contextRect, referenceElement) {
				var referenceRect = (referenceElement instanceof HTMLElement) ?
						referenceElement.getBoundingClientRect() :
						referenceElement,
					contextCenter = {
						x: contextRect.width / 2 + contextRect.left,
						y: contextRect.height / 2 + contextRect.top
					},
					referenceCenter = {
						x: referenceRect.width / 2 + referenceRect.left,
						y: referenceRect.height / 2 + referenceRect.top
					},
					dy = contextCenter.y - referenceCenter.y,
					dx = contextCenter.x - referenceCenter.x;

				return Math.sqrt(dy * dy + dx * dx);
			}

			function isInLine(contextRect, referenceElement, direction) {
				var a1,
					a2,
					b1,
					b2,
					result = false,
					referenceRect = (referenceElement instanceof HTMLElement) ?
						referenceElement.getBoundingClientRect() :
						referenceElement;

				if (direction === "down" || direction === "up") {
					a1 = referenceRect.left;
					a2 = referenceRect.left + referenceRect.width;
					b1 = contextRect.left;
					b2 = contextRect.left + contextRect.width;
				} else if (direction === "left" || direction === "right") {
					a1 = referenceRect.top;
					a2 = referenceRect.top + referenceRect.height;
					b1 = contextRect.top;
					b2 = contextRect.top + contextRect.height;
				}

				result = ((a1 > b1) && (a1 < b2)) || // at the left
					((a2 > b1) && (a2 < b2)) || // at the right
					// above conditions are applicable also
					// if the context contains the reference element
					((a1 <= b1) && (a2 >= b2)); // content is inside reference element

				return result;
			}

			/**
			 * return angle between two elements
			 * @method getRelativeAngle
			 * @private
			 * @member ns.widget.tv.BaseKeyboardSupport
			 * @param {Object} contextRect
			 * @param {HTMLElement} referenceElement
			 * @return {number}
			 */
			function getRelativeAngle(contextRect, referenceElement) {
				var referenceRect = (referenceElement instanceof HTMLElement) ?
						referenceElement.getBoundingClientRect() :
						referenceElement,
					contextCenter = {
						x: contextRect.width / 2 + contextRect.left,
						y: contextRect.height / 2 + contextRect.top
					},
					referenceCenter = {
						x: referenceRect.width / 2 + referenceRect.left,
						y: referenceRect.height / 2 + referenceRect.top
					},
					dy = contextCenter.y - referenceCenter.y,
					dx = contextCenter.x - referenceCenter.x,
					angle = atan2(-dy, dx) * 180 / PI;

				// determining the angle between the centers of two rectangles
				return angle;
			}

			/**
			 * return direction from angle
			 * @method getDirectionFromAngle
			 * @private
			 * @member ns.widget.tv.BaseKeyboardSupport
			 * @param {number} angle
			 * @param {number} tolerance [0.0 .. 45.0]
			 * @return {string}
			 */
			function getDirectionFromAngle(angle, tolerance) {
				tolerance = tolerance || 0.0;

				if ((abs(angle - 180) < tolerance) || (abs(angle + 180) < tolerance)) {
					return EVENT_POSITION.left;
				} else if (abs(angle - 90) < tolerance) {
					return EVENT_POSITION.up;
				} else if (abs(angle) < tolerance) {
					return EVENT_POSITION.right;
				} else if (abs(angle + 90) < tolerance) {
					return EVENT_POSITION.down;
				}
				return "";
			}

			/**
			 * Compares two numbers and return order for sorting functions
			 * @method getOrder
			 * @param {number} number1
			 * @param {number} number2
			 * @return {number}
			 * @private
			 * @static
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			function getOrder(number1, number2) {
				if (number1 === number2) {
					return 0;
				}
				if (number1 < number2) {
					return -1;
				}
				return 1;
			}

			/**
			 * return direction from origin rect to element rect in movement direction
			 * @param {DOMRect} originRect
			 * @param {DOMRect} elementRect
			 * @param {"top"|"right"|"bottom"|"left"} movementDirection
			 * @return {"top"|"right"|"bottom"|"left"}
			 * @static
			 * @private
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			function getDirection(originRect, elementRect, movementDirection) {
				if (movementDirection === EVENT_POSITION.right &&
					parseInt(originRect.right) <= parseInt(elementRect.left)) {
					return movementDirection;
				}

				if (movementDirection === EVENT_POSITION.left &&
					parseInt(elementRect.right) <= parseInt(originRect.left)) {
					return movementDirection;
				}

				if (movementDirection === EVENT_POSITION.down &&
					parseInt(originRect.bottom) <= parseInt(elementRect.top)) {
					return movementDirection;
				}

				if (movementDirection === EVENT_POSITION.up &&
					parseInt(originRect.top) >= parseInt(elementRect.bottom)) {
					return movementDirection;
				}

				if (elementRect) {
					// tolerance 5 degrees
					return getDirectionFromAngle(getRelativeAngle(elementRect, originRect), 5.0);
				}

				return "";
			}

			/**
			 * Gets distance between two ClientRects
			 * @param {DOMRect} aElementRect
			 * @param {DOMRect} bElementRect
			 * @return {number}
			 * @static
			 * @private
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			function getDistanceLeftTopCorner(aElementRect, bElementRect) {
				var x = aElementRect.left - bElementRect.left,
					y = aElementRect.top - bElementRect.top;

				return sqrt(x * x + y * y) | 0;
			}

			/**
			 * Gets distance between two ClientRects by sides
			 * @param {DOMRect} elementRect
			 * @param {DOMRect} referenceElementRect
			 * @return {Object}
			 * @static
			 * @private
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			function getDistanceBySides(elementRect, referenceElementRect) {
				/*
				 * This values represents distance from reference element to element
				 * at indicated direction:
				 *
				 * example:
				 * =======
				 *
				 *     _ _ _ _
				 *     ^      [element]
				 *     |           ^
				 *     | bottom    | top
				 *     |           |
				 *     |_ [reference element]
				 *
				 *
				 *         _ _ _ _ _ _ _ _ _ _ _ _ [element]
				 *           ^                     |       |
				 *           | top                 |
				 *           |              right  |       |
				 *     [reference element] ------->|
				 *     |                                   |
				 *     |          left
				 *     |---------------------------------->|
				 *
				 * example:
				 * =======
				 *
				 *            _ _ _ _ _ _ _ _ _[reference element]
 				 *             |               |
				 *             | bottom        |
				 *             |               |
				 *             /         left  |
				 *         [element]<----------|
				 *
				 */
				var result = {
					top: referenceElementRect.top - (elementRect.top + elementRect.height) + 0,
					bottom: elementRect.top - referenceElementRect.top - referenceElementRect.height,
					right: elementRect.left - referenceElementRect.left - referenceElementRect.width,
					left: referenceElementRect.left - (elementRect.left + elementRect.width)
				};

				/*
				 * example:
				 * =======
				 *
				 *     [++++++++ element ++++++++]
				 *     |                         |
				 *     |                   left  |
				 *     |               |-------->|
				 *     |
				 *     |<--leftRest----[reference element]
				 *
				 *    Focus on left should takes account also element
				 *    which "leftRest" value is positive
				 *
				 */
				result.leftRest = result.left + elementRect.width;
				result.rightRest = result.right + elementRect.width;
				result.topRest = result.top + elementRect.height;
				result.bottomRest = result.bottom + elementRect.height;
				return result;
			}

			/**
			 * Sorting callback, sorts by distance
			 * @param {Object} a
			 * @param {Object} b
			 * @return {number}
			 * @static
			 * @private
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			function sortByDistanceByCenter(a, b) {
				return (a.distanceByCenter === b.distanceByCenter) ? 0 :
					(a.distanceByCenter < b.distanceByCenter) ? -1 : 1;
			}

			function sortByDistance(a, b) {
				return (a.distanceByDirection.distance === b.distanceByDirection.distance) ?
					sortByDistanceByCenter(a, b) :
						(a.distanceByDirection.distance < b.distanceByDirection.distance) ? -1 : 1;
			}

			function sortByInSideDistanceLimit(a, b) {
				// sort by inSideDistanceLimit
				return (a.inSideDistanceLimit && b.inSideDistanceLimit) ? sortByDistance(a, b) :
						(!a.inSideDistanceLimit && !b.inSideDistanceLimit) ? sortByDistanceByCenter(a, b) :
							(a.inSideDistanceLimit && !b.inSideDistanceLimit) ? -1 : 1;
			}

			/**
			 * Sorting callback, sorts by distance
			 * @param {Object} a
			 * @param {Object} b
			 * @return {number}
			 * @static
			 * @private
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			function sortFocusableElements(a, b) {
				/**
				 * Sort order
				 * - inLine
				 * - inSideDistanceLimit
				 * ---  distanceByDirection.distance
				 * ---  distanceByCenter
				 */
				// sort by inline
				return (a.inLine && b.inLine || !a.inLine && !b.inLine) ? sortByInSideDistanceLimit(a, b) :
					(a.inLine && !b.inLine) ? -1 : 1;
			}

			function getDistanceByDirection(distances, direction) {
				switch (direction) {
					case "left": return {
						distance: distances.left,
						distanceRest: distances.leftRest
					};
					case "right": return {
						distance: distances.right,
						distanceRest: distances.rightRest
					};
					case "up": return {
						distance: distances.top,
						distanceRest: distances.topRest
					};
					case "down": return {
						distance: distances.bottom,
						distanceRest: distances.bottomRest
					};
				}
			}

			/**
			 * Calculates neighborhood links.
			 * @method getNeighborhoodLinks
			 * @param {HTMLElement} element Base element fo find links
			 * @param {HTMLElement} [currentElement] current focused element
			 * @param {Object} [options] Options for function
			 * @param {Function} [options._filterNeighbors] Function used to filtering focusable elements
			 * @param {"top"|"right"|"bottom"|"left"} [options.direction] direction
			 * @return {Object}
			 * @private
			 * @static
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			function getNeighborhoodLinks(element, currentElement, options) {
				var links,
					direction = options.direction,
					currentLink = currentElement || getFocusedLink(),
					customFocus,
					linksOffset = [],
					elementRect = currentLink.getBoundingClientRect(),
					focusableElements = [],
					focusableElement = null,
					focusableElementRect = null,
					distances = {},
					distanceByDirection,
					i = 0,
					l = 0;

				customFocus = (currentLink && fetchCustomFocusElement(currentLink, direction, element));
				if (customFocus) {
					return [customFocus];
				}

				links = getFocusableElements(element, true);

				if (currentLink && currentLink !== document.body) {

					for (i = 0, l = links.length; i < l; ++i) {
						focusableElement = links[i];
						focusableElementRect = focusableElement.getBoundingClientRect();
						distances = getDistanceBySides(focusableElementRect, elementRect);
						distanceByDirection = getDistanceByDirection(distances, direction);
						focusableElements.push({
							element: focusableElement,
							angle: getRelativeAngle(focusableElementRect, elementRect),
							direction: getDirection(elementRect, focusableElementRect, direction),
							distance: getDistanceLeftTopCorner(elementRect, focusableElementRect),
							distanceByDirection: distanceByDirection,
							distanceByCenter: getDistanceByCenter(focusableElementRect, elementRect),
							inLine: isInLine(focusableElementRect, elementRect, direction),
							inSideDistanceLimit: distanceByDirection.distance >= 0 &&
								distanceByDirection.distance < SIDE_DISTANCE_LIMIT
						});
					}

					// remove from list an elements behind move direction
					focusableElements = focusableElements.filter(function (focusableElement) {
						return focusableElement.distanceByDirection.distanceRest > 0;
					});

					focusableElements = focusableElements.filter(function (focusableElement) {
						// corner cases, when element positions overlap
						if (focusableElement.distance === 0) {
							if (direction === EVENT_POSITION.down) {
								return !!(currentLink.compareDocumentPosition(typeof focusableElement === element ? focusableElement : focusableElement.element) &
										Node.DOCUMENT_POSITION_CONTAINED_BY);
							} else if (direction === EVENT_POSITION.up) {
								return !!(currentLink.compareDocumentPosition(typeof focusableElement === element ? focusableElement : focusableElement.element) &
										Node.DOCUMENT_POSITION_PRECEDING);
							}
							return false;
						}
						return focusableElement.direction === direction;
					});

					// This sort method is major action to make order in the moving of focus
					focusableElements = focusableElements.sort(sortFocusableElements).map(mapToElement);

					// return result;
					return focusableElements;
				}
				linksOffset = utilArray.map(links, function (link) {
					var linkOffset = link.getBoundingClientRect();

					return {
						offset: linkOffset,
						element: link,
						width: link.offsetWidth,
						height: link.offsetHeight
					};
				});
				return utilArray.map(linksOffset.sort(function (linkOffset1, linkOffset2) {
					// every sort function *must* return 0 on equal elements to prevent
					// changing of input order
					if (linkOffset1.offset.top === linkOffset2.offset.top) {
						return getOrder(linkOffset1.offset.left, linkOffset2.offset.left);
					}
					return getOrder(linkOffset1.offset.top, linkOffset2.offset.top);
				}), mapToElement);
			}

			/**
			 * This method triggers 'blur' event on widget or html element
			 * @method blurOnActiveElement
			 * @param {Object} options
			 * @static
			 * @memberof ns.widget.tv.BaseKeyboardSupport
			 */
			function blurOnActiveElement(options) {
				var currentElement,
					preventDefault,
					currentWidget

				options = options || {};
				currentElement = options.current || activeElement || getFocusedLink();

				// and blur the previous one
				if (currentElement) {
					currentWidget = engine.getBinding(currentElement);
					if (currentWidget) {
						currentWidget.blur(options);
					} else {
						options.element = currentElement;
						preventDefault = !eventUtils.trigger(currentElement, "taublur", options);
						if (!preventDefault) {
							currentElement.classList.remove(classes.focus);
							currentElement.blur();
						}
					}
					// set active element to null;
					activeElement = null;
				}
			}

			/**
			 * Method trying to focus on widget or on HTMLElement and blur on active element or widget.
			 * @method focusOnElement
			 * @param {?ns.widget.BaseWidget} self
			 * @param {HTMLElement} element
			 * @param {Object} [options]
			 * @return  {boolean} Return true if focus finished success
			 * @static
			 * @private
			 * @memberof ns.widget.tv.BaseKeyboardSupport
			 */
			function focusOnElement(self, element, options) {
				var setFocus,
					currentElement = options.current || activeElement || getFocusedLink(),
					nextElementWidget,
					lockedElement = element && selectorUtils.getClosestBySelectorNS(element.parentNode, "focus-lock=true"),
					lockedWidget = (lockedElement && engine.getBinding(lockedElement)) || null,
					preventDefault;

				if (lockedWidget && lockedWidget !== currentKeyboardWidget) {
					return false;
				}

				options = options || {};
				nextElementWidget = engine.getBinding(element);

				if (nextElementWidget) {
					// we call function focus if the element is connected with widget
					options.previousElement = currentElement;
					setFocus = nextElementWidget.focus(options);
					blurOnActiveElement(options);
				} else {
					if (element !== currentElement) {
						options.previousElement = currentElement;
						// or only set focus on element
						// for mouse is possible to focus on null element
						if (element) {
							options.element = element;
							preventDefault = !eventUtils.trigger(element, "taufocus", options);
							if (!preventDefault) {
								element.classList.add(classes.focus);
								element.focus();
							}
						}
						// and blur the previous one
						blurOnActiveElement(options);
						setFocus = true;
					}
				}

				// The currently focused element becomes active
				// We need this for proper focus locking
				activeElement = element;

				if (self) {
					if (self._openActiveElement) {
						self._openActiveElement(element);
					}
				}

				return setFocus;
			}

			/**
			 * @method blurOnActiveElement
			 */
			prototype.blurOnActiveElement = blurOnActiveElement;

			/**
			 * Tries to fetch custom focus attributes and move to the specified element
			 * @param {HTMLElement} element
			 * @param {string} direction
			 * @param {HTMLElement} [queryContext=undefined]
			 * @method fetchCustomFocusElement
			 * @private
			 * @static
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			function fetchCustomFocusElement(element, direction, queryContext) {
				var selector = element.getAttribute("data-focus-" + direction),
					eventData = {
						selector: selector,
						direction: direction,
						currentElement: element,
						nextElement: null
					},
					useQueryContext = element.getAttribute("data-focus-container-context") === "true",
					customQueryContextSelector = element.getAttribute("data-focus-context");

				if (selector) {
					// notify observers about custom query for focus element
					// observers can catch the event and choose their own elements
					// this supports customSelectors like ::virtualgrid-* which
					// is implemented in virtualgrid, if the event was not consumed
					// assume normal selector
					if (eventUtils.trigger(element, "focusquery", eventData, true, true)) {
						if (useQueryContext) {
							if (customQueryContextSelector) {
								queryContext = document.querySelector(customQueryContextSelector);
							}
							if (queryContext) {
								return queryContext.parentNode.querySelector(selector);
							}
						}
						return element.parentNode.querySelector(selector);
					}
					// if some code managed to fill nextElement use it
					if (eventData.nextElement) {
						return eventData.nextElement;
					}
				}

				return null;
			}

			/**
			 * Locks focus on element if possible
			 * @param {ns.widget.tv.BaseKeyboardSupport} self
			 * @param {HTMLElement} element
			 * @return {boolean}
			 * @private
			 * @static
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			function lockFocus(self, element) {
				var widget = null;

				if (DOM.getNSData(element, "focus-lock") === true) {
					widget = engine.getBinding(element);
					if (widget && widget !== currentKeyboardWidget) {
						widget.saveKeyboardSupport();
						widget.enableKeyboardSupport();
						widget.blur();
						focusOnNeighborhood(self, element, {direction: lastMoveDirection, key: KEY_CODES.down});
						return true;
					}
				}
				return false;
			}

			/**
			 * Unlocks focus from element if possible
			 * @param {ns.widget.tv.BaseKeyboardSupport} self
			 * @param {HTMLElement} element
			 * @return {boolean}
			 * @private
			 * @static
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			function unlockFocus(self, element) {
				var widget;
				// enable escape from children (usability)

				if (DOM.getNSData(element, "focus-lock") !== true) {
					element = selectorUtils.getClosestBySelectorNS(element.parentNode, "focus-lock=true");
					if (!element) {
						return false;
					}
				}
				widget = engine.getBinding(element);
				if (widget && widget === currentKeyboardWidget) {
					widget.disableKeyboardSupport();
					widget.restoreKeyboardSupport();
					focusOnElement(self, element, {direction: lastMoveDirection, key: KEY_CODES.down});
					return true;
				}

				return false;
			}

			function focusOnNeighborhood(self, element, options) {
				var positionFrom = "",
					nextElements = [],
					nextElement,
					nextNumber = 0,
					current = options.current,
					event = options.event,
					widget,
					setFocus = false;

				switch (options.key) {
					case KEY_CODES.left:
						positionFrom = EVENT_POSITION.left;
						break;
					case KEY_CODES.up:
						positionFrom = EVENT_POSITION.up;
						break;
					case KEY_CODES.right:
						positionFrom = EVENT_POSITION.right;
						break;
					case KEY_CODES.down:
						positionFrom = EVENT_POSITION.down;
						break;
					case KEY_CODES.enter:
						// @TODO context enter
						if (current) {
							if (lockFocus(self, current)) {
								if (event) {
									event.preventDefault();
									event.stopImmediatePropagation();
								}
							} else {
								widget = ns.engine.getBinding(current);
								if (widget && typeof widget._actionEnter === "function") {
									widget._actionEnter(current);
								}
							}
							return;
						}
						break;
					case KEY_CODES.escape:
						// this also is done by hwkey
						if (current) {
							if (unlockFocus(self, current)) {
								if (event) {
									event.preventDefault();
									event.stopImmediatePropagation();
								}
							} else {
								widget = ns.engine.getBinding(current);
								if (widget && typeof widget._actionEscape === "function") {
									widget._actionEscape(current);
								}
							}
							return;
						}
						break;
					default:
						return;
				}

				options.direction = options.direction || positionFrom;
				if (positionFrom) {
					lastMoveDirection = positionFrom;
				}

				nextElement = fetchCustomFocusElement(element, positionFrom);

				if (!nextElement) {
					nextElements = getNeighborhoodLinks(element, current, options);
					nextElement = nextElements[nextNumber];
				}

				if (options._last) {
					// we are looking for element to focus from the farthest to the nearest
					nextNumber = nextElements.length - 1;
					nextElement = nextElements[nextNumber];
					while (nextElement && !setFocus) {
						// if element to focus is found
						setFocus = focusOnElement(self, nextElement, options);
						nextElement = nextElements[--nextNumber];
					}
				} else {
					// we are looking for element to focus from the nearest
					nextNumber = 0;
					nextElement = nextElements[nextNumber];
					if (nextElement) {
						while (nextElement && !setFocus) {
							// if element to focus is found
							setFocus = focusOnElement(self, nextElement, options);
							nextElement = nextElements[++nextNumber];
						}
					} else {
						eventUtils.trigger(
							// if current element is not parent of current element
							// then we cannot trigger event on current element
							// eg. current page doesn't have any focusable element
							//     and current focusable element is on previous page
							//     in this case event has to be trigger on current page
							//     not on previous page
							DOM.isChildElementOf(current, element) ? current : element,
							"taufocusborder",
							options
						);
					}
				}
			}

			/**
			 * Supports keyboard event.
			 * @method _onKeyup
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype._onKeyup = function (event) {
				var self = this,
					keyboardSupportState = ns.getConfig("keyboardSupport", false);

				if (keyboardSupportState && self._supportKeyboard) {
					if (!self.keydownEventRepeated) {
						// short press was detected
						self._onShortPress(event);
					}
					self.keydownEventTimeStart = null;
					self.keydownEventRepeated = false;
				}
			};

			/**
			 * Mouse move listener
			 * @method _onMouseMove
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype._onMouseMove = function (event) {
				var self = this,
					// we finding element on current position
					target = document.elementFromPoint(event.pageX, event.pageY),
					keyboardSupportState = ns.getConfig("keyboardSupport", false),
					element = null,
					currentElement = activeElement,
					fromPosition = EVENT_POSITION.down;

				if (keyboardSupportState && self._supportKeyboard) {
					// check matching or find matching parent
					element = selectorUtils.getClosestBySelector(target, selectorsString);

					if (element !== currentElement) {
						if (currentElement) {
							fromPosition = getDirectionFromAngle(
								getRelativeAngle({
									left: event.pageX,
									top: event.pageY
								}, currentElement)
							);
						} else {
							// if we not have currently focused element we calculate move direction
							// in compare with previous mouse position
							fromPosition = getDirectionFromAngle(
								getRelativeAngle({
									left: event.pageX,
									top: event.pageY
								}, {
									left: event.pageX - event.movementX,
									top: event.pageY - event.movementY
								})
							);
						}

						focusOnElement(self, element, {
							direction: fromPosition
						});
					}
				}
			};

			/**
			 * This function is used as a filtering function in function getNeighborhoodLinks.
			 * @method _onKeyup
			 * @param {string} direction
			 * @param {Object} filteredElement Information about element, which is being already filtered.
			 * @param {HTMLElement} element Current element
			 * @param {Object} [elementOffset] Offset of current element
			 * @private
			 * @static
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			function filterNeighbors(direction, filteredElement, element, elementOffset) {
				var filteredElementOffset = filteredElement.offset,
					filteredElementHeight = filteredElement.height,
					filteredElementWidth = filteredElement.width,
					elementHeight = element.offsetHeight,
					elementWidth = element.offsetWidth;

				elementOffset = elementOffset || element.getBoundingClientRect();
				switch (direction) {
					case "top":
						// we are looking for elements, which are above the current element, but
						// only in the same column
						if (elementOffset.left >= filteredElementOffset.left + filteredElementWidth ||
							elementOffset.left + elementWidth <= filteredElementOffset.left) {
							// if element is on the right or on the left of the current element,
							// we remove it from the set
							return false;
						}
						return filteredElementOffset.top < elementOffset.top;
					case "bottom":
						// we are looking for elements, which are under the current element, but
						// only in the same column
						if (elementOffset.left >= filteredElementOffset.left + filteredElementWidth ||
							elementOffset.left + elementWidth <= filteredElementOffset.left) {
							return false;
						}
						return filteredElementOffset.top >= elementOffset.bottom;
					case "left":
						// we are looking for elements, which are on the left of the current element, but
						// only in the same row
						if (elementOffset.top >= filteredElementOffset.top + filteredElementHeight ||
							elementOffset.top + elementHeight <= filteredElementOffset.top) {
							return false;
						}
						return filteredElementOffset.left < elementOffset.left;
					case "right":
						// we are looking for elements, which are ont the right of the current element, but
						// only in the same row
						if (elementOffset.top >= filteredElementOffset.top + filteredElementHeight ||
							elementOffset.top + elementHeight <= filteredElementOffset.top) {
							return false;
						}
						return filteredElementOffset.left >= elementOffset.right;
				}
				return false;
			}

			prototype._onHWKey = function (event) {
				var self = this,
					current = activeElement || getFocusedLink();

				if (event.keyName === "back" && current && unlockFocus(self, current)) {
					event.preventDefault();
					event.stopImmediatePropagation();
					return true;
				}

				return false;
			};

			/**
			 * Supports keyboard long press event.
			 * It is called on keydown event, when the long press was not detected.
			 * @method _onLongPress
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype._onLongPress = function (event) {
				var self = this,
					delay = ns.getConfig("keyboardLongpressInterval", 100),
					options = {
						current: activeElement || getFocusedLink(),
						key: event.keyCode,
						// it is repeated event, so we make animation shorter
						duration: ((delay - 30) >= ANIMATION_MIN_TIME ? delay - 30 : ANIMATION_MIN_TIME),
						_last: true, // option for function focusOnNeighborhood
						_filterNeighbors: filterNeighbors // option for function getNeighborhoodLinks
					};

				// set focus on next element
				focusOnNeighborhood(self, self.keyboardElement || self.element, options);
			};

			/**
			 * Supports keyboard short press event.
			 * It is called on keyup event, when the long press was not detected.
			 * @method _onShortPress
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype._onShortPress = function (event) {
				var self = this;

				if (!ns.getConfig("keyboardSupport", false)) {
					return false;
				}

				// set focus on next element
				focusOnNeighborhood(self, self.keyboardElement || self.element, {
					current: activeElement || getFocusedLink(),
					event: event,
					key: event.keyCode
				});
			};

			/**
			 * Supports keyboard event.
			 * @method _onKeydown
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype._onKeydown = function (event) {
				var self = this,
					delay = ns.getConfig("keyboardLongpressInterval", 1000),
					keyboardSupportState = ns.getConfig("keyboardSupport", false),
					currentTime;

				// if widget supports keyboard's events
				if (keyboardSupportState && self._supportKeyboard && isCursorKey(event.keyCode)) {
					// stop scrolling
					event.preventDefault();
					event.stopPropagation();

					currentTime = Date.now();
					// we check if it is a single event or repeated one
					// @note: On TV property .repeat for event is not available, so we have to count time
					//        between events
					if (!self.keydownEventTimeStart || (currentTime - self.keydownEventTimeStart > delay)) {
						// stop scrolling
						//event.preventDefault();
						//event.stopPropagation();

						// if it is repeated event, we make animation shorter
						if (self.keydownEventTimeStart) {
							// long press was detected
							self._onLongPress(event);
							self.keydownEventRepeated = true;
						}
						self.keydownEventTimeStart = currentTime;
					}
				}
			};

			/**
			 * Add Supports keyboard event.
			 *
			 * This method should be called in _bindEvent method in widget.
			 * @method _bindEventKey
			 * @protected
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype._bindEventKey = function () {
				var self = this;

				if (!self._onKeyupHandler) {
					self._onKeyupHandler = self._onKeyup.bind(self);
					self._onKeydownHandler = self._onKeydown.bind(self);
					self._onHWKeyHandler = self._onHWKey.bind(self);
					document.addEventListener("keyup", self._onKeyupHandler, false);
					document.addEventListener("keydown", self._onKeydownHandler, false);
					document.addEventListener("tizenhwkey", self._onHWKeyHandler, false);
				}
			};

			/**
			 * Adds support for mouse events
			 * @method _bindEventMouse
			 * @protected
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype._bindEventMouse = function () {
				var self = this;

				if (!self._onMouseMoveHandler) {
					self._onMouseMoveHandler = self._onMouseMove.bind(self);
					//we resign from virtual events because of problems with enter event
					document.addEventListener("mousemove", self._onMouseMoveHandler, false);
				}
			};

			/**
			 * Supports keyboard event.
			 *
			 * This method should be called in _destroy method in widget.
			 * @method _destroyEventKey
			 * @protected
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype._destroyEventKey = function () {
				if (this._onKeyupHandler) {
					document.removeEventListener("keyup", this._onKeyupHandler, false);
					document.removeEventListener("keydown", this._onKeydownHandler, false);
					document.removeEventListener("tizenhwkey", this._onHWKeyHandler, false);
					this._onKeyupHandler = null;
				}
			};

			/**
			 * Removes support for mouse events
			 * @method _destroyEventMouse
			 * @protected
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype._destroyEventMouse = function () {
				if (this._onClickHandler) {
					//we resign from virtual events because of problems with enter event
					document.removeEventListener("mousemove", this._onMouseMoveHandler, false);
				}
			};

			/**
			 * Blurs from focused element.
			 * @method blur
			 * @static
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			BaseKeyboardSupport.blurAll = function () {
				var focusedElement = activeElement || getFocusedLink(),
					focusedElementWidget = focusedElement && engine.getBinding(focusedElement);

				if (focusedElementWidget) {
					// call blur on widget
					focusedElementWidget.blur();
				} else if (focusedElement) {
					// or call blur on element
					focusedElement.blur();
				}
			};

			/**
			 * Focuses on element.
			 * @method focusElement
			 * @param {HTMLElement} [element] widget's element
			 * @param {?HTMLElement|number|boolean|string} [elementToFocus] element to focus
			 * @param {Object} [options]
			 * @static
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			BaseKeyboardSupport.focusElement = function (element, elementToFocus, options) {
				var links,
					linksLength,
					i;

				options = options || {};
				if (options.current === undefined) {
					options.current = getFocusedLink();
				}

				if (elementToFocus instanceof HTMLElement) {
					if (element) {
						links = getFocusableElements(element, true);
						linksLength = links.length;
						for (i = 0; i < linksLength; i++) {
							if (links[i] === elementToFocus) {
								elementToFocus.focus();
							}
						}
					} else {
						elementToFocus.focus();
					}
				} else if (typeof elementToFocus === "number") {
					links = getFocusableElements(element, true);
					if (links[elementToFocus]) {
						focusOnElement(null, links[elementToFocus], options);
					}
				} else if (typeof elementToFocus === "string" && KEY_CODES[elementToFocus]) {
					options.direction = KEY_CODES[elementToFocus];
					focusOnNeighborhood(null, element, options);
				} else {
					links = getFocusableElements(element, true);
					if (links[0]) {
						focusOnElement(null, links[0], options);
					}
				}
			};

			/**
			 * Enables keyboard support on widget.
			 * @method enableKeyboardSupport
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype.enableKeyboardSupport = function () {
				this._supportKeyboard = true;
				currentKeyboardWidget = this;
			};

			/**
			 * Enables keyboard support on widget.
			 * @method restoreKeyboardSupport
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype.restoreKeyboardSupport = function () {
				var previousKeyboardWidget = previousKeyboardWidgets.pop();

				if (previousKeyboardWidget) {
					previousKeyboardWidget.enableKeyboardSupport();
				}
			};

			/**
			 * Disables keyboard support on widget.
			 * @method disableKeyboardSupport
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype.disableKeyboardSupport = function () {
				currentKeyboardWidget = null;
				this._supportKeyboard = false;
			};

			/**
			 * Save history of keyboard support on widget.
			 * @method saveKeyboardSupport
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			prototype.saveKeyboardSupport = function () {
				if (currentKeyboardWidget) {
					previousKeyboardWidgets.push(currentKeyboardWidget);
					currentKeyboardWidget.disableKeyboardSupport();
				}
			};

			/**
			 * Convert selector object to string
			 * @method getValueOfSelector
			 * @param {Object} selectorObject
			 * @static
			 * @private
			 * @return {string}
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			function getValueOfSelector(selectorObject) {
				return selectorObject.value;
			}

			/**
			 * Find index in selectors array for given selector
			 * @method findSelectorIndex
			 * @param {string} selector
			 * @static
			 * @private
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			function findSelectorIndex(selector) {
				return utilArray.map(selectors, getValueOfSelector).indexOf(selector);
			}

			/**
 			 * @method getFocusableElements
			 */
			prototype.getFocusableElements = getFocusableElements;

			/**
			 * Registers an active selector.
			 * @param {string} selector
			 * @param {boolean} includeDisabled
			 * @method registerActiveSelector
			 * @static
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			BaseKeyboardSupport.registerActiveSelector = function (selector, includeDisabled) {
				var selectorArray = selector.split(","),
					index;

				utilArray.forEach(selectorArray, function (currentSelector) {
					currentSelector = currentSelector.trim();
					index = findSelectorIndex(currentSelector);

					// check if not registered yet
					if (index === -1) {
						selectors.push({
							value: currentSelector,
							includeDisabled: includeDisabled,
							count: 1
						});
					} else {
						selectors[index].count++;
					}
				});

				prepareSelector();
			};

			/**
			 * Unregister an active selector.
			 * @param {string} selector
			 * @method unregisterActiveSelector
			 * @static
			 * @member ns.widget.tv.BaseKeyboardSupport
			 */
			BaseKeyboardSupport.unregisterActiveSelector = function (selector) {
				var selectorArray = selector.split(","),
					index;

				utilArray.forEach(selectorArray, function (currentSelector) {
					currentSelector = currentSelector.trim();
					index = findSelectorIndex(currentSelector);

					if (index !== -1) {
						--selectors[index].count;
						// check reference counter
						if (selectors[index].count === 0) {
							// remove selector
							selectors.splice(index, 1);
						}
					}
				});

				prepareSelector();
			};

			ns.widget.core.BaseKeyboardSupport = BaseKeyboardSupport;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.BaseKeyboardSupport;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
