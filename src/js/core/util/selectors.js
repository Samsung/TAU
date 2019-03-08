/*global define: false, window: false, ns: false */
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
 * #Selectors Utility
 * Object contains functions to get HTML elements by different selectors.
 * @class ns.util.selectors
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@partner.samsung.com>
 * @author Damian Osipiuk <d.osipiuk@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			// fetch namespace
			"../util"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * @method slice Alias for array slice method
			 * @member ns.util.selectors
			 * @private
			 * @static
			 */
			var slice = [].slice,
				/**
				 * @method matchesSelectorType
				 * @return {string|boolean}
				 * @member ns.util.selectors
				 * @private
				 * @static
				 */
				matchesSelectorType = (function () {
					var el = document.createElement("div");

					if (typeof el.webkitMatchesSelector === "function") {
						return "webkitMatchesSelector";
					}

					if (typeof el.mozMatchesSelector === "function") {
						return "mozMatchesSelector";
					}

					if (typeof el.msMatchesSelector === "function") {
						return "msMatchesSelector";
					}

					if (typeof el.matchesSelector === "function") {
						return "matchesSelector";
					}

					if (typeof el.matches === "function") {
						return "matches";
					}

					return "";
				}());

			/**
			 * Prefix selector with 'data-' and namespace if present
			 * @method getDataSelector
			 * @param {string} selector
			 * @return {string}
			 * @member ns.util.selectors
			 * @private
			 * @static
			 */
			function getDataSelector(selector) {
				var namespace = ns.getConfig("namespace");

				return "[data-" + (namespace ? namespace + "-" : "") + selector + "]";
			}

			/**
			 * Runs matches implementation of matchesSelector
			 * method on specified element
			 * @method matchesSelector
			 * @param {HTMLElement} element
			 * @param {string} selector
			 * @return {boolean}
			 * @static
			 * @member ns.util.selectors
			 */
			function matchesSelector(element, selector) {
				if (matchesSelectorType && element[matchesSelectorType]) {
					return element[matchesSelectorType](selector);
				}
				return false;
			}

			/**
			 * Return array with all parents of element.
			 * @method parents
			 * @param {HTMLElement} element
			 * @return {Array}
			 * @member ns.util.selectors
			 * @private
			 * @static
			 */
			function parents(element) {
				var items = [],
					current = element.parentNode;

				while (current && current !== document) {
					items.push(current);
					current = current.parentNode;
				}
				return items;
			}

			/**
			 * Checks if given element and its ancestors matches given function
			 * @method closest
			 * @param {HTMLElement} element
			 * @param {Function} testFunction
			 * @return {?HTMLElement}
			 * @member ns.util.selectors
			 * @static
			 * @private
			 */
			function closest(element, testFunction) {
				var current = element;

				while (current && current !== document) {
					if (testFunction(current)) {
						return current;
					}
					current = current.parentNode;
				}
				return null;
			}

			/**
			 * @method testSelector
			 * @param {string} selector
			 * @param {HTMLElement} node
			 * @return {boolean}
			 * @member ns.util.selectors
			 * @static
			 * @private
			 */
			function testSelector(selector, node) {
				return matchesSelector(node, selector);
			}

			/**
			 * @method testClass
			 * @param {string} className
			 * @param {HTMLElement} node
			 * @return {boolean}
			 * @member ns.util.selectors
			 * @static
			 * @private
			 */
			function testClass(className, node) {
				return node && node.classList && node.classList.contains(className);
			}

			/**
			 * @method testTag
			 * @param {string} tagName
			 * @param {HTMLElement} node
			 * @return {boolean}
			 * @member ns.util.selectors
			 * @static
			 * @private
			 */
			function testTag(tagName, node) {
				return node.tagName.toLowerCase() === tagName;
			}

			/**
			 * @class ns.util.selectors
			 */
			ns.util.selectors = {
				matchesSelector: matchesSelector,

				/**
				 * Return array with children pass by given selector.
				 * @method getChildrenBySelector
				 * @param {HTMLElement} context
				 * @param {string} selector
				 * @return {Array}
				 * @static
				 * @member ns.util.selectors
				 */
				getChildrenBySelector: function (context, selector) {
					return slice.call(context.children).filter(testSelector.bind(null, selector));
				},

				/**
				 * Return array with children pass by given data-namespace-selector.
				 * @method getChildrenByDataNS
				 * @param {HTMLElement} context
				 * @param {string} dataSelector
				 * @return {Array}
				 * @static
				 * @member ns.util.selectors
				 */
				getChildrenByDataNS: function (context, dataSelector) {
					return slice.call(context.children).filter(testSelector.bind(null,
						getDataSelector(dataSelector)));
				},

				/**
				 * Return array with children with given class name.
				 * @method getChildrenByClass
				 * @param {HTMLElement} context
				 * @param {string} className
				 * @return {Array}
				 * @static
				 * @member ns.util.selectors
				 */
				getChildrenByClass: function (context, className) {
					return slice.call(context.children).filter(testClass.bind(null, className));
				},

				/**
				 * Return array with children with given tag name.
				 * @method getChildrenByTag
				 * @param {HTMLElement} context
				 * @param {string} tagName
				 * @return {Array}
				 * @static
				 * @member ns.util.selectors
				 */
				getChildrenByTag: function (context, tagName) {
					return slice.call(context.children).filter(testTag.bind(null, tagName));
				},

				/**
				 * Return array with all parents of element.
				 * @method getParents
				 * @param {HTMLElement} context
				 * @param {string} selector
				 * @return {Array}
				 * @static
				 * @member ns.util.selectors
				 */
				getParents: parents,

				/**
				 * Return array with all parents of element pass by given selector.
				 * @method getParentsBySelector
				 * @param {HTMLElement} context
				 * @param {string} selector
				 * @return {Array}
				 * @static
				 * @member ns.util.selectors
				 */
				getParentsBySelector: function (context, selector) {
					return parents(context).filter(testSelector.bind(null, selector));
				},

				/**
				 * Return array with all parents of element pass by given selector with namespace.
				 * @method getParentsBySelectorNS
				 * @param {HTMLElement} context
				 * @param {string} selector
				 * @return {Array}
				 * @static
				 * @member ns.util.selectors
				 */
				getParentsBySelectorNS: function (context, selector) {
					return parents(context).filter(testSelector.bind(null, getDataSelector(selector)));
				},

				/**
				 * Return array with all parents of element with given class name.
				 * @method getParentsByClass
				 * @param {HTMLElement} context
				 * @param {string} className
				 * @return {Array}
				 * @static
				 * @member ns.util.selectors
				 */
				getParentsByClass: function (context, className) {
					return parents(context).filter(testClass.bind(null, className));
				},

				/**
				 * Return array with all parents of element with given tag name.
				 * @method getParentsByTag
				 * @param {HTMLElement} context
				 * @param {string} tagName
				 * @return {Array}
				 * @static
				 * @member ns.util.selectors
				 */
				getParentsByTag: function (context, tagName) {
					return parents(context).filter(testTag.bind(null, tagName));
				},

				/**
				 * Return first element from parents of element pass by selector.
				 * @method getClosestBySelector
				 * @param {HTMLElement} context
				 * @param {string} selector
				 * @return {HTMLElement}
				 * @static
				 * @member ns.util.selectors
				 */
				getClosestBySelector: function (context, selector) {
					return closest(context, testSelector.bind(null, selector));
				},

				/**
				 * Return first element from parents of element pass by selector with namespace.
				 * @method getClosestBySelectorNS
				 * @param {HTMLElement} context
				 * @param {string} selector
				 * @return {HTMLElement}
				 * @static
				 * @member ns.util.selectors
				 */
				getClosestBySelectorNS: function (context, selector) {
					return closest(context, testSelector.bind(null, getDataSelector(selector)));
				},

				/**
				 * Return first element from parents of element with given class name.
				 * @method getClosestByClass
				 * @param {HTMLElement} context
				 * @param {string} selector
				 * @return {HTMLElement}
				 * @static
				 * @member ns.util.selectors
				 */
				getClosestByClass: function (context, selector) {
					return closest(context, testClass.bind(null, selector));
				},

				/**
				 * Return first element from parents of element with given tag name.
				 * @method getClosestByTag
				 * @param {HTMLElement} context
				 * @param {string} selector
				 * @return {HTMLElement}
				 * @static
				 * @member ns.util.selectors
				 */
				getClosestByTag: function (context, selector) {
					return closest(context, testTag.bind(null, selector));
				},

				/**
				 * Return array of elements from context with given data-selector
				 * @method getAllByDataNS
				 * @param {HTMLElement} context
				 * @param {string} dataSelector
				 * @return {Array}
				 * @static
				 * @member ns.util.selectors
				 */
				getAllByDataNS: function (context, dataSelector) {
					return slice.call(context.querySelectorAll(getDataSelector(dataSelector)));
				},

				/**
				 * Get scrollable parent element
				 * @method getScrollableParent
				 * @param {HTMLElement} element
				 * @return {HTMLElement}
				 * @static
				 * @member ns.util.selectors
				 */
				getScrollableParent: function (element) {
					var overflow,
						style;

					while (element && element !== document.body) {
						style = window.getComputedStyle(element);

						if (style) {
							overflow = style.getPropertyValue("overflow-y");
							if (overflow === "scroll" || (overflow === "auto" &&
								element.scrollHeight > element.clientHeight)) {
								return element;
							}
						}
						element = element.parentNode;
					}
					return null;
				}
			};
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.util.selectors;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
