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
/*jslint nomen: true */
/**
 * #BaseWidgetMobile
 * Extension of class BaseWidget for mobile profile.
 * This class has compatibility properties and methods with jQuery Mobile Widget.
 * @class ns.widget.mobile.BaseWidgetMobile
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/widget/BaseWidget",
			"../widget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var BaseWidgetMobile = function () {
					this.options = {};
				},
				BaseWidget = ns.widget.BaseWidget,
				basePrototype = BaseWidget.prototype,
				parentConfigure = basePrototype.configure,
				parentDisable = basePrototype.disable,
				parentEnable = basePrototype.enable,
				prototype = new BaseWidget(),
				slice = [].slice;

			BaseWidgetMobile.classes = BaseWidget.classes;

			/**
			 * Configures widget object from definition.
			 * @method configure
			 * @param {Object} definition
			 * @param {string} definition.name Name of widget
			 * @param {string} definition.selector Selector of widget
			 * @param {string} definition.binding Path to file with widget (without extension)
			 * @param {HTMLElement} element
			 * @param {Object} options Configure options
			 * @member ns.widget.mobile.BaseWidgetMobile
			 * @return {HTMLElement}
			 * @instance
			 */
			prototype.configure = function (definition, element, options) {
				var self = this,
					definitionName,
					widgetName;

				element = parentConfigure.call(self, definition, element, options);
				if (definition) {
					definitionName = definition.name;
					widgetName = definitionName && definitionName.toLowerCase();
					/**
					 * @property {string} widgetName Widget base class
					 * @member ns.widget.mobile.BaseWidgetMobile
					 * @instance
					 */
					self.widgetName = widgetName;
					/**
					* @property {string} widgetBaseClass Widget base class
					* @member ns.widget.mobile.BaseWidgetMobile
					* @instance
					*/
					self.widgetBaseClass = self.namespace + "-" + widgetName;
					/**
					* @property {number} uuid Number id of widget instance
					* @member ns.widget.mobile.BaseWidgetMobile
					* @instance
					*/
					self.uuid = ns.getNumberUniqueId();

					/**
					 * @property {string} eventNamespace Namespace of widget events (suffix for events)
					 * @member ns.widget.mobile.BaseWidgetMobile
					 * @instance
					 */
					self.eventNamespace = "." + widgetName + (self.uuid || "");

					/**
					 * @property {string} [defaultElement='<div>'] Default element for the widget
					 * @member ns.widget.mobile.BaseWidgetMobile
					 * @instance
					 */
					self.defaultElement = "<div>";
				}

				return element;
			};

			/**
			* Disables widget.
			* @method disable
			* @member ns.widget.mobile.BaseWidgetMobile
			* @instance
			*/
			prototype.disable = function () {
				var self = this,
					element = self.element,
					elementClasses = element.classList,
					args = slice.call(arguments);

				parentDisable.apply(self, args);
				elementClasses.add(self.widgetFullName + "-disabled");
			};

			/**
			* Enables widget.
			* @method enable
			* @member ns.widget.mobile.BaseWidgetMobile
			* @instance
			*/
			prototype.enable = function () {
				var self = this,
					element = self.element,
					elementClasses = element.classList,
					args = slice.call(arguments);

				parentEnable.apply(self, args);
				elementClasses.remove(self.widgetFullName + "-disabled");
			};

			/**
			* Throws exception.
			* @method raise
			* @param {?string} msg Message of throw
			* @member ns.widget.mobile.BaseWidgetMobile
			* @instance
			*/
			prototype.raise = function (msg) {
				throw "Widget [" + this.widgetName + "]: " + msg;
			};

			/**
			* Returns element of widget.
			* @method widget
			* @member ns.widget.mobile.BaseWidgetMobile
			* @return {HTMLElement}
			* @instance
			*/
			prototype.widget = function () {
				return this.element;
			};

			BaseWidgetMobile.prototype = prototype;

			// definition
			ns.widget.mobile.BaseWidgetMobile = BaseWidgetMobile;

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return BaseWidgetMobile;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
