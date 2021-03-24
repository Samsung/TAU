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
			"../../util/DOM/css",
			"../../event",
			"../../util/object",
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
				objectMerge = ns.util.object.merge,
				events = ns.event,
				/**
			 	 * Widget options
				 * @property {string} [options.type="continues"] Slider type. 'continues', 'level-bar'
				 * @property {boolean} [options.disabled=false] Slider disabled mode. true or false
				 * @property {number} [min=0] minimum value of Slider
				 * @property {number} [max=10] maximum value of Slider
				 * @property {number} [step=1] step specifies the granularity that the value must adhere to
				 **/
				defaults = {
					type: "continues",
					orientation: "horizontal",
					expand: false,
					warning: false,
					warningLevel: 0,
					disabled: false,
					toggle: "",
					min: 0,
					max: 10,
					step: 1,
					labels: false
				},
				unsupportedOptions = ["orientation", "expand", "warning", "warningLevel", "toggle"],
				Slider = function () {
					var self = this;

					self.options = objectMerge({}, defaults);
					BaseKeyboardSupport.call(self);

					self._ui = {
						scale: null
					};
				},
				classes = {
					SLIDER: "ui-slider",
					SLIDER_VALUE: "ui-slider-value",
					SLIDER_HANDLER: "ui-slider-handler",
					SLIDER_DISABLED: "ui-disabled",
					SLIDER_HANDLER_VALUE: "ui-slider-handler-value",
					SLIDER_FOCUS: "ui-slider-focus",
					SLIDER_BAR: "ui-slider-bar",
					SLIDER_ACTIVE: "ui-slider-active",
					TRACK: "ui-slider-handler-track",
					SPACE_BEFORE: "ui-slider-before-space",
					SPACE_AFTER: "ui-slider-after-space",
					SLIDER_HAS_LABELS: "ui-slider-has-labels",
					LABEL: "ui-slider-label",
					LABEL_MIN: "ui-slider-label-min",
					LABEL_MAX: "ui-slider-label-max"
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
				events.on(self.element, "input change vmouseup vmousedown", self, false);

				if (self.isKeyboardSupport) {
					events.on(self.element, "focus, blur", self, false);
					events.on(document, "keyup", self, true);
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
				events.off(self.element, "input change vmouseup vmousedown", self, false);

				if (self.isKeyboardSupport) {
					events.off(self.element, "focus, blur", self, false);
					events.off(document, "keyup", self, true);
				}
			}

			/**
			 * Method changes look of scale for Slider widget when type is level bar
			 * @method _updateLevelBar
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._updateLevelBar = function () {
				var self = this,
					ui = self._ui,
					scale = ui.scale,
					options = self.options,
					numberOfDots = Math.round((options.max - options.min) / options.step) + 1,
					currentDots = scale.children.length,
					delta = numberOfDots - currentDots,
					dot,
					i;

				// modify DOM
				if (delta > 0) {
					// add
					for (i = 0; i < delta; i++) {
						dot = document.createElement("div");
						dot.classList.add("ui-slider-scale-dot");
						scale.appendChild(dot);
					}
				} else if (delta < 0) {
					// remove redundant dots
					delta = -delta;
					for (i = 0; i < delta; i++) {
						scale.removeChild(scale.lastElementChild);
					}
				}
			}

			/**
			 * Method is called when "type" option has change
			 * @method _setType
			 * @member ns.widget.core.Slider
			 * @param {HTMLElement} element element parameter is required by BaseWidget
			 * @param {string} value
			 * @protected
			 */
			prototype._setType = function (element, value) {
				var self = this,
					ui = self._ui,
					scale = ui.scale,
					containerElement = ui.containerElement;

				if (value === "level-bar") {
					// create element
					if (!scale) {
						scale = document.createElement("div");
						scale.classList.add("ui-slider-scale");
						containerElement.appendChild(scale);
						ui.scale = scale;
					}
					// update dots
					self._updateLevelBar();
				} else {
					if (scale) {
						containerElement.remove(scale);
						ui.scale = null;
					}
				}

				containerElement.classList.toggle("ui-slider-level-bar", value === "level-bar");

				self.options.type = value;
			}

			/**
			 * Method is called when "labels" option has change
			 * @method _setLabels
			 * @member ns.widget.core.Slider
			 * @param {HTMLElement} element element parameter is required by BaseWidget
			 * @param {string} value
			 * @protected
			 */
			prototype._setLabels = function (element, value) {
				var self = this;

				if (value) {
					if (!self._ui.labelMin.innerText) {
						self._ui.labelMin.innerText = self.options.min;
					}
					if (!self._ui.labelMax.innerText) {
						self._ui.labelMax.innerText = self.options.max;
					}
				}
				self._ui.containerElement.classList.toggle(classes.SLIDER_HAS_LABELS, value);
				self.options.labels = value;
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
					containerElement = self._createWrapper("div"),
					barElement = document.createElement("div"),
					valueElement = document.createElement("div"),
					handlerElement = document.createElement("div"),
					handlerTrack = document.createElement("div"),
					beforeSpace = document.createElement("div"),
					afterSpace = document.createElement("div"),
					labelMin = document.createElement("div"),
					labelMax = document.createElement("div");

				containerElement.classList.add(classes.SLIDER);

				barElement.classList.add(classes.SLIDER_BAR);
				valueElement.classList.add(classes.SLIDER_VALUE);
				barElement.appendChild(valueElement);

				handlerElement.classList.add(classes.SLIDER_HANDLER);
				handlerTrack.classList.add(classes.TRACK);
				beforeSpace.classList.add(classes.SPACE_BEFORE);
				afterSpace.classList.add(classes.SPACE_AFTER);

				labelMin.classList.add(classes.LABEL);
				labelMax.classList.add(classes.LABEL);
				labelMin.classList.add(classes.LABEL_MIN);
				labelMax.classList.add(classes.LABEL_MAX);

				handlerTrack.appendChild(beforeSpace);
				handlerTrack.appendChild(handlerElement);
				handlerTrack.appendChild(afterSpace);

				containerElement.appendChild(handlerTrack);
				containerElement.appendChild(barElement);
				containerElement.appendChild(labelMin);
				containerElement.appendChild(labelMax);

				element.parentNode.appendChild(containerElement);
				ui.barElement = barElement;
				ui.valueElement = valueElement;
				ui.handlerElement = handlerElement;
				ui.containerElement = containerElement;
				ui.beforeSpace = beforeSpace;
				ui.afterSpace = afterSpace;
				ui.labelMin = labelMin;
				ui.labelMax = labelMax;

				element.parentNode.replaceChild(containerElement, element);
				containerElement.appendChild(element);

				if (self.isKeyboardSupport) {
					self.preventFocusOnElement(element);
					containerElement.setAttribute("data-focus-lock", "true");
					containerElement.setAttribute("tabindex", "0");
				}

				return element;
			};

			/**
			 * Update Slider properties from widget options
			 * @method _updateProperties
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._updateProperties = function () {
				var self = this,
					options = self.options,
					attrValue = parseFloat(self.element.getAttribute("value"));

				self._min = options.min;
				self._max = options.max;
				self._minValue = self._min;
				self._maxValue = self._max;
				self._interval = self._max - self._min;

				self._value = attrValue ? attrValue : parseFloat(self.element.value);
				self._previousValue = self._value;
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
				var self = this;

				self._warnAboutUnsupportedOptions();
				self._updateProperties();

				self._setDisabled(element);
				self._locked = false;

				self._initLayout();
				return element;
			};

			prototype._warnAboutUnsupportedOptions = function () {
				var options = this.options;

				unsupportedOptions.forEach(function (option) {
					if (options[option] !== defaults[option]) {
						ns.warn("The " + option + " option has no effect on Slider widget");
					}
				});
			}

			/**
			 * init layout of Slider component
			 * @method _initLayout
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._initLayout = function () {
				var self = this,
					ui = self._ui;

				self._setType(self.element, self.options.type);
				self._setLabels(self.element, self.options.labels);

				self._containerElementWidth = ui.containerElement.offsetWidth;

				self._setValue(self._value);
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
					percentValue;

				// position of handle element
				percentValue = (value - self._min) / (self._max - self._min) * 100;
				ui.beforeSpace.style["width"] = percentValue + "%";
				ui.afterSpace.style["width"] = (100 - percentValue) + "%";
				ui.valueElement.style["width"] = percentValue + "%";
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
					element = self.element,
					floatValue;

				self._previousValue = self._value;

				if (value < self._min) {
					value = self._min;
				} else if (value > self._max) {
					value = self._max;
				}

				floatValue = parseFloat(value);

				self._setNormalValue(value);

				if (self._previousValue !== floatValue) {
					element.setAttribute("value", floatValue);
					element.value = floatValue;
					self._value = floatValue;

					//events.trigger(element, "input");
				}
			};

			prototype._getValue = function () {
				return this._value;
			};

			prototype._getContainer = function () {
				return this._ui.containerElement;
			}

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
				var self = this,
					ui = self._ui;

				if (element) {
					self.options.disabled = false;
					if (ui.containerElement) {
						ui.containerElement.classList.remove(classes.SLIDER_DISABLED);
						if (ns.getConfig("keyboardSupport", false)) {
							ui.containerElement.classList.remove(BaseKeyboardSupport.classes.focusDisabled);
						}
					}
				}
			};

			prototype._disable = function (element) {
				var self = this,
					ui = self._ui;

				if (element) {
					self.options.disabled = true;
					if (ui.containerElement) {
						ui.containerElement.classList.add(classes.SLIDER_DISABLED);
						if (ns.getConfig("keyboardSupport", false)) {
							ui.containerElement.classList.add(BaseKeyboardSupport.classes.focusDisabled);
						}
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
					eventType = event.type;

				if (!this.options.disabled) {
					switch (eventType) {
						case "input" :
						case "change" :
							self._setValue(self.element.value);
							break;
						case "vmousedown":
							self._onTouchStart(event);
							break;
						case "vmouseup":
							self._onTouchEnd(event);
							break;
						// case "focus":
						// 	self._onFocus(event);
						// 	break;
						// case "blur":
						// 	self._onBlur(event);
						// 	break;
						case "keyup":
							self._onKeyUp(event);
							break;
					}
				}
			};

			prototype._onTouchStart = function () {
				this._ui.containerElement.classList.add(classes.SLIDER_ACTIVE);
			};

			prototype._onTouchEnd = function () {
				this._ui.containerElement.classList.remove(classes.SLIDER_ACTIVE);
			};

			prototype._focus = function () {
				this._ui.containerElement.classList.add("ui-focus");
			}

			prototype._blur = function () {
				this._ui.containerElement.classList.remove("ui-focus");
			}

			prototype._decreaseValue = function () {
				var self = this;

				self._setValue(self._value - (parseFloat(self.element.step) || 1));
			};

			prototype._increaseValue = function () {
				var self = this;

				self._setValue(self._value + (parseFloat(self.element.step) || 1));
			};

			prototype._unlockKeyboard = function () {
				var self = this;

				self._ui.handlerElement.classList.remove(BaseKeyboardSupport.classes.focus);
				self._unlockFocusSelf();
			};

			prototype._onKeyUp = function (event) {
				var self = this,
					KEY_CODES = BaseKeyboardSupport.KEY_CODES;

				if (self._supportKeyboard) {
					switch (event.keyCode) {
						case KEY_CODES.escape :
							self._unlockKeyboard();
							break;
						case KEY_CODES.enter :
							self._unlockKeyboard();
							// stop event propagation for prevent loop of focus lock
							event.preventDefault();
							event.stopImmediatePropagation();
							break;
						case KEY_CODES.left :
							self._decreaseValue();
							break;
						case KEY_CODES.right :
							self._increaseValue();
							break;
					}
				}
			};

			/**
			 * Refresh to Slider component
			 * @method refresh
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._refresh = function () {
				var self = this;

				self._updateProperties()
				self._setDisabled(self.element);
				self._initLayout();
			};

			/**
			 * Destroy Slider component
			 * @method _destroy
			 * @member ns.widget.core.Slider
			 * @protected
			 */
			prototype._destroy = function () {
				var self = this,
					containerElement = self._ui.containerElement;

				unbindEvents(self);
				if (containerElement.parentNode) {
					containerElement.parentNode.removeChild(containerElement);
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
