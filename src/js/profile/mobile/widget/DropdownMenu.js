/*global window, ns, define, HTMLSelectElement */
/*jslint nomen: true */
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
 * #Dropdown Menu
 * Dropdown menu component is used to select one option. It is created as a drop-down list form.
 *
 * ##Default selector
 * In default all select elements are changed to Tizen WebUI DropdownMenu.
 * Additionally elements with _data-native-menu=false_ will use custom popups for option selection
 *
 * ###  HTML Examples
 *
 * ####  Create DropdownMenu
 * Default value of data-native-menu attribute is true and it makes native DropdownMenu.
 * This widget also offers the possibility of having custom DropdownMenu.
 *
 *        @example
 *        <select data-native-menu="false">
 *            <option value="1">Item1</option>
 *            <option value="2">Item2</option>
 *            <option value="3">Item3</option>
 *            <option value="4">Item4</option>
 *        </select>
 *
 * ## Manual constructor
 * For manual creation of DropdownMenu widget you can use constructor of widget.
 *
 *        @example
 *        <select id="dropdownmenu" data-native-menu="false">
 *            <option value="1">Item1</option>
 *            <option value="2">Item2</option>
 *            <option value="3">Item3</option>
 *            <option value="4">Item4</option>
 *        </select>
 *        <script>
 *            var element = document.getElementById("dropdownmenu"),
 *                widget = tau.widget.DropdownMenu(element);
 *        </script>
 *
 *
 * ##Inline type
 * When data-inline attribute is set to true, width of the DropdownMenu is determined by its text.
 * (Default is false.)
 *
 *            @example
 *            <select id="dropdownmenu" data-native-menu="false" data-inline="true">
 *                <option value="1">Item1</option>
 *                <option value="2">Item2</option>
 *                <option value="3">Item3</option>
 *                <option value="4">Item4</option>
 *            </select>
 *
 * ##Placeholder options
 * If you use <option> with data-placeholder="true" attribute, you can make a default placeholder.
 * Default value of data-hide-placeholder-menu-items attribute is true and data-placeholder option
 * is hidden. If you don't want that, you can use data-hide-placeholder-menu-items="false"
 * attribute.
 *
 *        @example
 *        <select id="dropdownmenu" data-native-menu="false"
 *            data-hide-placeholder-menu-items="false">
 *            <option value="choose-one" data-placeholder="true">Choose an option</option>
 *            <option value="1">Item1</option>
 *            <option value="2">Item2</option>
 *            <option value="3">Item3</option>
 *            <option value="4">Item4</option>
 *        </select>
 *
 * ##Methods
 * To call method on widget you can use one of existing API:
 *
 * First API is from tau namespace: RECOMMEND
 *
 *        @example
 *        var element = document.getElementById("dropdownmenu"),
 *            widget = tau.widget.DropdownMenu(element);
 *        widget.methodName(methodArgument1, methodArgument2, ...);
 *
 * Second API is jQuery Mobile API and for call _methodName_ you can use: Support for backward
 * compatibility
 *
 *        @example
 *        $(".selector").dropdownmenu("methodName", methodArgument1, methodArgument2, ...);
 *
 * - "open" - DropdownMenu open
 *
 *        @example
 *        var elDropdownMenu = document.getElementById("dropdownmenu"),
 *            widget = tau.widget.DropdownMenu(elDropdownMenu);
 *        widget.open();
 *
 * - "close" - DropdownMenu close
 *
 *        @example
 *        var elDropdownMenu = document.getElementById("dropdownmenu"),
 *            widget = tau.widget.DropdownMenu(elDropdownMenu);
 *        widget.close();
 *
 * - "refresh" - This method refreshes the DropdownMenu widget.
 *
 *        @example
 *        var elDropdownMenu = document.getElementById("dropdownmenu"),
 *            widget = tau.widget.DropdownMenu(elDropdownMenu);
 *        widget.refresh();
 *
 * @since 2.4
 * @class ns.widget.mobile.DropdownMenu
 * @component-selector .ui-dropdownmenu
 * @extends ns.widget.mobile.BaseWidgetMobile
 * @author Hagun Kim <hagun.kim@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/util/selectors",
			"../../../core/event",
			"../../../core/util/DOM/manipulation",
			"../../../core/widget/core/Page",
			"../widget",
			"./BaseWidgetMobile",
			"../../../core/widget/BaseKeyboardSupport"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				BaseKeyboardSupport = ns.widget.core.BaseKeyboardSupport,
				engine = ns.engine,
				domUtils = ns.util.DOM,
				eventUtils = ns.event,
				selectors = ns.util.selectors,
				slice = [].slice,
				Page = ns.widget.core.Page,
				indexOf = [].indexOf,
				DropdownMenu = function () {
					var self = this;
					/**
					 * @property {boolean} _isOpen Open/Close status of DropdownMenu
					 * @member ns.widget.mobile.DropdownMenu
					 */

					self._isOpen = false;
					self._isClosing = false;
					/**
					 * @property {number} _selectedIndex Index of selected option in DropdownMenu
					 * @member ns.widget.mobile.DropdownMenu
					 */
					self._selectedIndex = null;
					/**
					 * @property {Object} _ui Object with html elements connected with DropdownMenu
					 * @member ns.widget.mobile.DropdownMenu
					 */
					self._ui = {
						elSelectWrapper: null,
						elPlaceHolder: null,
						elSelect: null,
						screenFilter: null,
						elOptionContainer: null,
						elOptions: null,
						elPage: null,
						elContent: null,
						elDefaultOption: null
					};

					self._horizontalPosition = null;

					/**
					 * @property {Object} options Object with default options
					 * @property {boolean} [options.nativeMenu=true] Sets the DropdownMenu widget as native/custom type.
					 * @property {boolean} [options.inline=false] Sets the DropdownMenu widget as inline/normal type.
					 * @property {boolean} [options.hidePlaceholderMenuItems=true] Hide/Reveal the placeholder option in dropdown list of the DropdownMenu.
					 * @property {string}  [options.items=''] List of <option>: 'key1:value1, key2:value2, key3:value3 .....'
					 * @member ns.widget.mobile.DropdownMenu
					 */
					self.options = {
						nativeMenu: true,
						inline: false,
						hidePlaceholderMenuItems: true,
						items: ""
					};
					/**
					 * @property {Function|null} _toggleMenuBound callback for select action
					 * @protected
					 * @member ns.widget.mobile.DropdownMenu
					 */
					self._toggleMenuBound = null;
					/**
					 * @property {Function|null} _changeOptionBound callback for change value
					 * @protected
					 * @member ns.widget.mobile.DropdownMenu
					 */
					self._changeOptionBound = null;
					/**
					 * @property {Function|null} _onResizeBound callback for throttledresize
					 * @protected
					 * @member ns.widget.mobile.DropdownMenu
					 */
					self._onResizeBound = null;
					/**
					 * @property {Function|null} _nativeChangeOptionBound callback for change value
					 * @protected
					 * @member ns.widget.mobile.DropdownMenu
					 */
					self._nativeChangeOptionBound = null;
					/**
					 * @property {Function|null} _focusBound callback for focus action
					 * @protected
					 * @member ns.widget.mobile.DropdownMenu
					 */
					self._focusBound = null;
					/**
					 * @property {Function|null} _blurBound callback for blur action
					 * @protected
					 * @member ns.widget.mobile.DropdownMenu
					 */
					self._blurBound = null;
					// event callbacks
					self._callbacks = {};

					BaseKeyboardSupport.call(self);
				},
				widgetSelector = "select:not([data-role='slider']):not([data-role='range'])" +
					":not([data-role='toggleswitch']):not(.ui-toggleswitch):not(.ui-slider)" +
					":not([data-role='on-off-switch']):not(.ui-on-off-switch)," +
					"select.ui-select-menu:not([data-role='slider']):not([data-role='range'])" +
					":not([data-role='toggleswitch'])" +
					":not([data-role='on-off-switch']):not(.ui-on-off-switch)," +
					".ui-dropdownmenu",
				/**
				 * Dictionary for DropdownMenu related css class names
				 * @property {Object} classes
				 * @member ns.widget.mobile.DropdownMenu
				 * @static
				 */
				classes = {
					/**
					 * Standard dropdown menu widget
					 * @style ui-dropdownmenu
					 * @member ns.widget.mobile.DropdownMenu
					 */
					selectWrapper: "ui-dropdownmenu",
					/**
					 * Set an option group in dropdown menu widget
					 * @style ui-dropdownmenu-optiongroup
					 * @member ns.widget.mobile.DropdownMenu
					 */
					optionGroup: "ui-dropdownmenu-optiongroup",
					/**
					 * Set a placeholder in dropdown menu widget
					 * @style ui-dropdownmenu-placeholder
					 * @member ns.widget.mobile.DropdownMenu
					 */
					placeHolder: "ui-dropdownmenu-placeholder",
					/**
					 * Set an option list in dropdown menu widget
					 * @style ui-dropdownmenu-options
					 * @member ns.widget.mobile.DropdownMenu
					 */
					optionList: "ui-dropdownmenu-options",
					/**
					 * Set a wrapper for options in dropdown menu widget
					 * @style ui-dropdownmenu-options-wrapper
					 * @member ns.widget.mobile.DropdownMenu
					 */
					optionsWrapper: "ui-dropdownmenu-options-wrapper",
					/**
					 * Set selected to dropdown menu widget
					 * @style ui-dropdownmenu-selected
					 * @member ns.widget.mobile.DropdownMenu
					 */
					selected: "ui-dropdownmenu-selected",
					/**
					 * Set active to dropdown menu widget
					 * @style ui-dropdownmenu-active
					 * @member ns.widget.mobile.DropdownMenu
					 */
					active: "ui-dropdownmenu-active",
					/**
					 * Opens options in dropdown menu widget
					 * @style ui-dropdownmenu-options-opening
					 * @member ns.widget.mobile.DropdownMenu
					 */
					opening: "ui-dropdownmenu-options-opening",
					/**
					 * Closes options in dropdown menu widget
					 * @style ui-dropdownmenu-options-closing
					 * @member ns.widget.mobile.DropdownMenu
					 */
					closing: "ui-dropdownmenu-options-closing",
					/**
					 * Set class for opened options in dropdown menu widget
					 * @style ui-dropdownmenu-options-opened
					 * @member ns.widget.mobile.DropdownMenu
					 */
					opened: "ui-dropdownmenu-options-opened",
					/**
					 * Set filter structure in dropdown menu widget
					 * @style ui-dropdownmenu-overlay
					 * @member ns.widget.mobile.DropdownMenu
					 */
					filter: "ui-dropdownmenu-overlay",
					/**
					 * Set hidden filter structure in dropdown menu widget
					 * @style ui-dropdownmenu-overlay-hidden
					 * @member ns.widget.mobile.DropdownMenu
					 */
					filterHidden: "ui-dropdownmenu-overlay-hidden",
					/**
					 * Set disabled in dropdownmenu widget
					 * @style ui-dropdownmenu-disabled
					 * @member ns.widget.mobile.DropdownMenu
					 */
					disabled: "ui-dropdownmenu-disabled",
					/**
					 * Set dropdown menu widget as disabled
					 * @style ui-disabled
					 * @member ns.widget.mobile.DropdownMenu
					 */
					widgetDisabled: "ui-disabled",
					/**
					 * Set dropdown menu widget as inline
					 * @style ui-dropdownmenu-inline
					 * @member ns.widget.mobile.DropdownMenu
					 */
					inline: "ui-dropdownmenu-inline",
					/**
					 * Set dropdown menu widget as native
					 * @style ui-dropdownmenu-native
					 * @member ns.widget.mobile.DropdownMenu
					 */
					native: "ui-dropdownmenu-native",
					/**
					 * Set dropdown menu options to displayed on top
					 * @style ui-dropdownmenu-top
					 * @member ns.widget.mobile.DropdownMenu
					 */
					top: "ui-dropdownmenu-options-top",
					/**
					 * Set dropdown menu options to displayed on bottom
					 * @style ui-dropdownmenu-bottom
					 * @member ns.widget.mobile.DropdownMenu
					 */
					bottom: "ui-dropdownmenu-options-bottom",
					/**
					 * Set dropdown menu widget as focus
					 * @style ui-focus
					 * @member ns.widget.mobile.DropdownMenu
					 */
					focus: BaseKeyboardSupport.classes.focus,
					/**
					 * Set top and bottom margins for dropdownmenu
					 * @style "ui-dropdownmenu-options-vertical-margins"
					 * @member ns.widget.mobile.DropdownMenu
					 */
					verticalMargins: "ui-dropdownmenu-options-vertical-margins"
				},
				prototype = new BaseWidget();

			DropdownMenu.prototype = prototype;
			DropdownMenu.classes = classes;

			/**
			 * vclick to toggle menu event handler
			 * @method toggleMenu
			 * @private
			 * @static
			 * @param {ns.widget.mobile.DropdownMenu} self
			 * @param {Event} event
			 * @member ns.widget.mobile.DropdownMenu
			 */
			function toggleMenu(self, event) {
				self._toggleSelect(event);
				eventUtils.stopPropagation(event);
				eventUtils.preventDefault(event);
			}

			/**
			 * vclick to change option event handler
			 * @method changeOption
			 * @private
			 * @static
			 * @param {ns.widget.mobile.DropdownMenu} self
			 * @param {Event} event
			 * @member ns.widget.mobile.DropdownMenu
			 */
			function changeOption(self, event) {
				var target = event.target,
					tag = target.tagName,
					classList = target.classList;

				if (tag === "LI" && !classList.contains(classes.optionGroup) && !classList.contains(classes.disabled)) {
					self._selectedIndex = indexOf.call(self._ui.elOptions, target);
					self._changeOption();
					self._toggleSelect(event);
				}
				event.stopPropagation();
				event.preventDefault();
			}

			/**
			 * Change option in native DropdownMenu
			 * @method nativeChangeOption
			 * @private
			 * @static
			 * @param {ns.widget.mobile.DropdownMenu} self
			 * @member ns.widget.mobile.DropdownMenu
			 */
			function nativeChangeOption(self) {
				var ui = self._ui,
					selectedOption = ui.elSelect[ui.elSelect.selectedIndex];

				ui.elPlaceHolder.textContent = selectedOption.textContent;
			}

			/**
			 * Function fires on window resizing
			 * @method onResize
			 * @private
			 * @static
			 * @param {ns.widget.mobile.DropdownMenu} self
			 * @param {Event} event
			 * @member ns.widget.mobile.DropdownMenu
			 */
			function onResize(self, event) {
				if (self._isOpen === true) {
					self._isOpen = !self._isOpen;
					self._toggleSelect(event);
					event.stopPropagation();
					event.preventDefault();
				}
			}

			/**
			 * Function adds ui-focus class on focus
			 * @private
			 * @static
			 * @param {ns.widget.mobile.DropdownMenu} self
			 * @param {Event} event
			 * @member ns.widget.mobile.DropdownMenu
			 */
			function onFocus(self, event) {
				var ui = self._ui,
					target = event.target;

				if (ns.getConfig("keyboardSupport")) {
					if (target === ui.elSelectWrapper ||
						target.parentNode === ui.elOptionContainer) {
						target.classList.add(classes.focus);
					}
				}
			}

			/**
			 * Function stops propagation of events to appbar
			 * @private
			 * @static
			 * @param {ns.widget.mobile.DropdownMenu} self
			 * @param {Event} event
			 * @member ns.widget.mobile.DropdownMenu
			 */
			function onTouchMove(self, event) {
				event.stopPropagation();
			}

			/**
			 * Function removes ui-focus class on focus
			 * @private
			 * @static
			 * @param {ns.widget.mobile.DropdownMenu} self
			 * @param {Event} event
			 * @member ns.widget.mobile.DropdownMenu
			 */
			function onBlur(self, event) {
				var ui = self._ui,
					target = event.target;

				if (ns.getConfig("keyboardSupport")) {
					if (target === ui.elSelectWrapper ||
						target.parentNode === ui.elOptionContainer) {
						target.classList.remove(classes.focus);
					}
				}
			}

			/**
			 * Toggle enable/disable DropdownMenu
			 * @method setDisabledStatus
			 * @private
			 * @static
			 * @param {HTMLElement} element
			 * @param {boolean} isDisabled
			 * @member ns.widget.mobile.DropdownMenu
			 */
			function setDisabledStatus(element, isDisabled) {
				var classList = element.classList;

				if (isDisabled) {
					classList.add(classes.disabled);
					classList.add(classes.widgetDisabled);
					classList.add(BaseWidget.classes.disable);
				} else {
					classList.remove(classes.disabled);
					classList.remove(classes.widgetDisabled);
					classList.remove(BaseWidget.classes.disable);
				}
			}
			/**
			 * Return data array used to fill select tag options elements
			 * @method dataItemsToArray
			 * @private
			 * @static
			 * @member ns.widget.mobile.DropdownMenu
			 */
			function dataItemsToArray(dataItems) {
				var items = dataItems,
					it,
					len = 0,
					i = 0,
					result = [];

				items = items.split(",");
				len = items.length;

				for (i = 0; i < len; i++) {
					it = items[i].split(":");
					result.push({
						textContent: it[0],
						value: it[1]
					});
				}

				return result;
			}

			/**
			 * Add options element to DropdownMenu (if element has data-item)
			 * @method addSelectDataItems
			 * @private
			 * @static
			 * @param {HTMLElement} element
			 * @member ns.widget.mobile.DropdownMenu
			 */
			function addSelectDataItems(element, dataIt) {
				var dataItems = dataItemsToArray(dataIt),
					len = dataItems.length,
					val = 0,
					i = 0;

				element.innerHTML = "";
				for (i = 0; i < len; i++) {
					val = typeof dataItems[i].value !== "undefined" ? dataItems[i].value : (i + 1);
					element.innerHTML += "<option value=\"" + val + "\">" +
					dataItems[i].textContent + "</option>";
				}
			}

			/**
			 * Convert option tag to li element
			 * @method _convertOptionToHTML
			 * @protected
			 * @param {boolean} hidePlaceholderMenuItems
			 * @param {HTMLElement} option
			 * @param {boolean} isDisabled
			 * @return {string}
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._convertOptionToHTML = function (hidePlaceholderMenuItems, option, isDisabled) {
				var className = option.className;

				if (!hidePlaceholderMenuItems || !domUtils.getNSData(option, "placeholder")) {
					if (isDisabled) {
						className += " " + classes.disabled;
					}
					return "<li data-value='" + option.value + "'" +
						(className ? " class='" + className + "'" : "") +
						(!isDisabled ? " tabindex='0'" : "") + ">" +
						option.textContent +
						"</li>";
				}
				return "";
			};

			/**
			 * Return top offset of element
			 * @method getTopOffsetOfElement
			 * @private
			 * @static
			 * @param {HTMLElement} element
			 * @param {HTMLElement} container
			 * @return number
			 * @member ns.widget.mobile.DropdownMenu
			 */
			function getTopOffsetOfElement(element, container) {
				var offsetTop = element.offsetTop,
					offsetParent;

				while (element.offsetParent) {
					offsetParent = element.offsetParent;
					offsetTop += offsetParent.offsetTop;
					if (element === container) {
						break;
					}
					element = offsetParent;
				}
				return offsetTop;
			}

			/**
			 * Construct element of option of DropdownMenu
			 * @method _constructOption
			 * @protected
			 * @return {string}
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._constructOption = function () {
				var self = this,
					i = 0,
					j,
					forElement,
					tag,
					resultHTML = "",
					optionArray = slice.call(self._ui.elSelect.children),
					optionCount = optionArray.length,
					groupOptionArray,
					groupOptCount,
					isDisabled,
					hidePlaceholderMenuItems = self.options.hidePlaceholderMenuItems;

				// This part is for optgroup tag.
				for (; i < optionCount; i++) {
					forElement = optionArray[i];
					isDisabled = forElement.disabled;
					tag = forElement.tagName;
					// for <option> tag
					if (tag === "OPTION") {
						/* When data-hide-placeholder-menu-items is true,
						 * <option> with data-placeholder="true" is hidden in DropdownMenu.
						 * It means that the <option> doesn't have to be DropdownMenu element.
						 */
						resultHTML += self._convertOptionToHTML(hidePlaceholderMenuItems, forElement, isDisabled);
					} else if (tag === "OPTGROUP") {
						// for <optgroup> tag
						resultHTML += "<li class='" + classes.optionGroup +
							(isDisabled ? (" " + classes.disabled + "'") : "'") + ">" + forElement.label +
							"</li>";
						groupOptionArray = slice.call(forElement.children);
						for (j = 0, groupOptCount = groupOptionArray.length; j < groupOptCount; j++) {
							// If <optgroup> is disabled, all child of the optgroup are also disabled.
							isDisabled = forElement.disabled || groupOptionArray[j].disabled;
							resultHTML += self._convertOptionToHTML(hidePlaceholderMenuItems, groupOptionArray[j],
								isDisabled);
						}
					}
				}
				return resultHTML;
			};

			/**
			 * Setter for option inline
			 * @method _setInline
			 * @protected
			 * @param {HTMLElement} element
			 * @param {boolean} value
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._setInline = function (element, value) {
				var ui = this._ui;

				ui.elSelectWrapper.classList.toggle(classes.inline, value);
				if (value) {
					ui.elPlaceHolder.removeAttribute("style");
				}

				this.options.inline = value;
			};

			prototype._configure = function (element) {
				// check if the element is widget wrapper
				if (element.webkitMatchesSelector("." + classes.selectWrapper)) {
					element = element.querySelector(DropdownMenu.widgetSelector);
					if (element) {
						return element;
					}
				}
			}

			prototype._getContainer = function () {
				return this._ui.elSelectWrapper;
			}

			/**
			 * Build structure of DropdownMenu widget
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._build = function (element) {
				return this._generate(element, true);
			};

			/**
			 * Generate Placeholder and Options elements for DropdownMenu
			 * @method _generate
			 * @param {HTMLElement} element
			 * @param {boolean} create
			 * @return {HTMLElement}
			 * @protected
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._generate = function (element, create) {
				var self = this,
					options = self.options,
					selectedOption,
					elementId = element.id,
					ui = self._ui,
					pageClasses = Page.classes;

				if (self.options.items) {
					addSelectDataItems(element, self.options.items);
				}

				ui.elSelect = element;
				ui.page = selectors.getParentsByClass(element, pageClasses.uiPage)[0] || document.body;
				ui.content = selectors.getParentsByClass(element, pageClasses.uiContent)[0] ||
					selectors.getParentsByClass(element, pageClasses.uiHeader)[0];
				ui.elDefaultOption = element.querySelector("option[data-placeholder='true']");

				// check if selected index is after data placeholder item
				if (ui.elDefaultOption && element.selectedIndex > ui.elDefaultOption.index) {
					self._selectedIndex = element.selectedIndex - 1;
				} else {
					self._selectedIndex = element.selectedIndex;
				}

				if (create) {
					selectedOption = ui.elDefaultOption || element[element.selectedIndex] || element.options.item(element.selectedIndex);

					self._buildWrapper(element);
					self._buildPlaceholder(element, ui.elSelectWrapper, elementId,
						selectedOption ? selectedOption.textContent : "");
				}

				self._setNativeMenu(element, options.nativeMenu);
				self._setInline(element, options.inline);

				return element;
			};

			/**
			 * Build wrapper for whole UI structure
			 * @method _buildWrapper
			 * @protected
			 * @param {HTMLElement} element
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._buildWrapper = function (element) {
				var self = this,
					selectWrapperElement = self._createWrapper();

				selectWrapperElement.className = classes.selectWrapper;
				selectWrapperElement.id = element.id + "-dropdownmenu";
				selectWrapperElement.setAttribute("tabindex", "0");

				domUtils.insertNodesBefore(element, selectWrapperElement);

				selectWrapperElement.appendChild(element);

				self._ui.elSelectWrapper = selectWrapperElement;
			};

			/**
			 * Build placeholder HTML structure
			 * @method _buildPlaceholder
			 * @protected
			 * @param {HTMLElement} element
			 * @param {HTMLElement} selectWrapperElement
			 * @param {string} elementId
			 * @param {string} text
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._buildPlaceholder = function (element, selectWrapperElement, elementId, text) {
				var placeholderElement = document.createElement("span");

				placeholderElement.id = elementId + "-placeholder";
				placeholderElement.className = classes.placeHolder;
				placeholderElement.textContent = text;

				selectWrapperElement.insertBefore(placeholderElement, element);
				this._ui.elPlaceHolder = placeholderElement;
			};

			/**
			 * Build HTML for filter structure
			 * @method _buildFilter
			 * @protected
			 * @param {HTMLElement} element
			 * @param {string} elementId
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._buildFilter = function (element, elementId) {
				var ui = this._ui,
					screenFilterElement = ui.screenFilter,
					optionWrapperElement = ui.elOptionWrapper,
					optionContainerElement = ui.elOptionContainer,
					fragment = document.createDocumentFragment();

				if (!screenFilterElement) {
					screenFilterElement = document.createElement("div");
					screenFilterElement.classList.add(classes.filter, classes.filterHidden);
					screenFilterElement.id = elementId + "-overlay";
					fragment.appendChild(screenFilterElement);
				}

				if (!optionWrapperElement) {
					optionWrapperElement = document.createElement("div");
					optionWrapperElement.className = classes.optionsWrapper;
					optionWrapperElement.id = elementId + "-options-wrapper";
					fragment.appendChild(optionWrapperElement);
				}

				if (!optionContainerElement) {
					optionContainerElement = document.createElement("ul"),
					optionContainerElement.className = classes.optionList;
					optionContainerElement.id = elementId + "-options";
					optionWrapperElement.appendChild(optionContainerElement);
				}
				ui.page.appendChild(fragment);

				ui.elOptionContainer = optionContainerElement;
				ui.elOptionWrapper = optionWrapperElement;
				ui.screenFilter = screenFilterElement;
			};

			/**
			 * Setter for option nativeMenu
			 * @method _setNativeMenu
			 * @protected
			 * @param {HTMLElement} element
			 * @param {boolean} value
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._setNativeMenu = function (element, value) {
				var self = this,
					ui = self._ui,
					optionElements,
					elOptionContainer,
					selectWrapperElement = ui.elSelectWrapper,
					optionsAsText;

				if (value) {
					optionElements = element.querySelectorAll("option");
					selectWrapperElement.classList.add(classes.native);
				} else {
					self._buildFilter(element, element.id);
					elOptionContainer = ui.elOptionContainer;
					optionsAsText = self._constructOption();
					elOptionContainer.innerHTML = optionsAsText;
					optionElements = elOptionContainer.querySelectorAll("li[data-value]");
					optionElements[self._selectedIndex] &&
						optionElements[self._selectedIndex].classList.add(classes.selected);
				}

				ui.elOptions = optionElements;
				self.options.nativeMenu = value;
			};

			/**
			 * Init of DropdownMenu widget
			 * @method _init
			 * @param {HTMLElement} element
			 * @protected
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._init = function (element) {
				var self = this,
					ui = self._ui,
					elementId = element.id;

				if (!ui.elSelectWrapper) {
					ui.elSelectWrapper = document.getElementById(elementId + "-dropdownmenu");
					ui.elPlaceHolder = document.getElementById(elementId + "-placeholder");
					ui.elOptionWrapper = document.getElementById(elementId + "-options-wrapper");
					ui.elSelect = element;
					if (!self.options.nativeMenu) {
						ui.screenFilter = document.getElementById(elementId + "-overlay");
						ui.elOptionContainer = document.getElementById(elementId + "-options");
						ui.elOptions = ui.elOptionContainer.querySelectorAll("li[data-value]");
					}
				}
			};

			/**
			 * Refresh of DropdownMenu widget
			 * @method _refresh
			 * @protected
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._refresh = function () {
				var self = this;

				self._generate(self.element, false);
			};

			/**
			 * Enables widget
			 * @method _enable
			 *  @protected
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._enable = function () {
				setDisabledStatus(this._ui.elSelectWrapper, false);
				domUtils.removeAttribute(this.element, "disabled");
			};

			/**
			 * Disables widget
			 * @method _disable
			 *  @protected
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._disable = function () {
				setDisabledStatus(this._ui.elSelectWrapper, true);
				domUtils.setAttribute(this.element, "disabled", true);
			};

			/**
			 * Open DropdownMenu
			 * @method open
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype.open = function () {
				var self = this;

				if (self._isOpen === false) {
					self._toggleSelect();
				}
			};

			/**
			 * Close DropdownMenu
			 * @method close
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype.close = function () {
				var self = this;

				if (self._isOpen === true) {
					self._toggleSelect();
				}
			};

			/**
			 * Bind events of DropdownMenu widget
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._bindEvents = function () {
				var self = this,
					ui = self._ui,
					elOptionContainer = ui.elOptionContainer,
					elSelectWrapper = ui.elSelectWrapper;

				self._toggleMenuBound = toggleMenu.bind(null, self);
				self._changeOptionBound = changeOption.bind(null, self);
				self._onResizeBound = onResize.bind(null, self);
				self._nativeChangeOptionBound = nativeChangeOption.bind(null, self);
				self._focusBound = onFocus.bind(null, self);
				self._blurBound = onBlur.bind(null, self);
				self._touchMoveBound = onTouchMove.bind(null, self);

				elSelectWrapper.addEventListener("focus", self._focusBound);
				elSelectWrapper.addEventListener("blur", self._blurBound);
				if (!self.options.nativeMenu) {
					elSelectWrapper.addEventListener("vclick", self._toggleMenuBound);
					elOptionContainer.addEventListener("touchmove", self._touchMoveBound);
					elOptionContainer.addEventListener("vclick", self._changeOptionBound);
					elOptionContainer.addEventListener("focusin", self._focusBound); // bubble
					elOptionContainer.addEventListener("focusout", self._blurBound); // bubble
					if (ui.screenFilter) {
						ui.screenFilter.addEventListener("vclick", self._toggleMenuBound);
					}
					window.addEventListener("throttledresize", self._onResizeBound, true);
				} else {
					ui.elSelect.addEventListener("change", self._nativeChangeOptionBound);
				}
			};

			/**
			 * Coordinate Option ul element
			 * @method _coordinateOption
			 * @return {string}
			 * @protected
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._coordinateOption = function () {
				var self = this,
					offsetTop,
					offsetLeft,
					width,
					areaInfo,
					optionStyle,
					ui = self._ui,
					optionHeight = ui.elOptionContainer.offsetHeight,
					listItemWidthOffsets = [].slice.call(ui.elOptionContainer.children).map(mapItemWidth),
					biggestListItemWidth = Math.max.apply(Math, listItemWidthOffsets),
					wrapperMinWidth = parseInt(window.getComputedStyle(ui.elOptionWrapper).minWidth, 10),
					selectedItem = ui.elOptionContainer.querySelector("." + classes.selected),
					stylesOfSelectedOptionAfter = window.getComputedStyle(selectedItem, ":after"),
					options = self.options,
					scrollTop = ui.elOptionWrapper.parentNode.querySelector(".ui-scrollview-clip").scrollTop,
					height,
					// maxHeight,
					widgetParent = ui.elSelectWrapper.parentNode,
					widgetParentStyle = window.getComputedStyle(widgetParent),
					maxContainerWidth;

				self._offsetTop = getTopOffsetOfElement(ui.elSelectWrapper, ui.page);
				areaInfo = self._chooseDirection();

				width = biggestListItemWidth > wrapperMinWidth ?
				biggestListItemWidth + parseInt(stylesOfSelectedOptionAfter.marginRight, 10) +
				parseInt(stylesOfSelectedOptionAfter.width, 10) : wrapperMinWidth;

				height = optionHeight;

				// This part decides the location and direction of option list.
				offsetLeft = self._horizontalPosition === "right" ? window.screen.width - width : 0;
				optionStyle = "left: " + offsetLeft + "px; ";

				if (options.inline === true) {
					height = ui.elOptionContainer.children[0].offsetHeight * 5;
					maxContainerWidth = widgetParent.offsetWidth -
										(parseFloat(widgetParentStyle.paddingLeft) + parseFloat(widgetParentStyle.paddingRight));
					width = Math.min(maxContainerWidth, Math.max(width, ui.elOptionContainer.offsetWidth));
				}

				if (areaInfo.direction === "top") {
					offsetTop = self._offsetTop - height - scrollTop + ui.elPlaceHolder.offsetHeight;
					ui.elOptionWrapper.classList.add(classes.top);
				} else {
					offsetTop = self._offsetTop - scrollTop;
					ui.elOptionWrapper.classList.add(classes.bottom);

				}

				// List does not require vertical paddings.
				if (selectors.getParentsByTag(ui.elSelect, "li").length == 0) {
					ui.elOptionWrapper.classList.add(classes.verticalMargins);
				}

				optionStyle += "top: " + offsetTop + "px; width: " + width + "px; max-height: " + height + "px;";
				return optionStyle;
			};

			/**
			 * Choose a spreading direction of option list and calculate area to display the option list
			 * @method _chooseDirection
			 * @return {Object}
			 * @protected
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._chooseDirection = function () {
				var self = this,
					ui = self._ui,
					areaInfo = {
						belowArea: 0,
						topArea: 0,
						direction: ""
					};
				areaInfo.belowArea = ui.page.offsetHeight - self._offsetTop - ui.elPlaceHolder.offsetHeight + ui.content.scrollTop;
				areaInfo.topArea = self._offsetTop - ui.content.scrollTop;

				if ((areaInfo.belowArea < areaInfo.topArea) && (ui.elOptionContainer.offsetHeight > areaInfo.belowArea)) {
					areaInfo.direction = "top";
				} else {
					areaInfo.direction = "bottom";
				}
				return areaInfo;
			};

			/**
			 * Open and Close Option List
			 * @method _toggleSelect
			 * @param {event} [clickEvent=null] click event
			 * @protected
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._toggleSelect = function (clickEvent) {
				var self = this,
					ui = self._ui,
					optionContainer = ui.elOptionContainer,
					optionWrapperClassList = ui.elOptionWrapper.classList;

				self._horizontalPosition = (clickEvent && clickEvent.clientX > (window.screen.width / 2)) ? "right" : "left";

				if (self._isOpen && !optionWrapperClassList.contains(classes.opening)) {
					optionWrapperClassList.remove(classes.opened);
					self._callbacks.hideAnimationEnd = hideAnimationEndHandler.bind(null, self);
					eventUtils.prefixedFastOn(optionContainer, "animationEnd", self._callbacks.hideAnimationEnd, false);
					self._hide();
					ui.elSelectWrapper.focus();
				} else if (optionWrapperClassList.contains(classes.closing) || optionWrapperClassList.contains(classes.opening)) {
					return;
				} else {
					ui.elSelectWrapper.focus();
					optionWrapperClassList.add(classes.opening);
					self._callbacks.showAnimationEnd = showAnimationEndHandler.bind(null, self);
					eventUtils.prefixedFastOn(optionContainer, "animationEnd", self._callbacks.showAnimationEnd, false);
					self._show();
				}
				self._isOpen = !self._isOpen;
			};

			/**
			 * Function animationEnd event handler when showing
			 * @private
			 * @static
			 * @param {ns.widget.mobile.DropdownMenu} self
			 * @member ns.widget.mobile.DropdownMenu
			 */
			function showAnimationEndHandler(self) {
				var ui = self._ui;

				ui.elOptionWrapper.classList.add(classes.opened);
				eventUtils.prefixedFastOff(ui.elOptionContainer, "animationEnd", self._callbacks.showAnimationEnd, false);
				ui.elOptionWrapper.classList.remove(classes.opening);
			}

			/**
			 * Function animationEnd event handler when hiding
			 * @private
			 * @static
			 * @param {ns.widget.mobile.DropdownMenu} self
			 * @member ns.widget.mobile.DropdownMenu
			 */
			function hideAnimationEndHandler(self) {
				var wrapper = self._ui.elOptionWrapper,
					wrapperClassList = wrapper.classList,
					optionContainer = self._ui.elOptionContainer;

				wrapperClassList.remove(classes.active);
				wrapper.removeAttribute("style");
				eventUtils.prefixedFastOff(optionContainer, "animationEnd", self._callbacks.hideAnimationEnd, false);
				wrapperClassList.remove(classes.closing);
				wrapperClassList.remove(classes.top);
				wrapperClassList.remove(classes.bottom);
			}

			/**
			 * Returns offset width of given element
			 * @method mapItemWidth
			 * @private
			 * @param {HTMLElement} li
			 * @member ns.widget.mobile.DropdownMenu
			 * @return {number}
			 */
			function mapItemWidth(li) {
				return li.offsetWidth;
			}

			/**
			 * Hide DropdownMenu options
			 * @method _hide
			 * @protected
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._hide = function () {
				var self = this,
					ui = self._ui,
					options = self.options,
					wrapper = ui.elOptionWrapper;

				if (ui.screenFilter) {
					ui.screenFilter.classList.add(classes.filterHidden);
				}

				if (options.inline) {
					ui.elSelectWrapper.style.removeProperty("width");
				}

				self._ui.elSelectWrapper.classList.remove(classes.active);
				wrapper.classList.add(classes.closing);

				if (self.isKeyboardSupport) {
					self.enableDisabledFocusableElements(ui.page);
				}
			};

			/**
			 * Show DropdownMenu options
			 * @method _hide
			 * @protected
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._show = function () {
				var self = this,
					ui = self._ui,
					options = self.options,
					wrapper = ui.elOptionWrapper;

				wrapper.setAttribute("style", self._coordinateOption());
				if (ui.screenFilter) {
					ui.screenFilter.classList.remove(classes.filterHidden);
				}
				ui.elSelectWrapper.classList.add(classes.active);
				wrapper.classList.add(classes.active);

				if (options.inline) {
					ui.elSelectWrapper.style.width = wrapper.offsetWidth + "px";
				}

				wrapper.setAttribute("tabindex", "0");
				wrapper.firstElementChild.focus();

				if (self.isKeyboardSupport) {
					self.disableFocusableElements(ui.page);
					self.enableDisabledFocusableElements(wrapper);
					BaseKeyboardSupport.focusElement(wrapper);
				}
			};

			/**
			 * Change Value of Select tag and Placeholder
			 * @method changeOption
			 * @protected
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._changeOption = function () {
				var self = this,
					ui = self._ui,
					selectedOption = ui.elOptions[self._selectedIndex],
					previousOption = ui.elOptionContainer.querySelector("." + classes.selected),
					getData = domUtils.getNSData;

				if ((selectedOption !== previousOption) || (ui.elDefaultOption && (ui.elPlaceHolder.textContent === ui.elDefaultOption.textContent))) {
					ui.elSelect.value = getData(selectedOption, "value");
					if (ui.elSelect.value === "") {
						ui.elSelect.value = getData(previousOption, "value");
						ui.elPlaceHolder.textContent = previousOption.textContent;
						return;
					}
					eventUtils.trigger(ui.elSelect, "change");
					previousOption.classList.remove(classes.selected);
					selectedOption.classList.add(classes.selected);
				}
			};

			/**
			 * Method returns widget value
			 * @method _getValue
			 * @protected
			 * @member ns.widget.mobile.DropdownMenu
			 * @return {string}
			 */
			prototype._getValue = function () {
				var self = this,
					optionsElements = self.element.options,
					selected,
					value = "";

				if (optionsElements) {
					selected = optionsElements[self._selectedIndex];
					if (selected) {
						value = selected.value;
					}
				}
				return value;
			}

			/**
			 * Destroy DropdownMenu widget
			 * @method _destroy
			 * @protected
			 * @member ns.widget.mobile.DropdownMenu
			 */
			prototype._destroy = function () {
				var self = this,
					ui = self._ui,
					elSelectWrapper = ui.elSelectWrapper,
					elOptionContainer = ui.elOptionContainer,
					screenFilter = ui.screenFilter;

				elSelectWrapper.removeEventListener("focus", self._focusBound);
				elSelectWrapper.removeEventListener("blur", self._blurBound);
				domUtils.replaceWithNodes(ui.elSelectWrapper, ui.elSelect);
				if (!self.options.nativeMenu) {
					elSelectWrapper.removeEventListener("vclick", self._toggleMenuBound);
					elOptionContainer.removeEventListener("touchmove", self._touchMoveBound);
					elOptionContainer.removeEventListener("vclick", self._changeOptionBound);
					elOptionContainer.removeEventListener("focusin", self._focusBound);
					elOptionContainer.removeEventListener("focusout", self._blurBound);
					ui.elOptionWrapper.parentNode.removeChild(ui.elOptionWrapper);
					if (screenFilter) {
						screenFilter.removeEventListener("vclick", self._toggleMenuBound);
						screenFilter.parentNode.removeChild(screenFilter);
					}
					window.removeEventListener("throttledresize", self._onResizeBound, true);
				} else {
					ui.elSelect.removeEventListener("change", self._nativeChangeOptionBound);
				}
			};

			DropdownMenu.widgetSelector = widgetSelector;

			ns.widget.mobile.DropdownMenu = DropdownMenu;

			BaseKeyboardSupport.registerActiveSelector(".ui-dropdownmenu:not(.ui-disabled):not(.ui-dropdownmenu-disabled), " +
				".ui-dropdownmenu-options li:not(.ui-dropdownmenu-disabled):not(.ui-dropdownmenu-optiongroup):not(.ui-disabled)");

			engine.defineWidget(
				"DropdownMenu",
				widgetSelector,
				["open", "close"],
				DropdownMenu,
				"mobile",
				false,
				false,
				HTMLSelectElement
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.DropdownMenu;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
