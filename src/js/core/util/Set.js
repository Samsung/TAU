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
/**
 * #Set Utility
 *
 * Own implementation of ECMAScript Set.
 *
 * @class ns.util.Set
 */
(function (window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			// fetch namespace
			"../util"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var set = function () {
				this._data = [];
			};

			set.prototype = {
				/**
				 * Add one or many arguments to set
				 * @method add
				 * @member ns.util.Set
				 */
				add: function () {
					var data = this._data;

					this._data = data.concat.apply(data, [].slice.call(arguments))
						.filter(function (item, pos, array) {
							return array.indexOf(item) === pos;
						});
				},
				/**
				 * Remove all items from set
				 * @method clear
				 * @member ns.util.Set
				 */
				clear: function () {
					this._data = [];
				},
				/**
				 * delete one item from set
				 * @method delete
				 * @param {*} item
				 * @member ns.util.Set
				 */
				delete: function (item) {
					var data = this._data,
						index = data.indexOf(item);

					if (index > -1) {
						data.splice(index, 1);
					}
				},
				/**
				 * Check that item exists in set
				 * @method has
				 * @param {Object} item
				 * @member ns.util.Set
				 * @return {boolean}
				 */
				has: function (item) {
					return this._data.indexOf(item) > -1;
				},
				/**
				 * Iterate on each set elements
				 * @method forEach
				 * @param {Function} cb
				 * @member ns.util.Set
				 */
				forEach: function (cb) {
					this._data.forEach(cb);
				}
			};

			// for tests
			ns.util._Set = set;
			ns.util.Set = window.Set || set;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.util.Set;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, ns));
