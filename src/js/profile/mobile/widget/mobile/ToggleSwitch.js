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
 * # Toggle Switch
 * Toggle switch component is a common UI element used for binary on/off or true/false data input.
 *
 * The toggle switch widget shows a 2-state switch on the screen.
 * If defined with select type with options it creates toggles
 * On the toggle its possible to tap one side of the switch.
 *
 * We still support toggles defined with select tag for backward compatibility
 *
 * ## Default selectors
 * INPUT tags with _data-role=toggleswitch_ or SELECT tags
 * with _data-role=toggleswitch_
 * changed to toggle switch
 * To add a toggle switch widget to the application, use the following code:
 *
 *        @example
 *        <input type="checkbox" data-role="toggleswitch">
 *
 *        @example
 *        <select name="flip-11" id="flip-11" data-role="toggleswitch">
 *            <option value="off"></option>
 *            <option value="on"></option>
 *        </select>
 *
 *        @example
 *        <select name="flip-11" id="flip-11" data-role="toggleswitch">
 *            <option value="off">off option</option>
 *            <option value="on">on option</option>
 *        </select>
 *
 * ## Manual constructor
 * For manual creation of toggle switch widget you can use constructor of
 * widget from **tau** namespace:
 *
 *        @example
 *        <select id="toggle" name="flip-11" id="flip-11" data-role="toggleswitch"
 *        data-mini="true">
 *            <option value="off"></option>
 *            <option value="on"></option>
 *        </select>
 *        <script>
 *            var toggleElement = document.getElementById("toggle"),
 *                toggle = tau.widget.ToggleSwitch(toggleElement);
 *        </script>
 *
 * ## JavaScript API
 *
 * ToggleSwitch widget hasn't JavaScript API.
 *
 * @since 2.0
 * @class ns.widget.mobile.ToggleSwitch
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/util/DOM/attributes",
			"../../../../core/util/DOM/manipulation",
			"../../../../core/util/string",
			"../../../../core/event",
			"../../../../core/widget/core/Button",
			"../../../../core/widget/BaseKeyboardSupport",
			"../mobile", // fetch namespace
			"./BaseWidgetMobile"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var ToggleSwitch = function () {
					var self = this;

					/**
					 * Options for widget
					 * @property {Object} options
					 * @property {"circle"|"slider"} [options.style="circle"] ToggleSwitch display style
					 * @member ns.widget.mobile.ToggleSwitch
					 */
					self.options = {
						style: "circle"
					},
					self._ui = {};
				},
				BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				BaseKeyboardSupport = ns.widget.core.BaseKeyboardSupport,
				engine = ns.engine,
				stringUtils = ns.util.string,
				events = ns.event,

				classes = {
					toggleContainer: "ui-toggle-container",
					toggle: "ui-toggle-switch",
					toggleHandler: "ui-switch-handler",
					toggleSliderContainer: "ui-toggle-slider-container",
					toggleSlider: "ui-toggle-slider",
					toggleContainerFocus: "ui-toggle-switch-focus"
				},
				keyCode = {
					HOME: 36,
					END: 35,
					PAGE_UP: 33,
					PAGE_DOWN: 34,
					UP: 38,
					RIGHT: 39,
					DOWN: 40,
					LEFT: 37,
					ENTER: 13,
					SPACE: 32
				};

			ToggleSwitch.prototype = new BaseWidget();

			/**
			 * Dictionary for ToggleSwitch related css class names
			 * @property {Object} classes
			 * @member ns.widget.mobile.ToggleSwitch
			 * @static
			 * @readonly
			 */
			ToggleSwitch.classes = classes;

			/**
			 * Dictionary for keyboard codes
			 * @property {Object} keyCode
			 * @member ns.widget.mobile.ToggleSwitch
			 * @static
			 * @readonly
			 */
			ToggleSwitch.keyCode = keyCode;


			/**
			 * Callback change the value of input type=checkbox
			 * (method strictly for toggleswitch based oninput tag)
			 * @method onChangeValue
			 * @param {ns.widget.mobile.ToggleSwitch} self
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			function onChangeValue(self) {
				var element = self.element;

				element.selectedIndex = (self._ui.input.checked) ? 1 : 0;

				if (self._type === "select") {
					events.trigger(element, "change");
				}
			}

			/**
			 * Simplify creating dom elements
			 * (method strictly for toggleswitch based oninput tag)
			 * @method createElement
			 * @param {string} name
			 * @return {HTMLElement}
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			function createElement(name) {
				return document.createElement(name);
			}

			/**
			 * Creates and set up input element
			 * @method setUpInput
			 * @return {HTMLElement}
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			function setUpInput() {
				var inputElement = createElement("input");

				inputElement.type = "checkbox";
				return inputElement;
			}

			/**
			 * Build Toggle based on Select Tag
			 * @method buildToggleBasedOnSelectTag
			 * @param {HTMLElement} element
			 * @param {HTMLElement} divHandler
			 * @param {HTMLElement} toggleContainer
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			function buildToggleBasedOnSelectTag(element, divHandler, toggleContainer) {
				var inputElement;

				element.style.display = "none";
				element.parentNode.insertBefore(toggleContainer, element);
				inputElement = setUpInput();

				if (element.hasAttribute("disabled")) {
					inputElement.setAttribute("disabled", "disabled");
				}

				inputElement.className = classes.toggle;
				toggleContainer.className = stringUtils.removeExactTags(
					element.className,
					classes.toggleContainer,
					inputElement.className
				);

				toggleContainer.className = classes.toggleContainer;

				toggleContainer.appendChild(inputElement);
				toggleContainer.appendChild(divHandler);
				toggleContainer.appendChild(element);

			}

			/**
			 * Build Toggle based on Input Tag
			 * @method buildToggleBasedOnInputTag
			 * @param {HTMLElement} element
			 * @param {HTMLElement} divHandler
			 * @param {HTMLElement} toggleContainer
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			function buildToggleBasedOnInputTag(element, divHandler, toggleContainer) {
				toggleContainer.className = stringUtils.removeExactTags(
					element.className,
					classes.toggleContainer
				) + " " + classes.toggleContainer;
				element.className = classes.toggle;

				element.parentNode.insertBefore(toggleContainer, element);
				toggleContainer.appendChild(element);
				toggleContainer.appendChild(divHandler);
			}

			/**
			 * Build Toggle Slider on Input Tag
			 * @method buildToggleSliderBasedOnInputTag
			 * @param {HTMLElement} element
			 * @param {HTMLElement} toggleContainer
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			function buildToggleSliderBasedOnInputTag(element, toggleContainer) {
				var slider;

				toggleContainer.classList.add(classes.toggleSliderContainer);

				slider = createElement("div");
				slider.classList.add(classes.toggleSlider);

				element.parentNode.insertBefore(toggleContainer, element);

				toggleContainer.appendChild(element);
				toggleContainer.appendChild(slider);

				return element;
			}

			/**
			 * Build Toggle based on Custom Element
			 * @method buildToggleBasedOnCustomElement
			 * @param {HTMLElement} divHandler
			 * @param {HTMLElement} toggleContainer
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			function buildToggleBasedOnCustomElement(divHandler, toggleContainer) {
				var inputElement = setUpInput();

				inputElement.className = classes.toggle;
				toggleContainer.className = stringUtils.removeExactTags(
					divHandler.className,
					classes.toggleContainer,
					inputElement.className
				);

				toggleContainer.appendChild(inputElement);
				toggleContainer.appendChild(divHandler);

				if (toggleContainer.hasAttribute("disabled")) {
					inputElement.setAttribute("disabled", "disabled");
				}
			}

			/**
			 * Build ToggleSwitch
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			ToggleSwitch.prototype._build = function (element) {
				var divHandler = createElement("div"),
					toggleContainer = createElement("div"),
					controlType = element.nodeName.toLowerCase(),
					options = this.options;

				if (controlType === "input") {
					if (options.style === "slider") {
						buildToggleSliderBasedOnInputTag(element, toggleContainer);
					} else {
						buildToggleBasedOnInputTag(element, divHandler, toggleContainer);
					}
				}
				if (controlType === "select") {
					buildToggleBasedOnSelectTag(element, divHandler, toggleContainer);
				}
				if (controlType === "tau-toggleswitch") {
					buildToggleBasedOnCustomElement(divHandler, element);
				}

				divHandler.className = classes.toggleHandler;

				this._type = controlType;
				this._ui.toggleContainer = toggleContainer;

				return element;
			};

			/**
			 * Initiate widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.ToggleSwitch
			 * @instance
			 */
			ToggleSwitch.prototype._init = function (element) {
				this._ui.input = element.parentElement.firstChild;
			};

			/**
			 * Get value of toggle switch. If widget is based on input type
			 * tag otherwise it return index of the element
			 * @method _getValue
			 * @protected
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			ToggleSwitch.prototype._getValue = function () {
				var self = this,
					element = self.element;

				return self._type === "input" ?
					parseFloat(element.value) : element.selectedIndex;
			};

			/**
			 * Set value of toggle switch
			 * @method _setValue
			 * @param {string} value
			 * @protected
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			ToggleSwitch.prototype._setValue = function (value) {
				var self = this,
					element = self.element;

				if (self._type === "input") {
					element.value = value;
				}

				if (["checkbox", "radio"].indexOf(element.type) > -1) {
					element.checked = !!value;
				}

				if (self._type === "select") {
					element.selectedIndex = value;
				}
			};

			/**
			 * Binds events to widget
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.mobile.ToggleSwitch
			 * @instance
			 */
			ToggleSwitch.prototype._bindEvents = function () {
				var self = this,
					input = self._ui.input,
					onChangeBound = onChangeValue.bind(null, self),
					onFocusBound = self._focus.bind(self),
					onBlurBound = self._blur.bind(self),
					onKeyUpBound = self._keyUp.bind(self);

				input.addEventListener("change", onChangeBound, true);
				input.addEventListener("focus", onFocusBound, true);
				input.addEventListener("blur", onBlurBound, true);
				input.addEventListener("keyup", onKeyUpBound, true);
			};

			/**
			 * remove attributes when destroyed
			 * @method removeAttributesWhenDestroy
			 * @param {HTMLElement} element
			 * @private
			 * @static
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			function removeAttributesWhenDestroy(element) {
				element.removeAttribute("data-tau-name");
				element.removeAttribute("aria-disabled");
				element.removeAttribute("data-tau-bound");
				element.removeAttribute("data-tau-built");
			}

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.mobile.ToggleSwitch
			 */
			ToggleSwitch.prototype._destroy = function () {
				var self = this,
					element = self.element,
					tagName = self._type,
					container = element.parentElement;

				self._ui.input.removeEventListener("change",
					self._onChangeValue, true);

				removeAttributesWhenDestroy(element);

				//remove visible representative
				if (tagName === "input" || tagName === "select") {
					if (container.parentElement) {
						container.parentElement.insertBefore(element, container);
						container.parentElement.removeChild(container);
					}
				}

				if (tagName === "input") {
					element.classList.remove(classes.toggle);
				}

				events.trigger(document, "destroyed", {
					widget: "ToggleSwitch",
					parent: element.parentNode
				});
			};

			ToggleSwitch.prototype._focus = function () {
				var elementClassList;

				if (ns.getConfig("keyboardSupport", false)) {
					elementClassList = this.element.parentElement.classList;
					elementClassList.add(classes.toggleContainerFocus);
					this.element.focus();
				}
			};

			ToggleSwitch.prototype._blur = function () {
				var elementClassList;

				if (ns.getConfig("keyboardSupport", false)) {
					elementClassList = this.element.parentElement.classList;
					elementClassList.remove(classes.toggleContainerFocus);
					this.element.blur();
				}
			};

			ToggleSwitch.prototype._keyUp = function (event) {
				if (event.keyCode === keyCode.ENTER) {
					this._ui.input.checked = !this._ui.input.checked;
				}
			};

			ToggleSwitch.prototype._getContainer = function () {
				return this._ui.toggleContainer;
			}

			ns.widget.mobile.ToggleSwitch = ToggleSwitch;
			engine.defineWidget(
				"ToggleSwitch",
				"input[data-role='toggleswitch']," +
				"select[data-role='toggleswitch']," +
				"select.ui-toggleswitch," +
				"input.ui-toggleswitch",
				[],
				ToggleSwitch,
				"mobile"
			);

			BaseKeyboardSupport.registerActiveSelector("input[data-role='toggleswitch'], select[data-role='toggleswitch'], select.ui-toggleswitch, input.ui-toggleswitch, input.ui-toggle-switch");

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.ToggleSwitch;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
