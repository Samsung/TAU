/*global window, ns, define */
/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd
 *
 * Licensed under the Flora License, Version 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://floralicense.org/license/
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*jslint nomen: true, plusplus: true */
/**
 * #Text Enveloper
 * Text enveloper component changes a text item to a button.
 *
 * The TextEnveloper component is that makes text to a chunk divided by delimiter.
 * When you managed various word block, this component is very useful.
 * This component was consisted by input area and word block area.
 * Word block was made after insert text to input area and press enter key.
 * If you want to delete word block, you should press the backspace key.
 * If you focus out the input area, word block is changed to minimize.
 *
 * ##HTML Examples
 * ###Create simple TextEnveloper from div using data-role:
 *
 *		@example
 *			<div data-role="textenveloper"></div>

 * ###Create simple TextEnveloper from div using class:
 *
 *		@example
 *			<div class="ui-text-enveloper"></div>
 *
 * ##Manual constructor
 * ###For manual creation of progressbar component you can use constructor
 * of component:
 *
 *		@example
 *			<div id="TextEnveloper"><div>
 *			 <script>
 *				var textEnveloper = tau.widget.TextEnveloper(
 *					document.getElementById('TextEnveloper')
 *				);
 *			</script>
 *
 * If jQuery library is loaded, it's method can be used:
 *
 *		@example
 *			<div id="TextEnveloper"><div>
 *			 <script>
 *				$("#TextEnveloper").TextEnveloper();
 *			</script>
 *
 * Initialize the component
 *
 *		@example
 *			<script>
 *				var textEnveloperElement = document.getElementById("ns-TextEnveloper"),
 *				TextEnveloper = tau.component.TextEnveloper(textEnveloperElement);
 *			</script>
 *
 * To call method on component you can use one of existing API:
 *
 * First API is from tau namespace:
 *
 *		@example
 *		var textEnveloperElement = document.getElementById("ns-tokentext"),
 *			TextEnveloper = tau.component.TextEnveloper(textEnveloperElement);
 *
 *		TextEnveloper.methodName(methodArgument1, methodArgument2, ...);
 *
 * Second API is jQuery Mobile API and for call _methodName_ you can use:
 *
 *		@example
 *		$(".selector").TextEnveloper("methodName", methodArgument1, ...);
 *
 * ##Events
 *
 * TextEnveloper trigger various events.
 * - newvalue : 'newvalue' event is triggered when user press the ENTER key after insert text to input tag.
 * - added: 'added' event is triggered when textEnveloper button was added.
 * - removed: 'removed' event is triggered when textEnveloper button was removed.
 *
 * @since 2.4
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 * @class ns.widget.mobile.TextEnveloper
 * @component-selector .ui-text-enveloper, [data-role]="textenveloper"
 * @extends ns.widget.BaseWidget
 */

