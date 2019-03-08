/*global window, ns, define */
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

/* Added to classes:
 *   + ui-tokentextarea display flex
 *   + ui-tokentextarea-input added flex
 *   + ui-tokentextarea-span-block added flex
 *   + ui-tokentextarea-desclabel added padding
 *
 * Delete from class:
 *   + ui-tokentextarea-link-base deleted position
 *
 * Changed classes:
 *   + ui-tokentextarea div to ui-tokentextarea-span-block
 * Added class for hiding element:
 *   + span.ui-tokentextarea-invisible
 *
 * All was made for better responsivity and locations tokens.
 *
 */

/**
 * #TokenTextArea widget
 * The TokenTextArea widget changes a text item to a button. It can be
 * comprised of a number of button widgets. When a user types text and the text
 * gets a specific event to change from a text to a button, the input text is
 * changed to a TokenTextArea widget. A user can add the TokenTextArea widget
 * to a contact list, email list, or another list.
 *
 * The typical use of this
 * widget is composing a number of contacts or phone numbers in a specific area
 * of the screen. The TokenTextArea widget enables the user to enter text and
 * convert it to a button. Each button that is created from entered text as a
 * result of a change event forms a token text area widget. This widget is
 * useful in composing an e-mail or SMS message to a group of addresses,
 * each of which is a clickable item for more actions, such as copying,
 * editing, or removing the address.
 *
 * ##HTML Examples
 * ###Create simple Tokentextarea from div using data-role:
 *
 *        @example
 *            <div data-role="tokentextarea"></div>

 * ###Create simple Tokentextarea from div using class:
 *
 *        @example
 *            <div class="ui-tokentextarea"></div>
 *
 * ##Manual constructor
 * ###For manual creation of progressbar widget you can use constructor
 * of widget:
 *
 *        @example
 *            <div id="ns-tokentextarea"><div>
 *             <script>
 *                var token = tau.widget.Tokentextarea(
 *                    document.getElementById('ns-tokentextarea')
 *                );
 *            </script>
 *
 * If jQuery library is loaded, it's method can be used:
 *
 *        @example
 *            <div id="ns-tokentextarea"><div>
 *             <script>
 *                $("#ns-tokentextarea").tokentextarea();
 *            </script>
 *
 *    ##Options for Tokentextarea Widget
 *
 *    Options for widget can be defined as _data-..._ attributes or give as
 *    parameter in constructor.
 *
 * You can change option for widget using method **option**.
 *
 * ###data-label
 * Label for a user guide
 * Provide custom label for the user guide, for example, while composing
 * an sms message "Send to: " label is a user guide to enter phone number
 * or choose recipient from address book.
 *
 *        @example
 *            <div data-role="tokentextarea" data-label="Send to: "></div>
 *
 * ####data-link
 * Represents the id of the page or the URL of other HTML file.
 * The page contains data for the user, for example, an address book.
 * If the value is null, anchor button doesn't work. (Default : null)
 *
 *        @example
 *            <div data-role="tokentextarea" data-link="bar.html"></div>
 *
 * ###data-description
 * This attribute is managing message format.
 * This message is displayed when widget status was changed to 'focusout'.
 * (Default : '+ {0}')
 *
 *        @example
 *            <div data-role="tokentextarea" data-description="bar + {0}"></div>
 *
 *
 * ##Options for Tokentextarea Widget
 *
 * Options for widget can be get/set .
 *
 * ###You can change option for widget using method **option**.
 * Initialize the widget
 *
 *        @example
 *            <script>
 *                var elementToken = document.getElementById("ns-tokentextarea"),
 *                Tokentextarea = tau.widget.Tokentextarea(elementToken);
 *            </script>
 *
 * ### Custom Label
 * Get or set the label option, after initialization
 *
 *        @example
 *            <script>
 *                //getter
 *                Tokentextarea.option( "label" );
 *
 *                //setter
 *                Tokentextarea.option( "label", "e-mail To:" );
 *            </script>
 *
 * ### Custom Link
 * Get or set the link option, after initialization
 *
 *        @example
 *            <script>
 *                //getter
 *                Tokentextarea.option( "link" );
 *
 *                //setter
 *                Tokentextarea.option( "link", "favorites.html");
 *            </script>
 *
 * ### Custom description
 * Get or set the link option, after initialization
 *
 *        @example
 *            <script>
 *                //getter
 *                Tokentextarea.option( "description" );
 *
 *                //setter
 *                Tokentextarea.option( "description", "bar + {0}");
 *            </script>
 *
 * ##Methods
 *
 * To call method on widget you can use one of existing API:
 *
 * First API is from tau namespace:
 *
 *        @example
 *        var elementToken = document.getElementById("ns-tokentext"),
 *            tokentextarea = tau.widget.Tokentextarea(elementToken);
 *
 *        tokentextarea.methodName(methodArgument1, methodArgument2, ...);
 *
 * Second API is jQuery Mobile API and for call _methodName_ you can use:
 *
 *        @example
 *        $(".selector").tokentextarea("methodName", methodArgument1, ...);
 *
 * @author Kamil Stepczuk <k.stepczuk@samsung.com>
 * @class ns.widget.mobile.TokenTextarea
 * @extends ns.widget.BaseWidget
 */

