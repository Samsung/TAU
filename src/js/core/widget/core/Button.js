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
 *          <input type="button" class="ui-btn ui-color-orange" value="Input Button Circle" />
 *      </div>
 *
 * #### For rows:
 *
 *      @example
 *      <div class="ui-grid-row">
 *          <button type="button" class="ui-btn">Button Circle</button>
 *          <a href="#" class="ui-btn ui-color-red" >A Button Circle</a>
 *          <input type="button" class="ui-btn ui-color-orange" value="Input Button Circle" />
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
			"../BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
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
					INLINE: "ui-inline",
					BTN_ICON: "ui-btn-icon",
					ICON_PREFIX: "ui-icon-",
					BTN_CIRCLE: "ui-btn-circle",
					BTN_NOBG: "ui-btn-nobg",
					BTN_ICON_ONLY: "ui-btn-icon-only",
					BTN_TEXT_LIGHT: "ui-btn-text-light",
					BTN_TEXT_DARK: "ui-btn-text-dark",
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
					BTN_ICON_MIDDLE: "ui-btn-icon-middle"
				},
				Button = function () {
					var self = this;

					self.options = {};
					self._classesPrefix = classes.BTN + "-";
				},
				buttonStyle = {
					CIRCLE: "circle",
					TEXTLIGHT: "light",
					TEXTDARK: "dark",
					NOBG: "nobg",
					ICON_MIDDLE: "icon-middle"
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
				 * @property {null|"circle"|"nobg"} [options.style=null] Set style of button
				 * @member ns.widget.core.Button
				 * @static
				 */
				this.options = {
					// common options
					inline: false, //url
					icon: null,
					disabled: false,
					// mobile options
					style: null,
					iconpos: "left",
					size: null,
					middle: false
				};
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
				var options = this.options,
					buttonClassList = element.classList,
					change = false;

				style = style || options.style;

				switch (style) {
					case buttonStyle.CIRCLE:
						buttonClassList.remove(classes.BTN_NOBG);
						buttonClassList.add(classes.BTN_CIRCLE);
						change = true;
						break;
					case buttonStyle.NOBG:
						buttonClassList.remove(classes.BTN_CIRCLE);
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
					default:
				}

				if (change) {
					options.style = style;
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

				inline = inline || options.inline;

				if (inline) {
					element.classList.add(classes.INLINE);
					options.inline = inline;
				}
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

				icon = icon || options.icon;
				options.icon = icon;

				if (icon) {
					classList.add(classes.BTN_ICON);
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
				} else {
					if (iconCSSRule) {
						utilDOM.removeCSSRule(iconCSSRule);
					}
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
				var options = this.options,
					style = options.style,
					innerTextLength = element.textContent.length || (element.value ? element.value.length : 0);

				iconpos = iconpos || options.iconpos;

				if (options.icon && style !== buttonStyle.CIRCLE && style !== buttonStyle.NOBG) {
					if (innerTextLength > 0) {
						element.classList.add(classes.BTN_ICON_POSITION_PREFIX + iconpos);
					} else {
						element.classList.add(classes.BTN_ICON_ONLY);
					}
					options.iconpos = iconpos;
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
			};
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

				self._setStyle(element);
				self._setInline(element);
				self._setIconpos(element);
				self._setIcon(element);
				self._setSize(element);
				self._setDisabled(element);

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

				self._setStyle(element);
				self._setInline(element);
				self._setIconpos(element);
				self._setIcon(element);
				self._setSize(element);
				self._setDisabled(element);

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
					size = parseInt(value || options.size, 10);

				if (size < 32) {
					size = 32;
				}
				if (size > 230) {
					size = 230;
				}
				style.height = size + "px";
				style.width = size + "px";
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
				}
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
				}
			};

			ns.widget.core.Button = Button;

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
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.Button;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
