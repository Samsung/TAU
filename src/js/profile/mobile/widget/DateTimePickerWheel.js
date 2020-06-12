/*
 * Copyright (c) 2020 Samsung Electronics Co., Ltd
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
/* global define */
/**
 * # DateTimePickerWheel Widget
 * Shows a control that can be used to set hours and minutes.
 * It support 12/24 hours format. It contains two inputs which control the values
 *
 * ## Default selectors
 *
 * Default selector for timepicker is class *ui-datetime-picker-wheel*
 *
 * ### HTML Examples
 *
 * #### 12 hours format
 * To add a timepicker widget to the application, use the following code:
 *
 *      @example
 *      <div class="ui-datetime-picker-wheel" data-format="12">
 *
 * #### 24 hours format
 * To add a timepicker widget to the application, use the following code:
 *
 *      @example
 *      <div class="ui-datetime-picker-wheel" data-format="24">
 *
 * @class ns.widget.mobile.DateTimePickerWheel
 * @since 1.2
 * @component-selector .ui-datetime-picker-wheel
 * @extends ns.widget.mobile.DateTimePickerWheel
 * @author Tomasz Lukawski <t.lukawski@samsung.com>
 */
(function (window, document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/event",
			"../../../core/event/gesture",
			"../../../core/util/selectors",
			"./BaseWidgetMobile",
			"./Spin"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var BaseWidget = ns.widget.mobile.BaseWidgetMobile,
				engine = ns.engine,
				utilsEvents = ns.event,
				getClosestByClass = ns.util.selectors.getClosestByClass,
				Spin = ns.widget.mobile.Spin,
				WIDGET_CLASS = "ui-datetime-picker-wheel",
				classes = {
					WIDGET: WIDGET_CLASS,
					CONTAINER: WIDGET_CLASS + "-container",
					HOUR_CONTAINER: WIDGET_CLASS + "-container-hour",
					MINUTE_CONTAINER: WIDGET_CLASS + "-container-minute",
					FORMAT_CONTAINER: WIDGET_CLASS + "-container-format",
					DATE_CONTAINER: WIDGET_CLASS + "-container-date",
					ACTIVE_CONTAINER: WIDGET_CLASS + "-container-active",
					TIME_INPUT: WIDGET_CLASS + "-input",
					TIME_INPUT_ACTIVE: WIDGET_CLASS + "-input-active",
					SEPARATOR: WIDGET_CLASS + "-container-separator"
				},
				WIDGET_SELECTOR = "." + WIDGET_CLASS,
				DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
				MONTH_NAMES_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
				DateTimePickerWheel = function () {
					this.options = {
						format: "12",
						value: (new Date()).toUTCString()
					};

					this._spins = {
						date: null,
						hour: null,
						minute: null,
						format: null
					};

					this._ui = {};
					this._previousInputValue = -1;
					// Variable to check the current state of input element (false: first, true: second)
					this._inputValueState = false;
				},
				events = {
					/**
					 * Event will be triggered when user tap/click selected date
					 * @event
					 */
					SELECTED: "datetimepickerwheelselected",
					CHANGE: "datetimepickerwheelchange"
				},
				prototype = new BaseWidget();

			DateTimePickerWheel.classes = classes;

			/**
			* Init method
			* @method _init
			* @member ns.widget.mobile.DateTimePickerWheel
			* @protected
			*/
			prototype._init = function () {
				var self = this,
					options = self.options;

				options.format = (options.format !== undefined) ? options.format : "12";

				self._setValue(options.value);

				self.option("format", options.format);

				// Calculate the spin widget after building the widget
				Object.keys(self._spins).forEach(function (key) {
					self._spins[key].refresh();
				});
			};

			/**
			* Build widget instance
			* @method _build
			* @param {HTMLElement} element
			* @return {HTMLElement} Builded element
			* @member ns.widget.mobile.DateTimePickerWheel
			* @protected
			*/
			prototype._build = function (element) {
				var self = this,
					datePicker = self._buildDatePicker(),
					hourPicker = self._buildDateTimePickerWheel("hour"),
					minutePicker = self._buildDateTimePickerWheel("minute"),
					formatPicker = self._buildFormat(),
					separator = document.createElement("div");

				element.classList.add(classes.WIDGET);
				separator.classList.add(classes.SEPARATOR);
				element.appendChild(datePicker);
				element.appendChild(hourPicker);
				element.appendChild(separator);
				element.appendChild(minutePicker);
				element.appendChild(formatPicker);

				return element;
			};

			/**
			* Build Spin Widget for the time
			* @method _buildDateTimePickerWheel
			* @param {string} name
			* @return {HTMLElement} container for time spin
			* @member ns.widget.mobile.DateTimePickerWheel
			* @protected
			*/
			prototype._buildDateTimePickerWheel = function (name) {
				var self = this,
					ui = self._ui,
					spin = document.createElement("div"),
					spinInput = document.createElement("input"),
					spinContainer = document.createElement("div"),
					options = {
						momentumLevel: 1
					},
					spinWidget;

				spin.classList.add(Spin.classes.SPIN);
				spinContainer.classList.add(classes.CONTAINER);

				if (name === "hour") {
					if (self.options.format === "24") {
						options.min = 0;
						options.max = 23;
					} else {
						options.min = 1;
						options.max = 12;
					}
					spinContainer.classList.add(classes.HOUR_CONTAINER);
				} else if (name === "minute") {
					options.min = 0;
					options.max = 59;
					options.digits = 2;
					spinContainer.classList.add(classes.MINUTE_CONTAINER);
				}

				spinInput.min = options.min;
				spinInput.max = options.max;
				spinInput.type = "number";
				spinInput.step = "1";
				spinInput.classList.add(classes.TIME_INPUT);

				spin.appendChild(spinInput);
				spinContainer.appendChild(spin);

				ui[name + "Spin"] = spin;
				ui[name + "Input"] = spinInput;
				ui[name + "Container"] = spinContainer;

				spinWidget = ns.widget.Spin(spin, options);
				self._spins[name] = spinWidget;

				return spinContainer;
			};

			/**
			* Build Date Picker (Spin Widget) for the time
			* @method _buildDatePicker
			* @param {Date} selectedDate
			* @return {HTMLElement} container for time spin
			* @member ns.widget.mobile.DateTimePickerWheel
			* @protected
			*/
			prototype._buildDatePicker = function (selectedDate) {
				var self = this,
					ui = self._ui,
					spin = document.createElement("div"),
					spinContainer = document.createElement("div"),
					options = {},
					spinWidget,
					firstDayOfYear,
					date,
					year;

				selectedDate = selectedDate || new Date();
				year = selectedDate.getFullYear();
				firstDayOfYear = new Date(year.toString());
				date = firstDayOfYear;

				spin.classList.add(Spin.classes.SPIN);
				spinContainer.classList.add(classes.CONTAINER);
				spinContainer.classList.add(classes.DATE_CONTAINER);

				options.labels = [];
				while (date.getFullYear() === year) {
					options.labels.push(
						DAYS_OF_WEEK[date.getDay()] + ", " +
						MONTH_NAMES_SHORT[date.getMonth()] + " " +
						date.getDate()
					);
					date.setDate(date.getDate() + 1);
				}

				options.min = 0;
				options.max = options.labels.length - 1;
				options.loop = false;
				options.momentumLevel = 1;

				spinContainer.appendChild(spin);

				ui["dateSpin"] = spin;
				ui["dateContainer"] = spinContainer;

				spinWidget = ns.widget.Spin(spin, options);
				self._spins["date"] = spinWidget;

				self._year = year;

				return spinContainer;
			};

			/**
			* Build Spin Widget for the format
			* @method _buildFormat
			* @return {HTMLElement} container for format spin
			* @member ns.widget.mobile.DateTimePickerWheel
			* @protected
			*/
			prototype._buildFormat = function () {
				var self = this,
					spin = document.createElement("div"),
					spinContainer = document.createElement("div"),
					options = {
						min: 0,
						max: 1,
						labels: "AM,PM",
						loop: "false"
					},
					spinWidget;

				spin.classList.add(Spin.classes.SPIN);
				spinContainer.classList.add(classes.CONTAINER);
				spinContainer.classList.add(classes.FORMAT_CONTAINER);
				spinContainer.appendChild(spin);

				spinWidget = ns.widget.Spin(spin, options);
				self._spins.format = spinWidget;

				return spinContainer;
			};

			/**
			* Set the value for Date object
			* @method _setDateValue
			* @param {Date} value
			* @member ns.widget.mobile.DateTimePickerWheel
			* @protected
			*/
			prototype._setDateValue = function (value) {
				var self = this,
					ui = self._ui,
					spins = self._spins,
					hours,
					minutes,
					firstDayOfYear,
					DAY_MILLISECONDS = 24 * 3600 * 1000;

				hours = value.getHours();
				minutes = value.getMinutes();

				if (self.options.format === "12") {
					if (hours > 12) {
						hours -= 12;
						spins.format.value(1);
					} else {
						spins.format.value(0);
					}
				}

				ui.hourInput.setAttribute("value", hours);
				ui.hourInput.value = hours;
				ui.minuteInput.setAttribute("value", minutes);
				ui.minuteInput.value = minutes;

				firstDayOfYear = new Date(value.getFullYear(), 0, 1);
				spins.date.value(Math.floor((value - firstDayOfYear) / DAY_MILLISECONDS));

				spins.hour.value(hours);
				spins.minute.value(minutes);

				self.options.value = value;
			};

			/**
			* Set the value for the input element
			* @method _setInputValue
			* @param {string} name
			* @param {number} value
			* @param {boolean} state
			* @member ns.widget.mobile.DateTimePickerWheel
			* @protected
			*/
			prototype._setInputValue = function (name, value, state) {
				var self = this,
					ui = self._ui,
					spins = self._spins;

				if (name === "hour") {
					ui.hourInput.setAttribute("value", value);
					ui.hourInput.value = value;
					spins.hour.value(value);
				} else if (name === "minute") {
					ui.minuteInput.setAttribute("value", value);
					ui.minuteInput.value = value;
					spins.minute.value(value);
				}

				self._previousInputValue = value;
				self._inputValueState = state;
			}

			/**
			* Focus input element
			* @method _focusInput
			* @param {string} name
			* @member ns.widget.mobile.DateTimePickerWheel
			* @protected
			*/
			prototype._focusInput = function (name) {
				var self = this,
					ui = self._ui;

				if (name === "hour") {
					self.element.classList.add(classes.TIME_INPUT_ACTIVE);
					ui.hourContainer.classList.add(classes.ACTIVE_CONTAINER);
					ui.minuteContainer.classList.remove(classes.ACTIVE_CONTAINER);
					ui.hourInput.focus();
					self._previousInputValue = ui.hourInput.value;
				} else if (name === "minute") {
					self.element.classList.add(classes.TIME_INPUT_ACTIVE);
					ui.minuteContainer.classList.add(classes.ACTIVE_CONTAINER);
					ui.hourContainer.classList.remove(classes.ACTIVE_CONTAINER);
					ui.minuteInput.focus();
					self._previousInputValue = ui.minuteInput.value;
				}

				self._inputValueState = false;
			}

			/**
			* Set the value of DateTimePickerWheel
			* @method _setValue
			* @param {Date} value
			* @member ns.widget.mobile.DateTimePickerWheel
			* @protected
			*/
			prototype._setValue = function (value) {
				var self = this;

				// change string to date eg. "1995-12-17T03:24:00"
				if (typeof value === "string") {
					value = new Date(value);
				}

				if (value instanceof Date) {
					self._setDateValue(value);
				}
			};

			/**
			* Get the value of DateTimePickerWheel
			* @method _getValue
			* @return {Date} current time of time picker
			* @member ns.widget.mobile.DateTimePickerWheel
			* @protected
			*/
			prototype._getValue = function () {
				var self = this,
					time = new Date(self.options.value),
					spins = self._spins,
					hours = parseInt(spins.hour.value(), 10);

				if (self.options.format === "12" && spins.format.value() === 1) {
					hours += 12;
				}

				time.setHours(hours);
				time.setMinutes(parseInt(spins.minute.value(), 10));

				return time;
			};

			/**
			* Handle the click event
			* @method _onClick
			* @param {Event} event
			* @member ns.widget.mobile.DateTimePickerWheel
			* @protected
			*/
			prototype._onClick = function (event) {
				var self = this,
					ui = self._ui,
					element = self.element,
					eventTargetElement = event.target,
					hourContainer = ui.hourContainer,
					minuteContainer = ui.minuteContainer,
					parentContainer = getClosestByClass(eventTargetElement, classes.CONTAINER);

				if (parentContainer && parentContainer.classList.contains(classes.HOUR_CONTAINER) &&
					getClosestByClass(eventTargetElement, Spin.classes.SELECTED)) {
					self._focusInput("hour");
				} else if (parentContainer && parentContainer.classList.contains(classes.MINUTE_CONTAINER) &&
					getClosestByClass(eventTargetElement, Spin.classes.SELECTED)) {
					self._focusInput("minute");
				} else if (parentContainer && parentContainer.classList.contains(classes.DATE_CONTAINER) &&
					getClosestByClass(eventTargetElement, Spin.classes.SELECTED)) {
					utilsEvents.trigger(self.element, events.SELECTED, {datetime: self._getValue()});
				} else {
					element.classList.remove(classes.TIME_INPUT_ACTIVE);
					minuteContainer.classList.remove(classes.ACTIVE_CONTAINER);
					hourContainer.classList.remove(classes.ACTIVE_CONTAINER);
				}
			};

			// Get a new added value
			function diffValue(origin, change) {
				var diff = change.toString().split(origin).join("");

				if (diff.length === 0) {
					return origin;
				}
				return diff;
			}

			/**
			* Change the value of input element included in Spin
			* @method _onInputChange
			* @param {Event} event
			* @member ns.widget.mobile.DateTimePickerWheel
			* @protected
			*/
			prototype._onInputChange = function (event) {
				var self = this,
					ui = self._ui,
					options = self.options,
					value = event.target.value,
					activeContainer = getClosestByClass(event.target, classes.CONTAINER),
					visibleValue;

				if (activeContainer && activeContainer.classList.contains(classes.HOUR_CONTAINER)) {
					if (!self._inputValueState) {
						visibleValue = parseInt(diffValue(self._previousInputValue, value), 10);
						self._setInputValue("hour", visibleValue, true);

						if ((options.format === "12" && visibleValue > 1) || (options.format === "24" && visibleValue > 2)) {
							self._focusInput("minute");
						}
					} else {
						visibleValue = parseInt(value, 10);

						if (visibleValue > ui.hourInput.max || visibleValue < ui.hourInput.min) {
							// TODO: Show toast error message
							self._setInputValue("hour", self._previousInputValue, true);
							return;
						}

						self._setInputValue("hour", visibleValue, false);
						self._focusInput("minute");
					}
				} else if (activeContainer && activeContainer.classList.contains(classes.MINUTE_CONTAINER)) {
					if (!self._inputValueState) {
						visibleValue = parseInt(diffValue(self._previousInputValue, value), 10);
						self._setInputValue("minute", visibleValue, true);
					} else {
						visibleValue = parseInt(value, 10);

						if (visibleValue > ui.minuteInput.max || visibleValue < ui.minuteInput.min) {
							// TODO: Show toast error message
							self._setInputValue("minute", self._previousInputValue, false);
							return;
						}

						self._setInputValue("minute", visibleValue, false);
					}
				}
			};

			/**
			* Change the value of spin included in DateTimePickerWheel
			* @method _onSpinChange
			* @param {Event} event
			* @member ns.widget.mobile.DateTimePickerWheel
			* @protected
			*/
			prototype._onSpinChange = function (event) {
				var self = this,
					parentContainer = getClosestByClass(event.target, classes.CONTAINER);

				if (parentContainer && parentContainer.classList.contains(classes.HOUR_CONTAINER)) {
					self._setInputValue("hour", event.detail.value, false);
				} else if (parentContainer && parentContainer.classList.contains(classes.MINUTE_CONTAINER)) {
					self._setInputValue("minute", event.detail.value, false);
				} else if (parentContainer && parentContainer.classList.contains(classes.DATE_CONTAINER)) {
					self._setDate(new Date(self._year, 0, event.detail.value + 1));
				}
				ns.event.trigger(self.element, "datetimepickerwheelchange", {date: self._getValue()});
			};

			prototype._setDate = function (date) {
				var currentValue = new Date(this.options.value);

				if (typeof date === "string") {
					date = new Date(date);
				}
				if (date instanceof Date) {
					currentValue.setFullYear(date.getFullYear());
					currentValue.setMonth(date.getMonth());
					currentValue.setDate(date.getDate());
					this.options.value = currentValue;
				}
			}

			/**
			* Handle events
			* @method handleEvent
			* @param {Event} event
			* @member ns.widget.mobile.DateTimePickerWheel
			* @public
			*/
			prototype.handleEvent = function (event) {
				var self = this;

				switch (event.type) {
					case "vclick":
						self._onClick(event);
						break;
					case "input":
						self._onInputChange(event);
						break;
					case "spinchange":
						self._onSpinChange(event);
						break;
				}
			};

			/**
			* Bind widget event handlers
			* @method _bindEvents
			* @member ns.widget.mobile.DateTimePickerWheel
			* @protected
			*/
			prototype._bindEvents = function () {
				var self = this,
					ui = self._ui;

				utilsEvents.on(self.element, "vclick", self);
				utilsEvents.on(ui.hourInput, "input", self);
				utilsEvents.on(ui.minuteInput, "input", self);
				utilsEvents.on(ui.hourSpin, "spinchange", self);
				utilsEvents.on(ui.minuteSpin, "spinchange", self);
				utilsEvents.on(ui.dateSpin, "spinchange", self);
			};

			/**
			* Unbind widget event handlers
			* @method _unbindEvents
			* @member ns.widget.mobile.DateTimePickerWheel
			* @protected
			*/
			prototype._unbindEvents = function () {
				var self = this,
					ui = self._ui;

				utilsEvents.off(self.element, "vclick", self);
				utilsEvents.off(ui.hourInput, "input", self);
				utilsEvents.off(ui.minuteInput, "input", self);
				utilsEvents.off(ui.hourSpin, "spinchange", self);
				utilsEvents.off(ui.minuteSpin, "spinchange", self);
				utilsEvents.off(ui.dateSpin, "spinchange", self);
			};

			/**
			* Destory DateTimePickerWheel widget
			* @method _destory
			* @member ns.widget.mobile.DateTimePickerWheel
			* @protected
			*/
			prototype._destory = function () {
				var self = this,
					spins = self._spins;

				Object.keys(spins).forEach(function (key) {
					// @todo change "_destroy()" to "destroy()"
					spins[key]._destory();
				});

				self._unbindEvents();
			};

			DateTimePickerWheel.prototype = prototype;

			// definition
			ns.widget.mobile.DateTimePickerWheel = DateTimePickerWheel;
			engine.defineWidget(
				"DateTimePickerWheel",
				WIDGET_SELECTOR,
				[],
				DateTimePickerWheel,
				"mobile"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return DateTimePickerWheel;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, window.tau));
