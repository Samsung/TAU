/*global window, ns, define, ns */
/*jslint nomen: true, plusplus: true */
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
 * @class ns.widget.wearable.Datetimepicker
 * @author Piotr Karny <p.karny@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../../core/engine",
			"../wearable",
			"../../../../core/widget/BaseWidget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");

			var Datetimepicker = function () {
					this.options = {};
				},
				BaseWidget = ns.widget.BaseWidget,
				engine = ns.engine,
				pickerPrototype,
				daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
				monthsDict = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
				classes = {
					uiHidden: "ui-hidden",
					uiDatePicker: "ui-date-picker",
					uiTimePicker: "ui-time-picker",
					uiDatetime: "ui-datetime",
					uiDatetimeBtns: "ui-datetime-btns",
					uiSelected: "ui-selected",
					uiDatetimePeriods: "ui-datetime-periods",

					uiDatetimeWheel: "ui-datetime-wheel",
					uiDatetimeWheelMinus: "ui-datetime-wheel-minus",
					uiDatetimeWheelPlus: "ui-datetime-wheel-plus",

					uiPeriodAm: "ui-period-am",
					uiPeriodPm: "ui-period-pm",

					uiBtnLeft: "ui-btn-left",
					uiBtnRight: "ui-btn-right",

					prefixUiDatefield: "ui-datefield-",
					prefixUiPeriod: "ui-period-"
				},
				dayHours = 24,
				slice = [].slice;

			Datetimepicker.classes = classes;

			pickerPrototype = new BaseWidget();
			Datetimepicker.prototype = pickerPrototype;

			function isLeapYear(year) {
				return year % 4 ? 0 : (year % 100 ? 1 : (year % 400 ? 0 : 1));
			}

			function maxDayInMonth(month, year) {
				var maxDay = daysInMonth[month];

				if (month === 1) {
					maxDay += isLeapYear(year);
				}
				return maxDay;
			}

			function makeTwoDigits(val) {
				if (val < 10) {
					return "0" + val;
				}
				return "" + val;
			}

			function setActiveField(self, field) {
				var activeField = self.activeField;

				if (activeField) {
					activeField.classList.remove(classes.uiSelected);
					// Hide field controls
					activeField._controls.classList.add(classes.uiHidden);
				}

				field.classList.add(classes.uiSelected);
				self.activeField = field;
				field._controls.classList.remove(classes.uiHidden);
			}

			function bindField(self, fieldName) {
				var fields = self._dateFields,
					field = fields[fieldName];

				if (field) {
					field.addEventListener("click", setActiveField.bind(null, self, field), false);
				}

				return field;
			}

			/**
			 *
			 * @param {ns.widget.wearable.Datetimepicker} self
			 * @param {Event} event
			 */
			function handleWheelButtons(self, event) {
				var button = event.target,
					buttonClassList = button.classList,
					direction = 1,
					activeField = self.activeField,
					currentDate = self.currentDate,
					newMonth,
					newYear,
					nextLastDay;

				// Default direction is adding change it only when minus is pressed
				if (buttonClassList.contains(classes.uiDatetimeWheelMinus)) {
					direction = -1;
					// Everything else than minus / plus button should be ignored
				} else if (!buttonClassList.contains(classes.uiDatetimeWheelPlus)) {
					return;
				}

				switch (activeField.dataset.fieldName) {
					case "hour":
						currentDate.setHours((currentDate.getHours() + direction));
						break;
					case "min":
						currentDate.setMinutes((currentDate.getMinutes() + direction));
						break;
					case "day":
						// No need to add modulo as Date object handles 0 as last day of month before
						// and 32nd day in 31 day long month as 1st day of next month
						currentDate.setDate((currentDate.getDate() + direction));
						break;
					case "month":
						// Jumping from Jan 31 to Feb causes date change to March
						// thats why we set for every change day to last day in month
						// year jumps are safe here as Dec and Jan are same length
						newMonth = currentDate.getMonth() + direction;
						nextLastDay = maxDayInMonth(newMonth % 12, currentDate.getFullYear());

						if (currentDate.getDate() > nextLastDay) {
							currentDate.setDate(nextLastDay);
						}
						currentDate.setMonth(newMonth);
						break;
					case "year":
						// Jumping from leap year back to non-leap year causes date change to March
						// thats why we set the date to Feb 28th
						newYear = currentDate.getFullYear() + direction;
						nextLastDay = maxDayInMonth(currentDate.getMonth(), newYear);

						if (currentDate.getDate() > nextLastDay) {
							currentDate.setDate(nextLastDay);
						}
						currentDate.setFullYear(newYear);
						break;
				}

				self._setDateFields(currentDate);
			}

			function handlePeriodButtons(self, event) {
				var button = event.target,
					buttonClassList = button.classList,
					currentDate = self.currentDate,
					currentHours = currentDate.getHours(),
					isMorning = currentHours < 12;

				// Change only when needed
				if (buttonClassList.contains(classes.uiPeriodAm) && !isMorning) {
					currentDate.setHours(currentHours - 12);
				}

				if (buttonClassList.contains(classes.uiPeriodPm) && isMorning) {
					currentDate.setHours(currentHours + 12);
				}

				self._setDateFields(currentDate);
			}

			pickerPrototype._findFields = function (/* field1, field2, ... */) {
				var self = this,
					fields = self._dateFields,
					fieldsContainer = self.fieldsContainer,
					passedFields = slice.call(arguments);

				passedFields.forEach(function (fieldName) {
					var field = fieldsContainer.querySelector("." + classes.prefixUiDatefield + fieldName);

					if (field) {
						field.dataset.fieldName = fieldName;
						field._controls = self._chooseControls(fieldName);
						fields[fieldName] = field;
					}
				});
			};

			pickerPrototype._chooseControls = function (fieldName) {
				var self = this;

				if (fieldName === "period") {
					return self.periodControls;
				} else {
					return self.wheelControls;
				}
			};

			pickerPrototype._build = function (element) {
				var self = this,
					currentDate,
					input,
					inputValue,
					fieldsContainer = element.querySelector("." + classes.uiDatetime),
					bottomControls = element.querySelector("." + classes.uiDatetimeBtns),
					periodControls = element.querySelector("." + classes.uiDatetimePeriods),
					wheelControls = element.querySelector("." + classes.uiDatetimeWheel),
					type = "date";

				if (fieldsContainer) {
					self.fieldsContainer = fieldsContainer;
					self.periodControls = periodControls;
					self.bottomControls = bottomControls;
					self.wheelControls = wheelControls;

					// Declare fields holders
					self._dateFields = {};

					self._findFields("hour", "min", "period", "day", "month", "year");

					// Declare default (empty) property for active field
					self.activeField = null;
					self.activeFieldType = null;
					self.input = null;

					// Detect picker type (default is "date")
					if (element.classList.contains(classes.uiTimePicker)) {
						type = "time";
						self._type = type;
					}

					// Find all common elements
					input = element.querySelector("input[type='" + type + "']");
					// must create input element it it doesn't exists
					if (input) {
						// @TODO parse input depending on date format
						inputValue = input.getAttribute("value");

						if (isNaN(Date.parse(inputValue))) {
							currentDate = new Date();
						} else {
							currentDate = new Date(inputValue);
						}
					} else {
						currentDate = new Date();

						input = document.createElement("input");
						input.type = type;

						input.setAttribute("value", currentDate.toISOString());

						fieldsContainer.appendChild(input);
					}

					self._input = input;
					self.currentDate = currentDate;

					return element;
				}

				return false;
			};

			pickerPrototype._init = function (/* element */) {
				var self = this,
					fields = self._dateFields,
					options = self.options,
					defaultField = options.defaultField;

				self._setDateFields(self.currentDate);

				// Activate default field if defined
				if (defaultField && fields[defaultField]) {
					setActiveField(self, fields[defaultField]);
				} else {
					// hours and days are part of different pickers
					// so it's safe to check and activate fields without if statements
					if (fields.hour) {
						setActiveField(self, fields.hour);
					}
					if (fields.day) {
						setActiveField(self, fields.day);
					}
				}
			};

			pickerPrototype._bindEvents = function () {
				var self = this,
					options = self.options,
					bottomControlButtons = {},
					fields = self._dateFields,
					bottomControls = self.bottomControls,
					periodControls = self.periodControls,
					wheelControls = self.wheelControls;

				if (self._type === "time") {
					bindField(self, "hour");
					bindField(self, "min");
					bindField(self, "period");

					if (fields.period) {
						dayHours = 12;
					}
				} else {
					bindField(self, "day");
					bindField(self, "month");
					bindField(self, "year");
				}

				wheelControls.addEventListener("click", handleWheelButtons.bind(null, self), false);
				if (fields.period && periodControls) {
					periodControls.addEventListener("click", handlePeriodButtons.bind(null, self), false);
				}

				// Event handlers for bottom buttons
				if (bottomControls && (typeof options.leftBtnHandler === "function" || typeof options.rightBtnHandler === "function")) {
					bottomControlButtons.left = bottomControls.querySelector("." + classes.uiBtnLeft);
					bottomControlButtons.right = bottomControls.querySelector("." + classes.uiBtnRight);

					if (bottomControlButtons.left && typeof options.leftBtnHandler) {
						bottomControlButtons.left.addEventListener("click", options.leftBtnHandler.bind(bottomControlButtons.left, self), false);
					}

					if (bottomControlButtons.right && typeof options.rightBtnHandler) {
						bottomControlButtons.right.addEventListener("click", options.rightBtnHandler.bind(bottomControlButtons.right, self), false);
					}
				}
			};

			/**
			 * @method getDate
			 * @param {boolean} returnString
			 * @return {Date|string}
			 * @member ns.widget.wearable.Datetimepicker
			 */
			pickerPrototype.getDate = function (returnString) {
				var currentDate = this.currentDate;

				if (!returnString) {
					return currentDate;
				}

				return currentDate.toDateString();
			};

			pickerPrototype.getTime = function () {
				return this.currentDate.toTimeString();
			};

			pickerPrototype._setDateFields = function (newDate) {
				var self = this,
					fields = self._dateFields,
					periodControls = self.periodControls,
					selectedControl,
					period;

				if (self._type === "time") {
					// Time fields
					fields.hour.textContent = makeTwoDigits(newDate.getHours() % dayHours);
					fields.min.textContent = makeTwoDigits(newDate.getMinutes());

					if (fields.period && periodControls) {
						period = newDate.getHours() < 12 ? "AM" : "PM";
						fields.period.textContent = period;

						selectedControl = periodControls.querySelector("." + classes.uiSelected);
						if (selectedControl) {
							selectedControl.classList.remove(classes.uiSelected);
						}

						selectedControl = periodControls.querySelector("." + classes.prefixUiPeriod + period.toLowerCase());
						if (selectedControl) {
							selectedControl.classList.add(classes.uiSelected);
						}
					}
				} else {
					// Date fields
					fields.day.textContent = makeTwoDigits(newDate.getDate());
					fields.month.textContent = monthsDict[newDate.getMonth()];
					fields.year.textContent = newDate.getFullYear();
				}

				self._input.setAttribute("value", newDate.toISOString());
			};

			/**
			 * @method setDate
			 * @param {Date|string|number} yearOrDate When yearOfDate is an Date instance other parameters are ignore
			 * @param {string|number} month
			 * @param {string|number} day
			 * @member ns.widget.wearable.Datetimepicker
			 */
			pickerPrototype.setDate = function (yearOrDate, month, day) {
				var self = this;

				if (yearOrDate instanceof Date) {
					self.currentDate = yearOrDate;
				} else {
					self.currentDate = new Date(parseInt(yearOrDate, 10), parseInt(month - 1, 10), parseInt(day, 10));
				}

				self._setDateFields(self.currentDate);
			};

			/**
			 * @method setTime
			 * @param {Date|string|number} hourOrDate When hourOfDate is an Date instance other parameters are ignored
			 * @param {string|number} min
			 * @param {string} period AM or PM
			 * @member ns.widget.wearable.Datetimepicker
			 */
			pickerPrototype.setTime = function (hourOrDate, min, period) {
				var self = this,
					newDate = new Date(),
					hour,
					isMorning = period && period.toLowerCase() === "am";

				if (hourOrDate instanceof Date) {
					self.currentDate = hourOrDate;
				} else {
					hour = parseInt(hourOrDate, 10);
					if (isMorning && hour >= 12) {
						hour -= 12;
					}
					newDate.setHours(hour);
					newDate.setMinutes(parseInt(min, 10));

					self.currentDate = newDate;
				}

				self._setDateFields(self.currentDate);
			};

			// definition
			ns.widget.wearable.Datetimepicker = Datetimepicker;
			engine.defineWidget(
				"datetimepicker",
				".ui-date-picker,.ui-time-picker",
				[],
				Datetimepicker,
				"wearable"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return Datetimepicker;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(window.document, ns));
