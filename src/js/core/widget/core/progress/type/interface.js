/*global window, define, ns */
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
/*jslint nomen: true, plusplus: true */
/**
 * #Progress type Interface
 * Interface for type of progress
 * @internal
 * @class ns.widget.core.progress.type.interface
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../type"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			ns.widget.core.progress.type.interface = {
				/**
				 * Init DOM for progress
				 * @method build
				 * @static
				 * @member ns.widget.core.progress.type.interface
				 */
				build: function (/*Progress*/) {
				},
				/**
				 * Init Style for progress
				 * @method init
				 * @static
				 * @member ns.widget.core.progress.type.interface
				 */
				init: function (/*Progress*/) {
				},
				/**
				 * Init Style for progress
				 * @method refresh
				 * @static
				 * @member ns.widget.core.progress.type.interface
				 */
				refresh: function (/*Progress*/) {

				},
				/**
				 * Init Style for progress
				 * @method changeValue
				 * @static
				 * @member ns.widget.core.progress.type.interface
				 */
				changeValue: function (/*Progress*/) {

				},
				/**
				 * Init Style for progress
				 * @method destroy
				 * @static
				 * @member ns.widget.core.progress.type.interface
				 */
				destroy: function (/*Progress*/) {

				}
			};
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
