/*global window, ns, define, ns */
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
 * #Callback Utility
 * Class creates a callback list
 *
 * Create a callback list using the following parameters:
 *  options: an optional list of space-separated options that will change how
 *            the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *    once:            will ensure the callback list can only be fired once (like a Deferred)
 *
 *    memory:            will keep track of previous values and will call any callback added
 *                    after the list has been fired right away with the latest "memorized"
 *                    values (like a Deferred)
 *
 *    unique:            will ensure a callback can only be added once (no duplicate in the list)
 *
 *    stopOnFalse:    interrupt callings when a callback returns false
 * @class ns.util.callbacks
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../util",
			"./object"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			ns.util.callbacks = function (orgOptions) {

				var object = ns.util.object,
					options = object.copy(orgOptions),
					/**
					 * Alias to Array.slice function
					 * @method slice
					 * @member ns.util.callbacks
					 * @private
					 */
					slice = [].slice,
					/**
					 * Last fire value (for non-forgettable lists)
					 * @property {Object} memory
					 * @member ns.util.callbacks
					 * @private
					 */
					memory,
					/**
					 * Flag to know if list was already fired
					 * @property {boolean} fired
					 * @member ns.util.callbacks
					 * @private
					 */
					fired,
					/**
					 * Flag to know if list is currently firing
					 * @property {boolean} firing
					 * @member ns.util.callbacks
					 * @private
					 */
					firing,
					/**
					 * First callback to fire (used internally by add and fireWith)
					 * @property {number} [firingStart=0]
					 * @member ns.util.callbacks
					 * @private
					 */
					firingStart,
					/**
					 * End of the loop when firing
					 * @property {number} firingLength
					 * @member ns.util.callbacks
					 * @private
					 */
					firingLength,
					/**
					 * Index of currently firing callback (modified by remove if needed)
					 * @property {number} firingIndex
					 * @member ns.util.callbacks
					 * @private
					 */
					firingIndex,
					/**
					 * Actual callback list
					 * @property {Array} list
					 * @member ns.util.callbacks
					 * @private
					 */
					list = [],
					/**
					 * Stack of fire calls for repeatable lists
					 * @property {Array} stack
					 * @member ns.util.callbacks
					 * @private
					 */
					stack = !options.once && [],
					fire,
					add,
					self = {
						/**
						 * Add a callback or a collection of callbacks to the list
						 * @method add
						 * @return {ns.util.callbacks} self
						 * @member ns.util.callbacks
						 */
						add: function () {
							var start;

							if (list) {
								// First, we save the current length
								start = list.length;

								add(arguments);
								// Do we need to add the callbacks to the
								// current firing batch?
								if (firing) {
									firingLength = list.length;
									// With memory, if we're not firing then
									// we should call right away
								} else if (memory) {
									firingStart = start;
									fire(memory);
								}
							}
							return this;
						},
						/**
						 * Remove a callback from the list
						 * @method remove
						 * @return {ns.util.callbacks} self
						 * @member ns.util.callbacks
						 */
						remove: function () {
							if (list) {
								slice.call(arguments).forEach(function (arg) {
									var index = list.indexOf(arg);

									while (index > -1) {
										list.splice(index, 1);
										// Handle firing indexes
										if (firing) {
											if (index <= firingLength) {
												firingLength--;
											}
											if (index <= firingIndex) {
												firingIndex--;
											}
										}
										index = list.indexOf(arg, index);
									}
								});
							}
							return this;
						},
						/**
						 * Check if a given callback is in the list.
						 * If no argument is given,
						 * return whether or not list has callbacks attached.
						 * @method has
						 * @param {Function} fn
						 * @return {boolean}
						 * @member ns.util.callbacks
						 */
						has: function (fn) {
							return fn ? !!list && list.indexOf(fn) > -1 : !!(list && list.length);
						},
						/**
						 * Remove all callbacks from the list
						 * @method empty
						 * @return {ns.util.callbacks} self
						 * @member ns.util.callbacks
						 */
						empty: function () {
							list = [];
							firingLength = 0;
							return this;
						},
						/**
						 * Have the list do nothing anymore
						 * @method disable
						 * @return {ns.util.callbacks} self
						 * @member ns.util.callbacks
						 */
						disable: function () {
							list = stack = memory = undefined;
							return this;
						},
						/**
						 * Is it disabled?
						 * @method disabled
						 * @return {boolean}
						 * @member ns.util.callbacks
						 */
						disabled: function () {
							return !list;
						},
						/**
						 * Lock the list in its current state
						 * @method lock
						 * @return {ns.util.callbacks} self
						 * @member ns.util.callbacks
						 */
						lock: function () {
							stack = undefined;
							if (!memory) {
								self.disable();
							}
							return this;
						},
						/**
						 * Is it locked?
						 * @method locked
						 * @return {boolean} stack
						 * @member ns.util.callbacks
						 */
						locked: function () {
							return !stack;
						},
						/**
						 * Call all callbacks with the given context and
						 * arguments
						 * @method fireWith
						 * @param {Object} context
						 * @param {Array} args
						 * @return {ns.util.callbacks} self
						 * @member ns.util.callbacks
						 */
						fireWith: function (context, args) {
							if (list && (!fired || stack)) {
								args = args || [];
								args = [context, args.slice ? args.slice() : args];
								if (firing) {
									stack.push(args);
								} else {
									fire(args);
								}
							}
							return this;
						},
						/**
						 * Call all the callbacks with the given arguments
						 * @method fire
						 * @return {ns.util.callbacks} self
						 * @member ns.util.callbacks
						 */
						fire: function () {
							self.fireWith(this, arguments);
							return this;
						},
						/**
						 * To know if the callbacks have already been called at
						 * least once
						 * @method fired
						 * @return {boolean}
						 * @member ns.util.callbacks
						 */
						fired: function () {
							return !!fired;
						}
					};
				/**
				 * Adds functions to the callback list
				 * @method add
				 * @param {...*} argument
				 * @member ns.util.bezierCurve
				 * @private
				 */

				add = function (args) {
					slice.call(args).forEach(function (arg) {
						var type = typeof arg;

						if (type === "function") {
							if (!options.unique || !self.has(arg)) {
								list.push(arg);
							}
						} else if (arg && arg.length && type !== "string") {
							// Inspect recursively
							add(arg);
						}
					});
				};
				/**
				 * Fire callbacks
				 * @method fire
				 * @param {Array} data
				 * @member ns.util.bezierCurve
				 * @private
				 */
				fire = function (data) {
					memory = options.memory && data;
					fired = true;
					firingIndex = firingStart || 0;
					firingStart = 0;
					firingLength = list.length;
					firing = true;
					while (list && firingIndex < firingLength) {
						if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
							memory = false; // To prevent further calls using add
							break;
						}
						firingIndex++;
					}
					firing = false;
					if (list) {
						if (stack) {
							if (stack.length) {
								fire(stack.shift());
							}
						} else if (memory) {
							list = [];
						} else {
							self.disable();
						}
					}
				};

				return self;
			};

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.util.callbacks;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
