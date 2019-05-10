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
/*global window, define, ns*/
/**
 * #DatePicker Widget
 *
 * @class ns.widget.wearable.DatePicker
 * @component-selector .ui-date-picker
 * @since 4.0
 * @extends ns.widget.BaseWidget
 */
(function (window, document) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../../../../core/widget/BaseWidget",
			"../../../../core/util/selectors",
			"./NumberPicker",
			"./CircleIndicator",
			"../wearable"
		],

		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				utilsEvents = ns.event,
				NumberPicker = ns.widget.wearable.NumberPicker,
				prototype = new BaseWidget(),
				getClosestByClass = ns.util.selectors.getClosestByClass,

				WIDGET_CLASS = "ui-date-picker",
				classes = {
					CONTAINER: WIDGET_CLASS + "-container",
					CONTAINER_PREFIX: WIDGET_CLASS + "-container-",
					DAYNAME_CONTAINER: WIDGET_CLASS + "-containter-dayname",
					ACTIVE_LABEL_ANIMATION: WIDGET_CLASS + "-active-label-animation",
					HIDDEN: WIDGET_CLASS + "-hidden",
					LABEL_HIDDEN: "ui-number-picker-label-hidden"
				},

				DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
				MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
				WIDGET_SELECTOR = "." + WIDGET_CLASS,
				INDICATOR_OPTIONS = {
					month: {
						to: 12,
						bigTick: 1,
						bigTickHeight: 20,
						smallTick: 0
					},
					year: {
						to: 50,
						bigTickHeight: 13,
						bigTick: 5,
						smallTick: 1
					},
					day: {
						to: 30,
						bigTickHeight: 13,
						bigTick: 2,
						smallTick: 1
					}
				},
				MIN_YEAR = 1900,
				MAX_YEAR = 2050,
				CONTAINERS = ["month", "day", "year"];

			function DatePicker() {
				var self = this;

				self._ui = {
					display: {},
					dayNameContainer: null,
					footer: null
				};

				self.options = {
					min: 0,
					max: 12,
					step: 1,
					disabled: false
				};

				self._circleIndicatorSupporter = null;
				self._activeSelector = null;
				self._spins = {};
			}

			/**
			 * Initialize widget state, set current date and init month indicator
			 * @method _init
			 * @memberof ns.widget.wearable.DatePicker
			 * @protected
			 */
			prototype._init = function () {
				this._setValue(new Date());
				this._setActiveSelector("month");
			};

			/**
			 * Bind events click and rotarydetent
			 * @method _bindEvents
			 * @memberof ns.widget.wearable.DatePicker
			 * @protected
			 */
			prototype._bindEvents = function () {
				var self = this;

				self.on("click", self, true);
				utilsEvents.on(self._ui.display.day, "spinchange", self, false);
				utilsEvents.on(self._ui.display.month, "spinchange", self, false);
				utilsEvents.on(self._ui.display.year, "spinchange", self, false);
				utilsEvents.on(document, "rotarydetent", self, true);
			};

			/**
			 * Unbind events click and rotarydetent
			 * @method _unbindEvents
			 * @memberof ns.widget.wearable.DatePicker
			 * @protected
			 */
			prototype._unbindEvents = function () {
				var self = this;

				utilsEvents.off(document, "rotarydetent", self, true);
				self.off("click", self, true);
			};

			/**
			 * Build full widget structure
			 * @method _build
			 * @param {HTMLElement} element
			 * @memberof ns.widget.wearable.DatePicker
			 * @protected
			 */
			prototype._build = function (element) {
				var self = this,
					ui = self._ui,
					footer = document.createElement("footer"),
					buttonSet = document.createElement("button"),
					dayNameContainer = document.createElement("div");

				// create button set
				buttonSet.innerHTML = "SET";
				// add classes
				element.classList.add(NumberPicker.classes.CONTAINER);
				buttonSet.classList.add("ui-btn", NumberPicker.classes.BUTTON_SET);
				footer.classList.add("ui-footer", "ui-bottom-button", "ui-fixed");

				dayNameContainer.classList.add(classes.DAYNAME_CONTAINER);

				// build DOM structure
				CONTAINERS.forEach(function (name) {
					element.appendChild(self._createContainer(name));
				});

				element.appendChild(dayNameContainer);
				element.appendChild(footer);

				footer.appendChild(buttonSet);

				ui.buttonSet = buttonSet;
				ui.dayNameContainer = dayNameContainer;
				ui.footer = footer;

				self._buildNumberPicker();
				return element;
			};

			/**
			 * Build number picker
			 * @method _buildNumberPicker
			 * @memberof ns.widget.wearable.DatePicker
			 * @protected
			 */
			prototype._buildNumberPicker = function () {
				var self = this,
					display = self._ui.display;

				Object.keys(display).forEach(function (key) {
					var options;

					switch (key) {
						case "month" :
							options = {
								min: 1,
								max: MONTH_NAMES.length,
								loop: "enabled",
								labels: MONTH_NAMES.join(","),
								rollHeight: "custom",
								itemHeight: 50,
								duration: 300,
								value: 2
							};
							break;
						case "day" :
							options = {
								min: 1,
								max: 31,
								loop: "enabled",
								rollHeight: "custom",
								itemHeight: 50,
								duration: 300,
								value: 1
							};
							break;
						case "year" :
							// @ todo: change spin to carousel for big data
							options = {
								min: MIN_YEAR,
								max: MAX_YEAR,
								loop: "enabled",
								rollHeight: "custom",
								itemHeight: 50,
								duration: 300,
								value: 1
							};
							break;
					}
					self._spins[key] = ns.widget.Spin(display[key], options);
				});
			};

			/**
			 * Set options "to" for indicator
			 * @method _setOptionsTo
			 * @param {string} type
			 * @param {number} number
			 * @memberof ns.widget.wearable.DatePicker
			 * @protected
			 */
			prototype._setOptionsTo = function (type, number) {
				var options = INDICATOR_OPTIONS[type];

				if (number) {
					options.to = number;
				}
			};

			/**
			 * Create one container with children
			 * @method _createContainer
			 * @param {string} name
			 * @memberof ns.widget.wearable.DatePicker
			 * @protected
			 */
			prototype._createContainer = function (name) {
				var self = this,
					ui = self._ui,
					number = document.createElement("div"),
					numberPickerLabel = document.createElement("label"),
					numberPickerContainer = document.createElement("div");

				number.classList.add(NumberPicker.classes.NUMBER);
				numberPickerContainer.classList.add(classes.CONTAINER);

				numberPickerLabel.classList.add(NumberPicker.classes.LABEL);

				numberPickerLabel.innerText = name[0].toUpperCase() + name.substr(1);

				numberPickerContainer.appendChild(numberPickerLabel);
				numberPickerContainer.appendChild(number);
				numberPickerContainer.classList.add(classes.CONTAINER_PREFIX + name);

				ui.display[name] = number;

				return numberPickerContainer;
			};

			/**
			 * Set value of widget
			 * @method _setValue
			 * @param {Date} value
			 * @memberof ns.widget.wearable.DatePicker
			 * @protected
			 */
			prototype._setValue = function (value) {
				var self = this,
					ui = self._ui,
					dayName = DAY_NAMES[value.getDay()];

				self._value = value;

				Object.keys(ui.display).forEach(function (name) {
					self._spins[name].value(self._getValue(name));
				});

				ui.dayNameContainer.innerHTML = dayName;
			};

			/**
			 * Return Date value or value of one field
			 * @method _getValue
			 * @param {string} type
			 * @memberof ns.widget.wearable.DatePicker
			 * @return {Date|number}
			 * @protected
			 */
			prototype._getValue = function (type) {
				var value = this._value;

				switch (type) {
					case "month":
						return value.getMonth() + 1;
					case "day":
						return value.getDate();
					case "year":
						return value.getFullYear();
					default:
						return value;
				}
			};

			prototype._getTextValue = function (type) {
				var value = this._value;

				switch (type) {
					case "month":
						return MONTH_NAMES[value.getMonth()];
					case "day":
						return value.getDate();
					case "year":
						return value.getFullYear();
					default:
						return value;
				}
			};

			prototype._getIndicatorValue = function (type) {
				var value = this._value;

				switch (type) {
					case "month":
						return value.getMonth() + 1;
					case "day":
						return value.getDate();
					case "year":
						return value.getFullYear() % 50;
					default:
						return value;
				}
			};


			/**
			 * Return days in month
			 * @method _daysInMonth
			 * @param {number} year
			 * @param {number} month
			 * @memberof ns.widget.wearable.DatePicker
			 * @protected
			 */
			prototype._daysInMonth = function (year, month) {
				if (year === undefined) {
					year = this._getValue("year");
				}
				if (month === undefined) {
					month = this._getValue("month") - 1;
				}
				return new Date(year, month + 1, 0).getDate();
			};

			/**
			 * Handle events
			 * @method handleEvent
			 * @param {Event} event
			 * @memberof ns.widget.wearable.DatePicker
			 */
			prototype.handleEvent = function (event) {
				var self = this;

				if (event.type === "click") {
					event.preventDefault();
					self._onClick(event);
				} else if (event.type === "rotarydetent") {
					event.preventDefault();
					self._onRotary(event);
				} else if (event.type === "spinchange") {
					self._onSpinChange(event.detail.value);
				}
			};

			/**
			 * Get value of number of ticks on full rotation
			 * @method _getMaxValue
			 * @param {string} activeName
			 * @memberof ns.widget.wearable.DatePicker
			 * @return {number}
			 * @protected
			 */
			prototype._getMaxValue = function (activeName) {
				switch (activeName) {
					case "day":
						return this._daysInMonth();
					case "year":
						return 50;
					default:
						return 12;
				}
			};

			/**
			 * Set label visible
			 * @method _setLabelVisible
			 * @param {string} activeName
			 * @param {boolean} state
			 * @memberof ns.widget.wearable.DatePicker
			 * @protected
			 */
			prototype._setLabelVisible = function (activeName, state) {
				var parent = getClosestByClass(this._ui.display[activeName], classes.CONTAINER),
					label = parent.querySelector("." + NumberPicker.classes.LABEL);

				if (!state) {
					label.classList.add(classes.LABEL_HIDDEN);
				} else {
					label.classList.remove(classes.LABEL_HIDDEN);
				}
			}

			/**
			 * Change indicator after click in value
			 * @method _setActiveSelector
			 * @param {string} activeName
			 * @memberof ns.widget.wearable.DatePicker
			 * @protected
			 */
			prototype._setActiveSelector = function (activeName) {
				var self = this,
					ui = self._ui,
					maxValue = self._getMaxValue(activeName),
					spins = self._spins;

				if (self._activeSelector !== activeName) {
					if (activeName) {
						self._setOptionsTo(activeName, maxValue);
					}
					// disable all;
					Object.keys(ui.display).forEach(function (name) {
						if (spins[name].option("enabled")) {
							spins[name].option("enabled", false);
							self._setLabelVisible(name, true);
						}
					});
					// enable selected;
					if (activeName && spins[activeName]) {
						spins[activeName].option("enabled", true);
						self._setLabelVisible(activeName, false);
					}
				}
				self._activeSelector = activeName;
			};

			/**
			 * On click change current indicator or exit page on set click
			 * @method _onClick
			 * @param {Event} event
			 * @memberof ns.widget.wearable.DatePicker
			 * @protected
			 */
			prototype._onClick = function (event) {
				var self = this,
					target = event.target,
					parent = getClosestByClass(target, classes.CONTAINER),
					parentClassName = (parent) ? parent.className : "",
					activeName = "";

				if (parentClassName) {
					activeName = parentClassName.replace(classes.CONTAINER_PREFIX, "")
					.replace(classes.CONTAINER, "")
					.trim();
				}

				if (parent && activeName && CONTAINERS.indexOf(activeName) > -1) {
					self._setActiveSelector(activeName);
				} else if (target.classList.contains("ui-number-picker-set")) {
					self.trigger("change", {
						value: self.value()
					});
					history.back();
				} else {
					self._setActiveSelector(""); // disable all
				}
			};

			/**
			 * Destroy widget
			 * @method _destroy
			 * @memberof ns.widget.wearable.DatePicker
			 * @protected
			 */
			prototype._destroy = function () {
				this._unbindEvents();
				this.element.innerHTML = "";
			};

			/**
			 * Change month value on rotary event
			 * @method _changeMonth
			 * @param {number} changeValue
			 * @param {boolean} value
			 * @memberof ns.widget.wearable.DatePicker
			 * @protected
			 */
			prototype._changeMonth = function (changeValue) {
				var self = this,
					value = self.value(),
					month = value.getMonth(),
					newValue,
					day = value.getDate(),
					year = value.getFullYear(),
					daysInMonth;

				newValue = month + changeValue;
				value.setMonth(newValue);
				value.setFullYear(year);
				daysInMonth = self._daysInMonth(year, newValue);
				if (day > daysInMonth && (self._daysInMonth(year, month) > daysInMonth)) {
					value = new Date(year, newValue, daysInMonth);
				}
				self._changeValue(value);
			};

			/**
			 * Change day value on rotary event
			 * @method _changeDay
			 * @param {number} changeValue
			 * @memberof ns.widget.wearable.DatePicker
			 * @protected
			 */
			prototype._changeDay = function (changeValue) {
				var self = this,
					value = self.value(),
					month = value.getMonth(),
					newValue,
					day = value.getDate(),
					year = value.getFullYear(),
					daysInMonth = self._daysInMonth(year, month);

				newValue = day + changeValue;

				if (changeValue < 0 && day === 1) {
					value.setDate(daysInMonth);
				} else {
					value.setDate(newValue);
				}
				value.setMonth(month);
				value.setFullYear(year);
				self._changeValue(value);
			};

			/**
			 * Change year value on rotary event
			 * @method _changeYear
			 * @param {number} changeValue
			 * @memberof ns.widget.wearable.DatePicker
			 * @protected
			 */
			prototype._changeYear = function (changeValue) {
				var self = this,
					value = self.value(),
					month = value.getMonth(),
					year = value.getFullYear(),
					newYear = year + changeValue,
					daysInMonth;

				if (newYear > MAX_YEAR) {
					newYear = MIN_YEAR;
				} else if (newYear < MIN_YEAR) {
					newYear = MAX_YEAR;
				}

				value.setFullYear(newYear);

				// last day in Feb case, month = 1 => Feb
				daysInMonth = self._daysInMonth(value.getFullYear(), 1);
				if ((month === 1) && (self._daysInMonth(year, 1) > daysInMonth)) {
					value.setMonth(1);
					value.setDate(daysInMonth);
				}
				self._changeValue(value);
			};

			/**
			 * Update indicator value
			 * @method _changeValue
			 * @param {number} value
			 * @memberof ns.widget.wearable.DatePicker
			 * @protected
			 */
			prototype._changeValue = function (value) {
				var self = this;

				self._setValue(value);
			};

			/**
			 * Change indicator on rotary
			 * @method _onRotary
			 * @param {Event} event
			 * @memberof ns.widget.wearable.DatePicker
			 * @protected
			 */
			prototype._onRotary = function (event) {
				var self = this,
					direction = event.detail.direction,
					changeValue;

				if (direction === "CW") {
					changeValue = 1;
				} else {
					changeValue = -1;
				}

				switch (self._activeSelector) {
					case "month":
						self._changeMonth(changeValue);
						break;
					case "day":
						self._changeDay(changeValue);
						break;
					case "year":
						self._changeYear(changeValue);
						break;
				}
			};

			/**
			 * Change value of spin included in dataPicker
			 * @method _onSpinChange
			 * @param {number} value
			 * @memberof ns.widget.wearable.DatePicker
			 * @protected
			 */
			prototype._onSpinChange = function (newValue) {
				var self = this,
					value = self.value(),
					currentValue;

				switch (self._activeSelector) {
					case "month":
						currentValue = value.getMonth() + 1,
						self._changeMonth(newValue - currentValue);
						break;
					case "day":
						currentValue = value.getDate(),
						self._changeDay(newValue - currentValue);
						break;
					case "year":
						currentValue = value.getFullYear(),
						self._changeYear(newValue - currentValue);
						break;
				}
			};

			DatePicker.prototype = prototype;
			DatePicker.prototype.constructor = DatePicker;

			ns.widget.wearable.DatePicker = DatePicker;

			engine.defineWidget(
				"DatePicker",
				WIDGET_SELECTOR,
				[],
				DatePicker,
				""
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return DatePicker;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document));
