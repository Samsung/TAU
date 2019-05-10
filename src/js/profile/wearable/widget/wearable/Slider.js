/*global window, ns, define */
/*jslint nomen: true */
/**
 * # Slider Widget
 * Wearable Slider component has two types, first is normal slider type another is circle slider type.
 * Circle slider type has provided to rotary and touch event handling in component side.
 * Circle slider type is default type.
 *
 * ## Default selectors
 *
 * To add a slider component to the application, use the following code:
 *
 *      @example
 *      // Normal type
 *      <input id="circle" data-type="normal" name="circleSlider" type="range" value="20" min="0" max="100" />
 *
 *      // OR Circle type
 *      <input id="circle" data-type="circle" name="circleSlider" type="range" value="20" min="0" max="100" />
 *
 * ## JavaScript API
 *
 * @class ns.widget.wearable.Slider
 * @component-selector .ui-slider
 * @extends ns.widget.core.Slider
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/widget/core/Slider",
			"./CircleProgressBar",
			"../../../../core/engine",
			"../../../../core/event",
			"../../../../core/util/object"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var CoreSlider = ns.widget.core.Slider,
				CoreSliderPrototype = CoreSlider.prototype,
				CircleProgressBar = ns.widget.wearable.CircleProgressBar,
				CircleProgressBarPrototype = CircleProgressBar.prototype,
				shape = ns.support.shape,
				engine = ns.engine,
				events = ns.event,
				utilObject = ns.util.object,
				round = Math.round,
				floor = Math.floor,
				atan2 = Math.atan2,
				PI = Math.PI,
				PI2 = PI * 2,
				PI2_5 = PI * 5 / 2,
				Slider = function () {
					var self = this;

					CoreSlider.call(self);

					self._step = 1;
					self._middlePoint = {
						x: 0,
						y: 0
					}
				},
				prototype = new CoreSlider(),
				eventType = {
					/**
					 * Triggered when the section is changed.
					 * @event change
					 * @member ns.widget.wearable.Slider
					 */
					CHANGE: "change"
				},
				PREFIX = "ui-slider",
				classes = {
					container: PREFIX + "-container",
					titles: PREFIX + "-titles",
					buttons: PREFIX + "-buttons",
					plus: PREFIX + "-plus",
					minus: PREFIX + "-minus",
					number: PREFIX + "-number",
					icon: PREFIX + "-icon",
					title: PREFIX + "-title",
					subtitle: PREFIX + "-subtitle"
				},
				slice = Array.prototype.slice;

			Slider.prototype = prototype;

			Slider.classes = classes;

			/**
			 * Configure Slider widget
			 * @method _configure
			 * @protected
			 * @member ns.widget.wearable.Slider
			 */
			prototype._configure = function () {
				var self = this,
					options;

				if (shape.circle) {
					self.options = utilObject.merge({}, self.options, {
						margin: 0,
						endPoint: false,
						bgcolor: "white",
						pressed: false
					});

					CircleProgressBarPrototype._configure.call(self);
				}

				options = self.options;

				/**
				 * Options for widget
				 * @property {Object} options Options for widget
				 * @property {number} [options.thickness=8] Sets the border width of CircleProgressBar.
				 * @property {number|"full"|"large"|"medium"|"small"|null} [options.size="full"] Sets the size of CircleProgressBar.
				 * @property {?string} [options.containerClassName=null] Sets the class name of CircleProgressBar container.
				 * @property {"circle"|"normal"} [options.type="circle"] Sets type of slider
				 * @property {number} [options.touchableWidth=50] In circle slider define size of touchable area on border
				 * @property {boolean} [options.buttons=false] Enable additional + / - buttons
				 * @property {string} [options.bgcolor="rgba(61, 185, 204, 0.4)"] Background color for inactive slider line
				 * @property {boolean} [options.endPoint=true] Indicator of current slider position
				 * @property {number} [options.margin=7] In circle slider define size of margin
				 * @member ns.widget.wearable.Slider
				 */
				options.size = "full";
				options.touchableWidth = 50;
				options.buttons = false;
				options.bgcolor = "rgba(61, 185, 204, 0.4)";
				options.endPoint = true;
				options.margin = 7;
			};

			/**
			 * Build buttons for slider
			 * @method _buildButtons
			 * @protected
			 * @param {HTMLElement} element
			 * @member ns.widget.wearable.Slider
			 */
			prototype._buildButtons = function (element) {
				var buttonsContainer = document.createElement("div");

				buttonsContainer.classList.add(classes.buttons);
				buttonsContainer.innerHTML = "<div class='" + classes.minus +
					"'></div><div class='" + classes.number + "'></div><div class='" + classes.plus + "'></div>";

				element.parentElement.insertBefore(buttonsContainer, element);
			};

			/**
			 * Build Slider widget
			 * @method _build
			 * @protected
			 * @param {HTMLElement} element
			 * @member ns.widget.wearable.Slider
			 */
			prototype._build = function (element) {
				var self = this,
					options = self.options,
					parentElement = element.parentElement,
					sliderElements = null,
					container = null,
					titles = null;

				if (options.type === "circle") {
					CircleProgressBar.call(this);
					element.style.display = "none";
					CircleProgressBarPrototype._build.call(self, element);

					if (options.buttons) {
						self._buildButtons(element);
					}

					sliderElements = slice.call(
						parentElement.querySelectorAll("." + classes.icon + ", ." +
							classes.title + ", ." + classes.subtitle + ", ." + classes.buttons));

					if (sliderElements.length) {
						container = document.createElement("div");
						container.classList.add(classes.container);
						sliderElements.forEach(container.appendChild.bind(container));
						parentElement.appendChild(container);

						sliderElements = slice.call(
							parentElement.querySelectorAll("." + classes.subtitle + ", ." +
								classes.title));

						titles = document.createElement("div");
						titles.classList.add(classes.titles);
						sliderElements.forEach(titles.appendChild.bind(titles));
						container.appendChild(titles);
						self._ui.container = container;
					}

				} else {
					CoreSliderPrototype._build.call(self, element);
				}

				return element;
			};

			/**
			 * Init Slider widget
			 * @method _init
			 * @protected
			 * @param {HTMLElement} element
			 * @member ns.widget.wearable.Slider
			 */
			prototype._init = function (element) {
				var self = this,
					options = self.options;

				if (options.type === "circle") {
					CircleProgressBarPrototype._init.call(self, element);
					self._circleInit();
				} else {
					CoreSliderPrototype._init.call(self, element);
				}
				if (self._ui.container) {
					self._ui.valueField = self._ui.container.querySelector("." + classes.number);
				}
				// init value and redraw
				self.value(self._value);
				return element;
			};

			/**
			 * Init Slider widget for circular type
			 * @method _circleInit
			 * @protected
			 * @member ns.widget.wearable.Slider
			 */
			prototype._circleInit = function () {
				var self = this;

				self._step = parseInt(self.element.getAttribute("step"), 10) || self._step || 1;
				self._middlePoint.x = window.innerWidth / 2;
				self._middlePoint.y = window.innerHeight / 2;

				if (self._step < 1) {
					self._step = 1;
				} else if (self._step > self._maxValue - self._minValue) {
					self._step = self._maxValue - self._minValue;
				}
			};

			/**
			 * Bind events Slider widget
			 * @method _bindEvents
			 * @protected
			 * @member ns.widget.wearable.Slider
			 */
			prototype._bindEvents = function () {
				var self = this,
					options = self.options;

				if (options.type === "circle") {
					events.on(document, "rotarydetent touchstart touchmove touchend click", self, false);
				} else {
					CoreSliderPrototype._bindEvents.call(self);
				}
			};

			/**
			 * Bind event handlers
			 * @method handleEvent
			 * @param {Event} event
			 * @member ns.widget.wearable.Slider
			 * @protected
			 */
			prototype.handleEvent = function (event) {
				var self = this,
					options = self.options;

				if (options.type === "circle") {
					switch (event.type) {
						case "rotarydetent":
							self._onRotary(event);
							break;
						case "touchstart":
						case "touchmove":
						case "touchend":
							self._onTouch(event);
							break;
						case "click":
							self._onClick(event);
							break;
					}
				} else {
					CoreSliderPrototype.handleEvent.call(self, event);
				}
			};

			/**
			 * Rotarydetent event handler
			 * @method _onRotary
			 * @param {Event} event
			 * @member ns.widget.wearable.Slider
			 * @protected
			 */
			prototype._onRotary = function (event) {
				var self = this,
					step = self._step,
					value = self.value();

				self.value(value + ((event.detail.direction === "CW") ? step : -step));
			};

			/**
			 * Touchstart handler
			 * @method _onTouch
			 * @param {Event} event
			 * @member ns.widget.wearable.Slider
			 * @protected
			 */
			prototype._onTouch = function (event) {
				var self = this,
					pointer = event.changedTouches && event.changedTouches[0] || event,
					clientX = pointer.clientX,
					clientY = pointer.clientY,
					isValid = self._isValidStartPosition(clientX, clientY);

				if (isValid) {
					event.preventDefault();
					event.stopPropagation();

					self._setValueByCoord(clientX, clientY);
				}

				if (self.options.endPoint) {
					if (event.type === "touchstart") {
						self.option("pressed", true);
					} else if (event.type === "touchend") {
						self.option("pressed", false);
					}
				}
			};

			/**
			 * Touchstart handler
			 * @method _onClick
			 * @param {Event} event
			 * @member ns.widget.wearable.Slider
			 * @protected
			 */
			prototype._onClick = function (event) {
				var self = this,
					targetClassList = event.target.classList;

				if (targetClassList.contains(classes.plus)) {
					self.value(self.value() + self._step);
				} else if (targetClassList.contains(classes.minus)) {
					self.value(self.value() - self._step);
				}
			};

			/**
			 * Set pressed options
			 * @method _setPressed
			 * @param {HTMLElement} element
			 * @param {*} value
			 * @member ns.widget.wearable.Slider
			 * @protected
			 */
			prototype._setPressed = function (element, value) {
				value = (value === "false") ? false : value;
				if (this.options.pressed === !value) {
					this.options.pressed = !!value;
					// refresh
					return true;
				}
				return false;
			}

			/**
			 * Check whether the click point is in valid area
			 * @method _isValidStartPosition
			 * @param {number} clientX
			 * @param {number} clientY
			 * @member ns.widget.wearable.Slider
			 * @protected
			 */
			prototype._isValidStartPosition = function (clientX, clientY) {
				var self = this,
					middleX = self._middlePoint.x,
					middleY = self._middlePoint.y,
					minRadius = middleY - self.options.touchableWidth;

				return ((clientY - middleY) * (clientY - middleY) + (clientX - middleX) * (clientX - middleX) > minRadius * minRadius);
			};

			/**
			 * Set value to slider
			 * @method _setValueByCoord
			 * @param {number} clientX
			 * @param {number} clientY
			 * @member ns.widget.wearable.Slider
			 * @protected
			 */
			prototype._setValueByCoord = function (clientX, clientY) {
				var self = this,
					value;

				value = self._convertCoordToValue(clientX, clientY);

				if (value === 0 && clientX === self._middlePoint.x) {
					if (CircleProgressBarPrototype._getValue.call(self) > (self._maxValue + self._minValue) / 2) {
						value = self._maxValue;
					}
				}
				self.value(value);
			};

			/**
			 * Convert from coordinate to slider value
			 * @method _convertCoordToValue
			 * @param {number} clientX
			 * @param {number} clientY
			 * @member ns.widget.wearable.Slider
			 * @protected
			 */
			prototype._convertCoordToValue = function (clientX, clientY) {
				return round(((atan2(clientY - this._middlePoint.y, clientX - this._middlePoint.x) + PI2_5) % PI2) / PI2 * (this._maxValue - this._minValue) + this._minValue);
			};

			/**
			 * Calibrate value using step option
			 * @method _calibrateValue
			 * @param {number} value
			 * @member ns.widget.wearable.Slider
			 * @protected
			 */
			prototype._calibrateValue = function (value) {
				var self = this,
					step = self._step,
					half = step / 2;

				return floor((value - self._minValue + half) / step) * step + self._minValue;
			};

			/**
			 * Set slider value
			 * @method _setValue
			 * @param {number} value
			 * @member ns.widget.wearable.Slider
			 * @return {number|null}
			 * @public
			 */
			prototype._setValue = function (value) {
				var self = this,
					currentValue = self._value;

				if (parseInt(value, 10) > self._maxValue) {
					value = self._maxValue;
				}
				if (parseInt(value, 10) < self._minValue) {
					value = self._minValue;
				}
				value = self._calibrateValue(value);
				if (self.options.type === "circle") {
					CircleProgressBarPrototype._setValue.call(self, value);
					if (self._ui.valueField) {
						self._ui.valueField.textContent = value;
					}
					if (value !== currentValue) {
						self.trigger(eventType.CHANGE);
					}
				} else {
					return CoreSliderPrototype._setValue.call(self, value);
				}
			};

			/**
			 * Get slider value
			 * @method value
			 * @member ns.widget.wearable.Slider
			 * @return {number}
			 * @public
			 */
			prototype._getValue = function () {
				var self = this;

				if (self.options.type === "circle") {
					return CircleProgressBarPrototype._getValue.call(self);
				} else {
					return CoreSliderPrototype._getValue.call(self);
				}
			};

			/**
			 * Refresh Slider component
			 * @method refresh
			 * @member ns.widget.wearable.Slider
			 * @public
			 */
			prototype.refresh = function () {
				var self = this,
					options = self.options;

				if (options.type === "circle") {
					CircleProgressBarPrototype._refresh.call(self);
					self._circleInit();
				} else {
					CoreSliderPrototype.refresh.call(self);
				}
			};

			/**
			 * Destroy Slider component
			 * @method _destroy
			 * @member ns.widget.wearable.Slider
			 * @protected
			 */
			prototype._destroy = function () {
				var self = this,
					options = self.options;

				if (options.type === "circle") {
					events.off(document, "rotarydetent touchstart touchmove touchend click", self, false);

					self.element.style.display = "inline-block";

					CircleProgressBarPrototype._destroy.call(self);

					self._ui = null;
					self.options = null;

				} else {
					CoreSliderPrototype._destroy.call(self);
				}
			};

			ns.widget.wearable.Slider = Slider;
			engine.defineWidget(
				"Slider",
				"." + PREFIX,
				[
					"value"
				],
				Slider,
				"wearable",
				true
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.wearable.Slider;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
