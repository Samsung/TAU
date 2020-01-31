/*global define, ns */
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
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Object Utility
 * Object contains functions help work with objects.
 * @class ns.util.object
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function () {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../util" // fetch namespace
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var object = {
				/**
				 * Copy object to new object
				 * @method copy
				 * @param {Object} orgObject
				 * @return {Object}
				 * @static
				 * @member ns.util.object
				 */
				copy: function (orgObject) {
					return object.merge({}, orgObject);
				},

				/**
				 * Attach fields from second object to first object.
				 * @method fastMerge
				 * @param {Object} newObject
				 * @param {Object} orgObject
				 * @return {Object}
				 * @static
				 * @member ns.util.object
				 */
				fastMerge: function (newObject, orgObject) {
					var key,
						propertyDescriptor;

					for (key in orgObject) {
						if (orgObject.hasOwnProperty(key)) {
							propertyDescriptor = Object.getOwnPropertyDescriptor(newObject, key);
							if (!propertyDescriptor || propertyDescriptor.writable === true || propertyDescriptor.set != undefined) {
								newObject[key] = orgObject[key];
							} else {
								console.warn("Attempt to override object readonly property (" + key + ") during merge.")
							}
						}
					}
					return newObject;
				},

				/**
				 * Attach fields from second and next object to first object.
				 * @method merge
				 * @return {Object}
				 * @static
				 * @member ns.util.object
				 */
				merge: function (/* newObject, orgObject, override */) {
					var newObject,
						orgObject,
						override,
						key,
						args = [].slice.call(arguments),
						argsLength = args.length,
						i,
						propertyDescriptor;

					newObject = args.shift();
					override = true;
					if (typeof arguments[argsLength - 1] === "boolean") {
						override = arguments[argsLength - 1];
						argsLength--;
					}
					for (i = 0; i < argsLength; i++) {
						orgObject = args.shift();
						if (orgObject !== null) {
							for (key in orgObject) {
								if (orgObject.hasOwnProperty(key)) {
									propertyDescriptor = Object.getOwnPropertyDescriptor(newObject, key);
									if (!propertyDescriptor ||
										(override && (propertyDescriptor.writable === true || propertyDescriptor.set != undefined))) {
										newObject[key] = orgObject[key];
									} else if (override) {
										console.warn("Attempt to override object readonly property (" + key + ") during merge.")
									}
								}
							}
						}
					}
					return newObject;
				},

				/**
				 * Function add to Constructor prototype Base object and add to prototype properties and methods from
				 * prototype object.
				 * @method inherit
				 * @param {Function} Constructor
				 * @param {Function} Base
				 * @param {Object} prototype
				 * @static
				 * @member ns.util.object
				 */
				/* jshint -W083 */
				inherit: function (Constructor, Base, prototype) {
					var basePrototype = new Base(),
						property,
						value;

					for (property in prototype) {
						if (prototype.hasOwnProperty(property)) {
							value = prototype[property];
							if (typeof value === "function") {
								basePrototype[property] = (function (Base, property, value) {
									var _super = function () {
										var superFunction = Base.prototype[property];

										if (superFunction) {
											return superFunction.apply(this, arguments);
										}
										return null;
									};

									return function () {
										var __super = this._super,
											returnValue;

										this._super = _super;
										returnValue = value.apply(this, arguments);
										this._super = __super;
										return returnValue;
									};
								}(Base, property, value));
							} else {
								basePrototype[property] = value;
							}
						}
					}

					Constructor.prototype = basePrototype;
					Constructor.prototype.constructor = Constructor;
				},

				/**
				 * Returns true if every property value corresponds value from 'value' argument
				 * @method hasPropertiesOfValue
				 * @param {Object} obj
				 * @param {*} [value=undefined]
				 * @return {boolean}
				 */
				hasPropertiesOfValue: function (obj, value) {
					var keys = Object.keys(obj),
						i = keys.length;

					// Empty array should return false
					if (i === 0) {
						return false;
					}

					while (--i >= 0) {
						if (obj[keys[i]] !== value) {
							return false;
						}
					}

					return true;
				},

				/**
				 * Remove properties from object.
				 * @method removeProperties
				 * @param {Object} object
				 * @param {Array} propertiesToRemove
				 * @return {Object}
				 */
				removeProperties: function (object, propertiesToRemove) {
					var length = propertiesToRemove.length,
						property,
						i;

					for (i = 0; i < length; i++) {
						property = propertiesToRemove[i];
						if (object.hasOwnProperty(property)) {
							delete object[property];
						}
					}
					return object;
				}
			};

			ns.util.object = object;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}());
