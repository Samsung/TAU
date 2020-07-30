/*global define, ns */
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
/*jslint nomen: true */
/**
 * # Chips
 * Small button containing text value with assign itself remove action
 *
 * ## Default selectors
 * All elements with class _.ui-chip_ are changed to chips component.
 *
 * ###HTML Examples
 *
 * ####Create chip div using data-role
 *
 *		@example
 *		<div class="ui-chip">Text</div>
 *
 * ## Manual constructor
 * For manual creation of Chip component you can use constructor of component
 * from **tau** namespace:
 *
 *		@example
 *		<script>
 *			var chipElement = document.getElementById("chip"),
 *				chip = tau.widget.Chip(chipElement);
 *		</script>
 *
 * Constructor has one require parameter **element** which are base
 * **HTMLElement** to create widget. We recommend get this element by method
 * *document.getElementById*. Second parameter is **options** and it is
 * a object with options for widget.
 *
 * ##Options for Chip Widget
 *
 * You can change option for widget using method **option**.
 *
 * ##Methods
 *
 * To call method on widget you can use one of existing API:
 *
 *		@example
 *		var chipElement = document.getElementById("chip"),
 *			chip = tau.widget.Chip(chipElement);
 *
 *		chip.methodName(methodArgument1, methodArgument2, ...);
 *
 * @since 1.2
 * @class ns.widget.mobile.Chip
 * @component-selector .ui-chip [data-role]="chip"
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/event",
			"../widget",
			"./BaseWidgetMobile",
			"./Button"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * @property {Object} BaseWidget alias variable
			 * @private
			 * @static
			 */
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				/**
				 * @property {Object} engine alias variable
				 * @private
				 * @static
				 */
				engine = ns.engine,
				/**
				 * @property {Object} eventUtil alias variable
				 * @private
				 * @static
				 */
				eventUtil = ns.event,

				Chip = function () {
					var self = this;

					/**
					 * Chip widget options.
					 * @property {string} [options.icon="delete"] icon on chip button
					 */
					self.options = {
						icon: "delete"
					};

					self._ui = {
						text: null,
						button: null
					};
				},

				/**
				 * Dictionary object containing commonly used widget classes
				 * @property {Object} classes
				 * @readonly
				 * @static
				 * @member ns.widget.mobile.Chip
				 */
				classes = {
					/**
					 * Standard chip widget
					 * @style ui-chip
					 * @member ns.widget.mobile.Chip
					 */
					widget: "ui-chip",
					/**
					 * Set text content of chip
					 * @style ui-chip-text
					 * @member ns.widget.mobile.Chip
					 */
					text: "ui-chip-text",
					/**
					 * Button to remove widget
					 * @style ui-chip-button
					 * @member ns.widget.mobile.Chip
					 */
					button: "ui-chip-button"
				},
				events = {
					/**
					 * Widget triggers this event before remove itself
					 * @type {Event}
					 * @member ns.widget.mobile.Chip
					 */
					BEFORE_REMOVE: "chipbeforeremove"
				},
				selectors = {
					widget: "." + classes.widget + ", [data-role='chip']",
					text: "." + classes.text,
					button: "." + classes.button
				},
				prototype = new BaseWidget();


			Chip.prototype = prototype;
			Chip.classes = classes;
			Chip.events = events;

			/**
			 * On click handler
			 * @method _onClick
			 * @protected
			 * @member ns.widget.mobile.Chip
			 */
			prototype._onClick = function () {
				var self = this,
					notPrevented;

				notPrevented = eventUtil.trigger(self.element, events.BEFORE_REMOVE);
				if (notPrevented) {
					self.element.parentElement.removeChild(self.element);
				}
				self.destroy();
			};

			/**
			 * Common handle event for widget
			 * @method handleEvent
			 * @protected
			 * @param {Event} event
			 * @member ns.widget.mobile.Chip
			 */
			prototype.handleEvent = function (event) {
				if (event.type === "vclick") {
					this._onClick(event);
				}
			};

			/**
			 * Build widget structure
			 * @method _build
			 * @protected
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.mobile.Chip
			 */
			prototype._build = function (element) {
				var self = this,
					ui = self._ui,
					text,
					button;

				button = element.querySelector(selectors.button);
				if (button) {
					element.removeChild(button);
				}

				text = element.querySelector(selectors.text) ||
					element.querySelector("*:not(" + selectors.button + ")");

				if (text) {
					element.removeChild(text);
				} else {
					text = document.createElement("span");
					text.className = classes.text;
					text.innerHTML = element.textContent;
				}

				element.textContent = "";

				if (!button) {
					button = document.createElement("button");
					button.className = ["ui-btn", classes.button].join(" ");
					button.setAttribute("data-icon", "minus");
					button.setAttribute("data-style", "flat");
				}

				element.appendChild(text);
				element.appendChild(button);

				ui.text = text;
				ui.button = button;

				return element;
			};

			prototype._getButtonIcon = function () {
				var self = this,
					options = self.options;

				if (options.icon === "delete") {
					return "minus";
				} else if (options.icon === "add") {
					return "plus"
				}
				return "unknown";
			};

			/**
			 * Init widget structure
			 * @method _init
			 * @protected
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.mobile.Chip
			 */
			prototype._init = function (element) {
				var self = this,
					ui = self._ui;

				ui.text = ui.text || element.querySelector(selectors.text);
				ui.button = ui.button || element.querySelector(selectors.button);

				ns.widget.Button(ui.button, {
					icon: self._getButtonIcon()
				});

				return element;
			};

			/**
			 * Bind widget events
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.mobile.Chip
			 */
			prototype._bindEvents = function () {
				var self = this,
					button = self._ui.button;

				eventUtil.on(button, "vclick", self, false);
			};

			/**
			 * Unbind widget events
			 * @method _unbindEvents
			 * @protected
			 * @member ns.widget.mobile.Chip
			 */
			prototype._unbindEvents = function () {
				var self = this,
					button = self._ui.button;

				eventUtil.off(button, "vclick", self, false);
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.mobile.Chip
			 */
			prototype._destroy = function () {
				var self = this;

				self._unbindEvents();

				self._ui = null;

				eventUtil.trigger(document, "destroyed", {
					widget: "Chip"
				});
			};

			// definition
			ns.widget.mobile.Chip = Chip;
			engine.defineWidget(
				"Chip",
				selectors.widget,
				[],
				Chip,
				"mobile"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Chip;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
