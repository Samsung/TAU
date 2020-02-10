/*global window, ns, define */
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
 * #Drawer Widget
 * Drawer widget provide creating drawer widget and managing drawer operation.
 *
 * @since 2.3
 * @class ns.widget.mobile.Drawer
 * @component-selector .ui-drawer, [data-role]="drawer"
 * @extends ns.widget.core.Drawer
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/widget/core/Drawer",
			"../../../core/engine"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var CoreDrawer = ns.widget.core.Drawer,
				engine = ns.engine,
				Drawer = function () {
					CoreDrawer.call(this);
				},
				prototype = new CoreDrawer();

			Drawer.prototype = prototype;

			/**
			 * Configure Drawer widget
			 * @method _configure
			 * @protected
			 * @member ns.widget.mobile.Drawer
			 */
			prototype._configure = function () {
				var self = this;
				/**
				 * Widget options
				 * @property {string} [options.drawerTarget="ui-page"] Drawer appended target. Value type is CSS selector type.
				 * @property {string} [options.position="left"] Drawer position. "left" or "right"
				 * @property {boolean} [options.enable=true] Enable drawer component.
				 * @property {Number} [options.dragEdge=0.05] Start dragging gesture possible area ratio of target or handler between 0 and 1.
				 * @member ns.widget.mobile.Drawer
				 */

				self.options.dragEdge = 0.05;
			};

			ns.widget.mobile.Drawer = Drawer;
			engine.defineWidget(
				"Drawer",
				"[data-role='drawer'], .ui-drawer",
				[
					"transition",
					"setDragHandler",
					"open",
					"close",
					"isOpen",
					"getState"
				],
				Drawer,
				"mobile"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Drawer;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
