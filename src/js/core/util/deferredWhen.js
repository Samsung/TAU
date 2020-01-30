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
 * #Deferred When Utility
 * Class groups many deferred object to one.
 * @class ns.util.deferredWhen
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../util"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var when = function (subordinate /* , ..., subordinateN */) {
				var i = 0,
					resolveValues = [].slice.call(arguments),
					length = resolveValues.length,
					progressValues,
					progressContexts,
					resolveContexts,

					/**
					 * The count of uncompleted subordinates
					 * @property {number} remaining
					 * @member ns.util.deferredWhen
					 * @private
					 */
					remaining = length !== 1 || (subordinate && (typeof subordinate.promise === "function")) ? length : 0,

					/**
					 * The master Deferred. If resolveValues consist of only
					 * a single Deferred, just use that.
					 * @property {ns.util.deferred} deferred
					 * @member ns.util.deferredWhen
					 * @private
					 */
					deferred = remaining === 1 ? subordinate : new ns.util.deferred(),

					/**
					 * Update function for both resolve and progress values
					 * @method updateFunc
					 * @param {number} i
					 * @param {Array} contexts
					 * @param {Array} values
					 * @return {Function} representing the current state
					 * "pending" | "resolved" | "rejected"
					 * @member ns.util.deferredWhen
					 * @private
					 */
					updateFunc = function (i, contexts, values) {
						return function (value) {
							contexts[i] = this;
							values[i] = arguments.length > 1 ? [].slice.call(arguments) : value;
							if (values === progressValues) {
								deferred.notifyWith(contexts, values);

							} else if (!(--remaining)) {
								deferred.resolveWith(contexts, values);
							}
						};
					};

				// add listeners to Deferred subordinates; treat others as resolved
				if (length > 1) {
					progressValues = [];
					progressValues.length = length;
					progressContexts = [];
					progressContexts.length = length;
					resolveContexts = [];
					resolveContexts.length = length;
					for (; i < length; i++) {
						if (resolveValues[i] && (typeof resolveValues[i].promise === "function")) {
							resolveValues[i].promise()
								.done(updateFunc(i, resolveContexts, resolveValues))
								.fail(deferred.reject)
								.progress(updateFunc(i, progressContexts, progressValues));
						} else {
							--remaining;
						}
					}
				}

				// if we're not waiting on anything, resolve the master
				if (!remaining) {
					deferred.resolveWith(resolveContexts, resolveValues);
				}

				return deferred.promise();
			};

			ns.util.deferredWhen = when;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.util.deferredWhen;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
