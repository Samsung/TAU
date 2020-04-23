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
/*global window, ns, define */
/*
 * @author Jadwiga Sosnowska <j.sosnowska@partner.samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../DOM",
			"../string"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var DOM = ns.util.DOM,
				stringUtil = ns.util.string,
				appStyleSheet;

			/**
			 * Returns css property for element
			 * @method getCSSProperty
			 * @param {HTMLElement} element
			 * @param {string} property
			 * @param {string|number|null} [def=null] default returned value
			 * @param {"integer"|"float"|null} [type=null] auto type casting
			 * @return {string|number|null}
			 * @member ns.util.DOM
			 * @static
			 */
			function getCSSProperty(element, property, def, type) {
				var style = window.getComputedStyle(element),
					value,
					result = def;

				if (style) {
					value = style.getPropertyValue(property);
					if (value) {
						switch (type) {
							case "integer":
								value = parseInt(value, 10);
								if (!isNaN(value)) {
									result = value;
								}
								break;
							case "float":
								value = parseFloat(value);
								if (!isNaN(value)) {
									result = value;
								}
								break;
							default:
								result = value;
								break;
						}
					}
				}
				return result;
			}

			/**
			 * Convert string to float or integer
			 * @param {string} value
			 * @return {number}
			 */
			function convertToNumber(value) {
				if ((value + "").indexOf(".") > -1) {
					return parseFloat(value);
				}
				return parseInt(value, 10);
			}

			/**
			 * Extracts css properties from computed css for an element.
			 * The properties values are applied to the specified
			 * properties list (dictionary)
			 * @method extractCSSProperties
			 * @param {HTMLElement} element
			 * @param {Object} properties
			 * @param {?string} [pseudoSelector=null]
			 * @param {boolean} [noConversion=false]
			 * @member ns.util.DOM
			 * @static
			 */
			function extractCSSProperties(element, properties, pseudoSelector, noConversion) {
				var style = window.getComputedStyle(element, pseudoSelector),
					property,
					value,
					newValue;

				for (property in properties) {
					if (properties.hasOwnProperty(property)) {
						value = style.getPropertyValue(property);
						newValue = convertToNumber(value);

						if (!isNaN(newValue) || !noConversion) {
							value = newValue;
						}

						properties[property] = value;
					}
				}
			}

			function getOffset(element, props, pseudoSelector, force, offsetProperty) {
				var originalDisplay,
					originalVisibility,
					originalPosition,
					offsetValue,
					style = element.style;

				if (style.display !== "none") {
					extractCSSProperties(element, props, pseudoSelector, true);
					offsetValue = element[offsetProperty];
				} else if (force) {
					originalDisplay = style.display;
					originalVisibility = style.visibility;
					originalPosition = style.position;

					style.display = "block";
					style.visibility = "hidden";
					style.position = "relative";

					extractCSSProperties(element, props, pseudoSelector, true);
					offsetValue = element[offsetProperty];

					style.display = originalDisplay;
					style.visibility = originalVisibility;
					style.position = originalPosition;
				}
				return offsetValue;
			}

			/**
			 * Returns elements height from computed style
			 * @method getElementHeight
			 * @param {HTMLElement} element
			 * if null then the "inner" value is assigned
			 * @param {"outer"|null} [type=null]
			 * @param {boolean} [includeOffset=false]
			 * @param {boolean} [includeMargin=false]
			 * @param {?string} [pseudoSelector=null]
			 * @param {boolean} [force=false] check even if element is hidden
			 * @return {number}
			 * @member ns.util.DOM
			 * @static
			 */
			function getElementHeight(element, type, includeOffset, includeMargin, pseudoSelector, force) {
				var height = 0,
					outer = (type && type === "outer") || false,
					offsetHeight,
					property,
					props = {
						"height": 0,
						"margin-top": 0,
						"margin-bottom": 0,
						"padding-top": 0,
						"padding-bottom": 0,
						"border-top-width": 0,
						"border-bottom-width": 0,
						"box-sizing": ""
					};

				if (element) {
					offsetHeight = getOffset(element, props, pseudoSelector, force, "offsetHeight");

					for (property in props) {
						if (props.hasOwnProperty(property) && property !== "box-sizing") {
							props[property] = convertToNumber(props[property]);
						}
					}

					height += props["height"];

					if (props["box-sizing"] !== "border-box") {
						height += props["padding-top"] + props["padding-bottom"];
					}

					if (includeOffset) {
						height = offsetHeight;
					} else if (outer && props["box-sizing"] !== "border-box") {
						height += props["border-top-width"] + props["border-bottom-width"];
					}

					if (includeMargin) {
						height += Math.max(0, props["margin-top"]) + Math.max(0, props["margin-bottom"]);
					}
				}
				return height;
			}

			/**
			 * Returns elements width from computed style
			 * @method getElementWidth
			 * @param {HTMLElement} element
			 * if null then the "inner" value is assigned
			 * @param {"outer"|null} [type=null]
			 * @param {boolean} [includeOffset=false]
			 * @param {boolean} [includeMargin=false]
			 * @param {?string} [pseudoSelector=null]
			 * @param {boolean} [force=false] check even if element is hidden
			 * @return {number}
			 * @member ns.util.DOM
			 * @static
			 */
			function getElementWidth(element, type, includeOffset, includeMargin, pseudoSelector, force) {
				var width = 0,
					value,
					offsetWidth,
					property,
					outer = (type && type === "outer") || false,
					props = {
						"width": 0,
						"margin-left": 0,
						"margin-right": 0,
						"padding-left": 0,
						"padding-right": 0,
						"border-left-width": 0,
						"border-right-width": 0,
						"box-sizing": ""
					};

				if (element) {
					offsetWidth = getOffset(element, props, pseudoSelector, force, "offsetWidth");

					for (property in props) {
						if (props.hasOwnProperty(property) && property !== "box-sizing") {
							value = parseFloat(props[property]);
							props[property] = value;
						}
					}

					width += props["width"];
					if (props["box-sizing"] !== "border-box") {
						width += props["padding-left"] + props["padding-right"];
					}

					if (includeOffset) {
						width = offsetWidth;
					} else if (outer && props["box-sizing"] !== "border-box") {
						width += props["border-left-width"] + props["border-right-width"];
					}

					if (includeMargin) {
						width += Math.max(0, props["margin-left"]) + Math.max(0, props["margin-right"]);
					}
				}
				return width;
			}

			/**
			 * Returns offset of element
			 * @method getElementOffset
			 * @param {HTMLElement} element
			 * @return {Object}
			 * @member ns.util.DOM
			 * @static
			 */
			function getElementOffset(element) {
				var left = 0,
					top = 0,
					loopElement = element;

				do {
					top += loopElement.offsetTop;
					left += loopElement.offsetLeft;
					loopElement = loopElement.offsetParent;
				} while (loopElement !== null);

				return {
					top: top,
					left: left
				};
			}

			/**
			 * Check if element occupies place at view
			 * @method isOccupiedPlace
			 * @param {HTMLElement} element
			 * @return {boolean}
			 * @member ns.util.DOM
			 * @static
			 */
			function isOccupiedPlace(element) {
				return !(element.offsetWidth <= 0 && element.offsetHeight <= 0);
			}

			/**
			 * Set values for element with prefixes for browsers
			 * @method setPrefixedStyle
			 * @param {HTMLElement | CSSStyleRule} elementOrRule
			 * @param {string} property
			 * @param {string|Object|null} value
			 * @member ns.util.DOM
			 * @static
			 */
			function setPrefixedStyle(elementOrRule, property, value) {
				var style = elementOrRule.style,
					propertyForPrefix = property,
					values = (typeof value !== "object") ? {
						webkit: value,
						moz: value,
						o: value,
						ms: value,
						normal: value
					} : value;

				style.setProperty(property, values.normal);
				style.setProperty("-webkit-" + propertyForPrefix, values.webkit);
				style.setProperty("-moz-" + propertyForPrefix, values.moz);
				style.setProperty("-o-" + propertyForPrefix, values.o);
				style.setProperty("-ms-" + propertyForPrefix, values.ms);
			}

			/**
			 * Get value from element with prefixes for browsers
			 * @method getCSSProperty
			 * @param {string} value
			 * @return {Object}
			 * @member ns.util.DOM
			 * @static
			 */
			function getPrefixedValue(value) {
				return {
					webkit: "-webkit-" + value,
					moz: "-moz-" + value,
					o: "-ms-" + value,
					ms: "-o-" + value,
					normal: value
				};
			}

			/**
			 * Returns style value for css property with browsers prefixes
			 * @method getPrefixedStyleValue
			 * @param {HTMLStyle} styles
			 * @param {string} property
			 * @return {string|undefined}
			 * @member ns.util.DOM
			 * @static
			 */
			function getPrefixedStyleValue(styles, property) {
				var prefixedProperties = getPrefixedValue(property),
					value,
					key;

				for (key in prefixedProperties) {
					if (prefixedProperties.hasOwnProperty(key)) {
						value = styles[prefixedProperties[key]];
						if (value && value !== "none") {
							break;
						}
					}
				}
				return value;
			}

			/**
			 * Returns size (width, height) as CSS string
			 * @method toCSSSize
			 * @param {string|Array} size has to be comma separated string (eg. "10,100") or array with 2
			 * elements
			 * @return {string} if not enough arguments the method returns empty string
			 * @member ns.util.DOM
			 * @static
			 */
			function toCSSSize(size) {
				var cssSize = "",
					arraySize = stringUtil.parseProperty(size);

				if (arraySize && arraySize.length === 2) {
					cssSize = "width: " + arraySize[0] + "px; " +
					"height: " + arraySize[1] + "px;";
				}

				return cssSize;
			}

			/**
			 * Set CSS styles for pseudo class selector.
			 * @method setStylesForPseudoClass
			 * @param {string} selector selector of elements
			 * @param {string} pseudoClassName CSS pseudo class name to set, for example after, before
			 * @param {Object} cssValues object with styles to set
			 * @return {number?} return index of inserted rule
			 * @member ns.util.DOM
			 * @static
			 */
			function setStylesForPseudoClass(selector, pseudoClassName, cssValues) {
				var cssValuesArray = [],
					headElement,
					styleElement,
					name;

				// create style element on first use
				if (!appStyleSheet) {
					headElement = document.head || document.getElementsByTagName("head")[0];
					styleElement = document.createElement("style");
					styleElement.type = "text/css";
					headElement.appendChild(styleElement);
					appStyleSheet = styleElement.sheet;
				}

				for (name in cssValues) {
					if (cssValues.hasOwnProperty(name)) {
						cssValuesArray.push(name + ": " + cssValues[name]);
					}
				}

				if (cssValuesArray.length) {
					return appStyleSheet.addRule(selector + "::" + pseudoClassName, cssValuesArray.join("; "));
				}

				return null;
			}

			/**
			 * Remove CSS rule from sheet.
			 * @method removeCSSRule
			 * @param {number} ruleIndex Index of rule to remove
			 * @static
			 */
			function removeCSSRule(ruleIndex) {

				// create style element on first use
				if (appStyleSheet) {
					appStyleSheet.deleteRule(ruleIndex);
				}
			}

			// assign methods to namespace
			DOM.getCSSProperty = getCSSProperty;
			DOM.extractCSSProperties = extractCSSProperties;
			DOM.getElementHeight = getElementHeight;
			DOM.getElementWidth = getElementWidth;
			DOM.getElementOffset = getElementOffset;
			DOM.isOccupiedPlace = isOccupiedPlace;
			DOM.setPrefixedStyle = setPrefixedStyle;
			DOM.getPrefixedValue = getPrefixedValue;
			DOM.getPrefixedStyleValue = getPrefixedStyleValue;
			DOM.toCSSSize = toCSSSize;
			DOM.setStylesForPseudoClass = setStylesForPseudoClass;
			DOM.removeCSSRule = removeCSSRule;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.util.DOM;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, ns));
