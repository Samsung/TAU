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
 * @class ns.widget.mobile.Tab
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../util/selectors",
			"../../util/grid",
			"../../util/DOM/attributes",
			"../../event/vmouse",
			"./Scrollview",
			"../../event",
			"../BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				events = ns.event,
				Tab = function () {
				},
				/**
				 * Object with class dictionary
				 * @property {Object} classes
				 * @static
				 * @member ns.widget.mobile.Tab
				 * @readonly
				 */
				classes = {},
				CustomEvent = {
					TAB_CHANGE: "tabchange"
				},
				prototype = new BaseWidget();

			Tab.prototype = prototype;
			Tab.classes = classes;

			/**
			 * Set the active tab
			 * @method setActive
			 * @param {number} index of the tab
			 * @public
			 * @member ns.widget.mobile.Tab
			 */
			prototype._setActive = function (index) {
				var element = this.element;

				events.trigger(element, CustomEvent.TAB_CHANGE, {
					active: index
				});
			};
			/**
			 * Set the active tab
			 * @method setActive
			 * @param {number} index of the tab
			 * @public
			 * @member ns.widget.mobile.Tab
			 */
			prototype.setActive = function (index) {
				this._setActive(index);
			};

			/**
			 * Get the active tab
			 * @method setActive
			 * @public
			 * @member ns.widget.mobile.Tab
			 */
			prototype._getActive = function () {
				return this.options.active;
			};

			/**
			 * Get the active tab
			 * @method setActive
			 * @public
			 * @member ns.widget.mobile.Tab
			 */
			prototype.getActive = function () {
				return this._getActive();
			};

			ns.widget.core.Tab = Tab;
			engine.defineWidget(
				"Tab",
				"",
				["setActive", "getActive"],
				Tab,
				"tizen"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.Tab;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
