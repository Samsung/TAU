/*global define, ns */
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
/*
 * @example
 * 1. default
 * <div class="ui-calendar"></div>
 *
 * 2. past selection option
 * <div class="ui-calendar" data-past-selection="true"></div>
 *
 * @since 1.2
 * @class ns.widget.mobile.Calendar
 * @extends ns.widget.BaseWidget
 * @author Dohyung Lim <delight.lim@samsung.com>
 */
(function (document, ns) {
	"use strict";
	//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
	define(
		[
			"../../../core/engine",
			"../../../core/util/DOM/attributes",
			"../../../core/event",
			"../widget"
		],
		function () {
			//>>excludeEnd("tauBuildExclude");
			var utilsObject = ns.util.object,
				engine = ns.engine,
				events = ns.event,
				days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
				fullNameMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],

				classes = {
					PREV_MONTH_DAY: "ui-calendar-prev-month-day",
					NEXT_MONTH_DAY: "ui-calendar-next-month-day",
					CURRENT_MONTH_DAY: "ui-calendar-current-month-day",

					DISABLED: "ui-calendar-disabled",
					ARROW_DISABLED: "ui-calendar-disabled-arrow",
					SELECTION: "ui-calendar-selection",

					CONTROLLER: "ui-calendar-controller",
					ARROW: "ui-calendar-arrow",
					ARROW_RIGHT: "ui-calendar-right-arrow",
					ARROW_LEFT: "ui-calendar-left-arrow",

					ONE_WEEK: "ui-calendar-one-week",
					TOP_SPACE: "ui-calendar-top-space",

					SWITCH_VIEW: "ui-calendar-switch",
					CALENDAR_VIEW: "ui-calendar-view"
				},

				/**
				* Options for widget
				* @property {Object} options
				* @property {boolean} [options.pastSelection=true]
				* @member ns.widget.mobile.Calendar
				*/
				defaultOptions = {
					pastSelection: false
				},

				Calendar = function () {
					var self = this;

					self.options = utilsObject.merge({}, defaultOptions);

					self._dateData = new Date();
					self._todayYear = self._dateData.getFullYear();
					self._todayMonth = self._dateData.getMonth() + 1;
					self._defaultToday = self._dateData.getUTCDate();
					self._selectDay = null;
					self._activeMonth = null;
					self._fixMonth = null;
					self._loadTodayFlag = true;
					self._ui = {
						switch: null,
						leftArrow: null,
						rightArrow: null,
						calendarView: null
					};
				},

				BaseWidget = ns.widget.BaseWidget,
				prototype = new BaseWidget();

			Calendar.prototype = prototype;
			Calendar.classes = classes;

			/**
			* Init widget
			* @method _init
			* @param {HTMLElement} element
			* @return {HTMLElement} Returns built element
			* @member ns.widget.mobile.Calendar
			* @protected
			*/
			prototype._init = function (element) {
				var self = this;

				self._ui.calendarView = element.querySelector("." + classes.CALENDAR_VIEW);
				self._ui.switch = element.querySelector("." + classes.SWITCH_VIEW);
				self._ui.leftArrow = element.querySelector("." + classes.ARROW_LEFT);
				self._ui.rightArrow = element.querySelector("." + classes.ARROW_RIGHT);

				if (!self.options.pastSelection) {
					self._ui.leftArrow.classList.add(classes.ARROW_DISABLED);
				}

				if (self._activeMonth === null) {
					self._fixMonth = self._activeMonth = self._todayMonth;
				}

				if (self._selectDay === null) {
					self._selectDay = self._defaultToday;
				}

				self._buildCalendar(self._ui.calendarView);

				return element;
			};

			/**
			* Create and append div element for calendar day
			* @method createDayInRow
			* @param {HTMLElement} row
			* @member ns.widget.mobile.Calendar
			* @private
			*/
			function createDayInRow(row) {
				var cell = row.insertCell();

				cell.insertAdjacentHTML("afterbegin", "<div></div>");
				return cell.firstChild;
			}

			/**
			* Draw a calendar on the table
			* @method _buildCalendar
			* @member ns.widget.mobile.Calendar
			* @protected
			*/
			prototype._buildCalendar = function (calendarElement) {
				var self = this,
					ui = self._ui,
					firstDate = new Date(self._todayYear, self._todayMonth - 1, 0),
					lastDate = new Date(self._todayYear, self._todayMonth, 0),
					day = firstDate.getDay(),
					prevFirstDate = firstDate.getDate(),
					prevLastDate = lastDate.getDate(),
					week = Math.ceil(prevLastDate / 7) + 1,
					leftDays = 7,
					setDays = 1,
					nextMonthDate = 1,
					marginRow = calendarElement.insertRow(),
					idx,
					row,
					div = null;

				marginRow.style.height = "7px";

				for (idx = 1; idx < week + 1; idx++) {
					row = calendarElement.insertRow();

					while (day != 0) { // days of previous month
						day = day - 1;
						leftDays = leftDays - 1;
						div = createDayInRow(row);
						div.classList.add(classes.PREV_MONTH_DAY);
						div.innerHTML = prevFirstDate - day;
						if (self._fixMonth === self._todayMonth && !self.options.pastSelection) {
							div.classList.add(classes.DISABLED);
						}
					}
					while (leftDays != 0) {
						div = createDayInRow(row);
						if (setDays > prevLastDate) { // days of next month.
							div.classList.add(classes.NEXT_MONTH_DAY);
							div.innerHTML = nextMonthDate;
							leftDays = leftDays - 1;
							nextMonthDate = nextMonthDate + 1;
						} else { // current enabled days.
							div.innerHTML = setDays;
							div.classList.add(classes.CURRENT_MONTH_DAY);
							setDays = setDays + 1;
							leftDays = leftDays - 1;

							if (self._defaultToday > parseInt(div.innerHTML, 10)) {
								if (self._fixMonth === self._todayMonth && !self.options.pastSelection) {
									div.classList.add(classes.DISABLED);
								}
							}

							if (self._loadTodayFlag && div.innerHTML === self._defaultToday.toLocaleString()) { // dateData selected.
								div.classList.add(classes.SELECTION);
								self._selectDay = div;
								self._activeMonth = self._todayMonth;
								self._loadTodayFlag = false;
							} else {
								if (self._activeMonth === self._todayMonth && div.innerHTML === self._selectDay.innerHTML) {
									div.classList.add(classes.SELECTION);
									self._selectDay = div;
								}
							}
						}
					}
					leftDays = 7;
				}

				if (!self.options.pastSelection) {
					ui.leftArrow.classList.toggle(classes.DISABLED, self._fixMonth == self._todayMonth);
				}
				ui.switch.innerHTML = fullNameMonth[self._todayMonth - 1] + " " + self._todayYear;
			};

			/**
			* Moving to another month erases the existing calendar
			* @method _deleteCalendar
			* @member ns.widget.mobile.Calendar
			* @protected
			*/
			prototype._deleteCalendar = function (calendarElement) {
				while (calendarElement.rows.length > 2) {
					calendarElement.deleteRow(2);
				}
			};

			/**
			* Click handler
			* @method _onClick
			* @param {Event} event
			* @member ns.widget.mobile.Calendar
			* @protected
			*/
			prototype._onClick = function (event) {
				var self = this,
					ui = self._ui,
					target = event.target,
					targetClassList = target.classList;

				if (!targetClassList.contains(classes.DISABLED)) {
					if (target === ui.rightArrow) {
						self._moveMonth("right");
					} else if (target === ui.leftArrow) {
						self._moveMonth("left");
					} else {
						// Calendar view
						if (target.tagName === "TD") { // if click on TD instead of DIV
							target = target.querySelector("div");
							targetClassList = (target) ? target.classList : null;
						}
						if (targetClassList &&
							!targetClassList.contains(classes.SELECTION) &&
							!targetClassList.contains(classes.DISABLED)) {
							if (targetClassList.contains(classes.PREV_MONTH_DAY)) {
								self._moveMonth("left");
								self._selection(target.innerHTML);
							} else if (targetClassList.contains(classes.NEXT_MONTH_DAY)) {
								self._moveMonth("right");
								self._selection(target.innerHTML);
							} else if (targetClassList.contains(classes.CURRENT_MONTH_DAY)) {
								self._selection(target.innerHTML);
							}
						}
					}
				}
			};

			/**
			* Selecting a date leaves a mark
			* @method _moveMonth
			* @param {string} direction
			* @member ns.widget.mobile.Calendar
			* @protected
			*/
			prototype._moveMonth = function (direction) {
				var self = this,
					calendarView = self._ui.calendarView;

				if (direction === "left") {
					self._todayMonth = self._todayMonth - 1;
					if (self._todayMonth === 0) {
						self._todayMonth = 12;
						self._todayYear = self._todayYear - 1;
					}
				} else {
					self._todayMonth = self._todayMonth + 1;
					if (self._todayMonth === 13) {
						self._todayMonth = 1;
						self._todayYear = self._todayYear + 1;
					}
				}
				self._deleteCalendar(calendarView);
				self._dateData = new Date(self._todayYear, self._todayMonth - 1);
				self._buildCalendar(calendarView);
			};

			/**
			* Selecting a date leaves a mark
			* @method _selection
			* @param {HTMLElement} value
			* @member ns.widget.mobile.Calendar
			* @protected
			*/
			prototype._selection = function (value) {
				var otherMonthDay,
					self = this;

				if (value != undefined) {
					otherMonthDay = self._ui.calendarView.querySelectorAll("div." + classes.CURRENT_MONTH_DAY);
					otherMonthDay.forEach(function (idx) {
						if (idx.innerHTML === value) {
							idx.classList.add(classes.SELECTION);
							self._selectDay.classList.remove(classes.SELECTION);
							self._selectDay = idx;
							self._activeMonth = self._todayMonth;
						}
					})
				}
			};

			prototype._unBindEvents = function (element) {
				events.off(element, "vclick", this, false);
			};

			prototype._bindEvents = function (element) {
				events.on(element, "vclick", this, false);
			};

			prototype.handleEvent = function (event) {
				if (event.type === "vclick") {
					this._onClick(event);
				} else {
					event.preventDefault();
				}
			};

			prototype._setPastSelection = function (element, value) {
				this.options.pastSelection = value;
				return true;
			};

			prototype._refresh = function () {
				var self = this,
					calendarView = self._ui.calendarView;

				self._deleteCalendar(calendarView);
				self._buildCalendar(calendarView);
			};

			prototype._build = function (element) {
				var controllerElement = document.createElement("div"),
					leftArrowElement = document.createElement("div"),
					rightArrowElement = document.createElement("div"),
					viewChangeElement = document.createElement("div"),
					viewTableElement = document.createElement("table"),
					spaceElement = document.createElement("tr"),
					oneWeekElement = document.createElement("tr"),
					monElement = document.createElement("td"),
					tueElement = document.createElement("td"),
					wedElement = document.createElement("td"),
					thuElement = document.createElement("td"),
					friElement = document.createElement("td"),
					satElement = document.createElement("td"),
					sunElement = document.createElement("td");

				// Controller
				controllerElement.classList.add(classes.CONTROLLER);
				leftArrowElement.classList.add(classes.ARROW_LEFT);
				leftArrowElement.classList.add(classes.ARROW);
				rightArrowElement.classList.add(classes.ARROW_RIGHT);
				rightArrowElement.classList.add(classes.ARROW);
				viewChangeElement.classList.add(classes.SWITCH_VIEW);

				controllerElement.appendChild(leftArrowElement);
				controllerElement.appendChild(rightArrowElement);
				controllerElement.appendChild(viewChangeElement);

				// View Container
				viewTableElement.classList.add(classes.CALENDAR_VIEW);
				spaceElement.classList.add(classes.TOP_SPACE);
				oneWeekElement.classList.add(classes.ONE_WEEK);

				monElement.innerHTML = days[0];
				oneWeekElement.appendChild(monElement);
				tueElement.innerHTML = days[1];
				oneWeekElement.appendChild(tueElement);
				wedElement.innerHTML = days[2];
				oneWeekElement.appendChild(wedElement);
				thuElement.innerHTML = days[3];
				oneWeekElement.appendChild(thuElement);
				friElement.innerHTML = days[4];
				oneWeekElement.appendChild(friElement);
				satElement.innerHTML = days[5];
				oneWeekElement.appendChild(satElement);
				sunElement.innerHTML = days[6];
				sunElement.classList.add("ui-sunday");
				oneWeekElement.appendChild(sunElement);

				viewTableElement.appendChild(spaceElement);
				viewTableElement.appendChild(oneWeekElement);

				// append Elements
				element.appendChild(controllerElement);
				element.appendChild(viewTableElement);

				return element;
			};

			prototype._destroy = function () {
				var self = this;

				self.options = null;
				self._unBindEvents(self.element);
			};

			ns.widget.mobile.Calendar = Calendar;
			engine.defineWidget(
				"Calendar",
				".ui-calendar",
				[],
				Calendar,
				"mobile"
			);
			//>>excludeStart("tauBuildExclude", pragmas.tauBuildExclude);
			return ns.widget.mobile.Calendar;
		}
	);
	//>>excludeEnd("tauBuildExclude");
}(document, ns));
