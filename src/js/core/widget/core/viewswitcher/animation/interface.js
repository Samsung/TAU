/*global window, define, Event, console, ns */
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
 * #Animation Interface
 * Interface for animation for used viewswitcher
 * @class ns.widget.core.viewswitcher.animation.interface
 * @internal
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../animation"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			ns.widget.core.viewswitcher.animation.interface = {
				/**
				 * Init views position
				 * @method initPosition
				 * @static
				 * @member ns.widget.core.viewswitcher.animation.interface
				 */
				initPosition: function (/* views array, active index */) {
				},
				/**
				 * Animate views
				 * @method animate
				 * @static
				 * @member ns.widget.core.viewswitcher.animation.interface
				 */
				animate: function (/* views array, active index, position */) {
				},
				/**
				 * Reset views position
				 * @method resetPosition
				 * @static
				 * @member ns.widget.core.viewswitcher.animation.interface
				 */
				resetPosition: function (/* views array, active index */) {
				}
			};
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
