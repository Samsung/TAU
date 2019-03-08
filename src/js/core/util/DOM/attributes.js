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
(function () {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../selectors",
			"../DOM"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");


			var selectors = ns.util.selectors,
				DOM = ns.util.DOM,
				NAMESPACE = "namespace";

			/**
			 * Returns given attribute from element or the closest parent,
			 * which matches the selector.
			 * @method inheritAttr
			 * @member ns.util.DOM
			 * @param {HTMLElement} element
			 * @param {string} attr
			 * @param {string} selector
			 * @return {?string}
			 * @static
			 */
			DOM.inheritAttr = function (element, attr, selector) {
				var value = element.getAttribute(attr),
					parent;

				if (!value) {
					parent = selectors.getClosestBySelector(element, selector);
					if (parent) {
						return parent.getAttribute(attr);
					}
				}
				return value;
			};

			/**
			 * Returns Number from properties described in html tag
			 * @method getNumberFromAttribute
			 * @member ns.util.DOM
			 * @param {HTMLElement} element
			 * @param {string} attribute
			 * @param {string=} [type] auto type casting
			 * @param {number} [defaultValue] default returned value
			 * @static
			 * @return {number}
			 */
			DOM.getNumberFromAttribute = function (element, attribute, type, defaultValue) {
				var value = element.getAttribute(attribute),
					result = defaultValue;

				if (!isNaN(value)) {
					if (type === "float") {
						value = parseFloat(value);
						if (!isNaN(value)) {
							result = value;
						}
					} else {
						value = parseInt(value, 10);
						if (!isNaN(value)) {
							result = value;
						}
					}
				}
				return result;
			};

			function getDataName(name, skipData) {
				var _namespace = ns.getConfig(NAMESPACE),
					prefix = "";

				if (!skipData) {
					prefix = "data-";
				}
				return prefix + (_namespace ? _namespace + "-" : "") + name;
			}

			/**
			 * Special function to set attribute and property in the same time
			 * @method setAttribute
			 * @param {HTMLElement} element
			 * @param {string} name
			 * @param {Mixed} value
			 * @member ns.util.DOM
			 * @static
			 */
			function setAttribute(element, name, value) {
				element[name] = value;
				element.setAttribute(name, value);
			}

			/**
			 * This function sets value of attribute data-{namespace}-{name} for element.
			 * If the namespace is empty, the attribute data-{name} is used.
			 * @method setNSData
			 * @param {HTMLElement} element Base element
			 * @param {string} name Name of attribute
			 * @param {string|number|boolean} value New value
			 * @member ns.util.DOM
			 * @static
			 */
			DOM.setNSData = function (element, name, value) {
				element.setAttribute(getDataName(name), value);
			};

			/**
			 * This function returns value of attribute data-{namespace}-{name} for element.
			 * If the namespace is empty, the attribute data-{name} is used.
			 * Method may return boolean in case of 'true' or 'false' strings as attribute value.
			 * @method getNSData
			 * @param {HTMLElement} element Base element
			 * @param {string} name Name of attribute
			 * @param {boolean} skipData
			 * @member ns.util.DOM
			 * @return {?string|boolean}
			 * @static
			 */
			DOM.getNSData = function (element, name, skipData) {
				var value = element.getAttribute(getDataName(name, skipData));

				if (value === "true") {
					return true;
				}

				if (value === "false") {
					return false;
				}

				return value;
			};

			/**
			 * This function returns true if attribute data-{namespace}-{name} for element is set
			 * or false in another case. If the namespace is empty, attribute data-{name} is used.
			 * @method hasNSData
			 * @param {HTMLElement} element Base element
			 * @param {string} name Name of attribute
			 * @member ns.util.DOM
			 * @return {boolean}
			 * @static
			 */
			DOM.hasNSData = function (element, name) {
				return element.hasAttribute(getDataName(name));
			};

			/**
			 * Get or set value on data attribute.
			 * @method nsData
			 * @param {HTMLElement} element
			 * @param {string} name
			 * @param {?Mixed} [value]
			 * @static
			 * @member ns.util.DOM
			 */
			DOM.nsData = function (element, name, value) {
				if (value === undefined) {
					return DOM.getNSData(element, name);
				} else {
					return DOM.setNSData(element, name, value);
				}
			};

			/**
			 * This function removes attribute data-{namespace}-{name} from element.
			 * If the namespace is empty, attribute data-{name} is used.
			 * @method removeNSData
			 * @param {HTMLElement} element Base element
			 * @param {string} name Name of attribute
			 * @member ns.util.DOM
			 * @static
			 */
			DOM.removeNSData = function (element, name) {
				element.removeAttribute(getDataName(name));
			};

			/**
			 * Returns object with all data-* attributes of element
			 * @method getData
			 * @param {HTMLElement} element Base element
			 * @member ns.util.DOM
			 * @return {Object}
			 * @static
			 */
			DOM.getData = function (element) {
				var dataPrefix = "data-",
					data = {},
					attributes = element.attributes,
					attribute,
					nodeName,
					value,
					i,
					length = attributes.length,
					lowerCaseValue;

				for (i = 0; i < length; i++) {
					attribute = attributes.item(i);
					nodeName = attribute.nodeName;
					if (nodeName.indexOf(dataPrefix) > -1) {
						value = attribute.value;
						lowerCaseValue = value.toLowerCase();
						if (lowerCaseValue === "true") {
							value = true;
						} else if (lowerCaseValue === "false") {
							value = false;
						}
						data[nodeName.replace(dataPrefix, "")] = value;
					}
				}

				return data;
			};

			/**
			 * Special function to remove attribute and property in the same time
			 * @method removeAttribute
			 * @param {HTMLElement} element
			 * @param {string} name
			 * @member ns.util.DOM
			 * @static
			 */
			DOM.removeAttribute = function (element, name) {
				element.removeAttribute(name);
				element[name] = false;
			};

			DOM.setAttribute = setAttribute;
			/**
			 * Special function to set attributes and properties in the same time
			 * @method setAttribute
			 * @param {HTMLElement} element
			 * @param {Object} values
			 * @member ns.util.DOM
			 * @static
			 */
			DOM.setAttributes = function (element, values) {
				var i,
					names = Object.keys(values),
					name,
					len;

				for (i = 0, len = names.length; i < len; i++) {
					name = names[i];
					setAttribute(element, name, values[name]);
				}
			};
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.util.DOM;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}());
