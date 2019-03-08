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
			"../BaseWidget"
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
				engine = ns.engine,
				selectors = ns.util.selectors,
				utilDOM = ns.util.DOM,
				events = ns.event,
				Gesture = ns.event.gesture,
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
						disabled: false
					};

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
					SLIDER_HANDLER_SMALL: "ui-slider-handler-small"
				},
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
				var element = self._ui.barElement;

				events.enableGesture(
					element,

					new Gesture.Drag({
						orientation: self.options.orientation,
						threshold: 0
					})
				);
				events.on(element, "dragstart drag dragend dragcancel", self, false);
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
				var element = self._ui.barElement;

				events.disableGesture(element);
				events.off(element, "dragstart drag dragend dragcancel", self, false);
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

				element.style.display = "none";
				barElement.classList.add(classes.SLIDER);

				valueElement.classList.add(classes.SLIDER_VALUE);
				barElement.appendChild(valueElement);
				handlerElement.classList.add(classes.SLIDER_HANDLER);
				barElement.appendChild(handlerElement);

				element.parentNode.appendChild(barElement);
				ui.valueElement = valueElement;
				ui.handlerElement = handlerElement;
				ui.barElement = barElement;

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
					attrValue = parseFloat(element.getAttribute("value"));

				self._min = attrMin ? attrMin : 0;
				self._max = attrMax ? attrMax : 100;
				self._minValue = self._min;
				self._maxValue = self._max;
				self._value = attrValue ? attrValue : parseFloat(self.element.value);
				self._interval = self._max - self._min;
				self._previousValue = self._value;
				self._warningLevel = parseInt(self.options.warningLevel, 10);
				self._setDisabled(element);

				self._initLayout();
				return element;
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
					floatValue,
					expendedClasses;

				self._previousValue = self.element.value;

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

				if (element.value - 0 !== floatValue) {
					element.setAttribute("value", floatValue);
					element.value = floatValue;
					self._value = floatValue;
					events.trigger(element, "input");
				}
			};

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
				var self = this;

				if (!this.options.disabled) {
					switch (event.type) {
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
					}
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
				barElement.parentNode.removeChild(barElement);
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
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.core.Slider;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
