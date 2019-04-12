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
/*global define, ns */
/**
 * #String Utility
 * Utility helps work with strings.
 * @class ns.util.string
 */
(function () {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			// fetch namespace
			"../util",
			"./array"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var DASH_TO_UPPER_CASE_REGEXP = /-([a-z])/gi,
				UPPER_TO_DASH_CASE_REGEXP = /([A-Z])/g,
				arrayUtil = ns.util.array;

			/**
			 * Callback method for regexp used in dashesToCamelCase method
			 * @method toUpperCaseFn
			 * @param {string} match
			 * @param {string} value
			 * @return {string}
			 * @member ns.util.string
			 * @static
			 * @private
			 */
			function toUpperCaseFn(match, value) {
				return value.toLocaleUpperCase();
			}

			/**
			 * Callback method for regexp used in camelCaseToDashes method
			 * @method toUpperCaseFn
			 * @param {string} match
			 * @param {string} value
			 * @return {string}
			 * @member ns.util.string
			 * @static
			 * @private
			 */
			function toLowerCaseFn(match, value) {
				return "-" + value.toLowerCase();
			}

			/**
			 * Changes dashes string to camel case string
			 * @method firstToUpperCase
			 * @param {string} str
			 * @return {string}
			 * @member ns.util.string
			 * @static
			 */
			function dashesToCamelCase(str) {
				return str.replace(DASH_TO_UPPER_CASE_REGEXP, toUpperCaseFn);
			}

			/**
			 * Changes camel case string to dashes string
			 * @method camelCaseToDashes
			 * @param {string} str
			 * @return {string}
			 * @member ns.util.string
			 * @static
			 */
			function camelCaseToDashes(str) {
				return str.replace(UPPER_TO_DASH_CASE_REGEXP, toLowerCaseFn);
			}

			/**
			 * Changes the first char in string to uppercase
			 * @method firstToUpperCase
			 * @param {string} str
			 * @return {string}
			 * @member ns.util.string
			 * @static
			 */
			function firstToUpperCase(str) {
				return str.charAt(0).toLocaleUpperCase() + str.substring(1);
			}

			/**
			 * Map different types to number if is possible.
			 * @param {string|*} x
			 * @return {*}
			 */
			function mapToNumber(x) {
				var parsed;

				if (x && (x + "").indexOf("%") === -1) {
					parsed = parseInt(x, 10);
					if (isNaN(parsed)) {
						parsed = null;
					}
					return parsed;
				}
				return x;
			}

			/**
			 * Parses comma separated string to array
			 * @method parseProperty
			 * @param {string} property
			 * @return {Array} containing number or null
			 * @member ns.util.string
			 * @static
			 */
			function parseProperty(property) {
				var arrayProperty;

				if (typeof property === "string") {
					arrayProperty = property.split(",");
				} else {
					arrayProperty = property || [];
				}

				return arrayUtil.map(arrayProperty, mapToNumber);
			}

			/* eslint-disable jsdoc/check-param-names */
			/**
			 * Returns a string of tags that exist in the first param but do not exist
			 * in rest of the params
			 * @param {string} baseWithTags
			 * @param {...string} compare
			 * @return {string}
			 */
			function removeExactTags(baseWithTags) {
				var tags = [];

				[].slice
					.call(arguments)
					.slice(1)
					.forEach(function (arg) {
						arg.split(" ")
							.forEach(function (tag) {
								tags.push(tag.trim());
							});
					});

				return baseWithTags
					.split(" ")
					.filter(function (tag) {
						return tags.indexOf(tag) === -1;
					}).join(" ");
			}
			/* eslint-enable jsdoc/check-param-names */

			ns.util.string = {
				dashesToCamelCase: dashesToCamelCase,
				camelCaseToDashes: camelCaseToDashes,
				firstToUpperCase: firstToUpperCase,
				parseProperty: parseProperty,
				removeExactTags: removeExactTags
			};
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.util.string;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}());
