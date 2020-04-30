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
 * #Radio
 *
 *     @example template tau-radio
 *         <input type="radio"/>
 *
 * @class ns.widget.core.Radio
 * @component-selector input[type=radio]
 * @component-type standalone-component
 * @since 2.4
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../core",
			"../../engine",
			"../BaseWidget",
			"../BaseKeyboardSupport",
			"../../event"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				BaseKeyboardSupport = ns.widget.core.BaseKeyboardSupport,
				KEY_CODES = BaseKeyboardSupport.KEY_CODES,
				Radio = function () {
					BaseKeyboardSupport.call(self);
					this.element = null;
				},
				classes = {
					/**
					 * Standard radio widget
					 * @style ui-radio
					 * @member ns.widget.core.Radio
					 */
					radio: "ui-radio",
					focus: "ui-radio-focus",
					backwardAnimation: "ui-radio-backward-animation"
				},
				events = ns.event,
				prototype = new BaseWidget();

			Radio.prototype = prototype;

			/**
			 * Build Radio widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.Radio
			 * @instance
			 */
			prototype._build = function (element) {
				if (element.getAttribute("type") === "radio") {
					element.classList.add(classes.radio);
				}

				return element;
			};

			/**
			 * Focus callback
			 * @protected
			 * @member ns.widget.Radio
			 */
			prototype._onFocus = function () {
				var element = this.element;

				if (ns.getConfig("keyboardSupport", false)) {
					element.focus();
					element.classList.add(classes.focus)
				}
			}

			/**
			 * Blur callback
			 * @protected
			 * @member ns.widget.Radio
			 */
			prototype._onBlur = function () {
				var element = this.element;

				if (ns.getConfig("keyboardSupport", false)) {
					element.blur();
					element.classList.remove(classes.focus)
				}
			}

			/**
			 * KeyUp callback
			 * @protected
			 * @param {Event} event
			 * @member ns.widget.Radio
			 */
			prototype._onKeyUp = function (event) {
				var element = this.element;

				if (ns.getConfig("keyboardSupport", false)) {
					if (event.keyCode === KEY_CODES.enter) {
						element.checked = true;
						events.trigger(element, "change");
					}
				}
			}

			/**
			 * Handle events
			 * @protected
			 * @member ns.widget.Radio
			 */
			prototype.handleEvent = function (event) {
				var self = this;

				switch (event.type) {
					case "focus":
						self._onFocus(event);
						break;
					case "blur":
						self._onBlur(event);
						break;
					case "keyup":
						self._onKeyUp(event);
						break;
					case "animationend":
					case "animationEnd":
					case "webkitAnimationEnd":
						self._onAnimationEnd(event);
						break;
				}
			}

			prototype._onAnimationEnd = function (event) {
				event.target.classList.toggle(classes.backwardAnimation, event.target.checked);
			};

			/**
			 * Binds events to a Radio widget
			 * @method _bindEvents
			 * @member ns.widget.core.Radio
			 * @protected
			 */
			prototype._bindEvents = function (element) {
				events.on(element, "focus blur keyup animationend animationEnd webkitAnimationEnd", this, false);
			}

			/**
			 * Unbinds events from a Radio widget
			 * @method _bindEvents
			 * @member ns.widget.core.Radio
			 * @protected
			 */
			prototype._unbindEvents = function (element) {
				events.off(element, "focus blur keyup animationend animationEnd webkitAnimationEnd", this, false);
			};

			/**
			 * Returns the value of radio
			 * @method _getValue
			 * @member ns.widget.Radio
			 * @return {?string}
			 * @protected
			 */
			prototype._getValue = function () {
				return this.element.value;
			};

			/**
			 * Set value to the radio
			 * @method _setValue
			 * @param {string} value
			 * @member ns.widget.Radio
			 * @return {ns.widget.Radio}
			 * @protected
			 */
			prototype._setValue = function (value) {
				this.element.value = value;
			};

			// definition
			ns.widget.core.Radio = Radio;
			engine.defineWidget(
				"Radio",
				"input[type='radio'], input.ui-radio",
				[],
				Radio,
				"core",
				false,
				false,
				HTMLInputElement
			);

			BaseKeyboardSupport.registerActiveSelector("input[type='radio'], input.ui-radio");

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.Radio;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
