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
 *
 * Copyright (c) 2010 - 2014 Samsung Electronics Co., Ltd.
 * License : MIT License V2
 */
/**
 * #Namespace For Widgets
 * Namespace For Widgets
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @class ns.widget
 */
(function (document) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"./core",
			"./engine"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var engine = ns.engine,
				eventType = engine.eventType,
				widget = {
					/**
					 * Get bound widget for element
					 * @method getInstance
					 * @static
					 * @param {HTMLElement|string} element
					 * @param {string} type widget name
					 * @return {?Object}
					 * @member ns.widget
					 */
					getInstance: engine.getBinding,
					/**
					 * Returns Get all bound widget for element or id gives as parameter
					 * @method getAllInstances
					 * @param {HTMLElement|string} element
					 * @return {?Object}
					 * @static
					 * @member ns.widget
					 */
					getAllInstances: engine.getAllBindings
				};

			function mapWidgetDefinition(name, element, options) {
				var widgetParams = {
					name: name,
					element: element,
					options: options
				}

				return widgetParams;
			}

			function widgetConstructor(name, element, options) {
				var widgetParams = mapWidgetDefinition(name, element, options);

				return engine.instanceWidget(widgetParams.element, widgetParams.name, widgetParams.options);
			}

			/**
			 * Register simple widget constructor in namespace
			 * @param {Event} event
			 */
			function defineWidget(event) {
				var definition = event.detail,
					name = definition.name;

				ns.widget[name] = widgetConstructor.bind(null, name);
			}

			/**
			 * Remove event listeners on framework destroy
			 */
			function destroy() {
				document.removeEventListener(eventType.WIDGET_DEFINED, defineWidget, true);
				document.removeEventListener(eventType.DESTROY, destroy, false);
			}

			document.addEventListener(eventType.WIDGET_DEFINED, defineWidget, true);
			document.addEventListener(eventType.DESTROY, destroy, false);

			/** @namespace ns.widget */
			ns.widget = widget;
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document));
