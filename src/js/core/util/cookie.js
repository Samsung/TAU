/*global ns, define */
/*
 * Copyright (c) 2020 Samsung Electronics Co., Ltd
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
 * #Document cookie Utility
 * Utility to menage session data in cookie
 * @class ns.util.util
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../util" // fetch namespace
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var /**
				* Write value to session for indicated storage name
				* @method writeToCookie
				* @param {string} storageName
				* @param {string} value
				* @param {Date} [expires]
				* @member ns.util.cookie
				* @static
				* @private
				*/
				writeToCookie = function (storageName, value, expires) {
					var storageValue = "";

					value = window.encodeURIComponent(value);
					storageValue = storageName + "=" + value;
					if (expires && expires instanceof Date) {
						storageValue += ";expires=" + expires.toUTCString();
					}

					document.cookie = storageValue;
				},

				/**
				 * Return value corresponding to storage name
				 * @method readFromCookie
				 * @param {string} storageName
				 * @return {string}
				 * @member ns.util.cookie
				 * @static
				 * @private
				 */
				readFromCookie = function (storageName) {
					var entries = document.cookie.split(";"),
						value = "";

					value = entries.filter(function (entry) {
						return entry.indexOf(storageName + "=") > -1;
					})[0];

					if (value) {
						value = window.decodeURIComponent(
							value.trim().replace(storageName + "=", "")
						);
					}
					return value;
				};

			ns.util.cookie = {
				/**
				 * Return value corresponding to storage name
				 * @method readFromCookie
				 * @param {string} storageName
				 * @return {string}
				 * @member ns.util.cookie
				 * @static
				 */
				readFromCookie: readFromCookie,

				/**
				* Write value to session for indicated storage name
				* @method writeToCookie
				* @param {string} storageName
				* @param {string} value
				* @param {Date} [expires]
				* @member ns.util.cookie
				* @static
				*/
				writeToCookie: writeToCookie
			};
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.util.cookie;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, ns));
