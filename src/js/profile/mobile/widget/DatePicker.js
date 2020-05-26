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
* # DatePicker Widget
* Shows a control that can be used to set day, month, and year.
* It support calendar/wheel view mode.
*
* ## Default selectors
*
* Default selector for timepicker is class *ui-date-picker*
*
* ### HTML Examples
*
* #### Wheel view
* To add a datepicker widget to the application, use the following code:
*
*      @example
*      <div class="ui-date-picker" data-view="wheel">
*
* @class ns.widget.mobile.DatePicker
* @since 1.2
* @component-selector .ui-date-picker
* @extends ns.widget.mobile.DatePicker
* @author Hunseop Jeong <hs85.jeong@samsung.com>
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
				WIDGET_CLASS = "ui-date-picker",
				classes = {
					HEADER: WIDGET_CLASS + "-header",
					CONTENT: WIDGET_CLASS + "-content",
					CONTAINER: WIDGET_CLASS + "-container",
					DAY_CONTAINER: WIDGET_CLASS + "-container-day",
					MONTH_CONTAINER: WIDGET_CLASS + "-container-month",
					YEAR_CONTAINER: WIDGET_CLASS + "-container-year"
				},
				MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				MIN_YEAR = 1900,
				MAX_YEAR = 2050,
				WIDGET_SELECTOR = "." + WIDGET_CLASS,
				DatePicker = function () {
					this.options = {
						view: "wheel"
					};

					this._spins = {
						day: null,
						month: null,
						year: null
					};
					this._ui = {
						header: null
					};
				},
				prototype = new BaseWidget();

			DatePicker.classes = classes;

			/**
			* Init method
			* @method _init
			* @member ns.widget.mobile.DatePicker
			* @protected
			*/
			prototype._init = function () {
				var self = this;

				self._setValue(new Date());
				// Update day in month
				self._changeMonth(self._getDateValue("month"));

				// Calculate the spin widget after building the widget
				Object.keys(self._spins).forEach(function (key) {
					self._spins[key].refresh();
				});
			};

			/**
			* Build widget for the date picker
			* @method _buildDatePicker
			* @param {string} name
			* @return {HTMLElement} container for date spin
			* @member ns.widget.mobile.DatePicker
			* @protected
			*/
			prototype._buildDatePicker = function (name) {
				var self = this,
					ui = self._ui,
					spin = document.createElement("div"),
					spinContainer = document.createElement("div"),
					options = {
						momentumLevel: 1
					},
					spinWidget;

				spin.classList.add(Spin.classes.SPIN);
				spinContainer.classList.add(DatePicker.classes.CONTAINER);

				if (name === "day") {
					options = {
						min: 1,
						max: 31,
						momentumLevel: 1
					};
					spinContainer.classList.add(DatePicker.classes.DAY_CONTAINER);
				} else if (name === "month") {
					options = {
						min: 1,
						max: MONTH_NAMES.length,
						labels: MONTH_NAMES.map(function (value) {
							return value.toUpperCase().substring(0, 3);
						}).join(","),
						momentumLevel: 1
					};
					spinContainer.classList.add(DatePicker.classes.MONTH_CONTAINER);
				} else if (name === "year") {
					options = {
						min: MIN_YEAR,
						max: MAX_YEAR,
						value: 2020,
						momentumLevel: 1
					}
					spinContainer.classList.add(DatePicker.classes.YEAR_CONTAINER);
				}

				spinContainer.appendChild(spin);

				ui[name + "Spin"] = spin;

				spinWidget = ns.widget.Spin(spin, options);
				self._spins[name] = spinWidget;

				return spinContainer;
			};

			/**
			* Build widget instance
			* @method _build
			* @param {HTMLElement} element
			* @return {HTMLElement} Builded element
			* @member ns.widget.mobile.DatePicker
			* @protected
			*/
			prototype._build = function (element) {
				var self = this,
					ui = self._ui,
					header = document.createElement("div"),
					content = document.createElement("div"),
					dayPicker = self._buildDatePicker("day"),
					monthPicker = self._buildDatePicker("month"),
					yearPicker = self._buildDatePicker("year");

				header.classList.add(DatePicker.classes.HEADER);
				element.appendChild(header);

				ui.header = header;

				content.classList.add(DatePicker.classes.CONTENT);
				content.appendChild(dayPicker);
				content.appendChild(monthPicker);
				content.appendChild(yearPicker);

				element.appendChild(content);

				return element;
			};

			/**
			* Return Date value
			* @method _getValue
			* @return {Date}
			* @member ns.widget.mobile.DatePicker
			* @protected
			*/
			prototype._getValue = function () {
				return this._value;
			}

			/**
			* Return value of one field
			* @method _getDateValue
			* @param {string} type
			* @return {Date|number}
			* @member ns.widget.mobile.DatePicker
			* @protected
			*/
			prototype._getDateValue = function (type) {
				var value = this._value;

				switch (type) {
					case "day":
						return value.getDate();
					case "month":
						return value.getMonth() + 1;
					case "year":
						return value.getFullYear();
					default:
						return value;
				}
			}

			/**
			* Set the value of DatePicker
			* @method _setValue
			* @param {Date} value
			* @member ns.widget.mobile.DatePicker
			* @protected
			*/
			prototype._setValue = function (value) {
				var self = this,
					spins = self._spins,
					headerText;

				if (value instanceof Date) {
					self._value = value;

					Object.keys(spins).forEach(function (name) {
						spins[name].value(self._getDateValue(name));
					});

					headerText = MONTH_NAMES[value.getMonth()] + " " + value.getFullYear();
					self._ui.header.innerHTML = headerText;
				}
			};

			/**
			* Change a day value
			* @method _changeDay
			* @param {number} day
			* @member ns.widget.mobile.DatePicker
			* @protected
			*/
			prototype._changeDay = function (day) {
				var self = this,
					value = self.value();

				value.setDate(day);
				self.value(value);
			};

			/**
			* Calculate the day count in month
			* @method _dayInMonth
			* @param {number} year
			* @param {number} month
			* @return {number}
			* @member ns.widget.mobile.DatePicker
			* @protected
			*/
			prototype._dayInMonth = function (year, month) {
				if (year === undefined) {
					year = this._getDateValue("year");
				}
				if (month === undefined) {
					month = this._getDateValue("month");
				}
				return new Date(year, month, 0).getDate();
			}

			/**
			* Change a month value
			* @method _changeMonth
			* @param {number} month
			* @member ns.widget.mobile.DatePicker
			* @protected
			*/
			prototype._changeMonth = function (month) {
				var self = this,
					spins = self._spins,
					value = self.value(),
					day = value.getDate(),
					dayInMonth;

				dayInMonth = self._dayInMonth(value.getFullYear(), month);

				if (day > dayInMonth) {
					day = dayInMonth;
				}

				value.setDate(day);
				value.setMonth(month - 1);

				spins.day.option("max", dayInMonth);
				spins.day._prevValue = day;
				spins.day._updateItems();

				self.value(value);
			};

			/**
			* Change a year value
			* @method _changeYear
			* @param {number} year
			* @member ns.widget.mobile.DatePicker
			* @protected
			*/
			prototype._changeYear = function (year) {
				var self = this,
					spins = self._spins,
					value = self.value(),
					month = value.getMonth(),
					day = value.getDate(),
					dayInMonth;

				dayInMonth = self._dayInMonth(year, month + 1);
				if (day > dayInMonth) {
					day = dayInMonth;
				}

				value.setFullYear(year);
				value.setDate(day);

				spins.day.option("max", dayInMonth);
				spins.day._updateItems();

				self.value(value);
			};

			/**
			* Handle spinchange event
			* @method _onSpinChange
			* @param {Event} event
			* @member ns.widget.mobile.DatePicker
			* @protected
			*/
			prototype._onSpinChange = function (event) {
				var self = this,
					parentContainer = getClosestByClass(event.target, DatePicker.classes.CONTAINER);

				if (parentContainer && parentContainer.classList.contains(DatePicker.classes.DAY_CONTAINER)) {
					self._changeDay(event.detail.value);
				} else if (parentContainer && parentContainer.classList.contains(DatePicker.classes.MONTH_CONTAINER)) {
					self._changeMonth(event.detail.value);
				} else if (parentContainer && parentContainer.classList.contains(DatePicker.classes.YEAR_CONTAINER)) {
					self._changeYear(event.detail.value);
				}
			};

			/**
			* Handle events of the DatePicker
			* @method handleEvent
			* @param {Event} event
			* @member ns.widget.mobile.DatePicker
			* @public
			*/
			prototype.handleEvent = function (event) {
				var self = this;

				if (event.type === "spinchange") {
					self._onSpinChange(event);
				}
			}

			/**
			* Bind events
			* @method _bindEvents
			* @member ns.widget.mobile.DatePicker
			* @public
			*/
			prototype._bindEvents = function () {
				var self = this,
					ui = self._ui;

				utilsEvents.on(ui.daySpin, "spinchange", self, false);
				utilsEvents.on(ui.monthSpin, "spinchange", self, false);
				utilsEvents.on(ui.yearSpin, "spinchange", self, false);
			};

			/**
			* Unbind events
			* @method _bindEvents
			* @member ns.widget.mobile.DatePicker
			* @public
			*/
			prototype._unbindEvents = function () {
				var self = this,
					ui = self._ui;

				utilsEvents.off(ui.daySpin, "spinchange", self, false);
				utilsEvents.off(ui.monthSpin, "spinchange", self, false);
				utilsEvents.off(ui.yearSpin, "spinchange", self, false);
			}

			DatePicker.prototype = prototype;

			// definition
			ns.widget.mobile.DatePicker = DatePicker;
			engine.defineWidget(
				"DatePicker",
				WIDGET_SELECTOR,
				[],
				DatePicker,
				"mobile"
			);

			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return DatePicker;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window, window.document, window.tau));
