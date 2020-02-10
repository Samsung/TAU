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
						errorMessageElement: null
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
					HEADER_WITH_SEARCH: "ui-header-searchbar",
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
					uiTextInputTextLine: "." + classes.uiTextInputTextLine
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
					errorMessageString: "Enter a valid email address"
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
					if (!inputElement.classList.contains(classes.uiTextInputFocused)) {
						if (!clearBtn.classList.contains("ui-btn-active")) {
							clearBtn.classList.add(classes.uiTextInputClearHidden);
						}
					} else {
						clearBtn.classList.remove(classes.uiTextInputClearHidden);
						inputElement.classList.add(classes.uiTextInputClearActive);
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
					currentValueLength = element.value.length;

				element.classList.add(classes.uiTextInputFocused);
				if (element.value !== "" && self._ui.textClearButtonElement) {
					self._ui.textClearButtonElement.classList.remove(classes.uiTextInputClearHidden);
				}

				// setting caret position at the end
				element.selectionStart = currentValueLength;
				element.selectionEnd = currentValueLength;
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
					btn = self._ui.textClearButtonElement;

				if (element.value === "" && btn) {
					btn.classList.add(classes.uiTextInputClearHidden);
					element.classList.remove(classes.uiTextInputClearActive);
				} else {
					self._toggleClearButton(self._ui.textClearButtonElement, element);
				}

				if (element.nodeName.toLowerCase() === "textarea") {
					self._resizeTextArea(element);
				}
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
				var element = self.element;

				element.classList.remove(classes.uiTextInputFocused);
				self._toggleClearButton(self._ui.textClearButtonElement, element);
			};

			function setAria(element) {
				element.setAttribute("role", "textinput");
				element.setAttribute("aria-label", "Keyboard opened");
			}

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
						ui.textLineElement = createSpanAfter(element, classes.uiTextInputTextLine);
						break;
					default:
						if (element.tagName.toLowerCase() === "textarea") {
							setAria(element);
							if (options.textLine) {
								ui.textLineElement = createSpanAfter(element, classes.uiTextInputTextLine);
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
						if (element.nextElementSibling.classList.contains(classes.uiTextInputTextLine)) {
							element.parentElement.removeChild(element.nextElementSibling);
						}
					}

					if (!options.clearBtn) {
						ui.textClearButtonElement = self._createClearButton(element, header);
					}

					if (!element.getAttribute("placeholder")) {
						element.setAttribute("placeholder", "Search");
					}
				}

				if (type === "email" || pattern) {
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
					options = self.options,
					type = element.type,
					parentNode = element.parentNode;

				if (options.clearBtn) {
					ui.textClearButtonElement = ui.textClearButtonElement || parentNode.querySelector(selector.uiTextInputClearButton);
				}
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
				}

				if (element.nodeName.toLowerCase() === "textarea") {
					if (element.hasAttribute("rows") === false) {
						element.rows = 1;
					}
					self._resizeTextArea(element);
				}

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
				var element = this.element;

				if (element) {
					element.removeAttribute("disabled");
					element.classList.remove(classes.uiTextInputDisabled);
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
				var element = this.element;

				if (element) {
					element.setAttribute("disabled", "disabled");
					element.classList.add(classes.uiTextInputDisabled);
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
					errorMessage = ui.errorMessageElement;

				self._unbindEvents();

				if (textLine && textLine.parentElement) {
					textLine.parentElement.removeChild(ui.textLineElement);
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
