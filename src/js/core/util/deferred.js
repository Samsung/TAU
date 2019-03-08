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
 * #Deferred Utility
 * Class creates object which can call registered callback depend from
 * state of object..
 * @class ns.util.deferred
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
*/(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../util",
			"./callbacks",
			"./object"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var Deferred = function (callback) {
				var callbacks = ns.util.callbacks,
					object = ns.util.object,
					/**
					 * Register additional action for deferred object
					 * @property {Array} tuples
					 * @member ns.util.deferred
					 * @private
					 */
					tuples = [
						// action, add listener, listener list, final state
						["resolve", "done", callbacks({once: true, memory: true}), "resolved"],
						["reject", "fail", callbacks({once: true, memory: true}), "rejected"],
						["notify", "progress", callbacks({memory: true})]
					],
					state = "pending",
					deferred = {},
					promise = {
						/**
						 * Determine the current state of a Deferred object.
						 * @method state
						 * @return {"pending" | "resolved" | "rejected"} representing the current state
						 * @member ns.util.deferred
						 */
						state: function () {
							return state;
						},
						/**
						 * Add handlers to be called when the Deferred object
						 * is either resolved or rejected.
						 * @method always
						 * @return {ns.util.deferred} self
						 * @member ns.util.deferred
						 */
						always: function () {
							deferred.done(arguments).fail(arguments);
							return this;
						},
						/**
						 * Add handlers to be called when the Deferred object
						 * is resolved, rejected, or still in progress.
						 * @method then
						 * @return {Object} returns a new promise
						 * @member ns.util.deferred
						 */
						then: function () { /* fnDone, fnFail, fnProgress */
							var functions = arguments;

							return new Deferred(function (newDefer) {
								tuples.forEach(function (tuple, i) {
									var fn = (typeof functions[i] === "function") && functions[i];
									// deferred[ done | fail | progress ] for forwarding actions to newDefer

									deferred[tuple[1]](function () {
										var returned = fn && fn.apply(this, arguments);

										if (returned && (typeof returned.promise === "function")) {
											returned.promise()
												.done(newDefer.resolve)
												.fail(newDefer.reject)
												.progress(newDefer.notify);
										} else {
											newDefer[tuple[0] + "With"](this === promise ? newDefer.promise() : this, fn ? [returned] : arguments);
										}
									});
								});
								functions = null;
							}).promise();
						},
						/**
						 * Get a promise for this deferred. If obj is provided,
						 * the promise aspect is added to the object
						 * @method promise
						 * @param {Object} obj
						 * @return {Object} return a Promise object
						 * @member ns.util.deferred
						 */
						promise: function (obj) {
							if (obj) {
								return object.merge(obj, promise);
							}
							return promise;
						}
					};

				/**
				 * alias for promise.then, Keep pipe for back-compat
				 * @method pipe
				 * @member ns.util.deferred
				 */
				promise.pipe = promise.then;

				// Add list-specific methods

				tuples.forEach(function (tuple, i) {
					var list = tuple[2],
						stateString = tuple[3];

					// promise[ done | fail | progress ] = list.add
					promise[tuple[1]] = list.add;

					// Handle state
					if (stateString) {
						list.add(function () {
							// state = [ resolved | rejected ]
							state = stateString;

							// mapping of values [ reject_list | resolve_list ].disable; progress_list.lock
						}, tuples[i ^ 1][2].disable, tuples[2][2].lock);
					}

					// deferred[ resolve | reject | notify ]
					deferred[tuple[0]] = function () {
						deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments);
						return this;
					};
					deferred[tuple[0] + "With"] = list.fireWith;
				});

				// Make the deferred a promise
				promise.promise(deferred);

				// Call given func if any
				if (callback) {
					callback.call(deferred, deferred);
				}

				// All done!
				return deferred;
			};

			ns.util.deferred = Deferred;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.util.deferred;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
