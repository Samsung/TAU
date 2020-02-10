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
/**
 * #Checkbox
 * Checkbox component changes the default browser checkboxes to a form more adapted to the mobile
 * environment.
 *
 * @since 2.4
 * @class ns.widget.core.Checkbox
 * @extends ns.widget.BaseWidget
 */
/*jslint nomen: true, plusplus: true */
/**
 * #Checkbox
 *
 * ## HTML examples
 *
 * ### Basic use
 *      @example template
 *      <input type="checkbox"/>
 *
 * ### Checkbox with label
 *      @example tau-checkbox
 *      <input type="checkbox" name="${5:mycheck}" id="${3:check-test}" checked="${2:checked}"/>\n<label for="${4:check-test}">${1:Checkbox}</label>
 *
 * @class ns.widget.core.Checkbox
 * @component-selector input[type="checkbox"]:not(.ui-slider-switch-input):not([data-role="toggleswitch"]):not(.ui-toggleswitch):not(.ui-switch-input), input.ui-checkbox
 * @component-type standalone-component
 * @component-attachable true
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../core",
			"../../engine",
			"../../event",
			"../BaseWidget",
			"../BaseKeyboardSupport"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				BaseKeyboardSupport = ns.widget.core.BaseKeyboardSupport,
				keyCodes = BaseKeyboardSupport.KEY_CODES,
				engine = ns.engine,
				eventUtils = ns.event,
				Checkbox = function () {
					this.element = null;

					BaseKeyboardSupport.call(this);
				},
				classes = {
					checkbox: "ui-checkbox",
					focus: "ui-checkbox-focus"
				},
				prototype = new BaseWidget();

			Checkbox.prototype = prototype;

			/**
			 * Build Checkbox widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Checkbox
			 * @instance
			 */
			prototype._build = function (element) {
				if (element.getAttribute("type") === "checkbox") {
					element.classList.add(classes.checkbox);
				}
				return element;
			};

			/**
			 * Returns the value of checkbox
			 * @method _getValue
			 * @member ns.widget.core.Checkbox
			 * @return {?string}
			 * @protected
			 */
			prototype._getValue = function () {
				return this.element.value;
			};

			/**
			 * Set value to the checkbox
			 * @method _setValue
			 * @param {string} value
			 * @member ns.widget.core.Checkbox
			 * @return {ns.widget.core.Checkbox}
			 * @protected
			 */
			prototype._setValue = function (value) {
				this.element.value = value;
			};

			/**
			 * Set focus on widget
			 * @method _focus
			 * @member ns.widget.core.Checkbox
			 * @protected
			 */
			prototype._focus = function () {
				var self = this,
					element = self.element;

				element.focus();
			};

			/**
			 * Blurs focus from widget
			 * @method _blur
			 * @member ns.widget.core.Checkbox
			 * @protected
			 */
			prototype._blur = function () {
				var self = this,
					element = self.element;

				element.blur();
			};

			/**
			 * Checkbox element focus callback
			 * @method _onFocus
			 * @member ns.widget.core.Checkbox
			 * @protected
			 */
			prototype._onFocus = function () {
				var self = this,
					element = self.element;

				if (ns.getConfig("keyboardSupport", false)) {
					element.classList.add(classes.focus);
				}
			};

			/**
			 * Checkbox element blur callback
			 * @method _onBlur
			 * @member ns.widget.core.Checkbox
			 * @protected
			 */
			prototype._onBlur = function () {
				var self = this,
					element = self.element;

				if (ns.getConfig("keyboardSupport", false)) {
					element.classList.remove(classes.focus);
				}
			};

			/**
			 * Checkbox element keyup callback
			 * @method _onKeyUp
			 * @param {Event} event
			 * @member ns.widget.core.Checkbox
			 * @protected
			 */
			prototype._onKeyUp = function (event) {
				var self = this,
					element = self.element;

				if (event.keyCode === keyCodes.enter) {
					eventUtils.trigger(element, "input");
					element.checked = !element.checked;
					eventUtils.trigger(element, "change");
				}
			}

			/**
			 * Bind events to widgets
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @member ns.widget.core.Checkbox
			 * @protected
			 */
			prototype._bindEvents = function (element) {
				var self = this;

				self._focusCallbackBound = self._onFocus.bind(self);
				self._blurCallbackBound = self._onBlur.bind(self);
				self._keyupCallbackBound = self._onKeyUp.bind(self);

				element.addEventListener("focus", self._focusCallbackBound, false);
				element.addEventListener("blur", self._blurCallbackBound, false);
				element.addEventListener("keyup", self._keyupCallbackBound, false);
			}

			/**
			 * Unbinds events from widget
			 * @method _unbindEvents
			 * @param {HTMLElement} element
			 * @member ns.widget.core.Checkbox
			 * @protected
			 */
			prototype._unbindEvents = function (element) {
				var self = this;

				element.removeEventListener("focus", self._focusCallbackBound, false);
				element.removeEventListener("blur", self._blurCallbackBound, false);
				element.reEventListener("keyup", self._keyupCallbackBound, false);
			}

			// definition
			ns.widget.core.Checkbox = Checkbox;

			BaseKeyboardSupport.registerActiveSelector("input[type='checkbox'], input.ui-checkbox");

			engine.defineWidget(
				"Checkbox",
				"input[type='checkbox']:not(.ui-slider-switch-input):not([data-role='toggleswitch']):not([data-role='on-off-switch'])" +
				":not(.ui-toggleswitch):not(.ui-toggle-switch):not(.ui-on-off-switch), input.ui-checkbox",
				[],
				Checkbox,
				"core",
				false,
				false,
				HTMLInputElement
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Checkbox;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
