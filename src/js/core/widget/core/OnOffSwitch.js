/*global define, ns */
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
 * # OnOff Switch
 * OnOff switch component is a common UI element used for binary on/off or true/false data input.
 *
 * The OnOff switch widget shows a 2-state switch on the screen.
 * If defined with select type with options it creates toggles
 * On the toggle its possible to tap one side of the switch.
 *
 * We still support toggles defined with select tag for backward compatibility
 *
 * ## Default selectors
 * INPUT tags with _data-role=on-off-switch_ or SELECT tags
 * with _data-role=on-off-switch_
 * changed to on-off switch
 * To add a on-off switch widget to the application, use the following code:
 *
 *        @example
 *        <input type="checkbox" data-role="on-off-switch">
 *
 *        @example
 *        <input type="checkbox" class="ui-on-off-switch">
 *
 *        @example
 *        <select name="flip-11" id="flip-11" data-role="on-off-switch">
 *            <option value="off"></option>
 *            <option value="on"></option>
 *        </select>
 *
 *        @example
 *        <select name="flip-11" id="flip-11" class="ui-on-off-switch">
 *            <option value="off">off option</option>
 *            <option value="on">on option</option>
 *        </select>
 *
 * ## Manual constructor
 * For manual creation of on-off switch widget you can use constructor of
 * widget from **tau** namespace:
 *
 *        @example
 *        <select id="toggle" name="flip-11" id="flip-11" data-role="on-off-switch"
 *        data-mini="true">
 *            <option value="off"></option>
 *            <option value="on"></option>
 *        </select>
 *        <script>
 *            var element = document.getElementById("toggle"),
 *                onOffSwitch = tau.widget.OnOffSwitch(element);
 *        </script>
 *
 * ## JavaScript API
 *
 * OnOffSwitch widget hasn't JavaScript API.
 *
 * @since 1.2
 * @class ns.widget.core.OnOffSwitch
 * @component-selector .ui-on-off-switch, [data-role]="on-off-switch, .ui-toggleswitch, [data-role]="toggleswitch"
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/util/DOM/attributes",
			"../../../core/util/DOM/manipulation",
			"../../../core/util/string",
			"../../../core/event",
			"./Button",
			"../BaseKeyboardSupport",
			"../core", // fetch namespace
			"../BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var OnOffSwitch = function () {
					var self = this;

					/**
					 * Options for widget
					 * @property {Object} options
					 * @property {"circle"|"slider"} [options.appearance="circle"] On-Off-Switch display appearance
					 * @member ns.widget.core.OnOffSwitch
					 */
					self.options = {
						appearance: "slider"
					};
					self._ui = {};
					self._callbacks = {};
					self._transform = {
						bgColor: {from: {r: 0, g: 0, b: 0, a: 0}, to: {r: 3, g: 129, b: 254, a: 1}},
						borderColor: {from: {r: 143, g: 143, b: 143, a: 1}, to: {r: 0, g: 0, b: 0, a: 0}}
					};
				},
				BaseWidget = ns.widget.BaseWidget,
				BaseKeyboardSupport = ns.widget.core.BaseKeyboardSupport,
				engine = ns.engine,
				stringUtils = ns.util.string,
				events = ns.event,
				widgetClass = "ui-on-off-switch",

				classes = {
					/**
					 * Set container for toggle switch widget
					 * @member ns.widget.core.OnOffSwitch
					 */
					toggleContainer: widgetClass + "-container",
					/**
					 * Standard toggle switch widget
					 * @member ns.widget.core.OnOffSwitch
					 */
					toggle: widgetClass,
					/**
					 * Set handler for toggle switch widget
					 * @member ns.widget.core.OnOffSwitch
					 */
					toggleHandler: widgetClass + "-button",
					/**
					 * Set class for input type checkbox
					 * @member ns.widget.core.OnOffSwitch
					 */
					toggleInput: widgetClass + "-input",
					/**
					 * Set class for handler during drag
					 * @member ns.widget.core.OnOffSwitch
					 */
					onDrag: widgetClass + "-button-on-drag",
					moveToOff: widgetClass + "-button-move-to-off",
					moveToOn: widgetClass + "-button-move-to-on",
					/**
					 * Set class for focused state (keyboard support)
					 * @member ns.widget.core.OnOffSwitch
					 */
					toggleContainerFocus: widgetClass + "-focus"
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
				},
				widgetSelector = "";

			OnOffSwitch.prototype = new BaseWidget();

			/**
			 * Dictionary for OnOffSwitch related css class names
			 * @property {Object} classes
			 * @member ns.widget.core.OnOffSwitch
			 * @static
			 * @readonly
			 */
			OnOffSwitch.classes = classes;

			/**
			 * Dictionary for keyboard codes
			 * @property {Object} keyCode
			 * @member ns.widget.core.OnOffSwitch
			 * @static
			 * @readonly
			 */
			OnOffSwitch.keyCode = keyCode;


			/**
			 * Callback change the value of input type=checkbox
			 * (method strictly for toggleswitch based oninput tag)
			 * @method onChangeValue
			 * @param {ns.widget.core.OnOffSwitch} self
			 * @private
			 * @static
			 * @member ns.widget.core.OnOffSwitch
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
			 * @member ns.widget.core.OnOffSwitch
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
			 * @member ns.widget.core.OnOffSwitch
			 */
			function setUpInput() {
				var inputElement = createElement("input");

				inputElement.type = "checkbox";
				inputElement.setAttribute("data-role", "none");
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
			 * @member ns.widget.core.OnOffSwitch
			 */
			function buildToggleBasedOnSelectTag(element, divHandler, toggleContainer) {
				var inputElement;

				element.style.display = "none";
				element.parentNode.insertBefore(toggleContainer, element);
				inputElement = setUpInput();

				if (element.hasAttribute("disabled")) {
					inputElement.setAttribute("disabled", "disabled");
				}

				inputElement.className = classes.toggleInput;
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
			 * @member ns.widget.core.OnOffSwitch
			 */
			function buildToggleBasedOnInputTag(element, divHandler, toggleContainer) {
				toggleContainer.className = classes.toggleContainer;

				element.classList.add(classes.toggleInput);
				divHandler.classList.add(classes.toggleHandler);

				element.parentNode.insertBefore(toggleContainer, element);
				toggleContainer.appendChild(element);
				toggleContainer.appendChild(divHandler);
			}

			/**
			 * Build OnOffSwitch
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.core.OnOffSwitch
			 */
			OnOffSwitch.prototype._build = function (element) {
				var divHandler = createElement("div"),
					toggleContainer = createElement("div"),
					controlType = element.nodeName.toLowerCase();

				if (controlType === "input") {
					buildToggleBasedOnInputTag(element, divHandler, toggleContainer);
				}
				if (controlType === "select") {
					buildToggleBasedOnSelectTag(element, divHandler, toggleContainer);
				}

				divHandler.className = classes.toggleHandler;

				this._type = controlType;
				this._ui.handler = divHandler;
				this._ui.toggleContainer = toggleContainer;

				return element;
			};

			/**
			 * Initiate widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.OnOffSwitch
			 * @instance
			 */
			OnOffSwitch.prototype._init = function (element) {
				var self = this;

				self._ui.input = element.parentElement.querySelector("input");
				if (self._type === "select") {
					self._ui.input.checked = !!element.selectedIndex;
					if (element.hasAttribute("disabled")) {
						self._disable();
					}
				}
			};

			/**
			 * Common method to set disabled state of Switch
			 * @method _disable
			 * @member ns.widget.core.OnOffSwitch
			 * @instance
			 * @since 1.2
			 */
			OnOffSwitch.prototype._disable = function () {
				this._ui.input.setAttribute("disabled", "true");
			};

			/**
			 * Common method to set enabled state of Switch
			 * @method _enable
			 * @member ns.widget.core.OnOffSwitch
			 * @instance
			 * @since 1.2
			 */
			OnOffSwitch.prototype._enable = function () {
				this._ui.input.removeAttribute("disabled");
			};

			/**
			 * Get value of toggle switch. If widget is based on input type
			 * tag otherwise it return index of the element
			 * @method _getValue
			 * @protected
			 * @member ns.widget.core.OnOffSwitch
			 */
			OnOffSwitch.prototype._getValue = function () {
				var self = this,
					element = self.element;

				if (["checkbox", "radio"].indexOf(element.type) > -1) {
					return element.checked;
				}
				return element.selectedIndex;
			};

			/**
			 * Set value of toggle switch
			 * @method _setValue
			 * @param {string} value
			 * @protected
			 * @member ns.widget.core.OnOffSwitch
			 */
			OnOffSwitch.prototype._setValue = function (value) {
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
					self._ui.input.checked = !!value;
				}
			};

			OnOffSwitch.prototype._onDragStart = function () {
				var self = this,
					ui = self._ui,
					checkbox = ui.input,
					handler = ui.handler,
					checkboxRect,
					handlerRect,
					checkboxStyle;

				if (!self.element.disabled) {
					checkboxRect = checkbox.getBoundingClientRect();
					handlerRect = handler.getBoundingClientRect();
					checkboxStyle = window.getComputedStyle(checkbox);
					self._moveWidth = checkboxRect.width - handlerRect.width +
					parseInt(checkboxStyle.borderLeftWidth, 10) +
					parseInt(checkboxStyle.borderRightWidth, 10);

					handler.classList.add(classes.onDrag);
				}
			}

			OnOffSwitch.prototype._onDragEnd = function (event) {
				var self = this,
					ui = self._ui,
					checkbox = ui.input,
					handler = ui.handler,
					moveWidth = self._moveWidth,
					initialPos = checkbox.checked ? moveWidth : 0,
					currentPos,
					checkedByPosition;

				if (!self.element.disabled) {
					currentPos = initialPos + event.detail.deltaX;
					currentPos = Math.min(Math.max(currentPos, 0), moveWidth);

					handler.classList.remove(classes.onDrag);

					checkedByPosition = currentPos > (moveWidth / 2);

					// add animation
					if (checkedByPosition) {
						handler.classList.add(classes.moveToOn);
					} else {
						handler.classList.add(classes.moveToOff);
					}
					// remove temporary styles from drag
					ui.input.style.backgroundColor = null;
					ui.input.style.borderColor = null;
					ui.input.style.borderWidth = null;

					if (checkedByPosition !== checkbox.checked) {
						// toggle on-off switch
						self._setValue(checkedByPosition ? 1 : 0);

						// trigger change event
						onChangeValue(self);
					}
				}
			}

			function calculateColor(data, progress) {
				var from = data.from,
					to = data.to;

				return [
					progress * Math.abs(to.r - from.r),
					progress * Math.abs(to.g - from.g),
					progress * Math.abs(to.b - from.b),
					progress * Math.abs(to.a - from.a)
				];
			}

			OnOffSwitch.prototype._onDrag = function (event) {
				var self = this,
					ui = self._ui,
					moveWidth = self._moveWidth,
					initialPos = ui.input.checked ? moveWidth : 0,
					currentPos,
					progress;

				if (!self.element.disabled) {
					currentPos = initialPos + event.detail.deltaX;
					currentPos = Math.min(Math.max(currentPos, 0), moveWidth);

					ui.handler.style.transform = "translateX(" + currentPos + "px)";

					progress = moveWidth ? currentPos / moveWidth : 1;
					ui.input.style.backgroundColor = "rgba(" +
						calculateColor(self._transform.bgColor, progress).join(",") +
						")";
					ui.input.style.borderColor = "rgba(" +
						calculateColor(self._transform.borderColor, 1 - progress).join(",") +
						")";
					ui.input.style.borderWidth = (1 - progress) + "px";
				}
			};

			OnOffSwitch.prototype._onAnimationEnd = function (event) {
				var targetClassList = event.target.classList;

				targetClassList.remove(classes.moveToOff);
				targetClassList.remove(classes.moveToOn);
				this._ui.handler.style.transform = null;
			};

			OnOffSwitch.prototype.handleEvent = function (event) {
				var self = this;

				switch (event.type) {
					case "change":
						onChangeValue(self);
						break;
					case "focus":
						self._focus(event);
						break;
					case "blur":
						self._blur(event);
						break;
					case "keyup":
						self._keyUp(event);
						break;
					case "drag":
						self._onDrag(event);
						break;
					case "dragstart":
						self._onDragStart(event);
						break;
					case "dragend":
						self._onDragEnd(event);
						break;
					case "animationend":
					case "animationEnd":
					case "webkitAnimationEnd":
						self._onAnimationEnd(event);
						break;
				}
			};

			/**
			 * Binds events to widget
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.core.OnOffSwitch
			 * @instance
			 */
			OnOffSwitch.prototype._bindEvents = function () {
				var self = this,
					input = self._ui.input;

				ns.event.enableGesture(input,
					new ns.event.gesture.Drag({
						threshold: 0
					}));

				input.addEventListener("change", self, true);
				input.addEventListener("focus", self, true);
				input.addEventListener("blur", self, true);
				input.addEventListener("keyup", self, true);
				input.addEventListener("dragstart", self, true);
				input.addEventListener("drag", self, true);
				input.addEventListener("dragend", self, true);
				events.on(self._ui.handler, "animationend animationEnd webkitAnimationEnd", self, false);
			};

			/**
			 * Unbinds events from widget
			 * @method _unbindEvents
			 * @protected
			 * @member ns.widget.core.OnOffSwitch
			 */
			OnOffSwitch.prototype._unbindEvents = function () {
				var self = this,
					input = self._ui.input;

				input.removeEventListener("change", self, true);
				input.removeEventListener("focus", self, true);
				input.removeEventListener("blur", self, true);
				input.removeEventListener("keyup", self, true);
				input.removeEventListener("drag", self, true);
				input.removeEventListener("dragstart", self, true);
				input.removeEventListener("dragend", self, true);
				events.off(self._ui.handler, "animationend animationEnd webkitAnimationEnd", self, false);

				ns.event.disableGesture(input);
			};

			/**
			 * remove attributes when destroyed
			 * @method removeAttributesWhenDestroy
			 * @param {HTMLElement} element
			 * @private
			 * @static
			 * @member ns.widget.core.OnOffSwitch
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
			 * @member ns.widget.core.OnOffSwitch
			 */
			OnOffSwitch.prototype._destroy = function () {
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
					widget: "OnOffSwitch",
					parent: element.parentNode
				});
			};

			OnOffSwitch.prototype._focus = function () {
				var elementClassList;

				if (ns.getConfig("keyboardSupport", false)) {
					elementClassList = this.element.parentElement.classList;
					elementClassList.add(classes.toggleContainerFocus);
					this.element.focus();
				}
			};

			OnOffSwitch.prototype._blur = function () {
				var elementClassList;

				if (ns.getConfig("keyboardSupport", false)) {
					elementClassList = this.element.parentElement.classList;
					elementClassList.remove(classes.toggleContainerFocus);
					this.element.blur();
				}
			};

			OnOffSwitch.prototype._keyUp = function (event) {
				if (event.keyCode === keyCode.ENTER) {
					this._ui.input.checked = !this._ui.input.checked;
				}
			};

			OnOffSwitch.prototype._getContainer = function () {
				return this._ui.toggleContainer;
			}

			widgetSelector = "input[data-role='on-off-switch']," +
				"select[data-role='on-off-switch']," +
				"select.ui-on-off-switch," +
				"input.ui-on-off-switch";

			OnOffSwitch.widgetSelector = widgetSelector;

			ns.widget.core.OnOffSwitch = OnOffSwitch;
			engine.defineWidget(
				"OnOffSwitch",
				widgetSelector,
				[],
				OnOffSwitch,
				"core"
			);

			BaseKeyboardSupport.registerActiveSelector(widgetSelector);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.OnOffSwitch;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
