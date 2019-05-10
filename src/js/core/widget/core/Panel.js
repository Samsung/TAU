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
/*jslint nomen: true, plusplus: true */
/**
 * #Panel
 * Panel is component that can have header, content, footer, listview and so on like the page component.
 *
 * Panel has been made that developer can implement to multi panel in one page.
 * But, Panel don't need to implement in one html file. Panel can be existed other html files.
 * PanelChanger controlled Panel lifecycle so If you implement to Panel in PanelChanger, you can experience UX that multi page existed in one page.
 *
 * @class ns.widget.core.Panel
 * @extends ns.widget.BaseWidget
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../event",
			"../../util/selectors",
			"../BaseWidget",
			"../core"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				events = ns.event,
				classes = {
					/**
					 * Standard panel widget
					 * @style ui-panel
					 * @member ns.widget.core.Panel
					 */
					PANEL: "ui-panel",
					/**
					 * Set panel widget as active
					 * @style ui-panel-active
					 * @member ns.widget.core.Panel
					 */
					ACTIVE_PANEL: "ui-panel-active"
				},
				EVENT_TYPE = {
					BEFORE_CREATE: "panelbeforecreate",
					CREATE: "panelcreate",
					BEFORE_SHOW: "panelbeforeshow",
					SHOW: "panelshow",
					BEFORE_HIDE: "panelbeforehide",
					HIDE: "panelhide",
					CHANGE: "panelchange"
				},
				Panel = function () {
				},
				prototype = new BaseWidget();

			Panel.eventType = EVENT_TYPE;
			Panel.classes = classes;
			Panel.prototype = prototype;

			/**
			 * Build Panel component
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement} Returns built element
			 * @member ns.widget.core.Panel
			 * @protected
			 */
			prototype._build = function (element) {
				var routePanel = ns.router.Router.getInstance().getRoute("panel");

				element.classList.add(classes.PANEL);
				routePanel.setActive(element);

				return element;
			};

			/**
			 * Destroy Panel component
			 * @method _destroy
			 * @param {HTMLElement} element
			 * @return {HTMLElement} Returns built element
			 * @member ns.widget.core.Panel
			 * @protected
			 */
			prototype._destroy = function (element) {
				events.trigger(element, EVENT_TYPE.HIDE);
			};
			// definition
			ns.widget.core.Panel = Panel;

			engine.defineWidget(
				"Panel",
				"[data-role='panel'], .ui-panel",
				[],
				Panel,
				"core"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