(function (window, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/util/selectors",
			"../../../core/widget/core/Page",
			"../../../profile/mobile/widget/mobile",
			"../../../profile/mobile/widget/mobile/BaseWidgetMobile"
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
				 * @member ns.widget.mobile.Tokentextarea
				 */
				engine = ns.engine,

				/**
				 * Alias for class ns.selectors
				 * @property {Object} selectors
				 * @private
				 * @static
				 * @member ns.widget.mobile.Tokentextarea
				 */
				selectors = ns.util.selectors,

				/**
				 * Dictionary object containing commonly used widget classes
				 * @property {Object} classes
				 * @static
				 * @private
				 * @readonly
				 * @member ns.widget.mobile.TokenTextarea
				 */
				classes = {
					uiTokentextarea: "ui-tokentextarea",
					uiTokentextareaLabel: "ui-tokentextarea-label",
					uiTokentextareaInput: "ui-tokentextarea-input",
					uiTokentextareaInputVisible: "ui-tokentextarea-input-visible",
					uiTokentextareaInputInvisible: "ui-tokentextarea-input-invisible",
					uiInputText: "ui-input-text",
					uiBodyS: "ui-body-s",
					uiTokentextareaLinkBase: "ui-tokentextarea-link-base",
					uiBtnBoxS: "ui-btn-box-s",
					uiTokentextareaSblock: "ui-tokentextarea-sblock",
					uiTokentextareaBlock: "ui-tokentextarea-block",
					uiTokentextareaFocusout: "ui-tokentextarea-focusout",
					uiTokentextareaFocusin: "ui-tokentextarea-focusin",
					uiTokentextareaSpanBlock: "ui-tokentextarea-span-block",
					uiTokentextareaInputArea: "ui-tokentextarea-input-area",
					uiTokentextareaDesclabel: "ui-tokentextarea-desclabel",
					uiTokentextareaInvisible: "ui-tokentextarea-invisible"
				},

				/**
				 * Alias to Page.selector from widget definition
				 * @private
				 * @static
				 * @readonly
				 * @member ns.widget.mobile.Tokentextarea
				 */
				pageSelector = engine.getWidgetDefinition("Page").selector,

				/**
				 * Dictionary for keyboard codes
				 * @property {Object} keyCode
				 * @private
				 * @readonly
				 * @static
				 * @member ns.widget.mobile.Tokentextarea
				 */
				keyCode = {
					BACKSPACE: 8,
					ENTER: 13,
					SEMICOLON: 186,
					COMMA: 188
				},

				/**
				 * Local constructor function
				 * @method Tokentextarea
				 * @private
				 * @member ns.widget.mobile.TokenTextarea
				 */
				Tokentextarea = function () {
					/**
					 * Focus state
					 * @property {boolean} [_focusStatus=true]
					 * @member ns.widget.mobile.TokenTextarea
					 */
					this._focusStatus = true;
					/**
					 * Object with default options
					 * @property {Object} options
					 * @property {string} [options.label="To : "] Sets a label
					 * as a guide for the user
					 * @property {string} [link=""] Sets the ID of the page or
					 * the URL of other HTML file
					 * @property {string} [options.description="+ {0}"] Manages
					 * the message format
					 * @member ns.widget.mobile.TokenTextarea
					 */
					this.options = {
						label: "To : ",
						link: "",
						description: "+ {0}"
					};
					/**
					 *
					 * @property {?Function|null} [inputKeyUp=null]
					 * @private
					 * @member ns.widget.mobile.TokenTextarea
					 */
					this.inputKeyUp = null;
				};

			Tokentextarea.prototype = new BaseWidget();

			Tokentextarea.classes = classes;

			Tokentextarea.keyCode = keyCode;

			/**
			 * Object containing commonly used widget strings
			 * @property {Object} strings
			 * @property {string} strings.doubleTapToEdit Is used to set aria
			 * label for token text area button
			 * @property {string} strings.moreDoubleTapToEdit Is used to set
			 * aria label for grouped hidden tokens
			 * @property {string} strings.addRecipient Is used to add text to
			 * the button linked to external page or URL
			 * @static
			 * @member ns.widget.mobile.TokenTextarea
			 */
			Tokentextarea.strings = {
				doubleTapToEdit: "double tap to edit",
				moreDoubleTapToEdit: "more, double tap to edit",
				addRecipient: "Add recipient"
			};

			/**
			 * Function for select block
			 * @method _selectBlock
			 * @param {HTMLElement} block
			 * @private
			 * @static
			 * @member ns.widget.mobile.TokenTextarea
			 */
			function _selectBlock(block) {
				var blockClasses = block.classList;

				blockClasses.add(classes.uiTokentextareaSblock);
				blockClasses.remove(classes.uiTokentextareaBlock);
			}

			/**
			 * Function for unselect block
			 * @method _unselectBlock
			 * @param {HTMLElement} block
			 * @private
			 * @static
			 * @member ns.widget.mobile.TokenTextarea
			 */
			function _unselectBlock(block) {
				var blockClasses = block.classList;

				blockClasses.remove(classes.uiTokentextareaSblock);
				blockClasses.add(classes.uiTokentextareaBlock);
			}

			/**
			 * Function set max width for block element
			 * Function will be deleted when 'overflow: hidden' and
			 * 'text-overflow: ellipsis' will work with percent value max width.
			 * @method setMaxSizeBlock
			 * @param {HTMLElement} element
			 * @private
			 * @static
			 * @member ns.widget.mobile.TokenTextarea
			 */
			function setMaxSizeBlock(element) {
				var parent = element.parentNode,
					maxWidth;

				maxWidth = parent.offsetWidth / 2;
				element.style.maxWidth = maxWidth + "px";
			}

			/**
			 * Function remove text block from widget
			 * @method _removeTextBlock
			 * @param {HTMLElement} element
			 * @param {number} blockIndex
			 * @private
			 * @static
			 * @member ns.widget.mobile.TokenTextarea
			 */
			function _removeTextBlock(element, blockIndex) {
				var blockParent,
					block,
					blockLength,
					i;

				if (arguments.length === 1) {
					element.parentNode.removeChild(element);
				} else {
					block = element.getElementsByClassName(
						classes.uiTokentextareaSpanBlock
					);
					blockLength = block.length;
					if (blockLength === 0) {
						return;
					}
					blockParent = block[0].parentNode;
					if (blockIndex !== null && blockIndex < blockLength) {
						blockParent.removeChild(block[blockIndex]);
					} else {
						for (i = blockLength - 1; i >= 0; i--) {
							blockParent.removeChild(block[i]);
						}
					}
				}
			}

			/**
			 * Handler function for click to block
			 * @method blockClick
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.TokenTextarea
			 */
			function blockClick(event) {
				var element = event.target,
					parent = element.parentNode,
					widget = ns.engine.instanceWidget(parent),
					lockBlock;

				if (widget._focusStatus) {
					if (element.classList.contains(
						classes.uiTokentextareaSblock)) {
						_removeTextBlock(element);
					} else {
						lockBlock = parent.getElementsByClassName(
							classes.uiTokentextareaSblock)[0];
						if (lockBlock !== undefined) {
							_unselectBlock(lockBlock);
						}
						_selectBlock(element);
					}
				} else {
					widget.focusIn();
				}
			}

			/**
			 * Function bind event vclick for block
			 * @method _bindBlockEvents
			 * @param {HTMLElement} block
			 * @private
			 * @static
			 * @member ns.widget.mobile.TokenTextarea
			 */
			function _bindBlockEvents(block) {
				block.addEventListener("vclick", blockClick, false);
			}

			/**
			 * Function add block into widget
			 * @method _addTextBlock
			 * @param {HTMLElement} element
			 * @param {string} messages
			 * @param {number} blockIndex
			 * @private
			 * @static
			 * @member ns.widget.mobile.TokenTextarea
			 */
			function _addTextBlock(element, messages, blockIndex) {
				var strings = Tokentextarea.strings,
					textBlock,
					textBlockClasses,
					input,
					blocks;

				blocks = element.getElementsByClassName(
					classes.uiTokentextareaSpanBlock
				);
				textBlock = document.createElement("div");
				textBlock.textContent = messages;
				textBlockClasses = textBlock.classList;
				textBlockClasses.add(classes.uiTokentextareaBlock);
				textBlockClasses.add(classes.uiTokentextareaSpanBlock);
				textBlock.setAttribute("aria-label", strings.doubleTapToEdit);
				textBlock.tabIndex = 0;
				if (blockIndex !== null && blockIndex < blocks.length) {
					element.insertBefore(textBlock, blocks[blockIndex]);
				} else {
					input = element.childNodes[element.childNodes.length - 1];
					element.insertBefore(textBlock, input);
				}
				setMaxSizeBlock(textBlock);
				_bindBlockEvents(textBlock);
			}

			/**
			 * Changes maximum size each token text block
			 * @method setMaxSizeForAllBlocks
			 * @param {HTMLElement} element
			 * @private
			 * @static
			 * @member ns.widget.mobile.Tokentextarea
			 */
			function setMaxSizeForAllBlocks(element) {
				var blocks = element.getElementsByClassName(
					classes.uiTokentextareaSpanBlock
					),
					blocksLength = blocks.length,
					i;

				for (i = 0; i < blocksLength; i++) {
					setMaxSizeBlock(blocks[i]);
				}
			}

			/**
			 * Function validate last block
			 * @method _validateTargetBlock
			 * @param {HTMLElement} container
			 * @private
			 * @static
			 * @member ns.widget.mobile.TokenTextarea
			 */
			function _validateTargetBlock(container) {
				var block,
					lastBlock,
					lastBlockClasses;


				block = container.getElementsByClassName(
					classes.uiTokentextareaSpanBlock
				);
				lastBlock = block[block.length - 1];
				lastBlockClasses = lastBlock.classList;

				if (lastBlockClasses.contains(classes.uiTokentextareaSblock)) {
					_removeTextBlock(lastBlock);
				} else {
					_selectBlock(lastBlock);
				}
			}

			/**
			 * Function unselect block in widget
			 * @method _unlockTextBlock
			 * @param {HTMLElement} element
			 * @private
			 * @static
			 * @member ns.widget.mobile.TokenTextarea
			 */
			function _unlockTextBlock(element) {
				var selectedBlock = element.getElementsByClassName(
					classes.uiTokentextareaSblock)[0];

				if (selectedBlock !== undefined) {
					_unselectBlock(selectedBlock);
				}
			}

			/**
			 * Handler function for event keyUp
			 * @method inputKeyUp
			 * @param {HTMLElement} element
			 * @param {Event} event
			 * @private
			 * @static
			 * @member ns.widget.mobile.TokenTextarea
			 */
			function inputKeyUp(element, event) {
				var keyValue = event.keyCode,
					input = element.getElementsByTagName("input")[0],
					inputValue = input.value,
					messages = [],
					messagesLength,
					i;

				if (keyValue === keyCode.BACKSPACE) {
					if (inputValue.length === 0) {
						_validateTargetBlock(element);
					}
				} else if (keyValue === keyCode.ENTER ||
					keyValue === keyCode.SEMICOLON ||
					keyValue === keyCode.COMMA) {
					if (inputValue.length !== 0) {
						messages = inputValue.split(/[,;]/);
						messagesLength = messages.length;
						for (i = 0; i < messagesLength; i++) {
							messages[i] = messages[i].trim();
							if (messages[i].length !== 0) {
								_addTextBlock(element, messages[i]);
							}
						}
					}
					input.value = "";
				} else {
					_unlockTextBlock(element);
				}
			}

			/**
			 * Build widget structure
			 * @method _build
			 * @protected
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.mobile.TokenTextarea
			 */
			Tokentextarea.prototype._build = function (element) {
				var strings = Tokentextarea.strings,
					option = this.options,
					moreBlockClasses,
					inputBox,
					inputBoxClasses,
					inputArea,
					labelTag,
					moreBlock;

				inputBox = document.createElement("input");
				labelTag = document.createElement("span");
				moreBlock = document.createElement("a");
				inputArea = document.createElement("div");

				inputBoxClasses = inputBox.classList;

				inputArea.classList.add(classes.uiTokentextareaInputArea);
				element.classList.add(classes.uiTokentextarea);

				inputBox.style.minWidth = 3 + "rem";
				inputBox.style.width = 100 + "%";

				labelTag.textContent = option.label;
				labelTag.classList.add(classes.uiTokentextareaLabel);
				labelTag.tabIndex = 0;
				element.appendChild(labelTag);


				inputBoxClasses.add(classes.uiTokentextareaInput);
				inputBoxClasses.add(classes.uiTokentextareaInputVisible);
				inputBoxClasses.add(classes.uiInputText);
				inputBoxClasses.add(classes.uiBodyS);

				inputBox.setAttribute("role", "textbox");
				inputArea.appendChild(inputBox);
				engine.instanceWidget(moreBlock, "Button", {
					inline: true,
					icon: "plus",
					style: "circle"
				});

				moreBlockClasses = moreBlock.classList;

				moreBlock.href = option.link;
				moreBlock.tabIndex = 0;
				moreBlockClasses.add(classes.uiTokentextareaLinkBase);
				moreBlockClasses.add(classes.uiBtnBoxS);
				moreBlock.textContent = strings.addRecipient;
				inputArea.appendChild(moreBlock);
				element.appendChild(inputArea);
				return element;
			};

			/**
			 * Method add block
			 *
			 * Method adds new token text widget button with specified text
			 * in place of the index. If index isn't set the token will
			 * be inserted at the end.
			 *
			 *        @example
			 *            <div data-role="tokentextarea" id="ns-tokentext"></div>
			 *            <script>
			 *                var tokenWidget = tau.widget.Tokentextarea(
			 *                        document.getElementById("ns-tokentext")
			 *                );
			 *                tokenWidget.add("foobar");
			 *
			 *                //or
			 *
			 *                $( "#ns-tokentext" ).tokentextarea("add", "foobar");
			 *            </script>
			 *
			 * @method add
			 * @param {string} messages
			 * @param {number} blockIndex
			 * @member ns.widget.mobile.TokenTextarea
			 */
			Tokentextarea.prototype.add = function (messages, blockIndex) {
				var focusStatus = this._focusStatus,
					element = this.element;

				if (focusStatus) {
					_addTextBlock(element, messages, blockIndex);
				}
			};

			/**
			 * Method delete token; delete all tokens without parameter
			 *
			 * The remove method is used to remove a token text area widget
			 * button at the specified index position. If the parameter
			 * is not defined, all the widget buttons are removed.
			 *
			 *        @example
			 *            <div    data-role="tokentextarea"
			 *                    data-label="Send to: "
			 *                    id="ns-tokentext">
			 *            </div>
			 *            <script>
			 *                var tokenWidget = tau.widget.Tokentextarea(
			 *                        document.getElementById("ns-tokentext")
			 *                );
			 *                tokenWidget.remove(1);
			 *
			 *                //or
			 *
			 *                $( "#ns-tokentext" ).tokentextarea("remove", "1" );
			 *            </script>
			 *
			 * @method remove
			 * @param {number} blockIndex
			 * @member ns.widget.mobile.TokenTextarea
			 */
			Tokentextarea.prototype.remove = function (blockIndex) {
				var focusStatus = this._focusStatus,
					element = this.element;

				if (focusStatus) {
					_removeTextBlock(element, blockIndex);
				}
			};

			/**
			 * Function return blocks count
			 *
			 * The length method is used to retrieve the number of buttons
			 * in the token text area widget:
			 *
			 *        @example
			 *            <div data-role="tokentextarea" id="ns-tokentext"></div>
			 *            <script>
			 *                var tokenWidget = tau.widget.Tokentextarea(
			 *                        document.getElementById("ns-tokentext")
			 *                );
			 *                tokenWidget.length();
			 *
			 *                //if jQuery is loaded
			 *
			 *                $( "#ns-tokentext" ).tokentextarea( "length" );
			 *            </script>
			 *
			 * @method length
			 * @return {number}
			 * @member ns.widget.mobile.TokenTextarea
			 */
			Tokentextarea.prototype.length = function () {
				var element = this.element;

				return element.getElementsByClassName(
					classes.uiTokentextareaSpanBlock).length;
			};

			/**
			 * Method is used to manage the widget input box text.
			 *
			 * If no parameter is set, the method gets the input box text.
			 * If a parameter is set, the parameter text is set in
			 * the input box.
			 *
			 *        @example
			 *            <div data-role="tokentextarea" id="ns-tokentext"></div>
			 *            <script>
			 *                // !!!set text in the input box text!!!
			 *
			 *                var tokenWidget = tau.widget.Tokentextarea(
			 *                        document.getElementById("ns-tokentext")
			 *                );
			 *                tokenWidget.inputText("foobar");
			 *
			 *                //if jQuery is loaded
			 *
			 *                $( "#ns-tokentext" ).tokentextarea(
			 *                    "inputText" , "foobar");
			 *
			 *                // !!!get the input box text!!!
			 *
			 *                var tokenWidget = tau.widget.Tokentextarea(
			 *                        document.getElementById("ns-tokentext")
			 *                );
			 *                tokenWidget.inputText();
			 *
			 *                //if jQuery is loaded
			 *
			 *                $( "#ns-tokentext" ).tokentextarea( "inputText" );
			 *            </script>
			 *
			 * @method inputText
			 * @param {string} text
			 * @return {string}
			 * @member ns.widget.mobile.TokenTextarea
			 */
			Tokentextarea.prototype.inputText = function (text) {
				var element = this.element,
					input = element.getElementsByTagName("input")[0];

				if (text !== undefined) {
					input.value = text;
				}
				return input.value;
			};

			/**
			 * The select method is used to select token text area button on its
			 * index value
			 * If a parameter is set, token text area button will be select
			 * the block which is matched with the argument.
			 * If some token text area button is selected and parameter isn't
			 * set method returns string of the selected button.
			 * If none is selected return null
			 *
			 *        @example
			 *            <div data-role="tokentextarea" id="ns-tokentext"></div>
			 *            <script>
			 *                // !!!select first block!!!
			 *
			 *                var tokenWidget = tau.widget.Tokentextarea(
			 *                        document.getElementById("ns-tokentext")
			 *                );
			 *                tokenWidget.add("text 1");
			 *                tokenWidget.add("text 2");
			 *                tokenWidget.select(0);
			 *
			 *                //if jQuery is loaded
			 *
			 *                $( "#ns-tokentext" ).tokentextarea("select" , "0");
			 *
			 *                // !!!gets string from selected block!!!
			 *
			 *                tokenWidget.select();
			 *
			 *                //if jQuery is loaded
			 *
			 *                $( "#ns-tokentext" ).tokentextarea( "select" );
			 *            </script>
			 *
			 * @method select
			 * @param {number} blockIndex
			 * @return {?string}
			 * @public
			 * @member ns.widget.mobile.TokenTextarea
			 */
			Tokentextarea.prototype.select = function (blockIndex) {
				var focusStatus = this._focusStatus,
					element = this.element,
					block,
					sBlock;

				if (focusStatus) {
					block = element.getElementsByClassName(
						classes.uiTokentextareaSpanBlock);
					sBlock = element.getElementsByClassName(
						classes.uiTokentextareaSblock);

					if (blockIndex !== undefined && blockIndex < block.length) {
						if (sBlock.length === 1) {
							_unselectBlock(sBlock[0]);
						}
						_selectBlock(block[blockIndex]);
					} else if (block.length !== 0) {
						if (sBlock[0]) {
							return sBlock[0].textContent;
						}
					}
				}
				return null;
			};

			/**
			 * Function ungroup elements and set focus to input
			 *
			 *        @example
			 *            <div    data-role="tokentextarea"
			 *                    data-label="Send to: "
			 *                    id="ns-tokentext">
			 *            </div>
			 *            <script>
			 *                var tokenWidget = tau.widget.Tokentextarea(
			 *                        document.getElementById("ns-tokentext")
			 *                );
			 *                tokenWidget.focusIn(0);
			 *
			 *                //if jQuery is loaded
			 *
			 *                $( "#ns-tokentext" ).tokentextarea( "focusIn" );
			 *            </script>
			 *
			 * @method focusIn
			 * @public
			 * @member ns.widget.mobile.TokenTextarea
			 */
			Tokentextarea.prototype.focusIn = function () {
				var element = this.element,
					elementClasses,
					label,
					sBlock,
					sBlockClasses,
					input,
					inputClasses,
					button,
					hiddenBlocksCount,
					hiddenBlocks,
					hiddenBlocksLength,
					i;

				if (this._focusStatus) {
					return;
				}

				label = element.getElementsByClassName(
					classes.uiTokentextareaLabel)[0];
				hiddenBlocksCount = element.getElementsByClassName(
					classes.uiTokentextareaDesclabel)[0];
				if (hiddenBlocksCount) {
					element.removeChild(hiddenBlocksCount);
					hiddenBlocks = element.getElementsByClassName(
						classes.uiTokentextareaInvisible);
					hiddenBlocksLength = hiddenBlocks.length;
					for (i = hiddenBlocksLength - 1; i >= 0; i--) {
						hiddenBlocks[i].classList
							.remove(classes.uiTokentextareaInvisible);
					}
				}

				input = element.getElementsByTagName("input")[0];
				inputClasses = input.classList;
				button = element.getElementsByTagName("a")[0];
				elementClasses = element.classList;

				label.tabIndex = 0;
				label.style.display = "";


				sBlock = element
					.getElementsByClassName(classes.uiTokentextareaSblock)[0];
				if (sBlock !== undefined) {
					sBlockClasses = sBlock.classList;
					sBlockClasses.remove(classes.uiTokentextareaSblock);
					sBlockClasses.add(classes.uiTokentextareaBlock);
				}
				inputClasses.remove(classes.uiTokentextareaInputInvisible);
				inputClasses.add(classes.uiTokentextareaInputVisible);
				input.tabIndex = 0;
				button.tabIndex = 0;
				button.style.display = "";

				// change focus state.
				this._focusStatus = true;
				elementClasses.remove(classes.uiTokentextareaFocusout);
				elementClasses.add(classes.uiTokentextareaFocusin);
				element.removeAttribute("tabindex");
				input.focus();
			};

			/**
			 * function get width of element with margins
			 * @method _getElementWidth
			 * @param {HTMLElement} element
			 * @return {number}
			 * @private
			 * @static
			 * @member ns.widget.mobile.TokenTextarea
			 */
			function _getElementWidth(element) {
				var elementView;

				elementView = document.defaultView
					.getComputedStyle(element);
				return parseInt(
					elementView.getPropertyValue("margin-left"), 10) +
					parseInt(elementView.getPropertyValue("margin-right"), 10) +
					element.offsetWidth;
			}

			/**
			 * Function group elements and hide input
			 *
			 *        @example
			 *            <div    data-role="tokentextarea"
			 *                    data-label="Send to: "
			 *                    id="ns-tokentext">
			 *            </div>
			 *            <script>
			 *                var tokenWidget = tau.widget.Tokentextarea(
			 *                        document.getElementById("ns-tokentext")
			 *                );
			 *                tokenWidget.focusOut(0);
			 *
			 *                //if jQuery is loaded
			 *
			 *                $( "#ns-tokentext" ).tokentextarea( "focusOut" );
			 *            </script>
			 *
			 * @method focusOut
			 * @public
			 * @member ns.widget.mobile.TokenTextarea
			 */
			Tokentextarea.prototype.focusOut = function () {
				var element = this.element,
					strings = Tokentextarea.strings,
					description = this.options.description,
					elementClasses,
					elementWidth,
					blockWidthSum = 0,
					label,
					input,
					inputClasses,
					button,
					blocks,
					blocksLength,
					hiddenBlocksCount = 0,
					descLabel,
					descLabel1stChild,
					descLabel2ndChild,
					i;

				if (!this._focusStatus) {
					return;
				}

				blocks = element.getElementsByClassName(
					classes.uiTokentextareaSpanBlock
				);
				blocksLength = blocks.length;
				label = element
					.getElementsByClassName(classes.uiTokentextareaLabel)[0];
				input = element.getElementsByTagName("input")[0];
				inputClasses = input.classList;
				button = element.getElementsByTagName("a")[0];

				label.removeAttribute("tabindex");
				inputClasses.remove(classes.uiTokentextareaInputVisible);
				inputClasses.add(classes.uiTokentextareaInputInvisible);
				input.removeAttribute("tabindex");
				button.removeAttribute("tabindex");
				button.style.display = "none";

				elementWidth = element.offsetWidth;
				blockWidthSum += _getElementWidth(label);
				for (i = 0; i <= blocksLength - 1; i++) {
					blockWidthSum += _getElementWidth(blocks[i]);
					if (blockWidthSum >= elementWidth) {
						hiddenBlocksCount++;
						blocks[i].classList
							.add(classes.uiTokentextareaInvisible);
					}
				}

				this._focusStatus = false;
				elementClasses = element.classList;
				elementClasses.remove(classes.uiTokentextareaFocusin);
				elementClasses.add(classes.uiTokentextareaFocusout);
				element.tabIndex = 0;

				if (hiddenBlocksCount !== 0) {
					descLabel = document.createElement("div");
					descLabel1stChild = document.createElement("div");
					descLabel2ndChild = document.createElement("div");

					descLabel.classList.add(classes.uiTokentextareaDesclabel);
					descLabel.setAttribute("aria-label",
						strings.moreDoubleTapToEdit);
					descLabel.tabIndex = -1;

					descLabel1stChild.setAttribute("aria-hidden", "true");
					descLabel1stChild.textContent = description
						.replace("{0}", hiddenBlocksCount);

					descLabel2ndChild.setAttribute("aria-label", "and");
					descLabel2ndChild.style.visibility = "hidden";
					descLabel2ndChild.textContent = hiddenBlocksCount;

					descLabel.appendChild(descLabel1stChild);
					descLabel.appendChild(descLabel2ndChild);
					element.insertBefore(descLabel, input.parentNode);
				}
			};

			/**
			 * Bind widget events
			 * @method _bindEvents
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.TokenTextarea
			 */
			Tokentextarea.prototype._bindEvents = function (element) {
				var self = this,
					parentPage = selectors.getClosestBySelector(
						element, pageSelector);

				self.inputKeyUp = inputKeyUp.bind(null, element);
				element.getElementsByTagName("input")[0]
					.addEventListener("keyup", self.inputKeyUp, false);
				self._setMaxSizeForAllBlocksBound =
					setMaxSizeForAllBlocks.bind(null, element);
				parentPage.addEventListener(
					"pageshow", self._setMaxSizeForAllBlocksBound, false);
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.mobile.TokenTextarea
			 */
			Tokentextarea.prototype._destroy = function () {
				var element = this.element,
					elementChildren,
					elementChildrenLength,
					input,
					block,
					blockLength,
					parentPage = selectors.getClosestBySelector(
						element, pageSelector),
					i;

				input = element.getElementsByTagName("input")[0];
				block = element.getElementsByClassName(
					classes.uiTokentextareaSpanBlock
				);
				blockLength = block.length;
				for (i = blockLength - 1; i >= 0; i--) {
					block[i].removeEventListener("vclick", blockClick, false);
				}
				input.removeEventListener("keyup", this.inputKeyUp, false);
				parentPage.removeEventListener("pageshow",
					this._setMaxSizeForAllBlocksBound, false);
				elementChildren = element.childNodes;
				elementChildrenLength = elementChildren.length;
				for (i = elementChildrenLength - 1; i >= 0; i--) {
					element.removeChild(elementChildren[i]);
				}
				element.classList.remove(classes.uiTokentextarea);
				element.removeAttribute("data-ns-built");
				element.removeAttribute("data-ns-binding");
				element.removeAttribute("data-ns-name");
				element.removeAttribute("data-ns-selector");
				element.removeAttribute("aria-disabled");
				element.removeAttribute("data-ns-bound");
			};

			/**
			 * The function "value" is not supported in this widget.
			 *
			 * @method value
			 * @chainable
			 * @member ns.widget.mobile.TokenTextarea
			 */

			/**
			 * Disable the Tokentextarea
			 *
			 * Method adds disabled attribute on Tokentextarea widget and
			 * changes look to disabled state.
			 *
			 *        @example
			 *        <div data-role="tokentextarea" id="ns-tokentext"></div>
			 *
			 *        <script>
			 *            var elementToken = tau.widget.Tokentextarea(
			 *                    document.getElementById("ns-tokentext")
			 *                );
			 *            elementToken.disable();
			 *        </script>
			 *
			 * If jQuery is loaded:
			 *
			 *        @example
			 *        <div data-role="tokentextarea" id="ns-tokentext"></div>
			 *
			 *        <script>
			 *            $("#ns-tokentext").tokentextarea("disable");
			 *        </script>
			 *
			 * @method disable
			 * @chainable
			 * @member ns.widget.mobile.TokenTextarea
			 */

			/**
			 * Enable the Tokentextarea
			 *
			 * Method removes disabled attribute on Tokentextarea widget and
			 * changes look to enabled state.
			 *
			 *        @example
			 *        <div data-role="tokentextarea" id="ns-tokentext"></div>
			 *
			 *        <script>
			 *            var elementToken = tau.widget.Tokentextarea(
			 *                    document.getElementById("ns-tokentext")
			 *                );
			 *            elementToken.enable();
			 *        </script>
			 *
			 * If jQuery is loaded:
			 *
			 *        @example
			 *        <div data-role="tokentextarea" id="ns-tokentext"></div>
			 *
			 *        <script>
			 *            $("#ns-tokentext").tokentextarea("enable");
			 *        </script>
			 *
			 * @method enable
			 * @chainable
			 * @member ns.widget.mobile.TokenTextarea
			 */

			/**
			 * Trigger an event on widget's element.
			 *
			 *        @example
			 *        <div data-role="tokentextarea" id="ns-tokentext"></div>
			 *
			 *        <script>
			 *            var elementToken = tau.widget.Tokentextarea(
			 *                    document.getElementById("ns-tokentext")
			 *                );
			 *            elementToken.trigger("eventName");
			 *        </script>
			 *
			 * If jQuery is loaded:
			 *
			 *        @example
			 *        <div data-role="tokentextarea" id="ns-tokentext"></div>
			 *
			 *        <script>
			 *            $("#ns-tokentext").tokentextarea("trigger", "eventName");
			 *        </script>
			 *
			 * @method trigger
			 * @param {string} eventName the name of event to trigger
			 * @param {?*} [data] additional object to be carried with the event
			 * @param {boolean} [bubbles=true] indicating whether the event
			 * bubbles up through the DOM or not
			 * @param {boolean} [cancelable=true] indicating whether the event
			 * is cancelable
			 * @return {boolean} false, if any callback invoked preventDefault
			 * on event object
			 * @member ns.widget.mobile.TokenTextarea
			 */

			/**
			 * Add event listener to widget's element.
			 *
			 *        @example
			 *        <div data-role="tokentextarea" id="ns-tokentext"></div>
			 *
			 *        <script>
			 *            var elementToken = tau.widget.Tokentextarea(
			 *                    document.getElementById("ns-tokentext")
			 *                );
			 *            elementToken.on("eventName", function () {
			 *				console.log("Event fires");
			 *			});
			 *        </script>
			 *
			 * If jQuery is loaded:
			 *
			 *        @example
			 *        <div data-role="tokentextarea" id="ns-tokentext"></div>
			 *
			 *        <script>
			 *            $("#ns-tokentext").tokentextarea("on", "eventName",
			 *                function () { console.log("Event fires");
			 *			});
			 *        </script>
			 *
			 * @method on
			 * @param {string} eventName the name of event
			 * @param {Function} listener function call after event will be
			 * trigger
			 * @param {boolean} [useCapture=false] useCapture param tu
			 * addEventListener
			 * @member ns.widget.mobile.TokenTextarea
			 */

			/**
			 * Remove event listener to widget's element.
			 *
			 *        @example
			 *        <div data-role="tokentextarea" id="ns-tokentext"></div>
			 *
			 *        <script>
			 *            var elementToken = tau.widget.Tokentextarea(
			 *                    document.getElementById("ns-tokentext")
			 *                ),
			 *                callback = function () {
			 *					console.log("Event fires");
			 *				};
			 *            // add callback on event "eventName"
			 *            elementToken.on("eventName", callback);
			 *            // ...
			 *            // remove callback on event "eventName"
			 *            elementToken.off("eventName", callback);
			 *        </script>
			 *
			 * If jQuery is loaded:
			 *
			 *        @example
			 *        <div data-role="tokentextarea" id="ns-tokentext"></div>
			 *
			 *        <script>
			 *            var callback = function () {
			 *					console.log("Event fires");
			 *				};
			 *            // add callback on event "eventName"
			 *            $("#ns-tokentext").tokentextarea(
			 *                "on", "eventName", callback);
			 *            // ...
			 *            // remove callback on event "eventName"
			 *            $("#ns-tokentext").tokentextarea(
			 *                "off", "eventName", callback);
			 *        </script>
			 *
			 * @method off
			 * @param {string} eventName the name of event
			 * @param {Function} listener function call after event will be
			 * trigger
			 * @param {boolean} [useCapture=false] useCapture param to
			 * addEventListener
			 * @member ns.widget.mobile.TokenTextarea
			 */

			/**
			 * Get/Set options of the widget.
			 *
			 * This method can work in many context.
			 *
			 * If first argument is type of object them, method set values for
			 * options given in object. Keys of object are names of options and
			 * values from object are values to set.
			 *
			 * If you give only one string argument then method return value
			 * for given option.
			 *
			 * If you give two arguments and first argument will be a string
			 * then second argument will be intemperate as value to set.
			 *
			 *        @example
			 *        <div data-role="tokentextarea" id="ns-tokentext"></div>
			 *
			 *            <script>
			 *                var tokenWidget = tau.widget.Tokentextarea(
			 *                document.getElementById("ns-tokentext")),
			 *                    tokenValue;
			 *
			 *                 //getter
			 *                tokenValue = tokenWidget.option("label");
			 *
			 *                //setter
			 *                tokenWidget.option("label","e-mail to: ");
			 *            </script>
			 *
			 * If jQuery is loaded:
			 *
			 *        @example
			 *            <div data-role="tokentextarea" id="ns-tokentext"></div>
			 *            <script>
			 *                var tokenValue;
			 *
			 *                // get value
			 *                tokenValue = $("#ns-tokentext").tokentextarea(
			 *                    "option", "label");
			 *
			 *                // set value
			 *                $("#ns-tokentext").tokentextarea(
			 *                    "option", "label", "e-mail to: "
			 *                );
			 *            </script>
			 *
			 * @method option
			 * @param {string|Object} [name] name of option
			 * @param {*} value value to set
			 * @member ns.widget.mobile.TokenTextarea
			 * @return {*} return value of option or undefined if method is
			 * called in setter context
			 */
			// definition
			ns.widget.mobile.TokenTextarea = Tokentextarea;
			engine.defineWidget(
				"TokenTextarea",
				"[data-role='tokentextarea'], .ui-tokentextarea",
				[
					"add",
					"remove",
					"length",
					"inputText",
					"select",
					"focusIn",
					"focusOut"
				],
				Tokentextarea,
				"tizen"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.TokenTextarea;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