(function (window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/event",
			"../../../core/widget/core/Page",
			"../widget",
			"./BaseWidgetMobile",
			"./TextInput"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			/**
			 * BaseWidget alias variable
			 * @property {Object} BaseWidget alias variable
			 * @private
			 * @static
			 */
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,

				/**
				 * Engine alias variable
				 * @property {ns.engine} engine alias variable
				 * @private
				 * @static
				 * @member ns.widget.mobile.TextEnveloper
				 */
				engine = ns.engine,

				events = ns.event,
				/**
				 * Dictionary object containing commonly used component classes
				 * @property {Object} classes
				 * @static
				 * @private
				 * @readonly
				 * @member ns.widget.mobile.TextEnveloper
				 */
				classes = {
					/**
					 * Standard text enveloper widget
					 * @style ui-text-enveloper
					 * @member ns.widget.mobile.TextEnveloper
					 */
					TEXT_ENVELOPER: "ui-text-enveloper",
					/**
					 * Create text enveloper widget with container
					 * @style ui-text-enveloper-with-container
					 * @member ns.widget.mobile.TextEnveloper
					 */
					WITH_CONTAINER: "ui-text-enveloper-with-container",
					/**
					 * Set container for text enveloper widget
					 * @style ui-text-enveloper-container
					 * @member ns.widget.mobile.TextEnveloper
					 */
					CONTAINER: "ui-text-enveloper-container",
					/**
					 * Set input for text enveloper widget
					 * @style ui-text-enveloper-input
					 * @member ns.widget.mobile.TextEnveloper
					 */
					TEXT_ENVELOPER_INPUT: "ui-text-enveloper-input",
					/**
					 * Set button for text enveloper widget
					 * @style ui-text-enveloper-btn
					 * @member ns.widget.mobile.TextEnveloper
					 */
					TEXT_ENVELOPER_BTN: "ui-text-enveloper-btn",
					/**
					 * Set selected to button in text enveloper widget
					 * @style ui-text-enveloper-btn-selected
					 * @member ns.widget.mobile.TextEnveloper
					 */
					BTN_SELECTED: "ui-text-enveloper-btn-selected",
					/**
					 * Set active to button in text enveloper widget
					 * @style ui-text-enveloper-btn-active
					 * @member ns.widget.mobile.TextEnveloper
					 */
					TEXT_ENVELOPER_BTN_ACTIVE: "ui-text-enveloper-btn-active",
					/**
					 * Set blur to button in text enveloper widget
					 * @style ui-text-enveloper-btn-blur
					 * @member ns.widget.mobile.TextEnveloper
					 */
					TEXT_ENVELOPER_BTN_BLUR: "ui-text-enveloper-btn-blur",
					/**
					 * Set button as expanded in text enveloper widget
					 * @style ui-text-enveloper-btn-expanded
					 * @member ns.widget.mobile.TextEnveloper
					 */
					TEXT_ENVELOPER_BTN_EXPANDED: "ui-text-enveloper-btn-expanded",
					/**
					 * Set a label to text enveloper widget
					 * @style ui-text-enveloper-start
					 * @member ns.widget.mobile.TextEnveloper
					 */
					TEXT_ENVELOPER_START: "ui-text-enveloper-start",
					TEXT_ENVELOPER_TEXTLINE: "ui-text-input-textline",
					/**
					 * Add slash to text enveloper widget
					 * @style ui-text-enveloper-slash
					 * @member ns.widget.mobile.TextEnveloper
					 */
					SLASH: "ui-text-enveloper-slash",
					/**
					 * Hide slash in text enveloper widget
					 * @style ui-text-enveloper-slash-hidden
					 * @member ns.widget.mobile.TextEnveloper
					 */
					SLASH_HIDDEN: "ui-text-enveloper-slash-hidden",
					/**
					 * Add slash to be a separator for button in text enveloper widget
					 * @style ui-text-enveloper-btn-separator
					 * @member ns.widget.mobile.TextEnveloper
					 */
					TEXT_ENVELOPER_BTN_SLASH: "ui-text-enveloper-btn-separator",
					INPUT_STYLE_PREFIX: "ui-text-enveloper-input-",
					/**
					 * Add blur to input in text enveloper widget
					 * @style ui-text-enveloper-input-blur
					 * @member ns.widget.mobile.TextEnveloper
					 */
					INPUT_BLUR: "ui-text-enveloper-input-blur"
				},

				keyCode = {
					BACKSPACE: 8,
					ENTER: 13
				},

				eventName = {
					NEW_VALUE: "newvalue",
					ADDED: "added",
					REMOVED: "removed",
					SELECT: "select",
					UNSELECT: "unselect",
					RESIZE: "resize",
					EXPAND: "expand",
					FOLD: "fold"
				},
				/**
				 * Local constructor function
				 * @method TextEnveloper
				 * @private
				 * @member ns.widget.mobile.TextEnveloper
				 */
				TextEnveloper = function () {
					var self = this;
					/**
					 * Object with default options
					 * @property {Object} options
					 * @property {boolean} [options.groupOnBlur=true] Group elements when blur form input
					 * @property {string} [options.label=null] Sets a label as a guide for the user
					 * @property {string} [options.link=""] Sets the ID of the page or the URL of other HTML file
					 * @property {string} [options.description="+ {0}"] Manages the message format
					 * @property {boolean} [options.selectable=false] Give possibility of select elements
					 * @property {boolean|string} [options.input=true] Set input or define input style
					 * @property {string} [options.placeholder=null] Input placeholder
					 * @property {string} [options.labelPosition=null] Position of label: "indent" | null
					 * @property {string} [options.selectedItems=null] List with indexes of selected items
					 * @property {string} [options.items=null] List of items
					 * @member ns.widget.mobile.TextEnveloper
					 */

					self.options = {
						groupOnBlur: true,
						label: null,
						link: "",
						description: "+ {0}",
						selectable: false,
						input: true,
						placeholder: null,
						labelPosition: null,
						selectedItems: null,
						items: null
					};
					self._ui = {};
				},

				prototype = new BaseWidget();

			TextEnveloper.prototype = prototype;

			TextEnveloper.classes = classes;

			function bindEvents(self) {
				var inputElement = self._ui.inputElement;

				if (inputElement) {
					events.on(inputElement, "keyup", self);
					if (self.options.groupOnBlur) {
						events.on(inputElement, "blur focus", self);
					}
				}
				self.on("click", self);
			}

			function unbindEvents(self) {
				var inputElement = self._ui.inputElement;

				if (inputElement) {
					events.off(inputElement, "keyup", self);
					if (self.options.groupOnBlur) {
						events.off(inputElement, "blur focus", self);
					}
				}
				self.off("click", self);
			}

			/**
			 * Build component structure
			 * @method _build
			 * @protected
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype._build = function (element) {
				var self = this,
					ui = self._ui,
					options = self.options;

				element.classList.add(classes.TEXT_ENVELOPER);

				self._setLabel(element, options.label);
				self._setLabelPosition(element, options.labelPosition);

				ui.container.classList.add(classes.CONTAINER);
				ui.buttons = [];

				self._setInput(element, options.input);
				self._setPlaceholder(element, options.placeholder);

				return element;
			};

			prototype._setLabelPosition = function (element, labelPosition) {
				var self = this,
					ui = self._ui,
					containerElement;

				if (labelPosition === "indent") {
					containerElement = document.createElement("div");
					element.appendChild(containerElement);
					ui.container = containerElement;
					element.classList.add(classes.WITH_CONTAINER);
				} else {
					ui.container = element;
				}

				self.options.labelPosition = labelPosition;
			};

			prototype._setLabel = function (element, label) {
				var title = element.querySelector("." + classes.TEXT_ENVELOPER_START),
					//if title is defined (usually its described as To, Cc, Bcc)
					//then place it in the proper position
					tempTitle = (title) ? title.cloneNode(true) : null;

				if (tempTitle) {
					element.removeChild(title);
					element.appendChild(tempTitle);
				}

				if (label) {
					tempTitle = tempTitle || document.createElement("div");
					tempTitle.innerText = label;
					tempTitle.classList.add(classes.TEXT_ENVELOPER_START);
					element.appendChild(tempTitle);
				}

				this.options.label = label;
			};

			/**
			 * Init component
			 * @method _init
			 * @protected
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype._init = function (element) {
				var self = this;

				self._btnActive = false;
				self._isBlurred = false;

				return element;
			};

			/**
			 * Bind event handler
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype._bindEvents = function () {
				bindEvents(this);
			};

			/**
			 * Bind event handler
			 * @method handleEvent
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype.handleEvent = function (event) {
				var self = this;

				switch (event.type) {
					case "click":
						self._onClick(event);
						break;
					case "keyup":
						self._onKeyup(event);
						break;
					case "blur":
						self._onBlur(event);
						break;
					case "focus":
						self._onFocus(event);
						break;
				}
			};

			/**
			 * Focus event handler of input element
			 * @method _onFocus
			 * @protected
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype._onFocus = function () {
				this.expandButtons();
			};

			/**
			 * Method used to show Text Enveloper items
			 * @method expandButtons
			 * @since 3.0
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype.expandButtons = function () {
				var self = this,
					ui = self._ui,
					length,
					i;

				if (self._isBlurred) {
					self._isBlurred = false;
					self.remove(self._btnToRemoveIndex);
					ui.inputContainer.classList.remove(classes.INPUT_BLUR);
					length = ui.buttons.length;

					for (i = 0; i < length; i++) {
						ui.buttons[i].classList.remove(classes.TEXT_ENVELOPER_BTN_BLUR);
					}

					self.trigger(eventName.RESIZE);
					self.trigger(eventName.EXPAND);
				}
			};

			/**
			 * Focus event handler of input element
			 * @method _onFocus
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype._onClick = function (event) {
				var self = this,
					target = event.target,
					targetClassList = target.classList,
					previousElement = target.previousElementSibling,
					nextElement = target.nextElementSibling,
					nextButtonElement = nextElement && nextElement.nextElementSibling,
					previousButtonElement = previousElement && previousElement.previousElementSibling,
					previousElementClassList,
					nextElementClassList,
					eventNameForTrigger;

				if (!self._isBlurred) {
					if (self.options.selectable && targetClassList.contains(classes.TEXT_ENVELOPER_BTN)) {
						previousElementClassList = previousElement && previousElement.classList;
						nextElementClassList = nextElement && nextElement.classList;
						if (targetClassList.contains(classes.BTN_SELECTED)) {
							if (previousButtonElement &&
								!previousButtonElement.classList.contains(classes.BTN_SELECTED)) {
								previousElementClassList.remove(classes.SLASH_HIDDEN);
							}
							if (nextButtonElement &&
								!nextButtonElement.classList.contains(classes.BTN_SELECTED)) {
								nextElementClassList.remove(classes.SLASH_HIDDEN);
							}
							eventNameForTrigger = eventName.UNSELECT;
						} else {
							if (previousElementClassList) {
								previousElementClassList.add(classes.SLASH_HIDDEN);
							}
							if (nextElementClassList) {
								nextElementClassList.add(classes.SLASH_HIDDEN);
							}
							eventNameForTrigger = eventName.SELECT;
						}
						targetClassList.toggle(classes.BTN_SELECTED);
						self.trigger(eventNameForTrigger, {
							value: target.textContent,
							index: self._ui.buttons.indexOf(target)
						}, false);
						event.preventDefault();
						event.stopPropagation();
					}
				} else {
					self.expandButtons();
					event.preventDefault();
					event.stopPropagation();
				}
			};

			prototype._getItems = function () {
				return this._ui.buttons.map(function (item) {
					return item.textContent;
				});
			};

			prototype._setItems = function (element, value) {
				var self = this,
					itemsArray = typeof value === "string" ? value.split(",") : value;

				if (itemsArray) {
					this._ui.buttons.forEach(function () {
						self.remove(0);
					});
					itemsArray.forEach(function (item) {
						self.add(item);
					});
				}
			};

			prototype._getSelectedItems = function () {
				var result = [];

				this._ui.buttons.forEach(function (item, index) {
					if (item.classList.contains(classes.TEXT_ENVELOPER_BTN_SELECTED)) {
						result.push({
							value: item.textContent,
							index: index
						});
					}
				});

				return result;
			};

			prototype._setSelectedItems = function (element, value) {
				var selectedArray = typeof value === "string" ? value.split(",") : value;

				if (selectedArray) {
					this._ui.buttons.forEach(function (item, index) {
						item.classList.toggle(classes.TEXT_ENVELOPER_BTN_SELECTED,
							selectedArray.indexOf(index) !== -1);
					});
				}
			};

			/**
			 * Blur event handler of input element
			 * @method _onBlur
			 * @protected
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype._onBlur = function () {
				var self = this,
					input = self._ui.inputElement;

				if (input && input.value) {
					self.trigger(eventName.NEW_VALUE, {
						value: input.value
					}, false);

					input.value = "";
				}
				self.foldButtons();
			};

			/**
			 * Method used to hide Text Enveloper items
			 * @method foldButtons
			 * @since 3.0
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype.foldButtons = function () {
				var self = this,
					ui = self._ui,
					buttons = ui.buttons,
					length = buttons.length,
					firstButtonValue = buttons[0] ? buttons[0].textContent : "",
					i,
					button,
					separatorNode,
					lengthTextNode;

				if (!self._isBlurred) {
					for (i = 0; i < length; i++) {
						buttons[i].classList.add(classes.TEXT_ENVELOPER_BTN_BLUR);
					}

					ui.inputContainer.classList.add(classes.INPUT_BLUR);
					button = self._createButton(firstButtonValue, false);
					self._btnToRemoveIndex = buttons.indexOf(button);

					if (length > 1) {
						separatorNode = document.createElement("span");
						separatorNode.classList.add(classes.TEXT_ENVELOPER_BTN_SLASH);

						lengthTextNode = document.createTextNode("+" + (length - 1));

						button.appendChild(separatorNode);
						button.appendChild(lengthTextNode);
					}

					self._isBlurred = true;
					self.trigger(eventName.RESIZE);
					self.trigger(eventName.FOLD);
				}
			};

			/**
			 * keyup event handler of input element
			 * @method _onKeyup
			 * @param {Event} event
			 * @protected
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype._onKeyup = function (event) {
				var self = this,
					ui = self._ui,
					input = ui.inputElement,
					value = input.value,
					keyValue = event.keyCode,
					lastIndex = ui.buttons.length - 1;

				if (keyValue === keyCode.ENTER) {
					self.trigger(eventName.NEW_VALUE, {
						value: value
					}, false);
					input.value = "";
					self.trigger(eventName.RESIZE);
				} else if (keyValue === keyCode.BACKSPACE) {
					if (value === "") {
						if (self._btnActive) {
							self.remove(lastIndex);
							self._btnActive = false;
						} else {
							if (ui.buttons.length) {
								ui.buttons[lastIndex].classList.add(classes.TEXT_ENVELOPER_BTN_ACTIVE);
								self._btnActive = true;
							}
						}
					}
					self.trigger(eventName.RESIZE);
				} else {
					if (self._btnActive) {
						ui.buttons[lastIndex].classList.remove(classes.TEXT_ENVELOPER_BTN_ACTIVE);
						self._btnActive = false;
					}
				}
			};

			/**
			 * Create button as used to word block
			 * @method _onKeyup
			 * @param {string} value
			 * @param {boolean} [inline=true] set inline in button
			 * @protected
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype._createButton = function (value, inline) {
				var self = this,
					ui = self._ui,
					button = document.createElement("div"),
					buttons = ui.buttons;

				if (inline === undefined) {
					inline = true;
				}
				button.innerText = value;
				button.classList.add(classes.TEXT_ENVELOPER_BTN);
				engine.instanceWidget(button, "Button", {
					inline: inline
				});
				ui.container.insertBefore(button, self._ui.inputContainer);
				buttons.push(button);
				self.trigger(eventName.ADDED, {
					value: value,
					index: buttons.length - 1
				}, false);
				return button;
			};

			/**
			 * Create slash to appear after button
			 * @method _createSlash
			 * @protected
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype._createSlash = function () {
				var ui = this._ui,
					span = document.createElement("span");

				span.classList.add(classes.SLASH);
				ui.container.insertBefore(span, ui.inputContainer);
				return span;
			};

			/**
			 * Method add block
			 *
			 * Method adds new token text component button with specified text
			 * in place of the index. If index isn't set the token will
			 * be inserted at the end.
			 *
			 *		@example
			 *			<div data-role="TextEnveloper" id="ns-tokentext"></div>
			 *			<script>
			 *				var tokenComponent = tau.component.TextEnveloper(
			 *						document.getElementById("ns-tokentext")
			 *				);
			 *				tokenComponent.add("foobar");
			 *
			 *				//or
			 *
			 *				$( "#ns-tokentext" ).TextEnveloper("add", "foobar");
			 *			</script>
			 *
			 * @method add
			 * @param {string} itemText
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype.add = function (itemText) {
				var self = this,
					items = self._getItems(self.element);

				if (items.indexOf(itemText) === -1) {
					self._createButton(itemText);
					self._createSlash();
				}
			};

			/**
			 * Method delete token; delete all tokens without parameter
			 *
			 * The remove method is used to remove a token text area component
			 * button at the specified index position. If the parameter
			 * is not defined, all the component buttons are removed.
			 *
			 *		@example
			 *			<div 	data-role="TextEnveloper"
			 *					data-label="Send to: "
			 *					id="ns-tokentext">
			 *			</div>
			 *			<script>
			 *				var tokenComponent = tau.component.TextEnveloper(
			 *						document.getElementById("ns-tokentext")
			 *				);
			 *				tokenComponent.remove(1);
			 *
			 *				//or
			 *
			 *				$( "#ns-tokentext" ).TextEnveloper("remove", "1" );
			 *			</script>
			 *
			 * @method remove
			 * @param {number} index
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype.remove = function (index) {
				var self = this,
					ui = self._ui,
					buttons = ui.buttons,
					length = buttons.length,
					innerText = buttons[index].innerText,
					container = ui.container,
					validLength = self._isBlurred ? length - 2 : length - 1;

				if (index < 0 || index > validLength) {
					ns.warn("You insert incorrect index, please check your index value");
				} else {
					if (self._isBlurred) {
						if (length > 2) {
							buttons[length - 1].textContent = buttons[0].textContent + " + " + (length - 2);
						} else if (length === 2) {
							container.removeChild(buttons[length - 1]);
							buttons.pop();
							buttons[0].classList.remove(classes.TEXT_ENVELOPER_BTN_BLUR);
						}
					} else {
						if (buttons[index].nextElementSibling.classList.contains(classes.SLASH)) {
							container.removeChild(buttons[index].nextElementSibling);
						}
						container.removeChild(buttons[index]);
						buttons.splice(index, 1);
					}
				}

				self.trigger(eventName.REMOVED, {
					value: innerText,
					index: index
				});
			};
			/**
			 * Function return blocks count
			 *
			 * The length method is used to retrieve the number of buttons
			 * in the token text area component:
			 *
			 *		@example
			 *			<div data-role="TextEnveloper" id="ns-tokentext"></div>
			 *			<script>
			 *				var tokenComponent = tau.component.TextEnveloper(
			 *						document.getElementById("ns-tokentext")
			 *				);
			 *				tokenComponent.length();
			 *
			 *				//if jQuery is loaded
			 *
			 *				$( "#ns-tokentext" ).TextEnveloper( "length" );
			 *			</script>
			 *
			 * @method length
			 * @return {number}
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype.length = function () {
				return this._ui.buttons.length;
			};

			prototype._setInput = function (element, addInput) {
				var self = this,
					ui = self._ui,
					input,
					textLineElement,
					inputContainer,
					container = ui.container;

				if (addInput) {
					inputContainer = document.createElement("div");
					input = document.createElement("input");
					input.classList.add(classes.TEXT_ENVELOPER_INPUT);

					inputContainer.appendChild(input);
					container.appendChild(inputContainer);

					engine.instanceWidget(input, "TextInput", {
						clearBtn: true
					});
					ui.inputElement = input;
					ui.inputContainer = inputContainer;

					if (typeof addInput === "string") {
						inputContainer.classList.add(classes.INPUT_STYLE_PREFIX + addInput);
					} else {
						textLineElement = element.querySelector("." + classes.TEXT_ENVELOPER_TEXTLINE);
						textLineElement.parentElement.removeChild(textLineElement);
					}
				} else {
					inputContainer = ui.inputContainer;
					if (inputContainer) {
						container.removeChild(inputContainer);

						engine.destroyWidget(ui.inputElement, "TextInput");

						ui.inputContainer = null;
						ui.inputElement = null;
					}
				}

				self.options.input = addInput;
			};

			prototype._setPlaceholder = function (element, placeholder) {
				var input = this._ui.inputElement;

				if (input) {
					input.setAttribute("placeholder", placeholder || "");
				}

				this.options.placeholder = placeholder;
			};


			/**
			 * Destroy component
			 * @method _destroy
			 * @protected
			 * @member ns.widget.mobile.TextEnveloper
			 */
			prototype._destroy = function () {
				var self = this,
					ui = self._ui;

				ui.container.classList.remove(classes.CONTAINER);
				self._setInput(self.element, false);
				unbindEvents(self);
				self._ui = null;
			};

			prototype.getInput = function () {
				return this._ui.inputElement;
			};

			ns.widget.mobile.TextEnveloper = TextEnveloper;
			engine.defineWidget(
				"TextEnveloper",
				"[data-role='textenveloper'], .ui-text-enveloper",
				[
					"add",
					"remove",
					"length"
				],
				TextEnveloper,
				"mobile"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return TextEnveloper;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
