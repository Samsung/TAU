/*global window, define, ns */
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
 * #Slider
 * Slider component changes the range-type browser input to sliders.
 *
 * ##Default selectors
 * In default all **INPUT** tags with type equals _range_  and _data-role=slider_ are changed to TAU sliders.
 *
 * ###HTML Examples
 *
 *         @example
 *              <input type="range" name="slider-1" id="slider" value="60" min="0" max="100">
 *
 * ###Manual constructor
 * For manual creation of slider widget you can use constructor of widget
 *
 *         @example
 *              <input id="slider">
 *              <script>
 *                  var sliderElement = document.getElementById("slider"),
 *                      slider;
 *
 *                  slider = tau.widget.Slider(sliderElement);
 *
 *                  // You can make slider component for TizenSlider component name,
 *                  // for example, tau.widget.TizenSlider(sliderElement).
 *                  // But, TizenSlider component name will be deprecated since tizen 2.4
 *                  // because we don't recommend this method.
 *              </script>
 *
 * @since 2.0
 * @class ns.widget.core.Slider
 * @component-selector .ui-slider [data-type]="slider"
 * @extends ns.widget.BaseWidget
 * @author Hyeoncheol Choi <hc7.choi@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../util/selectors",
			"../../util/DOM/css",
			"../../event",
			"../../event/gesture/Instance",
			"../../event/gesture/Drag",
			"../../history/manager",
			"../core", // fetch namespace
			"./Page",
			"../BaseWidget",
			"../BaseKeyboardSupport"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			/**
			 * @property {Object} Widget Alias for {@link ns.widget.BaseWidget}
			 * @member ns.widget.core.Drawer
			 * @private
			 * @static
			 */
			var BaseWidget = ns.widget.BaseWidget,
				BaseKeyboardSupport = ns.widget.core.BaseKeyboardSupport,
				engine = ns.engine,
				selectors = ns.util.selectors,
				utilDOM = ns.util.DOM,
				events = ns.event,
				Gesture = ns.event.gesture,
				utilSelector = ns.util.selectors,
				COLORS = {
					BACKGROUND: "rgba(145, 145, 145, 0.7)",
					ACTIVE: "rgba(61, 185, 204, 1)",
					WARNING_BG: "rgba(201, 133, 133, 1)",
					WARNING: "rgba(255, 25, 25, 1)"
				},
				DEFAULT = {
					HORIZONTAL: "horizontal"
				},
				Slider = function () {
					var self = this;
					/**
					 * Widget options
					 * @property {boolean} [options.type="normal"] Slider type. 'normal', 'center' or 'circle'
					 * @property {string} [options.orientation="horizontal"] Slider orientation. horizontal or vertical
					 * @property {boolean} [options.expand=false] Slider expand mode. true or false
					 **/

					self.options = {
						type: "normal",
						orientation: DEFAULT.HORIZONTAL,
						expand: false,
						warning: false,
						warningLevel: 0,
						disabled: false,
						toggle: ""
					};

					BaseKeyboardSupport.call(self);

					self._ui = {};
				},
				classes = {
					SLIDER: "ui-slider",
					SLIDER_HORIZONTAL: "ui-slider-horizontal",
					SLIDER_VERTICAL: "ui-slider-vertical",
					SLIDER_VALUE: "ui-slider-value",
					SLIDER_HANDLER: "ui-slider-handler",
					SLIDER_HANDLER_EXPAND: "ui-slider-handler-expand",
					SLIDER_CENTER: "ui-slider-center",
					SLIDER_HANDLER_ACTIVE: "ui-slider-handler-active",
					SLIDER_WARNING: "ui-slider-warning",
					SLIDER_DISABLED: "ui-disabled",
					SLIDER_HANDLER_VALUE: "ui-slider-handler-value",
					SLIDER_HANDLER_SMALL: "ui-slider-handler-small",
					SLIDER_FOCUS: "ui-focus"
				},
				KEYBOARD_SUPPORT_EVENTS = BaseKeyboardSupport.EVENTS,
				prototype = new BaseWidget();

			Slider.prototype = prototype;
			Slider.classes = classes;

			/**
			 * Bind events
			 * @method bindEvents
			 * @param {Object} self
			 * @member ns.widget.core.Slider
			 * @private
			 * @static
			 */
			function bindEvents(self) {
				var ui = self._ui,
					element = ui.barElement,
					toggle = ui.toggle;

				events.enableGesture(
					element,

					new Gesture.Drag({
						orientation: self.options.orientation,
						threshold: 0
					})
				);
				// @todo remove drag handlers
				//events.on(element, "dragstart drag dragend dragcancel", self, false);
				events.on(self.element, "input change touchstart touchend", self, false);
				events.on(self.element, "focus", self, false);
				events.on(self.element, "blur", self, false);
				if (toggle) {
					events.on(toggle, "change", self);
				}

				if (self.isKeyboardSupport) {
					events.on(self.element, KEYBOARD_SUPPORT_EVENTS.taushortkeypress, self, false);
				}
			}

			/**
			 * unBind events
			 * @method unbindEvents
			 * @param {Object} self
			 * @member ns.widget.core.Slider
			 * @private
			 * @static
			 */
			function unbindEvents(self) {
				var ui = self._ui,
					element = ui.barElement,
					toggle = ui.toggle;

				events.disableGesture(element);
				// @todo remove drag handlers
				//events.off(element, "dragstart drag dragend dragcancel", self, false);
				events.off(self.element, "input change touchstart touchend", self, false);
				if (toggle) {
					events.off(toggle, "change", self);
				}

				if (self.isKeyboardSupport) {
					events.off(self.element, KEYBOARD_SUPPORT_EVENTS.taushortkeypress, self, false);
				}
			}

			/**
			 * Build structure of Slider component
			 * @method _build
			 * @param {HTMLElement} element
			 * @return {HTMLElement} Returns built element
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._build = function (element) {
				var self = this,
					ui = self._ui,
					barElement = document.createElement("div"),
					valueElement = document.createElement("div"),
					handlerElement = document.createElement("div");

				barElement.classList.add(classes.SLIDER);

				valueElement.classList.add(classes.SLIDER_VALUE);
				barElement.appendChild(valueElement);
				handlerElement.classList.add(classes.SLIDER_HANDLER);
				barElement.appendChild(handlerElement);

				element.parentNode.appendChild(barElement);
				ui.valueElement = valueElement;
				ui.handlerElement = handlerElement;
				ui.barElement = barElement;

				element.parentNode.replaceChild(barElement, element);
				barElement.appendChild(element);

				if (self.isKeyboardSupport) {
					self.preventFocusOnElement(valueElement)
					self.preventFocusOnElement(handlerElement)
					self.preventFocusOnElement(barElement)
					element.setAttribute("tabindex", "0");
					element.setAttribute(BaseKeyboardSupport.CAPTURE_KEYBOARD_ATTR, false);
				}

				return element;
			};

			/**
			 * init Slider component
			 * @method _init
			 * @param {HTMLElement} element
			 * @return {HTMLElement} Returns built element
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._init = function (element) {
				var self = this,
					attrMin = parseFloat(element.getAttribute("min")),
					attrMax = parseFloat(element.getAttribute("max")),
					attrValue = parseFloat(element.getAttribute("value")),
					ui = self._ui,
					options = self.options;

				self._min = attrMin ? attrMin : 0;
				self._max = attrMax ? attrMax : 100;
				self._minValue = self._min;
				self._maxValue = self._max;
				self._value = attrValue ? attrValue : parseFloat(self.element.value);
				self._interval = self._max - self._min;
				self._previousValue = self._value;
				self._warningLevel = parseInt(options.warningLevel, 10);
				self._setDisabled(element);
				self._locked = false;

				if (!ui.toggle && options.toggle) {
					ui.toggle = document.querySelector(options.toggle);
				}

				self._initLayout();
				return element;
			};

			prototype._setInputRangeSize = function () {
				var self = this,
					input = self.element,
					barElement = self._ui.barElement,
					options = self.options,
					rectBar = barElement.getBoundingClientRect();

				if (options.orientation === DEFAULT.HORIZONTAL) {
					input.style.width = (rectBar.width + 16) + "px";
					input.style.top = "-12px"; // @todo change this hardcoded size;
					input.style.left = "-8px";
				} else {
					input.style.width = (rectBar.width + 16) + "px";
					input.style.height = rectBar.height + "px";
					input.style.left = "-10px";
				}
			};

			/**
			 * init layout of Slider component
			 * @method _initLayout
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._initLayout = function () {
				var self = this,
					options = self.options,
					ui = self._ui,
					barElement = ui.barElement,
					handlerElement = ui.handlerElement;

				if (options.orientation === DEFAULT.HORIZONTAL) {
					barElement.classList.remove(classes.SLIDER_VERTICAL);
					barElement.classList.add(classes.SLIDER_HORIZONTAL);
				} else {
					barElement.classList.remove(classes.SLIDER_HORIZONTAL);
					barElement.classList.add(classes.SLIDER_VERTICAL);
				}

				options.type === "center" ? barElement.classList.add(classes.SLIDER_CENTER) : barElement.classList.remove(classes.SLIDER_CENTER);

				options.expand ? handlerElement.classList.add(classes.SLIDER_HANDLER_EXPAND) : handlerElement.classList.remove(classes.SLIDER_HANDLER_EXPAND);


				self._barElementWidth = ui.barElement.offsetWidth;
				if (self.options.orientation !== DEFAULT.HORIZONTAL) {
					self._barElementHeight = ui.barElement.offsetHeight;
				}
				self._setValue(self._value);
				self._setSliderColors(self._value);

				self._setInputRangeSize();
			};

			/**
			 * Set value of Slider center mode
			 * @method _setCenterValue
			 * @param {number} value
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._setCenterValue = function (value) {
				var self = this,
					ui = self._ui,
					validValue,
					valueElementValidStyle,
					barElementLength,
					center,
					validStyle,
					inValidStyle;

				if (self.options.orientation === DEFAULT.HORIZONTAL) {
					barElementLength = self._barElementWidth;
					center = barElementLength / 2;
					validValue = barElementLength * (value - self._min) / self._interval;
					validStyle = validValue < center ? "right" : "left";
					inValidStyle = validValue < center ? "left" : "right";
					valueElementValidStyle = "width";
					ui.handlerElement.style["left"] = validValue + "px";
				} else {
					barElementLength = self._barElementHeight;
					center = barElementLength / 2;
					validValue = barElementLength * (value - self._min) / self._interval;
					validStyle = validValue < center ? "top" : "bottom";
					inValidStyle = validValue < center ? "bottom" : "top";
					valueElementValidStyle = "height";
					ui.handlerElement.style["top"] = (barElementLength - validValue) + "px";
				}

				ui.valueElement.style[validStyle] = "50%";
				ui.valueElement.style[inValidStyle] = "initial";

				ui.valueElement.style[valueElementValidStyle] = Math.abs(center - validValue) + "px";
			};

			/**
			 * Set value of Slider normal mode
			 * @method _setNormalValue
			 * @param {number} value
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._setNormalValue = function (value) {
				var self = this,
					ui = self._ui,
					options = self.options,
					barElementLength,
					validValue;

				if (options.orientation === DEFAULT.HORIZONTAL) {
					barElementLength = self._barElementWidth;
					validValue = barElementLength * (value - self._min) / self._interval;
					ui.valueElement.style["width"] = validValue + "px";
					ui.handlerElement.style["left"] = validValue + "px";
				} else {
					barElementLength = self._barElementHeight;
					validValue = barElementLength * (value - self._min) / self._interval;
					ui.valueElement.style["height"] = validValue + "px";
					ui.handlerElement.style["top"] = (barElementLength - validValue) + "px";
				}
			};

			/**
			 * Set value of Slider
			 * @method _setValue
			 * @param {number} value
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._setValue = function (value) {
				var self = this,
					ui = self._ui,
					options = self.options,
					element = self.element,
					toggle = ui.toggle,
					floatValue,
					expendedClasses;

				self._previousValue = self._value;

				if (value < self._min) {
					value = self._min;
				} else if (value > self._max) {
					value = self._max;
				}

				floatValue = parseFloat(value);

				if (options.type === "center") {
					self._setCenterValue(value);
				} else if (options.type === "normal") {
					self._setNormalValue(value);
				}

				self._setHandlerStyle(value);
				self._updateSliderColors(value);

				if (self.options.expand) {
					expendedClasses = classes.SLIDER_HANDLER_VALUE;
					if (floatValue > 99 || floatValue < -10) {
						expendedClasses += " " + classes.SLIDER_HANDLER_SMALL;
					}
					ui.handlerElement.innerHTML = "<span class=" + expendedClasses + ">" + floatValue + "</span>";
				}

				if (self._previousValue !== floatValue) {
					element.setAttribute("value", floatValue);
					element.value = floatValue;
					self._value = floatValue;

					if (toggle) {
						if (floatValue === 0 && !toggle.checked) {
							toggle.checked = true;
						}

						if (floatValue !== 0 && toggle.checked) {
							toggle.checked = false;
						}
					}

					//events.trigger(element, "input");
				}
			};

			prototype._getValue = function () {
				return this._value;
			};

			prototype._getContainer = function () {
				return this._ui.barElement;
			}

			/**
			 * Set background as a gradient
			 * @param {HTMLElement} element
			 * @param {string} orientation
			 * @param {string} reverseOrientation
			 * @param {string} color1
			 * @param {string} level1
			 * @param {string} color2
			 * @param {string} level2
			 * @param {string} currentValue This param is added only because gradients do not work in proper way on Tizen
			 * @private
			 */
			function setBackground(element, orientation, reverseOrientation, color1, level1, color2, level2, currentValue) {
				// gradients on Tizen do not work in proper way, so this condition is workaround
				// if gradients work properly, this should be removed!
				if (parseFloat(currentValue) > parseFloat(level1)) {
					element.style.background = "-webkit-linear-gradient(" + reverseOrientation + "," +
						color1 + " " + level1 + ", " + color2 + " " + level2 + ")";
				} else {
					element.style.background = color1;
				}
			}

			/**
			 * Set warning level for slider
			 * @param {number} value
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._setSliderColors = function (value) {
				var self = this,
					ui = self._ui,
					barElement = ui.barElement,
					sliderValueElement = ui.valueElement,
					orientation,
					reverseOrientation,
					barLength,
					warningLevel,
					level;

				if (self.options.type === "normal" && self.options.warning && value >= self._min && value <= self._max) {
					if (self.options.orientation === DEFAULT.HORIZONTAL) {
						orientation = "right";
						reverseOrientation = "left";
						barLength = self._barElementWidth;
					} else {
						orientation = "top";
						reverseOrientation = "bottom";
						barLength = self._barElementHeight;
					}
					warningLevel = barLength * self._warningLevel / (self._max - self._min) + "px";
					level = barLength * value / (self._max - self._min) + "px";

					// set background for value bar and slider bar
					setBackground(sliderValueElement, orientation, reverseOrientation, COLORS.ACTIVE, warningLevel, COLORS.WARNING, warningLevel, level);
					setBackground(barElement, orientation, reverseOrientation, COLORS.BACKGROUND, warningLevel, COLORS.WARNING_BG, warningLevel,
						parseInt(warningLevel, 10) + 2);
				} else {
					// gradients on Tizen do not work in proper way, so this is workaround
					// if gradients work properly, this should be removed!
					sliderValueElement.style.background = COLORS.ACTIVE;
					barElement.style.background = COLORS.BACKGROUND;
				}
			};

			// gradients on Tizen do not work in proper way, so this is workaround
			// if gradients work properly, this should be removed!
			prototype._updateSliderColors = function (value) {
				this._setSliderColors(value);
			};

			/**
			 * Set style for handler
			 * @param {number} value
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._setHandlerStyle = function (value) {
				var self = this;

				if (self.options.warning) {
					if (value >= self._warningLevel) {
						self._ui.handlerElement.classList.add(classes.SLIDER_WARNING);
					} else {
						self._ui.handlerElement.classList.remove(classes.SLIDER_WARNING);
					}
				}
			};

			prototype._setDisabled = function (element) {
				var self = this,
					options = self.options;

				if (options.disabled === true || element.disabled) {
					self._disable(element);
				} else {
					self._enable(element);
				}
			};

			prototype._enable = function (element) {
				if (element) {
					this.options.disabled = false;
					if (this._ui.barElement) {
						this._ui.barElement.classList.remove(classes.SLIDER_DISABLED);
					}
				}
			};

			prototype._disable = function (element) {
				if (element) {
					this.options.disabled = true;
					if (this._ui.barElement) {
						this._ui.barElement.classList.add(classes.SLIDER_DISABLED);
					}
				}
			};

			/**
			 * Bind events to Slider
			 * @method _bindEvents
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._bindEvents = function () {
				bindEvents(this);
			};

			/**
			 * Bind event handlers
			 * @method handleEvent
			 * @param {Event} event
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype.handleEvent = function (event) {
				var self = this,
					toggle = self._ui.toggle,
					eventType = event.type;

				if (eventType === "change" && toggle && toggle === event.target) {
					self._handleToggle(event);
				} else if (!this.options.disabled) {
					switch (eventType) {
						case "dragstart":
							self._onDragstart(event);
							break;
						case "dragend":
						case "dragcancel":
							self._onDragend(event);
							break;
						case "drag":
							self._onDrag(event);
							break;
						case "input" :
						case "change" :
							self._setValue(self.element.value);
							break;
						case "touchstart":
							self._onTouchStart(event);
							break;
						case "touchend":
							self._onTouchEnd(event);
							break;
						case KEYBOARD_SUPPORT_EVENTS.taushortkeypress:
							self._onTauShortKeyPress(event);
							break;
					}
				}
			};

			prototype._handleToggle = function (event) {
				var self = this,
					options = self.options,
					element = self.element,
					target = event.target,
					mute = target.checked,
					value;

				if (mute && self.value() > 0) {
					utilDOM.setNSData(target, "slider-value", self.value());
					self.value(self._minValue);
					options.disabled = true;
					self._setDisabled(element);
				} else if (self.value() === 0) {
					value = parseFloat(utilDOM.getNSData(target, "slider-value")) || 0
					options.disabled = false;
					self._setDisabled(element);
					self.value(value);
				}
			};

			/**
			 * Drag event handler
			 * @method _onDrag
			 * @param {Event} event
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._onDrag = function (event) {
				var self = this,
					ui = self._ui,
					validPosition,
					value;

				if (self._active) {
					validPosition = self.options.orientation === DEFAULT.HORIZONTAL ?
						event.detail.estimatedX - ui.barElement.offsetLeft :
						self._barElementHeight -
					(event.detail.estimatedY - utilDOM.getElementOffset(ui.barElement).top + selectors.getScrollableParent(self.element).scrollTop),

					value = self.options.orientation === DEFAULT.HORIZONTAL ?
						self._interval * validPosition / self._barElementWidth :
						self._interval * validPosition / self._barElementHeight;

					value += self._min;
					self._setValue(value);
				}
			};

			/**
			 * DragStart event handler
			 * @method _onDragstart
			 * @param {Event} event
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._onDragstart = function (event) {
				var self = this,
					ui = self._ui,
					validPosition = self.options.orientation === DEFAULT.HORIZONTAL ?
						event.detail.estimatedX - ui.barElement.offsetLeft :
						self._barElementHeight -
					(event.detail.estimatedY - utilDOM.getElementOffset(ui.barElement).top + selectors.getScrollableParent(self.element).scrollTop),
					value = self.options.orientation === DEFAULT.HORIZONTAL ?
						self._interval * validPosition / self._barElementWidth :
						self._interval * validPosition / self._barElementHeight;

				ui.handlerElement.classList.add(classes.SLIDER_HANDLER_ACTIVE);
				value += self._min;
				self._setValue(value);
				self._active = true;
			};

			/**
			 * DragEnd event handler
			 * @method _onDragend
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._onDragend = function () {
				var self = this,
					ui = self._ui;

				ui.handlerElement.classList.remove(classes.SLIDER_HANDLER_ACTIVE);
				self._active = false;
				if (self._previousValue !== self.element.value) {
					events.trigger(self.element, "change");
				}
				self._previousValue = self.element.value;
			};

			/**
			 * touchstart event handler
			 * @method _onTouchStart
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._onTouchStart = function () {
				this._ui.handlerElement.classList.add(classes.SLIDER_HANDLER_ACTIVE);
			};

			/**
			 * touchend event handler
			 * @method _onTouchEnd
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._onTouchEnd = function () {
				this._ui.handlerElement.classList.remove(classes.SLIDER_HANDLER_ACTIVE);
			};

			/**
			 * Decrease slider current value by one step
			 * @method _decreaseValue
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._decreaseValue = function () {
				var self = this;

				self._setValue(self._value - (parseFloat(self.element.step) || 1));
			};

			/**
			 * Increase slider current value by one step
			 * @method _increaseValue
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._increaseValue = function () {
				var self = this;

				self._setValue(self._value + (parseFloat(self.element.step) || 1));
			};

			/**
			 * Decrease slider current value by one step.
			 * Used when decreasing value with keyboard.
			 * Triggers "input" and "change" events
			 * @method _decreaseValueKeyboard
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._decreaseValueKeyboard = function () {
				var self = this,
					element = self.element;

				self._decreaseValue();
				event.trigger(element, "input");
				event.trigger(element, "change");
			};

			/**
			 * Increase slider current value by one step.
			 * Used when increasing value with keyboard.
			 * Triggers "input" and "change" events
			 * @method _increaseValueKeyboard
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._increaseValueKeyboard = function () {
				var self = this,
					element = self.element;

				self._increaseValue();
				event.trigger(element, "input");
				event.trigger(element, "change");
			};

			/**
			 * taushortkeypress event handler
			 * @method _onTauShortKeyPress
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._onTauShortKeyPress = function (event) {
				var self = this,
					KEY_CODES = BaseKeyboardSupport.KEY_CODES;

				switch (event.detail.keyCode) {
					case KEY_CODES.left :
					case KEY_CODES.down :
						self._decreaseValueKeyboard();
						break;
					case KEY_CODES.right :
					case KEY_CODES.up :
						self._increaseValueKeyboard();
						break;
					case KEY_CODES.enter :
						self._releaseWidgetFocus();
						break;
				}
			};

			/**
			 * Sets focused slider styling
 			 * @method _actionEnter
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._actionEnter = function () {
				this._setWidgetFocus();
			}

			/**
			 * Handles the ESC key event
 			 * @method _actionEscape
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._actionEscape = function () {
				this._releaseWidgetFocus();
			}


			/**
			 * Sets focus and active slider styling
 			 * @method _setWidgetFocus
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._setWidgetFocus = function () {
				var self = this,
					element = self.element,
					ui = self._ui;

				element.setAttribute(BaseKeyboardSupport.CAPTURE_KEYBOARD_ATTR, true);
				ui.handlerElement.classList.add(classes.SLIDER_HANDLER_ACTIVE);
			}

			/**
			 * Remove focus and active slider styling
			 * @method _releaseWidgetFocus
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._releaseWidgetFocus = function () {
				var self = this,
					element = self.element,
					ui = self._ui;

				element.setAttribute(BaseKeyboardSupport.CAPTURE_KEYBOARD_ATTR, false);
				ui.handlerElement.classList.remove(classes.SLIDER_HANDLER_ACTIVE);
			}


			/**
			 * Sets focused slider styling
 			 * @method _focus
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._focus = function () {
				var self = this;

				self._ui.barElement.classList.add(classes.SLIDER_FOCUS);
			}

			/**
			 * Removes focused slider styling
 			 * @method _blur
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._blur = function () {
				var self = this;

				self._ui.barElement.classList.remove(classes.SLIDER_FOCUS);
				self._releaseWidgetFocus();
			}

			/**
			 * Refresh to Slider component
			 * @method refresh
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype.refresh = function () {
				this._setDisabled(this.element);
				this._initLayout();
			};

			/**
			 * Destroy Slider component
			 * @method _destroy
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._destroy = function () {
				var self = this,
					barElement = self._ui.barElement;

				unbindEvents(self);
				if (barElement.parentNode) {
					barElement.parentNode.removeChild(barElement);
				}
				self._ui = null;
				self._options = null;
			};

			ns.widget.core.Slider = Slider;
			engine.defineWidget(
				"Slider",
				"input[data-role='slider'], input[type='range'], input[data-type='range']",
				[
					"value"
				],
				Slider,
				"core"
			);

			BaseKeyboardSupport.registerActiveSelector("input[data-role='slider'], input[type='range'], input[data-type='range'], .ui-slider-handler");

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.Slider;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
