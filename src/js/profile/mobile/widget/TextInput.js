/*global window, define, ns, HTMLTextAreaElement, HTMLInputElement */
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
 * #Text Input
 * TextInput component is decorator for input elements.
 *
 * ## Default selectors
 * In default elements matches to :
 *
 *  - INPUT with type "text" or "number" or "password" or "email" or "url" or "tel" or "month" or "week" or "datetime-local" or "color" or without any
 *    type
 *  - TEXTAREA
 *  - HTML elements with class _ui-text-input_
 *
 * ###HTML Examples
 *
 * ####Create simple text input on INPUT element
 *
 *		@example
 *		<form>
 *			<label for="text-1">Text input:</label>
 *			<input type="text" name="text-1" id="text-1" value="">
 *			<input type="text" name="text-1" id="text-1" value="">
 *		</form>
 *
 * ####Create simple text input on TEXTAREA element
 *
 *		@example
 *		<form>
 *			<label for="text-1">Text input:</label>
 *			<textarea name="text-1" id="text-1"></textarea>
 *		</form>
 *
 * ####Create simple text input on INPUT element with class ui-text-input
 *
 *		@example
 *		<form>
 *			<label for="text-1">Text input:</label>
 *			<input name="text-1" id="text-1" class="ui-text-input">
 *		</form>
 *
 * ## Manual constructor
 * For manual creation of TextInput widget you can use constructor of widget
 * from **tau** namespace:
 *
 *		@example
 *		<form>
 *			<label for="text-1">Text input:</label>
 *			<input type="search" name="text-1" id="text-1" value="">
 *		</form>
 *		<script>
 *			var inputElement = document.getElementById("text-1"),
 *				textInput = tau.widget.TextInput(inputElement);
 *		</script>
 *
 * ##Options for widget
 *
 * Options for widget can be defined as _data-..._ attributes or give as
 * parameter in constructor.
 *
 * You can change option for widget using method **option**.
 *
 * ##Methods
 *
 * To call method on widget you can use one of existing API:
 *
 * First API is from tau namespace:
 *
 *		@example
 *		<input id="text-1" />
 *		<script>
 *			var inputElement = document.getElementById('text-1'),
 *				textInput = tau.widget.TextInput(inputElement);
 *			// textInput.methodName(argument1, argument2, ...);
 *			// for example:
 *			textInput.value("text");
 *		</script>
 *
 * @since 2.0
 * @class ns.widget.mobile.TextInput
 * @component-selector .ui-text-input
 * @extends ns.widget.BaseWidget
 * @author Maciej Urbanski <m.urbanski@samsung.com>
 * @author Jadwiga Sosnowska <j.sosnowska@samsung.com>
 * @author Piotr Karny <p.karny@samsung.com>
 * @author Piotr Kusztal <p.kusztal@samsung.com>
 * @author Maciej Moczulski <m.moczulski@samsung.com>
 * @author Krzysztof Antoszek <k.antoszek@samsung.com>
 * @author Hyunkook Cho <hk0713.cho@samsung.com>
 * @author Junhyeon Lee <juneh.lee@samsung.com>
 * @author Heeju Joo <heeju.joo@samsung.com>
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/util/DOM/manipulation",
			"../../../core/util/object",
			"../../../core/util/selectors",
			"../../../core/widget/core/Button",
			"../../../core/widget/core/Listview",
			"../../../core/widget/core/Popup",
			"../../../core/event",
			"./BaseWidgetMobile",
			"../../../core/widget/BaseKeyboardSupport",
			"../widget"
		],
		function () {
		//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				BaseKeyboardSupport = ns.widget.core.BaseKeyboardSupport,
				engine = ns.engine,
				util = ns.util,
				domUtils = util.DOM,
				utilSelector = util.selectors,
				objectUtils = util.object,
				utilEvent = ns.event,

				TextInput = function () {
					var self = this;

					self.options = objectUtils.merge({}, TextInput.defaults);
					self._ui = {
						textLineElement: null,
						textClearButtonElement: null,
						errorMessageElement: null,
						label: null,
						icon: null,
						line: null,
						unit: null
					};
					self._state = {
						empty: true,
						focused: false,
						valid: true
					};
					self._callbacks = {};

					BaseKeyboardSupport.call(self);
				},
				buttonClasses = ns.widget.core.Button.classes,

				listviewClasses = ns.widget.core.Listview.classes,
				popupClasses = ns.widget.core.Popup.classes,

				prototype = new BaseWidget(),

				CLASSES_PREFIX = "ui-text-input",

				/**
				 * Dictionary for TextInput related css class names
				 * @property {Object} classes
				 * @member ns.widget.mobile.TextInput
				 * @static
				 */
				classes = {
					/**
					 * Standard text input widget
					 * @style ui-text-input
					 * @member ns.widget.mobile.TextInput
					 */
					uiTextInput: CLASSES_PREFIX,
					/**
					 * Create text input widget with clear button
					 * @style ui-text-input-clear
					 * @member ns.widget.mobile.TextInput
					 */
					uiTextInputClear: CLASSES_PREFIX + "-clear",
					/**
					 * Hide clear button in text input widget
					 * @style ui-text-input-clear-hidden
					 * @member ns.widget.mobile.TextInput
					 */
					uiTextInputClearHidden: CLASSES_PREFIX + "-clear-hidden",
					/**
					 * Set clear button to active in text input widget
					 * @style ui-text-input-clear-active
					 * @member ns.widget.mobile.TextInput
					 */
					uiTextInputClearActive: CLASSES_PREFIX + "-clear-active",
					/**
					 * Set text line to text input widget
					 * @style ui-text-input-textline
					 * @member ns.widget.mobile.TextInput
					 */
					uiTextInputTextLine: CLASSES_PREFIX + "-textline",
					/**
					 * Set error message to text input widget.
					 * Will be visible once input is invalid according to input type.
					 * @style ui-text-input-error-message
					 * @member ns.widget.mobile.TextInput
					 */
					uiTextInputErrorMessage: CLASSES_PREFIX + "-error-message",
					/**
					 * Set text input as disabled in text input widget
					 * @style ui-text-input-disabled
					 * @member ns.widget.mobile.TextInput
					 */
					uiTextInputDisabled: CLASSES_PREFIX + "-disabled",
					/**
					 * Set text input as focus in text input widget
					 * @style ui-text-input-focused
					 * @member ns.widget.mobile.TextInput
					 */
					uiTextInputFocused: CLASSES_PREFIX + "-focused",
					/**
					 * Set class for text input label
					 * @style ui-text-input-label
					 * @member ns.widget.mobile.TextInput
					 */
					label: CLASSES_PREFIX + "-label",
					/**
					 * Set class for text input label when input is inactive
					 * @style ui-text-input-label-inactive
					 * @member ns.widget.mobile.TextInput
					 */
					labelInactive: CLASSES_PREFIX + "-label-inactive",
					/**
					 * Set class for text input when input is empty
					 * @style ui-text-input-empty
					 * @member ns.widget.mobile.TextInput
					 */
					empty: CLASSES_PREFIX + "-empty",
					/**
					 * Set class for text input when TextInput has label
					 * @style ui-text-input-has-label
					 * @member ns.widget.mobile.TextInput
					 */
					hasLabel: CLASSES_PREFIX + "-has-label",
					inputHasNotLine: CLASSES_PREFIX + "-label-has-not-line",
					/**
					 * Set class for text input label when TextInput is focused
					 * @style ui-activated
					 * @member ns.widget.mobile.TextInput
					 */
					ACTIVATED: "ui-activated",
					/**
					 * Set class for text input label when TextInput is disabled
					 * @style ui-disabled
					 * @member ns.widget.mobile.TextInput
					 */
					DISABLED: "ui-disabled",
					/**
					 * Set class for text input label when TextInput value does not match pattern
					 * @style ui-error
					 * @member ns.widget.mobile.TextInput
					 */
					ERROR: "ui-error",
					/**
					 * Set class for text input label when TextInput value does not match pattern
					 * @style ui-has-text-input-error
					 * @member ns.widget.mobile.TextInput
					 */
					PARENT_ERROR: "ui-has-text-input-error",
					/**
					 * Set class for icon assigned to text input
					 * @style ui-text-input-icon
					 * @member ns.widget.mobile.TextInput
					 */
					ICON: CLASSES_PREFIX + "-icon",
					/**
					 * Set icon assigned to text input on bottom
					 * @style ui-text-input-icon-on-bottom
					 * @member ns.widget.mobile.TextInput
					 */
					ICON_ON_BOTTOM: CLASSES_PREFIX + "-icon-on-bottom",
					HEADER_WITH_SEARCH: "ui-header-searchbar",
					HEADER_FOCUSED: "ui-header-searchbar-focused",
					/**
					 * Set search-input widget in text input widget
					 * @style ui-search-input
					 * @member ns.widget.mobile.TextInput
					 */
					SEARCHINPUT: "ui-search-input",
					HEADER: "ui-header",
					/**
					 * Set container for text input widget
					 * @style ui-text-input-container
					 * @member ns.widget.mobile.TextInput
					 */
					CONTAINER: CLASSES_PREFIX + "-container",
					WIDGET_FOCUSED: CLASSES_PREFIX + "-widget-focused"
				},
				/**
				 * Selector for clear button appended to TextInput
				 * @property {string} CLEAR_BUTTON_SELECTOR
				 * @member ns.widget.mobile.TextInput
				 * @static
				 * @private
				 * @readonly
				 */
				selector = {
					uiTextInput: "." + classes.uiTextInput,
					uiTextInputClearButton: "." + classes.uiTextInputClear,
					uiTextInputTextLine: "." + classes.uiTextInputTextLine,
					label: "." + classes.label
				},
				/**
				 * Object with default options
				 * @property {Object} options
				 * @property {boolean} [options.clearBtn=false] option indicates that the clear button will be shown
				 * @property {boolean} [options.textLine=true] option indicates that the text underline will be shown
				 * @property {boolean} [options.maxHeight=null] set max height for textarea
				 * @property {boolean} [options.outsideDiv=false] created outsider div as container of input elements
				 * @property {string} [options.errorMessageString="Custom string"] set message string when input value is invalid
				 * @member ns.widget.mobile.TextInput
				 */
				defaults = {
					clearBtn: false,
					textLine: true,
					maxHeight: null,
					outsideDiv: false,
					errorMessageString: "Enter a valid email address",
					unit: ""
				},
				eventName = {
					SEARCH: "search",
					ANIMATIONEND: "animationend"
				};

			TextInput.prototype = prototype;
			TextInput.classes = classes;
			TextInput.defaults = defaults;

			/**
			 * Resize textarea, called after text input
			 * @method _resizeTextArea
			 * @protected
			 * @param {HTMLElement} element
			 * @member ns.widget.mobile.TextInput
			 */
			prototype._resizeTextArea = function (element) {
				var listviewElement,
					listviewWidget,
					popupElement = util.selectors.getClosestByClass(element, popupClasses.popup),
					popupWidget,
					maxHeight = parseInt(this.options.maxHeight, 10),
					newHeight,
					style = element.style,
					previousHeight = style.height;

				style.height = "auto"; // reset for the browser to recalculate scrollHeight
				newHeight = element.scrollHeight; // apply scrollHeight as new height

				element.scrollTop = newHeight;
				if (maxHeight && newHeight > maxHeight) {
					newHeight = maxHeight;
				}
				style.height = newHeight + "px";

				if ((previousHeight !== (newHeight + "px")) && popupElement && previousHeight !== "") {
					popupWidget = engine.getBinding(popupElement);
					popupWidget.refresh();
				}
				listviewElement = util.selectors.getClosestByClass(element, listviewClasses.LISTVIEW);
				if (listviewElement) {
					listviewWidget = engine.getBinding(listviewElement);
					if (listviewWidget) {
						listviewWidget.refresh();
					}
				}
			};
			/**
			 * Toggle visibility of the clear button
			 * @method _toggleClearButton
			 * @param {HTMLElement} clearBtn
			 * @param {HTMLInputElement} inputElement
			 * @static
			 * @protected
			 */
			prototype._toggleClearButton = function (clearBtn, inputElement) {
				if (clearBtn) {
					if (this._state.focused) {
						clearBtn.classList.remove(classes.uiTextInputClearHidden);
						inputElement.classList.add(classes.uiTextInputClearActive);
					} else {
						if (!clearBtn.classList.contains("ui-btn-active")) {
							clearBtn.classList.add(classes.uiTextInputClearHidden);
						}
					}
				}
			};
			/**
			 * Method clears text in input field and sets focus
			 * @method _onClearBtnClick
			 * @param {ns.widget.core.Button} self
			 * @static
			 * @protected
			 * @member ns.widget.mobile.TextInput
			 */
			prototype._onClearBtnClick = function (self) {
				self.element.focus();
				self.element.value = "";
				self.trigger(eventName.SEARCH);
			};
			/**
			 * Method hides button after its animation ends
			 * @method _onClearBtnAnimationEnd
			 * @param {ns.widget.core.Button} self
			 * @param {Event} event
			 * @static
			 * @protected
			 * @member ns.widget.mobile.TextInput
			 */
			prototype._onClearBtnAnimationEnd = function (self, event) {
				if (event.animationName === "btn_pressup_animation" && self.element.value === "") {
					event.target.classList.add(classes.uiTextInputClearHidden);
				}
			};

			prototype._updateIconPosition = function () {
				var self = this,
					options = self.options,
					state = self._state,
					icon = self._ui.icon;

				if (icon) {
					icon.classList.toggle(classes.ICON_ON_BOTTOM,
						state.focused && state.valid && options.textLine ||
						!state.focused && !state.empty && state.valid && options.textLine
					);
				}
			};

			prototype._updateLabelError = function () {
				var self = this,
					label = self._ui.label;

				if (label) {
					label.classList.toggle(classes.ERROR, !self._state.valid);
				}
			};

			prototype._updateParentError = function () {
				var self = this,
					parent = self.element.parentElement;

				if (parent) {
					parent.classList.toggle(classes.PARENT_ERROR, !self._state.valid);
				}
			};

			/**
			 * Validate input value and set error message class
			 * @method _validate
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.TextInput
			 */
			prototype._validate = function (element) {
				var self = this,
					valid = element.checkValidity();

				if (valid && self._patternRegexp) {
					valid = element.value.replace(self._patternRegexp, "") === "";
				}
				self._state.valid = valid;
			}

			/**
			 * Find icon assigned to text input
			 * @method _findIcon
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.TextInput
			 */
			prototype._findIcon = function (element) {
				var parentElement = element.parentElement,
					prevSibling;

				if (parentElement) {
					prevSibling = parentElement.previousElementSibling;
					if (prevSibling && prevSibling.classList.contains(classes.ICON)) {
						this._ui.icon = prevSibling;
					}
				}
			};

			/**
			 * Update widget focused look depending to the widget state
			 * @method _updateFocused
			 * @protected
			 * @member ns.widget.mobile.TextInput
			 */
			prototype._updateFocused = function () {
				var self = this,
					element = self.element,
					header = self._ui.header;

				if (header) {
					header.classList.toggle(classes.HEADER_FOCUSED, self._state.focused);
				}
				element.classList.toggle(classes.uiTextInputFocused, self._state.focused);
			};

			/**
			 * Method adds class ui-text-input-focused to target element of event.
			 * @method _onFocus
			 * @param {ns.widget.mobile.TextInput} self
			 * @protected
			 * @static
			 * @member ns.widget.mobile.TextInput
			 */
			prototype._onFocus = function (self) {
				var element = self.element,
					currentValueLength = element.value.length,
					ui = self._ui,
					label = ui.label;

				self._state.focused = true;
				self._state.empty = element.value === "";

				element.classList.toggle(classes.empty, self._state.empty);

				if (label) {
					label.classList.add(classes.ACTIVATED);
					label.classList.remove(classes.labelInactive);
				}
				if (!self._state.empty && ui.textClearButtonElement) {
					ui.textClearButtonElement.classList.remove(classes.uiTextInputClearHidden);
				}
				self._updateIconPosition();
				self._updateFocused();
				self._updateUnit();

				// setting caret position at the end
				if (element.type === "text") {
					element.selectionStart = currentValueLength;
					element.selectionEnd = currentValueLength;
				}
			};

			/**
			 * Method adds event for showing clear button and optional resizing textarea.
			 * @method _onInput
			 * @param {ns.widget.mobile.TextInput} self
			 * @protected
			 * @static
			 * @member ns.widget.mobile.TextInput
			 */
			prototype._onInput = function (self) {
				var element = self.element,
					ui = self._ui,
					btn = ui.textClearButtonElement;

				self._state.empty = element.value === "";

				if (self._state.empty && btn) {
					btn.classList.add(classes.uiTextInputClearHidden);
					element.classList.remove(classes.uiTextInputClearActive);
				} else {
					self._toggleClearButton(ui.textClearButtonElement, element);
				}

				element.classList.toggle(classes.empty, self._state.empty);
				ui.label && ui.label.classList.remove(classes.labelInactive);

				if (element.nodeName.toLowerCase() === "textarea") {
					self._resizeTextArea(element);
				}

				self._validate(element);

				self._updateLabelError();
				self._updateParentError();
				self._updateIconPosition();
			};
			/**
			 * Method removes class ui-text-input-focused from target element of event.
			 * @method _onBlur
			 * @param {ns.widget.mobile.TextInput} self
			 * @private
			 * @static
			 * @member ns.widget.mobile.TextInput
			 */
			prototype._onBlur = function (self) {
				var element = self.element,
					label = self._ui.label;

				self._state.focused = false;
				self._state.empty = element.value === "";

				if (label) {
					label.classList.remove(classes.ACTIVATED);
					label.classList.toggle(classes.labelInactive, self._state.empty);
				}
				self._toggleClearButton(self._ui.textClearButtonElement, element);
				element.classList.toggle(classes.empty, self._state.empty);

				self._updateIconPosition();
				self._updateFocused();
			};

			function setAria(element) {
				element.setAttribute("role", "textinput");
				element.setAttribute("aria-label", "Keyboard opened");
			}

			prototype._createTextLine = function (element, classStyle, content) {
				var self = this,
					span = document.createElement("span"),
					line = document.createElement("span"),
					unit = document.createElement("span");

				if (classStyle) {
					span.classList.add(classStyle);
				}

				unit.innerHTML = self.options.unit;

				line.classList.add("ui-textinput-textline-line");
				unit.classList.add("ui-textinput-textline-unit");

				if (content) {
					span.innerHTML = content;
				}

				span.appendChild(line);
				span.appendChild(unit);

				domUtils.insertNodeAfter(element, span);

				self._ui.unit = unit;
				self._ui.line = line;
				return span;
			};

			function createSpanAfter(element, classStyle, content) {
				var span = document.createElement("span");

				if (classStyle) {
					span.classList.add(classStyle);
				}
				if (content) {
					span.innerHTML = content;
				}

				domUtils.insertNodeAfter(element, span);
				return span;
			}

			prototype._createClearButton = function (element, header) {
				var clearButton = document.createElement("a");

				clearButton.classList.add(buttonClasses.BTN);
				clearButton.classList.add(buttonClasses.BTN_ICON);
				clearButton.classList.add(buttonClasses.BTN_NOBG);
				clearButton.classList.add(classes.uiTextInputClear);
				clearButton.classList.add(classes.uiTextInputClearHidden);

				clearButton.tabindex = 0;
				if (header) {
					element.parentNode.appendChild(clearButton);
				} else {
					element.parentNode.insertBefore(clearButton, element.nextSibling.nextSibling);
				}

				return clearButton;
			};

			/**
			* build TextInput Widget
			* @method _build
			* @param {HTMLElement} element
			* @member ns.widget.mobile.TextInput
			* @return {HTMLElement}
			* @protected
			*/
			prototype._build = function (element) {
				var self = this,
					options = self.options,
					type = element.type,
					pattern = element.pattern,
					ui = self._ui,
					header;


				self._setOutsideDiv(element, options.outsideDiv);

				/* set Aria and TextLine */
				switch (type) {
					case "text":
					case "password":
					case "number":
					case "email":
					case "url":
					case "tel":
					case "search":
						setAria(element);
						if (options.textLine) {
							ui.textLineElement = self._createTextLine(element, classes.uiTextInputTextLine);
						}
						break;
					default:
						if (element.tagName.toLowerCase() === "textarea") {
							setAria(element);
							if (options.textLine) {
								ui.textLineElement = self._createTextLine(element, classes.uiTextInputTextLine);
							}
						}
				}

				element.classList.add(classes.uiTextInput);
				element.tabindex = 0;

				if (options.clearBtn) {
					ui.textClearButtonElement = self._createClearButton(element);
				}

				if (type === "search") {
					header = utilSelector.getClosestByClass(element, classes.HEADER);
					element.classList.add(classes.SEARCHINPUT);

					if (header) {
						header.classList.add(classes.HEADER_WITH_SEARCH);
						ui.header = header;
					}

					if (!options.clearBtn) {
						ui.textClearButtonElement = self._createClearButton(element, header);
					}

					if (!element.getAttribute("placeholder")) {
						element.setAttribute("placeholder", "Search");
					}
				}

				if (type === "email" || type === "number" || pattern) {
					ui.errorMessageElement = createSpanAfter(ui.textLineElement, classes.uiTextInputErrorMessage, options.errorMessageString);
				}

				return element;
			};

			prototype._setOutsideDiv = function (element, newDiv) {
				var container = document.createElement("div"),
					ui = this._ui;

				if (newDiv) {
					container.className = classes.CONTAINER;
					element.parentElement.replaceChild(container, element);
					container.classList.add(CLASSES_PREFIX + "-type-" + element.type);
					container.appendChild(element);
					ui.container = container;
				}

				this.options.outsideDiv = newDiv;
			};

			/**
			* Find label for widget
			* @method _findLabel
			* @param {HTMLElement} element
			* @member ns.widget.mobile.TextInput
			* @return {HTMLElement}
			* @protected
			*/
			prototype._findLabel = function (element) {
				var previousElement = element.previousElementSibling;

				if (previousElement && previousElement.nodeName === "LABEL") {
					return previousElement;
				}
				return null;
			};

			prototype._updateLabel = function () {
				var self = this,
					label = self._ui.label;

				if (label) {
					label.classList.toggle(classes.inputHasNotLine, !self.options.textLine);
				}
			};

			prototype._updateUnit = function () {
				var self = this,
					ui = self._ui,
					unit = ui.unit,
					line = ui.line,
					lineWidth;

				if (unit) {
					if (self.options.unit) {
						unit.innerHTML = self.options.unit;
						unit.style.display = "inline";
					} else {
						unit.style.display = null;
					}
				}

				if (line) {
					lineWidth = line.getBoundingClientRect().width;
					self.element.style.width = (lineWidth) ? lineWidth + "px" : null;
				}
			};

			/**
			* Init TextInput Widget
			* @method _init
			* @param {HTMLElement} element
			* @member ns.widget.mobile.TextInput
			* @return {HTMLElement}
			* @protected
			*/
			prototype._init = function (element) {
				var self = this,
					ui = self._ui,
					label,
					options = self.options,
					type = element.type,
					parentNode = element.parentNode;

				if (options.clearBtn) {
					ui.textClearButtonElement = ui.textClearButtonElement || parentNode.querySelector(selector.uiTextInputClearButton);
				}

				self._state.empty = element.value === "";

				element.classList.toggle(classes.empty, self._state.empty);

				label = self._findLabel(element);
				if (label) {
					if (!label.getAttribute("for")) {
						label.setAttribute("for", element.id);
					}
					label.classList.add(classes.label);
					label.classList.toggle(classes.labelInactive, self._state.empty);
				}
				ui.label = label;

				if (options.textLine) {
					switch (type) {
						case "text":
						case "password":
						case "number":
						case "email":
						case "url":
						case "tel":
							ui.textLineElement = ui.textLineElement || parentNode.querySelector(selector.uiTextInputTextLine);
							break;
						default:
							if (element.nodeName.toLowerCase() === "textarea") {
								ui.textLineElement = ui.textLineElement || parentNode.querySelector(selector.uiTextInputTextLine);
							}
					}

					ui.textLineElement && ui.textLineElement.classList.toggle(classes.hasLabel, !!label);
				}

				if (element.nodeName.toLowerCase() === "textarea") {
					if (element.hasAttribute("rows") === false) {
						element.rows = 1;
					}
					self._resizeTextArea(element);
				}

				self._patternRegexp = (element.pattern) ? new RegExp(element.pattern) : null;

				self._findIcon(element);
				self._validate(element);

				self._updateLabel();
				self._updateLabelError();
				self._updateParentError();
				self._updateIconPosition();
				self._updateFocused();
				self._updateUnit();

				return element;
			};


			/**
			* Bind events to widget
			* @method _bindEvents
			* @protected
			* @member ns.widget.mobile.TextInput
			*/
			prototype._bindEvents = function () {
				var self = this,
					element = self.element,
					clearBtn = self._ui.textClearButtonElement,
					onInputCallback = self._onInput.bind(null, self),
					onFocusCallback = self._onFocus.bind(null, self),
					onBlurCallback = self._onBlur.bind(null, self),
					onClearBtnClickCallback = self._onClearBtnClick.bind(null, self),
					onClearBtnAnimationEndCallback = self._onClearBtnAnimationEnd.bind(null, self);

				self._callbacks = {
					onInputCallback: onInputCallback,
					onFocusCallback: onFocusCallback,
					onBlurCallback: onBlurCallback,
					onClearBtnClickCallback: onClearBtnClickCallback,
					onClearBtnAnimationEndCallback: onClearBtnAnimationEndCallback
				};

				utilEvent.on(element, "input", onInputCallback);
				utilEvent.on(element, "focus", onFocusCallback);
				utilEvent.on(element, "blur", onBlurCallback);
				if (clearBtn) {
					utilEvent.on(clearBtn, "click", onClearBtnClickCallback);
					utilEvent.on(clearBtn, eventName.ANIMATIONEND, onClearBtnAnimationEndCallback);
				}

			};
			/**
			 * unbind events to widget
			 * @method _unbindEvents
			 * @protected
			 * @member ns.widget.mobile.TextInput
			 */
			prototype._unbindEvents = function () {
				var self = this,
					element = self.element,
					clearBtn = self._ui.textClearButtonElement,
					callbacks = self._callbacks;

				utilEvent.off(element, "input", callbacks.onInputCallback);
				utilEvent.off(element, "focus", callbacks.onFocusCallback);
				utilEvent.off(element, "blur", callbacks.onBlurCallback);
				if (clearBtn) {
					utilEvent.off(clearBtn, "click", callbacks.onClearBtnClickCallback);
					utilEvent.off(clearBtn, eventName.ANIMATIONEND, callbacks.onClearBtnAnimationEndCallback);
				}
			};

			/**
			 * Enables the TextInput
			 *
			 * Method removes disabled attribute on input and changes look of
			 * input to enabled state.
			 *
			 *	@example
			 *	<input id="input" />
			 *	<script>
			 *		var inputElement = document.getElementById("input"),
			 *			textInputWidget = tau.widget.TextInput();
			 *
			 *		textInputWidget.enable();
			 *	</script>
			 *
			 * @method enable
			 * @chainable
			 * @member ns.widget.mobile.TextInput
			 */

			/**
			 * Method enables TextInput.
			 * @method _enable
			 * @member ns.widget.mobile.TextInput
			 * @protected
			 */
			prototype._enable = function () {
				var self = this,
					element = self.element,
					label = self._ui.label;

				if (element) {
					element.removeAttribute("disabled");
					element.classList.remove(classes.uiTextInputDisabled);
					label && label.classList.remove(classes.DISABLED);
				}
			};

			/**
			 * Disables the TextInput
			 *
			 * Method adds disabled attribute on input and changes look of
			 * input to disable state.
			 *
			 *	@example
			 *	<input id="input" />
			 *	<script>
			 *		var inputElement = document.getElementById("input"),
			 *			textInputWidget = tau.widget.TextInput();
			 *
			 *		textInputWidget.disable();
			 *	</script>
			 *
			 *
			 * @method disable
			 * @chainable
			 * @member ns.widget.mobile.TextInput
			 */

			/**
			 * Method disables TextInput
			 * @method _disable
			 * @member ns.widget.mobile.TextInput
			 * @protected
			 */
			prototype._disable = function () {
				var self = this,
					element = self.element,
					label = self._ui.label;

				if (element) {
					element.setAttribute("disabled", "disabled");
					element.classList.add(classes.uiTextInputDisabled);
					label && label.classList.add(classes.DISABLED);
				}
			};

			/**
			 * Get element value
			 * @method _getValue
			 * @return {?string}
			 * @member ns.widget.mobile.TextInput
			 * @protected
			 * @since 2.3.1
			 */
			prototype._getValue = function () {
				var element = this.element;

				if (element) {
					return element.value;
				}
				return null;
			};

			/**
			 * Set element value
			 * @method _setValue
			 * @param {string} value
			 * @member ns.widget.mobile.TextInput
			 * @return {ns.widget.mobile.TextInput}
			 * @protected
			 * @since 2.3.1
			 */
			prototype._setValue = function (value) {
				var element = this.element;

				if (element) {
					element.value = value;
				}
				return this;
			};

			/**
			 * Set unit of number input
			 * @method _setUnit
			 * @param {HTMLElement} element
			 * @param {string} value
			 * @member ns.widget.mobile.TextInput
			 * @protected
			 * @since 1.2
			 */
			prototype._setUnit = function (element, value) {
				var self = this;

				self.options.unit = value;
				self._updateUnit();
			};

			/**
			 * Destroys additional elements created by the widget,
			 * removes classes and event listeners
			 * @method _destroy
			 * @protected
			 * @member ns.widget.mobile.TextInput
			 */
			prototype._destroy = function () {
				var self = this,
					ui = self._ui,
					textLine = ui.textLineElement,
					clearButton = ui.textClearButtonElement,
					errorMessage = ui.errorMessageElement,
					label = ui.label;

				self._unbindEvents();

				if (textLine && textLine.parentElement) {
					textLine.parentElement.removeChild(ui.textLineElement);
				}

				if (label) {
					label.classList.remove(classes.label);
				}

				if (clearButton) {
					clearButton.parentElement.removeChild(ui.textClearButtonElement);
				}

				if (errorMessage) {
					errorMessage.parentElement.removeChild(ui.errorMessageElement);
				}
			};

			/**
			 * Returns widget container if it has one,
			 * otherwise returns base element
			 * @method _getContainer
			 * @protected
			 * @member ns.widget.mobile.TextInput
			 */
			prototype._getContainer = function () {
				var self = this,
					ui = self._ui,
					container = ui.container,
					element = self.element;

				return container ? container : element;
			}


			prototype._focus = function (element) {
				var classList = element.classList;

				classList.add(classes.WIDGET_FOCUSED);
			}

			prototype._blur = function (element) {
				var classList = element.classList;

				classList.remove(classes.WIDGET_FOCUSED);
				element.blur();
			}

			prototype._actionEnter = function (element) {
				var self = this;

				self._blur(element);
				element.focus();
			}

			prototype._actionEscape = function (element) {
				var self = this;

				element.blur();
				self.focus();
			}

			BaseKeyboardSupport.registerActiveSelector("input[type='text']:not([data-role])" +
				", input[type='number']:not([data-role])" +
				", input[type='password']:not([data-role])" +
				", input[type='email']:not([data-role])" +
				", input[type='url']:not([data-role])" +
				", input[type='tel']:not([data-role])" +
				", input[type='search']:not([data-role]), .ui-search-input" +
				", textarea" +
				", input:not([type])." + classes.uiTextInput);

			ns.widget.mobile.TextInput = TextInput;
			engine.defineWidget(
				"TextInput",
				"input[type='text']:not([data-role])" +
					", input[type='number']:not([data-role])" +
					", input[type='password']:not([data-role])" +
					", input[type='email']:not([data-role])" +
					", input[type='url']:not([data-role])" +
					", input[type='tel']:not([data-role])" +
					", input[type='search']:not([data-role]), .ui-search-input" +
					", textarea" +
					", input:not([type])." + classes.uiTextInput,
				[],
				TextInput,
				"mobile",
				false,
				false,
				HTMLInputElement
			);

			ns.widget.mobile.TextArea = TextInput;
			engine.defineWidget(
				"TextArea",
				null,
				[],
				TextInput,
				"mobile",
				false,
				false,
				HTMLTextAreaElement
			);

			engine.defineWidget(
				"SearchInput",
				"",
				[],
				TextInput,
				"mobile"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.TextInput;
		}
	);
//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
