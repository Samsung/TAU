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
 * #Type Interface
 * Interface for types used in scroll bar widget.
 * @class ns.widget.core.scroller.scrollbar.type.interface
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
			// scroller.start event trigger when user try to move scroller

			ns.widget.core.scroller.scrollbar.type.interface = {
				/**
				 * Inserts elements end decorate.
				 * @method insertAndDecorate
				 * @static
				 * @member ns.widget.core.scroller.scrollbar.type.interface
				 */
				setScrollbarLayout: function (/* options */) {
				},
				/**
				 * Removes element.
				 * @method remove
				 * @static
				 * @member ns.widget.core.scroller.scrollbar.type.interface
				 */
				remove: function (/* options */) {
				},
				/**
				 * ...
				 * @method start
				 * @static
				 * @member ns.widget.core.scroller.scrollbar.type.interface
				 */
				start: function (/* scrollbarElement, barElement */) {
				},
				/**
				 * ...
				 * @method end
				 * @static
				 * @member ns.widget.core.scroller.scrollbar.type.interface
				 */
				end: function (/* scrollbarElement, barElement */) {
				},
				/**
				 * ...
				 * @method offset
				 * @static
				 * @member ns.widget.core.scroller.scrollbar.type.interface
				 */
				offset: function (/* orientation, offset  */) {
				}
			};
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
