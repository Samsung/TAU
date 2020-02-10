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
/* global define, ns */
/**
 * #Button
 * Shows a control that can be used to generate an action event.
 *
 * The button component shows on the screen a control that you can use to generate an action event
 * when it is pressed and released. The component is coded with standard HTML anchor and input
 * elements.
 *
 * The following table describes the supported button classes.
 *
 * ## Default selectors
 * The button widget shows a control on the screen that you can use to generate an action event
 * when it is pressed and released.
 * This widget is coded with standard HTML anchor and input elements.
 *
 * Default selector for buttons is class *ui-btn*
 *
 * ### HTML Examples
 *
 * #### Standard button
 * To add a button widget to the application, use the following code:
 *
 *      @example
 *      <button type="button" class="ui-btn">Button</button>
 *      <a href="#" class="ui-btn">Button</a>
 *      <input type="button" class="ui-btn" value="Button" />
 *
 * #### Inline button
 *
 *      @example
 *      <input type="button" class="ui-btn ui-inline" value="Button" />
 *
 * #### Multiline text button
 *
 *      @example
 *      <a href="#" class="ui-btn ui-multiline ui-inline">A Button<br />Icon</a>
 *
 * ## Options
 *
 * ### Icons
 * Buttons can contains icons
 *
 * Creates an icon button in the header area is permitted but in content or footer area creating
 * icon are not supported.
 *
 * To use menu icon in header add class *ui-more* to the button element:
 *
 *      @example
 *      <button class="ui-btn ui-more ui-icon-overflow">More Options</button>
 *
 * Samsung Wearable Web UI Framework supports 3 icon css styles:
 *
 *  - ui-icon-detail
 *  - ui-icon-overflow
 *  - ui-icon-selectall
 *
 * ### Disabled
 *
 * If you want to make disabled button, add attribute *disabled* in button tag:
 *
 *      @example
 *      <button class="ui-btn" disabled="disabled">Button disabled</button>
 *
 * ### Inline
 *
 * If you want to make inline button, add class *ui-inline* to button element:
 *
 *      @example
 *      <button class="ui-btn ui-inline">Inline button</button>
 *
 * ### Multiline
 *
 * If you want to make multiline text button, add *ui-multiline* class
 *
 *      @example
 *      <button class="ui-btn ui-multiline">Multiline button</button>
 *
 * ### Color theme
 *
 * To optimize color support for the Samsung Wearable, the following styles below are supported:
 *
 * <table>
 *  <tr>
 *      <th>Class</th>
 *      <th>Default</th>
 *      <th>Press</th>
 *      <th>Disable</th>
 *  </tr>
 *  <tr>
 *      <td>ui-color-red</td>
 *      <td>#ce2302</td>
 *      <td>#dd654e</td>
 *      <td>#3d0a0a</td>
 *  </tr>
 *  <tr>
 *      <td>ui-color-orange</td>
 *      <td>#ed8600</td>
 *      <td>#f0aa56</td>
 *      <td>#462805</td>
 *  </tr>
 *  <tr>
 *      <td>ui-color-green</td>
 *      <td>#64a323</td>
 *      <td>#92be5e</td>
 *      <td>#1e3108</td>
 *  </tr>
 * </table>
 *
 * ### Button Group
 *
 * You can group buttons in columns or rows. The following table lists the supported button column
 * and row classes.
 *
 * <table>
 *  <tr>
 *      <th>Class</th>
 *      <th>Description</th>
 *  </tr>
 *  <tr>
 *      <td>ui-grid-col-1</td>
 *      <td>Defines the button column width as 100% of the screen.</td>
 *  </tr>
 *  <tr>
 *      <td>ui-grid-col-2</td>
 *      <td>Defines the button column width as 50% of the screen.</td>
 *  </tr>
 *  <tr>
 *      <td>ui-grid-col-3</td>
 *      <td>Defines the button column width as 33% of the screen.</td>
 *  </tr>
 *  <tr>
 *      <td>ui-grid-row</td>
 *      <td>Arranges the buttons in a row.</td>
 *  </tr>
 * </table>
 *
 * To implement the button groups, use the following code:
 *
 * #### For columns:
 *
 *      @example
 *      <div class="ui-grid-col-3" style="height:76px">
 *          <button type="button" class="ui-btn">Button Circle</button>
 *          <a href="#" class="ui-btn ui-color-red" >A Button Circle</a>
 *          <input type="button" class="ui-btn ui-color-orange" value="Value" />
 *      </div>
 *
 * #### For rows:
 *
 *      @example
 *      <div class="ui-grid-row">
 *          <button type="button" class="ui-btn">Button Circle</button>
 *          <a href="#" class="ui-btn ui-color-red" >A Button Circle</a>
 *          <input type="button" class="ui-btn ui-color-orange" value="Value" />
 *      </div>
 *
 * @since 2.0
 * @class ns.widget.core.Button
 * @component-selector button, [data-role="button"], .ui-btn, input[type="button"]
 * @component-type standalone-component
 * @extends ns.widget.BaseWidget
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../engine",
			"../../util/selectors",
			"../core",
			"../../util/DOM/css",
			"./Page",
			"../BaseWidget",
			"../BaseKeyboardSupport",
			"../../util/object"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				Page = ns.widget.core.Page,
				BaseKeyboardSupport = ns.widget.core.BaseKeyboardSupport,
				engine = ns.engine,
				/**
				 * Create instance of widget
				 * @constructor
				 * @member ns.widget.core.Button
				 */
				utilDOM = ns.util.DOM,
				classes = {
					/**
					 * Standard button
					 * @style ui-btn
					 * @member ns.widget.core.Button
					 */
					BTN: "ui-btn",
					/**
					 * Disabled button
					 * @style ui-state-disabled
					 * @member ns.widget.core.Button
					 */
					DISABLED: "ui-state-disabled",
					/**
					 * Make inline button
					 * @style ui-inline
					 * @member ns.widget.core.Button
					 */
					INLINE: "ui-inline",
					/**
					 * Creates an icon button
					 * @style ui-btn-icon
					 * @member ns.widget.core.Button
					 */
					BTN_ICON: "ui-btn-icon",
					ICON_PREFIX: "ui-icon-",
					/**
					 * Creates a circle icon button
					 * @style ui-btn-circle
					 * @member ns.widget.core.Button
					 */
					BTN_CIRCLE: "ui-btn-circle",
					/**
					 * Creates a button without background
					 * @style ui-btn-nobg
					 * @member ns.widget.core.Button
					 */
					BTN_NOBG: "ui-btn-nobg",
					BTN_ICON_ONLY: "ui-btn-icon-only",
					BTN_TEXT: "ui-btn-text",
					BTN_FAB: "ui-btn-fab",
					BTN_FLAT: "ui-btn-flat",
					BTN_CONTAINED: "ui-btn-contained",
					/**
					 * Creates a button widget with light text
					 * @style ui-btn-text-light
					 * @member ns.widget.core.Button
					 */
					BTN_TEXT_LIGHT: "ui-btn-text-light",
					/**
					 * Creates a button widget with dark text
					 * @style ui-btn-text-dark
					 * @member ns.widget.core.Button
					 */
					BTN_TEXT_DARK: "ui-btn-text-dark",
					FOCUS: "ui-btn-focus",
					/**
					 * Change background color of button to red
					 * @style ui-color-red
					 * @preview <span style="background-color: red;">&nbsp;</span>
					 * @member ns.widget.core.Button
					 */
					/**
					 * Button for header
					 * @style ui-more
					 * @member ns.widget.core.Button
					 */
					/**
					 * Button more for header
					 * @style ui-icon-overflow
					 * @member ns.widget.core.Button
					 */
					/**
					 * Button details for header
					 * @style ui-icon-detail
					 * @member ns.widget.core.Button
					 */
					/**
					 * Button select all for header
					 * @style ui-icon-selectall
					 * @member ns.widget.core.Button
					 */
					/**
					 * Icon only style
					 * @style ui-btn-icon-only
					 * @member ns.widget.core.Button
					 */
					BTN_ICON_POSITION_PREFIX: "ui-btn-icon-",
					/**
					 * Creates a button widget with position in middle
					 * @style ui-btn-text-middle
					 * @member ns.widget.core.Button
					 */
					BTN_ICON_MIDDLE: "ui-btn-icon-middle",
					BUTTON_CONTENT: "ui-btn-content",
					HIDDEN: "ui-hidden"
				},
				MIN_SIZE = 32,
				MAX_SIZE = 230,
				buttonStyle = {
					CIRCLE: "circle",
					TEXTLIGHT: "light",
					TEXTDARK: "dark",
					NOBG: "nobg",
					ICON_MIDDLE: "icon-middle",
					FLOATING: "fab",
					FLAT: "flat",
					CONTAINED: "contained"
				},
				defaultOptions = {
					// common options
					inline: true,
					icon: null,
					disabled: false,
					// mobile options
					style: buttonStyle.CONTAINED,
					iconpos: "left",
					size: null,
					middle: false,
					value: null,
					enabledIcon: false
				},
				Button = function () {
					var self = this;

					BaseKeyboardSupport.call(self);
					self.options = {};
					self._ui = {
						fab: null
					};
					self._callbacks = {
						onFABClick: null
					}
					self._classesPrefix = classes.BTN + "-";
				},

				prototype = new BaseWidget();

			Button.classes = classes;
			Button.prototype = prototype;

			/**
			 * Configure button
			 * @method _configure
			 * @protected
			 * @member ns.widget.core.Button
			 */
			prototype._configure = function () {
				/**
				 * Object with default options
				 * @property {Object} options
				 * @property {boolean} [options.inline=false] If is set true then button has inline style
				 * @property {?string} [options.icon=null] Set icon class name for button
				 * @property {boolean} [options.disabled=false] Disable button if is set to true
				 * @property {"left"|"right"|"button"|"top"} [options.iconpos="left"] Set icon position
				 * @member ns.widget.core.Button
				 * @static
				 */
				/**
				 * "circle" Make circle button
				 * "nobg" Make button without background
				 * @property {string} [options.style="flat"] Set style of button
				 * @member ns.widget.core.Button
				 * @static
				 */
				this.options = ns.util.object.copy(defaultOptions);
			};

			/**
			 * Reads class based on name conversion option value
			 *
			 * @method _readWidgetSpecyficOptionFromElementClassname
			 * @param {HTMLElement} element Main element of widget
			 * @param {string} name Name of option which should be used
			 * @return {boolean} If option value was successfully read
			 * @member ns.widget.BaseWidget
			 * @protected
			 */
			prototype._readWidgetSpecyficOptionFromElementClassname = function (element, name) {
				var options = this.options,
					classList = element.classList;

				switch (name) {
					case "enabledIcon" :
						if (classList.contains(classes.BTN_ICON)) {
							options.enabledIcon = true;
							return true;
						}
						break;
				}
				return false;
			};

			/**
			 * Set style option
			 * @method _setStyle
			 * @param {HTMLElement} element
			 * @param {string} style
			 * @protected
			 * @member ns.widget.core.Button
			 */
			prototype._setStyle = function (element, style) {
				var self = this,
					options = self.options,
					buttonClassList = element.classList,
					change = false,
					ui = self._ui;

				style = style || options.style;

				if (style !== buttonStyle.FLOATING && // new button style
					ui.fab !== null) { // and current button doesn't have fab element
					self._revertFromFAB(element); // then revert FAB html structure
				}

				buttonClassList.remove(classes.BTN_CIRCLE);
				buttonClassList.remove(classes.BTN_NOBG);
				buttonClassList.remove(classes.BTN_TEXT_LIGHT);
				buttonClassList.remove(classes.BTN_TEXT_DARK);
				buttonClassList.remove(classes.BTN_FLAT);
				buttonClassList.remove(classes.BTN_CONTAINED);

				switch (style) {
					case buttonStyle.CIRCLE:
						buttonClassList.add(classes.BTN_CIRCLE);
						change = true;
						break;
					case buttonStyle.NOBG:
						buttonClassList.add(classes.BTN_NOBG);
						change = true;
						break;
					case buttonStyle.TEXTLIGHT:
						buttonClassList.add(classes.BTN_TEXT_LIGHT);
						change = true;
						break;
					case buttonStyle.TEXTDARK:
						buttonClassList.add(classes.BTN_TEXT_DARK);
						change = true;
						break;
					case buttonStyle.FLOATING:
						this._changeToFAB(element);
						change = true;
						break;
					case buttonStyle.FLAT:
						buttonClassList.add(classes.BTN_FLAT);
						change = true;
						break;
					case buttonStyle.CONTAINED:
						buttonClassList.add(classes.BTN_CONTAINED);
						change = true;
						break;
					default:
				}

				if (change) {
					options.style = style;

					self._saveOption("style", style);
				}
			};

			/**
			 * Set inline option
			 * @method _setInline
			 * @param {HTMLElement} element
			 * @param {boolean} inline
			 * @protected
			 * @member ns.widget.core.Button
			 */
			prototype._setInline = function (element, inline) {
				var options = this.options;

				if (inline === undefined) {
					inline = element.getAttribute("data-inline");
					if (inline === null) {
						inline = this._readCommonOptionFromElementClassname(element, "inline");
					}
					inline = (inline === "false") ? false : !!inline;
				}

				element.classList.toggle(classes.INLINE, inline);
				options.inline = inline;

				this._saveOption("inline", inline);
			};

			/**
			 * Set icon option
			 * @method _setIcon
			 * @param {HTMLElement} element
			 * @param {string} icon
			 * @protected
			 * @member ns.widget.core.Button
			 */
			prototype._setIcon = function (element, icon) {
				var self = this,
					classList = element.classList,
					options = self.options,
					styles = {},
					urlIcon,
					iconCSSRule = self._iconCSSRule;

				element.className = element.className
					.replace(RegExp("(\\" + classes.ICON_PREFIX + "([a-z-]*))", "g"), "");

				icon = icon || options.icon;
				options.icon = icon;

				if (icon) { // icon setting enables icon style
					options.enabledIcon = true;
				}

				self._saveOption("icon", icon);

				if (options.enabledIcon) {
					classList.add(classes.BTN_ICON);
					if (icon) {
						if (icon.indexOf(".") === -1) {
							classList.add(classes.ICON_PREFIX + icon);
							self._setTitleForIcon(element);
							if (iconCSSRule) {
								utilDOM.removeCSSRule(iconCSSRule);
							}
						} else {
							// if icon is file path
							urlIcon = "url(\"" + icon + "\")";
							styles["-webkit-mask-image"] = urlIcon;
							styles["mask-image"] = urlIcon;
							self._iconCSSRule = utilDOM.setStylesForPseudoClass("#" + element.id, "after", styles);
						}
					} // else - icon can be defined from app css styles

					// remove button text class if text content is empty
					if (!element.textContent.trim()) {
						classList.remove(classes.BTN_TEXT);
					}
				} else {
					classList.remove(classes.BTN_ICON);
					if (iconCSSRule) {
						utilDOM.removeCSSRule(iconCSSRule);
					}
				}
			};

			prototype._removeIconposClass = function (element) {
				var self = this;

				element = element || self.element;
				element.classList.remove(classes.BTN_ICON_POSITION_PREFIX + "left");
				element.classList.remove(classes.BTN_ICON_POSITION_PREFIX + "top");
				element.classList.remove(classes.BTN_ICON_ONLY);
			};

			prototype._addIconposClass = function (element) {
				var self = this,
					innerTextLength;

				element = element || self.element;

				innerTextLength = element.textContent.trim().length ||
					(element.value ? element.value.length : 0);

				if (innerTextLength > 0) {
					element.classList.add(classes.BTN_ICON_POSITION_PREFIX + self.options.iconpos);
				} else {
					element.classList.add(classes.BTN_ICON_ONLY);
				}
			};

			/**
			 * Set iconpos option
			 * @method _setIconpos
			 * @param {HTMLElement} element
			 * @param {string} iconpos
			 * @protected
			 * @member ns.widget.core.Button
			 */
			prototype._setIconpos = function (element, iconpos) {
				var self = this,
					options = self.options,
					style = options.style;

				self._removeIconposClass(element);

				iconpos = iconpos || options.iconpos;

				if (options.icon && style !== buttonStyle.CIRCLE && style !== buttonStyle.NOBG && style !== buttonStyle.FLOATING) {
					options.iconpos = iconpos;

					self._addIconposClass(element);
					self._saveOption("iconpos", iconpos);
				}
			};

			/**
			 * Set title for button without showing text
			 * @method _setTitleForIcon
			 * @param {HTMLElement|HTMLInputElement|HTMLButtonElement} element
			 * @protected
			 * @member ns.widget.core.Button
			 */
			prototype._setTitleForIcon = function (element) {
				var options = this.options,
					buttonText = element.textContent;

				// Add title to element if button not has text.
				if (options.iconpos === "notext" && !element.getAttribute("title")) {
					element.setAttribute("title", buttonText);
					ns.warn("iconpos='notext' is deprecated.");
				}
			};

			prototype._focus = function () {
				var elementClassList;

				if (ns.getConfig("keyboardSupport", false)) {
					elementClassList = this.element.classList;

					elementClassList.add(classes.FOCUS);
					this.element.focus();
				}
			};

			prototype._blur = function () {
				var elementClassList;

				if (ns.getConfig("keyboardSupport", false)) {
					elementClassList = this.element.classList;

					elementClassList.remove(classes.FOCUS);
					this.element.blur();
				}
			};

			/**
			 * Sets button to disabled if element.disabled or element.disabled property is true,
			 * or class is set to ui-state-disabled
			 * @method _setDisabled
			 * @param {HTMLElement} element
			 * @param {boolean} state
			 * @protected
			 */
			prototype._setDisabled = function (element, state) {
				var self = this,
					options = self.options,
					buttonClassList = element.classList;

				if (state === true || options.disabled === true || element.disabled ||
					buttonClassList.contains(classes.DISABLED)) {
					options.disabled = true;
					self._disable(element);
				} else {
					options.disabled = false;
				}

				self._saveOption("disabled", options.disabled);
			};

			function wrapButtonContent(element) {
				var content = null;

				if (element.children.length > 1 ||
					(element.children.length === 1 && // don't wrap himself
						!element.firstElementChild.classList.contains(classes.BUTTON_CONTENT))) {
					content = document.createElement("div");
					content.classList.add(classes.BUTTON_CONTENT);

					// move button content to the content element
					[].slice.call(element.children).forEach(function (child) {
						content.appendChild(child);
					});

					element.appendChild(content);
				}

				return content;
			}

			/**
			 * Build Button
			 * @method _build
			 * @protected
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @member ns.widget.core.Button
			 */
			prototype._build = function (element) {
				var self = this,
					buttonClassList = element.classList;

				if (!buttonClassList.contains(classes.BTN)) {
					buttonClassList.add(classes.BTN);
				}

				self._content = wrapButtonContent(element);

				self._setStyle(element);
				self._setInline(element);
				self._setIconpos(element);
				self._setIcon(element);
				self._setSize(element);
				self._setDisabled(element);
				self._setTextButton(element);

				if (!element.hasAttribute("tabindex")) {
					element.setAttribute("tabindex", 0);
				}

				return element;
			};

			/**
			 * Refresh structure
			 * @method _refresh
			 * @protected
			 * @member ns.widget.core.Button
			 */
			prototype._refresh = function () {
				var self = this,
					element = this.element;

				self.options = self._getCreateOptions(element);
				self._build(element);

				return null;
			};

			/**
			 * Get value of button
			 * @method _getValue
			 * @protected
			 * @member ns.widget.core.Button
			 */
			prototype._getValue = function () {
				return this.element.textContent;
			};

			/**
			 * Set size of button
			 * @method _setSize
			 * @param {HTMLElement} element
			 * @param {string|number} value
			 * @protected
			 * @member ns.widget.core.Button
			 */
			prototype._setSize = function (element, value) {
				var style = element.style,
					options = this.options,
					size = value || options.size;

				if (size) {
					size = parseInt(size, 10);

					if (size < MIN_SIZE) {
						size = MIN_SIZE;
					}
					if (size > MAX_SIZE) {
						size = MAX_SIZE;
					}
					style.height = size + "px";
					style.width = size + "px";

					// @to do: why size has the same value for width and height
					options.size = size;
				}

			};

			/**
			 * Set text of the button
			 * @method _setTextButton
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Button
			 */
			prototype._setTextButton = function (element) {
				if (element.textContent.trim()) {
					element.classList.add(classes.BTN_TEXT);
				} else {
					element.classList.remove(classes.BTN_TEXT);
				}
			};

			/**
			 * Set value of button
			 * @method _setValue
			 * @param {string} value
			 * @protected
			 * @member ns.widget.core.Button
			 */
			prototype._setValue = function (value) {
				this.element.textContent = value;
			};

			/**
			 * Enable button
			 * @method _enable
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Button
			 */
			prototype._enable = function (element) {
				var self = this,
					options = self.options;

				if (element) {
					if (element.tagName.toLowerCase() === "button") {
						element.disabled = false;
					}
					if (!this.isCustomElement) {
						element.removeAttribute("disabled");
					}
					element.classList.remove(classes.DISABLED);
					options.disabled = false;

					self._saveOption("disabled", false);
				}
			};

			prototype._bindEvents = function (element) {
				var self = this;

				self._focusCallback = self._focus.bind(self);
				self._blurCallback = self._blur.bind(self);

				element.addEventListener("focus", self._focusCallback);
				element.addEventListener("blur", self._blurCallback);
			};

			prototype._unbindEvents = function (element) {
				var self = this;

				element.removeEventListener("focus", self._focusCallback);
				element.removeEventListener("blur", self._blurCallback);
			};

			/**
			 * Disable button
			 * @method _disable
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.core.Button
			 */
			prototype._disable = function (element) {
				var options = this.options;

				if (element) {
					if (element.tagName.toLowerCase() === "button") {
						element.disabled = true;
					}
					if (!this.isCustomElement) {
						element.setAttribute("disabled", "disabled");
					}
					element.classList.add(classes.DISABLED);
					options.disabled = true;

					this._saveOption("disabled", true);
				}
			};

			/**
			 * Store widget option value in element as data attribute
			 * @method _saveOption
			 * @param {string} name
			 * @param {*} value
			 * @protected
			 * @member ns.widget.core.Button
			 */
			prototype._saveOption = function (name, value) {
				var self = this,
					element = self.element,
					defaultValue = defaultOptions[name];

				if (element) {
					if (defaultValue !== value) {
						element.dataset[name] = value;
					} else {
						delete element.dataset[name];
					}
				}
			}

			/**
			 * Returns default option value for given name
			 * @method _getDefaultOption
			 * @param {string} optionName
			 * @return {*} default widget option value
			 * @protected
			 * @member ns.widget.core.Button
			 */
			prototype._getDefaultOption = function (optionName) {
				return defaultOptions[optionName];
			}

			function onFABClick(self, e) {
				ns.event.trigger(self.element, "vclick", e);
			}

			prototype._bindEventsFAB = function () {
				var self = this,
					fab = self._ui.fab;

				self._callbacks.onFABClick = onFABClick.bind(null, self);
				fab.addEventListener("vclick", self._callbacks.onFABClick);
			}

			prototype._unbindEventsFAB = function () {
				var self = this,
					fab = self._ui.fab;

				fab.removeEventListener("vclick", self._callbacks.onFABClick);
				self._callbacks.onFABClick = null;
			}

			prototype._changeToFAB = function (element) {
				var self = this,
					ui = self._ui,
					fab = document.createElement("button"),
					pageContainer = ns.util.selectors.getClosestBySelector(element, Page.selector);

				ui.fab = fab;
				fab.classList.add(classes.BTN);
				fab.classList.add(classes.BTN_FAB);
				if (self.options.icon) {
					fab.classList.add(classes.BTN_ICON);
					fab.classList.add(classes.ICON_PREFIX + self.options.icon);
				}

				// hide element
				element.classList.add(classes.HIDDEN);

				if (pageContainer) {
					pageContainer.appendChild(fab);
				}
				// bind events to FAB
				self._bindEventsFAB();
			}

			prototype._revertFromFAB = function (element) {
				var self = this,
					fab = self._ui.fab;

				// unbind FAB events
				self._unbindEventsFAB();

				// remove element from DOM
				if (fab) {
					fab.parentElement.removeChild(fab);
					self._ui.fab = null;
				}
				// show element
				element.classList.remove(classes.HIDDEN);
			}

			ns.widget.core.Button = Button;

			Button.defaultOptions = defaultOptions;

			engine.defineWidget(
				"Button",
				"button, [data-role='button'], .ui-btn, input[type='button']",
				[],
				Button,
				"core"
			);

			engine.defineWidget(
				"inputButton",
				"",
				[],
				Button,
				"core",
				false,
				false,
				HTMLInputElement
			);

			engine.defineWidget(
				"formButton",
				"",
				[],
				Button,
				"core",
				false,
				false,
				HTMLButtonElement
			);

			BaseKeyboardSupport.registerActiveSelector("[data-role='button'], button, [type='button'], [type='submit'], [type='reset'], .ui-button, .ui-btn");

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.Button;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
